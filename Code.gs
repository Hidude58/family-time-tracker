const SHEET='Shifts';
const HEAD=['ID','Worker','Clock In','Clock Out','Hours','Note','Created At','Updated At','Edit History'];
function setup(){const ss=SpreadsheetApp.getActive();let sh=ss.getSheetByName(SHEET)||ss.insertSheet(SHEET);if(sh.getLastRow()===0){sh.appendRow(HEAD);sh.setFrozenRows(1);} }
function doGet(e){return respond(handle(e.parameter||{}));}
function doPost(e){let p={};try{p=JSON.parse(e.postData.contents);}catch(err){return respond({ok:false,error:'Invalid request'});}return respond(handle(p));}
function respond(obj){return ContentService.createTextOutput(JSON.stringify(obj)).setMimeType(ContentService.MimeType.JSON);}
function handle(p){try{
const props=PropertiesService.getScriptProperties();const code=String(p.code||'');const viewer=props.getProperty('VIEW_CODE');const editor=props.getProperty('EDIT_CODE');if(!viewer||!editor)return {ok:false,error:'Set VIEW_CODE and EDIT_CODE in Script Properties'};
const canEdit=code===editor; if(!canEdit&&code!==viewer)return {ok:false,error:'Invalid access code'};
setup();const sh=SpreadsheetApp.getActive().getSheetByName(SHEET);const rows=sh.getDataRange().getValues();const data=rows.slice(1).filter(r=>r[0]).map(r=>({id:String(r[0]),worker:String(r[1]),start:iso(r[2]),end:iso(r[3]),hours:Number(r[4])||0,note:String(r[5]||''),created:iso(r[6]),updated:iso(r[7]),history:String(r[8]||'')}));
const action=String(p.action||'list');if(action==='list')return {ok:true,canEdit,rows:data};if(!canEdit)return {ok:false,error:'Read-only access'};
const worker=String(p.worker||'').trim();if(!['Kevin','Isabel'].includes(worker))return {ok:false,error:'Select a worker'};
const now=new Date();const active=data.find(r=>r.worker===worker&&!r.end);
if(action==='clockin'){if(active)return {ok:false,error:'Already clocked in'};sh.appendRow([Utilities.getUuid(),worker,now,'',0,String(p.note||'').slice(0,250),now,now,'Clocked in '+now.toISOString()]);return {ok:true};}
if(action==='clockout'){if(!active)return {ok:false,error:'No open shift'};const idx=rows.findIndex(r=>String(r[0])===active.id)+1;const start=new Date(active.start);const hrs=Math.max(0,(now-start)/3600000);sh.getRange(idx,4,1,6).setValues([[now,hrs,active.note,new Date(active.created),now,active.history+'\nClocked out '+now.toISOString()]]);return {ok:true};}
if(action==='manual'){const start=new Date(p.start),end=new Date(p.end);if(!isFinite(start)||!isFinite(end)||end<=start||end-start>48*3600000)return {ok:false,error:'Invalid times (maximum 48 hours)'};sh.appendRow([Utilities.getUuid(),worker,start,end,(end-start)/3600000,String(p.note||'').slice(0,250),now,now,'Manual entry '+now.toISOString()]);return {ok:true};}
return {ok:false,error:'Unknown action'};
}catch(err){return {ok:false,error:String(err.message||err)};}}
function iso(v){if(!v)return '';const d=new Date(v);return isFinite(d)?d.toISOString():'';}
