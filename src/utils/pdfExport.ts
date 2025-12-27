import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

interface ExportData {
  textareaValues: { [key: string]: string };
  starRatings: { [key: string]: number };
  draggedEmojis: Array<{ id: string; emoji: string; label: string; x: number; y: number }>;
}

export const exportToPDF = async (data: ExportData): Promise<void> => {
  const pdf = new jsPDF({ orientation: 'portrait', unit: 'mm', format: 'a4' });
  const pageWidth = pdf.internal.pageSize.getWidth();
  const pageHeight = pdf.internal.pageSize.getHeight();
  
  const slideElements = document.querySelectorAll('.slide-for-export');
  
  if (slideElements.length === 0) {
    console.error('No slides found for export');
    return;
  }

  const slidesToExport = Math.min(slideElements.length - 1, 23);
  
  for (let i = 0; i < slidesToExport; i++) {
    const slideWrapper = slideElements[i] as HTMLElement;
    const slideContent = slideWrapper.querySelector('[class*="bg-"]')?.parentElement || slideWrapper;
    
    if (!slideContent) continue;

    try {
      const clone = slideContent.cloneNode(true) as HTMLElement;
      
      const container = document.createElement('div');
      container.style.cssText = 'position:fixed;left:-9999px;top:0;width:375px;height:667px;background:#000;overflow:hidden;z-index:-1';
      
      clone.style.cssText = 'width:100%;height:100%;position:relative;display:flex;flex-direction:column';
      
      const textareas = clone.querySelectorAll('textarea');
      textareas.forEach((ta) => {
        const textarea = ta as HTMLTextAreaElement;
        const div = document.createElement('div');
        div.style.cssText = 'font-size:11px;line-height:1.3;white-space:pre-wrap;word-wrap:break-word;overflow:hidden;width:100%;height:100%;color:' + (textarea.value ? '#000' : '#B29F71');
        div.textContent = textarea.value || textarea.placeholder;
        textarea.parentElement?.replaceChild(div, textarea);
      });
      
      container.appendChild(clone);
      document.body.appendChild(container);

      const images = container.querySelectorAll('img');
      await Promise.all(Array.from(images).map(img => 
        new Promise<void>(resolve => {
          if (img.complete) resolve();
          else { img.onload = () => resolve(); img.onerror = () => resolve(); }
        })
      ));

      await new Promise(r => setTimeout(r, 100));

      const canvas = await html2canvas(container, {
        scale: 2, useCORS: true, allowTaint: true, backgroundColor: '#000000', width: 375, height: 667
      });

      document.body.removeChild(container);

      const imgData = canvas.toDataURL('image/png');
      const margin = 12;
      const maxWidth = pageWidth - margin * 2;
      const maxHeight = pageHeight - margin * 2;
      const aspect = 375 / 667;
      
      let imgWidth = maxHeight * aspect;
      let imgHeight = maxHeight;
      if (imgWidth > maxWidth) { imgWidth = maxWidth; imgHeight = maxWidth / aspect; }
      
      const x = (pageWidth - imgWidth) / 2;
      const y = (pageHeight - imgHeight) / 2;

      if (i > 0) pdf.addPage();
      pdf.addImage(imgData, 'PNG', x, y, imgWidth, imgHeight);
      
    } catch (err) {
      console.error('Error capturing slide ' + (i + 1), err);
    }
  }

  pdf.save('year-planning-export.pdf');
};
