import { useState } from "react";
import { Star, X } from "lucide-react";

const cn = (...clasess) => clasess.filter(Boolean).join(" ");


export function RatePanel({ onClose, onSubmit, initialRating = 0 }) {
  const [rating, setRating] = useState(initialRating);
  const [hover, setHover] = useState(0);

  const handleSubmit = () => {
    if (rating > 0 && onSubmit) {
      onSubmit(rating);
    }
  };

  return (
    // setting pop up
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">

      <div className="bg-card border border-border rounded-2xl px-8 py-6 max-w-sm space-y-4 shadow-sm">
        <div className="flex justify-end">
          <button onClick={onClose}>
            <X className="hover:bg-muted rounded cursor-pointer" />
          </button>
        </div>

        <p className="text-muted-foreground text-sm font-medium">Rate this chapter:</p>

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

        <div className="flex justify-center">
          <button
            type="button"
            disabled={rating === 0}
            onClick={handleSubmit}
            className={cn(
              "w-fit rounded-full px-6 py-2.5 text-sm font-medium text-white transition-all duration-200 select-none",
              rating > 0
                ? "bg-[#8a72e5] hover:bg-[#4647ae] hover:shadow-md cursor-pointer active:scale-95"
                : "bg-[#d9d2ec] cursor-not-allowed opacity-80"
            )}
          >
            Submit Rating
          </button>
        </div>
      </div>
    </div>
  );
}
