import {test} from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import vm from 'node:vm';
const code=readFileSync(new URL('../integration/google-apps-script.gs',import.meta.url),'utf8');
function fixture(fail=false){
 const rows=[['header']], lock={tryLock:()=>true,hasLock:()=>true,releaseLock:()=>{}};
 const sheet={getLastRow:()=>rows.length,appendRow:row=>{if(fail)throw Error('write failed');rows.push(row)},getRange:()=>({createTextFinder:id=>({matchEntireCell:()=>({findNext:()=>rows.slice(1).some(r=>r[1]===id)})})})};
 const ctx=vm.createContext({ContentService:{MimeType:{JSON:'json'},createTextOutput:s=>({setMimeType:()=>s})},PropertiesService:{getScriptProperties:()=>({getProperty:()=> 'test'})},LockService:{getScriptLock:()=>lock},SpreadsheetApp:{openById:()=>({getSheetByName:()=>sheet}),flush:()=>{}},Utilities:{formatDate:()=> 'date'}});
 vm.runInContext(code,ctx);
 const send=p=>JSON.parse(ctx.doPost({postData:{contents:JSON.stringify(p)}}));return {rows,send};
}
const base={requestId:'eb7e6d64-c203-41f8-a9a4-ff5ae9c95444',name:'Hasan',phone:'+998901234567',plan:'Master',consent:true,website:'',attribution:{utm_source:'=IMPORTXML("evil")'}};
test('save acknowledges only durable write and deduplicates retries',()=>{
 const {send,rows}=fixture();assert.equal(send(base).ok,true);assert.equal(send(base).ok,true);assert.equal(rows.length,2);assert.equal(rows[1][3],"'+998901234567");assert.equal(rows[1][5],'Gaplashilmagan');
});
test('reject tampered payload and never acknowledge failed persistence',()=>{
 const {send,rows}=fixture();for(const p of [{...base,phone:'+79012345678'},{...base,plan:'VIP'},{...base,consent:false},{...base,website:'spam'},{...base,name:'='}])assert.equal(send(p).ok,false);
 assert.equal(rows.length,1);assert.equal(fixture(true).send(base).ok,false);
});
