import { useState, useEffect } from 'react';

const ChevronLeftIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    className="h-8 w-8"
    fill="none"
    viewBox="0 0 24 24"
    stroke="currentColor"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M15 19l-7-7 7-7"
    />
  </svg>
);

const ChevronRightIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    className="h-8 w-8"
    fill="none"
    viewBox="0 0 24 24"
    stroke="currentColor"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M9 5l7 7-7 7"
    />
  </svg>
);

function HeroSlider() {
  const slides = [
    { url: '/images/slide1.png', alt: 'Movie Banner 1' },
    { url: '/images/slide2.png', alt: 'Movie Banner 2' },
    { url: '/images/slide3.jpg', alt: 'Movie Banner 3' },
    { url: '/images/slide4.jpg', alt: 'Movie Banner 4' },
  ];

  const [currentIndex, setCurrentIndex] = useState(0);

  const prevSlide = () => {
    const isFirstSlide = currentIndex === 0;
    setCurrentIndex(isFirstSlide ? slides.length - 1 : currentIndex - 1);
  };

  const nextSlide = () => {
    const isLastSlide = currentIndex === slides.length - 1;
    setCurrentIndex(isLastSlide ? 0 : currentIndex + 1);
  };
  useEffect(() => {
    const autoPlay = setInterval(nextSlide, 5000);
    return () => clearInterval(autoPlay);
  }, [currentIndex]);

  return (
    <div className="group relative h-[400px] w-full overflow-hidden md:h-[550px]">
      {slides.map((slide, index) => (
        <div
          key={index}
          className={`absolute inset-0 transition-opacity duration-700 ease-in-out ${
            currentIndex === index ? 'opacity-100' : 'opacity-0'
          }`}
          style={{
            backgroundImage: `url(${slide.url})`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
          }}
        />
      ))}
      <div
        onClick={prevSlide}
        className="absolute left-5 top-1/2 hidden -translate-y-1/2 cursor-pointer rounded-full bg-black/30 p-2 text-white group-hover:block"
      >
        <ChevronLeftIcon />
      </div>
      <div
        onClick={nextSlide}
        className="absolute right-5 top-1/2 hidden -translate-y-1/2 cursor-pointer rounded-full bg-black/30 p-2 text-white group-hover:block"
      >
        <ChevronRightIcon />
      </div>
      <div className="absolute bottom-5 left-1/2 flex -translate-x-1/2 space-x-2">
        {slides.map((_, index) => (
          <div
            key={index}
            onClick={() => setCurrentIndex(index)}
            className={`h-3 w-3 cursor-pointer rounded-full transition-colors ${
              currentIndex === index ? 'bg-white' : 'bg-white/50'
            }`}
          ></div>
        ))}
      </div>
    </div>
  );
}

export default HeroSlider;
