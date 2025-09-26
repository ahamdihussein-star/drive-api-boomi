const express = require('express');
const { google } = require('googleapis');

const app = express();

// قراءة credentials من environment variable (Base64)
const credentialsBase64 = process.env.GOOGLE_CREDENTIALS || '';
const credentialsJson = Buffer.from(credentialsBase64, 'base64').toString('utf-8');
const credentials = JSON.parse(credentialsJson);

const auth = new google.auth.GoogleAuth({
  credentials: credentials,
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

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`API running on port ${PORT}`);
});