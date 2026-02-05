import React from 'react';

export const IslamicPattern: React.FC<{ className?: string }> = ({ className = '' }) => {
  return (
    <div className={`absolute inset-0 pointer-events-none overflow-hidden ${className}`}>
      {/* Geometric Pattern Overlay */}
      <div className="absolute inset-0 pattern-islamic opacity-30" />
      
      {/* Stars Background */}
      <div className="absolute inset-0 pattern-stars" />
      
      {/* Gradient Overlay */}
      <div className="absolute inset-0 bg-gradient-celestial" />
      
      {/* Corner Decorations */}
      <svg
        className="absolute top-0 right-0 w-64 h-64 opacity-10"
        viewBox="0 0 200 200"
        fill="none"
      >
        <path
          d="M200 0L200 100C200 100 150 100 100 100C50 100 0 50 0 0L100 0L200 0Z"
          fill="url(#cornerGradient)"
        />
        <defs>
          <linearGradient id="cornerGradient" x1="0" y1="0" x2="200" y2="200">
            <stop offset="0%" stopColor="hsl(43, 74%, 49%)" />
            <stop offset="100%" stopColor="transparent" />
          </linearGradient>
        </defs>
      </svg>
      
      {/* Crescent Moon Decoration */}
      <svg
        className="absolute top-8 left-8 w-16 h-16 text-gold opacity-20 animate-float"
        viewBox="0 0 24 24"
        fill="currentColor"
      >
        <path d="M12 3a9 9 0 1 0 9 9c0-.46-.04-.92-.1-1.36a5.389 5.389 0 0 1-4.4 2.26 5.403 5.403 0 0 1-3.14-9.8c-.44-.06-.9-.1-1.36-.1z" />
      </svg>
    </div>
  );
};

export const MosqueSilhouette: React.FC<{ className?: string }> = ({ className = '' }) => {
  return (
    <svg
      className={`${className}`}
      viewBox="0 0 400 200"
      fill="currentColor"
    >
      {/* Main Dome */}
      <ellipse cx="200" cy="120" rx="80" ry="60" opacity="0.3" />
      
      {/* Central Minaret */}
      <rect x="195" y="40" width="10" height="80" opacity="0.4" />
      <ellipse cx="200" cy="40" rx="8" ry="15" opacity="0.4" />
      
      {/* Left Minaret */}
      <rect x="95" y="60" width="8" height="60" opacity="0.3" />
      <ellipse cx="99" cy="60" rx="6" ry="12" opacity="0.3" />
      
      {/* Right Minaret */}
      <rect x="297" y="60" width="8" height="60" opacity="0.3" />
      <ellipse cx="301" cy="60" rx="6" ry="12" opacity="0.3" />
      
      {/* Base */}
      <rect x="80" y="120" width="240" height="80" opacity="0.2" />
    </svg>
  );
};
