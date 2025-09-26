const express = require('express');
const { google } = require('googleapis');
const path = require('path');

const app = express();

// Setup Google Drive API
const auth = new google.auth.GoogleAuth({
  keyFile: path.join(__dirname, 'credentials.json'),
  scopes: ['https://www.googleapis.com/auth/drive.readonly']
});

const drive = google.drive({ version: 'v3', auth });

app.get('/api/documents', async (req, res) => {
  try {
    const folderId = '1cZYU8w3UdXTQmZUIVEYDp_3Z_4eEZewV';
    
    const response = await drive.files.list({
      q: `'${folderId}' in parents`,
      fields: 'files(id, name, webViewLink, createdTime)'
    });
    
    res.json({
      folder_id: folderId,
      documents: response.data.files
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.listen(3000, () => {
  console.log('API running on http://localhost:3000');
});