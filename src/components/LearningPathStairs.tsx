"use client";

import React, { useEffect, useState, useRef } from "react";
import { CheckCircle, Lock, Star, Cloud } from "lucide-react";

interface Step {
  id: string | number;
  title: string;
  description: string;
  status: "completed" | "current" | "locked";
  data?: any;
}

interface LearningPathProps {
  steps: Step[];
  onStepClick?: (step: Step) => void;
}

export default function LearningPathStairs({ steps, onStepClick }: LearningPathProps) {
  const [mounted, setMounted] = useState(false);
  const currentStepRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setMounted(true);
    
    // Smooth scroll to the current step after mounting
    const timer = setTimeout(() => {
      if (currentStepRef.current) {
        currentStepRef.current.scrollIntoView({
          behavior: "smooth",
          block: "center",
        });
      }
    }, 500);

    return () => clearTimeout(timer);
  }, []);

  if (!mounted) return null;

  return (
    <div className="relative w-full h-[80vh] min-h-[600px] overflow-hidden bg-gradient-to-b from-[#87ceeb] via-[#e6e6fa] to-[#ffb6c1] font-sans rounded-3xl shadow-inner">
      {/* Decorative Dreamy Background Clouds (Static Background) */}
      <div className="absolute top-5 -left-10 text-white/60 animate-[bounce_8s_infinite] pointer-events-none"><Cloud size={200} fill="currentColor" /></div>
      <div className="absolute top-1/4 right-0 text-white/50 animate-[bounce_12s_infinite] pointer-events-none"><Cloud size={260} fill="currentColor" /></div>
      <div className="absolute top-1/2 -left-20 text-white/40 animate-[bounce_14s_infinite] pointer-events-none"><Cloud size={180} fill="currentColor" /></div>
      <div className="absolute bottom-40 right-10 text-white/60 animate-[bounce_10s_infinite] pointer-events-none"><Cloud size={220} fill="currentColor" /></div>
      
      {/* Scrollable Content Container */}
      <div className="relative w-full h-full overflow-y-auto overflow-x-hidden px-4 md:px-10 py-10 scroll-smooth custom-scrollbar">
        <div className="relative max-w-5xl mx-auto flex flex-col justify-end items-center min-h-full">
          
          {/* The Vertical Ladder Container */}
          <div className="relative flex flex-col-reverse justify-end items-center z-10 w-full pb-32 pt-20" style={{ gap: '6rem' }}>
          
          {/* Ladder Rails */}
          <div className="absolute top-10 bottom-10 left-[calc(50%-35px)] sm:left-[calc(50%-50px)] md:left-[calc(50%-60px)] w-5 md:w-6 bg-[#dcb1eb] rounded-full shadow-[inset_-3px_0_5px_rgba(0,0,0,0.1),_3px_3px_5px_rgba(0,0,0,0.1)] z-0"></div>
          <div className="absolute top-10 bottom-10 left-[calc(50%+15px)] sm:left-[calc(50%+30px)] md:left-[calc(50%+36px)] w-5 md:w-6 bg-[#dcb1eb] rounded-full shadow-[inset_3px_0_5px_rgba(0,0,0,0.1),_3px_3px_5px_rgba(0,0,0,0.1)] z-0"></div>

          {steps.map((step, index) => {
            const isEven = index % 2 === 0;
            const isCurrent = step.status === 'current';
            const isCompleted = step.status === 'completed';
            const isLocked = step.status === 'locked';

            return (
              <div 
                key={step.id} 
                ref={isCurrent ? currentStepRef : null}
                className={`relative flex items-center justify-center w-full transition-transform duration-500 ease-in-out hover:scale-105 group ${!isLocked ? 'cursor-pointer' : ''}`}
                style={{ zIndex: steps.length - index, animationDelay: `${index * 150}ms` }}
                onClick={() => {
                  if (!isLocked) onStepClick?.(step);
                }}
              >
                {/* Horizontal Ladder Rung */}
                <div className="absolute w-[80px] sm:w-[120px] md:w-[140px] h-4 md:h-5 bg-gradient-to-b from-white/90 to-gray-200 rounded-full shadow-md z-0"></div>

                {/* Smaller Decorative Clouds randomly placed behind rungs */}
                {index % 3 === 0 && (
                  <div className="absolute -z-10 text-white/70" style={{ right: isEven ? '20%' : 'auto', left: !isEven ? '20%' : 'auto' }}>
                    <Cloud size={100} fill="currentColor" />
                  </div>
                )}

                {/* Step Info Card */}
                <div className={`
                  absolute top-1/2 -translate-y-1/2 w-[145px] sm:w-[180px] md:w-[260px] p-3 md:p-5 rounded-2xl md:rounded-3xl shadow-xl backdrop-blur-md transition-all duration-300
                  ${isEven ? 'right-[calc(50%+45px)] sm:right-[calc(50%+80px)] md:right-[calc(50%+100px)] text-right' : 'left-[calc(50%+45px)] sm:left-[calc(50%+80px)] md:left-[calc(50%+100px)] text-left'}
                  ${isCompleted ? 'bg-white/95 border border-purple-200 hover:shadow-purple-500/30 hover:border-purple-400' : ''}
                  ${isCurrent ? 'bg-gradient-to-br from-[#8b5cf6] to-[#6d28d9] text-white shadow-purple-500/40 border border-purple-300 scale-105' : ''}
                  ${isLocked ? 'bg-white/40 border border-white/50 text-gray-500 opacity-90' : ''}
                `}>
                  <h3 className={`font-extrabold text-sm md:text-lg mb-1 leading-tight ${isCurrent ? 'text-white' : 'text-gray-800'}`}>{step.title}</h3>
                  <p className={`text-xs md:text-sm line-clamp-2 font-medium ${isCurrent ? 'text-purple-100' : 'text-gray-500'}`}>{step.description}</p>
                </div>

                {/* Central Status Node mapped onto the rung between the rails */}
                <div 
                  className={`
                    relative w-12 h-12 sm:w-14 sm:h-14 md:w-16 md:h-16 rounded-full flex items-center justify-center border-4 shadow-xl z-20 transition-all duration-300
                    ${isCompleted ? 'bg-[#a3e635] border-white text-white shadow-[#a3e635]/40' : ''}
                    ${isCurrent ? 'bg-[#fbbf24] border-white text-purple-900 shadow-[#fbbf24]/50 scale-110' : ''}
                    ${isLocked ? 'bg-gray-200/80 border-white text-gray-400 backdrop-blur-sm' : ''}
                  `}
                >
                  {isCompleted && <CheckCircle size={24} strokeWidth={3} className="drop-shadow-sm md:w-7 md:h-7" />}
                  {isCurrent && <Star size={24} strokeWidth={2.5} className="animate-[spin_6s_linear_infinite] md:w-7 md:h-7" />}
                  {isLocked && <Lock size={18} className="md:w-[22px] md:h-[22px]" />}
                </div>

                {/* The Climbing Character Avatar on the current step */}
                {isCurrent && (
                  <div className="absolute bottom-8 sm:bottom-10 md:bottom-12 left-[calc(50%+25px)] sm:left-[calc(50%+40px)] md:left-[calc(50%+48px)] -translate-x-1/2 z-30 pointer-events-none drop-shadow-2xl">
                    <svg viewBox="0 0 100 120" className="w-[60px] h-[80px] sm:w-[70px] sm:h-[90px] md:w-[90px] md:h-[110px] animate-[bounce_2s_infinite] origin-bottom drop-shadow-xl" fill="none" xmlns="http://www.w3.org/2000/svg">
                      {/* Left hand grabbing up (towards the rail) */}
                      <path d="M40 38 Q30 20 28 10" stroke="#fcd34d" strokeWidth="6" strokeLinecap="round"/>
                      {/* Right hand grabbing lower */}
                      <path d="M60 40 Q70 25 72 15" stroke="#fcd34d" strokeWidth="6" strokeLinecap="round"/>
                      
                      {/* Left Leg */}
                      <path d="M45 80 L35 100 L35 115" stroke="#a78bfa" strokeWidth="10" strokeLinecap="round" strokeLinejoin="round"/>
                      {/* Right Leg */}
                      <path d="M55 80 L65 95 L55 110" stroke="#a78bfa" strokeWidth="10" strokeLinecap="round" strokeLinejoin="round"/>
                      
                      {/* Shoes */}
                      <ellipse cx="35" cy="115" rx="7" ry="4" fill="#f472b6"/>
                      <ellipse cx="55" cy="110" rx="7" ry="4" fill="#f472b6"/>

                      {/* Backpack */}
                      <rect x="28" y="45" width="20" height="30" rx="8" fill="#60a5fa" />
                      <rect x="32" y="48" width="10" height="18" rx="4" fill="#3b82f6" /> {/* Backpack highlight */}

                      {/* Torso/Shirt */}
                      <path d="M40 38 Q50 32 60 38 L62 75 Q50 85 38 75 Z" fill="#f8fafc" />

                      {/* Neck */}
                      <rect x="47" y="25" width="6" height="15" fill="#fcd34d" />

                      {/* Head */}
                      <circle cx="50" cy="22" r="14" fill="#fcd34d" />
                      
                      {/* Hair / Helmet (Blue like the drawing) */}
                      <path d="M34 22 Q38 2 55 5 Q68 7 65 21 Q55 29 38 25 Z" fill="#3b82f6" />
                    </svg>
                  </div>
                )}
              </div>
            );
          })}
        </div>
        </div>
      </div>
    </div>
  );
}
