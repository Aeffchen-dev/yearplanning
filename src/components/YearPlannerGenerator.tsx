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
        marginBottom: '20px',
        fontSize: '18px'
      }}>
        <span style={{ 
          fontWeight: '400',
          color: '#000',
          minWidth: '200px'
        }}>
          {aspect}
        </span>
        <div style={{ display: 'flex', gap: '4px' }}>
          {[1, 2, 3, 4, 5].map((star) => (
            <Star
              key={star}
              size={24}
              style={{
                cursor: 'pointer',
                fill: star <= rating ? '#ffd700' : 
                      star - 0.5 === rating ? '#ffd700' : 'transparent',
                color: star <= rating ? '#ffd700' : 
                       star - 0.5 === rating ? '#ffd700' : '#ddd',
                stroke: '#ddd',
                strokeWidth: 1
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
    const containerStyle = {
      maxWidth: '800px',
      margin: '0 auto',
      padding: '40px 60px',
      textAlign: 'center' as const,
      fontFamily: 'ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, "Noto Sans", sans-serif'
    };

    const headerStyle = {
      fontSize: '14px',
      color: '#666',
      marginBottom: '20px',
      fontWeight: '400'
    };

    const titleStyle = {
      fontSize: '64px',
      fontWeight: '700',
      margin: '0 0 20px 0',
      lineHeight: '1.1',
      color: '#000'
    };

    const slideNumberStyle = {
      fontSize: '20px',
      color: '#666',
      margin: '0 0 40px 0',
      fontWeight: '400'
    };

    const sectionTitleStyle = {
      fontSize: '32px',
      fontWeight: '600',
      margin: '0 0 30px 0',
      color: '#000'
    };

    const descriptionStyle = {
      fontSize: '18px',
      color: '#000',
      margin: '0 0 20px 0',
      lineHeight: '1.5',
      fontWeight: '400'
    };

    const footerStyle = {
      fontSize: '14px',
      color: '#999',
      marginTop: '60px'
    };

    switch (currentSlide) {
      case 1:
        return (
          <div style={containerStyle}>
            <div style={headerStyle}>Hello world project</div>
            <h1 style={titleStyle}>Year Planning</h1>
            <p style={slideNumberStyle}>1 / {totalSlides}</p>
            <h2 style={{ ...sectionTitleStyle, fontSize: '40px' }}>01 The past year</h2>
            <p style={descriptionStyle}>
              Schaut zurück auf das letzte Jahr. Was war los? Ordnet folgende Bereiche im Graphen ein.
            </p>
            <p style={{ ...descriptionStyle, fontSize: '14px', color: '#666' }}>
              Swipe um weiter zu navigieren
            </p>
            <div style={footerStyle}>
              <p style={{ margin: '0 0 4px 0' }}>Relationship by design</p>
              <p style={{ margin: '0' }}>Feedback geben</p>
            </div>
          </div>
        );

      case 2:
        return (
          <div style={containerStyle}>
            <div style={headerStyle}>Hello world project</div>
            <h1 style={titleStyle}>Year Planning</h1>
            <p style={slideNumberStyle}>2 / {totalSlides}</p>
            <h2 style={sectionTitleStyle}>01 The past year</h2>
            
            <div style={{ margin: '40px 0' }}>
              <div style={{ 
                display: 'grid', 
                gridTemplateColumns: '1fr auto auto auto 1fr',
                alignItems: 'center',
                gap: '20px',
                marginBottom: '20px',
                fontSize: '14px',
                fontWeight: '500'
              }}>
                <div></div>
                <div>Nicht im Fokus</div>
                <div style={{ width: '400px' }}></div>
                <div>Im Fokus</div>
                <div></div>
              </div>
              
              <div style={{ position: 'relative' }}>
                <div style={{ 
                  position: 'absolute',
                  left: '-80px',
                  top: '50%',
                  transform: 'translateY(-50%) rotate(-90deg)',
                  fontSize: '14px',
                  fontWeight: '500'
                }}>
                  Viel Zeit
                </div>
                
                <div 
                  ref={graphRef}
                  style={{
                    width: '400px',
                    height: '300px',
                    border: '2px solid #000',
                    backgroundColor: '#fff',
                    margin: '0 auto',
                    position: 'relative',
                    cursor: 'crosshair'
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
                        fontSize: '24px',
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
                
                <div style={{ 
                  position: 'absolute',
                  right: '-80px',
                  top: '50%',
                  transform: 'translateY(-50%) rotate(90deg)',
                  fontSize: '14px',
                  fontWeight: '500'
                }}>
                  Wenig Zeit
                </div>
              </div>
              
              <div style={{ 
                display: 'grid', 
                gridTemplateColumns: '1fr auto auto auto 1fr',
                alignItems: 'center',
                gap: '20px',
                marginTop: '20px',
                fontSize: '14px',
                fontWeight: '500'
              }}>
                <div></div>
                <div>Hat mich belastet</div>
                <div style={{ width: '400px' }}></div>
                <div>Hat mich erfüllt</div>
                <div></div>
              </div>
            </div>

            <div style={{ 
              display: 'grid', 
              gridTemplateColumns: 'repeat(2, 1fr)', 
              gap: '15px', 
              maxWidth: '400px', 
              margin: '40px auto'
            }}>
              {emojis.map((item) => (
                <div
                  key={item.emoji}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '12px',
                    padding: '15px',
                    border: '1px solid #ddd',
                    borderRadius: '8px',
                    cursor: 'pointer',
                    backgroundColor: '#fff',
                    fontSize: '14px',
                    transition: 'background-color 0.2s'
                  }}
                  onClick={(e) => handleEmojiDrop(item.emoji, item.label, e)}
                  onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#f5f5f5'}
                  onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#fff'}
                >
                  <span style={{ fontSize: '24px' }}>{item.emoji}</span>
                  <span>{item.label}</span>
                </div>
              ))}
            </div>

            <p style={{ fontSize: '14px', color: '#666', margin: '20px 0 0 0' }}>
              Platziert die Emojis auf dem Graphen
            </p>
            
            <div style={footerStyle}>
              <p style={{ margin: '0 0 4px 0' }}>Relationship by design</p>
              <p style={{ margin: '0' }}>Feedback geben</p>
            </div>
          </div>
        );

      case 3:
        return (
          <div style={containerStyle}>
            <div style={headerStyle}>Hello world project</div>
            <h1 style={titleStyle}>Year Planning</h1>
            <p style={slideNumberStyle}>3 / {totalSlides}</p>
            <h2 style={sectionTitleStyle}>01 The past year</h2>
            
            <div style={{ textAlign: 'left', maxWidth: '500px', margin: '40px auto' }}>
              <div style={{ marginBottom: '30px' }}>
                <div style={{ fontSize: '18px', fontWeight: '500', marginBottom: '10px' }}>
                  Worauf seid ihr stolz?
                </div>
                <textarea
                  style={{
                    width: '100%',
                    minHeight: '80px',
                    padding: '15px',
                    border: '1px solid #ddd',
                    borderRadius: '4px',
                    fontSize: '16px',
                    fontFamily: 'inherit',
                    resize: 'vertical'
                  }}
                  value={textInputs['slide3_proud'] || ''}
                  onChange={(e) => setTextInputs({...textInputs, 'slide3_proud': e.target.value})}
                />
              </div>
              
              <div style={{ marginBottom: '30px' }}>
                <div style={{ fontSize: '18px', fontWeight: '500', marginBottom: '10px' }}>
                  Wofür seid ihr dankbar?
                </div>
                <textarea
                  style={{
                    width: '100%',
                    minHeight: '80px',
                    padding: '15px',
                    border: '1px solid #ddd',
                    borderRadius: '4px',
                    fontSize: '16px',
                    fontFamily: 'inherit',
                    resize: 'vertical'
                  }}
                  value={textInputs['slide3_grateful'] || ''}
                  onChange={(e) => setTextInputs({...textInputs, 'slide3_grateful': e.target.value})}
                />
              </div>
              
              <div style={{ marginBottom: '30px' }}>
                <div style={{ fontSize: '18px', fontWeight: '500', marginBottom: '10px' }}>
                  Was wollt ihr nächstes Jahr besser machen?
                </div>
                <textarea
                  style={{
                    width: '100%',
                    minHeight: '80px',
                    padding: '15px',
                    border: '1px solid #ddd',
                    borderRadius: '4px',
                    fontSize: '16px',
                    fontFamily: 'inherit',
                    resize: 'vertical'
                  }}
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
          <div style={containerStyle}>
            <div style={headerStyle}>Hello world project</div>
            <h1 style={titleStyle}>Year Planning</h1>
            <p style={slideNumberStyle}>4 / {totalSlides}</p>
            <h2 style={sectionTitleStyle}>02 Health Check</h2>
            <p style={descriptionStyle}>
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
          <div style={containerStyle}>
            <div style={headerStyle}>Hello world project</div>
            <h1 style={titleStyle}>Year Planning</h1>
            <p style={slideNumberStyle}>5 / {totalSlides}</p>
            <h2 style={sectionTitleStyle}>02 Health Check</h2>
            
            <div style={{ maxWidth: '500px', margin: '40px auto', textAlign: 'left' }}>
              {relationshipAspects.slice(0, 4).map((aspect) => (
                <StarRatingComponent key={aspect} aspect={aspect} />
              ))}
              <p style={{ textAlign: 'center', fontSize: '14px', color: '#666', marginTop: '30px' }}>
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
          <div style={containerStyle}>
            <div style={headerStyle}>Hello world project</div>
            <h1 style={titleStyle}>Year Planning</h1>
            <p style={slideNumberStyle}>6 / {totalSlides}</p>
            <h2 style={sectionTitleStyle}>02 Health Check</h2>
            
            <div style={{ maxWidth: '500px', margin: '40px auto', textAlign: 'left' }}>
              {relationshipAspects.slice(4, 8).map((aspect) => (
                <StarRatingComponent key={aspect} aspect={aspect} />
              ))}
              <p style={{ textAlign: 'center', fontSize: '14px', color: '#666', marginTop: '30px' }}>
                Füllt die Sterne aus, Doppelklick für halbgefüllt
              </p>
            </div>
            
            <div style={footerStyle}>
              <p style={{ margin: '0 0 4px 0' }}>Relationship by design</p>
              <p style={{ margin: '0' }}>Feedback geben</p>
            </div>
          </div>
        );

      case 24:
        return (
          <div style={containerStyle}>
            <div style={headerStyle}>Hello world project</div>
            <h1 style={titleStyle}>Year Planning</h1>
            <p style={slideNumberStyle}>24 / {totalSlides}</p>
            <h2 style={sectionTitleStyle}>Finally</h2>
            <div style={{ margin: '40px 0' }}>
              <p style={{ fontSize: '32px', margin: '0 0 20px 0' }}>Es ist geschafft 🎉</p>
              <p style={{ fontSize: '20px', margin: '0' }}>Stoßt auf euch an und habt ein geiles Jahr ihr Süßen!</p>
            </div>
            <div style={footerStyle}>
              <p style={{ margin: '0 0 4px 0' }}>Relationship by design</p>
              <p style={{ margin: '0' }}>Feedback geben</p>
            </div>
          </div>
        );

      default:
        // For other slides, use a simple layout
        return (
          <div style={containerStyle}>
            <div style={headerStyle}>Hello world project</div>
            <h1 style={titleStyle}>Year Planning</h1>
            <p style={slideNumberStyle}>{currentSlide} / {totalSlides}</p>
            <h2 style={sectionTitleStyle}>
              {currentSlide <= 3 ? '01 The past year' :
               currentSlide <= 11 ? '03 The new year' :
               currentSlide <= 23 ? '04 Plan and terminate' : 'Finally'}
            </h2>
            <p style={descriptionStyle}>Content for slide {currentSlide}</p>
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
      backgroundColor: '#fff',
      fontFamily: 'ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, "Noto Sans", sans-serif'
    }}>
      <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
        <div style={{ flex: 1, display: 'flex', alignItems: 'center' }}>
          {renderSlide()}
        </div>

        <div style={{ 
          display: 'flex', 
          justifyContent: 'space-between', 
          alignItems: 'center',
          padding: '20px 40px',
          borderTop: '1px solid #eee'
        }}>
          <button 
            onClick={prevSlide}
            disabled={currentSlide === 1}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              padding: '10px 20px',
              border: '1px solid #ddd',
              borderRadius: '6px',
              backgroundColor: currentSlide === 1 ? '#f5f5f5' : '#fff',
              color: currentSlide === 1 ? '#999' : '#000',
              cursor: currentSlide === 1 ? 'not-allowed' : 'pointer',
              fontSize: '14px',
              fontWeight: '500'
            }}
          >
            <ChevronLeft size={16} />
            <span>Zurück</span>
          </button>
          
          <div style={{ fontSize: '14px', color: '#666' }}>
            Swipe um weiter zu navigieren
          </div>
          
          <button 
            onClick={nextSlide}
            disabled={currentSlide === totalSlides}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              padding: '10px 20px',
              border: '1px solid #ddd',
              borderRadius: '6px',
              backgroundColor: currentSlide === totalSlides ? '#f5f5f5' : '#fff',
              color: currentSlide === totalSlides ? '#999' : '#000',
              cursor: currentSlide === totalSlides ? 'not-allowed' : 'pointer',
              fontSize: '14px',
              fontWeight: '500'
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