import mammoth from 'mammoth';
import PDFParser from 'pdf2json';

export async function extractTextFromPDFBuffer(buffer: Buffer): Promise<string> {
  return new Promise((resolve, reject) => {
    const pdfParser = new (PDFParser as any)(null, 1);

    pdfParser.on('pdfParser_dataError', (errData: any) => {
      reject(new Error(errData?.parserError || 'Failed to parse PDF document.'));
    });

    pdfParser.on('pdfParser_dataReady', (pdfData: any) => {
      try {
        const rawText = pdfParser.getRawTextContent();
        if (rawText && rawText.trim()) {
          resolve(rawText.trim());
        } else {
          reject(new Error('No extractable text found in PDF document.'));
        }
      } catch (err) {
        reject(err);
      }
    });

    pdfParser.parseBuffer(buffer);
  });
}

export async function extractTextFromFile(file: File): Promise<string> {
  const bytes = await file.arrayBuffer();
  const buffer = Buffer.from(bytes);
  const fileType = file.name.split('.').pop()?.toLowerCase();

  if (fileType === 'pdf') {
    return await extractTextFromPDFBuffer(buffer);
  } else if (fileType === 'docx') {
    const result = await mammoth.extractRawText({ buffer });
    const text = result.value?.trim();
    if (!text) {
      throw new Error('No extractable text found in DOCX document.');
    }
    return text;
  } else {
    throw new Error('Unsupported file format. Please upload a PDF (.pdf) or Word document (.docx).');
  }
}
