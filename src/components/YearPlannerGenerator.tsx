import React, { useState, useRef, useEffect } from "react";

interface StarRatingProps {
  value?: number;
  onChange?: (value: number) => void;
  readonly?: boolean;
}

const StarRating: React.FC<StarRatingProps> = ({
  value = 0,
  onChange,
  readonly = false,
}) => {
  const [rating, setRating] = useState(value);
  const [hover, setHover] = useState(0);

  const handleClick = (newRating: number) => {
    if (!readonly) {
      setRating(newRating);
      onChange?.(newRating);
    }
  };

  const handleDoubleClick = (starIndex: number) => {
    if (!readonly) {
      // If clicking on the same star that's currently the rating, cycle through fractional values
      if (starIndex === Math.ceil(rating)) {
        const baseValue = starIndex - 1;
        const currentFraction = rating - baseValue;
        
        if (currentFraction <= 0.33) {
          setRating(baseValue + 0.5);
          onChange?.(baseValue + 0.5);
        } else if (currentFraction <= 0.5) {
          setRating(baseValue + 0.75);
          onChange?.(baseValue + 0.75);
        } else if (currentFraction <= 0.75) {
          setRating(baseValue + 1);
          onChange?.(baseValue + 1);
        } else {
          setRating(baseValue + 0.33);
          onChange?.(baseValue + 0.33);
        }
      } else {
        // For a different star, set to 1/3 filled
        setRating(starIndex - 1 + 0.33);
        onChange?.(starIndex - 1 + 0.33);
      }
    }
  };

  return (
    <div className="flex gap-1 md:gap-3">
      {[1, 2, 3, 4, 5].map((star) => {
        const currentValue = hover || rating;
        const fillAmount = Math.max(0, Math.min(1, currentValue - star + 1));
        
        return (
          <button
            key={star}
            className={`w-8 h-8 md:w-10 md:h-10 transition-colors duration-200 text-white ${!readonly ? "cursor-pointer" : "cursor-default"}`}
            onMouseEnter={() => !readonly && setHover(star)}
            onMouseLeave={() => !readonly && setHover(0)}
            onClick={() => handleClick(star)}
            onDoubleClick={() => handleDoubleClick(star)}
            disabled={readonly}
          >
            <svg viewBox="0 0 45 43" className="w-full h-full">
              <defs>
                <linearGradient id={`starGradient-${star}`} x1="0%" y1="0%" x2="100%" y2="0%">
                  <stop offset={`${fillAmount * 100}%`} stopColor="currentColor" />
                  <stop offset={`${fillAmount * 100}%`} stopColor="transparent" />
                </linearGradient>
              </defs>
              <path
                d="M22.5 2L27.8 15.8L43 17.1L32.3 26.8L35.6 42L22.5 34.3L9.4 42L12.7 26.8L2 17.1L17.2 15.8L22.5 2Z"
                stroke="currentColor"
                strokeWidth="2"
                fill={fillAmount > 0 ? `url(#starGradient-${star})` : "none"}
              />
            </svg>
          </button>
        );
      })}
    </div>
  );
};

interface TextAreaProps {
  placeholder: string;
  value?: string;
  onChange?: (value: string) => void;
  className?: string;
  rows?: number;
}

const TextArea: React.FC<TextAreaProps> = ({
  placeholder,
  value = "",
  onChange,
  className = "",
  rows = 4,
}) => {
  return (
    <div className={`bg-[#FFE299] p-4 flex-1 ${className}`}>
      <textarea
        placeholder={placeholder}
        value={value}
        onChange={(e) => onChange?.(e.target.value)}
        className={`w-full h-full bg-transparent ${value ? 'text-black' : 'text-[#B29F71]'} placeholder-[#B29F71] resize-none border-none outline-none font-arial text-base leading-[120%] min-h-[80px]`}
        rows={rows}
      />
    </div>
  );
};

interface EmojiIconProps {
  emoji: string;
  label: string;
}

const EmojiIcon: React.FC<EmojiIconProps> = ({ emoji, label }) => (
  <div className="flex items-center gap-2">
    <div className="w-12 h-12 bg-black rounded-full flex items-center justify-center">
      <span className="text-2xl">{emoji}</span>
    </div>
    <span className="text-white text-base font-arial flex-1">{label}</span>
  </div>
);

