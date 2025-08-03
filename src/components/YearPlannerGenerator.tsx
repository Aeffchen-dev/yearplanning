import React, { useState, useRef } from 'react';
import { ChevronLeft, ChevronRight, Star } from 'lucide-react';

interface EmojiPosition {
  emoji: string;
  x: number;
  y: number;
  label: string;
}

interface StarRating {
  [key: string]: number;
}

const YearPlannerGenerator = () => {
  const [currentSlide, setCurrentSlide] = useState(1);
  const [emojiPositions, setEmojiPositions] = useState<EmojiPosition[]>([]);
  const [starRatings, setStarRatings] = useState<StarRating>({});
  const [textInputs, setTextInputs] = useState<{[key: string]: string}>({});
  const graphRef = useRef<HTMLDivElement>(null);

  const totalSlides = 24;

  const emojis = [
    { emoji: '❤️', label: 'Beziehung' },
    { emoji: '👯‍♀️', label: 'Freunde' },
    { emoji: '🐶', label: 'Kalle' },
    { emoji: '🤸', label: 'Hobbies' },
    { emoji: '🫀', label: 'Gesundheit' },
    { emoji: '👩‍💻', label: 'Beruf' }
  ];

  const relationshipAspects = [
    'Sexualität',
    'Emotionale Verbundenheit', 
    'Kommunikation',
    'Vertrauen',
    'Gemeinsame Zeit',
    'Zusammen gelacht',
    'Konfliktbewältigung',
    'Freiheit, Unabhängigkeit'
  ];

  const handleEmojiDrop = (emoji: string, label: string, event: React.MouseEvent) => {
    if (!graphRef.current) return;
    
    const rect = graphRef.current.getBoundingClientRect();
    const x = ((event.clientX - rect.left) / rect.width) * 100;
    const y = ((event.clientY - rect.top) / rect.height) * 100;
    
    setEmojiPositions(prev => [
      ...prev.filter(pos => pos.emoji !== emoji),
      { emoji, x, y, label }
    ]);
  };

  const handleStarClick = (aspect: string, rating: number) => {
    setStarRatings(prev => ({
      ...prev,
      [aspect]: rating
    }));
  };

  const handleStarDoubleClick = (aspect: string, rating: number) => {
    setStarRatings(prev => ({
      ...prev,
      [aspect]: rating - 0.5
    }));
  };

  const StarRatingComponent = ({ aspect }: { aspect: string }) => {
    const rating = starRatings[aspect] || 0;
    
    return (
      <div style={{ 
        display: 'flex', 
        alignItems: 'center', 
        justifyContent: 'space-between',
        padding: '16px 20px',
        backgroundColor: '#f8fafc',
        borderRadius: '12px',
        marginBottom: '12px',
        border: '1px solid #e2e8f0'
      }}>
        <span style={{ 
          fontSize: '14px', 
          fontWeight: '500', 
          color: '#374151',
          flex: 1
        }}>
          {aspect}
        </span>
        <div style={{ display: 'flex', gap: '6px' }}>
          {[1, 2, 3, 4, 5].map((star) => (
            <Star
              key={star}
              size={20}
              style={{
                cursor: 'pointer',
                transition: 'all 0.2s ease',
                fill: star <= rating ? '#f59e0b' : 
                      star - 0.5 === rating ? '#f59e0b' : 'transparent',
                color: star <= rating ? '#f59e0b' : 
                       star - 0.5 === rating ? '#f59e0b' : '#cbd5e1'
              }}
              onClick={() => handleStarClick(aspect, star)}
              onDoubleClick={() => handleStarDoubleClick(aspect, star)}
            />
          ))}
        </div>
      </div>
    );
  };

  const renderSlide = () => {
    const baseStyle = {
      textAlign: 'center' as const,
      padding: '0 40px',
      maxWidth: '600px',
      margin: '0 auto'
    };

    const headerStyle = {
      marginBottom: '8px',
      fontSize: '12px',
      color: '#64748b',
      fontWeight: '400',
      letterSpacing: '0.5px',
      textTransform: 'uppercase' as const
    };

    const titleStyle = {
      fontSize: '48px',
      fontWeight: '700',
      marginBottom: '8px',
      margin: '0 0 8px 0',
      lineHeight: '1.1',
      color: '#0f172a',
      letterSpacing: '-0.025em'
    };

    const slideCountStyle = {
      fontSize: '16px',
      color: '#64748b',
      marginBottom: '40px',
      margin: '0 0 40px 0',
      fontWeight: '500'
    };

    const sectionTitleStyle = {
      fontSize: '28px',
      fontWeight: '600',
      margin: '0 0 24px 0',
      color: '#1e293b',
      letterSpacing: '-0.025em'
    };

    const footerStyle = {
      fontSize: '12px',
      color: '#94a3b8',
      marginTop: '48px'
    };

    const textAreaStyle = {
      width: '100%',
      minHeight: '100px',
      padding: '16px',
      border: '1px solid #e2e8f0',
      borderRadius: '12px',
      fontSize: '14px',
      marginBottom: '24px',
      resize: 'vertical' as const,
      fontFamily: 'inherit',
      backgroundColor: '#f8fafc',
      transition: 'all 0.2s ease',
      outline: 'none'
    };

    const inputStyle = {
      width: '100%',
      padding: '16px',
      border: '1px solid #e2e8f0',
      borderRadius: '12px',
      fontSize: '14px',
      marginBottom: '24px',
      fontFamily: 'inherit',
      backgroundColor: '#f8fafc',
      transition: 'all 0.2s ease',
      outline: 'none'
    };

    const labelStyle = {
      display: 'block',
      marginBottom: '8px',
      fontWeight: '500',
      fontSize: '14px',
      color: '#374151',
      textAlign: 'left' as const
    };

    switch (currentSlide) {
      case 1:
        return (
          <div style={baseStyle}>
            <div style={headerStyle}>Hello world project</div>
            <h1 style={{ ...titleStyle, fontSize: '72px' }}>Year Planning</h1>
            <p style={slideCountStyle}>1 / {totalSlides}</p>
            <div style={{ marginBottom: '48px' }}>
              <h2 style={{ ...sectionTitleStyle, fontSize: '36px' }}>01 The past year</h2>
              <p style={{ fontSize: '18px', marginBottom: '16px', margin: '0 0 16px 0' }}>
                Schaut zurück auf das letzte Jahr. Was war los? Ordnet folgende Bereiche im Graphen ein.
              </p>
              <p style={{ fontSize: '14px', color: '#6b7280', margin: '0' }}>
                Swipe um weiter zu navigieren
              </p>
            </div>
            <div style={footerStyle}>
              <p style={{ margin: '0 0 4px 0' }}>Relationship by design</p>
              <p style={{ margin: '0' }}>Feedback geben</p>
            </div>
          </div>
        );

      case 2:
        return (
          <div style={{ padding: '0 20px' }}>
            <div style={{ textAlign: 'center', marginBottom: '32px' }}>
              <div style={headerStyle}>Hello world project</div>
              <h1 style={titleStyle}>Year Planning</h1>
              <p style={slideCountStyle}>2 / {totalSlides}</p>
              <h2 style={sectionTitleStyle}>01 The past year</h2>
            </div>
            
            <div style={{ marginBottom: '32px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
                <div style={{ fontSize: '14px', fontWeight: '500', transform: 'rotate(-90deg)', transformOrigin: 'center', width: '100px' }}>Viel Zeit</div>
                <div style={{ fontSize: '14px', fontWeight: '500' }}>Nicht im Fokus</div>
                <div style={{ fontSize: '14px', fontWeight: '500' }}>Im Fokus</div>
                <div style={{ width: '100px' }}></div>
              </div>
              
              <div 
                ref={graphRef}
                style={{
                  position: 'relative',
                  width: '100%',
                  height: '384px',
                  border: '2px solid #d1d5db',
                  background: 'linear-gradient(135deg, #fef2f2 0%, #fefce8 50%, #f0fdf4 100%)',
                  cursor: 'crosshair',
                  backgroundImage: `linear-gradient(to right, rgba(0,0,0,0.1) 1px, transparent 1px), linear-gradient(to bottom, rgba(0,0,0,0.1) 1px, transparent 1px)`,
                  backgroundSize: '20% 20%'
                }}
                onClick={(e) => {
                  if (emojiPositions.length === 0) {
                    handleEmojiDrop('❤️', 'Beziehung', e);
                  }
                }}
              >
                {emojiPositions.map((pos, index) => (
                  <div
                    key={index}
                    style={{
                      position: 'absolute',
                      fontSize: '32px',
                      cursor: 'move',
                      left: `${pos.x}%`,
                      top: `${pos.y}%`,
                      transform: 'translate(-50%, -50%)'
                    }}
                    title={pos.label}
                  >
                    {pos.emoji}
                  </div>
                ))}
              </div>
              
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '16px' }}>
                <div style={{ fontSize: '14px', fontWeight: '500', transform: 'rotate(-90deg)', transformOrigin: 'center', width: '100px' }}>Wenig Zeit</div>
                <div style={{ fontSize: '14px', fontWeight: '500' }}>Hat mich belastet</div>
                <div style={{ fontSize: '14px', fontWeight: '500' }}>Hat mich erfüllt</div>
                <div style={{ width: '100px' }}></div>
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', maxWidth: '384px', margin: '0 auto 32px' }}>
              {emojis.map((item) => (
                <div
                  key={item.emoji}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '12px',
                    padding: '12px',
                    border: '1px solid #e5e7eb',
                    borderRadius: '8px',
                    cursor: 'pointer',
                    backgroundColor: 'white'
                  }}
                  onClick={(e) => handleEmojiDrop(item.emoji, item.label, e)}
                  onMouseOver={(e) => e.currentTarget.style.backgroundColor = '#f9fafb'}
                  onMouseOut={(e) => e.currentTarget.style.backgroundColor = 'white'}
                >
                  <span style={{ fontSize: '32px' }}>{item.emoji}</span>
                  <span style={{ fontSize: '14px', fontWeight: '500' }}>{item.label}</span>
                </div>
              ))}
            </div>

            <p style={{ textAlign: 'center', fontSize: '14px', color: '#6b7280', margin: '0' }}>
              Platziert die Emojis auf dem Graphen
            </p>
          </div>
        );

      case 3:
        return (
          <div style={baseStyle}>
            <div style={headerStyle}>Hello world project</div>
            <h1 style={titleStyle}>Year Planning</h1>
            <p style={slideCountStyle}>3 / {totalSlides}</p>
            <h2 style={sectionTitleStyle}>01 The past year</h2>
            <div style={{ marginBottom: '32px', textAlign: 'left', maxWidth: '600px', margin: '0 auto 32px' }}>
              <div style={{ marginBottom: '24px' }}>
                <label style={labelStyle}>Worauf seid ihr stolz?</label>
                <textarea
                  style={textAreaStyle}
                  value={textInputs['slide3_proud'] || ''}
                  onChange={(e) => setTextInputs({...textInputs, 'slide3_proud': e.target.value})}
                />
              </div>
              <div style={{ marginBottom: '24px' }}>
                <label style={labelStyle}>Wofür seid ihr dankbar?</label>
                <textarea
                  style={textAreaStyle}
                  value={textInputs['slide3_grateful'] || ''}
                  onChange={(e) => setTextInputs({...textInputs, 'slide3_grateful': e.target.value})}
                />
              </div>
              <div style={{ marginBottom: '24px' }}>
                <label style={labelStyle}>Was wollt ihr nächstes Jahr besser machen?</label>
                <textarea
                  style={textAreaStyle}
                  value={textInputs['slide3_improve'] || ''}
                  onChange={(e) => setTextInputs({...textInputs, 'slide3_improve': e.target.value})}
                />
              </div>
            </div>
            <div style={footerStyle}>
              <p style={{ margin: '0 0 4px 0' }}>Relationship by design</p>
              <p style={{ margin: '0' }}>Feedback geben</p>
            </div>
          </div>
        );

      case 4:
        return (
          <div style={baseStyle}>
            <div style={headerStyle}>Hello world project</div>
            <h1 style={titleStyle}>Year Planning</h1>
            <p style={slideCountStyle}>4 / {totalSlides}</p>
            <h2 style={sectionTitleStyle}>02 Health Check</h2>
            <p style={{ fontSize: '18px', marginBottom: '32px', margin: '0 0 32px 0' }}>
              Schaut auf eure Beziehung: Was läuft gut? Was braucht mehr Achtsamkeit?
            </p>
            <div style={footerStyle}>
              <p style={{ margin: '0 0 4px 0' }}>Relationship by design</p>
              <p style={{ margin: '0' }}>Feedback geben</p>
            </div>
          </div>
        );

      case 5:
        return (
          <div style={baseStyle}>
            <div style={headerStyle}>Hello world project</div>
            <h1 style={titleStyle}>Year Planning</h1>
            <p style={slideCountStyle}>5 / {totalSlides}</p>
            <h2 style={sectionTitleStyle}>02 Health Check</h2>
            <div style={{ marginBottom: '32px', maxWidth: '600px', margin: '0 auto 32px' }}>
              {relationshipAspects.slice(0, 4).map((aspect) => (
                <StarRatingComponent key={aspect} aspect={aspect} />
              ))}
              <p style={{ textAlign: 'center', fontSize: '14px', color: '#6b7280', marginTop: '24px' }}>
                Füllt die Sterne aus, Doppelklick für halbgefüllt
              </p>
            </div>
            <div style={footerStyle}>
              <p style={{ margin: '0 0 4px 0' }}>Relationship by design</p>
              <p style={{ margin: '0' }}>Feedback geben</p>
            </div>
          </div>
        );

      case 6:
        return (
          <div style={baseStyle}>
            <div style={headerStyle}>Hello world project</div>
            <h1 style={titleStyle}>Year Planning</h1>
            <p style={slideCountStyle}>6 / {totalSlides}</p>
            <h2 style={sectionTitleStyle}>02 Health Check</h2>
            <div style={{ marginBottom: '32px', maxWidth: '600px', margin: '0 auto 32px' }}>
              {relationshipAspects.slice(4, 8).map((aspect) => (
                <StarRatingComponent key={aspect} aspect={aspect} />
              ))}
              <p style={{ textAlign: 'center', fontSize: '14px', color: '#6b7280', marginTop: '24px' }}>
                Füllt die Sterne aus, Doppelklick für halbgefüllt
              </p>
            </div>
            <div style={footerStyle}>
              <p style={{ margin: '0 0 4px 0' }}>Relationship by design</p>
              <p style={{ margin: '0' }}>Feedback geben</p>
            </div>
          </div>
        );

      case 7:
        return (
          <div style={baseStyle}>
            <div style={headerStyle}>Hello world project</div>
            <h1 style={titleStyle}>Year Planning</h1>
            <p style={slideCountStyle}>7 / {totalSlides}</p>
            <h2 style={sectionTitleStyle}>01 The past year</h2>
            <p style={{ fontSize: '18px', marginBottom: '32px', margin: '0 0 32px 0' }}>
              Wie fühlt sich das an? Überrascht euch etwas? Wählt zwei Fokus-Felder fürs kommende Jahr aus.
            </p>
            <div style={footerStyle}>
              <p style={{ margin: '0 0 4px 0' }}>Relationship by design</p>
              <p style={{ margin: '0' }}>Feedback geben</p>
            </div>
          </div>
        );

      case 8:
        return (
          <div style={baseStyle}>
            <div style={headerStyle}>Hello world project</div>
            <h1 style={titleStyle}>Year Planning</h1>
            <p style={slideCountStyle}>8 / {totalSlides}</p>
            <h2 style={sectionTitleStyle}>03 The new year</h2>
            <p style={{ fontSize: '18px', marginBottom: '32px', margin: '0 0 32px 0' }}>
              Richtet euren Blick auf das kommende Jahr: Was nehmt ihr euch vor? Was wollt ihr erreichen?
            </p>
            <div style={footerStyle}>
              <p style={{ margin: '0 0 4px 0' }}>Relationship by design</p>
              <p style={{ margin: '0' }}>Feedback geben</p>
            </div>
          </div>
        );

      case 9:
        return (
          <div style={baseStyle}>
            <div style={headerStyle}>Hello world project</div>
            <h1 style={titleStyle}>Year Planning</h1>
            <p style={slideCountStyle}>9 / {totalSlides}</p>
            <h2 style={sectionTitleStyle}>03 The new year</h2>
            <div style={{ marginBottom: '32px', textAlign: 'left', maxWidth: '600px', margin: '0 auto 32px' }}>
              <div style={{ marginBottom: '24px' }}>
                <label style={labelStyle}>Was wollen wir neu initiieren?</label>
                <textarea
                  style={textAreaStyle}
                  value={textInputs['slide9_initiate'] || ''}
                  onChange={(e) => setTextInputs({...textInputs, 'slide9_initiate': e.target.value})}
                />
              </div>
              <div style={{ marginBottom: '24px' }}>
                <label style={labelStyle}>Womit wollen wir aufhören, weil es uns nicht gut tut?</label>
                <textarea
                  style={textAreaStyle}
                  value={textInputs['slide9_stop'] || ''}
                  onChange={(e) => setTextInputs({...textInputs, 'slide9_stop': e.target.value})}
                />
              </div>
              <div style={{ marginBottom: '24px' }}>
                <label style={labelStyle}>Was wollt ihr weiter machen?</label>
                <textarea
                  style={textAreaStyle}
                  value={textInputs['slide9_continue'] || ''}
                  onChange={(e) => setTextInputs({...textInputs, 'slide9_continue': e.target.value})}
                />
              </div>
            </div>
            <div style={footerStyle}>
              <p style={{ margin: '0 0 4px 0' }}>Relationship by design</p>
              <p style={{ margin: '0' }}>Feedback geben</p>
            </div>
          </div>
        );

      case 10:
        return (
          <div style={baseStyle}>
            <div style={headerStyle}>Hello world project</div>
            <h1 style={titleStyle}>Year Planning</h1>
            <p style={slideCountStyle}>10 / {totalSlides}</p>
            <h2 style={sectionTitleStyle}>03 The new year</h2>
            <div style={{ marginBottom: '32px', textAlign: 'left', maxWidth: '600px', margin: '0 auto 32px' }}>
              <div style={{ marginBottom: '24px' }}>
                <label style={labelStyle}>Was wollen wir bis Jahresende geschafft haben?</label>
                <textarea
                  style={textAreaStyle}
                  value={textInputs['slide10_accomplish'] || ''}
                  onChange={(e) => setTextInputs({...textInputs, 'slide10_accomplish': e.target.value})}
                />
              </div>
              <div style={{ marginBottom: '24px' }}>
                <label style={labelStyle}>Welches Ziel nehmen wir aus dem letzten Jahr mit?</label>
                <textarea
                  style={textAreaStyle}
                  value={textInputs['slide10_carry_over'] || ''}
                  onChange={(e) => setTextInputs({...textInputs, 'slide10_carry_over': e.target.value})}
                />
              </div>
              <div style={{ marginBottom: '24px' }}>
                <label style={labelStyle}>Welche Projekte nehmen wir uns vor?</label>
                <textarea
                  style={textAreaStyle}
                  value={textInputs['slide10_projects'] || ''}
                  onChange={(e) => setTextInputs({...textInputs, 'slide10_projects': e.target.value})}
                />
              </div>
            </div>
            <div style={footerStyle}>
              <p style={{ margin: '0 0 4px 0' }}>Relationship by design</p>
              <p style={{ margin: '0' }}>Feedback geben</p>
            </div>
          </div>
        );

      case 11:
        return (
          <div style={baseStyle}>
            <div style={headerStyle}>Hello world project</div>
            <h1 style={titleStyle}>Year Planning</h1>
            <p style={slideCountStyle}>11 / {totalSlides}</p>
            <h2 style={sectionTitleStyle}>03 The new year</h2>
            <p style={{ fontSize: '18px', marginBottom: '32px', margin: '0 0 32px 0' }}>
              Worauf willst du deinen individuellen Fokus legen? Welche Wichtigkeit hat dieser Bereich jeweils?
            </p>
            <div style={footerStyle}>
              <p style={{ margin: '0 0 4px 0' }}>Relationship by design</p>
              <p style={{ margin: '0' }}>Feedback geben</p>
            </div>
          </div>
        );

      case 12:
        return (
          <div style={baseStyle}>
            <div style={headerStyle}>Hello world project</div>
            <h1 style={titleStyle}>Year Planning</h1>
            <p style={slideCountStyle}>12 / {totalSlides}</p>
            <h2 style={sectionTitleStyle}>04 Plan and terminate</h2>
            <p style={{ fontSize: '18px', marginBottom: '32px', margin: '0 0 32px 0' }}>
              Jetzt geht es darum, eure Ideen fürs kommende Jahr zu sammeln und auf ihre Machbarkeit zu untersuchen und zu priorisieren.
            </p>
            <div style={footerStyle}>
              <p style={{ margin: '0 0 4px 0' }}>Relationship by design</p>
              <p style={{ margin: '0' }}>Feedback geben</p>
            </div>
          </div>
        );

      case 13:
        return (
          <div style={baseStyle}>
            <div style={headerStyle}>Hello world project</div>
            <h1 style={titleStyle}>Year Planning</h1>
            <p style={slideCountStyle}>13 / {totalSlides}</p>
            <h2 style={sectionTitleStyle}>04 Plan and terminate</h2>
            <div style={{ marginBottom: '32px' }}>
              <p style={{ fontSize: '16px', marginBottom: '24px' }}>
                Nehmt euch ein Blatt Papier und ordnet eure Ziele auf dem Graphen ein. Ihr könnt wenige große bzw. mehrere kleine Ziele festlegen. Ihr solltet nur die Ziele angehen, die einen hohen Impact haben und einfach umsetzbar sind.
              </p>
              
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
                <div style={{ fontSize: '14px', fontWeight: '500', transform: 'rotate(-90deg)', transformOrigin: 'center', width: '100px' }}>Hoher Impact</div>
                <div style={{ fontSize: '14px', fontWeight: '500' }}>Schwer umsetzbar</div>
                <div style={{ fontSize: '14px', fontWeight: '500' }}>Einfach umsetzbar</div>
                <div style={{ width: '100px' }}></div>
              </div>
              
              <div style={{
                position: 'relative',
                width: '100%',
                height: '300px',
                border: '2px solid #d1d5db',
                background: 'linear-gradient(135deg, #f3f4f6 0%, #e5e7eb 100%)',
                backgroundImage: `linear-gradient(to right, rgba(0,0,0,0.1) 1px, transparent 1px), linear-gradient(to bottom, rgba(0,0,0,0.1) 1px, transparent 1px)`,
                backgroundSize: '20% 20%'
              }}>
                <div style={{
                  position: 'absolute',
                  bottom: '10px',
                  right: '10px',
                  backgroundColor: '#10b981',
                  color: 'white',
                  padding: '8px 16px',
                  borderRadius: '8px',
                  fontSize: '14px',
                  fontWeight: '500'
                }}>
                  diese Ziele geht ihr an
                </div>
              </div>
              
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '16px' }}>
                <div style={{ fontSize: '14px', fontWeight: '500', transform: 'rotate(-90deg)', transformOrigin: 'center', width: '100px' }}>Niedriger Impact</div>
                <div></div>
                <div></div>
                <div style={{ width: '100px' }}></div>
              </div>
              
              <div style={{ textAlign: 'center', marginTop: '24px' }}>
                <button style={{
                  backgroundColor: '#3b82f6',
                  color: 'white',
                  padding: '12px 24px',
                  borderRadius: '8px',
                  border: 'none',
                  cursor: 'pointer',
                  fontSize: '14px',
                  fontWeight: '500'
                }}>
                  Vorlage herunterladen
                </button>
              </div>
            </div>
            <div style={footerStyle}>
              <p style={{ margin: '0 0 4px 0' }}>Relationship by design</p>
              <p style={{ margin: '0' }}>Feedback geben</p>
            </div>
          </div>
        );

      default:
        // Slides 14-23 (Goal planning slides)
        if (currentSlide >= 14 && currentSlide <= 23) {
          const goalNumber = currentSlide - 13;
          return (
            <div style={baseStyle}>
              <div style={headerStyle}>Hello world project</div>
              <h1 style={titleStyle}>Year Planning</h1>
              <p style={slideCountStyle}>{currentSlide} / {totalSlides}</p>
              <h2 style={sectionTitleStyle}>04 Plan and terminate</h2>
              <div style={{ marginBottom: '32px', textAlign: 'left', maxWidth: '600px', margin: '0 auto 32px' }}>
                <div style={{ marginBottom: '24px' }}>
                  <label style={labelStyle}>Ziel</label>
                  <input
                    type="text"
                    style={inputStyle}
                    value={textInputs[`slide${currentSlide}_goal`] || ''}
                    onChange={(e) => setTextInputs({...textInputs, [`slide${currentSlide}_goal`]: e.target.value})}
                  />
                </div>
                <div style={{ marginBottom: '24px' }}>
                  <label style={labelStyle}>Prio</label>
                  <select
                    style={inputStyle}
                    value={textInputs[`slide${currentSlide}_prio`] || ''}
                    onChange={(e) => setTextInputs({...textInputs, [`slide${currentSlide}_prio`]: e.target.value})}
                  >
                    <option value="">Priorität wählen</option>
                    <option value="1">Hoch</option>
                    <option value="2">Mittel</option>
                    <option value="3">Niedrig</option>
                  </select>
                </div>
                <div style={{ marginBottom: '24px' }}>
                  <label style={labelStyle}>Wie messen wir den Erfolg?</label>
                  <textarea
                    style={textAreaStyle}
                    value={textInputs[`slide${currentSlide}_success`] || ''}
                    onChange={(e) => setTextInputs({...textInputs, [`slide${currentSlide}_success`]: e.target.value})}
                  />
                </div>
                <div style={{ marginBottom: '24px' }}>
                  <label style={labelStyle}>Wie gehen wir es Schritt für Schritt an?</label>
                  <textarea
                    style={textAreaStyle}
                    value={textInputs[`slide${currentSlide}_steps`] || ''}
                    onChange={(e) => setTextInputs({...textInputs, [`slide${currentSlide}_steps`]: e.target.value})}
                  />
                </div>
              </div>
              <div style={footerStyle}>
                <p style={{ margin: '0 0 4px 0' }}>Relationship by design</p>
                <p style={{ margin: '0' }}>Feedback geben</p>
              </div>
            </div>
          );
        }

        // Slide 24 (Final slide)
        if (currentSlide === 24) {
          return (
            <div style={baseStyle}>
              <div style={headerStyle}>Hello world project</div>
              <h1 style={titleStyle}>Year Planning</h1>
              <p style={slideCountStyle}>24 / {totalSlides}</p>
              <h2 style={sectionTitleStyle}>Finally</h2>
              <div style={{ marginBottom: '32px' }}>
                <p style={{ fontSize: '24px', marginBottom: '16px' }}>Es ist geschafft 🎉</p>
                <p style={{ fontSize: '18px' }}>Stoßt auf euch an und habt ein geiles Jahr ihr Süßen!</p>
              </div>
              <div style={footerStyle}>
                <p style={{ margin: '0 0 4px 0' }}>Relationship by design</p>
                <p style={{ margin: '0' }}>Feedback geben</p>
              </div>
            </div>
          );
        }

        return (
          <div style={baseStyle}>
            <div style={headerStyle}>Hello world project</div>
            <h1 style={titleStyle}>Year Planning</h1>
            <p style={slideCountStyle}>{currentSlide} / {totalSlides}</p>
            <div style={{ marginBottom: '32px' }}>
              <h2 style={sectionTitleStyle}>Slide {currentSlide}</h2>
              <p style={{ fontSize: '18px', margin: '0' }}>Content for slide {currentSlide} coming soon...</p>
            </div>
            <div style={footerStyle}>
              <p style={{ margin: '0 0 4px 0' }}>Relationship by design</p>
              <p style={{ margin: '0' }}>Feedback geben</p>
            </div>
          </div>
        );
    }
  };

  const nextSlide = () => {
    if (currentSlide < totalSlides) {
      setCurrentSlide(currentSlide + 1);
    }
  };

  const prevSlide = () => {
    if (currentSlide > 1) {
      setCurrentSlide(currentSlide - 1);
    }
  };

  return (
    <div style={{ 
      minHeight: '100vh', 
      backgroundColor: '#f8fafc',
      fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
      color: '#1e293b'
    }}>
      <div style={{ 
        maxWidth: '800px', 
        margin: '0 auto', 
        padding: '40px 20px',
        backgroundColor: 'white',
        minHeight: '100vh',
        boxShadow: '0 0 0 1px rgba(0, 0, 0, 0.05)'
      }}>
        <div style={{ marginBottom: '60px' }}>
          {renderSlide()}
        </div>

        <div style={{ 
          display: 'flex', 
          justifyContent: 'space-between', 
          alignItems: 'center',
          borderTop: '1px solid #e2e8f0',
          paddingTop: '24px'
        }}>
          <button 
            onClick={prevSlide}
            disabled={currentSlide === 1}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              padding: '10px 16px',
              border: 'none',
              borderRadius: '8px',
              backgroundColor: currentSlide === 1 ? '#f1f5f9' : '#3b82f6',
              color: currentSlide === 1 ? '#94a3b8' : 'white',
              cursor: currentSlide === 1 ? 'not-allowed' : 'pointer',
              fontSize: '14px',
              fontWeight: '500',
              transition: 'all 0.2s ease'
            }}
          >
            <ChevronLeft size={16} />
            <span>Zurück</span>
          </button>
          
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px'
          }}>
            {Array.from({ length: totalSlides }, (_, i) => (
              <div
                key={i}
                style={{
                  width: '6px',
                  height: '6px',
                  borderRadius: '50%',
                  backgroundColor: currentSlide === i + 1 ? '#3b82f6' : '#e2e8f0',
                  transition: 'all 0.2s ease'
                }}
              />
            ))}
          </div>
          
          <button 
            onClick={nextSlide}
            disabled={currentSlide === totalSlides}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              padding: '10px 16px',
              border: 'none',
              borderRadius: '8px',
              backgroundColor: currentSlide === totalSlides ? '#f1f5f9' : '#3b82f6',
              color: currentSlide === totalSlides ? '#94a3b8' : 'white',
              cursor: currentSlide === totalSlides ? 'not-allowed' : 'pointer',
              fontSize: '14px',
              fontWeight: '500',
              transition: 'all 0.2s ease'
            }}
          >
            <span>Weiter</span>
            <ChevronRight size={16} />
          </button>
        </div>
      </div>
    </div>
  );
};

export default YearPlannerGenerator;