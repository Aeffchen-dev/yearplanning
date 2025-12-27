import jsPDF from 'jspdf';

interface ExportData {
  textareaValues: { [key: string]: string };
  starRatings: { [key: string]: number };
  draggedEmojis: Array<{ id: string; emoji: string; label: string; x: number; y: number }>;
}

export const exportToPDF = async (data: ExportData): Promise<void> => {
  const { textareaValues, starRatings, draggedEmojis } = data;
  
  const pdf = new jsPDF({
    orientation: 'portrait',
    unit: 'mm',
    format: 'a4',
  });

  const pageWidth = pdf.internal.pageSize.getWidth();
  const pageHeight = pdf.internal.pageSize.getHeight();
  const cardMargin = 15;
  const cardPadding = 10;
  const cardWidth = pageWidth - cardMargin * 2;
  const cardHeight = pageHeight - cardMargin * 2;
  const contentX = cardMargin + cardPadding;
  const contentWidth = cardWidth - cardPadding * 2;
  const contentEndY = cardMargin + cardHeight - cardPadding;
  
  let currentPage = 0;

  // Draw stars manually using lines
  const drawStarShape = (centerX: number, centerY: number, outerRadius: number, filled: boolean) => {
    const points = 5;
    const innerRadius = outerRadius * 0.4;
    const path: [number, number][] = [];
    
    for (let i = 0; i < points * 2; i++) {
      const radius = i % 2 === 0 ? outerRadius : innerRadius;
      const angle = -Math.PI / 2 + (Math.PI * i) / points;
      path.push([
        centerX + Math.cos(angle) * radius,
        centerY + Math.sin(angle) * radius
      ]);
    }
    
    pdf.setDrawColor(0, 0, 0);
    pdf.setLineWidth(0.2);
    
    if (filled) {
      pdf.setFillColor(0, 0, 0);
    }
    
    for (let i = 0; i < path.length; i++) {
      const next = (i + 1) % path.length;
      pdf.line(path[i][0], path[i][1], path[next][0], path[next][1]);
    }
    
    if (filled) {
      for (let i = 0; i < path.length; i++) {
        const next = (i + 1) % path.length;
        pdf.triangle(
          centerX, centerY,
          path[i][0], path[i][1],
          path[next][0], path[next][1],
          'F'
        );
      }
    }
  };

  const drawStarRating = (x: number, y: number, rating: number, starSize: number = 2.5) => {
    const gap = 0.8;
    for (let i = 1; i <= 5; i++) {
      const starX = x + (i - 1) * (starSize * 2 + gap) + starSize;
      const starY = y;
      const filled = rating >= i;
      const halfFilled = !filled && rating > i - 1;
      
      if (filled) {
        drawStarShape(starX, starY, starSize, true);
      } else if (halfFilled) {
        drawStarShape(starX, starY, starSize, false);
        pdf.setFillColor(0, 0, 0);
        pdf.rect(starX - starSize, starY - starSize, starSize, starSize * 2, 'F');
      } else {
        drawStarShape(starX, starY, starSize, false);
      }
    }
  };

  // Helper to load and invert image
  const loadAndInvertImage = (src: string): Promise<string> => {
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
          const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
          const imgData = imageData.data;
          
          for (let i = 0; i < imgData.length; i += 4) {
            imgData[i] = 255 - imgData[i];
            imgData[i + 1] = 255 - imgData[i + 1];
            imgData[i + 2] = 255 - imgData[i + 2];
          }
          
          ctx.putImageData(imageData, 0, 0);
          resolve(canvas.toDataURL('image/png'));
        } else {
          reject(new Error('Could not get canvas context'));
        }
      };
      img.onerror = reject;
      img.src = src;
    });
  };

  const startNewSlide = (label: string, labelText: string = ''): number => {
    if (currentPage > 0) {
      pdf.addPage();
    }
    currentPage++;
    
    // White background
    pdf.setFillColor(255, 255, 255);
    pdf.rect(0, 0, pageWidth, pageHeight, 'F');
    
    // Card background (light gray)
    pdf.setFillColor(240, 240, 240);
    pdf.roundedRect(cardMargin, cardMargin, cardWidth, cardHeight, 4, 4, 'F');
    
    // Label pill
    const labelFullText = labelText ? `${label} ${labelText}` : label;
    pdf.setFontSize(8);
    pdf.setFont('times', 'bolditalic');
    const textWidth = pdf.getTextWidth(labelFullText);
    const pillPadding = 5;
    const pillWidth = textWidth + pillPadding * 2;
    const pillHeight = 5;
    const pillX = contentX;
    const pillY = cardMargin + cardPadding;
    
    pdf.setDrawColor(0, 0, 0);
    pdf.setLineWidth(0.4);
    pdf.roundedRect(pillX, pillY, pillWidth, pillHeight, 2.5, 2.5, 'S');
    
    pdf.setTextColor(0, 0, 0);
    const textCenterX = pillX + pillWidth / 2;
    const textCenterY = pillY + pillHeight / 2 + 1;
    pdf.text(labelFullText, textCenterX, textCenterY, { align: 'center' });
    
    return cardMargin + cardPadding + 10;
  };

  const addTitle = (text: string, yPos: number): number => {
    pdf.setFontSize(16);
    pdf.setFont('helvetica', 'normal');
    pdf.setTextColor(0, 0, 0);
    const lines = pdf.splitTextToSize(text, contentWidth);
    lines.forEach((line: string, i: number) => {
      pdf.text(line, contentX, yPos + (i * 7));
    });
    return yPos + (lines.length * 7) + 6;
  };

  const addSubtitle = (text: string, yPos: number): number => {
    pdf.setFontSize(10);
    pdf.setFont('helvetica', 'normal');
    pdf.setTextColor(0, 0, 0);
    const lines = pdf.splitTextToSize(text, contentWidth);
    lines.forEach((line: string, i: number) => {
      pdf.text(line, contentX, yPos + (i * 4.5));
    });
    return yPos + (lines.length * 4.5) + 2;
  };

  const addTextArea = (text: string, yPos: number, height: number = 28): number => {
    pdf.setFillColor(255, 226, 153);
    pdf.rect(contentX, yPos, contentWidth, height, 'F');
    
    if (text && text.trim()) {
      pdf.setFontSize(9);
      pdf.setFont('helvetica', 'normal');
      pdf.setTextColor(0, 0, 0);
      const lines = pdf.splitTextToSize(text, contentWidth - 6);
      const lineHeight = 4;
      const maxLines = Math.floor((height - 4) / lineHeight);
      lines.slice(0, maxLines).forEach((line: string, i: number) => {
        pdf.text(line, contentX + 3, yPos + 4 + (i * lineHeight));
      });
    }
    
    return yPos + height + 3;
  };

  const addStarRatingRow = (label: string, ratingKey: string, yPos: number): number => {
    const rating = starRatings[ratingKey] || 0;
    pdf.setFontSize(10);
    pdf.setFont('helvetica', 'normal');
    pdf.setTextColor(0, 0, 0);
    pdf.text(label, contentX, yPos);
    
    drawStarRating(contentX, yPos + 5, rating, 2.5);
    
    return yPos + 13;
  };

  // Draw emoji circle with actual emoji or first letter
  const drawEmojiCircle = (centerX: number, centerY: number, radius: number, emoji: string, label: string) => {
    // Draw black circle
    pdf.setFillColor(0, 0, 0);
    pdf.circle(centerX, centerY, radius, 'F');
    
    // Try to render emoji symbol - jsPDF doesn't support emojis well, so use first letter
    pdf.setFontSize(radius * 1.2);
    pdf.setFont('helvetica', 'normal');
    pdf.setTextColor(255, 255, 255);
    pdf.text(label.charAt(0).toUpperCase(), centerX, centerY + radius * 0.35, { align: 'center' });
  };

  const addEmojiItem = (emoji: string, label: string, placed: boolean, yPos: number, xOffset: number = 0): number => {
    const circleRadius = 5;
    const circleX = contentX + xOffset + circleRadius;
    
    drawEmojiCircle(circleX, yPos, circleRadius, emoji, label);
    
    // Label text
    pdf.setFontSize(9);
    pdf.setFont('helvetica', 'normal');
    pdf.setTextColor(0, 0, 0);
    const statusText = placed ? ' (platziert)' : '';
    pdf.text(`${label}${statusText}`, circleX + circleRadius + 3, yPos + 1);
    
    return yPos + 12;
  };

  // Slide 1: Title slide
  let yPos = startNewSlide('01', 'The past year');
  yPos = cardMargin + cardHeight / 3;
  addTitle('Schaut zurück auf das letzte Jahr.\nWas war los? Ordnet folgende\nBereiche im Graphen ein.', yPos);

  // Slide 2: Draggable emojis graph
  yPos = startNewSlide('01', 'The past year');
  
  // Load and add inverted graph image
  const graphImageWidth = contentWidth * 0.95;
  const graphImageHeight = graphImageWidth * 0.6;
  try {
    const graphImage = await loadAndInvertImage('/lovable-uploads/d3e1d8c3-4f97-4683-8ded-a54d85b8972c.png');
    pdf.addImage(graphImage, 'PNG', contentX + (contentWidth - graphImageWidth) / 2, yPos, graphImageWidth, graphImageHeight);
  } catch {
    // Continue without image
  }
  yPos += graphImageHeight + 8;
  
  // Draw emoji items in 2 columns like frontend
  const emojiItems = [
    { emoji: '❤️', label: 'Beziehung' },
    { emoji: '👯‍♀️', label: 'Freunde' },
    { emoji: '🐶', label: 'Kalle' },
    { emoji: '🤸', label: 'Hobbies' },
    { emoji: '🫀', label: 'Gesundheit' },
    { emoji: '👩‍💻', label: 'Beruf' },
  ];
  
  const colWidth = contentWidth / 2;
  let leftY = yPos;
  let rightY = yPos;
  
  emojiItems.forEach((item, index) => {
    const placed = draggedEmojis.some(e => e.emoji === item.emoji);
    if (index < 3) {
      leftY = addEmojiItem(item.emoji, item.label, placed, leftY, 0);
    } else {
      rightY = addEmojiItem(item.emoji, item.label, placed, rightY, colWidth);
    }
  });
  
  yPos = Math.max(leftY, rightY) + 2;
  
  // Instruction text centered
  pdf.setFontSize(8);
  pdf.setFont('helvetica', 'normal');
  pdf.setTextColor(100, 100, 100);
  pdf.text('Platziert die Emojis auf dem Graphen', contentX + contentWidth / 2, yPos, { align: 'center' });

  // Slide 3: Reflections - textareas fill available space
  yPos = startNewSlide('01', 'The past year');
  const slide3ContentHeight = contentEndY - yPos;
  const slide3SectionHeight = (slide3ContentHeight - 20) / 3; // 3 sections with some spacing
  
  yPos = addSubtitle('Worauf seid ihr stolz?', yPos);
  yPos = addTextArea(textareaValues['slide3-proud'] || '', yPos, slide3SectionHeight - 8);
  yPos = addSubtitle('Wofür seid ihr dankbar?', yPos);
  yPos = addTextArea(textareaValues['slide3-grateful'] || '', yPos, slide3SectionHeight - 8);
  yPos = addSubtitle('Was wollt ihr nächstes Jahr besser machen?', yPos);
  addTextArea(textareaValues['slide3-improve'] || '', yPos, slide3SectionHeight - 8);

  // Slide 4: Health Check Title
  yPos = startNewSlide('02', 'Health Check');
  yPos = cardMargin + cardHeight / 3;
  addTitle('Schaut auf eure Beziehung:\nWas läuft gut? Was braucht\nmehr Achtsamkeit?', yPos);

  // Slide 5: Health Check Ratings 1 - better spacing
  yPos = startNewSlide('02', 'Health Check');
  const slide5ContentHeight = contentEndY - yPos;
  const ratingRowHeight = slide5ContentHeight / 4;
  
  const ratingItems5 = [
    { label: 'Sexualität', key: 'slide5-sexuality' },
    { label: 'Emotionale Verbundenheit', key: 'slide5-emotional' },
    { label: 'Kommunikation', key: 'slide5-communication' },
    { label: 'Vertrauen', key: 'slide5-trust' },
  ];
  
  ratingItems5.forEach((item) => {
    yPos = addStarRatingRow(item.label, item.key, yPos);
    yPos += ratingRowHeight - 13;
  });

  // Slide 6: Health Check Ratings 2
  yPos = startNewSlide('02', 'Health Check');
  const slide6ContentHeight = contentEndY - yPos;
  const ratingRowHeight6 = slide6ContentHeight / 4;
  
  const ratingItems6 = [
    { label: 'Gemeinsame Zeit', key: 'slide6-time' },
    { label: 'Zusammen gelacht', key: 'slide6-laughter' },
    { label: 'Konfliktbewältigung', key: 'slide6-conflict' },
    { label: 'Freiheit, Unabhängigkeit', key: 'slide6-freedom' },
  ];
  
  ratingItems6.forEach((item) => {
    yPos = addStarRatingRow(item.label, item.key, yPos);
    yPos += ratingRowHeight6 - 13;
  });

  // Slide 7: Insights - textarea fills space
  yPos = startNewSlide('02', 'Health Check');
  yPos = addSubtitle('Wie fühlt sich das an? Überrascht euch etwas? Wählt zwei Fokus-Felder fürs kommende Jahr aus.', yPos);
  yPos += 2;
  const slide7TextareaHeight = contentEndY - yPos - 5;
  addTextArea(textareaValues['slide7-insights'] || '', yPos, slide7TextareaHeight);

  // Slide 8: New Year Title
  yPos = startNewSlide('03', 'The new year');
  yPos = cardMargin + cardHeight / 3;
  addTitle('Richtet euren Blick auf das\nkommende Jahr: Was nehmt ihr\neuch vor? Was wollt ihr erreichen?', yPos);

  // Slide 9: New initiatives - textareas fill space
  yPos = startNewSlide('03', 'The new year');
  const slide9ContentHeight = contentEndY - yPos;
  const slide9SectionHeight = (slide9ContentHeight - 18) / 3;
  
  yPos = addSubtitle('Was wollen wir neu initiieren?', yPos);
  yPos = addTextArea(textareaValues['slide9-initiate'] || '', yPos, slide9SectionHeight - 8);
  yPos = addSubtitle('Womit wollen wir aufhören, weil es uns nicht gut tut?', yPos);
  yPos = addTextArea(textareaValues['slide9-stop'] || '', yPos, slide9SectionHeight - 8);
  yPos = addSubtitle('Was wollen wir weiter machen?', yPos);
  addTextArea(textareaValues['slide9-continue'] || '', yPos, slide9SectionHeight - 8);

  // Slide 10: Goals - textareas fill space
  yPos = startNewSlide('03', 'The new year');
  const slide10ContentHeight = contentEndY - yPos;
  const slide10SectionHeight = (slide10ContentHeight - 18) / 3;
  
  yPos = addSubtitle('Was wollen wir bis Jahresende geschafft haben?', yPos);
  yPos = addTextArea(textareaValues['slide10-achieve'] || '', yPos, slide10SectionHeight - 8);
  yPos = addSubtitle('Welches Ziel nehmen wir aus dem letzten Jahr mit?', yPos);
  yPos = addTextArea(textareaValues['slide10-carry'] || '', yPos, slide10SectionHeight - 8);
  yPos = addSubtitle('Welche Projekte nehmen wir uns vor?', yPos);
  addTextArea(textareaValues['slide10-projects'] || '', yPos, slide10SectionHeight - 8);

  // Slide 11: Individual Focus Areas - 5 equal sections
  yPos = startNewSlide('03', 'The new year');
  yPos = addSubtitle('Worauf willst du deinen individuellen Fokus legen?', yPos);
  yPos += 3;
  
  const slide11ContentHeight = contentEndY - yPos;
  const focusItemHeight = (slide11ContentHeight - 8) / 5;
  
  for (let i = 0; i < 5; i++) {
    const focusKey = `slide11-focus-${i}`;
    const starKey = `slide11-star-${i}`;
    const focusValue = textareaValues[focusKey] || '';
    const rating = starRatings[starKey] || 0;
    
    // Yellow background
    pdf.setFillColor(255, 226, 153);
    pdf.rect(contentX, yPos, contentWidth, focusItemHeight - 2, 'F');
    
    // Focus text
    pdf.setFontSize(9);
    pdf.setFont('helvetica', 'normal');
    pdf.setTextColor(0, 0, 0);
    pdf.text(focusValue || 'Fokus', contentX + 3, yPos + 5);
    
    // Stars at bottom right
    drawStarRating(contentX + contentWidth - 35, yPos + focusItemHeight - 6, rating, 2);
    
    yPos += focusItemHeight;
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
  
  // Load and add inverted goals graph image
  try {
    const goalsImage = await loadAndInvertImage('/lovable-uploads/20b3daee-a65a-46df-9f4e-7fb1cd871631.png');
    const imgWidth = contentWidth * 0.9;
    const imgHeight = imgWidth * 0.7;
    pdf.addImage(goalsImage, 'PNG', contentX + (contentWidth - imgWidth) / 2, yPos, imgWidth, imgHeight);
  } catch {
    // Continue without image
  }

  // Slides 14-23: Goal Planning - no "Ziel X" headline, no bold, better proportions
  for (let i = 14; i <= 23; i++) {
    yPos = startNewSlide('04', 'Plan and terminate');
    
    const goalContentHeight = contentEndY - yPos;
    const goalSectionHeight = (goalContentHeight - 20) / 3;
    
    // Goal textarea (larger)
    yPos = addSubtitle('Ziel', yPos);
    yPos = addTextArea(textareaValues[`slide${i}-goal`] || '', yPos, goalSectionHeight);
    
    // Priority with graphic stars
    const prio = starRatings[`slide${i}-prio`] || 0;
    pdf.setFontSize(9);
    pdf.setFont('helvetica', 'normal');
    pdf.text('Prio:', contentX, yPos + 2);
    drawStarRating(contentX + 12, yPos + 2, prio, 2);
    yPos += 10;
    
    // Measure success
    yPos = addSubtitle('Wie messen wir den Erfolg?', yPos);
    yPos = addTextArea(textareaValues[`slide${i}-measure`] || '', yPos, goalSectionHeight - 4);
    
    // Steps
    yPos = addSubtitle('Wie gehen wir es Schritt für Schritt an?', yPos);
    addTextArea(textareaValues[`slide${i}-steps`] || '', yPos, goalSectionHeight - 4);
  }

  // Save the PDF (slide 24 excluded)
  pdf.save('year-planning-export.pdf');
};
