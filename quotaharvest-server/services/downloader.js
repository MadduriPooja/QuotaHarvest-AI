const fs = require('fs');
const path = require('path');
const axios = require('axios');

async function downloadFile(fileUrl, baseTitle) {
  const downloadsDir = path.join(__dirname, '..', 'downloads');
  if (!fs.existsSync(downloadsDir)) {
    fs.mkdirSync(downloadsDir, { recursive: true });
  }

  // 1. Fetch the file as a stream
  const response = await axios({
    method: 'GET',
    url: fileUrl,
    responseType: 'stream'
  });

  // 2. Detect the extension from the URL (e.g. sample.pdf -> .pdf)
  let ext = path.extname(new URL(fileUrl).pathname);

  // 3. Fallback: If URL doesn't have an extension, detect from Content-Type header
  if (!ext || ext.length > 5) {
    const contentType = response.headers['content-type'] || '';
    if (contentType.includes('pdf')) ext = '.pdf';
    else if (contentType.includes('jpeg') || contentType.includes('jpg')) ext = '.jpg';
    else if (contentType.includes('png')) ext = '.png';
    else if (contentType.includes('zip')) ext = '.zip';
    else if (contentType.includes('mp4')) ext = '.mp4';
    else if (contentType.includes('json')) ext = '.json';
    else if (contentType.includes('text/plain')) ext = '.txt';
    else ext = '.bin';
  }

  // Clean the title and append the proper extension
  const sanitizedTitle = baseTitle.replace(/[^a-zA-Z0-9_-]/g, '_');
  const finalFileName = `${Date.now()}_${sanitizedTitle}${ext}`;
  const filePath = path.join(downloadsDir, finalFileName);

  return new Promise((resolve, reject) => {
    const writer = fs.createWriteStream(filePath);
    response.data.pipe(writer);
    writer.on('finish', () => resolve(filePath));
    writer.on('error', (err) => reject(err));
  });
}

module.exports = { downloadFile };