const express = require('express');
const cors = require('cors');
const app = express();

app.use(cors({
  origin: ['https://dialogue-comms.netlify.app', 'http://localhost:3000'],
  methods: ['GET','POST','PATCH','PUT','DELETE','OPTIONS'],
  allowedHeaders: ['Content-Type','Authorization','apikey','Prefer','Accept']
}));
app.use(express.json({limit:'10mb'}));

const SUPA_URL = 'https://qtncwxvoydvbgknxmojf.supabase.co';
const SUPA_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InF0bmN3eHZveWR2Ymdrbnhtb2pmIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzYyODk5MzQsImV4cCI6MjA5MTg2NTkzNH0.oD6oTtvY808QS0VQxbVh0UCg0FPNPIFJbzPAp1WtmZA';

app.get('/test', (req, res) => res.json({status:'proxy running'}));

app.post('/v1/messages', async (req, res) => {
  try {
    const r = await fetch('https://api.anthropic.com/v1/messages', {
      method:'POST',
      headers:{'Content-Type':'application/json','x-api-key':process.env.ANTHROPIC_API_KEY,'anthropic-version':'2023-06-01'},
      body: JSON.stringify(req.body)
    });
    res.setHeader('Content-Type','application/json').send(await r.text());
  } catch(e) { res.status(500).json({error:e.message}); }
});

app.all('/db/*', async (req, res) => {
  try {
    const path = req.path.replace('/db','');
    const qs = req.url.includes('?') ? req.url.substring(req.url.indexOf('?')) : '';
    const url = SUPA_URL + '/rest/v1' + path + qs;
    const headers = {'apikey':SUPA_KEY,'Authorization':'Bearer '+SUPA_KEY,'Content-Type':'application/json'};
    if(req.headers['prefer']) headers['Prefer'] = req.headers['prefer'];
    if(req.headers['accept']) headers['Accept'] = req.headers['accept'];
    const opts = {method:req.method, headers};
    if(req.method!=='GET' && req.body && Object.keys(req.body).length>0) opts.body = JSON.stringify(req.body);
    const r = await fetch(url, opts);
    res.status(r.status).setHeader('Content-Type','application/json').send(await r.text());
  } catch(e) { res.status(500).json({error:e.message}); }
});

app.listen(process.env.PORT || 3000, () => console.log('Proxy running'));
