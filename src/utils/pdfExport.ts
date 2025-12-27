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
  let yPosition = margin;
  let currentPage = 1;

  const addNewPage = () => {
    pdf.addPage();
    currentPage++;
    yPosition = margin;
  };

  const checkSpace = (neededSpace: number) => {
    if (yPosition + neededSpace > pageHeight - margin) {
      addNewPage();
    }
  };

  const addTitle = (text: string, fontSize: number = 16) => {
    checkSpace(15);
    pdf.setFontSize(fontSize);
    pdf.setFont('helvetica', 'bold');
    pdf.text(text, margin, yPosition);
    yPosition += 10;
  };

  const addSubtitle = (text: string) => {
    checkSpace(10);
    pdf.setFontSize(12);
    pdf.setFont('helvetica', 'bold');
    pdf.text(text, margin, yPosition);
    yPosition += 7;
  };

  const addText = (text: string, indent: number = 0) => {
    if (!text || text.trim() === '') return;
    pdf.setFontSize(10);
    pdf.setFont('helvetica', 'normal');
    const lines = pdf.splitTextToSize(text, contentWidth - indent);
    lines.forEach((line: string) => {
      checkSpace(6);
      pdf.text(line, margin + indent, yPosition);
      yPosition += 5;
    });
    yPosition += 3;
  };

  const addStarRating = (label: string, key: string) => {
    const rating = starRatings[key] || 0;
    checkSpace(8);
    pdf.setFontSize(10);
    pdf.setFont('helvetica', 'normal');
    pdf.text(`${label}: ${renderStars(rating)} (${rating}/5)`, margin, yPosition);
    yPosition += 6;
  };

  // Cover Page
  pdf.setFontSize(28);
  pdf.setFont('helvetica', 'bold');
  pdf.text('Year Planning', pageWidth / 2, pageHeight / 3, { align: 'center' });
  pdf.setFontSize(14);
  pdf.setFont('helvetica', 'normal');
  pdf.text('Relationship by Design', pageWidth / 2, pageHeight / 3 + 15, { align: 'center' });
  pdf.text(new Date().toLocaleDateString('de-DE'), pageWidth / 2, pageHeight / 3 + 25, { align: 'center' });

  // Slide 1-2: The Past Year - Graph with emojis
  addNewPage();
  addTitle('01 The past year', 18);
  yPosition += 5;
  
  if (draggedEmojis.length > 0) {
    addSubtitle('Bereiche im Graphen:');
    draggedEmojis.forEach((emoji) => {
      checkSpace(6);
      pdf.setFontSize(10);
      pdf.text(`${emoji.emoji} ${emoji.label}`, margin + 5, yPosition);
      yPosition += 6;
    });
    yPosition += 5;
  }

  // Slide 3: Reflections
  addSubtitle('Worauf seid ihr stolz?');
  addText(textareaValues['slide3-proud'] || '');
  
  addSubtitle('Wofür seid ihr dankbar?');
  addText(textareaValues['slide3-grateful'] || '');
  
  addSubtitle('Was wollt ihr nächstes Jahr besser machen?');
  addText(textareaValues['slide3-improve'] || '');

  // Slide 4-6: Health Check
  addNewPage();
  addTitle('02 Health Check', 18);
  yPosition += 5;
  
  addStarRating('Sexualität', 'slide5-sexuality');
  addStarRating('Emotionale Verbundenheit', 'slide5-emotional');
  addStarRating('Kommunikation', 'slide5-communication');
  addStarRating('Vertrauen', 'slide5-trust');
  yPosition += 5;
  
  addStarRating('Gemeinsame Zeit', 'slide6-time');
  addStarRating('Zusammen gelacht', 'slide6-laughter');
  addStarRating('Konfliktbewältigung', 'slide6-conflict');
  addStarRating('Freiheit, Unabhängigkeit', 'slide6-freedom');
  yPosition += 5;

  // Slide 7: Insights
  addSubtitle('Erkenntnisse:');
  addText(textareaValues['slide7-insights'] || '');

  // Slide 8-10: The New Year
  addNewPage();
  addTitle('03 The new year', 18);
  yPosition += 5;
  
  addSubtitle('Was wollen wir neu initiieren?');
  addText(textareaValues['slide9-initiate'] || '');
  
  addSubtitle('Womit wollen wir aufhören?');
  addText(textareaValues['slide9-stop'] || '');
  
  addSubtitle('Was wollen wir weiter machen?');
  addText(textareaValues['slide9-continue'] || '');
  
  addSubtitle('Was wollen wir bis Jahresende geschafft haben?');
  addText(textareaValues['slide10-achieve'] || '');
  
  addSubtitle('Welches Ziel nehmen wir aus dem letzten Jahr mit?');
  addText(textareaValues['slide10-carry'] || '');
  
  addSubtitle('Welche Projekte nehmen wir uns vor?');
  addText(textareaValues['slide10-projects'] || '');

  // Slide 11: Individual Focus Areas
  addNewPage();
  addTitle('Individuelle Fokus-Bereiche', 18);
  yPosition += 5;
  
  for (let i = 0; i < 5; i++) {
    const focusKey = `slide11-focus-${i}`;
    const starKey = `slide11-star-${i}`;
    const focusValue = textareaValues[focusKey];
    const rating = starRatings[starKey] || 0;
    
    if (focusValue && focusValue.trim()) {
      checkSpace(12);
      pdf.setFontSize(11);
      pdf.setFont('helvetica', 'bold');
      pdf.text(`Fokus ${i + 1}: ${focusValue}`, margin, yPosition);
      yPosition += 6;
      pdf.setFontSize(10);
      pdf.setFont('helvetica', 'normal');
      pdf.text(`Wichtigkeit: ${renderStars(rating)} (${rating}/5)`, margin + 5, yPosition);
      yPosition += 8;
    }
  }

  // Slides 14-23: Goals
  addNewPage();
  addTitle('04 Plan and terminate - Ziele', 18);
  yPosition += 5;
  
  for (let i = 14; i <= 23; i++) {
    const goal = textareaValues[`slide${i}-goal`];
    const prio = starRatings[`slide${i}-prio`] || 0;
    const measure = textareaValues[`slide${i}-measure`];
    const steps = textareaValues[`slide${i}-steps`];
    
    // Only include if there's any content
    if (goal || measure || steps || prio > 0) {
      checkSpace(35);
      
      pdf.setFontSize(12);
      pdf.setFont('helvetica', 'bold');
      pdf.text(`Ziel ${i - 13}`, margin, yPosition);
      yPosition += 7;
      
      if (goal) {
        pdf.setFontSize(10);
        pdf.setFont('helvetica', 'normal');
        const goalLines = pdf.splitTextToSize(goal, contentWidth - 5);
        goalLines.forEach((line: string) => {
          checkSpace(5);
          pdf.text(line, margin + 5, yPosition);
          yPosition += 5;
        });
      }
      
      if (prio > 0) {
        checkSpace(6);
        pdf.text(`Priorität: ${renderStars(prio)} (${prio}/5)`, margin + 5, yPosition);
        yPosition += 6;
      }
      
      if (measure) {
        checkSpace(6);
        pdf.setFont('helvetica', 'bold');
        pdf.text('Erfolgsmessung:', margin + 5, yPosition);
        yPosition += 5;
        pdf.setFont('helvetica', 'normal');
        const measureLines = pdf.splitTextToSize(measure, contentWidth - 10);
        measureLines.forEach((line: string) => {
          checkSpace(5);
          pdf.text(line, margin + 10, yPosition);
          yPosition += 5;
        });
      }
      
      if (steps) {
        checkSpace(6);
        pdf.setFont('helvetica', 'bold');
        pdf.text('Schritte:', margin + 5, yPosition);
        yPosition += 5;
        pdf.setFont('helvetica', 'normal');
        const stepsLines = pdf.splitTextToSize(steps, contentWidth - 10);
        stepsLines.forEach((line: string) => {
          checkSpace(5);
          pdf.text(line, margin + 10, yPosition);
          yPosition += 5;
        });
      }
      
      yPosition += 8;
    }
  }

  // Save the PDF
  pdf.save('year-planning-export.pdf');
};
