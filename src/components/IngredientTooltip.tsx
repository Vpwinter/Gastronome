'use client';

import { findSubstitutions } from '@/lib/cooking-data';
import { IngredientSubstitution } from '@/types';
import { Badge } from '@/components/ui/badge';
import { ArrowRight, Info } from 'lucide-react';
import { useState } from 'react';

interface IngredientTooltipProps {
  ingredientName: string;
  amount?: string;
  measure?: string;
  children: React.ReactNode;
  className?: string;
}

export function IngredientTooltip({ 
  ingredientName, 
  amount, 
  measure, 
  children, 
  className = '' 
}: IngredientTooltipProps) {
  const [isVisible, setIsVisible] = useState(false);
  const substitutions = findSubstitutions(ingredientName);
  
  // Don't show tooltip if no substitutions available
  if (substitutions.length === 0) {
    return <span className={className}>{children}</span>;
  }

  const formatAmount = (originalAmount: string | undefined, ratio: number) => {
    if (!originalAmount || originalAmount === 'q.s.') return 'adjust to taste';
    
    const numericAmount = parseFloat(originalAmount);
    if (isNaN(numericAmount)) return originalAmount;
    
    const newAmount = numericAmount * ratio;
    return newAmount.toFixed(2).replace(/\.?0+$/, ''); // Remove trailing zeros
  };

  return (
    <div className="relative inline-block">
      <span
        className={`cursor-help underline decoration-dotted decoration-blue-500/50 hover:decoration-blue-500 transition-colors ${className}`}
        onMouseEnter={() => setIsVisible(true)}
        onMouseLeave={() => setIsVisible(false)}
        onClick={() => setIsVisible(!isVisible)} // For mobile
      >
        {children}
        <Info className="inline h-3 w-3 ml-1 text-blue-500/70" />
      </span>

      {/* Tooltip */}
      {isVisible && (
        <div className="absolute z-50 bottom-full left-1/2 transform -translate-x-1/2 mb-2 w-80 max-w-sm">
          <div className="bg-popover border rounded-lg shadow-lg p-3">
            <div className="text-sm font-medium mb-2 flex items-center gap-1">
              <ArrowRight className="h-3 w-3" />
              Substitutions for {ingredientName}
            </div>
            
            <div className="space-y-2 max-h-48 overflow-y-auto">
              {substitutions.slice(0, 3).map((sub: IngredientSubstitution, index) => (
                <div key={index} className="text-xs">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="font-medium text-primary capitalize">
                      {sub.substitute}
                    </span>
                    {sub.context && sub.context !== 'both' && (
                      <Badge variant="outline" className="text-xs px-1 py-0">
                        {sub.context}
                      </Badge>
                    )}
                  </div>
                  
                  <div className="text-muted-foreground">
                    {amount && measure ? (
                      <span>
                        Use {formatAmount(amount, sub.ratio)} {measure ? measure : ''} {sub.substitute}
                      </span>
                    ) : (
                      <span>
                        Ratio: {sub.ratio === 1.0 ? '1:1' : `${sub.ratio}:1`}
                      </span>
                    )}
                  </div>
                  
                  {sub.notes && (
                    <div className="text-muted-foreground mt-1">
                      <span className="italic">💡 {sub.notes}</span>
                    </div>
                  )}
                </div>
              ))}
              
              {substitutions.length > 3 && (
                <div className="text-xs text-muted-foreground pt-1 border-t">
                  +{substitutions.length - 3} more substitutions available in the Substitution Wizard
                </div>
              )}
            </div>

            {/* Arrow pointer */}
            <div className="absolute top-full left-1/2 transform -translate-x-1/2">
              <div className="border-t-8 border-t-popover border-l-4 border-l-transparent border-r-4 border-r-transparent"></div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
} 