const GraphComponent: React.FC<{ type: "past-year" | "goals" }> = ({
  type,
}) => (
  <div className="relative w-full h-[310px] my-8">
    {/* Axes */}
    <svg className="absolute inset-0 w-full h-full">
      {/* Horizontal line */}
      <path
        d="M0.812554 154.84C0.709031 154.943 0.709031 155.111 0.812554 155.215L2.49956 156.902C2.60309 157.005 2.77093 157.005 2.87446 156.902C2.97798 156.798 2.97798 156.63 2.87446 156.527L1.37489 155.027L2.87446 153.528C2.97798 153.424 2.97798 153.256 2.87446 153.153C2.77093 153.049 2.60309 153.049 2.49956 153.153L0.812554 154.84ZM307.099 155.215C307.203 155.111 307.203 154.943 307.099 154.84L305.412 153.153C305.309 153.049 305.141 153.049 305.037 153.153C304.934 153.256 304.934 153.424 305.037 153.528L306.537 155.027L305.037 156.527C304.934 156.63 304.934 156.798 305.037 156.902C305.141 157.005 305.309 157.005 305.412 156.902L307.099 155.215ZM1 155.027H306.912V154.762H1V155.027Z"
        fill="white"
      />
      {/* Vertical line */}
      <path
        d="M155.143 0.312554C155.04 0.209031 154.872 0.209031 154.768 0.312554L153.081 1.99956C152.978 2.10309 152.978 2.27093 153.081 2.37446C153.185 2.47798 153.353 2.47798 153.456 2.37446L154.956 0.874891L156.455 2.37446C156.559 2.47798 156.727 2.47798 156.83 2.37446C156.934 2.27093 156.934 2.10309 156.83 1.99956L155.143 0.312554ZM154.768 309.599C154.872 309.703 155.04 309.703 155.143 309.599L156.83 307.912C156.934 307.809 156.934 307.641 156.83 307.537C156.727 307.434 156.559 307.434 156.455 307.537L154.956 309.037L153.456 307.537C153.353 307.434 153.185 307.434 153.081 307.537C152.978 307.641 152.978 307.809 153.081 307.912L154.768 309.599ZM154.956 0.5V309.412H155.221V0.5H154.956Z"
        fill="white"
      />
    </svg>

    {/* Labels */}
    {type === "past-year" ? (
      <>
        <div className="absolute left-0 top-1/2 -translate-y-1/2 text-white text-xs leading-tight w-20 font-arial">
          Nicht im Fokus
          <br />
          Wenig Zeit
        </div>
        <div className="absolute right-0 top-1/2 -translate-y-1/2 text-white text-xs leading-tight w-12 text-right font-arial">
          Im Fokus
          <br />
          Viel Zeit
        </div>
        <div className="absolute top-0 left-1/2 -translate-x-1/2 text-white text-xs w-20 text-center font-arial">
          Hat mich erfüllt
        </div>
        <div className="absolute bottom-0 left-1/2 -translate-x-1/2 text-white text-xs w-24 text-center font-arial">
          Hat mich belastet
        </div>
      </>
    ) : (
      <>
        <div className="absolute left-0 top-1/2 -translate-y-1/2 text-white text-xs leading-tight w-20 font-arial">
          Schwer umsetzbar
        </div>
        <div className="absolute right-0 top-1/2 -translate-y-1/2 text-white text-xs leading-tight w-14 text-right font-arial">
          Einfach umsetzbar
        </div>
        <div className="absolute top-0 left-1/2 -translate-x-1/2 text-white text-xs w-18 text-center font-arial">
          Hoher Impact
        </div>
        <div className="absolute bottom-0 left-1/2 -translate-x-1/2 text-white text-xs w-22 text-center font-arial">
          Niedriger Impact
        </div>
        {/* Highlighted quadrant */}
        <div className="absolute top-4 left-1/2 w-[153px] h-[132px] bg-white bg-opacity-5"></div>
        <div className="absolute top-20 left-1/2 translate-x-11 text-white text-opacity-30 text-xs text-center w-16 leading-tight font-arial">
          diese Ziele geht ihr an
        </div>
      </>
    )}
  </div>
);

