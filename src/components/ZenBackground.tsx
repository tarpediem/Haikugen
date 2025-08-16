import { useEffect, useRef } from 'react';

interface Particle {
  id: number;
  x: number;
  y: number;
  size: 'small' | 'medium' | 'large';
  delay: number;
}

interface CherryPetal {
  id: number;
  x: number;
  delay: number;
  duration: number;
}

export default function ZenBackground() {
  const backgroundRef = useRef<HTMLDivElement>(null);

  // Generate more particles for a richer experience
  const particles: Particle[] = Array.from({ length: 25 }, (_, i) => ({
    id: i,
    x: Math.random() * 100,
    y: Math.random() * 100,
    size: (['small', 'medium', 'large'] as const)[Math.floor(Math.random() * 3)],
    delay: Math.random() * 15
  }));

  // Generate more cherry petals for enhanced beauty
  const cherryPetals: CherryPetal[] = Array.from({ length: 12 }, (_, i) => ({
    id: i,
    x: Math.random() * 100,
    delay: Math.random() * 20,
    duration: 20 + Math.random() * 15
  }));

  // Generate more zen waves for deeper zen feeling
  const zenWaves = Array.from({ length: 5 }, (_, i) => ({
    id: i,
    top: 15 + i * 20,
    delay: i * 1.5
  }));

  useEffect(() => {
    // Check if user prefers reduced motion
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    
    if (prefersReducedMotion && backgroundRef.current) {
      // Hide animations if user prefers reduced motion
      backgroundRef.current.style.display = 'none';
    }
  }, []);

  return (
    <>
      {/* Gradient Overlay */}
      <div className="zen-gradient-overlay animate-gradient-shift" />
      
      {/* Animated Background Elements */}
      <div ref={backgroundRef} className="zen-background">
        {/* Floating Particles */}
        {particles.map((particle) => (
          <div
            key={`particle-${particle.id}`}
            className={`zen-particle ${particle.size} animate-particle-float`}
            style={{
              left: `${particle.x}%`,
              top: `${particle.y}%`,
              animationDelay: `${particle.delay}s`,
            }}
          />
        ))}

        {/* Cherry Blossom Petals */}
        {cherryPetals.map((petal) => (
          <div
            key={`petal-${petal.id}`}
            className="cherry-petal animate-cherry-fall"
            style={{
              left: `${petal.x}%`,
              animationDelay: `${petal.delay}s`,
              animationDuration: `${petal.duration}s`,
            }}
          />
        ))}

        {/* Zen Wave Lines */}
        {zenWaves.map((wave) => (
          <div
            key={`wave-${wave.id}`}
            className="zen-wave animate-zen-wave"
            style={{
              top: `${wave.top}%`,
              animationDelay: `${wave.delay}s`,
            }}
          />
        ))}

        {/* Enhanced Ripple Effects for deeper zen ambiance */}
        <div 
          className="absolute top-1/4 left-1/4 w-32 h-32 border border-zen-vermillion rounded-full animate-ripple opacity-15"
          style={{ animationDelay: '0s' }}
        />
        <div 
          className="absolute top-3/4 right-1/4 w-24 h-24 border border-zen-gold rounded-full animate-ripple opacity-12"
          style={{ animationDelay: '2s' }}
        />
        <div 
          className="absolute top-1/2 left-1/2 w-40 h-40 border border-zen-sage rounded-full animate-ripple opacity-10"
          style={{ animationDelay: '4s' }}
        />
        <div 
          className="absolute top-1/3 right-1/3 w-28 h-28 border border-zen-vermillion/50 rounded-full animate-ripple opacity-8"
          style={{ animationDelay: '6s' }}
        />
        <div 
          className="absolute bottom-1/4 left-1/3 w-36 h-36 border border-zen-sage/70 rounded-full animate-ripple opacity-12"
          style={{ animationDelay: '8s' }}
        />
      </div>
    </>
  );
}