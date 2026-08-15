const express = require('express');
const cors = require('cors');
const app = express();

const ALLOWED_ORIGINS = [
  'https://dialogue-comms.netlify.app',
  'http://localhost:3000',
  'http://localhost:8080',
  'http://127.0.0.1:5500'
];

const corsOptions = {
  origin: function(origin, callback) {
    if(!origin) return callback(null, true);
    if(ALLOWED_ORIGINS.indexOf(origin) !== -1) return callback(null, true);
    return callback(null, true);
  },
  methods: ['GET','POST','PATCH','PUT','DELETE','OPTIONS'],
  allowedHeaders: ['Content-Type','Authorization','apikey','Prefer','Accept','X-Client-Info'],
  credentials: true,
  optionsSuccessStatus: 200
};

app.options('*', cors(corsOptions));
app.use(cors(corsOptions));
app.use(express.json({limit:'10mb'}));

const SUPA_URL = 'https://qtncwxvoydvbgknxmojf.supabase.co';
const SUPA_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InF0bmN3eHZveWR2Ymdrbnhtb2pmIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzYyODk5MzQsImV4cCI6MjA5MTg2NTkzNH0.oD6oTtvY808QS
