/* Paste into the lead spreadsheet's Extensions > Apps Script.
 * Set Script Property SPREADSHEET_ID to the spreadsheet ID.
 * Run setup() once, then Deploy > New deployment > Web app:
 * Execute as: Me. Who has access: Anyone.
 * Put the /exec URL in dist/config.js. Never put Google credentials in HTML.
 */
const HEADERS = ['Sana (Toshkent)', 'Ariza ID', 'Ism', 'Telefon', 'Tarif', 'Suhbat statusi'];
function setup() {
  const ss = SpreadsheetApp.openById('1IqBeYv1DfFbwo6FUNIuY7hJYx5zdfO_DW-WD1lSI0eA');
  if (!ss) throw new Error('Open Apps Script from your Google Sheet.');
  PropertiesService.getScriptProperties().setProperty('SPREADSHEET_ID', ss.getId());
  const sheet = ss.getSheetByName('Leadlar') || ss.insertSheet('Leadlar');
  if (sheet.getMaxColumns() > HEADERS.length) sheet.deleteColumns(HEADERS.length + 1, sheet.getMaxColumns() - HEADERS.length);
  sheet.getRange(1, 1, 1, HEADERS.length).setValues([HEADERS]);
  sheet.setFrozenRows(1);
  sheet.getRange(1,1,1,HEADERS.length).setFontWeight('bold').setBackground('#24351e').setFontColor('#ffffff');
  sheet.getRange('D:D').setNumberFormat('@');
  if (sheet.getLastRow() > 1) {
    const statuses = sheet.getRange(2, 6, sheet.getLastRow() - 1, 1);
    statuses.setValues(statuses.getValues().map(row => [row[0] || 'Gaplashilmagan']));
  }
  const validation = SpreadsheetApp.newDataValidation().requireValueInList(['Gaplashilmagan', 'Gaplashilgan'], true).setAllowInvalid(false).build();
  sheet.getRange('F2:F').setDataValidation(validation);
  const green = SpreadsheetApp.newConditionalFormatRule().whenTextEqualTo('Gaplashilgan').setBackground('#b7e1cd').setFontColor('#146c43').setRanges([sheet.getRange('F2:F')]).build();
  sheet.setConditionalFormatRules([green]);
}
function json_(data) { return ContentService.createTextOutput(JSON.stringify(data)).setMimeType(ContentService.MimeType.JSON); }
function safe_(value, max) {
  const text = String(value || '').replace(/[\u0000-\u001f\u007f]/g,' ').slice(0,max || 250);
  return /^[\s]*[=+@-]/.test(text) ? "'" + text : text;
}
// Cache is only a shortcut after a confirmed write. Column B remains the source of truth.
function cachedLead_(key) {
  try { return CacheService.getScriptCache().get(key) === 'saved'; } catch (_) { return false; }
}
function cacheLead_(key) {
  try { CacheService.getScriptCache().put(key, 'saved', 21600); } catch (_) {}
}
function doPost(e) {
  let lock;
  try {
    if (!e || !e.postData || e.postData.contents.length > 6000) return json_({ok:false,error:'invalid_request'});
    const p = JSON.parse(e.postData.contents);
    if (p.website || p.consent !== true || !/^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(p.requestId || '')) return json_({ok:false,error:'invalid_request'});
    const name = String(p.name || '').trim().replace(/\s+/g,' ');
    if ((name.match(/\p{L}/gu) || []).length < 2 || name.length < 2 || name.length > 80 || !/^[\p{L}\p{M}\s’‘'ʻʼ.-]+$/u.test(name) || !/^\+998[3-9]\d{8}$/.test(p.phone || '') || !['Maslahat','Standart','Master'].includes(p.plan)) return json_({ok:false,error:'validation'});
    const id = PropertiesService.getScriptProperties().getProperty('SPREADSHEET_ID');
    if (!id) return json_({ok:false,error:'not_configured'});
    const cacheKey = 'lead:' + id + ':' + p.requestId;
    if (cachedLead_(cacheKey)) return json_({ok:true,requestId:p.requestId});
    // Opening the spreadsheet need not hold the global write lock.
    const sheet = SpreadsheetApp.openById(id).getSheetByName('Leadlar');
    if (!sheet) return json_({ok:false,error:'run_setup'});
    lock = LockService.getScriptLock();
    if (!lock.tryLock(5000)) return json_({ok:false,error:'busy'});
    if (cachedLead_(cacheKey)) return json_({ok:true,requestId:p.requestId});
    const lastRow = sheet.getLastRow();
    if (lastRow === 0) return json_({ok:false,error:'run_setup'});
    // Permanent request IDs make retries safe even after a lost network response.
    if (lastRow > 1) {
      const match = sheet.getRange(2,2,lastRow-1,1).createTextFinder(p.requestId).matchEntireCell(true).findNext();
      if (match) {
        cacheLead_(cacheKey);
        return json_({ok:true,requestId:p.requestId});
      }
    }
    const row = [Utilities.formatDate(new Date(),'Asia/Tashkent','yyyy-MM-dd HH:mm:ss'),p.requestId,safe_(name,80),"'"+p.phone,p.plan,'Gaplashilmagan'];
    sheet.appendRow(row);
    SpreadsheetApp.flush();
    cacheLead_(cacheKey);
    return json_({ok:true,requestId:p.requestId});
  } catch (error) {
    // Do not leak spreadsheet identifiers, lead data, or Google error details.
    console.error('[Ustoz Hasan] doPost: save_failed; spreadsheet write was not acknowledged.');
    return json_({ok:false,error:'save_failed'});
  } finally { if (lock && lock.hasLock()) lock.releaseLock(); }
}
