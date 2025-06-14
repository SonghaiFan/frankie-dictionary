"use client";

import { useEffect, useRef, useState } from "react";
import { data } from "@/public/data/data";

function ParticleRain() {
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
      const particleCount = Math.floor(dimensions.width / 20); // Slightly less dense

      for (let i = 0; i < particleCount; i++) {
        createParticle();
      }
    };

    const createParticle = () => {
      const wordData = data[Math.floor(Math.random() * data.length)];
      const useChineseWord = Math.random() > 0.4; // Slightly favor Chinese words
      const text = useChineseWord ? wordData.中文 : wordData.英文;

      const particle = {
        x: Math.random() * dimensions.width,
        y: -100 - Math.random() * 500, // Start higher for more natural appearance
        text: text,
        isChinese: useChineseWord,
        speed: Math.random() * 1.5 + 0.8, // Slightly slower for readability
        rotation: Math.random() * 360,
        rotationSpeed: (Math.random() - 0.5) * 2, // Slower rotation
        opacity: Math.random() * 0.4 + 0.2, // Lower opacity for subtlety
        fontSize: Math.random() * 12 + 10, // Smaller font sizes
        color: `hsl(${Math.random() * 40 + 200}, ${Math.random() * 30 + 50}%, ${
          Math.random() * 25 + 60
        }%)`, // More subtle blues
        drift: (Math.random() - 0.5) * 0.3, // Less drift
        fadeIn: 0,
        maxFadeIn: Math.random() * 100 + 50,
      };

      particlesRef.current.push(particle);
    };

    const updateParticles = () => {
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

        // Set particle properties
        ctx.globalAlpha = particle.opacity * fadeOpacity;
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

        // Add subtle glow effect
        ctx.shadowColor = particle.color;
        ctx.shadowBlur = 3;

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
  }, [dimensions]);

  return (
    <canvas
      ref={canvasRef}
      width={dimensions.width}
      height={dimensions.height}
      className="fixed inset-0 pointer-events-none z-0"
      style={{
        background: "transparent",
        mixBlendMode: "multiply", // Subtle blend mode for better integration
      }}
    />
  );
}

export default ParticleRain;
