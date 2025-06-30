'use client';

import { useState } from 'react';
import { Star } from 'lucide-react';
import { cn } from '@/lib/utils';

interface StarRatingProps {
  rating: number;
  onRatingChange?: (rating: number) => void;
  readonly?: boolean;
  size?: 'sm' | 'md' | 'lg';
  showValue?: boolean;
  className?: string;
}

export function StarRating({ 
  rating, 
  onRatingChange, 
  readonly = false, 
  size = 'md',
  showValue = true,
  className 
}: StarRatingProps) {
  const [hoverRating, setHoverRating] = useState(0);
  
  const isInteractive = !readonly && onRatingChange;
  const displayRating = hoverRating > 0 ? hoverRating : rating;
  
  const sizeClasses = {
    sm: 'h-3 w-3',
    md: 'h-4 w-4',
    lg: 'h-5 w-5'
  };
  
  const handleStarClick = (starRating: number) => {
    if (isInteractive) {
      onRatingChange(starRating);
    }
  };
  
  const handleMouseEnter = (starRating: number) => {
    if (isInteractive) {
      setHoverRating(starRating);
    }
  };
  
  const handleMouseLeave = () => {
    if (isInteractive) {
      setHoverRating(0);
    }
  };
  
  return (
    <div className={cn("flex items-center space-x-1", className)}>
      <div className="flex items-center">
        {Array.from({ length: 5 }, (_, i) => {
          const starValue = i + 1;
          const isFilled = starValue <= Math.floor(displayRating);
          const isHalfFilled = starValue === Math.ceil(displayRating) && displayRating % 1 !== 0;
          const isHovered = hoverRating > 0 && starValue <= hoverRating;
          
          return (
            <Star
              key={i}
              className={cn(
                sizeClasses[size],
                isInteractive && "cursor-pointer transition-colors",
                isHovered
                  ? "fill-yellow-300 text-yellow-300"
                  : isFilled
                  ? "fill-yellow-400 text-yellow-400"
                  : isHalfFilled
                  ? "fill-yellow-200 text-yellow-200"
                  : "text-gray-300"
              )}
              onClick={() => handleStarClick(starValue)}
              onMouseEnter={() => handleMouseEnter(starValue)}
              onMouseLeave={handleMouseLeave}
              role={isInteractive ? "button" : "img"}
              tabIndex={isInteractive ? 0 : -1}
              aria-label={isInteractive ? `Rate ${starValue} star${starValue !== 1 ? 's' : ''}` : undefined}
              onKeyDown={(e) => {
                if (isInteractive && (e.key === 'Enter' || e.key === ' ')) {
                  e.preventDefault();
                  handleStarClick(starValue);
                }
              }}
            />
          );
        })}
      </div>
      {showValue && (
        <span className="text-sm text-muted-foreground">
          ({rating.toFixed(1)})
        </span>
      )}
    </div>
  );
} 