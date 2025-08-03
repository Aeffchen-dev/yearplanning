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
  const [showWarning, setShowWarning] = useState(true);
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

  if (showWarning) {
    return (
      <div style={{ 
        minHeight: '100vh', 
        backgroundColor: '#3f3f46', 
        display: 'flex', 
        alignItems: 'center', 
        justifyContent: 'center',
        fontFamily: 'system-ui, -apple-system, sans-serif'
      }}>
        <div style={{ 
          backgroundColor: '#27272a', 
          color: 'white', 
          padding: '32px', 
          borderRadius: '8px', 
          maxWidth: '448px', 
          textAlign: 'center' 
        }}>
          <div style={{ marginBottom: '16px' }}>
            <div style={{ 
              width: '48px', 
              height: '48px', 
              backgroundColor: '#7c3aed', 
              borderRadius: '8px', 
              margin: '0 auto 16px', 
              display: 'flex', 
              alignItems: 'center', 
              justifyContent: 'center' 
            }}>
              <span style={{ color: 'white', fontWeight: 'bold', fontSize: '20px' }}>B</span>
            </div>
          </div>
          <h2 style={{ 
            fontSize: '20px', 
            fontWeight: '600', 
            marginBottom: '8px',
            margin: '0 0 8px 0'
          }}>
            You are previewing user-generated content built with{' '}
            <span style={{ color: '#a855f7' }}>Builder.io</span>
          </h2>
          <p style={{ 
            color: '#d1d5db', 
            marginBottom: '16px', 
            fontSize: '14px',
            margin: '0 0 16px 0'
          }}>
            Please use caution when viewing, as it may include unverified or potentially unsafe material
          </p>
          <div style={{ 
            display: 'flex', 
            alignItems: 'center', 
            justifyContent: 'center', 
            gap: '8px', 
            marginBottom: '12px' 
          }}>
            <input type="checkbox" id="dont-show" style={{ borderRadius: '2px' }} />
            <label htmlFor="dont-show" style={{ fontSize: '14px', color: '#d1d5db' }}>
              Don't show this message again
            </label>
          </div>
          <button 
            style={{ 
              backgroundColor: '#7c3aed', 
              color: 'white', 
              padding: '8px 24px', 
              borderRadius: '4px', 
              border: 'none', 
              cursor: 'pointer',
              fontSize: '14px',
              fontWeight: '500'
            }}
            onClick={() => setShowWarning(false)}
            onMouseOver={(e) => e.currentTarget.style.backgroundColor = '#6d28d9'}
            onMouseOut={(e) => e.currentTarget.style.backgroundColor = '#7c3aed'}
          >
            Show Content
          </button>
        </div>
      </div>
    );
  }

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
        gap: '8px', 
        marginBottom: '16px' 
      }}>
        <span style={{ 
          fontSize: '14px', 
          fontWeight: '500', 
          width: '192px', 
          textAlign: 'left' 
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
                transition: 'color 0.2s',
                fill: star <= rating ? '#facc15' : 
                      star - 0.5 === rating ? '#facc15' : 'transparent',
                color: star <= rating ? '#facc15' : 
                       star - 0.5 === rating ? '#facc15' : '#d1d5db'
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
          <div style={{ textAlign: 'center', padding: '0 20px' }}>
            <div style={{ marginBottom: '16px', fontSize: '14px', color: '#6b7280' }}>
              Hello world project
            </div>
            
            <h1 style={{ 
              fontSize: '72px', 
              fontWeight: 'bold', 
              marginBottom: '32px',
              margin: '0 0 32px 0',
              lineHeight: '1'
            }}>
              Year Planning
            </h1>
            
            <p style={{ 
              fontSize: '18px', 
              color: '#6b7280', 
              marginBottom: '32px',
              margin: '0 0 32px 0'
            }}>
              1 / {totalSlides}
            </p>
            
            <div style={{ marginBottom: '48px' }}>
              <h2 style={{ 
                fontSize: '36px', 
                fontWeight: '600', 
                marginBottom: '16px',
                margin: '0 0 16px 0'
              }}>
                01 The past year
              </h2>
              <p style={{ 
                fontSize: '18px', 
                marginBottom: '16px',
                margin: '0 0 16px 0'
              }}>
                Schaut zurück auf das letzte Jahr. Was war los? Ordnet folgende Bereiche im Graphen ein.
              </p>
              <p style={{ 
                fontSize: '14px', 
                color: '#6b7280',
                margin: '0'
              }}>
                Swipe um weiter zu navigieren
              </p>
            </div>
            
            <div style={{ 
              fontSize: '14px', 
              color: '#9ca3af', 
              marginTop: '32px' 
            }}>
              <p style={{ margin: '0 0 4px 0' }}>Relationship by design</p>
              <p style={{ margin: '0' }}>Feedback geben</p>
            </div>
          </div>
        );

      case 2:
        return (
          <div style={{ padding: '0 20px' }}>
            <div style={{ textAlign: 'center', marginBottom: '32px' }}>
              <div style={{ marginBottom: '16px', fontSize: '14px', color: '#6b7280' }}>
                Hello world project
              </div>
              <h1 style={{ 
                fontSize: '60px', 
                fontWeight: 'bold', 
                marginBottom: '16px',
                margin: '0 0 16px 0',
                lineHeight: '1'
              }}>
                Year Planning
              </h1>
              <p style={{ 
                fontSize: '18px', 
                color: '#6b7280', 
                marginBottom: '16px',
                margin: '0 0 16px 0'
              }}>
                2 / {totalSlides}
              </p>
              <h2 style={{ 
                fontSize: '24px', 
                fontWeight: '600',
                margin: '0'
              }}>
                01 The past year
              </h2>
            </div>
            
            <div style={{ marginBottom: '32px' }}>
              <div style={{ 
                display: 'flex', 
                justifyContent: 'space-between', 
                alignItems: 'center',
                marginBottom: '16px'
              }}>
                <div style={{ 
                  fontSize: '14px', 
                  fontWeight: '500',
                  transform: 'rotate(-90deg)',
                  transformOrigin: 'center',
                  width: '100px'
                }}>
                  Viel Zeit
                </div>
                <div style={{ 
                  fontSize: '14px', 
                  fontWeight: '500'
                }}>
                  Nicht im Fokus
                </div>
                <div style={{ 
                  fontSize: '14px', 
                  fontWeight: '500'
                }}>
                  Im Fokus
                </div>
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
                  backgroundImage: `
                    linear-gradient(to right, rgba(0,0,0,0.1) 1px, transparent 1px),
                    linear-gradient(to bottom, rgba(0,0,0,0.1) 1px, transparent 1px)
                  `,
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
              
              <div style={{ 
                display: 'flex', 
                justifyContent: 'space-between', 
                alignItems: 'center',
                marginTop: '16px'
              }}>
                <div style={{ 
                  fontSize: '14px', 
                  fontWeight: '500',
                  transform: 'rotate(-90deg)',
                  transformOrigin: 'center',
                  width: '100px'
                }}>
                  Wenig Zeit
                </div>
                <div style={{ 
                  fontSize: '14px', 
                  fontWeight: '500'
                }}>
                  Hat mich belastet
                </div>
                <div style={{ 
                  fontSize: '14px', 
                  fontWeight: '500'
                }}>
                  Hat mich erfüllt
                </div>
                <div style={{ width: '100px' }}></div>
              </div>
            </div>

            <div style={{ 
              display: 'grid', 
              gridTemplateColumns: '1fr 1fr', 
              gap: '16px', 
              maxWidth: '384px', 
              margin: '0 auto 32px' 
            }}>
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

            <p style={{ 
              textAlign: 'center', 
              fontSize: '14px', 
              color: '#6b7280',
              margin: '0'
            }}>
              Platziert die Emojis auf dem Graphen
            </p>
          </div>
        );

      default:
        return (
          <div style={{ textAlign: 'center', padding: '0 20px' }}>
            <div style={{ marginBottom: '16px', fontSize: '14px', color: '#6b7280' }}>
              Hello world project
            </div>
            <h1 style={{ 
              fontSize: '60px', 
              fontWeight: 'bold', 
              marginBottom: '16px',
              margin: '0 0 16px 0',
              lineHeight: '1'
            }}>
              Year Planning
            </h1>
            <p style={{ 
              fontSize: '18px', 
              color: '#6b7280', 
              marginBottom: '32px',
              margin: '0 0 32px 0'
            }}>
              {currentSlide} / {totalSlides}
            </p>
            <div style={{ marginBottom: '32px' }}>
              <h2 style={{ 
                fontSize: '24px', 
                fontWeight: '600',
                margin: '0 0 16px 0'
              }}>
                Slide {currentSlide}
              </h2>
              <p style={{ 
                fontSize: '18px',
                margin: '0'
              }}>
                Content for slide {currentSlide} coming soon...
              </p>
            </div>
            <div style={{ 
              fontSize: '14px', 
              color: '#9ca3af' 
            }}>
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
      backgroundColor: 'white',
      fontFamily: 'system-ui, -apple-system, sans-serif'
    }}>
      <div style={{ 
        maxWidth: '1024px', 
        margin: '0 auto', 
        padding: '48px 16px'
      }}>
        <div style={{ marginBottom: '48px' }}>
          {renderSlide()}
        </div>

        <div style={{ 
          display: 'flex', 
          justifyContent: 'space-between', 
          alignItems: 'center',
          padding: '0 20px'
        }}>
          <button 
            onClick={prevSlide}
            disabled={currentSlide === 1}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              padding: '8px 16px',
              border: '1px solid #d1d5db',
              borderRadius: '6px',
              backgroundColor: 'white',
              cursor: currentSlide === 1 ? 'not-allowed' : 'pointer',
              opacity: currentSlide === 1 ? 0.5 : 1,
              fontSize: '14px'
            }}
            onMouseOver={(e) => {
              if (currentSlide !== 1) e.currentTarget.style.backgroundColor = '#f9fafb';
            }}
            onMouseOut={(e) => {
              if (currentSlide !== 1) e.currentTarget.style.backgroundColor = 'white';
            }}
          >
            <ChevronLeft size={16} />
            <span>Previous</span>
          </button>
          
          <div style={{ 
            fontSize: '14px', 
            color: '#6b7280' 
          }}>
            Swipe um weiter zu navigieren
          </div>
          
          <button 
            onClick={nextSlide}
            disabled={currentSlide === totalSlides}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              padding: '8px 16px',
              border: '1px solid #d1d5db',
              borderRadius: '6px',
              backgroundColor: 'white',
              cursor: currentSlide === totalSlides ? 'not-allowed' : 'pointer',
              opacity: currentSlide === totalSlides ? 0.5 : 1,
              fontSize: '14px'
            }}
            onMouseOver={(e) => {
              if (currentSlide !== totalSlides) e.currentTarget.style.backgroundColor = '#f9fafb';
            }}
            onMouseOut={(e) => {
              if (currentSlide !== totalSlides) e.currentTarget.style.backgroundColor = 'white';
            }}
          >
            <span>Next</span>
            <ChevronRight size={16} />
          </button>
        </div>

        <div style={{ 
          marginTop: '48px', 
          textAlign: 'center', 
          fontSize: '14px', 
          color: '#9ca3af' 
        }}>
          <p style={{ margin: '0 0 4px 0' }}>Relationship by design</p>
          <p style={{ margin: '0' }}>Feedback geben</p>
        </div>
      </div>
    </div>
  );
};

export default YearPlannerGenerator;