interface ExportData {
  textareaValues: { [key: string]: string };
  starRatings: { [key: string]: number };
  draggedEmojis: Array<{ id: string; emoji: string; label: string; x: number; y: number }>;
}

export const exportToPDF = async (_data: ExportData): Promise<void> => {
  const slideElements = document.querySelectorAll('.slide-for-export');
  
  if (slideElements.length === 0) {
    console.error('No slides found for export');
    return;
  }

  // Create a new window for printing
  const printWindow = window.open('', '_blank', 'width=800,height=600');
  if (!printWindow) {
    alert('Please allow popups to export PDF');
    return;
  }

  // Build HTML content for all slides (excluding last slide which is download button)
  const slidesToExport = Math.min(slideElements.length - 1, 23);
  let slidesHTML = '';

  for (let i = 0; i < slidesToExport; i++) {
    const slideWrapper = slideElements[i] as HTMLElement;
    const slideContent = slideWrapper.querySelector('.flex.flex-col') || slideWrapper.firstElementChild;
    
    if (!slideContent) continue;

    // Clone the slide content
    const clone = slideContent.cloneNode(true) as HTMLElement;
    
    // Convert textareas to divs with their content
    const textareas = clone.querySelectorAll('textarea');
    textareas.forEach((ta) => {
      const textarea = ta as HTMLTextAreaElement;
      const div = document.createElement('div');
      div.className = 'textarea-replacement';
      div.style.cssText = `
        font-size: 10px;
        line-height: 1.3;
        white-space: pre-wrap;
        word-wrap: break-word;
        overflow: hidden;
        width: 100%;
        min-height: 20px;
        color: ${textarea.value ? '#000' : '#B29F71'};
        font-family: Arial, sans-serif;
      `;
      div.textContent = textarea.value || textarea.placeholder;
      textarea.parentElement?.replaceChild(div, textarea);
    });

    // Remove any buttons
    const buttons = clone.querySelectorAll('button');
    buttons.forEach(btn => btn.remove());

    slidesHTML += `
      <div class="slide-page">
        ${clone.outerHTML}
      </div>
    `;
  }

  // Write the print document
  printWindow.document.write(`
    <!DOCTYPE html>
    <html>
    <head>
      <title>Year Planning Export</title>
      <style>
        @import url('https://fonts.googleapis.com/css2?family=Noto+Emoji&display=swap');
        
        * {
          margin: 0;
          padding: 0;
          box-sizing: border-box;
        }
        
        @page {
          size: A4 portrait;
          margin: 10mm;
        }
        
        body {
          font-family: Arial, sans-serif;
          background: white;
        }
        
        .slide-page {
          width: 100%;
          height: 277mm;
          page-break-after: always;
          page-break-inside: avoid;
          display: flex;
          justify-content: center;
          align-items: center;
          padding: 5mm;
          background: white;
        }
        
        .slide-page:last-child {
          page-break-after: auto;
        }
        
        .slide-page > * {
          width: 100%;
          max-width: 160mm;
          height: 100%;
          max-height: 267mm;
          border-radius: 8px;
          overflow: hidden;
          transform-origin: center center;
        }
        
        /* Preserve background colors */
        [class*="bg-black"] { background-color: #000 !important; }
        [class*="bg-[#1A1A1A]"] { background-color: #1A1A1A !important; }
        [class*="bg-[#FFE299]"] { background-color: #FFE299 !important; }
        
        /* Text colors */
        [class*="text-white"] { color: white !important; }
        [class*="text-black"] { color: black !important; }
        [class*="text-[#B29F71]"] { color: #B29F71 !important; }
        
        /* Font sizes for print */
        .slide-page * {
          font-size: 11px !important;
          line-height: 1.3 !important;
        }
        
        .slide-page h1, .slide-page [class*="text-2xl"], .slide-page [class*="text-3xl"] {
          font-size: 18px !important;
        }
        
        .slide-page [class*="text-xl"] {
          font-size: 14px !important;
        }
        
        .slide-page [class*="text-lg"] {
          font-size: 12px !important;
        }
        
        .slide-page [class*="text-sm"], .slide-page [class*="text-xs"] {
          font-size: 9px !important;
        }
        
        /* Emoji circles */
        .slide-page [class*="rounded-full"][class*="bg-black"] {
          width: 24px !important;
          height: 24px !important;
          min-width: 24px !important;
          min-height: 24px !important;
        }
        
        /* Stars */
        .slide-page svg {
          width: 16px !important;
          height: 16px !important;
        }
        
        /* Hide navigation elements */
        .slide-page [class*="cursor-pointer"]:not([class*="rounded-full"]) {
          cursor: default !important;
        }
        
        /* Textarea replacements */
        .textarea-replacement {
          font-size: 10px !important;
          padding: 4px !important;
        }
        
        /* Images */
        .slide-page img {
          max-width: 100%;
          height: auto;
        }
        
        /* Flex layouts */
        .slide-page [class*="flex"] {
          display: flex;
        }
        .slide-page [class*="flex-col"] {
          flex-direction: column;
        }
        .slide-page [class*="flex-1"] {
          flex: 1;
        }
        .slide-page [class*="items-center"] {
          align-items: center;
        }
        .slide-page [class*="justify-center"] {
          justify-content: center;
        }
        .slide-page [class*="gap-"] {
          gap: 4px;
        }
        
        /* Padding */
        .slide-page [class*="p-4"], .slide-page [class*="p-6"] {
          padding: 8px !important;
        }
        
        @media print {
          body {
            -webkit-print-color-adjust: exact !important;
            print-color-adjust: exact !important;
            color-adjust: exact !important;
          }
          
          .slide-page {
            break-after: page;
            break-inside: avoid;
          }
        }
      </style>
    </head>
    <body>
      ${slidesHTML}
      <script>
        // Wait for fonts and images to load, then print
        window.onload = function() {
          setTimeout(function() {
            window.print();
            // Close after print dialog closes
            window.onafterprint = function() {
              window.close();
            };
            // Fallback close after delay
            setTimeout(function() {
              window.close();
            }, 60000);
          }, 500);
        };
      </script>
    </body>
    </html>
  `);

  printWindow.document.close();
};
