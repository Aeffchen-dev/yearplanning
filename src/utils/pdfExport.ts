import jsPDF from 'jspdf';

interface ExportData {
  textareaValues: { [key: string]: string };
  starRatings: { [key: string]: number };
  draggedEmojis: Array<{ id: string; emoji: string; label: string; x: number; y: number }>;
}

// Star SVG path for rendering
const drawStar = (pdf: jsPDF, x: number, y: number, size: number, filled: boolean, halfFilled: boolean = false) => {
  const points = 5;
  const outerRadius = size / 2;
  const innerRadius = outerRadius * 0.4;
  const centerX = x + size / 2;
  const centerY = y + size / 2;
  
  const path: [number, number][] = [];
  
  for (let i = 0; i < points * 2; i++) {
    const radius = i % 2 === 0 ? outerRadius : innerRadius;
    const angle = (Math.PI / 2) + (Math.PI * i) / points;
    path.push([
      centerX + Math.cos(angle) * radius,
      centerY - Math.sin(angle) * radius
    ]);
  }
  
  if (filled || halfFilled) {
    pdf.setFillColor(0, 0, 0);
    if (halfFilled) {
      // Draw half star using clip
      pdf.saveGraphicsState();
      // Draw filled portion
      pdf.setFillColor(0, 0, 0);
      const pathStr = path.map((p, i) => `${i === 0 ? 'M' : 'L'} ${p[0]} ${p[1]}`).join(' ') + ' Z';
      // For half, we'll just draw a filled star and an empty star overlay
    }
    
    // Draw filled star
    pdf.setFillColor(0, 0, 0);
    let pathData = '';
    path.forEach((point, index) => {
      if (index === 0) {
        pathData = `M ${point[0]} ${point[1]}`;
      } else {
        pathData += ` L ${point[0]} ${point[1]}`;
      }
    });
    pathData += ' Z';
    
    // Use polygon method
    const xPoints = path.map(p => p[0]);
    const yPoints = path.map(p => p[1]);
    
    if (filled) {
      pdf.setFillColor(0, 0, 0);
      // @ts-ignore - polygon exists in jspdf
      if (typeof pdf.polygon === 'function') {
        // @ts-ignore
        pdf.polygon(xPoints, yPoints, 'F');
      } else {
        // Fallback: draw lines
        pdf.setDrawColor(0, 0, 0);
        pdf.setLineWidth(0.3);
        for (let i = 0; i < path.length; i++) {
          const next = (i + 1) % path.length;
          pdf.line(path[i][0], path[i][1], path[next][0], path[next][1]);
        }
        // Fill manually by drawing multiple lines
        pdf.setFillColor(0, 0, 0);
      }
    }
  }
  
  // Draw outline
  pdf.setDrawColor(0, 0, 0);
  pdf.setLineWidth(0.3);
  for (let i = 0; i < path.length; i++) {
    const next = (i + 1) % path.length;
    pdf.line(path[i][0], path[i][1], path[next][0], path[next][1]);
  }
};

const renderStarsGraphic = (pdf: jsPDF, x: number, y: number, rating: number, starSize: number = 5) => {
  const gap = 1.5;
  for (let i = 1; i <= 5; i++) {
    const starX = x + (i - 1) * (starSize + gap);
    const isFilled = rating >= i;
    const isHalf = !isFilled && rating > i - 1 && rating < i;
    drawStar(pdf, starX, y, starSize, isFilled, isHalf);
  }
};

const renderStarsText = (rating: number): string => {
  const fullStars = Math.floor(rating);
  const hasHalf = rating % 1 >= 0.5;
  let result = '';
  for (let i = 0; i < 5; i++) {
    if (i < fullStars) {
      result += '★';
    } else if (i === fullStars && hasHalf) {
      result += '✦'; // half star symbol
    } else {
      result += '☆';
    }
  }
  return result;
};

