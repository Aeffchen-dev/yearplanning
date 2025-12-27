import jsPDF from 'jspdf';

interface ExportData {
  textareaValues: { [key: string]: string };
  starRatings: { [key: string]: number };
  draggedEmojis: Array<{ id: string; emoji: string; label: string; x: number; y: number }>;
}

// Emoji labels mapping for display
const emojiToLabel: { [key: string]: string } = {
  '❤️': 'Herz',
  '👯‍♀️': 'Freunde',
  '🐶': 'Hund',
  '🤸': 'Sport',
  '🫀': 'Gesundheit',
  '👩‍💻': 'Beruf',
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
    
    // Draw the star polygon
    pdf.setDrawColor(0, 0, 0);
    pdf.setLineWidth(0.2);
    
    if (filled) {
      pdf.setFillColor(0, 0, 0);
    }
    
    // Start path
    for (let i = 0; i < path.length; i++) {
      const next = (i + 1) % path.length;
      pdf.line(path[i][0], path[i][1], path[next][0], path[next][1]);
    }
    
    // Fill using triangles from center
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

  const drawStarRating = (x: number, y: number, rating: number, starSize: number = 3) => {
    const gap = 1;
    for (let i = 1; i <= 5; i++) {
      const starX = x + (i - 1) * (starSize * 2 + gap) + starSize;
      const starY = y;
      const filled = rating >= i;
      const halfFilled = !filled && rating > i - 1;
      
      if (filled) {
        drawStarShape(starX, starY, starSize, true);
      } else if (halfFilled) {
        // Draw empty star then half fill
        drawStarShape(starX, starY, starSize, false);
        // Add visual indicator for half
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
          // Draw the image
          ctx.drawImage(img, 0, 0);
          
          // Get image data and invert colors
          const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
          const data = imageData.data;
          
          for (let i = 0; i < data.length; i += 4) {
            // Invert RGB values
            data[i] = 255 - data[i];       // R
            data[i + 1] = 255 - data[i + 1]; // G
            data[i + 2] = 255 - data[i + 2]; // B
            // Keep alpha unchanged
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
    
    // Label pill - calculate proper centering
    const labelFullText = labelText ? `${label} ${labelText}` : label;
    pdf.setFontSize(8);
    pdf.setFont('times', 'bolditalic');
    const textWidth = pdf.getTextWidth(labelFullText);
    const pillPadding = 6;
    const pillWidth = textWidth + pillPadding * 2;
    const pillHeight = 6;
    const pillX = contentX;
    const pillY = cardMargin + cardPadding;
    
    // Draw pill outline
    pdf.setDrawColor(0, 0, 0);
    pdf.setLineWidth(0.4);
    pdf.roundedRect(pillX, pillY, pillWidth, pillHeight, 3, 3, 'S');
    
    // Center text in pill
    pdf.setTextColor(0, 0, 0);
    const textX = pillX + pillWidth / 2;
    const textY = pillY + pillHeight / 2 + 1;
    pdf.text(labelFullText, textX, textY, { align: 'center' });
    
    return cardMargin + cardPadding + 14;
  };

  const addTitle = (text: string, yPos: number): number => {
    pdf.setFontSize(18);
    pdf.setFont('helvetica', 'bold');
    pdf.setTextColor(0, 0, 0);
    const lines = pdf.splitTextToSize(text, contentWidth);
    lines.forEach((line: string, i: number) => {
      pdf.text(line, contentX, yPos + (i * 8));
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
    // Yellow background
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

  const addStarRatingRow = (label: string, ratingKey: string, yPos: number): number => {
    const rating = starRatings[ratingKey] || 0;
    pdf.setFontSize(10);
    pdf.setFont('helvetica', 'normal');
    pdf.setTextColor(0, 0, 0);
    pdf.text(label, contentX, yPos);
    
    // Draw graphic stars
    drawStarRating(contentX, yPos + 6, rating, 2.5);
    
    return yPos + 14;
  };

  const addEmojiItem = (label: string, placed: boolean, yPos: number): number => {
    // Draw filled circle with first letter
    pdf.setFillColor(0, 0, 0);
    pdf.circle(contentX + 5, yPos, 5, 'F');
    
    // Add first letter of label in white inside circle
    pdf.setFontSize(8);
    pdf.setFont('helvetica', 'bold');
    pdf.setTextColor(255, 255, 255);
    pdf.text(label.charAt(0).toUpperCase(), contentX + 5, yPos + 1, { align: 'center' });
    
    // Label text
    pdf.setFontSize(10);
    pdf.setFont('helvetica', 'normal');
    pdf.setTextColor(0, 0, 0);
    const statusText = placed ? ' (platziert)' : '';
    pdf.text(`${label}${statusText}`, contentX + 14, yPos + 1);
    
    return yPos + 12;
  };

  // Slide 1: Title slide
  let yPos = startNewSlide('01', 'The past year');
  yPos = cardMargin + cardHeight / 3;
  addTitle('Schaut zurück auf das letzte Jahr.\nWas war los? Ordnet folgende\nBereiche im Graphen ein.', yPos);

  // Slide 2: Draggable emojis graph
  yPos = startNewSlide('01', 'The past year');
  
  // Load and add inverted graph image
  try {
    const graphImage = await loadAndInvertImage('/lovable-uploads/d3e1d8c3-4f97-4683-8ded-a54d85b8972c.png');
    const imgWidth = contentWidth * 0.85;
    const imgHeight = imgWidth * 0.65;
    pdf.addImage(graphImage, 'PNG', contentX + (contentWidth - imgWidth) / 2, yPos, imgWidth, imgHeight);
    yPos += imgHeight + 6;
  } catch {
    yPos += 5;
  }
  
  addSubtitle('Bereiche:', yPos);
  yPos += 6;
  
  const emojiItems = [
    { emoji: '❤️', label: 'Beziehung' },
    { emoji: '👯‍♀️', label: 'Freunde' },
    { emoji: '🐶', label: 'Kalle' },
    { emoji: '🤸', label: 'Hobbies' },
    { emoji: '🫀', label: 'Gesundheit' },
    { emoji: '👩‍💻', label: 'Beruf' },
  ];
  
  emojiItems.forEach((item) => {
    const placed = draggedEmojis.some(e => e.emoji === item.emoji);
    yPos = addEmojiItem(item.label, placed, yPos);
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
  yPos = addStarRatingRow('Sexualität', 'slide5-sexuality', yPos);
  yPos = addStarRatingRow('Emotionale Verbundenheit', 'slide5-emotional', yPos);
  yPos = addStarRatingRow('Kommunikation', 'slide5-communication', yPos);
  yPos = addStarRatingRow('Vertrauen', 'slide5-trust', yPos);

  // Slide 6: Health Check Ratings 2
  yPos = startNewSlide('02', 'Health Check');
  yPos = addStarRatingRow('Gemeinsame Zeit', 'slide6-time', yPos);
  yPos = addStarRatingRow('Zusammen gelacht', 'slide6-laughter', yPos);
  yPos = addStarRatingRow('Konfliktbewältigung', 'slide6-conflict', yPos);
  yPos = addStarRatingRow('Freiheit, Unabhängigkeit', 'slide6-freedom', yPos);

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
  yPos = addSubtitle('Worauf willst du deinen individuellen Fokus legen?', yPos);
  yPos += 4;
  
  for (let i = 0; i < 5; i++) {
    const focusKey = `slide11-focus-${i}`;
    const starKey = `slide11-star-${i}`;
    const focusValue = textareaValues[focusKey] || '';
    const rating = starRatings[starKey] || 0;
    
    // Yellow background
    pdf.setFillColor(255, 226, 153);
    pdf.rect(contentX, yPos, contentWidth, 18, 'F');
    
    // Focus text
    pdf.setFontSize(9);
    pdf.setFont('helvetica', 'normal');
    pdf.setTextColor(0, 0, 0);
    pdf.text(focusValue || 'Fokus', contentX + 4, yPos + 6);
    
    // Stars - draw them graphically
    drawStarRating(contentX + contentWidth - 40, yPos + 12, rating, 2);
    
    yPos += 22;
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
    const imgWidth = contentWidth * 0.8;
    const imgHeight = imgWidth * 0.7;
    pdf.addImage(goalsImage, 'PNG', contentX + (contentWidth - imgWidth) / 2, yPos, imgWidth, imgHeight);
  } catch {
    // Continue without image
  }

  // Slides 14-23: Goal Planning
  for (let i = 14; i <= 23; i++) {
    yPos = startNewSlide('04', 'Plan and terminate');
    
    pdf.setFontSize(14);
    pdf.setFont('helvetica', 'bold');
    pdf.text(`Ziel ${i - 13}`, contentX, yPos);
    yPos += 10;
    
    yPos = addSubtitle('Ziel', yPos);
    yPos = addTextArea(textareaValues[`slide${i}-goal`] || '', yPos, 22);
    
    // Priority with graphic stars
    const prio = starRatings[`slide${i}-prio`] || 0;
    pdf.setFontSize(10);
    pdf.setFont('helvetica', 'normal');
    pdf.text('Prio:', contentX, yPos + 2);
    drawStarRating(contentX + 15, yPos + 2, prio, 2.5);
    yPos += 10;
    
    yPos = addSubtitle('Wie messen wir den Erfolg?', yPos);
    yPos = addTextArea(textareaValues[`slide${i}-measure`] || '', yPos, 22);
    
    yPos = addSubtitle('Wie gehen wir es Schritt für Schritt an?', yPos);
    addTextArea(textareaValues[`slide${i}-steps`] || '', yPos, 22);
  }

  // Save the PDF (slide 24 excluded)
  pdf.save('year-planning-export.pdf');
};
