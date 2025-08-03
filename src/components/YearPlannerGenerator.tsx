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
        marginBottom: '20px'
      }}>
        <span style={{ 
          fontSize: '18px',
          color: '#000',
          fontWeight: '400'
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
                fill: star <= rating ? '#ffd700' : 'transparent',
                color: star <= rating ? '#ffd700' : '#ccc',
                stroke: '#ccc',
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
    switch (currentSlide) {
      case 1:
        return (
          <div style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            minHeight: '100vh',
            padding: '40px',
            textAlign: 'center'
          }}>
            <div style={{
              fontSize: '14px',
              color: '#666',
              marginBottom: '20px',
              textTransform: 'uppercase',
              letterSpacing: '1px'
            }}>
              Hello world project
            </div>
            
            <h1 style={{
              fontSize: '80px',
              fontWeight: '800',
              margin: '0 0 20px 0',
              color: '#000',
              lineHeight: '0.9'
            }}>
              Year Planning
            </h1>
            
            <div style={{
              fontSize: '20px',
              color: '#666',
              marginBottom: '40px'
            }}>
              1 / {totalSlides}
            </div>
            
            <div style={{
              fontSize: '48px',
              fontWeight: '700',
              color: '#000',
              marginBottom: '30px'
            }}>
              01The past year
            </div>
            
            <div style={{
              fontSize: '18px',
              color: '#000',
              lineHeight: '1.6',
              maxWidth: '600px',
              marginBottom: '20px'
            }}>
              Schaut zurück auf das letzte Jahr. Was war los? Ordnet folgende Bereiche im Graphen ein.
            </div>
            
            <div style={{
              fontSize: '14px',
              color: '#666'
            }}>
              Swipe um weiter zu navigieren
            </div>
            
            <div style={{
              position: 'absolute',
              bottom: '40px',
              fontSize: '14px',
              color: '#999',
              textAlign: 'center'
            }}>
              <div>Relationship by design</div>
              <div>Feedback geben</div>
            </div>
          </div>
        );

      case 2:
        return (
          <div style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            minHeight: '100vh',
            padding: '40px'
          }}>
            <div style={{
              fontSize: '14px',
              color: '#666',
              marginBottom: '20px',
              textTransform: 'uppercase',
              letterSpacing: '1px'
            }}>
              Hello world project
            </div>
            
            <h1 style={{
              fontSize: '80px',
              fontWeight: '800',
              margin: '0 0 20px 0',
              color: '#000',
              lineHeight: '0.9'
            }}>
              Year Planning
            </h1>
            
            <div style={{
              fontSize: '20px',
              color: '#666',
              marginBottom: '40px'
            }}>
              2 / {totalSlides}
            </div>
            
            <div style={{
              fontSize: '36px',
              fontWeight: '700',
              color: '#000',
              marginBottom: '40px'
            }}>
              01The past year
            </div>
            
            {/* Graph section */}
            <div style={{ position: 'relative', marginBottom: '40px' }}>
              {/* Top labels */}
              <div style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                width: '500px',
                marginBottom: '10px',
                fontSize: '14px',
                fontWeight: '600'
              }}>
                <div style={{ width: '60px' }}></div>
                <div>Nicht im Fokus</div>
                <div>Im Fokus</div>
                <div style={{ width: '60px' }}></div>
              </div>
              
              {/* Left label */}
              <div style={{
                position: 'absolute',
                left: '-80px',
                top: '50%',
                transform: 'translateY(-50%) rotate(-90deg)',
                fontSize: '14px',
                fontWeight: '600'
              }}>
                Viel Zeit
              </div>
              
              {/* Right label */}
              <div style={{
                position: 'absolute',
                right: '-80px',
                top: '50%',
                transform: 'translateY(-50%) rotate(90deg)',
                fontSize: '14px',
                fontWeight: '600'
              }}>
                Wenig Zeit
              </div>
              
              {/* Graph */}
              <div 
                ref={graphRef}
                style={{
                  width: '500px',
                  height: '300px',
                  border: '2px solid #000',
                  backgroundColor: '#fff',
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
              
              {/* Bottom labels */}
              <div style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                width: '500px',
                marginTop: '10px',
                fontSize: '14px',
                fontWeight: '600'
              }}>
                <div style={{ width: '60px' }}></div>
                <div>Hat mich belastet</div>
                <div>Hat mich erfüllt</div>
                <div style={{ width: '60px' }}></div>
              </div>
            </div>
            
            {/* Emoji buttons */}
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(2, 1fr)',
              gap: '15px',
              marginBottom: '20px'
            }}>
              {emojis.map((item) => (
                <div
                  key={item.emoji}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '12px',
                    padding: '15px 20px',
                    border: '1px solid #ddd',
                    borderRadius: '8px',
                    cursor: 'pointer',
                    backgroundColor: '#fff',
                    fontSize: '16px',
                    minWidth: '150px'
                  }}
                  onClick={(e) => handleEmojiDrop(item.emoji, item.label, e)}
                >
                  <span style={{ fontSize: '24px' }}>{item.emoji}</span>
                  <span>{item.label}</span>
                </div>
              ))}
            </div>
            
            <div style={{
              fontSize: '14px',
              color: '#666',
              textAlign: 'center'
            }}>
              Platziert die Emojis auf dem Graphen
            </div>
            
            <div style={{
              position: 'absolute',
              bottom: '40px',
              fontSize: '14px',
              color: '#999',
              textAlign: 'center'
            }}>
              <div>Relationship by design</div>
              <div>Feedback geben</div>
            </div>
          </div>
        );

      case 3:
        return (
          <div style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            minHeight: '100vh',
            padding: '40px'
          }}>
            <div style={{
              fontSize: '14px',
              color: '#666',
              marginBottom: '20px',
              textTransform: 'uppercase',
              letterSpacing: '1px'
            }}>
              Hello world project
            </div>
            
            <h1 style={{
              fontSize: '80px',
              fontWeight: '800',
              margin: '0 0 20px 0',
              color: '#000',
              lineHeight: '0.9'
            }}>
              Year Planning
            </h1>
            
            <div style={{
              fontSize: '20px',
              color: '#666',
              marginBottom: '40px'
            }}>
              3 / {totalSlides}
            </div>
            
            <div style={{
              fontSize: '36px',
              fontWeight: '700',
              color: '#000',
              marginBottom: '40px'
            }}>
              01The past year
            </div>
            
            <div style={{
              display: 'flex',
              flexDirection: 'column',
              gap: '40px',
              fontSize: '18px',
              color: '#000'
            }}>
              <div>Worauf seid ihr stolz?</div>
              <div>Wofür seid ihr dankbar?</div>
              <div>Was wollt ihr nächstes Jahr besser machen?</div>
            </div>
            
            <div style={{
              position: 'absolute',
              bottom: '40px',
              fontSize: '14px',
              color: '#999',
              textAlign: 'center'
            }}>
              <div>Relationship by design</div>
              <div>Feedback geben</div>
            </div>
          </div>
        );

      case 4:
        return (
          <div style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            minHeight: '100vh',
            padding: '40px',
            textAlign: 'center'
          }}>
            <div style={{
              fontSize: '14px',
              color: '#666',
              marginBottom: '20px',
              textTransform: 'uppercase',
              letterSpacing: '1px'
            }}>
              Hello world project
            </div>
            
            <h1 style={{
              fontSize: '80px',
              fontWeight: '800',
              margin: '0 0 20px 0',
              color: '#000',
              lineHeight: '0.9'
            }}>
              Year Planning
            </h1>
            
            <div style={{
              fontSize: '20px',
              color: '#666',
              marginBottom: '40px'
            }}>
              4 / {totalSlides}
            </div>
            
            <div style={{
              fontSize: '36px',
              fontWeight: '700',
              color: '#000',
              marginBottom: '30px'
            }}>
              02Health Check
            </div>
            
            <div style={{
              fontSize: '18px',
              color: '#000',
              lineHeight: '1.6',
              maxWidth: '600px'
            }}>
              Schaut auf eure Beziehung: Was läuft gut? Was braucht mehr Achtsamkeit?
            </div>
            
            <div style={{
              position: 'absolute',
              bottom: '40px',
              fontSize: '14px',
              color: '#999',
              textAlign: 'center'
            }}>
              <div>Relationship by design</div>
              <div>Feedback geben</div>
            </div>
          </div>
        );

      case 5:
        return (
          <div style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            minHeight: '100vh',
            padding: '40px'
          }}>
            <div style={{
              fontSize: '14px',
              color: '#666',
              marginBottom: '20px',
              textTransform: 'uppercase',
              letterSpacing: '1px'
            }}>
              Hello world project
            </div>
            
            <h1 style={{
              fontSize: '80px',
              fontWeight: '800',
              margin: '0 0 20px 0',
              color: '#000',
              lineHeight: '0.9'
            }}>
              Year Planning
            </h1>
            
            <div style={{
              fontSize: '20px',
              color: '#666',
              marginBottom: '40px'
            }}>
              5 / {totalSlides}
            </div>
            
            <div style={{
              fontSize: '36px',
              fontWeight: '700',
              color: '#000',
              marginBottom: '40px'
            }}>
              02Health Check
            </div>
            
            <div style={{ minWidth: '500px' }}>
              {relationshipAspects.slice(0, 4).map((aspect) => (
                <StarRatingComponent key={aspect} aspect={aspect} />
              ))}
            </div>
            
            <div style={{
              fontSize: '14px',
              color: '#666',
              marginTop: '20px'
            }}>
              Füllt die Sterne aus, Doppelklick für halbgefüllt
            </div>
            
            <div style={{
              position: 'absolute',
              bottom: '40px',
              fontSize: '14px',
              color: '#999',
              textAlign: 'center'
            }}>
              <div>Relationship by design</div>
              <div>Feedback geben</div>
            </div>
          </div>
        );

      case 6:
        return (
          <div style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            minHeight: '100vh',
            padding: '40px'
          }}>
            <div style={{
              fontSize: '14px',
              color: '#666',
              marginBottom: '20px',
              textTransform: 'uppercase',
              letterSpacing: '1px'
            }}>
              Hello world project
            </div>
            
            <h1 style={{
              fontSize: '80px',
              fontWeight: '800',
              margin: '0 0 20px 0',
              color: '#000',
              lineHeight: '0.9'
            }}>
              Year Planning
            </h1>
            
            <div style={{
              fontSize: '20px',
              color: '#666',
              marginBottom: '40px'
            }}>
              6 / {totalSlides}
            </div>
            
            <div style={{
              fontSize: '36px',
              fontWeight: '700',
              color: '#000',
              marginBottom: '40px'
            }}>
              02Health Check
            </div>
            
            <div style={{ minWidth: '500px' }}>
              {relationshipAspects.slice(4, 8).map((aspect) => (
                <StarRatingComponent key={aspect} aspect={aspect} />
              ))}
            </div>
            
            <div style={{
              fontSize: '14px',
              color: '#666',
              marginTop: '20px'
            }}>
              Füllt die Sterne aus, Doppelklick für halbgefüllt
            </div>
            
            <div style={{
              position: 'absolute',
              bottom: '40px',
              fontSize: '14px',
              color: '#999',
              textAlign: 'center'
            }}>
              <div>Relationship by design</div>
              <div>Feedback geben</div>
            </div>
          </div>
        );

      default:
        return (
          <div style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            minHeight: '100vh',
            padding: '40px',
            textAlign: 'center'
          }}>
            <div style={{
              fontSize: '14px',
              color: '#666',
              marginBottom: '20px',
              textTransform: 'uppercase',
              letterSpacing: '1px'
            }}>
              Hello world project
            </div>
            
            <h1 style={{
              fontSize: '80px',
              fontWeight: '800',
              margin: '0 0 20px 0',
              color: '#000',
              lineHeight: '0.9'
            }}>
              Year Planning
            </h1>
            
            <div style={{
              fontSize: '20px',
              color: '#666',
              marginBottom: '40px'
            }}>
              {currentSlide} / {totalSlides}
            </div>
            
            <div style={{
              fontSize: '36px',
              fontWeight: '700',
              color: '#000',
              marginBottom: '30px'
            }}>
              Slide {currentSlide}
            </div>
            
            <div style={{
              fontSize: '18px',
              color: '#000'
            }}>
              Content coming soon...
            </div>
            
            <div style={{
              position: 'absolute',
              bottom: '40px',
              fontSize: '14px',
              color: '#999',
              textAlign: 'center'
            }}>
              <div>Relationship by design</div>
              <div>Feedback geben</div>
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
      fontFamily: 'system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
      position: 'relative'
    }}>
      {renderSlide()}
      
      {/* Navigation - only show on non-first and non-last slides for clean look */}
      {currentSlide > 1 && (
        <button 
          onClick={prevSlide}
          style={{
            position: 'fixed',
            left: '40px',
            top: '50%',
            transform: 'translateY(-50%)',
            background: 'rgba(0, 0, 0, 0.1)',
            border: 'none',
            borderRadius: '50%',
            width: '50px',
            height: '50px',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}
        >
          <ChevronLeft size={24} color="#000" />
        </button>
      )}
      
      {currentSlide < totalSlides && (
        <button 
          onClick={nextSlide}
          style={{
            position: 'fixed',
            right: '40px',
            top: '50%',
            transform: 'translateY(-50%)',
            background: 'rgba(0, 0, 0, 0.1)',
            border: 'none',
            borderRadius: '50%',
            width: '50px',
            height: '50px',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}
        >
          <ChevronRight size={24} color="#000" />
        </button>
      )}
    </div>
  );
};

export default YearPlannerGenerator;