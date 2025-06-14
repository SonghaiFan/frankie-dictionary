"use client";

import { useEffect, useRef, useState } from "react";
import { data } from "@/public/data/data";

function ParticleRain({ isActive = false }) {
  const canvasRef = useRef(null);
  const [dimensions, setDimensions] = useState({ width: 0, height: 0 });
  const particlesRef = useRef([]);
  const animationRef = useRef(null);

  useEffect(() => {
    const updateDimensions = () => {
      setDimensions({
        width: window.innerWidth,
        height: window.innerHeight,
      });
    };

    updateDimensions();
    window.addEventListener("resize", updateDimensions);

    return () => window.removeEventListener("resize", updateDimensions);
  }, []);

  useEffect(() => {
    if (dimensions.width === 0 || dimensions.height === 0) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");

    // Initialize particles
    const initParticles = () => {
      particlesRef.current = [];
      // More particles when music is active
      const particleCount = Math.floor(dimensions.width / (isActive ? 15 : 25));

      for (let i = 0; i < particleCount; i++) {
        createParticle();
      }
    };

    const createParticle = () => {
      const wordData = data[Math.floor(Math.random() * data.length)];
      const useChineseWord = Math.random() > 0.4;
      const text = useChineseWord ? wordData.中文 : wordData.英文;

      const particle = {
        x: Math.random() * dimensions.width,
        y: -100 - Math.random() * 500,
        text: text,
        isChinese: useChineseWord,
        // Faster and more dynamic when music is active
        speed: Math.random() * (isActive ? 2.5 : 1) + (isActive ? 1.2 : 0.8),
        rotation: Math.random() * 360,
        rotationSpeed: (Math.random() - 0.5) * (isActive ? 4 : 2),
        // More visible when music is active
        opacity:
          Math.random() * (isActive ? 0.6 : 0.3) + (isActive ? 0.3 : 0.1),
        fontSize: Math.random() * 12 + 10,
        color: `hsl(${Math.random() * 40 + 200}, ${Math.random() * 30 + 50}%, ${
          Math.random() * 25 + 60
        }%)`,
        drift: (Math.random() - 0.5) * (isActive ? 0.5 : 0.2),
        fadeIn: 0,
        maxFadeIn: Math.random() * 100 + 50,
      };

      particlesRef.current.push(particle);
    };

    const updateParticles = () => {
      // Only minimal movement when not active
      if (!isActive) {
        particlesRef.current.forEach((particle) => {
          // Very slow drift when not active
          particle.y += particle.speed * 0.3;
          particle.x += particle.drift * 0.3;
          particle.rotation += particle.rotationSpeed * 0.3;
        });
        return;
      }

      particlesRef.current.forEach((particle, index) => {
        particle.y += particle.speed;
        particle.x += particle.drift;
        particle.rotation += particle.rotationSpeed;

        // Fade in effect
        if (particle.fadeIn < particle.maxFadeIn) {
          particle.fadeIn += 2;
        }

        // Remove particles that are off screen and create new ones
        if (particle.y > dimensions.height + 100) {
          particlesRef.current.splice(index, 1);
          createParticle();
        }

        // Wrap around horizontally
        if (particle.x > dimensions.width + 100) {
          particle.x = -100;
        } else if (particle.x < -100) {
          particle.x = dimensions.width + 100;
        }
      });
    };

    const drawParticles = () => {
      ctx.clearRect(0, 0, dimensions.width, dimensions.height);

      particlesRef.current.forEach((particle) => {
        ctx.save();

        // Calculate fade opacity
        const fadeOpacity = Math.min(particle.fadeIn / particle.maxFadeIn, 1);

        // Enhanced visibility when active
        const activeOpacity = isActive ? 1 : 0.4;

        // Set particle properties
        ctx.globalAlpha = particle.opacity * fadeOpacity * activeOpacity;
        ctx.fillStyle = particle.color;

        // Use appropriate font based on text type
        const fontFamily = particle.isChinese
          ? '"Noto Serif SC", serif'
          : "Inter, sans-serif";
        ctx.font = `${particle.fontSize}px ${fontFamily}`;
        ctx.textAlign = "center";
        ctx.textBaseline = "middle";

        // Apply rotation
        ctx.translate(particle.x, particle.y);
        ctx.rotate((particle.rotation * Math.PI) / 180);

        // Enhanced glow effect when active
        ctx.shadowColor = particle.color;
        ctx.shadowBlur = isActive ? 5 : 1;

        // Draw the text
        ctx.fillText(particle.text, 0, 0);

        ctx.restore();
      });
    };

    const animate = () => {
      updateParticles();
      drawParticles();
      animationRef.current = requestAnimationFrame(animate);
    };

    initParticles();
    animate();

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [dimensions, isActive]);

  return (
    <canvas
      ref={canvasRef}
      width={dimensions.width}
      height={dimensions.height}
      className="fixed inset-0 pointer-events-none z-0"
      style={{
        background: "transparent",
        mixBlendMode: "multiply",
      }}
    />
  );
}

export default ParticleRain;
