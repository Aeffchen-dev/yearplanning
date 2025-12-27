import jsPDF from 'jspdf';

interface ExportData {
  textareaValues: { [key: string]: string };
  starRatings: { [key: string]: number };
  draggedEmojis: Array<{ id: string; emoji: string; label: string; x: number; y: number }>;
}

const renderStars = (rating: number): string => {
  const fullStars = Math.floor(rating);
  const hasHalf = rating % 1 >= 0.5;
  let stars = '★'.repeat(fullStars);
  if (hasHalf) stars += '½';
  stars += '☆'.repeat(5 - Math.ceil(rating));
  return stars;
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
  const margin = 20;
  const contentWidth = pageWidth - margin * 2;
  const cardMargin = 25;
  const cardWidth = pageWidth - cardMargin * 2;
  const cardHeight = pageHeight - cardMargin * 2;
  
  // Colors (inverted - white bg, black text)
  const bgColor = '#FFFFFF';
  const cardBgColor = '#F5F5F5';
  const textColor = '#000000';
  const accentColor = '#FFE299';

  let currentPage = 0;

  const startNewSlide = (label: string, labelText: string = '') => {
    if (currentPage > 0) {
      pdf.addPage();
    }
    currentPage++;
    
    // White background
    pdf.setFillColor(255, 255, 255);
    pdf.rect(0, 0, pageWidth, pageHeight, 'F');
    
    // Card background (light gray)
    pdf.setFillColor(245, 245, 245);
    pdf.roundedRect(cardMargin, cardMargin, cardWidth, cardHeight, 5, 5, 'F');
    
    // Label pill
    pdf.setDrawColor(0, 0, 0);
    pdf.setLineWidth(0.5);
    const labelFullText = labelText ? `${label} ${labelText}` : label;
    const labelWidth = pdf.getTextWidth(labelFullText) + 10;
    pdf.roundedRect(cardMargin + 15, cardMargin + 15, labelWidth, 8, 4, 4, 'S');
    pdf.setFontSize(9);
    pdf.setFont('helvetica', 'bold');
    pdf.setTextColor(0, 0, 0);
    pdf.text(labelFullText, cardMargin + 15 + 5, cardMargin + 15 + 5.5);
    
    return cardMargin + 35; // Return starting Y position for content
  };

  const addTitle = (text: string, yPos: number): number => {
    pdf.setFontSize(20);
    pdf.setFont('helvetica', 'bold');
    pdf.setTextColor(0, 0, 0);
    const lines = pdf.splitTextToSize(text, cardWidth - 30);
    lines.forEach((line: string, i: number) => {
      pdf.text(line, cardMargin + 15, yPos + (i * 9));
    });
    return yPos + (lines.length * 9) + 10;
  };

  const addSubtitle = (text: string, yPos: number): number => {
    pdf.setFontSize(11);
    pdf.setFont('helvetica', 'bold');
    pdf.setTextColor(0, 0, 0);
    pdf.text(text, cardMargin + 15, yPos);
    return yPos + 7;
  };

  const addTextArea = (text: string, yPos: number, maxHeight: number = 30): number => {
    if (!text || text.trim() === '') {
      // Empty textarea placeholder
      pdf.setFillColor(255, 226, 153); // #FFE299
      pdf.rect(cardMargin + 15, yPos, cardWidth - 30, maxHeight, 'F');
      return yPos + maxHeight + 5;
    }
    
    pdf.setFillColor(255, 226, 153);
    pdf.rect(cardMargin + 15, yPos, cardWidth - 30, maxHeight, 'F');
    
    pdf.setFontSize(10);
    pdf.setFont('helvetica', 'normal');
    pdf.setTextColor(0, 0, 0);
    const lines = pdf.splitTextToSize(text, cardWidth - 40);
    const maxLines = Math.floor((maxHeight - 6) / 5);
    lines.slice(0, maxLines).forEach((line: string, i: number) => {
      pdf.text(line, cardMargin + 20, yPos + 6 + (i * 5));
    });
    
    return yPos + maxHeight + 5;
  };

  const addStarRating = (label: string, rating: number, yPos: number): number => {
    pdf.setFontSize(11);
    pdf.setFont('helvetica', 'normal');
    pdf.setTextColor(0, 0, 0);
    pdf.text(label, cardMargin + 15, yPos);
    
    pdf.setFontSize(14);
    pdf.text(renderStars(rating), cardMargin + 15, yPos + 8);
    return yPos + 18;
  };

  // Slide 1: Title slide
  let yPos = startNewSlide('01', 'The past year');
  yPos = cardMargin + cardHeight / 3;
  addTitle('Schaut zurück auf das letzte Jahr.\nWas war los? Ordnet folgende\nBereiche im Graphen ein.', yPos);

  // Slide 2: Draggable emojis graph
  yPos = startNewSlide('01', 'The past year');
  addSubtitle('Bereiche im Graphen:', yPos);
  yPos += 10;
  
  const emojiLabels = [
    { emoji: '❤️', label: 'Beziehung' },
    { emoji: '👯‍♀️', label: 'Freunde' },
    { emoji: '🐶', label: 'Kalle' },
    { emoji: '🤸', label: 'Hobbies' },
    { emoji: '🫀', label: 'Gesundheit' },
    { emoji: '👩‍💻', label: 'Beruf' },
  ];
  
  emojiLabels.forEach((item) => {
    const placed = draggedEmojis.find(e => e.emoji === item.emoji);
    pdf.setFontSize(12);
    pdf.text(`${item.emoji} ${item.label}${placed ? ' ✓' : ''}`, cardMargin + 20, yPos);
    yPos += 8;
  });

  // Slide 3: Reflections
  yPos = startNewSlide('01', 'The past year');
  yPos = addSubtitle('Worauf seid ihr stolz?', yPos);
  yPos = addTextArea(textareaValues['slide3-proud'] || '', yPos, 35);
  yPos = addSubtitle('Wofür seid ihr dankbar?', yPos);
  yPos = addTextArea(textareaValues['slide3-grateful'] || '', yPos, 35);
  yPos = addSubtitle('Was wollt ihr nächstes Jahr besser machen?', yPos);
  addTextArea(textareaValues['slide3-improve'] || '', yPos, 35);

  // Slide 4: Health Check Title
  yPos = startNewSlide('02', 'Health Check');
  yPos = cardMargin + cardHeight / 3;
  addTitle('Schaut auf eure Beziehung:\nWas läuft gut? Was braucht\nmehr Achtsamkeit?', yPos);

  // Slide 5: Health Check Ratings 1
  yPos = startNewSlide('02', 'Health Check');
  yPos = addStarRating('Sexualität', starRatings['slide5-sexuality'] || 0, yPos);
  yPos = addStarRating('Emotionale Verbundenheit', starRatings['slide5-emotional'] || 0, yPos);
  yPos = addStarRating('Kommunikation', starRatings['slide5-communication'] || 0, yPos);
  addStarRating('Vertrauen', starRatings['slide5-trust'] || 0, yPos);

  // Slide 6: Health Check Ratings 2
  yPos = startNewSlide('02', 'Health Check');
  yPos = addStarRating('Gemeinsame Zeit', starRatings['slide6-time'] || 0, yPos);
  yPos = addStarRating('Zusammen gelacht', starRatings['slide6-laughter'] || 0, yPos);
  yPos = addStarRating('Konfliktbewältigung', starRatings['slide6-conflict'] || 0, yPos);
  addStarRating('Freiheit, Unabhängigkeit', starRatings['slide6-freedom'] || 0, yPos);

  // Slide 7: Insights
  yPos = startNewSlide('02', 'Health Check');
  yPos = addSubtitle('Wie fühlt sich das an? Überrascht euch etwas?', yPos);
  yPos += 3;
  addTextArea(textareaValues['slide7-insights'] || '', yPos, 120);

  // Slide 8: New Year Title
  yPos = startNewSlide('03', 'The new year');
  yPos = cardMargin + cardHeight / 3;
  addTitle('Richtet euren Blick auf das\nkommende Jahr: Was nehmt ihr\neuch vor? Was wollt ihr erreichen?', yPos);

  // Slide 9: New initiatives
  yPos = startNewSlide('03', 'The new year');
  yPos = addSubtitle('Was wollen wir neu initiieren?', yPos);
  yPos = addTextArea(textareaValues['slide9-initiate'] || '', yPos, 35);
  yPos = addSubtitle('Womit wollen wir aufhören?', yPos);
  yPos = addTextArea(textareaValues['slide9-stop'] || '', yPos, 35);
  yPos = addSubtitle('Was wollen wir weiter machen?', yPos);
  addTextArea(textareaValues['slide9-continue'] || '', yPos, 35);

  // Slide 10: Goals
  yPos = startNewSlide('03', 'The new year');
  yPos = addSubtitle('Was wollen wir bis Jahresende geschafft haben?', yPos);
  yPos = addTextArea(textareaValues['slide10-achieve'] || '', yPos, 35);
  yPos = addSubtitle('Welches Ziel nehmen wir aus dem letzten Jahr mit?', yPos);
  yPos = addTextArea(textareaValues['slide10-carry'] || '', yPos, 35);
  yPos = addSubtitle('Welche Projekte nehmen wir uns vor?', yPos);
  addTextArea(textareaValues['slide10-projects'] || '', yPos, 35);

  // Slide 11: Individual Focus Areas
  yPos = startNewSlide('03', 'The new year');
  yPos = addSubtitle('Individuelle Fokus-Bereiche:', yPos);
  yPos += 3;
  
  for (let i = 0; i < 5; i++) {
    const focusKey = `slide11-focus-${i}`;
    const starKey = `slide11-star-${i}`;
    const focusValue = textareaValues[focusKey] || '';
    const rating = starRatings[starKey] || 0;
    
    pdf.setFillColor(255, 226, 153);
    pdf.rect(cardMargin + 15, yPos, cardWidth - 30, 18, 'F');
    
    pdf.setFontSize(10);
    pdf.setFont('helvetica', 'normal');
    pdf.setTextColor(0, 0, 0);
    pdf.text(focusValue || 'Fokus', cardMargin + 20, yPos + 6);
    
    pdf.setFontSize(10);
    pdf.text(renderStars(rating), cardMargin + cardWidth - 60, yPos + 12);
    
    yPos += 22;
  }

  // Slide 12: Plan and Terminate Title
  yPos = startNewSlide('04', 'Plan and terminate');
  yPos = cardMargin + cardHeight / 3;
  addTitle('Jetzt geht es darum, eure Ideen\nfürs kommende Jahr zu sammeln\nund auf ihre Machbarkeit zu\nuntersuchen und zu priorisieren.', yPos);

  // Slide 13: Goals Graph Info
  yPos = startNewSlide('04', 'Plan and terminate');
  yPos = addSubtitle('Ordnet eure Ziele auf dem Graphen ein.', yPos);
  yPos += 5;
  pdf.setFontSize(10);
  pdf.setFont('helvetica', 'normal');
  const infoText = 'Ihr könnt wenige große bzw. mehrere kleine Ziele festlegen. Ihr solltet nur die Ziele angehen, die einen hohen Impact haben und einfach umsetzbar sind.';
  const infoLines = pdf.splitTextToSize(infoText, cardWidth - 30);
  infoLines.forEach((line: string) => {
    pdf.text(line, cardMargin + 15, yPos);
    yPos += 5;
  });

  // Slides 14-23: Goal Planning
  for (let i = 14; i <= 23; i++) {
    yPos = startNewSlide('04', 'Plan and terminate');
    
    pdf.setFontSize(14);
    pdf.setFont('helvetica', 'bold');
    pdf.text(`Ziel ${i - 13}`, cardMargin + 15, yPos);
    yPos += 10;
    
    yPos = addSubtitle('Ziel', yPos);
    yPos = addTextArea(textareaValues[`slide${i}-goal`] || '', yPos, 25);
    
    const prio = starRatings[`slide${i}-prio`] || 0;
    pdf.setFontSize(11);
    pdf.setFont('helvetica', 'normal');
    pdf.text(`Priorität: ${renderStars(prio)}`, cardMargin + 15, yPos);
    yPos += 10;
    
    yPos = addSubtitle('Wie messen wir den Erfolg?', yPos);
    yPos = addTextArea(textareaValues[`slide${i}-measure`] || '', yPos, 25);
    
    yPos = addSubtitle('Wie gehen wir es Schritt für Schritt an?', yPos);
    addTextArea(textareaValues[`slide${i}-steps`] || '', yPos, 25);
  }

  // Slide 24: Final slide
  yPos = startNewSlide('Finally', '');
  yPos = cardMargin + cardHeight / 3;
  addTitle('Es ist geschafft 🎉\nStoßt auf euch an und habt\nein geiles Jahr ihr Süßen!', yPos);

  // Save the PDF
  pdf.save('year-planning-export.pdf');
};
