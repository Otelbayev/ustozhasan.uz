/* Paste into the lead spreadsheet's Extensions > Apps Script.
 * Set Script Property SPREADSHEET_ID to the spreadsheet ID.
 * Run setup() once, then Deploy > New deployment > Web app:
 * Execute as: Me. Who has access: Anyone.
 * Put the /exec URL in dist/config.js. Never put Google credentials in HTML.
 */
const HEADERS = ['Sana (Toshkent)', 'Ariza ID', 'Ism', 'Telefon', 'Tarif', 'UTM source', 'UTM medium', 'UTM campaign', 'UTM content', 'UTM term', 'FB click ID', 'Rozilik'];
function setup() {
  const ss = SpreadsheetApp.openById('1IqBeYv1DfFbwo6FUNIuY7hJYx5zdfO_DW-WD1lSI0eA');
  if (!ss) throw new Error('Open Apps Script from your Google Sheet.');
  PropertiesService.getScriptProperties().setProperty('SPREADSHEET_ID', ss.getId());
  const sheet = ss.getSheetByName('Leadlar') || ss.insertSheet('Leadlar');
  if (sheet.getLastRow() === 0) sheet.appendRow(HEADERS);
  sheet.setFrozenRows(1);
  sheet.getRange(1,1,1,HEADERS.length).setFontWeight('bold').setBackground('#24351e').setFontColor('#ffffff');
  sheet.getRange('D:D').setNumberFormat('@');
}
function json_(data) { return ContentService.createTextOutput(JSON.stringify(data)).setMimeType(ContentService.MimeType.JSON); }
function safe_(value, max) {
  const text = String(value || '').replace(/[\u0000-\u001f\u007f]/g,' ').slice(0,max || 250);
  return /^[\s]*[=+@-]/.test(text) ? "'" + text : text;
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
    lock = LockService.getScriptLock();
    if (!lock.tryLock(20000)) return json_({ok:false,error:'busy'});
    const ss = SpreadsheetApp.openById(id);
    const sheet = ss.getSheetByName('Leadlar');
    if (!sheet || sheet.getLastRow() === 0) return json_({ok:false,error:'run_setup'});
    // Permanent request IDs make retries safe even after a lost network response.
    if (sheet.getLastRow() > 1) {
      const match = sheet.getRange(2,2,sheet.getLastRow()-1,1).createTextFinder(p.requestId).matchEntireCell(true).findNext();
      if (match) return json_({ok:true,requestId:p.requestId});
    }
    const a = p.attribution && typeof p.attribution === 'object' ? p.attribution : {};
    const row = [Utilities.formatDate(new Date(),'Asia/Tashkent','yyyy-MM-dd HH:mm:ss'),p.requestId,safe_(name,80),"'"+p.phone,p.plan,...['utm_source','utm_medium','utm_campaign','utm_content','utm_term','fbclid'].map(k=>safe_(a[k],250)),'Ha'];
    sheet.appendRow(row);
    SpreadsheetApp.flush();
    return json_({ok:true,requestId:p.requestId});
  } catch (error) {
    // Do not leak spreadsheet identifiers, lead data, or Google error details.
    return json_({ok:false,error:'save_failed'});
  } finally { if (lock && lock.hasLock()) lock.releaseLock(); }
}
