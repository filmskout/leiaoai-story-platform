/**
 * OCR和文本提取工具
 * 支持从图片、PDF和DOCX文件中提取文本
 */

/**
 * 使用OpenAI Vision API从图片中提取文本
 * 这是一个更准确的方法，但需要API调用
 */
export async function extractTextFromImageWithAI(imageBase64: string): Promise<string> {
  try {
    const response = await fetch('/api/unified?action=ocr-extract', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ image: imageBase64 }),
    });

    if (!response.ok) {
      throw new Error('OCR extraction failed');
    }

    const data = await response.json();
    return data.text || '';
  } catch (error) {
    console.error('Error extracting text with AI:', error);
    throw error;
  }
}

/**
 * 从base64编码的PDF提取文本
 * 注意：这个函数需要在服务器端运行，因为pdf-parse是Node.js库
 */
export async function extractTextFromPDF(pdfBase64: string): Promise<string> {
  try {
    const response = await fetch('/api/unified?action=pdf-to-docx', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ pdfBase64 }),
    });

    if (!response.ok) {
      throw new Error('PDF text extraction failed');
    }

    const data = await response.json();
    return data.text || '';
  } catch (error) {
    console.error('Error extracting text from PDF:', error);
    throw error;
  }
}

/**
 * 从base64编码的DOCX提取文本
 * 注意：这个函数需要在服务器端运行，因为mammoth是Node.js库
 */
export async function extractTextFromDOCX(docxBase64: string): Promise<string> {
  try {
    const response = await fetch('/api/unified?action=pdf-to-docx', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ docxBase64 }),
    });

    if (!response.ok) {
      throw new Error('DOCX text extraction failed');
    }

    const data = await response.json();
    return data.text || '';
  } catch (error) {
    console.error('Error extracting text from DOCX:', error);
    throw error;
  }
}

/**
 * 根据文件类型自动选择合适的提取方法
 */
export async function extractTextFromFile(
  fileBase64: string,
  fileType: string
): Promise<string> {
  if (fileType.includes('image')) {
    return await extractTextFromImageWithAI(fileBase64);
  } else if (fileType.includes('pdf')) {
    return await extractTextFromPDF(fileBase64);
  } else if (
    fileType.includes('word') ||
    fileType.includes('officedocument.wordprocessingml')
  ) {
    return await extractTextFromDOCX(fileBase64);
  } else {
    throw new Error(`Unsupported file type: ${fileType}`);
  }
}

