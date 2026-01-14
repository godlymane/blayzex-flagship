'use client';

import { useEffect, useState } from 'react';
import { motion, useMotionValue, useSpring } from 'framer-motion';

export default function CustomCursor() {
  const [isHovering, setIsHovering] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  const springConfig = { damping: 25, stiffness: 400, mass: 0.5 };
  const cursorX = useSpring(mouseX, springConfig);
  const cursorY = useSpring(mouseY, springConfig);

  useEffect(() => {
    const moveMouse = (e: MouseEvent) => {
      mouseX.set(e.clientX);
      mouseY.set(e.clientY);
      if (!isVisible) setIsVisible(true);
    };

    const handleMouseOver = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (
          target.tagName === 'BUTTON' || 
          target.tagName === 'A' || 
          target.closest('button') || 
          target.closest('a') ||
          target.classList.contains('cursor-pointer') || 
          target.tagName === 'IMG' ||
          target.tagName === 'VIDEO'
      ) {
        setIsHovering(true);
      } else {
        setIsHovering(false);
      }
    };

    window.addEventListener('mousemove', moveMouse);
    window.addEventListener('mouseover', handleMouseOver);

    return () => {
      window.removeEventListener('mousemove', moveMouse);
      window.removeEventListener('mouseover', handleMouseOver);
    };
  }, [mouseX, mouseY, isVisible]);

  // Don't render on mobile to preserve touch capabilities
  if (typeof window !== 'undefined' && window.matchMedia('(max-width: 768px)').matches) {
    return null;
  }

  return (
    <>
      {/* Red Core - High Visibility */}
      <motion.div
        className="fixed top-0 left-0 w-1.5 h-1.5 bg-red-600 rounded-full pointer-events-none z-[9999]"
        style={{ 
            x: cursorX, 
            y: cursorY, 
            translateX: '-50%', 
            translateY: '-50%',
            opacity: isVisible ? 1 : 0 
        }}
      />
      
      {/* Outer Ring - Tactical White */}
      <motion.div
        className="fixed top-0 left-0 border border-white rounded-full pointer-events-none z-[9998]"
        style={{ 
            x: cursorX, 
            y: cursorY, 
            translateX: '-50%', 
            translateY: '-50%',
            opacity: isVisible ? 1 : 0 
        }}
        animate={{
          width: isHovering ? 50 : 20,
          height: isHovering ? 50 : 20,
          backgroundColor: isHovering ? 'rgba(255, 255, 255, 0.02)' : 'transparent',
          borderColor: isHovering ? 'rgba(220, 38, 38, 0.6)' : 'rgba(255, 255, 255, 0.9)',
          borderWidth: isHovering ? '1px' : '1px'
        }}
        transition={{ type: "tween", ease: "backOut", duration: 0.2 }}
      >
        {/* Crosshair effect on hover */}
        <div className={`absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-[1px] bg-red-600/50 transition-opacity duration-200 ${isHovering ? 'opacity-100' : 'opacity-0'}`} />
        <div className={`absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 h-full w-[1px] bg-red-600/50 transition-opacity duration-200 ${isHovering ? 'opacity-100' : 'opacity-0'}`} />
      </motion.div>
    </>
  );
}