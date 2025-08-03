import React, { useState, useRef } from 'react';
import { Button } from './ui/button';
import { Textarea } from './ui/textarea';
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
      <div className="flex items-center space-x-2 mb-4">
        <span className="text-sm font-medium w-48 text-left">{aspect}</span>
        <div className="flex space-x-1">
          {[1, 2, 3, 4, 5].map((star) => (
            <Star
              key={star}
              className={`w-6 h-6 cursor-pointer transition-colors ${
                star <= rating 
                  ? 'fill-yellow-400 text-yellow-400' 
                  : star - 0.5 === rating
                  ? 'fill-yellow-400/50 text-yellow-400'
                  : 'text-gray-300'
              }`}
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
          <div className="text-center space-y-8">
            <h1 className="text-6xl font-bold mb-8">Year Planning</h1>
            <p className="text-lg text-gray-600">1 / {totalSlides}</p>
            <div className="space-y-4">
              <h2 className="text-3xl font-semibold">01 The past year</h2>
              <p className="text-lg">
                Schaut zurück auf das letzte Jahr. Was war los? Ordnet folgende Bereiche im Graphen ein.
              </p>
              <p className="text-sm text-gray-500">Swipe um weiter zu navigieren</p>
            </div>
            <div className="mt-8 text-sm text-gray-400">
              <p>Relationship by design</p>
              <p>Feedback geben</p>
            </div>
          </div>
        );

      case 2:
        return (
          <div className="space-y-8">
            <div className="text-center">
              <h1 className="text-5xl font-bold mb-4">Year Planning</h1>
              <p className="text-lg text-gray-600">2 / {totalSlides}</p>
              <h2 className="text-2xl font-semibold mt-4">01 The past year</h2>
            </div>
            
            <div 
              ref={graphRef}
              className="relative w-full h-96 border-2 border-gray-300 bg-gradient-to-br from-red-50 via-yellow-50 to-green-50 cursor-crosshair"
              style={{
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
              <div className="absolute -left-24 top-4 text-sm font-medium -rotate-90 origin-center">
                Viel Zeit
              </div>
              <div className="absolute -left-24 bottom-4 text-sm font-medium -rotate-90 origin-center">
                Wenig Zeit
              </div>
              <div className="absolute left-4 -top-8 text-sm font-medium">
                Nicht im Fokus
              </div>
              <div className="absolute right-4 -top-8 text-sm font-medium">
                Im Fokus
              </div>
              <div className="absolute left-4 -bottom-8 text-sm font-medium">
                Hat mich belastet
              </div>
              <div className="absolute right-4 -bottom-8 text-sm font-medium">
                Hat mich erfüllt
              </div>

              {emojiPositions.map((pos, index) => (
                <div
                  key={index}
                  className="absolute text-2xl cursor-move"
                  style={{ left: `${pos.x}%`, top: `${pos.y}%`, transform: 'translate(-50%, -50%)' }}
                  title={pos.label}
                >
                  {pos.emoji}
                </div>
              ))}
            </div>

            <div className="grid grid-cols-2 gap-4 max-w-md mx-auto">
              {emojis.map((item) => (
                <div
                  key={item.emoji}
                  className="flex items-center space-x-3 p-3 border border-gray-200 rounded-lg cursor-pointer hover:bg-gray-50"
                  onClick={(e) => handleEmojiDrop(item.emoji, item.label, e)}
                >
                  <span className="text-2xl">{item.emoji}</span>
                  <span className="text-sm font-medium">{item.label}</span>
                </div>
              ))}
            </div>

            <p className="text-center text-sm text-gray-600">
              Platziert die Emojis auf dem Graphen
            </p>
          </div>
        );

      case 3:
        return (
          <div className="space-y-8">
            <div className="text-center">
              <h1 className="text-5xl font-bold mb-4">Year Planning</h1>
              <p className="text-lg text-gray-600">3 / {totalSlides}</p>
              <h2 className="text-2xl font-semibold mt-4">01 The past year</h2>
            </div>
            
            <div className="space-y-6 max-w-2xl mx-auto">
              <div>
                <h3 className="text-xl font-semibold mb-3">Worauf seid ihr stolz?</h3>
                <Textarea 
                  className="w-full h-24"
                  value={textInputs.proud || ''}
                  onChange={(e) => setTextInputs(prev => ({ ...prev, proud: e.target.value }))}
                />
              </div>
              
              <div>
                <h3 className="text-xl font-semibold mb-3">Wofür seid ihr dankbar?</h3>
                <Textarea 
                  className="w-full h-24"
                  value={textInputs.grateful || ''}
                  onChange={(e) => setTextInputs(prev => ({ ...prev, grateful: e.target.value }))}
                />
              </div>
              
              <div>
                <h3 className="text-xl font-semibold mb-3">Was wollt ihr nächstes Jahr besser machen?</h3>
                <Textarea 
                  className="w-full h-24"
                  value={textInputs.improve || ''}
                  onChange={(e) => setTextInputs(prev => ({ ...prev, improve: e.target.value }))}
                />
              </div>
            </div>
          </div>
        );

      case 4:
        return (
          <div className="space-y-8">
            <div className="text-center">
              <h1 className="text-5xl font-bold mb-4">Year Planning</h1>
              <p className="text-lg text-gray-600">4 / {totalSlides}</p>
              <h2 className="text-2xl font-semibold mt-4">02 Health Check</h2>
            </div>
            
            <div className="text-center space-y-4">
              <p className="text-lg">
                Schaut auf eure Beziehung: Was läuft gut? Was braucht mehr Achtsamkeit?
              </p>
            </div>
          </div>
        );

      case 5:
        return (
          <div className="space-y-8">
            <div className="text-center">
              <h1 className="text-5xl font-bold mb-4">Year Planning</h1>
              <p className="text-lg text-gray-600">5 / {totalSlides}</p>
              <h2 className="text-2xl font-semibold mt-4">02 Health Check</h2>
            </div>
            
            <div className="max-w-2xl mx-auto space-y-6">
              {relationshipAspects.slice(0, 4).map((aspect) => (
                <StarRatingComponent key={aspect} aspect={aspect} />
              ))}
              <p className="text-sm text-gray-600 text-center mt-4">
                Füllt die Sterne aus, Doppelklick für halbgefüllt
              </p>
            </div>
          </div>
        );

      case 6:
        return (
          <div className="space-y-8">
            <div className="text-center">
              <h1 className="text-5xl font-bold mb-4">Year Planning</h1>
              <p className="text-lg text-gray-600">6 / {totalSlides}</p>
              <h2 className="text-2xl font-semibold mt-4">02 Health Check</h2>
            </div>
            
            <div className="max-w-2xl mx-auto space-y-6">
              {relationshipAspects.slice(4, 8).map((aspect) => (
                <StarRatingComponent key={aspect} aspect={aspect} />
              ))}
              <p className="text-sm text-gray-600 text-center mt-4">
                Füllt die Sterne aus, Doppelklick für halbgefüllt
              </p>
            </div>
          </div>
        );

      case 7:
        return (
          <div className="space-y-8">
            <div className="text-center">
              <h1 className="text-5xl font-bold mb-4">Year Planning</h1>
              <p className="text-lg text-gray-600">7 / {totalSlides}</p>
              <h2 className="text-2xl font-semibold mt-4">01 The past year</h2>
            </div>
            
            <div className="text-center space-y-4">
              <p className="text-lg">
                Wie fühlt sich das an? Überrascht euch etwas? Wählt zwei Fokus-Felder fürs kommende Jahr aus.
              </p>
            </div>
          </div>
        );

      case 8:
        return (
          <div className="space-y-8">
            <div className="text-center">
              <h1 className="text-5xl font-bold mb-4">Year Planning</h1>
              <p className="text-lg text-gray-600">8 / {totalSlides}</p>
              <h2 className="text-2xl font-semibold mt-4">03 The new year</h2>
            </div>
            
            <div className="text-center space-y-4">
              <p className="text-lg">
                Richtet euren Blick auf das kommende Jahr: Was nehmt ihr euch vor? Was wollt ihr erreichen?
              </p>
            </div>
          </div>
        );

      case 9:
        return (
          <div className="space-y-8">
            <div className="text-center">
              <h1 className="text-5xl font-bold mb-4">Year Planning</h1>
              <p className="text-lg text-gray-600">9 / {totalSlides}</p>
              <h2 className="text-2xl font-semibold mt-4">03 The new year</h2>
            </div>
            
            <div className="space-y-6 max-w-2xl mx-auto">
              <div>
                <h3 className="text-xl font-semibold mb-3">Was wollen wir neu initiieren?</h3>
                <Textarea 
                  className="w-full h-24"
                  value={textInputs.initiate || ''}
                  onChange={(e) => setTextInputs(prev => ({ ...prev, initiate: e.target.value }))}
                />
              </div>
              
              <div>
                <h3 className="text-xl font-semibold mb-3">Womit wollen wir aufhören, weil es uns nicht gut tut?</h3>
                <Textarea 
                  className="w-full h-24"
                  value={textInputs.stop || ''}
                  onChange={(e) => setTextInputs(prev => ({ ...prev, stop: e.target.value }))}
                />
              </div>
            </div>
          </div>
        );

      // Adding more slides to reach 24 total
      case 10:
        return (
          <div className="space-y-8">
            <div className="text-center">
              <h1 className="text-5xl font-bold mb-4">Year Planning</h1>
              <p className="text-lg text-gray-600">10 / {totalSlides}</p>
              <h2 className="text-2xl font-semibold mt-4">04 Goals & Vision</h2>
            </div>
            
            <div className="text-center space-y-4">
              <p className="text-lg">
                Was sind eure gemeinsamen Ziele für das kommende Jahr?
              </p>
            </div>
          </div>
        );

      default:
        return (
          <div className="text-center space-y-8">
            <h1 className="text-5xl font-bold mb-4">Year Planning</h1>
            <p className="text-lg text-gray-600">{currentSlide} / {totalSlides}</p>
            <div className="space-y-4">
              <h2 className="text-2xl font-semibold">Slide {currentSlide}</h2>
              <p className="text-lg">Content for slide {currentSlide} coming soon...</p>
            </div>
            <div className="mt-8 text-sm text-gray-400">
              <p>Relationship by design</p>
              <p>Feedback geben</p>
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
    <div className="min-h-screen bg-white">
      <div className="container mx-auto px-4 py-12 max-w-4xl">
        <div className="mb-8 text-center">
          <p className="text-sm text-gray-500 mb-4">Hello world project</p>
        </div>

        <div className="mb-12">
          {renderSlide()}
        </div>

        <div className="flex justify-between items-center">
          <Button 
            variant="outline" 
            onClick={prevSlide}
            disabled={currentSlide === 1}
            className="flex items-center space-x-2"
          >
            <ChevronLeft className="w-4 h-4" />
            <span>Previous</span>
          </Button>
          
          <div className="text-sm text-gray-500">
            Swipe um weiter zu navigieren
          </div>
          
          <Button 
            variant="outline" 
            onClick={nextSlide}
            disabled={currentSlide === totalSlides}
            className="flex items-center space-x-2"
          >
            <span>Next</span>
            <ChevronRight className="w-4 h-4" />
          </Button>
        </div>

        <div className="mt-12 text-center text-sm text-gray-400 space-y-1">
          <p>Relationship by design</p>
          <p>Feedback geben</p>
        </div>
      </div>
    </div>
  );
};

export default YearPlannerGenerator;