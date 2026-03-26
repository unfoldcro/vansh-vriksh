"use client";

import { useEffect, useRef, useState } from "react";

interface AnimatedCounterProps {
  target: number;
  label: string;
  duration?: number;
}

export function AnimatedCounter({ target, label, duration = 2000 }: AnimatedCounterProps) {
  const [count, setCount] = useState(0);
  const [isVisible, setIsVisible] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.3 }
    );

    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (!isVisible || target === 0) return;

    const steps = 60;
    const increment = target / steps;
    const stepTime = duration / steps;
    let current = 0;

    const timer = setInterval(() => {
      current += increment;
      if (current >= target) {
        setCount(target);
        clearInterval(timer);
      } else {
        setCount(Math.floor(current));
      }
    }, stepTime);

    return () => clearInterval(timer);
  }, [isVisible, target, duration]);

  return (
    <div ref={ref} className="text-center">
      <div className="font-mono text-4xl font-bold text-gold md:text-5xl">
        {target === 0 ? "0" : count.toLocaleString("en-IN")}
      </div>
      <div className="mt-1 text-sm text-earth/70">{label}</div>
    </div>
  );
}
