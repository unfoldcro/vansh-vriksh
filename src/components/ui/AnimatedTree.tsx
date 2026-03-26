"use client";

import { useEffect, useState } from "react";

export function AnimatedTree() {
  const [grow, setGrow] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setGrow(true), 300);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="relative mx-auto h-48 w-48 md:h-64 md:w-64" aria-hidden="true">
      <svg
        viewBox="0 0 200 200"
        className="h-full w-full"
        xmlns="http://www.w3.org/2000/svg"
      >
        {/* Trunk */}
        <rect
          x="90"
          y="120"
          width="20"
          height="60"
          rx="4"
          fill="#8B6914"
          className={`origin-bottom transition-transform duration-1000 ${grow ? "scale-y-100" : "scale-y-0"}`}
        />
        {/* Root lines */}
        <path
          d="M85 180 Q70 190 60 195 M115 180 Q130 190 140 195 M100 180 V195"
          stroke="#8B6914"
          strokeWidth="3"
          fill="none"
          strokeLinecap="round"
          className={`transition-opacity duration-1000 delay-500 ${grow ? "opacity-100" : "opacity-0"}`}
        />
        {/* Main canopy */}
        <ellipse
          cx="100"
          cy="80"
          rx="60"
          ry="55"
          fill="#2D5A1E"
          className={`origin-center transition-all duration-1000 delay-300 ${grow ? "scale-100 opacity-100" : "scale-0 opacity-0"}`}
        />
        {/* Lighter leaf patches */}
        <ellipse
          cx="75"
          cy="70"
          rx="25"
          ry="20"
          fill="#3D7A2E"
          className={`origin-center transition-all duration-1000 delay-500 ${grow ? "scale-100 opacity-80" : "scale-0 opacity-0"}`}
        />
        <ellipse
          cx="120"
          cy="65"
          rx="22"
          ry="18"
          fill="#3D7A2E"
          className={`origin-center transition-all duration-1000 delay-700 ${grow ? "scale-100 opacity-80" : "scale-0 opacity-0"}`}
        />
        <ellipse
          cx="100"
          cy="50"
          rx="18"
          ry="15"
          fill="#4D8A3E"
          className={`origin-center transition-all duration-1000 delay-900 ${grow ? "scale-100 opacity-70" : "scale-0 opacity-0"}`}
        />
        {/* Small golden fruits/nodes representing family members */}
        {[
          { cx: 70, cy: 60, delay: "delay-[1100ms]" },
          { cx: 95, cy: 45, delay: "delay-[1200ms]" },
          { cx: 120, cy: 55, delay: "delay-[1300ms]" },
          { cx: 85, cy: 80, delay: "delay-[1400ms]" },
          { cx: 110, cy: 78, delay: "delay-[1500ms]" },
          { cx: 130, cy: 72, delay: "delay-[1600ms]" },
          { cx: 75, cy: 95, delay: "delay-[1700ms]" },
        ].map((node, i) => (
          <circle
            key={i}
            cx={node.cx}
            cy={node.cy}
            r="4"
            fill="#C9A84C"
            className={`transition-all duration-500 ${node.delay} ${grow ? "scale-100 opacity-100" : "scale-0 opacity-0"}`}
          />
        ))}
      </svg>
    </div>
  );
}
