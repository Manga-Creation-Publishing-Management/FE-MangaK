import { Link } from 'react-router';

// Component Logo của hệ thống
// Hỗ trợ tái sử dụng với nhiều kích cỡ khác nhau (sm, md, lg) và tùy chọn ẩn/hiện chữ
export function Logo({ className = "", size = "md", to, showText = true }) {
  
  // Từ điển cấu hình class kích thước tương ứng cho icon (img) và chữ (text)
  const sizeClasses = {
    sm: {
      img: "h-8 w-8",
      text: "text-lg font-semibold"
    },
    md: {
      img: "h-10 w-10",
      text: "text-xl font-bold tracking-wider"
    },
    lg: {
      img: "h-14 w-14",
      text: "text-2xl font-extrabold tracking-widest"
    }
  };

  // Chọn bộ class tương ứng với size truyền vào, mặc định là 'md'
  const selectedSize = sizeClasses[size] || sizeClasses.md;

  // Render phần nội dung Logo (Hình ảnh + Tên thương hiệu nếu có)
  const content = (
    <div className={`flex items-center gap-2.5 select-none justify-center ${className}`}>
      
      {/* Hình ảnh Logo. Cấu hình hiệu ứng phóng to nhẹ (hover:scale-105) khi rê chuột */}
      <img
        src="/logo.png"
        alt="MangaK Logo"
        className={`${selectedSize.img} object-contain rounded-lg transition-transform duration-300 hover:scale-105`}
      />
      
      {/* Tên thương hiệu. Được làm nổi bật bằng dải màu gradient từ tím sang chàm và chữ K màu cam */}
      {showText && (
        <span className={`${selectedSize.text} font-sans flex items-center`}>
          <span className="bg-gradient-to-r from-violet-600 to-indigo-500 bg-clip-text text-transparent">
            Manga
          </span>
          <span className="text-orange-500 font-extrabold">
            K
          </span>
        </span>
      )}
    </div>
  );

  // Nếu truyền thuộc tính 'to', bọc Logo trong một thẻ Link để click chuyển hướng (thường là về trang chủ)
  if (to) {
    return (
      <Link to={to} className="focus:outline-none flex">
        {content}
      </Link>
    );
  }

  // Nếu không truyền 'to', chỉ render nội dung Logo như một khối hiển thị bình thường
  return content;
}
