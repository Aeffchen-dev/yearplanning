import jsPDF from 'jspdf';

interface ExportData {
  textareaValues: { [key: string]: string };
  starRatings: { [key: string]: number };
  draggedEmojis: Array<{ id: string; emoji: string; label: string; x: number; y: number }>;
}

export const exportToPDF = async (data: ExportData): Promise<void> => {
  const { textareaValues, starRatings, draggedEmojis } = data;
  
  const pdf = new jsPDF({ orientation: 'portrait', unit: 'mm', format: 'a4' });
  const pageWidth = pdf.internal.pageSize.getWidth();
  const pageHeight = pdf.internal.pageSize.getHeight();
  const margin = 15;
  const cardWidth = pageWidth - margin * 2;
  const cardHeight = pageHeight - margin * 2;
  const contentX = margin + 10;
  const contentWidth = cardWidth - 20;
  const contentEndY = margin + cardHeight - 10;
  
  let currentPage = 0;

  const drawStar = (cx: number, cy: number, r: number, filled: boolean) => {
    const pts: [number, number][] = [];
    for (let i = 0; i < 10; i++) {
      const rad = i % 2 === 0 ? r : r * 0.4;
      const ang = -Math.PI / 2 + (Math.PI * i) / 5;
      pts.push([cx + Math.cos(ang) * rad, cy + Math.sin(ang) * rad]);
    }
    pdf.setDrawColor(0);
    pdf.setLineWidth(0.2);
    if (filled) pdf.setFillColor(0, 0, 0);
    for (let i = 0; i < pts.length; i++) {
      const n = (i + 1) % pts.length;
      pdf.line(pts[i][0], pts[i][1], pts[n][0], pts[n][1]);
    }
    if (filled) {
      for (let i = 0; i < pts.length; i++) {
        const n = (i + 1) % pts.length;
        pdf.triangle(cx, cy, pts[i][0], pts[i][1], pts[n][0], pts[n][1], 'F');
      }
    }
  };

  const drawStars = (x: number, y: number, rating: number, size: number = 2.5) => {
    for (let i = 1; i <= 5; i++) {
      drawStar(x + (i - 1) * (size * 2 + 1) + size, y, size, rating >= i);
    }
  };

  const startSlide = (num: string, text: string): number => {
    if (currentPage > 0) pdf.addPage();
    currentPage++;
    pdf.setFillColor(255, 255, 255);
    pdf.rect(0, 0, pageWidth, pageHeight, 'F');
    pdf.setFillColor(240, 240, 240);
    pdf.roundedRect(margin, margin, cardWidth, cardHeight, 4, 4, 'F');
    const label = text ? `${num} ${text}` : num;
    pdf.setFontSize(8);
    pdf.setFont('times', 'bolditalic');
    const tw = pdf.getTextWidth(label);
    pdf.setDrawColor(0);
    pdf.setLineWidth(0.4);
    pdf.roundedRect(contentX, margin + 10, tw + 10, 5, 2.5, 2.5, 'S');
    pdf.setTextColor(0);
    pdf.text(label, contentX + tw / 2 + 5, margin + 13.5, { align: 'center' });
    return margin + 20;
  };

  const addText = (t: string, y: number, size: number = 16): number => {
    pdf.setFontSize(size);
    pdf.setFont('helvetica', 'normal');
    pdf.setTextColor(0);
    const lines = pdf.splitTextToSize(t, contentWidth);
    lines.forEach((l: string, i: number) => pdf.text(l, contentX, y + i * (size * 0.4)));
    return y + lines.length * (size * 0.4) + 5;
  };

  const addTextarea = (key: string, y: number, h: number): number => {
    pdf.setFillColor(255, 226, 153);
    pdf.rect(contentX, y, contentWidth, h, 'F');
    const val = textareaValues[key] || '';
    if (val) {
      pdf.setFontSize(9);
      pdf.setFont('helvetica', 'normal');
      pdf.setTextColor(0);
      const lines = pdf.splitTextToSize(val, contentWidth - 6);
      const max = Math.floor((h - 4) / 4);
      lines.slice(0, max).forEach((l: string, i: number) => pdf.text(l, contentX + 3, y + 4 + i * 4));
    }
    return y + h + 3;
  };

  const addRating = (label: string, key: string, y: number): number => {
    pdf.setFontSize(10);
    pdf.setFont('helvetica', 'normal');
    pdf.setTextColor(0);
    pdf.text(label, contentX, y);
    drawStars(contentX, y + 5, starRatings[key] || 0, 2.5);
    return y + 13;
  };

  const addEmoji = (emoji: string, label: string, placed: boolean, y: number, xOff: number = 0): number => {
    pdf.setFillColor(0, 0, 0);
    pdf.circle(contentX + xOff + 5, y, 5, 'F');
    pdf.setFontSize(8);
    pdf.setFont('helvetica', 'normal');
    pdf.setTextColor(255, 255, 255);
    pdf.text(label.charAt(0).toUpperCase(), contentX + xOff + 5, y + 1, { align: 'center' });
    pdf.setTextColor(0);
    pdf.setFontSize(9);
    pdf.text(label + (placed ? ' (platziert)' : ''), contentX + xOff + 13, y + 1);
    return y + 12;
  };

  // Slide 1
  let y = startSlide('01', 'The past year');
  y = margin + cardHeight / 3;
  addText('Schaut zurück auf das letzte Jahr.\nWas war los? Ordnet folgende\nBereiche im Graphen ein.', y);

  // Slide 2
  y = startSlide('01', 'The past year');
  y += 80;
  const emojis = [['❤️', 'Beziehung'], ['👯‍♀️', 'Freunde'], ['🐶', 'Kalle'], ['🤸', 'Hobbies'], ['🫀', 'Gesundheit'], ['👩‍💻', 'Beruf']];
  let ly = y, ry = y;
  emojis.forEach(([e, l], i) => {
    const placed = draggedEmojis.some(d => d.emoji === e);
    if (i < 3) ly = addEmoji(e, l, placed, ly, 0);
    else ry = addEmoji(e, l, placed, ry, contentWidth / 2);
  });

  // Slide 3
  y = startSlide('01', 'The past year');
  const s3h = (contentEndY - y - 18) / 3;
  y = addText('Worauf seid ihr stolz?', y, 10);
  y = addTextarea('slide3-proud', y, s3h);
  y = addText('Wofür seid ihr dankbar?', y, 10);
  y = addTextarea('slide3-grateful', y, s3h);
  y = addText('Was wollt ihr nächstes Jahr besser machen?', y, 10);
  addTextarea('slide3-improve', y, s3h);

  // Slide 4
  y = startSlide('02', 'Health Check');
  y = margin + cardHeight / 3;
  addText('Schaut auf eure Beziehung:\nWas läuft gut? Was braucht\nmehr Achtsamkeit?', y);

  // Slide 5
  y = startSlide('02', 'Health Check');
  y = addRating('Sexualität', 'slide5-sexuality', y);
  y = addRating('Emotionale Verbundenheit', 'slide5-emotional', y + 15);
  y = addRating('Kommunikation', 'slide5-communication', y + 15);
  addRating('Vertrauen', 'slide5-trust', y + 15);

  // Slide 6
  y = startSlide('02', 'Health Check');
  y = addRating('Gemeinsame Zeit', 'slide6-time', y);
  y = addRating('Zusammen gelacht', 'slide6-laughter', y + 15);
  y = addRating('Konfliktbewältigung', 'slide6-conflict', y + 15);
  addRating('Freiheit, Unabhängigkeit', 'slide6-freedom', y + 15);

  // Slide 7
  y = startSlide('02', 'Health Check');
  y = addText('Wie fühlt sich das an? Überrascht euch etwas?', y, 10);
  addTextarea('slide7-insights', y, contentEndY - y - 5);

  // Slide 8
  y = startSlide('03', 'The new year');
  y = margin + cardHeight / 3;
  addText('Richtet euren Blick auf das\nkommende Jahr: Was nehmt ihr\neuch vor? Was wollt ihr erreichen?', y);

  // Slide 9
  y = startSlide('03', 'The new year');
  const s9h = (contentEndY - y - 18) / 3;
  y = addText('Was wollen wir neu initiieren?', y, 10);
  y = addTextarea('slide9-initiate', y, s9h);
  y = addText('Womit wollen wir aufhören?', y, 10);
  y = addTextarea('slide9-stop', y, s9h);
  y = addText('Was wollen wir weiter machen?', y, 10);
  addTextarea('slide9-continue', y, s9h);

  // Slide 10
  y = startSlide('03', 'The new year');
  const s10h = (contentEndY - y - 18) / 3;
  y = addText('Was wollen wir bis Jahresende geschafft haben?', y, 10);
  y = addTextarea('slide10-achieve', y, s10h);
  y = addText('Welches Ziel nehmen wir aus dem letzten Jahr mit?', y, 10);
  y = addTextarea('slide10-carry', y, s10h);
  y = addText('Welche Projekte nehmen wir uns vor?', y, 10);
  addTextarea('slide10-projects', y, s10h);

  // Slide 11
  y = startSlide('03', 'The new year');
  y = addText('Worauf willst du deinen individuellen Fokus legen?', y, 10);
  const fh = (contentEndY - y - 8) / 5;
  for (let i = 0; i < 5; i++) {
    pdf.setFillColor(255, 226, 153);
    pdf.rect(contentX, y, contentWidth, fh - 2, 'F');
    pdf.setFontSize(9);
    pdf.setFont('helvetica', 'normal');
    pdf.setTextColor(0);
    pdf.text(textareaValues[`slide11-focus-${i}`] || 'Fokus', contentX + 3, y + 5);
    drawStars(contentX + contentWidth - 35, y + fh - 6, starRatings[`slide11-star-${i}`] || 0, 2);
    y += fh;
  }

  // Slide 12
  y = startSlide('04', 'Plan and terminate');
  y = margin + cardHeight / 3;
  addText('Jetzt geht es darum, eure Ideen\nfürs kommende Jahr zu sammeln\nund zu priorisieren.', y);

  // Slide 13
  y = startSlide('04', 'Plan and terminate');
  addText('Nehmt euch ein Blatt Papier und ordnet eure Ziele auf dem Graphen ein.', y, 10);

  // Slides 14-23
  for (let i = 14; i <= 23; i++) {
    y = startSlide('04', 'Plan and terminate');
    const gh = (contentEndY - y - 20) / 3;
    y = addText('Ziel', y, 10);
    y = addTextarea(`slide${i}-goal`, y, gh);
    pdf.setFontSize(9);
    pdf.text('Prio:', contentX, y + 2);
    drawStars(contentX + 12, y + 2, starRatings[`slide${i}-prio`] || 0, 2);
    y += 10;
    y = addText('Wie messen wir den Erfolg?', y, 10);
    y = addTextarea(`slide${i}-measure`, y, gh - 4);
    y = addText('Wie gehen wir es Schritt für Schritt an?', y, 10);
    addTextarea(`slide${i}-steps`, y, gh - 4);
  }

  pdf.save('year-planning-export.pdf');
};
