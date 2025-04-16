import React, { useState, useRef } from 'react';

interface ImageMagnifierProps {
  src: string;
  alt: string;
}

const ImageMagnifier: React.FC<ImageMagnifierProps> = ({ src, alt }) => {
  const [[x, y], setXY] = useState([0, 0]);
  const [[imgWidth, imgHeight], setSize] = useState([0, 0]);
  const [showMagnifier, setShowMagnifier] = useState(false);

  return (
    <div className="relative">
      <img
        src={src}
        className="w-full h-[600px] object-contain"
        onMouseEnter={(e) => {
          const elem = e.currentTarget;
          const { width, height } = elem.getBoundingClientRect();
          setSize([width, height]);
          setShowMagnifier(true);
        }}
        onMouseMove={(e) => {
          const elem = e.currentTarget;
          const { top, left } = elem.getBoundingClientRect();
          const x = e.pageX - left - window.pageXOffset;
          const y = e.pageY - top - window.pageYOffset;
          setXY([x, y]);
        }}
        onMouseLeave={() => {
          setShowMagnifier(false);
        }}
        alt={alt}
      />

      {showMagnifier && (
        <div
          className="absolute border-2 border-purple-500 rounded-full overflow-hidden pointer-events-none"
          style={{
            width: '200px',
            height: '200px',
            left: `${x - 100}px`,
            top: `${y - 100}px`,
            backgroundImage: `url('${src}')`,
            backgroundPosition: `${-x * 2 + 100}px ${-y * 2 + 100}px`,
            backgroundSize: `${imgWidth * 2}px ${imgHeight * 2}px`,
            backgroundRepeat: 'no-repeat',
            boxShadow: '0 3px 6px rgba(0,0,0,0.3)'
          }}
        />
      )}
    </div>
  );
};

export default ImageMagnifier; 