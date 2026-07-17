import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router';
import { FooterPage } from '@/layout/FooterPage';
import { userService } from '@/services/userService';

export function HomePage() {
  // Hook điều hướng của react-router, dùng để chuyển trang (ví dụ sang trang /login)
  const navigate = useNavigate();

  const token = localStorage.getItem('accessToken');
  const userString = localStorage.getItem('user');
  let user = null;
  if (token && userString) {
    try {
      user = JSON.parse(userString);
    } catch (e) {
      // ignore
    }
  }

  const [avatarUrl, setAvatarUrl] = useState("/avatarImgDemo.png");

  useEffect(() => {
    if (token) {
      const fetchAvatar = async () => {
        try {
          const res = await userService.getProfile();
          if (res?.data?.avatarUrl) {
            setAvatarUrl(res.data.avatarUrl);
          }
        } catch (error) {
          console.error("Failed to load homepage profile avatar:", error);
        }
      };
      fetchAvatar();
    }
  }, [token]);

  const rolePathMap = {
    mangaka: 'mangaka',
    assistant: 'assistant',
    tantou: 'tantou',
    editorial: 'editorial',
    admin: 'admin',
    reader: 'reader',
  };
  const rolePath = user ? (rolePathMap[user.role?.toLowerCase()] || user.role?.toLowerCase()) : '';

  return (
    <div className="bg-muted h-full flex flex-col bg-background text-foreground transition-colors duration-300">
      <nav className="sticky top-0 z-40 bg-background/90 backdrop-blur border-b border-border transition-colors duration-300">
        <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">

          {/* Logo và Tên ứng dụng */}
          <div className="flex items-center gap-3">
            <img
              src="/logo.png"
              alt="MangaK Logo"
              className="h-9 w-9 object-contain rounded-lg transition-transform duration-300 hover:scale-105"
            />
            <span className="text-xl font-bold font-sans tracking-wide flex items-center select-none">
              <span className="text-foreground">Manga</span>
              <span className="text-accent ml-0.5">K</span>
            </span>
          </div>

          {/* Các nút bấm ở góc phải (Đăng ký, Đăng nhập) */}
          <div className="flex items-center gap-4">
            {user ? (
              <div className="flex items-center gap-4">
                <span className="text-sm font-medium text-muted-foreground hidden sm:inline">
                  Hello, <span className="font-bold text-foreground">{user.name || user.role}</span>
                </span>
                <div className="relative group cursor-pointer" onClick={() => navigate(`/${rolePath}`)}>
                  <img
                    src={avatarUrl}
                    alt="User Avatar"
                    className="w-10 h-10 rounded-full object-cover border border-border transition-transform duration-300 hover:scale-105 group-hover:ring-2 group-hover:ring-primary/50"
                  />
                  <div className="absolute right-0 top-full mt-2 hidden group-hover:block bg-card text-foreground text-[10px] font-bold uppercase tracking-wider px-3 py-1.5 rounded-lg border border-border shadow-md whitespace-nowrap z-50">
                    Dashboard
                  </div>
                </div>
              </div>
            ) : (
              <button
                onClick={() => navigate('/loginReader')}
                className="text-sm px-6 py-2.5 bg-primary text-primary-foreground hover:opacity-90 rounded-xl font-semibold shadow-sm transition-opacity cursor-pointer"
              >
                Reader Login
              </button>
            )}
          </div>
        </div>
      </nav>


      <main className="h-full flex-grow max-w-7xl mx-auto px-6 py-12 md:py-16 grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center w-full">
        {/* //image tab */}
        <div className="animate-smallbounce lg:col-span-6 grid grid-cols-2 gap-4 md:gap-5">

          {/* Cột ảnh thứ nhất */}
          <div className="flex flex-col gap-4 md:gap-5 justify-center">
            <img
              src="https://images.unsplash.com/photo-1763732397784-c5ff2651d40c?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwyfHxtYW5nYSUyMHBhZ2VzJTIwYmxhY2slMjB3aGl0ZSUyMGNvbWljJTIwYm9vayUyMHBhbmVscyUyMGlua3xlbnwxfHx8fDE3ODAwMjQ5NjV8MA&ixlib=rb-4.1.0&q=80&w=600"
              alt="Manga page close-up"
              className="w-full h-[280px] md:h-[360px] object-cover rounded-2xl md:rounded-[24px] shadow-md transition-transform duration-300 hover:scale-[1.02]"
            />
            <img
              src="https://images.unsplash.com/photo-1763315371360-96015292bbf8?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHw0fHxtYW5nYSUyMHBhZ2VzJTIwYmxhY2slMjB3aGl0ZSUyMGNvbWljJTIwYm9vayUyMHBhbmVscyUyMGlua3xlbnwxfHx8fDE3ODAwMjQ5NjV8MA&ixlib=rb-4.1.0&q=80&w=600"
              alt="Manga panel collage"
              className="w-full h-[120px] md:h-[150px] object-cover rounded-2xl md:rounded-[24px] shadow-md transition-transform duration-300 hover:scale-[1.02]"
            />
          </div>

          {/* Cột ảnh thứ hai */}
          <div className="flex flex-col gap-4 md:gap-5 justify-center">
            <img
              src="https://images.unsplash.com/photo-1639634252346-0a27c7d168dc?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtYW5nYSUyMHBhZ2VzJTIwYmxhY2slMjB3aGl0ZSUyMGNvbWljJTIwYm9vayUyMHBhbmVscyUyMGlua3xlbnwxfHx8fDE3ODAwMjQ5NjV8MA&ixlib=rb-4.1.0&q=80&w=600"
              alt="Manga storyboard drawing"
              className="w-full h-[110px] md:h-[140px] object-cover rounded-2xl md:rounded-[24px] shadow-md transition-transform duration-300 hover:scale-[1.02]"
            />
            <img
              src="https://images.unsplash.com/photo-1593345216067-47a359874578?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHw1fHxtYW5nYSUyMHBhZ2VzJTIwYmxhY2slMjB3aGl0ZSUyMGNvbWljJTIwYm9vayUyMHBhbmVscyUyMGlua3xlbnwxfHx8fDE3ODAwMjQ5NjV8MA&ixlib=rb-4.1.0&q=80&w=600"
              alt="Manga character lineart"
              className="w-full h-[200px] md:h-[260px] object-cover rounded-2xl md:rounded-[24px] shadow-md transition-transform duration-300 hover:scale-[1.02]"
            />
            <img
              src="https://images.unsplash.com/photo-1763732397953-7866a2dd8289?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHw2fHxtYW5nYSUyMHBhZ2VzJTIwYmxhY2slMjB3aGl0ZSUyMGNvbWljJTIwYm9vayUyMHBhbmVscyUyMGlua3xlbnwxfHx8fDE3ODAwMjQ5NjV8MA&ixlib=rb-4.1.0&q=80&w=600"
              alt="Open manga booklet"
              className="w-full h-[90px] md:h-[110px] object-cover rounded-2xl md:rounded-[24px] shadow-md transition-transform duration-300 hover:scale-[1.02]"
            />
          </div>
        </div>

        <div className="lg:col-span-6 space-y-6 flex flex-col justify-end">
          <div className="w-full flex justify-center bg-primary/10 text-primary text-[10px] md:text-xs font-bold tracking-widest uppercase px-4 py-2 rounded-full w-fit">
            Manga Production & Publishing Management Platform
          </div>
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold tracking-tight leading-[1.1] text-foreground">
            Professional Manga <br />
            <span className="text-primary">Creative Workflow</span>
          </h1>
          <p className="w-full flex justify-end text-muted-foreground text-sm md:text-base leading-relaxed max-w-xl">
            A comprehensive platform for managing manga production and publishing workflows — from sketching, coloring, to publication — supporting efficient collaboration between Mangakas and Assistants.
          </p>

          <div className='w-full flex justify-end px-5'>
            {user ? (
              <button
                onClick={() => navigate(`/${rolePath}`)}
                className="px-8 py-3.5 bg-primary text-primary-foreground font-semibold rounded-xl hover:opacity-90 transition-opacity shadow-md inline-block w-fit cursor-pointer text-sm"
              >
                Go to Dashboard
              </button>
            ) : (
              <button
                onClick={() => navigate('/login')}
                className="px-8 py-3.5 bg-foreground text-background font-semibold rounded-xl hover:opacity-90 transition-opacity shadow-md inline-block w-fit cursor-pointer text-sm"
              >
                Enter System
              </button>
            )}
          </div>

          <div className="border-t border-border/60 pt-6 w-full flex justify-end">
            <div className="flex items-center gap-8 md:gap-12">
              <div>
                <div className="text-2xl md:text-3xl font-extrabold text-foreground">500+</div>
                <div className="text-[10px] md:text-xs font-semibold uppercase tracking-wider text-muted-foreground mt-0.5">
                  Mangakas
                </div>
              </div>
              <div>
                <div className="text-2xl md:text-3xl font-extrabold text-foreground">2.4K+</div>
                <div className="text-[10px] md:text-xs font-semibold uppercase tracking-wider text-muted-foreground mt-0.5">
                  Assistants
                </div>
              </div>
              <div>
                <div className="text-2xl md:text-3xl font-extrabold text-foreground">1,200+</div>
                <div className="text-[10px] md:text-xs font-semibold uppercase tracking-wider text-muted-foreground mt-0.5">
                  Published Works
                </div>
              </div>
            </div>
          </div>
        </div>


      </main>

      <FooterPage className="h-full" />

    </div>
  );
}
