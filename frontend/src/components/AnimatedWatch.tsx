import { useEffect, useState } from 'react';

const AnimatedWatch = ({ size = 200 }: { size?: number }) => {
  const [time, setTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => {
      setTime(new Date());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const seconds = time.getSeconds() * 6; // 360/60 = 6 degrees per second
  const minutes = time.getMinutes() * 6 + (time.getSeconds() * 0.1); // 6 degrees per minute + smooth seconds
  const hours = (time.getHours() % 12) * 30 + (time.getMinutes() * 0.5); // 30 degrees per hour + smooth minutes

  return (
    <div className="relative animate-float" style={{ width: size, height: size }}>
      {/* Watch Case */}
      <div className="absolute inset-0 rounded-full bg-luxury-gradient shadow-luxury-glow border-4 border-luxury-silver">
        {/* Watch Face */}
        <div className="absolute inset-2 rounded-full bg-luxury-white border border-luxury-silver-dark">
          {/* Hour Markers */}
          {[...Array(12)].map((_, i) => (
            <div
              key={i}
              className="absolute w-0.5 h-6 bg-luxury-black origin-bottom"
              style={{
                top: '8px',
                left: '50%',
                transform: `translateX(-50%) rotate(${i * 30}deg)`,
                transformOrigin: `center ${size / 2 - 16}px`,
              }}
            />
          ))}

          {/* Brand Name */}
          <div className="absolute top-1/3 left-1/2 transform -translate-x-1/2 text-center">
            <div className="font-playfair text-xs font-bold text-luxury-black">watchShop</div>
            <div className="font-inter text-xs text-luxury-black/70">SWISS MADE</div>
          </div>

          {/* Center Dot */}
          <div className="absolute top-1/2 left-1/2 w-3 h-3 bg-luxury-gold rounded-full transform -translate-x-1/2 -translate-y-1/2 z-30 shadow-lg" />

          {/* Hour Hand */}
          <div
            className="absolute bg-luxury-black rounded-full origin-bottom z-20 transition-transform duration-1000 ease-out"
            style={{
              width: '3px',
              height: size * 0.25,
              top: '50%',
              left: '50%',
              marginLeft: '-1.5px',
              marginTop: `-${size * 0.25}px`,
              transform: `rotate(${hours}deg)`,
            }}
          />

          {/* Minute Hand */}
          <div
            className="absolute bg-luxury-black rounded-full origin-bottom z-20 transition-transform duration-1000 ease-out"
            style={{
              width: '2px',
              height: size * 0.35,
              top: '50%',
              left: '50%',
              marginLeft: '-1px',
              marginTop: `-${size * 0.35}px`,
              transform: `rotate(${minutes}deg)`,
            }}
          />

          {/* Second Hand */}
          <div
            className="absolute bg-accent rounded-full origin-bottom z-20 transition-transform duration-75 ease-out"
            style={{
              width: '1px',
              height: size * 0.4,
              top: '50%',
              left: '50%',
              marginLeft: '-0.5px',
              marginTop: `-${size * 0.4}px`,
              transform: `rotate(${seconds}deg)`,
            }}
          />
        </div>

        {/* Crown */}
        <div className="absolute top-1/2 -right-1 w-2 h-4 bg-luxury-gold rounded-r transform -translate-y-1/2" />
      </div>

      {/* Luxury Glow Effect */}
      <div className="absolute inset-0 rounded-full bg-luxury-gradient opacity-20 animate-luxury-glow blur-sm" />
    </div>
  );
};

export default AnimatedWatch;