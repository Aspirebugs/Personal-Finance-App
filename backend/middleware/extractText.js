import fs from 'fs';
import tesseract from 'tesseract.js';
import PDFParser from 'pdf2json';

function parsePdf(filePath) {
  return new Promise((resolve, reject) => {
    const pdfParser = new PDFParser();

    pdfParser.on('pdfParser_dataError', err => reject(err.parserError));
    pdfParser.on('pdfParser_dataReady', pdfData => {
      const text = pdfData?.formImage?.Pages?.map(page =>
        page.Texts.map(t => decodeURIComponent(t.R[0].T)).join(' ')
      ).join('\n');
      resolve(text);
    });

    pdfParser.loadPDF(filePath);
  });
}

export async function extractText(req, res, next) {
  if (!req.file) {
    return res.status(400).json({ error: 'No file uploaded' });
  }


  const { path, mimetype } = req.file;
  try {
    let text;

    if (mimetype.startsWith('image/')) {
      const { data: { text: ocrText } } = await tesseract.recognize(path, 'eng');
      text = ocrText;

    } else {
      return res.status(415).json({ error: 'Unsupported file type' });
    }

    req.rawText = text;
    next();

  } catch (err) {
    console.error('Text extraction failed:', err);
    res.status(500).json({ error: 'Failed to extract text from file' });
  } finally {
    fs.unlink(path, () => {});
  }
}