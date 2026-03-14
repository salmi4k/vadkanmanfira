// Snowfall.tsx
import React from 'react';
import './Snowfall.css';

const snowflakes = Array.from({ length: 40 });

function random(min: number, max: number) {
  return Math.random() * (max - min) + min;
}

export default function Snowfall() {
  return (
    <div className="snowfall">
      {snowflakes.map((_, i) => {
        // Randomize left, duration, delay, size, and opacity
        const left = random(0, 100); // vw
        const duration = random(4, 10); // seconds
        const delay = random(-10, 0); // seconds
        const size = random(1, 2.2); // em
        const opacity = random(0.5, 0.95);
        return (
          <div
            key={i}
            className="snowflake"
            style={{
              left: `${left}vw`,
              animationDuration: `${duration}s`,
              animationDelay: `${delay}s`,
              fontSize: `${size}em`,
              opacity,
            } as React.CSSProperties}
          >
            ❄️
          </div>
        );
      })}
    </div>
  );
}