const FocusAreasSection: React.FC = () => {
  const [focusAreas, setFocusAreas] = useState(Array(5).fill(""));

  const handleFocusChange = (index: number, value: string) => {
    const newFocusAreas = [...focusAreas];
    newFocusAreas[index] = value;
    setFocusAreas(newFocusAreas);
  };

  return (
    <div className="space-y-3 flex-1">
      {[1, 2, 3, 4, 5].map((i, index) => (
        <div key={i} className="bg-[#FFE299] flex flex-col">
          <div className="p-4">
            <textarea
              placeholder="Fokus"
              value={focusAreas[index]}
              onChange={(e) => handleFocusChange(index, e.target.value)}
              className={`w-full bg-transparent ${focusAreas[index] ? 'text-black' : 'text-[#B29F71]'} placeholder-[#B29F71] resize-none border-none outline-none font-arial text-base leading-[120%] min-h-[40px]`}
            />
          </div>
          <div className="px-4 pb-4 flex justify-end">
            <StarRating />
          </div>
        </div>
      ))}
    </div>
  );
};

interface SlideData {
  id: number;
  label: { number: string; text: string };
  title?: string;
  content?: React.ReactNode;
}

const slides: SlideData[] = [
  // Slide 1
  {
    id: 1,
    label: { number: "01", text: "The past year" },
    title:
      "Schaut zurück auf das letzte Jahr. Was war los? Ordnet folgende Bereiche im Graphen ein.",
    content: (
      <div className="flex-1 flex flex-col justify-center">
        <div className="text-center text-white text-xs font-arial">
          Swipe um weiter zu navigieren
        </div>
      </div>
    ),
  },
  // Slide 2
  {
    id: 2,
    label: { number: "01", text: "The past year" },
    content: (
      <div className="space-y-8 flex-1">
        <GraphComponent type="past-year" />
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <EmojiIcon emoji="❤️" label="Beziehung" />
            <EmojiIcon emoji="👯‍♀️" label="Freunde" />
            <EmojiIcon emoji="🐶" label="Kalle" />
          </div>
          <div className="space-y-2">
            <EmojiIcon emoji="🤸" label="Hobbies" />
            <EmojiIcon emoji="🫀" label="Gesundheit" />
            <EmojiIcon emoji="👩‍💻" label="Beruf" />
          </div>
        </div>
        <div className="text-center text-white text-xs font-arial">
          Platziert die Emojis auf dem Graphen
        </div>
      </div>
    ),
  },
  // Slide 3
  {
    id: 3,
    label: { number: "01", text: "The past year" },
    content: (
      <div className="space-y-4 flex-1">
        <div className="flex-1">
          <div className="text-white text-base mb-4 font-arial">
            Worauf seid ihr stolz?
          </div>
          <TextArea placeholder="Wir sind stolz auf ..." />
        </div>
        <div className="flex-1">
          <div className="text-white text-base mb-4 font-arial">
            Wofür seid ihr dankbar?
          </div>
          <TextArea placeholder="Wir sind dankbar für ..." />
        </div>
        <div className="flex-1">
          <div className="text-white text-base mb-4 font-arial">
            Was wollt ihr nächstes Jahr besser machen?
          </div>
          <TextArea placeholder="Wir nehmen uns vor ..." />
        </div>
      </div>
    ),
  },
  // Slide 4
  {
    id: 4,
    label: { number: "02", text: "Health Check" },
    title:
      "Schaut auf eure Beziehung: Was läuft gut? Was braucht mehr Achtsamkeit?",
  },
  // Slide 5
  {
    id: 5,
    label: { number: "02", text: "Health Check" },
    content: (
      <div className="space-y-8 flex-1">
        <div className="space-y-2">
          <div className="text-white text-base font-arial">Sexualität</div>
          <StarRating />
        </div>
        <div className="space-y-2">
          <div className="text-white text-base font-arial">
            Emotionale Verbundenheit
          </div>
          <StarRating />
        </div>
        <div className="space-y-2">
          <div className="text-white text-base font-arial">Kommunikation</div>
          <StarRating />
        </div>
        <div className="space-y-2">
          <div className="text-white text-base font-arial">Vertrauen</div>
          <StarRating />
        </div>
        <div className="text-center text-white text-xs font-arial mt-auto">
          Füllt die Sterne aus, Doppelklick für halbgefüllt
        </div>
      </div>
    ),
  },
  // Slide 6
  {
    id: 6,
    label: { number: "02", text: "Health Check" },
    content: (
      <div className="space-y-8 flex-1">
        <div className="space-y-2">
          <div className="text-white text-base font-arial">Gemeinsame Zeit</div>
          <StarRating />
        </div>
        <div className="space-y-2">
          <div className="text-white text-base font-arial">
            Zusammen gelacht
          </div>
          <StarRating />
        </div>
        <div className="space-y-2">
          <div className="text-white text-base font-arial">
            Konfliktbewältigung
          </div>
          <StarRating />
        </div>
        <div className="space-y-2">
          <div className="text-white text-base font-arial">
            Freiheit, Unabhängigkeit
          </div>
          <StarRating />
        </div>
        <div className="text-center text-white text-xs font-arial mt-auto">
          Füllt die Sterne aus, Doppelklick für halbgefüllt
        </div>
      </div>
    ),
  },
  // Slide 7
  {
    id: 7,
    label: { number: "02", text: "Health Check" },
    content: (
      <div className="flex-1 flex flex-col">
        <div className="text-white text-base mb-4 font-arial">
          Wie fühlt sich das an? Überrascht euch etwas? Wählt zwei Fokus-Felder
          fürs kommende Jahr aus.
        </div>
        <TextArea
          placeholder="Unsere Erkenntnisse"
          className="flex-1"
          rows={12}
        />
      </div>
    ),
  },
  // Slide 8
  {
    id: 8,
    label: { number: "03", text: "The new year" },
    title:
      "Richtet euren Blick auf das kommende Jahr: Was nehmt ihr euch vor? Was wollt ihr erreichen?",
  },
  // Slide 9
  {
    id: 9,
    label: { number: "03", text: "The new year" },
    content: (
      <div className="space-y-4 flex-1">
        <div className="flex-1">
          <div className="text-white text-base mb-4 font-arial">
            Was wollen wir neu initiieren?
          </div>
          <TextArea placeholder="Wir starten mit ..." />
        </div>
        <div className="flex-1">
          <div className="text-white text-base mb-4 font-arial">
            Womit wollen wir aufhören, weil es uns nicht gut tut?
          </div>
          <TextArea placeholder="Wir stoppen ..." />
        </div>
        <div className="flex-1">
          <div className="text-white text-base mb-4 font-arial">
            Was wollt ihr weiter machen?
          </div>
          <TextArea placeholder="Wir machen weiter mit ..." />
        </div>
      </div>
    ),
  },
  // Slide 10
  {
    id: 10,
    label: { number: "03", text: "The new year" },
    content: (
      <div className="space-y-4 flex-1">
        <div className="flex-1">
          <div className="text-white text-base mb-4 font-arial">
            Was wollen wir bis Jahresende geschafft haben?
          </div>
          <TextArea placeholder="Wir schaffen ..." />
        </div>
        <div className="flex-1">
          <div className="text-white text-base mb-4 font-arial">
            Welches Ziel nehmen wir aus dem letzten Jahr mit?
          </div>
          <TextArea placeholder="Wir nehmen mit ..." />
        </div>
        <div className="flex-1">
          <div className="text-white text-base mb-4 font-arial">
            Welche Projekte nehmen wir uns vor?
          </div>
          <TextArea placeholder="Unsere Projekte ..." />
        </div>
      </div>
    ),
  },
  // Slide 11
  {
    id: 11,
    label: { number: "03", text: "The new year" },
    content: (
      <div className="space-y-6 flex-1">
        <div className="text-white text-base font-arial">
          Worauf willst du deinen individuellen Fokus legen? Welche Wichtigkeit
          hat dieser Bereich jeweils?
        </div>
        <FocusAreasSection />
      </div>
    ),
  },
  // Slide 12
  {
    id: 12,
    label: { number: "04", text: "Plan and terminate" },
    title:
      "Jetzt geht es darum, eure Ideen fürs kommende Jahr zu sammeln und auf ihre Machbarkeit zu untersuchen und zu priorisieren.",
  },
  // Slide 13
  {
    id: 13,
    label: { number: "04", text: "Plan and terminate" },
    content: (
      <div className="space-y-6 flex-1">
        <div className="text-white text-base font-arial">
          Nehmt euch ein Blatt Papier und ordnet eure Ziele auf dem Graphen ein.
          Ihr könnt wenige große bzw. mehrere kleine Ziele festlegen. Ihr
          solltet nur die Ziele angehen, die einen hohen Impact haben und
          einfach umsetzbar sind.
        </div>
        <GraphComponent type="goals" />
        <button className="w-full h-12 border border-white rounded-full text-white text-base font-arial hover:bg-white hover:text-black transition-colors">
          Vorlage herunterladen
        </button>
      </div>
    ),
  },
];

