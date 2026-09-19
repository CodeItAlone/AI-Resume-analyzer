import mammoth from 'mammoth';
import PDFParser from 'pdf2json';

const PARSE_TIMEOUT_MS = 10000; // 10 second parser timeout
const MAX_EXTRACTED_CHARS = 100000; // 100k char safety limit against zip bombs

/**
 * Validates file signature (magic bytes) to ensure file format authenticity.
 * PDF: starts with %PDF (0x25 0x50 0x44 0x46)
 * DOCX: starts with PK\x03\x04 (0x50 0x4B 0x03 0x04)
 */
export function verifyFileMagicBytes(buffer: Buffer, expectedType: 'pdf' | 'docx'): void {
  if (buffer.length < 4) {
    throw new Error('Corrupted or incomplete file: file size is too small.');
  }

  if (expectedType === 'pdf') {
    const isPdf = buffer[0] === 0x25 && buffer[1] === 0x50 && buffer[2] === 0x44 && buffer[3] === 0x46;
    if (!isPdf) {
      throw new Error('Invalid file content. The uploaded document is not a valid PDF file.');
    }
  } else if (expectedType === 'docx') {
    const isDocx = buffer[0] === 0x50 && buffer[1] === 0x4B && buffer[2] === 0x03 && buffer[3] === 0x04;
    if (!isDocx) {
      throw new Error('Invalid file content. The uploaded document is not a valid Word (.docx) file.');
    }
  }
}

export async function extractTextFromPDFBuffer(buffer: Buffer): Promise<string> {
  return new Promise((resolve, reject) => {
    let isSettled = false;

    const timeout = setTimeout(() => {
      if (!isSettled) {
        isSettled = true;
        reject(new Error('PDF extraction timed out after 10 seconds.'));
      }
    }, PARSE_TIMEOUT_MS);

    try {
      const pdfParser = new (PDFParser as any)(null, 1);

      pdfParser.on('pdfParser_dataError', (errData: any) => {
        if (!isSettled) {
          isSettled = true;
          clearTimeout(timeout);
          reject(new Error(errData?.parserError || 'Failed to parse PDF document.'));
        }
      });

      pdfParser.on('pdfParser_dataReady', (pdfData: any) => {
        if (!isSettled) {
          isSettled = true;
          clearTimeout(timeout);
          try {
            // Reconstruct text in true visual vertical order (top to bottom)
            let structuredText = '';
            if (pdfData && Array.isArray(pdfData.Pages)) {
              for (const page of pdfData.Pages) {
                if (Array.isArray(page.Texts)) {
                  // Sort texts primarily by y (vertical top to bottom), then x (horizontal left to right)
                  const sortedTexts = [...page.Texts].sort((a, b) => {
                    const yDiff = (a.y || 0) - (b.y || 0);
                    if (Math.abs(yDiff) > 0.4) {
                      return yDiff;
                    }
                    return (a.x || 0) - (b.x || 0);
                  });

                  let lastY = -1;
                  for (const t of sortedTexts) {
                    const decoded = (t.R || []).map((r: any) => {
                      try {
                        return decodeURIComponent(r.T || '');
                      } catch {
                        return r.T || '';
                      }
                    }).join('');

                    if (lastY !== -1 && Math.abs((t.y || 0) - lastY) > 0.4) {
                      structuredText += '\n';
                    } else if (lastY !== -1) {
                      structuredText += ' ';
                    }
                    structuredText += decoded;
                    lastY = t.y || 0;
                  }
                  structuredText += '\n\n';
                }
              }
            }

            // Fallback to getRawTextContent if structuredText is empty
            let rawText = structuredText.trim() || pdfParser.getRawTextContent() || '';
            if (rawText && rawText.trim()) {
              rawText = rawText
                .replace(/-+Page\s*\(\d+\)\s*Break-+/gi, '\n')
                .replace(/----------------Page \(\d+\) Break----------------/gi, '\n')
                .replace(/\r\n/g, '\n')
                .trim();
              resolve(rawText.slice(0, MAX_EXTRACTED_CHARS));
            } else {
              reject(new Error('No extractable text found in PDF document.'));
            }
          } catch (err: any) {
            reject(new Error(err?.message || 'Error reading extracted PDF text.'));
          }
        }
      });

      pdfParser.parseBuffer(buffer);
    } catch (err: any) {
      if (!isSettled) {
        isSettled = true;
        clearTimeout(timeout);
        reject(new Error(err?.message || 'Unexpected error initializing PDF parser.'));
      }
    }
  });
}

export async function extractTextFromFile(file: File): Promise<string> {
  const bytes = await file.arrayBuffer();
  const buffer = Buffer.from(bytes);
  const fileType = file.name.split('.').pop()?.toLowerCase();

  if (fileType === 'pdf') {
    verifyFileMagicBytes(buffer, 'pdf');
    return await extractTextFromPDFBuffer(buffer);
  } else if (fileType === 'docx') {
    verifyFileMagicBytes(buffer, 'docx');
    
    // Wrap mammoth extraction in a 10s timeout
    const mammothPromise = mammoth.extractRawText({ buffer }).then((result) => {
      const text = result.value?.trim();
      if (!text) {
        throw new Error('No extractable text found in DOCX document.');
      }
      return text.slice(0, MAX_EXTRACTED_CHARS);
    });

    const timeoutPromise = new Promise<string>((_, reject) => {
      setTimeout(() => reject(new Error('DOCX extraction timed out after 10 seconds.')), PARSE_TIMEOUT_MS);
    });

    return await Promise.race([mammothPromise, timeoutPromise]);
  } else {
    throw new Error('Unsupported file format. Please upload a PDF (.pdf) or Word document (.docx).');
  }
}
