import React from 'react';

export default function RatingStars({ value = 0, onChange, readOnly = false }) {
  const stars = [1, 2, 3, 4, 5];
  return (
    <div className="flex gap-1">
      {stars.map((star) => (
        <button
          key={star}
          type="button"
          disabled={readOnly}
          onClick={() => onChange && onChange(star)}
          className={`text-lg leading-none transition-colors ${
            star <= value ? 'text-amber-400' : 'text-gray-600'
          } ${readOnly ? 'cursor-default' : 'cursor-pointer hover:text-amber-300'}`}
          aria-label={`${star} star`}
        >
          ★
        </button>
      ))}
    </div>
  );
}