// Generate slides 14-23 with goal planning template
for (let i = 14; i <= 23; i++) {
  slides.push({
    id: i,
    label: { number: "04", text: "Plan and terminate" },
    content: (
      <div className="space-y-6 flex-1">
        <div>
          <div className="text-white text-base mb-2 font-arial">Ziel</div>
          <TextArea placeholder="Ziel beschreiben" />
        </div>
        <div className="flex items-center gap-2">
          <div className="text-white text-base flex-1 font-arial">Prio</div>
          <StarRating />
        </div>
        <div>
          <div className="text-white text-base mb-2 font-arial">
            Wie messen wir den Erfolg?
          </div>
          <TextArea placeholder="So messen wir ..." />
        </div>
        <div>
          <div className="text-white text-base mb-2 font-arial">
            Wie gehen wir es Schritt für Schritt an?
          </div>
          <TextArea placeholder="Diese Schritte machen wir, um es zu erreichen" />
        </div>
      </div>
    ),
  });
}

// Final slide 24
slides.push({
  id: 24,
  label: { number: "Finally", text: "" },
  title:
    "Es ist geschafft 🎉\nStoßt auf euch an und habt ein geiles Jahr ihr Süßen!",
});

interface SlideProps {
  slide: SlideData;
  isActive: boolean;
  onPrevSlide: () => void;
  onNextSlide: () => void;
  currentSlide: number;
  totalSlides: number;
}

