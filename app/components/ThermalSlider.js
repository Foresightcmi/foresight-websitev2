'use client';

import { useState, useRef, useEffect } from 'react';
import Image from 'next/image';

export default function ThermalSlider() {
  const [sliderPosition, setSliderPosition] = useState(50); // 0 to 100 percentage
  const [isDragging, setIsDragging] = useState(false);
  const containerRef = useRef(null);

  const handleMove = (clientX) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const x = clientX - rect.left;
    const percentage = Math.max(0, Math.min(100, (x / rect.width) * 100));
    setSliderPosition(percentage);
  };

  const handleTouchMove = (e) => {
    if (!isDragging) return;
    if (e.touches.length > 0) {
      handleMove(e.touches[0].clientX);
    }
  };

  const handleMouseMove = (e) => {
    if (!isDragging) return;
    handleMove(e.clientX);
  };

  useEffect(() => {
    const handleMouseUp = () => setIsDragging(false);
    if (isDragging) {
      window.addEventListener('mouseup', handleMouseUp);
      window.addEventListener('touchend', handleMouseUp);
    }
    return () => {
      window.removeEventListener('mouseup', handleMouseUp);
      window.removeEventListener('touchend', handleMouseUp);
    };
  }, [isDragging]);

  return (
    <section className="section bg-dark text-white" style={{ position: 'relative', overflow: 'hidden', padding: '6rem 0' }}>
      <div className="container" style={{ maxWidth: '900px' }}>
        <div className="section-title text-center" style={{ marginBottom: '3rem' }}>
          <span className="badge" style={{ marginBottom: '1rem', background: 'rgba(211,47,47,0.15)', color: 'var(--color-red-light)' }}>See The Unseen</span>
          <h2 style={{ color: 'var(--color-white)', fontSize: '2.5rem', fontWeight: 800 }}>Standard Visual vs. Foresight Thermal</h2>
          <p style={{ color: 'var(--color-gray-mid)', maxWidth: '700px', margin: '1rem auto 0', fontSize: '1.1rem', lineHeight: 1.6 }}>
            Cheap inspectors perform standard visual walkthroughs, signing off on drywalls that &ldquo;look dry.&rdquo; Foresight uses advanced FLIR thermal diagnostics on every job to catch hidden threats before they destroy your equity.
          </p>
        </div>

        {/* Interactive Slider Container */}
        <div 
          ref={containerRef}
          style={{ 
            position: 'relative', 
            width: '100%', 
            height: '450px', 
            borderRadius: 'var(--radius-lg)', 
            overflow: 'hidden', 
            boxShadow: 'var(--shadow-lg)', 
            cursor: 'ew-resize',
            userSelect: 'none',
            border: '2px solid rgba(255,255,255,0.08)'
          }}
          onMouseDown={(e) => {
            e.preventDefault();
            setIsDragging(true);
            handleMove(e.clientX);
          }}
          onMouseMove={handleMouseMove}
          onTouchStart={() => setIsDragging(true)}
          onTouchMove={handleTouchMove}
        >
          {/* Background Image: The Thermal scan (BLUE moisture leak) */}
          <div style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%' }}>
            <Image 
              src="/images/thermal-ceiling.png" 
              alt="FLIR Thermal infrared scan revealing massive cold blue water moisture leak hidden in the drywall ceiling structure" 
              fill
              sizes="(max-width: 900px) 100vw, 900px"
              style={{ objectFit: 'cover' }}
              priority
            />
            {/* Label for Background */}
            <span style={{ 
              position: 'absolute', 
              bottom: '1.5rem', 
              right: '1.5rem', 
              background: 'var(--color-red)', 
              color: 'white', 
              padding: '0.5rem 1rem', 
              fontSize: '0.85rem', 
              fontWeight: 700, 
              borderRadius: 'var(--radius-sm)',
              boxShadow: 'var(--shadow-md)',
              letterSpacing: '0.5px'
            }}>
              🔥 FORESIGHT THERMAL CAMERA SCAN (Water Leak Found!)
            </span>
          </div>

          {/* Foreground Image: The Visual scan (Pristine ceiling) */}
          <div 
            style={{ 
              position: 'absolute', 
              top: 0, 
              left: 0, 
              width: '100%', 
              height: '100%', 
              clipPath: `polygon(0 0, ${sliderPosition}% 0, ${sliderPosition}% 100%, 0 100%)`
            }}
          >
            <Image 
              src="/images/visual-ceiling.png" 
              alt="Drywall ceiling showing dry, clean visual counterpart" 
              fill
              sizes="(max-width: 900px) 100vw, 900px"
              style={{ objectFit: 'cover' }}
              priority
            />
            {/* Label for Foreground */}
            <span style={{ 
              position: 'absolute', 
              bottom: '1.5rem', 
              left: '1.5rem', 
              background: 'var(--color-dark)', 
              color: 'white', 
              padding: '0.5rem 1rem', 
              fontSize: '0.85rem', 
              fontWeight: 700, 
              borderRadius: 'var(--radius-sm)',
              boxShadow: 'var(--shadow-md)',
              border: '1px solid rgba(255,255,255,0.15)',
              letterSpacing: '0.5px'
            }}>
              👁️ STANDARD VISUAL CHECK (Looks completely dry!)
            </span>
          </div>

          {/* Drag Bar & Handle */}
          <div 
            style={{ 
              position: 'absolute', 
              top: 0, 
              bottom: 0, 
              left: `${sliderPosition}%`, 
              width: '4px', 
              background: 'var(--color-red)', 
              pointerEvents: 'none',
              transform: 'translateX(-2px)',
              boxShadow: '0 0 10px rgba(211,47,47,0.5)'
            }}
          >
            {/* Slider Drag Button */}
            <div 
              style={{ 
                position: 'absolute', 
                top: '50%', 
                left: '50%', 
                transform: 'translate(-50%, -50%)', 
                width: '44px', 
                height: '44px', 
                background: 'var(--color-red)', 
                color: 'white',
                borderRadius: '50%', 
                display: 'flex', 
                alignItems: 'center', 
                justifyContent: 'center', 
                boxShadow: '0 4px 15px rgba(0,0,0,0.4)',
                border: '2px solid white',
                fontSize: '1.25rem',
                fontWeight: 'bold',
                cursor: 'ew-resize',
                pointerEvents: 'none'
              }}
            >
              ↔
            </div>
          </div>
        </div>

        <div style={{ marginTop: '2rem', textAlign: 'center' }}>
          <p style={{ color: 'var(--color-gray-mid)', fontSize: '0.95rem', fontStyle: 'italic' }}>
            👈 Drag the slider handle back and forth to see how a dry, clean-looking ceiling hides a major active water leak! 👉
          </p>
        </div>
      </div>
    </section>
  );
}
