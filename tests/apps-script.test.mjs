import {test} from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import vm from 'node:vm';
const code=readFileSync(new URL('../integration/google-apps-script.gs',import.meta.url),'utf8');
function fixture(fail=false, options={}){
 const rows=[['header']], cache=new Map(), metrics={opens:0,lastRow:0,flushes:0,releases:0};
 let held=false;
 const lock={tryLock:ms=>{assert.equal(ms,5000);return held=!options.busy;},hasLock:()=>held,releaseLock:()=>{held=false;metrics.releases++;}};
 const sheet={getLastRow:()=>{metrics.lastRow++;return rows.length;},appendRow:row=>{if(fail)throw Error('write failed');rows.push(row)},getRange:()=>({createTextFinder:id=>({matchEntireCell:()=>({findNext:()=>rows.slice(1).some(r=>r[1]===id)})})})};
 const ctx=vm.createContext({console:{error:()=>{}},ContentService:{MimeType:{JSON:'json'},createTextOutput:s=>({setMimeType:()=>s})},PropertiesService:{getScriptProperties:()=>({getProperty:()=> 'test'})},LockService:{getScriptLock:()=>lock},CacheService:{getScriptCache:()=>({get:key=>{if(options.cacheFailure)throw Error();return cache.get(key);},put:(key,value)=>{if(options.cacheFailure)throw Error();assert.ok(metrics.flushes>0);cache.set(key,value);}})},SpreadsheetApp:{openById:()=>{metrics.opens++;return {getSheetByName:()=>sheet};},flush:()=>{metrics.flushes++;if(options.flushFailure)throw Error('flush failed');}},Utilities:{formatDate:()=> 'date'}});
 vm.runInContext(code,ctx);
 const send=p=>JSON.parse(ctx.doPost({postData:{contents:JSON.stringify(p)}}));return {rows,send,cache,metrics,options};
}
const base={requestId:'eb7e6d64-c203-41f8-a9a4-ff5ae9c95444',name:'Hasan',phone:'+998901234567',plan:'Master',consent:true,website:'',attribution:{utm_source:'=IMPORTXML("evil")'}};
test('save acknowledges only durable write and deduplicates retries',()=>{
 const {send,rows}=fixture();assert.equal(send(base).ok,true);assert.equal(send(base).ok,true);assert.equal(rows.length,2);assert.equal(rows[1][3],"'+998901234567");assert.equal(rows[1][5],'Gaplashilmagan');
});
test('reject tampered payload and never acknowledge failed persistence',()=>{
 const {send,rows}=fixture();for(const p of [{...base,phone:'+79012345678'},{...base,plan:'VIP'},{...base,consent:false},{...base,website:'spam'},{...base,name:'='}])assert.equal(send(p).ok,false);
 assert.equal(rows.length,1);assert.equal(fixture(true).send(base).ok,false);
});

test('cached retry avoids Sheets; cache eviction falls back to permanent IDs',()=>{
 const {send,rows,cache,metrics}=fixture();
 send(base);assert.equal(metrics.lastRow,1);assert.equal(metrics.opens,1);
 send(base);assert.equal(metrics.opens,1,'cached retry must not open spreadsheet');
 cache.clear();send(base);assert.equal(rows.length,2);assert.equal(metrics.lastRow,2);
 assert.equal(metrics.releases,2);
});
test('cache failure cannot lose a write or defeat deduplication',()=>{
 const {send,rows}=fixture(false,{cacheFailure:true});
 assert.equal(send(base).ok,true);assert.equal(send(base).ok,true);assert.equal(rows.length,2);
});
test('busy lock returns promptly without writing or releasing another request lock',()=>{
 const {send,rows,metrics}=fixture(false,{busy:true});
 assert.equal(send(base).error,'busy');assert.equal(rows.length,1);assert.equal(metrics.releases,0);
});
test('failed flush is not cached; retry checks permanent ID instead of appending again',()=>{
 const {send,rows,cache,metrics,options}=fixture(false,{flushFailure:true});
 assert.equal(send(base).ok,false);assert.equal(cache.size,0);assert.equal(metrics.releases,1);
 options.flushFailure=false;
 assert.equal(send(base).ok,true);assert.equal(rows.length,2);
});
