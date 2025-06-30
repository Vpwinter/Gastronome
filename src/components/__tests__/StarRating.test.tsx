import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { StarRating } from '../ui/star-rating';

describe('StarRating', () => {
  describe('Rendering', () => {
    it('should render 5 stars', () => {
      render(<StarRating rating={3} />);
      
      const stars = screen.getAllByRole('img');
      expect(stars).toHaveLength(5);
    });

    it('should display rating value by default', () => {
      render(<StarRating rating={4.5} />);
      
      expect(screen.getByText('(4.5)')).toBeInTheDocument();
    });

    it('should hide rating value when showValue is false', () => {
      render(<StarRating rating={4.5} showValue={false} />);
      
      expect(screen.queryByText('(4.5)')).not.toBeInTheDocument();
    });

    it('should render correct number of filled stars', () => {
      render(<StarRating rating={3} />);
      
      const stars = screen.getAllByRole('img');
      
      // Check first 3 stars are filled (yellow)
      for (let i = 0; i < 3; i++) {
        expect(stars[i]).toHaveClass('fill-yellow-400', 'text-yellow-400');
      }
      
      // Check last 2 stars are unfilled (gray)
      for (let i = 3; i < 5; i++) {
        expect(stars[i]).toHaveClass('text-gray-300');
      }
    });

    it('should handle half stars correctly', () => {
      render(<StarRating rating={3.5} />);
      
      const stars = screen.getAllByRole('img');
      
      // First 3 stars should be filled
      for (let i = 0; i < 3; i++) {
        expect(stars[i]).toHaveClass('fill-yellow-400', 'text-yellow-400');
      }
      
      // 4th star should be half-filled
      expect(stars[3]).toHaveClass('fill-yellow-200', 'text-yellow-200');
      
      // 5th star should be unfilled
      expect(stars[4]).toHaveClass('text-gray-300');
    });
  });

  describe('Interactive Mode', () => {
    it('should make stars clickable when onRatingChange is provided', () => {
      const handleRatingChange = vi.fn();
      render(<StarRating rating={2} onRatingChange={handleRatingChange} />);
      
      const stars = screen.getAllByRole('button');
      expect(stars).toHaveLength(5);
    });

    it('should call onRatingChange when star is clicked', () => {
      const handleRatingChange = vi.fn();
      render(<StarRating rating={2} onRatingChange={handleRatingChange} />);
      
      const stars = screen.getAllByRole('button');
      fireEvent.click(stars[3]); // Click 4th star (index 3)
      
      expect(handleRatingChange).toHaveBeenCalledWith(4);
    });

    it('should update rating when different stars are clicked', () => {
      const handleRatingChange = vi.fn();
      render(<StarRating rating={2} onRatingChange={handleRatingChange} />);
      
      const stars = screen.getAllByRole('button');
      
      fireEvent.click(stars[0]); // Click 1st star
      expect(handleRatingChange).toHaveBeenCalledWith(1);
      
      fireEvent.click(stars[4]); // Click 5th star
      expect(handleRatingChange).toHaveBeenCalledWith(5);
    });

    it('should handle keyboard navigation with Enter key', () => {
      const handleRatingChange = vi.fn();
      render(<StarRating rating={2} onRatingChange={handleRatingChange} />);
      
      const stars = screen.getAllByRole('button');
      
      fireEvent.keyDown(stars[2], { key: 'Enter' });
      expect(handleRatingChange).toHaveBeenCalledWith(3);
    });

    it('should handle keyboard navigation with Space key', () => {
      const handleRatingChange = vi.fn();
      render(<StarRating rating={2} onRatingChange={handleRatingChange} />);
      
      const stars = screen.getAllByRole('button');
      
      fireEvent.keyDown(stars[1], { key: ' ' });
      expect(handleRatingChange).toHaveBeenCalledWith(2);
    });

    it('should show hover effects on mouse enter', () => {
      const handleRatingChange = vi.fn();
      render(<StarRating rating={2} onRatingChange={handleRatingChange} />);
      
      const stars = screen.getAllByRole('button');
      
      // Hover over 4th star
      fireEvent.mouseEnter(stars[3]);
      
      // First 4 stars should show hover effect
      for (let i = 0; i < 4; i++) {
        expect(stars[i]).toHaveClass('fill-yellow-300', 'text-yellow-300');
      }
    });

    it('should remove hover effects on mouse leave', () => {
      const handleRatingChange = vi.fn();
      render(<StarRating rating={2} onRatingChange={handleRatingChange} />);
      
      const stars = screen.getAllByRole('button');
      
      // Hover and then leave
      fireEvent.mouseEnter(stars[3]);
      fireEvent.mouseLeave(stars[3]);
      
      // Should return to original rating display (2 stars filled)
      expect(stars[0]).toHaveClass('fill-yellow-400', 'text-yellow-400');
      expect(stars[1]).toHaveClass('fill-yellow-400', 'text-yellow-400');
      expect(stars[2]).toHaveClass('text-gray-300');
    });
  });

  describe('Readonly Mode', () => {
    it('should render stars as images when readonly', () => {
      render(<StarRating rating={3} readonly />);
      
      const stars = screen.getAllByRole('img');
      expect(stars).toHaveLength(5);
      
      // Should not have any buttons
      expect(screen.queryAllByRole('button')).toHaveLength(0);
    });

    it('should not call onRatingChange when readonly', () => {
      const handleRatingChange = vi.fn();
      render(<StarRating rating={3} readonly onRatingChange={handleRatingChange} />);
      
      const stars = screen.getAllByRole('img');
      fireEvent.click(stars[2]);
      
      expect(handleRatingChange).not.toHaveBeenCalled();
    });

    it('should not have cursor pointer in readonly mode', () => {
      render(<StarRating rating={3} readonly />);
      
      const stars = screen.getAllByRole('img');
      stars.forEach(star => {
        expect(star).not.toHaveClass('cursor-pointer');
      });
    });
  });

  describe('Size Variants', () => {
    it('should apply small size classes', () => {
      render(<StarRating rating={3} size="sm" />);
      
      const stars = screen.getAllByRole('img');
      stars.forEach(star => {
        expect(star).toHaveClass('h-3', 'w-3');
      });
    });

    it('should apply medium size classes by default', () => {
      render(<StarRating rating={3} />);
      
      const stars = screen.getAllByRole('img');
      stars.forEach(star => {
        expect(star).toHaveClass('h-4', 'w-4');
      });
    });

    it('should apply large size classes', () => {
      render(<StarRating rating={3} size="lg" />);
      
      const stars = screen.getAllByRole('img');
      stars.forEach(star => {
        expect(star).toHaveClass('h-5', 'w-5');
      });
    });
  });

  describe('Accessibility', () => {
    it('should have proper aria-labels for interactive stars', () => {
      const handleRatingChange = vi.fn();
      render(<StarRating rating={2} onRatingChange={handleRatingChange} />);
      
      expect(screen.getByLabelText('Rate 1 star')).toBeInTheDocument();
      expect(screen.getByLabelText('Rate 2 stars')).toBeInTheDocument();
      expect(screen.getByLabelText('Rate 3 stars')).toBeInTheDocument();
      expect(screen.getByLabelText('Rate 4 stars')).toBeInTheDocument();
      expect(screen.getByLabelText('Rate 5 stars')).toBeInTheDocument();
    });

    it('should have proper tabindex for interactive stars', () => {
      const handleRatingChange = vi.fn();
      render(<StarRating rating={2} onRatingChange={handleRatingChange} />);
      
      const stars = screen.getAllByRole('button');
      stars.forEach(star => {
        expect(star).toHaveAttribute('tabindex', '0');
      });
    });

    it('should have tabindex -1 for readonly stars', () => {
      render(<StarRating rating={2} readonly />);
      
      const stars = screen.getAllByRole('img');
      stars.forEach(star => {
        expect(star).toHaveAttribute('tabindex', '-1');
      });
    });
  });

  describe('Edge Cases', () => {
    it('should handle rating of 0', () => {
      render(<StarRating rating={0} />);
      
      const stars = screen.getAllByRole('img');
      stars.forEach(star => {
        expect(star).toHaveClass('text-gray-300');
      });
      
      expect(screen.getByText('(0.0)')).toBeInTheDocument();
    });

    it('should handle rating of 5', () => {
      render(<StarRating rating={5} />);
      
      const stars = screen.getAllByRole('img');
      stars.forEach(star => {
        expect(star).toHaveClass('fill-yellow-400', 'text-yellow-400');
      });
      
      expect(screen.getByText('(5.0)')).toBeInTheDocument();
    });

    it('should handle fractional ratings correctly', () => {
      render(<StarRating rating={2.3} />);
      
      expect(screen.getByText('(2.3)')).toBeInTheDocument();
    });

    it('should apply custom className', () => {
      render(<StarRating rating={3} className="custom-class" />);
      
      const container = screen.getByText('(3.0)').parentElement;
      expect(container).toHaveClass('custom-class');
    });
  });
}); 