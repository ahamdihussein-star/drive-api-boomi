const express = require('express');
const admin = require('firebase-admin');

const app = express();

// Initialize Firebase Admin
const credentialsBase64 = process.env.GOOGLE_CREDENTIALS || '';
const credentialsJson = Buffer.from(credentialsBase64, 'base64').toString('utf-8');
const credentials = JSON.parse(credentialsJson);

admin.initializeApp({
  credential: admin.credential.cert(credentials),
  storageBucket: 'boomi-demo-2f793.firebasestorage.app'
});

const bucket = admin.storage().bucket();

app.get('/api/documents', async (req, res) => {
  try {
    const [files] = await bucket.getFiles();
    
    const documents = await Promise.all(files.map(async file => {
      const [metadata] = await file.getMetadata();
      return {
        name: file.name,
        size: (metadata.size / 1024).toFixed(2) + ' KB',
        type: metadata.contentType,
        created: metadata.timeCreated,
        url: `https://firebasestorage.googleapis.com/v0/b/boomi-demo-2f793.firebasestorage.app/o/${encodeURIComponent(file.name)}?alt=media`
      };
    }));
    
    res.json({
      status: 'success',
      bucket: 'boomi-demo-2f793.firebasestorage.app',
      count: documents.length,
      documents: documents
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`API running on port ${PORT}`);
});