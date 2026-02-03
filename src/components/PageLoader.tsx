import React from 'react';
import { Heart } from 'lucide-react';

interface PageLoaderProps {
  isVisible: boolean;
}

const PageLoader: React.FC<PageLoaderProps> = ({ isVisible }) => {
  if (!isVisible) return null;

  return (
    <div 
      className={`fixed inset-0 z-[9999] flex flex-col items-center justify-center bg-hero-gradient transition-opacity duration-500 ${
        isVisible ? 'opacity-100' : 'opacity-0 pointer-events-none'
      }`}
    >
      {/* Pulse Ring Background */}
      <div className="absolute">
        <div className="w-32 h-32 rounded-full border-4 border-primary-foreground/20 animate-pulse-ring" />
      </div>
      <div className="absolute">
        <div className="w-48 h-48 rounded-full border-2 border-primary-foreground/10 animate-pulse-ring-delayed" />
      </div>

      {/* Center Icon with Heartbeat */}
      <div className="relative z-10 flex flex-col items-center">
        <div className="relative mb-6">
          <div className="w-20 h-20 bg-primary-foreground/20 rounded-full flex items-center justify-center animate-pulse-subtle">
            <Heart className="w-10 h-10 text-primary-foreground animate-heartbeat" fill="currentColor" />
          </div>
        </div>

        {/* Clinic Name */}
        <h1 className="text-2xl md:text-3xl font-bold text-primary-foreground mb-2 animate-fade-in-up">
          Dr. Deogade Clinic
        </h1>
        <p className="text-primary-foreground/80 text-sm md:text-base animate-fade-in-up-delayed">
          Your Health, Our Priority
        </p>

        {/* Loading Dots */}
        <div className="flex gap-2 mt-8">
          <div className="w-3 h-3 bg-primary-foreground rounded-full animate-bounce-dot" style={{ animationDelay: '0ms' }} />
          <div className="w-3 h-3 bg-primary-foreground rounded-full animate-bounce-dot" style={{ animationDelay: '150ms' }} />
          <div className="w-3 h-3 bg-primary-foreground rounded-full animate-bounce-dot" style={{ animationDelay: '300ms' }} />
        </div>
      </div>
    </div>
  );
};

export default PageLoader;
