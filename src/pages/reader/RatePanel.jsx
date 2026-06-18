import { useState } from "react";
import { Star, X } from "lucide-react";

const cn = (...clasess) => clasess.filter(Boolean).join(" ");


// Component hiển thị bảng Popup đánh giá số sao (Rating Panel) cho chương truyện
export function RatePanel({ onClose, onSubmit, initialRating = 0 }) {
  // State lưu số sao người dùng đã chọn (mặc định là initialRating)
  const [rating, setRating] = useState(initialRating);
  // State lưu số sao người dùng đang di chuột qua (hover) để tạo hiệu ứng hover động
  const [hover, setHover] = useState(0);

  // Hàm xử lý khi nhấn nút gửi đánh giá
  const handleSubmit = () => {
    // Chỉ submit khi đã chọn số sao > 0 và hàm onSubmit được truyền vào
    if (rating > 0 && onSubmit) {
      onSubmit(rating);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">

      {/* Hộp thoại chính của bảng đánh giá */}
      <div className="bg-card border border-border rounded-2xl px-8 py-6 max-w-sm space-y-4 shadow-sm">
        {/* Nút đóng Popup (nút X ở góc trên bên phải) */}
        <div className="flex justify-end">
          <button onClick={onClose}>
            <X className="hover:bg-muted rounded cursor-pointer" />
          </button>
        </div>

        {/* Tiêu đề thông báo */}
        <p className="text-muted-foreground text-sm font-medium">Rate this chapter:</p>

        {/* Danh sách 5 ngôi sao để chọn số điểm đánh giá */}
        <div className="flex items-center gap-2">
          {[1, 2, 3, 4, 5].map((index) => {
            // Xác định ngôi sao này có được tô màu hay không (dựa trên điểm đã chọn hoặc điểm đang hover)
            const isFilled = index <= (hover || rating);

            return (
              <button
                key={index}
                type="button"
                className="cursor-pointer transition-transform duration-150 hover:scale-120 focus:outline-none"
                // Di chuột vào: cập nhật trạng thái hover
                onMouseEnter={() => setHover(index)}
                // Di chuột ra: reset trạng thái hover về 0
                onMouseLeave={() => setHover(0)}
                // Click chuột: chọn số sao tương ứng
                onClick={() => setRating(index)}
              >
                <Star
                  size={32}
                  className={cn(
                    "transition-colors duration-150",
                    isFilled
                      ? "text-[#FBBF24] fill-[#FBBF24]" // Ngôi sao đã tô màu (vàng)
                      : "text-[#71618a] fill-transparent hover:text-[#8a72e5]" // Ngôi sao trống
                  )}
                  strokeWidth={1.5}
                />
              </button>
            );
          })}
        </div>

        {/* Nút Submit gửi đánh giá */}
        <div className="flex justify-center">
          <button
            type="button"
            disabled={rating === 0} // Vô hiệu hóa nút nếu người dùng chưa chọn sao nào
            onClick={handleSubmit}
            className={cn(
              "w-fit rounded-full px-6 py-2.5 text-sm font-medium text-white transition-all duration-200 select-none",
              rating > 0
                ? "bg-[#8a72e5] hover:bg-[#4647ae] hover:shadow-md cursor-pointer active:scale-95" // Trạng thái kích hoạt khi đã chọn sao
                : "bg-[#d9d2ec] cursor-not-allowed opacity-80" // Trạng thái vô hiệu hóa
            )}
          >
            Submit Rating
          </button>
        </div>
      </div>
    </div>
  );
}