const Slide: React.FC<SlideProps> = ({
  slide,
  isActive,
  onPrevSlide,
  onNextSlide,
  currentSlide,
  totalSlides,
}) => (
  <div className="w-full h-full flex items-center justify-center bg-black text-white select-none">
    <div className="w-full max-w-[500px] max-h-[780px] h-full flex flex-col responsive-main-padding">
      <div className="flex-1 bg-[#161616] rounded-lg md:rounded-2xl responsive-card-padding flex flex-col min-h-0 relative">
        <button
          onClick={onPrevSlide}
          className="absolute left-0 top-0 w-8 h-full z-10 cursor-pointer"
          disabled={currentSlide === 0}
          aria-label="Previous slide"
        />

        <button
          onClick={onNextSlide}
          className="absolute right-0 top-0 w-8 h-full z-10 cursor-pointer"
          disabled={currentSlide === totalSlides - 1}
          aria-label="Next slide"
        />

        <div className="mb-4 md:mb-6">
          <div className="inline-flex items-center px-3 py-1 border border-white rounded-full text-xs md:text-sm font-black font-kokoro leading-[100%]">
            {slide.label.number}
            {slide.label.text && (
              <span className="ml-1 hidden sm:inline">{slide.label.text}</span>
            )}
          </div>
        </div>

        {slide.title && (
          <div className={`font-arial whitespace-pre-line ${[1, 4, 8, 12, 24].includes(slide.id) ? 'text-[32px] leading-[120%] text-center flex-1 flex items-center justify-center' : 'responsive-subtitle leading-[120%] mb-6 md:mb-10'}`}>
            {slide.title}
          </div>
        )}

        <div className={`${slide.title && [1, 4, 8, 12, 24].includes(slide.id) ? '' : 'flex-1 flex flex-col min-h-0'}`}>{slide.content}</div>
      </div>
    </div>
  </div>
);

