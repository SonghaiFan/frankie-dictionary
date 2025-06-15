"use client";

import { useEffect, useRef, useState, useCallback, useMemo } from "react";
import { data } from "@/public/data/data";
import { usePlayback } from "@/contexts/PlaybackContext";

function ParticleRain() {
  const canvasRef = useRef(null);
  const [dimensions, setDimensions] = useState({ width: 0, height: 0 });
  const particlesRef = useRef([]);
  const animationRef = useRef(null);
  const particlePoolRef = useRef([]);
  const lastFrameTimeRef = useRef(0);
  const { isPlaying } = usePlayback();

  // Footer height constant
  const FOOTER_HEIGHT = 50;

  // Cache font strings
  const fontCache = useMemo(
    () => ({
      chinese: '20px "Noto Serif SC", serif',
      english: "20px Inter, sans-serif",
    }),
    []
  );

  // Debounced resize handler
  const debouncedResize = useCallback(
    debounce(() => {
      setDimensions({
        width: window.innerWidth,
        height: window.innerHeight,
      });
    }, 100),
    []
  );

  useEffect(() => {
    const updateDimensions = () => {
      debouncedResize();
    };

    updateDimensions();
    window.addEventListener("resize", updateDimensions);

    return () => {
      window.removeEventListener("resize", updateDimensions);
      debouncedResize.cancel();
    };
  }, [debouncedResize]);

  // Initialize particle pool
  const initParticlePool = useCallback(() => {
    const poolSize = Math.floor(dimensions.width / (isPlaying ? 15 : 25));
    particlePoolRef.current = Array(poolSize)
      .fill(null)
      .map(() => ({
        x: 0,
        y: 0,
        text: "",
        isChinese: false,
        speed: 0,
        rotation: 0,
        rotationSpeed: 0,
        opacity: 0,
        fontSize: 0,
        color: "",
        drift: 0,
        fadeIn: 0,
        maxFadeIn: 0,
        active: false,
      }));
  }, [dimensions.width, isPlaying]);

  // Reuse particle from pool
  const getParticleFromPool = useCallback(() => {
    const wordData = data[Math.floor(Math.random() * data.length)];
    const useChineseWord = Math.random() > 0.4;
    const text = useChineseWord ? wordData.中文 : wordData.英文;

    const particle = particlePoolRef.current.find((p) => !p.active);
    if (!particle) return null;

    particle.x = Math.random() * dimensions.width;
    particle.y = -100 - Math.random() * 500;
    particle.text = text;
    particle.isChinese = useChineseWord;
    particle.speed =
      Math.random() * (isPlaying ? 2.5 : 1) + (isPlaying ? 1.2 : 0.8);
    particle.rotation = Math.random() * 360;
    particle.rotationSpeed = (Math.random() - 0.5) * (isPlaying ? 4 : 2);
    particle.opacity =
      Math.random() * (isPlaying ? 0.6 : 0.3) + (isPlaying ? 0.3 : 0.1);
    particle.fontSize = Math.random() * 12 + 10;
    particle.color = `hsl(${Math.random() * 40 + 200}, ${
      Math.random() * 30 + 50
    }%, ${Math.random() * 25 + 60}%)`;
    particle.drift = (Math.random() - 0.5) * (isPlaying ? 0.5 : 0.2);
    particle.fadeIn = 0;
    particle.maxFadeIn = Math.random() * 100 + 50;
    particle.active = true;

    return particle;
  }, [dimensions.width, isPlaying]);

  useEffect(() => {
    if (dimensions.width === 0 || dimensions.height === 0) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");

    // Initialize particles
    const initParticles = () => {
      initParticlePool();
      particlesRef.current = [];
      const particleCount = Math.floor(
        dimensions.width / (isPlaying ? 15 : 25)
      );

      for (let i = 0; i < particleCount; i++) {
        const particle = getParticleFromPool();
        if (particle) particlesRef.current.push(particle);
      }
    };

    const updateParticles = (deltaTime) => {
      const speedMultiplier = isPlaying ? 1 : 0.3;

      particlesRef.current.forEach((particle, index) => {
        if (!particle.active) return;

        particle.y += particle.speed * speedMultiplier;
        particle.x += particle.drift * speedMultiplier;
        particle.rotation += particle.rotationSpeed * speedMultiplier;

        if (particle.fadeIn < particle.maxFadeIn) {
          particle.fadeIn += 2;
        }

        // Remove particle when it reaches the footer area
        if (particle.y > dimensions.height - FOOTER_HEIGHT) {
          particle.active = false;
          const newParticle = getParticleFromPool();
          if (newParticle) {
            particlesRef.current[index] = newParticle;
          }
        }

        if (particle.x > dimensions.width + 100) {
          particle.x = -100;
        } else if (particle.x < -100) {
          particle.x = dimensions.width + 100;
        }
      });
    };

    const drawParticles = () => {
      const startTime = performance.now();
      ctx.clearRect(0, 0, dimensions.width, dimensions.height);

      particlesRef.current.forEach((particle) => {
        if (!particle.active) return;

        // Skip drawing offscreen particles
        if (
          particle.x < -100 ||
          particle.x > dimensions.width + 100 ||
          particle.y < -100 ||
          particle.y > dimensions.height + 100
        ) {
          return;
        }

        ctx.save();

        const fadeOpacity = Math.min(particle.fadeIn / particle.maxFadeIn, 1);
        const activeOpacity = isPlaying ? 1 : 0.4;

        ctx.globalAlpha = particle.opacity * fadeOpacity * activeOpacity;
        ctx.fillStyle = particle.color;

        // Use cached font strings
        ctx.font = particle.isChinese ? fontCache.chinese : fontCache.english;
        ctx.textAlign = "center";
        ctx.textBaseline = "middle";

        ctx.translate(particle.x, particle.y);

        // Reduce rotation complexity
        if (particle.rotation !== 0) {
          ctx.rotate((particle.rotation * Math.PI) / 180);
        }

        // Minimize shadow blur
        ctx.shadowColor = particle.color;
        ctx.shadowBlur = isPlaying ? 5 : 1;

        ctx.fillText(particle.text, 0, 0);

        ctx.restore();
      });
    };

    const animate = (timestamp) => {
      const deltaTime = timestamp - lastFrameTimeRef.current;
      lastFrameTimeRef.current = timestamp;

      updateParticles(deltaTime);
      drawParticles();
      animationRef.current = requestAnimationFrame(animate);
    };

    initParticles();
    animationRef.current = requestAnimationFrame(animate);

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [dimensions, isPlaying, initParticlePool, getParticleFromPool, fontCache]);

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

// Debounce utility function
function debounce(func, wait) {
  let timeout;
  const debounced = (...args) => {
    clearTimeout(timeout);
    timeout = setTimeout(() => func(...args), wait);
  };
  debounced.cancel = () => clearTimeout(timeout);
  return debounced;
}

export default ParticleRain;
