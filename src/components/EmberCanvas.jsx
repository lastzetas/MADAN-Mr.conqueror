import React, { useEffect, useRef } from 'react';

export const EmberCanvas = () => {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    let animationFrameId;

    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    const handleResize = () => {
      if (!canvas) return;
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    };

    window.addEventListener('resize', handleResize);

    const particleCount = Math.min(Math.floor(window.innerWidth / 15), 85);
    const particles = [];

    const colors = [
      'rgba(255, 215, 0, ', // Gold
      'rgba(212, 175, 55, ', // Metallic Gold
      'rgba(255, 140, 0, ',  // Amber Orange
      'rgba(255, 69, 0, ',   // Fiery Red
      'rgba(255, 255, 200, ' // Bright spark
    ];

    for (let i = 0; i < particleCount; i++) {
      particles.push({
        x: Math.random() * width,
        y: Math.random() * height,
        size: Math.random() * 2.5 + 0.8,
        speedY: Math.random() * 0.9 + 0.3,
        speedX: (Math.random() - 0.5) * 0.6,
        opacity: Math.random() * 0.7 + 0.2,
        colorBase: colors[Math.floor(Math.random() * colors.length)],
        fadeSpeed: Math.random() * 0.008 + 0.003,
        pulseSpeed: Math.random() * 0.04 + 0.02,
        pulseAngle: Math.random() * Math.PI * 2
      });
    }

    const render = () => {
      ctx.clearRect(0, 0, width, height);

      for (let i = 0; i < particles.length; i++) {
        const p = particles[i];
        p.y -= p.speedY;
        p.x += p.speedX;
        p.pulseAngle += p.pulseSpeed;

        // Current opacity with subtle pulsation
        const currentOpacity = Math.max(
          0.1,
          Math.min(1, p.opacity + Math.sin(p.pulseAngle) * 0.25)
        );

        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fillStyle = `${p.colorBase}${currentOpacity})`;
        ctx.shadowBlur = p.size * 4;
        ctx.shadowColor = 'rgba(255, 215, 0, 0.8)';
        ctx.fill();

        // Reset if went off screen
        if (p.y < -10 || p.x < -10 || p.x > width + 10) {
          p.x = Math.random() * width;
          p.y = height + 10;
          p.opacity = Math.random() * 0.7 + 0.2;
          p.speedY = Math.random() * 0.9 + 0.3;
        }
      }

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      window.removeEventListener('resize', handleResize);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 pointer-events-none z-0 opacity-70"
    />
  );
};