import { useState } from "react";
import { Star } from "lucide-react";
import { cn } from "../../components/ui/utils"; // using utility cn from UI folder

export function RatePanel({ onSubmit, initialRating = 0 }) {
  const [rating, setRating] = useState(initialRating);
  const [hover, setHover] = useState(0);

  const handleSubmit = () => {
    if (rating > 0 && onSubmit) {
      onSubmit(rating);
    }
  };

  return (
    <div className="bg-card border border-border rounded-2xl p-6 max-w-sm space-y-4 shadow-sm">
      <p className="text-[#71618a] text-sm font-medium">Rate this chapter:</p>
      
      <div className="flex items-center gap-2">
        {[1, 2, 3, 4, 5].map((index) => {
          const isFilled = index <= (hover || rating);
          return (
            <button
              key={index}
              type="button"
              className="cursor-pointer transition-transform duration-150 hover:scale-120 focus:outline-none"
              onMouseEnter={() => setHover(index)}
              onMouseLeave={() => setHover(0)}
              onClick={() => setRating(index)}
            >
              <Star
                size={32}
                className={cn(
                  "transition-colors duration-150",
                  isFilled 
                    ? "text-[#FBBF24] fill-[#FBBF24]" 
                    : "text-[#71618a] fill-transparent hover:text-[#8a72e5]"
                )}
                strokeWidth={1.5}
              />
            </button>
          );
        })}
      </div>

      <button
        type="button"
        disabled={rating === 0}
        onClick={handleSubmit}
        className={cn(
          "w-fit rounded-full px-6 py-2.5 text-sm font-medium text-white transition-all duration-200 select-none",
          rating > 0
            ? "bg-[#8a72e5] hover:bg-[#7254d8] hover:shadow-md cursor-pointer active:scale-95"
            : "bg-[#d9d2ec] cursor-not-allowed opacity-80"
        )}
      >
        Submit Rating
      </button>
    </div>
  );
}
