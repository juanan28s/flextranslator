/**
 * pdfUtils.ts
 * 
 * Responsible for generating professional-grade PDF exports.
 * 
 * ARCHITECTURAL APPROACH:
 * Instead of absolute positioning (standard jsPDF approach), we:
 * 1. Render a "phantom" HTML document in memory.
 * 2. Use `html2canvas` to take a high-resolution snapshot.
 * 3. Use `jsPDF` to embed the canvas and handle pagination.
 * 
 * WHY? 
 * This ensures that RTL text (Urdu/Arabic), custom fonts (Noto Nastaliq),
 * and complex CSS bubble layouts are rendered exactly as they appear in the UI.
 */

import { TranslationLogItem } from '../types';
import html2canvas from 'html2canvas';
import { jsPDF } from 'jspdf';

declare global {
  interface Window {
    showSaveFilePicker?: (options?: unknown) => Promise<unknown>;
  }
}

export const generatePDF = async (items: TranslationLogItem[], filename: string): Promise<void> => {
  if (items.length === 0) return;

  // --- 1. PHANTOM DOM PREPARATION ---
  const container = document.createElement('div');
  container.style.position = 'absolute';
  container.style.top = '-9999px';
  container.style.width = '800px'; 
  container.style.padding = '40px';
  container.style.backgroundColor = '#ffffff';
  container.style.fontFamily = "'Inter', sans-serif";
  container.style.color = '#1e293b';

  // --- 2. HEADER CONSTRUCTION ---
  const headerDiv = document.createElement('div');
  headerDiv.style.borderBottom = '2px solid #e2e8f0';
  headerDiv.style.paddingBottom = '15px';
  headerDiv.style.marginBottom = '30px';

  const title = document.createElement('h1');
  title.innerText = "Flex Translator";
  title.style.fontSize = '28px';
  title.style.color = '#0f172a';

  headerDiv.appendChild(title);
  container.appendChild(headerDiv);

  // --- 3. ITEMS RENDERING ---
  const contentDiv = document.createElement('div');
  items.forEach(item => {
    const isRTL = item.sourceLanguage === 'ur' || item.sourceLanguage === 'ar';
    
    const wrapper = document.createElement('div');
    wrapper.style.display = 'flex';
    wrapper.style.marginBottom = '20px';
    wrapper.style.justifyContent = isRTL ? 'flex-end' : 'flex-start';

    const bubble = document.createElement('div');
    bubble.style.borderRadius = '12px';
    bubble.style.width = '75%';
    bubble.style.border = '1px solid #cbd5e1';
    bubble.style.overflow = 'hidden';
    
    // Original Text Section
    const sourceDiv = document.createElement('div');
    sourceDiv.style.padding = '12px';
    sourceDiv.style.backgroundColor = isRTL ? '#f0fdf4' : '#eff6ff';
    sourceDiv.style.borderBottom = '1px solid #e2e8f0';

    const sourceText = document.createElement('p');
    sourceText.innerText = item.sourceText || '...';
    sourceText.style.fontSize = '14px';
    if (isRTL) {
      sourceText.style.fontFamily = "'Noto Nastaliq Urdu', serif";
      sourceText.style.direction = 'rtl';
      sourceText.style.textAlign = 'right';
    }

    sourceDiv.appendChild(sourceText);

    // Translation Section
    const transDiv = document.createElement('div');
    transDiv.style.padding = '12px';
    transDiv.style.backgroundColor = '#ffffff';

    const transText = document.createElement('p');
    transText.innerText = item.translatedText || '...';
    transText.style.fontSize = '15px';
    if (!isRTL) { // Translation would be RTL if source was LTR
        transText.style.fontFamily = "'Noto Nastaliq Urdu', serif";
        transText.style.direction = 'rtl';
        transText.style.textAlign = 'right';
    }

    transDiv.appendChild(transText);
    bubble.appendChild(sourceDiv);
    bubble.appendChild(transDiv);
    wrapper.appendChild(bubble);
    contentDiv.appendChild(wrapper);
  });
  container.appendChild(contentDiv);

  // --- 4. CONVERSION TO PDF ---
  document.body.appendChild(container);

  try {
    const canvas = await html2canvas(container, { scale: 2 });
    const imgData = canvas.toDataURL('image/png');
    const imgWidth = 210; 
    const pageHeight = 295; 
    const imgHeight = (canvas.height * imgWidth) / canvas.width;
    
    const pdf = new jsPDF('p', 'mm', 'a4');

    let heightLeft = imgHeight;
    let position = 0;

    pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
    heightLeft -= pageHeight;

    while (heightLeft >= 0) {
      position = heightLeft - imgHeight;
      pdf.addPage();
      pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
      heightLeft -= pageHeight;
    }

    const safeFilename = filename.endsWith('.pdf') ? filename : `${filename}.pdf`;
    pdf.save(safeFilename);
  } catch (err) {
    console.error("PDF Error", err);
  } finally {
    document.body.removeChild(container);
  }
};
