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

  return (
    <div className="flex gap-1 md:gap-3">
      {[1, 2, 3, 4, 5].map((star) => (
        <button
          key={star}
          className={`w-8 h-8 md:w-10 md:h-10 transition-all duration-200 ${
            star <= (hover || rating) ? "text-white" : "text-white"
          } ${!readonly ? "hover:scale-110 cursor-pointer" : "cursor-default"}`}
          onMouseEnter={() => !readonly && setHover(star)}
          onMouseLeave={() => !readonly && setHover(0)}
          onClick={() => handleClick(star)}
          disabled={readonly}
        >
          <svg viewBox="0 0 45 43" className="w-full h-full">
            <path
              d="M22.5 2L27.8 15.8L43 17.1L32.3 26.8L35.6 42L22.5 34.3L9.4 42L12.7 26.8L2 17.1L17.2 15.8L22.5 2Z"
              stroke="currentColor"
              strokeWidth="2"
              fill={star <= (hover || rating) ? "currentColor" : "none"}
            />
          </svg>
        </button>
      ))}
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

// Simple slides data - focusing on core functionality first
const slides = [
  {
    id: 1,
    label: { number: "01", text: "The past year" },
    title: "Schaut zurück auf das letzte Jahr. Was war los? Ordnet folgende Bereiche im Graphen ein.",
    content: (
      <div className="flex-1 flex flex-col justify-center">
        <div className="text-center text-white text-xs font-arial">
          Swipe um weiter zu navigieren
        </div>
      </div>
    ),
  },
  {
    id: 2,
    label: { number: "02", text: "Health Check" },
    title: "Schaut auf eure Beziehung: Was läuft gut? Was braucht mehr Achtsamkeit?",
    content: (
      <div className="space-y-8 flex-1">
        <div className="space-y-2">
          <div className="text-white text-base font-arial">Sexualität</div>
          <StarRating />
        </div>
        <div className="space-y-2">
          <div className="text-white text-base font-arial">Kommunikation</div>
          <StarRating />
        </div>
      </div>
    ),
  },
  {
    id: 3,
    label: { number: "03", text: "The new year" },
    content: (
      <div className="space-y-4 flex-1">
        <div className="flex-1">
          <div className="text-white text-base mb-4 font-arial">
            Was wollen wir neu initiieren?
          </div>
          <TextArea placeholder="Wir starten mit ..." />
        </div>
      </div>
    ),
  },
];

interface SlideProps {
  slide: any;
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
          <div className="inline-flex items-center px-2 md:px-3 py-1 md:py-1.5 border border-white rounded-full text-xs md:text-sm font-black font-kokoro">
            {slide.label.number}
            {slide.label.text && (
              <span className="ml-1 hidden sm:inline">{slide.label.text}</span>
            )}
          </div>
        </div>

        {slide.title && (
          <div className="responsive-subtitle leading-[120%] mb-6 md:mb-10 font-arial whitespace-pre-line">
            {slide.title}
          </div>
        )}

        <div className="flex-1 flex flex-col min-h-0">{slide.content}</div>
      </div>
    </div>
  </div>
);

export default function YearPlannerGenerator() {
  const [currentSlide, setCurrentSlide] = useState(0);

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % slides.length);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length);
  };

  return (
    <div className="w-full h-screen bg-black overflow-hidden relative">
      {/* Fixed Header */}
      <div className="absolute top-0 left-0 right-0 z-20 w-full px-4 pt-4">
        <div className="flex items-center gap-2 md:gap-4 mb-2 md:mb-4">
          <h1 className="text-[28px] font-bold italic leading-[120%] font-kokoro text-white">
            Year Planning
          </h1>
          <div className="flex-1 text-right text-sm md:text-base font-arial text-white">
            {currentSlide + 1} / {slides.length}
          </div>
        </div>
      </div>

      {/* Fixed Footer */}
      <div className="absolute bottom-0 left-0 right-0 z-20 w-full px-4 pb-4">
        <div className="flex items-center gap-2 md:gap-4 mt-2 md:mt-4 text-xs md:text-base font-arial text-white">
          <a 
            href="https://relationshipbydesign.de/" 
            target="_blank" 
            rel="noopener noreferrer"
            className="flex-1"
          >
            Relationship by design
          </a>
          <a 
            href="mailto:hello@relationshipbydesign.de?subject=Feedback Year Planning"
            className="hidden sm:block"
          >
            Feedback geben
          </a>
        </div>
      </div>

      {/* Slider container */}
      <div className="flex h-full pt-16 pb-12">
        <div className="w-full h-full flex-shrink-0">
          <Slide
            slide={slides[currentSlide]}
            isActive={true}
            onPrevSlide={prevSlide}
            onNextSlide={nextSlide}
            currentSlide={currentSlide}
            totalSlides={slides.length}
          />
        </div>
      </div>
    </div>
  );
}