export default function YearPlannerGenerator() {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const [startX, setStartX] = useState(0);
  const [translateX, setTranslateX] = useState(0);
  const sliderRef = useRef<HTMLDivElement>(null);

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % slides.length);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length);
  };

  const goToSlide = (index: number) => {
    setCurrentSlide(index);
  };

  // Touch/Mouse handlers
  const handleStart = (clientX: number) => {
    setIsDragging(true);
    setStartX(clientX);
  };

  const handleMove = (clientX: number) => {
    if (!isDragging) return;
    const diff = clientX - startX;
    setTranslateX(diff);
  };

  const handleEnd = () => {
    if (!isDragging) return;
    setIsDragging(false);

    if (Math.abs(translateX) > 100) {
      if (translateX > 0) {
        prevSlide();
      } else {
        nextSlide();
      }
    }
    setTranslateX(0);
  };

  // Keyboard navigation and iOS keyboard handling
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "ArrowLeft") prevSlide();
      if (e.key === "ArrowRight") nextSlide();
    };

    // iOS keyboard handling to prevent page position issues
    const handleFocusIn = () => {
      if (/iPhone|iPad|iPod/.test(navigator.userAgent)) {
        document.body.style.position = 'fixed';
        document.body.style.width = '100%';
      }
    };

    const handleFocusOut = () => {
      if (/iPhone|iPad|iPod/.test(navigator.userAgent)) {
        document.body.style.position = '';
        document.body.style.width = '';
        setTimeout(() => {
          window.scrollTo(0, 0);
        }, 100);
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    document.addEventListener("focusin", handleFocusIn);
    document.addEventListener("focusout", handleFocusOut);
    
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      document.removeEventListener("focusin", handleFocusIn);
      document.removeEventListener("focusout", handleFocusOut);
    };
  }, []);

  return (
    <div className="w-full h-screen bg-black overflow-hidden relative">
      {/* Fixed Header */}
      <div className="absolute top-0 left-0 right-0 z-20 w-full px-4 pt-4">
        <div className="flex items-center gap-2 md:gap-4 mb-4">
          <h1 className="text-[28px] font-bold italic leading-[120%] font-kokoro text-white">
            Year Planning
          </h1>
          <div className="flex-1 text-right text-sm md:text-base font-arial text-white">
            {currentSlide + 1} / 24
          </div>
        </div>
      </div>

      {/* Fixed Footer */}
      <div className="absolute bottom-0 left-0 right-0 z-20 w-full px-4 pb-4">
        <div className="flex items-center gap-2 mt-4 text-base font-arial text-white">
          <a 
            href="https://relationshipbydesign.de/" 
            target="_blank" 
            rel="noopener noreferrer"
            className="flex-1 whitespace-nowrap overflow-hidden text-ellipsis"
          >
            Relationship by design
          </a>
          <a 
            href="mailto:hello@relationshipbydesign.de?subject=Feedback Year Planning"
            className="whitespace-nowrap"
          >
            Feedback geben
          </a>
        </div>
      </div>

      {/* Slider container */}
      <div
        ref={sliderRef}
        className="flex h-full transition-transform duration-300 ease-out"
        style={{
          transform: `translateX(calc(-${currentSlide * (100 / slides.length)}% + ${translateX}px))`,
          width: `${slides.length * 100}vw`,
          paddingTop: '54px',
          paddingBottom: '54px'
        }}
        onTouchStart={(e) => handleStart(e.touches[0].clientX)}
        onTouchMove={(e) => handleMove(e.touches[0].clientX)}
        onTouchEnd={handleEnd}
      >
        {slides.map((slide, index) => (
          <div
            key={slide.id}
            className="w-full h-full flex-shrink-0"
            style={{ width: `${100 / slides.length}%` }}
          >
            <Slide
              slide={slide}
              isActive={index === currentSlide}
              onPrevSlide={prevSlide}
              onNextSlide={nextSlide}
              currentSlide={currentSlide}
              totalSlides={slides.length}
            />
          </div>
        ))}
      </div>
    </div>
  );
}