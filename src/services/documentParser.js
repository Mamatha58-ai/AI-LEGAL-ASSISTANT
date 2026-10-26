import * as pdfjsLib from 'pdfjs-dist';
import mammoth from 'mammoth';

// Configure PDF.js worker safely
try {
  if (pdfjsLib.GlobalWorkerOptions) {
    pdfjsLib.GlobalWorkerOptions.workerSrc = `https://unpkg.com/pdfjs-dist@${pdfjsLib.version || '3.11.174'}/build/pdf.worker.min.js`;
  }
} catch {
  // worker fallback will be used
}

function extractTextFallbackFromArrayBuffer(arrayBuffer) {
  try {
    const bytes = new Uint8Array(arrayBuffer);
    let binary = '';
    const len = bytes.byteLength;
    for (let i = 0; i < len; i++) {
      binary += String.fromCharCode(bytes[i]);
    }

    const textChunks = [];
    const tjRegex = /\(([^)]+)\)\s*Tj/g;
    let match;
    while ((match = tjRegex.exec(binary)) !== null) {
      if (match[1] && match[1].trim()) {
        textChunks.push(match[1]);
      }
    }

    const tjArrayRegex = /\[([^\]]+)\]\s*TJ/g;
    while ((match = tjArrayRegex.exec(binary)) !== null) {
      const inner = match[1];
      const strMatches = inner.match(/\(([^)]+)\)/g);
      if (strMatches) {
        const line = strMatches.map(s => s.slice(1, -1)).join('');
        if (line.trim()) textChunks.push(line);
      }
    }

    if (textChunks.length > 3) {
      return textChunks.join(' ').replace(/\\([()\\])/g, '$1');
    }

    const printable = binary.replace(/[^\x20-\x7E\n\r\t]/g, ' ');
    const meaningfulLines = printable
      .split(/\r?\n/)
      .map(l => l.trim())
      .filter(l => l.length > 20 && !l.startsWith('%') && !l.includes('endobj') && !l.includes('xref') && !l.includes('/Filter'));

    if (meaningfulLines.length > 0) {
      return meaningfulLines.join('\n\n');
    }
  } catch (err) {
    console.warn("ArrayBuffer fallback text extraction notice:", err);
  }
  return '';
}

/**
 * Parses uploaded legal documents (.pdf, .docx, .txt, .md) and returns extracted plain text.
 * @param {File} file 
 * @returns {Promise<{ text: string, fileName: string, fileType: string, charCount: number, wordCount: number }>}
 */
export async function parseDocument(file) {
  const fileName = file.name;
  const fileExtension = fileName.split('.').pop().toLowerCase();
  let extractedText = '';

  try {
    if (fileExtension === 'pdf') {
      const arrayBuffer = await file.arrayBuffer();
      try {
        const loadingTask = pdfjsLib.getDocument({
          data: new Uint8Array(arrayBuffer),
          useSystemFonts: true,
          disableFontFace: true
        });
        const pdf = await loadingTask.promise;
        let fullText = [];

        for (let pageNum = 1; pageNum <= pdf.numPages; pageNum++) {
          const page = await pdf.getPage(pageNum);
          const textContent = await page.getTextContent();
          const pageItems = textContent.items.map(item => item.str).join(' ');
          fullText.push(`--- Page ${pageNum} ---\n` + pageItems);
        }

        extractedText = fullText.join('\n\n');
      } catch (pdfErr) {
        console.warn("PDF.js worker/parse notice, using fallback extraction:", pdfErr);
        extractedText = extractTextFallbackFromArrayBuffer(arrayBuffer);
      }

    } else if (fileExtension === 'docx' || fileExtension === 'doc') {
      const arrayBuffer = await file.arrayBuffer();
      const result = await mammoth.extractRawText({ arrayBuffer });
      extractedText = result.value;

    } else {
      // Default plain text / markdown / csv
      extractedText = await file.text();
    }

    if (!extractedText || extractedText.trim().length === 0) {
      throw new Error("No readable text found in document. Please verify the file contains selectable text.");
    }

    const words = extractedText.trim().split(/\s+/).filter(Boolean);

    return {
      text: extractedText,
      fileName,
      fileType: fileExtension.toUpperCase(),
      charCount: extractedText.length,
      wordCount: words.length
    };

  } catch (error) {
    console.error("Document parsing error:", error);
    throw new Error(`Failed to parse document "${fileName}": ${error.message}`);
  }
}