export const exportToPDF = async (data: ExportData): Promise<void> => {
  const { textareaValues, starRatings, draggedEmojis } = data;
  
  const pdf = new jsPDF({
    orientation: 'portrait',
    unit: 'mm',
    format: 'a4',
  });

  const pageWidth = pdf.internal.pageSize.getWidth();
  const pageHeight = pdf.internal.pageSize.getHeight();
  const cardMargin = 20;
  const cardPadding = 12;
  const cardWidth = pageWidth - cardMargin * 2;
  const cardHeight = pageHeight - cardMargin * 2;
  const contentX = cardMargin + cardPadding;
  const contentWidth = cardWidth - cardPadding * 2;
  
  let currentPage = 0;

  const startNewSlide = (label: string, labelText: string = ''): number => {
    if (currentPage > 0) {
      pdf.addPage();
    }
    currentPage++;
    
    // White background
    pdf.setFillColor(255, 255, 255);
    pdf.rect(0, 0, pageWidth, pageHeight, 'F');
    
    // Card background (light gray like #161616 inverted)
    pdf.setFillColor(240, 240, 240);
    pdf.roundedRect(cardMargin, cardMargin, cardWidth, cardHeight, 4, 4, 'F');
    
    // Label pill
    pdf.setDrawColor(0, 0, 0);
    pdf.setLineWidth(0.4);
    const labelFullText = labelText ? `${label} ${labelText}` : label;
    pdf.setFontSize(8);
    pdf.setFont('times', 'bolditalic'); // Closest to Kokoro
    const labelWidth = pdf.getTextWidth(labelFullText) + 8;
    pdf.roundedRect(contentX, cardMargin + cardPadding, labelWidth, 6, 3, 3, 'S');
    pdf.setTextColor(0, 0, 0);
    pdf.text(labelFullText, contentX + 4, cardMargin + cardPadding + 4.2);
    
    return cardMargin + cardPadding + 14; // Return starting Y position for content
  };

  const addTitle = (text: string, yPos: number, centered: boolean = false): number => {
    pdf.setFontSize(18);
    pdf.setFont('helvetica', 'bold');
    pdf.setTextColor(0, 0, 0);
    const lines = pdf.splitTextToSize(text, contentWidth);
    lines.forEach((line: string, i: number) => {
      if (centered) {
        pdf.text(line, pageWidth / 2, yPos + (i * 8), { align: 'center' });
      } else {
        pdf.text(line, contentX, yPos + (i * 8));
      }
    });
    return yPos + (lines.length * 8) + 8;
  };

  const addSubtitle = (text: string, yPos: number): number => {
    pdf.setFontSize(10);
    pdf.setFont('helvetica', 'bold');
    pdf.setTextColor(0, 0, 0);
    const lines = pdf.splitTextToSize(text, contentWidth);
    lines.forEach((line: string, i: number) => {
      pdf.text(line, contentX, yPos + (i * 5));
    });
    return yPos + (lines.length * 5) + 2;
  };

  const addTextArea = (text: string, yPos: number, height: number = 28): number => {
    // Yellow background like #FFE299
    pdf.setFillColor(255, 226, 153);
    pdf.rect(contentX, yPos, contentWidth, height, 'F');
    
    if (text && text.trim()) {
      pdf.setFontSize(9);
      pdf.setFont('helvetica', 'normal');
      pdf.setTextColor(0, 0, 0);
      const lines = pdf.splitTextToSize(text, contentWidth - 8);
      const maxLines = Math.floor((height - 4) / 4);
      lines.slice(0, maxLines).forEach((line: string, i: number) => {
        pdf.text(line, contentX + 4, yPos + 5 + (i * 4));
      });
    }
    
    return yPos + height + 4;
  };

  const addStarRating = (label: string, ratingKey: string, yPos: number): number => {
    const rating = starRatings[ratingKey] || 0;
    pdf.setFontSize(10);
    pdf.setFont('helvetica', 'normal');
    pdf.setTextColor(0, 0, 0);
    pdf.text(label, contentX, yPos);
    
    // Draw stars using text symbols
    pdf.setFontSize(12);
    pdf.text(renderStarsText(rating), contentX, yPos + 6);
    
    return yPos + 14;
  };

  const addEmojiItem = (emoji: string, label: string, placed: boolean, yPos: number): number => {
    // Draw circle background
    pdf.setFillColor(0, 0, 0);
    pdf.circle(contentX + 5, yPos + 2, 5, 'F');
    
    // Emoji text (will show as placeholder in PDF, but label is readable)
    pdf.setFontSize(10);
    pdf.setFont('helvetica', 'normal');
    pdf.setTextColor(0, 0, 0);
    pdf.text(`${label}${placed ? ' ✓ (platziert)' : ''}`, contentX + 14, yPos + 3);
    
    return yPos + 12;
  };

  // Helper to load image as base64
  const loadImage = (src: string): Promise<string> => {
    return new Promise((resolve, reject) => {
      const img = new Image();
      img.crossOrigin = 'anonymous';
      img.onload = () => {
        const canvas = document.createElement('canvas');
        canvas.width = img.width;
        canvas.height = img.height;
        const ctx = canvas.getContext('2d');
        if (ctx) {
          ctx.drawImage(img, 0, 0);
          resolve(canvas.toDataURL('image/png'));
        } else {
          reject(new Error('Could not get canvas context'));
        }
      };
      img.onerror = reject;
      img.src = src;
    });
  };

  // Slide 1: Title slide
  let yPos = startNewSlide('01', 'The past year');
  yPos = cardMargin + cardHeight / 3;
  addTitle('Schaut zurück auf das letzte Jahr.\nWas war los? Ordnet folgende\nBereiche im Graphen ein.', yPos);

  // Slide 2: Draggable emojis graph
  yPos = startNewSlide('01', 'The past year');
  
  // Try to load and add the graph image
  try {
    const graphImage = await loadImage('/lovable-uploads/d3e1d8c3-4f97-4683-8ded-a54d85b8972c.png');
    const imgWidth = contentWidth * 0.9;
    const imgHeight = imgWidth * 0.7;
    pdf.addImage(graphImage, 'PNG', contentX + (contentWidth - imgWidth) / 2, yPos, imgWidth, imgHeight);
    yPos += imgHeight + 8;
  } catch {
    yPos += 5;
  }
  
  addSubtitle('Platzierte Bereiche:', yPos);
  yPos += 6;
  
  const emojiLabels = [
    { emoji: '❤️', label: 'Beziehung' },
    { emoji: '👯‍♀️', label: 'Freunde' },
    { emoji: '🐶', label: 'Kalle' },
    { emoji: '🤸', label: 'Hobbies' },
    { emoji: '🫀', label: 'Gesundheit' },
    { emoji: '👩‍💻', label: 'Beruf' },
  ];
  
  emojiLabels.forEach((item) => {
    const placed = draggedEmojis.some(e => e.emoji === item.emoji);
    yPos = addEmojiItem(item.emoji, item.label, placed, yPos);
  });

  // Slide 3: Reflections
  yPos = startNewSlide('01', 'The past year');
  yPos = addSubtitle('Worauf seid ihr stolz?', yPos);
  yPos = addTextArea(textareaValues['slide3-proud'] || '', yPos, 32);
  yPos = addSubtitle('Wofür seid ihr dankbar?', yPos);
  yPos = addTextArea(textareaValues['slide3-grateful'] || '', yPos, 32);
  yPos = addSubtitle('Was wollt ihr nächstes Jahr besser machen?', yPos);
  addTextArea(textareaValues['slide3-improve'] || '', yPos, 32);

  // Slide 4: Health Check Title
  yPos = startNewSlide('02', 'Health Check');
  yPos = cardMargin + cardHeight / 3;
  addTitle('Schaut auf eure Beziehung:\nWas läuft gut? Was braucht\nmehr Achtsamkeit?', yPos);

  // Slide 5: Health Check Ratings 1
  yPos = startNewSlide('02', 'Health Check');
  yPos = addStarRating('Sexualität', 'slide5-sexuality', yPos);
  yPos = addStarRating('Emotionale Verbundenheit', 'slide5-emotional', yPos);
  yPos = addStarRating('Kommunikation', 'slide5-communication', yPos);
  yPos = addStarRating('Vertrauen', 'slide5-trust', yPos);
  yPos += 10;
  pdf.setFontSize(8);
  pdf.setFont('helvetica', 'italic');
  pdf.text('★ = gefüllt, ✦ = halb gefüllt, ☆ = leer', contentX, yPos);

  // Slide 6: Health Check Ratings 2
  yPos = startNewSlide('02', 'Health Check');
  yPos = addStarRating('Gemeinsame Zeit', 'slide6-time', yPos);
  yPos = addStarRating('Zusammen gelacht', 'slide6-laughter', yPos);
  yPos = addStarRating('Konfliktbewältigung', 'slide6-conflict', yPos);
  yPos = addStarRating('Freiheit, Unabhängigkeit', 'slide6-freedom', yPos);

  // Slide 7: Insights
  yPos = startNewSlide('02', 'Health Check');
  yPos = addSubtitle('Wie fühlt sich das an? Überrascht euch etwas? Wählt zwei Fokus-Felder fürs kommende Jahr aus.', yPos);
  yPos += 2;
  addTextArea(textareaValues['slide7-insights'] || '', yPos, 100);

  // Slide 8: New Year Title
  yPos = startNewSlide('03', 'The new year');
  yPos = cardMargin + cardHeight / 3;
  addTitle('Richtet euren Blick auf das\nkommende Jahr: Was nehmt ihr\neuch vor? Was wollt ihr erreichen?', yPos);

  // Slide 9: New initiatives
  yPos = startNewSlide('03', 'The new year');
  yPos = addSubtitle('Was wollen wir neu initiieren?', yPos);
  yPos = addTextArea(textareaValues['slide9-initiate'] || '', yPos, 32);
  yPos = addSubtitle('Womit wollen wir aufhören, weil es uns nicht gut tut?', yPos);
  yPos = addTextArea(textareaValues['slide9-stop'] || '', yPos, 32);
  yPos = addSubtitle('Was wollen wir weiter machen?', yPos);
  addTextArea(textareaValues['slide9-continue'] || '', yPos, 32);

  // Slide 10: Goals
  yPos = startNewSlide('03', 'The new year');
  yPos = addSubtitle('Was wollen wir bis Jahresende geschafft haben?', yPos);
  yPos = addTextArea(textareaValues['slide10-achieve'] || '', yPos, 32);
  yPos = addSubtitle('Welches Ziel nehmen wir aus dem letzten Jahr mit?', yPos);
  yPos = addTextArea(textareaValues['slide10-carry'] || '', yPos, 32);
  yPos = addSubtitle('Welche Projekte nehmen wir uns vor?', yPos);
  addTextArea(textareaValues['slide10-projects'] || '', yPos, 32);

  // Slide 11: Individual Focus Areas
  yPos = startNewSlide('03', 'The new year');
  yPos = addSubtitle('Worauf willst du deinen individuellen Fokus legen? Welche Wichtigkeit hat dieser Bereich jeweils?', yPos);
  yPos += 4;
  
  for (let i = 0; i < 5; i++) {
    const focusKey = `slide11-focus-${i}`;
    const starKey = `slide11-star-${i}`;
    const focusValue = textareaValues[focusKey] || '';
    const rating = starRatings[starKey] || 0;
    
    // Yellow background
    pdf.setFillColor(255, 226, 153);
    pdf.rect(contentX, yPos, contentWidth, 16, 'F');
    
    // Focus text
    pdf.setFontSize(9);
    pdf.setFont('helvetica', 'normal');
    pdf.setTextColor(0, 0, 0);
    pdf.text(focusValue || 'Fokus', contentX + 4, yPos + 5);
    
    // Stars
    pdf.setFontSize(10);
    pdf.text(renderStarsText(rating), contentX + contentWidth - 35, yPos + 11);
    
    yPos += 20;
  }

  // Slide 12: Plan and Terminate Title
  yPos = startNewSlide('04', 'Plan and terminate');
  yPos = cardMargin + cardHeight / 3;
  addTitle('Jetzt geht es darum, eure Ideen\nfürs kommende Jahr zu sammeln\nund auf ihre Machbarkeit zu\nuntersuchen und zu priorisieren.', yPos);

  // Slide 13: Goals Graph Info
  yPos = startNewSlide('04', 'Plan and terminate');
  yPos = addSubtitle('Nehmt euch ein Blatt Papier und ordnet eure Ziele auf dem Graphen ein.', yPos);
  yPos += 2;
  
  pdf.setFontSize(9);
  pdf.setFont('helvetica', 'normal');
  const infoText = 'Ihr könnt wenige große bzw. mehrere kleine Ziele festlegen. Ihr solltet nur die Ziele angehen, die einen hohen Impact haben und einfach umsetzbar sind.';
  const infoLines = pdf.splitTextToSize(infoText, contentWidth);
  infoLines.forEach((line: string) => {
    pdf.text(line, contentX, yPos);
    yPos += 4;
  });
  yPos += 4;
  
  // Try to load and add the goals graph image
  try {
    const goalsImage = await loadImage('/lovable-uploads/20b3daee-a65a-46df-9f4e-7fb1cd871631.png');
    const imgWidth = contentWidth * 0.85;
    const imgHeight = imgWidth * 0.75;
    pdf.addImage(goalsImage, 'PNG', contentX + (contentWidth - imgWidth) / 2, yPos, imgWidth, imgHeight);
  } catch {
    // Image load failed, continue without it
  }

  // Slides 14-23: Goal Planning (10 goal slides)
  for (let i = 14; i <= 23; i++) {
    yPos = startNewSlide('04', 'Plan and terminate');
    
    pdf.setFontSize(14);
    pdf.setFont('helvetica', 'bold');
    pdf.text(`Ziel ${i - 13}`, contentX, yPos);
    yPos += 10;
    
    yPos = addSubtitle('Ziel', yPos);
    yPos = addTextArea(textareaValues[`slide${i}-goal`] || '', yPos, 22);
    
    const prio = starRatings[`slide${i}-prio`] || 0;
    pdf.setFontSize(10);
    pdf.setFont('helvetica', 'normal');
    pdf.text(`Prio: ${renderStarsText(prio)}`, contentX, yPos);
    yPos += 8;
    
    yPos = addSubtitle('Wie messen wir den Erfolg?', yPos);
    yPos = addTextArea(textareaValues[`slide${i}-measure`] || '', yPos, 22);
    
    yPos = addSubtitle('Wie gehen wir es Schritt für Schritt an?', yPos);
    addTextArea(textareaValues[`slide${i}-steps`] || '', yPos, 22);
  }

  // Note: Slide 24 (final slide) is excluded from export as requested

  // Save the PDF
  pdf.save('year-planning-export.pdf');
};
