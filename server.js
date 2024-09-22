const express = require('express');
const { google } = require('googleapis');
require('dotenv').config();

const app = express();
app.use(express.json());

const oauth2Client = new google.auth.OAuth2(
  process.env.CLIENT_ID,
  process.env.CLIENT_SECRET,
  process.env.REDIRECT_URI
);

oauth2Client.setCredentials({ refresh_token: process.env.REFRESH_TOKEN });

const sheets = google.sheets({ version: 'v4', auth: oauth2Client });
const drive = google.drive({ version: 'v3', auth: oauth2Client });

app.get('/products', async (req, res) => {
  const spreadsheetId = 'your_spreadsheet_id';
  const range = 'Products!A1:D'; // Adjust range based on your sheet structure

  try {
    const response = await sheets.spreadsheets.values.get({
      spreadsheetId,
      range,
    });
    const rows = response.data.values;
    if (rows.length) {
      res.status(200).json({ products: rows });
    } else {
      res.status(200).json({ message: 'No products found' });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});
app.post('/add-product', async (req, res) => {
  const { name, price, contact } = req.body;
  const spreadsheetId = 'your_spreadsheet_id';
  const range = 'Products!A:D';

  try {
    await sheets.spreadsheets.values.append({
      spreadsheetId,
      range,
      valueInputOption: 'RAW',
      resource: {
        values: [[name, price, contact]],
      },
    });
    res.status(200).json({ message: 'Product added successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});
const fs = require('fs');

app.post('/upload-image', async (req, res) => {
  const filePath = 'path_to_image_file';

  try {
    const fileMetadata = {
      name: 'product_image.jpg',
    };

    const media = {
      mimeType: 'image/jpeg',
      body: fs.createReadStream(filePath),
    };

    const response = await drive.files.create({
      resource: fileMetadata,
      media: media,
      fields: 'id',
    });

    res.status(200).json({ fileId: response.data.id });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});
app.get('/images/:fileId', async (req, res) => {
  const fileId = req.params.fileId;

  try {
    const file = await drive.files.get({
      fileId,
      fields: 'webViewLink, webContentLink',
    });
    res.status(200).json({ url: file.data.webContentLink });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});
