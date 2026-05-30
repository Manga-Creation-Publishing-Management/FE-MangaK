import { Link } from 'react-router';

export function Logo({ className = "", size = "md", to, showText = true }) {
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

  const selectedSize = sizeClasses[size] || sizeClasses.md;

  const content = (
    <div className={`flex items-center gap-2.5 select-none ${className}`}>
      <img
        src="/logo.png"
        alt="MangaK Logo"
        className={`${selectedSize.img} object-contain rounded-lg transition-transform duration-300 hover:scale-105`}
      />
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

  if (to) {
    return (
      <Link to={to} className="focus:outline-none flex">
        {content}
      </Link>
    );
  }

  return content;
}
