const express = require('express');
const cors = require('cors');
const app = express();

app.use(cors());
app.use(express.json());

app.get('/test', (req, res) => {
  res.json({status:'proxy running',hasKey:!!process.env.ANTHROPIC_API_KEY,keyStart:process.env.ANTHROPIC_API_KEY?process.env.ANTHROPIC_API_KEY.substring(0,10):'none'});
});

app.get('/v1/models', async (req, res) => {
  try {
    const response = await fetch('https://api.anthropic.com/v1/models', {
      method: 'GET',
      headers: {
        'x-api-key': process.env.ANTHROPIC_API_KEY,
        'anthropic-version': '2023-06-01'
      }
    });
    const text = await response.text();
    res.setHeader('Content-Type', 'application/json');
    res.send(text);
  } catch(e) {
    res.status(500).json({error: e.message});
  }
});

app.post('/v1/messages', async (req, res) => {
  try {
    const response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': process.env.ANTHROPIC_API_KEY,
        'anthropic-version': '2023-06-01'
      },
      body: JSON.stringify(req.body)
    });
    const text = await response.text();
    res.setHeader('Content-Type', 'application/json');
    res.send(text);
  } catch(e) {
    res.status(500).json({error: e.message});
  }
});

app.listen(process.env.PORT || 3000, () => console.log('Proxy running'));
