const fs=require('fs');
const html=fs.readFileSync('D:/Download/kids-learning-app-2.html','utf8');
const s=html.indexOf('var ENG = {'), e=html.indexOf('var BANK =');
const code=html.slice(s,e)+';this.out={ENG,MATH,SCI};';
const ctx={};require('vm').runInNewContext(code,ctx);
const o=ctx.out; let n=0;
for(const k of ['ENG','MATH','SCI']) for(const y in o[k]){ n+=o[k][y].length; if(o[k][y].length!==12) console.log('BAD',k,y,o[k][y].length); o[k][y].forEach(q=>{ if(q.length!==6||!q.slice(1,5).every(Boolean)||new Set(q.slice(1,5)).size!==4) console.log('Q?',q);});}
console.log('total',n);
const ts='// Format: [question, correctAnswer, wrong1, wrong2, wrong3, emoji]\nexport type RawQ = [string, string, string, string, string, string];\nexport type Bank = Record<number, RawQ[]>;\n'+
['ENG','MATH','SCI'].map(k=>`export const ${k}: Bank = ${JSON.stringify(o[k],null,1)};\n`).join('\n');
fs.writeFileSync('src/data/questions.ts',ts);
