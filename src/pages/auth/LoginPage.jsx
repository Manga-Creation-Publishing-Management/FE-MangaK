import { useState, useRef } from 'react';
import { useNavigate } from 'react-router';
import { BookOpen, Eye, EyeOff, ChevronRight, ArrowDown, X, Pen, Users, BookMarked, FileCheck, ShieldCheck, Star } from 'lucide-react';


const roles = [
  { id: 'mangaka', name: 'Mangaka', description: 'Sáng tác và quản lý series của bạn', icon: Pen, color: 'bg-purple-100 text-purple-600 dark:bg-purple-900/40 dark:text-purple-300' },
  { id: 'assistant', name: 'Assistant', description: 'Hoàn thành các task được giao', icon: Users, color: 'bg-blue-100 text-blue-600 dark:bg-blue-900/40 dark:text-blue-300' },
  { id: 'tantou', name: 'Tantou Editor', description: 'Review series và cung cấp feedback', icon: FileCheck, color: 'bg-orange-100 text-orange-600 dark:bg-orange-900/40 dark:text-orange-300' },
  { id: 'editorial', name: 'Editorial Board', description: 'Giám sát toàn bộ series và phê duyệt', icon: BookMarked, color: 'bg-green-100 text-green-600 dark:bg-green-900/40 dark:text-green-300' },
  { id: 'admin', name: 'System Admin', description: 'Quản lý tài khoản và phân quyền', icon: ShieldCheck, color: 'bg-red-100 text-red-600 dark:bg-red-900/40 dark:text-red-300' },
  { id: 'reader', name: 'Reader', description: 'Duyệt series và đánh giá chapter', icon: Star, color: 'bg-yellow-100 text-yellow-600 dark:bg-yellow-900/40 dark:text-yellow-300' },
];

const collageImages = [
  {
    url: 'https://images.unsplash.com/photo-1763732397784-c5ff2651d40c?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwyfHxtYW5nYSUyMHBhZ2VzJTIwYmxhY2slMjB3aGl0ZSUyMGNvbWljJTIwYm9vayUyMHBhbmVscyUyMGlua3xlbnwxfHx8fDE3ODAwMjQ5NjV8MA&ixlib=rb-4.1.0&q=80&w=600',
    alt: 'Manga pages with characters',
  },
  {
    url: 'https://images.unsplash.com/photo-1763315371360-96015292bbf8?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHw0fHxtYW5nYSUyMHBhZ2VzJTIwYmxhY2slMjB3aGl0ZSUyMGNvbWljJTIwYm9vayUyMHBhbmVscyUyMGlua3xlbnwxfHx8fDE3ODAwMjQ5NjV8MA&ixlib=rb-4.1.0&q=80&w=600',
    alt: 'Manga panels Master Roshi and Goku',
  },
  {
    url: 'https://images.unsplash.com/photo-1639634252346-0a27c7d168dc?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtYW5nYSUyMHBhZ2VzJTIwYmxhY2slMjB3aGl0ZSUyMGNvbWljJTIwYm9vayUyMHBhbmVscyUyMGlua3xlbnwxfHx8fDE3ODAwMjQ5NjV8MA&ixlib=rb-4.1.0&q=80&w=600',
    alt: 'Comic books spread on table',
  },
  {
    url: 'https://images.unsplash.com/photo-1593345216067-47a359874578?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHw1fHxtYW5nYSUyMHBhZ2VzJTIwYmxhY2slMjB3aGl0ZSUyMGNvbWljJTIwYm9vayUyMHBhbmVscyUyMGlua3xlbnwxfHx8fDE3ODAwMjQ5NjV8MA&ixlib=rb-4.1.0&q=80&w=600',
    alt: 'Black and white comic book',
  },
  {
    url: 'https://images.unsplash.com/photo-1763732397953-7866a2dd8289?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHw2fHxtYW5nYSUyMHBhZ2VzJTIwYmxhY2slMjB3aGl0ZSUyMGNvbWljJTIwYm9vayUyMHBhbmVscyUyMGlua3xlbnwxfHx8fDE3ODAwMjQ5NjV8MA&ixlib=rb-4.1.0&q=80&w=600',
    alt: 'Expressive manga character panel',
  },
];

const stats = [
  { value: '500+', label: 'Mangaka' },
  { value: '2.4K+', label: 'Assistants' },
  { value: '1,200+', label: 'Tác phẩm xuất bản' },
];

export function LoginPage() {
  const navigate = useNavigate();
  const rolesRef = useRef(null);
  const [selectedRole, setSelectedRole] = useState(null);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');

  const scrollToRoles = () => {
    rolesRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleRoleSelect = (roleId) => {
    setSelectedRole(roleId);
    setUsername('');
    setPassword('');
    setError('');
  };

  const handleSignIn = (e) => {
    e.preventDefault();
    if (!username.trim()) { setError('Vui lòng nhập tên đăng nhập hoặc email.'); return; }
    if (!password.trim()) { setError('Vui lòng nhập mật khẩu.'); return; }
    navigate(`/${selectedRole}`);
  };

  const closeModal = () => {
    setSelectedRole(null);
    setError('');
  };

  const selectedRoleInfo = roles.find(r => r.id === selectedRole);

  return (
    <div className="min-h-screen bg-background">
      {/* Navbar */}
      <nav className="sticky top-0 z-40 bg-background/90 backdrop-blur border-b border-border">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
              <BookOpen size={16} className="text-primary-foreground" />
            </div>
            <span className="text-primary font-semibold text-lg">MangaK</span>
          </div>
          <div className="flex items-center gap-6">
            <a href="#" className="text-sm text-muted-foreground hover:text-foreground transition-colors">Home</a>
            <button
              onClick={scrollToRoles}
              className="text-sm text-muted-foreground hover:text-foreground transition-colors"
            >
              Login
            </button>
            <button
              onClick={scrollToRoles}
              className="text-sm px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:opacity-90 transition-opacity"
            >
              Register
            </button>
          </div>
        </div>
      </nav>

      {/* Hero */}
      <section className="max-w-7xl mx-auto px-6 pt-16 pb-20 grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
        {/* Left — copy */}
        <div className="space-y-6">
          <span className="inline-block text-xs font-semibold tracking-widest text-primary uppercase bg-primary/10 px-3 py-1 rounded-full">
            Nền tảng quản lý Manga
          </span>

          <h1 className="leading-tight">
            <span className="block text-foreground" style={{ fontSize: 'clamp(2rem, 4vw, 3rem)', fontWeight: 700, lineHeight: 1.15 }}>
              Quy trình sáng tác
            </span>
            <span className="block text-primary" style={{ fontSize: 'clamp(2rem, 4vw, 3rem)', fontWeight: 700, lineHeight: 1.15 }}>
              Manga chuyên
            </span>
            <span className="block text-foreground" style={{ fontSize: 'clamp(2rem, 4vw, 3rem)', fontWeight: 700, lineHeight: 1.15 }}>
              nghiệp
            </span>
          </h1>

          <p className="text-muted-foreground max-w-md leading-relaxed">
            Nền tảng quản lý quy trình sản xuất và xuất bản Manga toàn diện — từ phác thảo, tô màu, đến phát hành — hỗ trợ công tác hiệu quả giữa Mangaka và đội ngũ Assistants.
          </p>

          <div className="flex flex-wrap gap-3">
            <button
              onClick={scrollToRoles}
              className="px-6 py-3 bg-foreground text-background rounded-xl hover:opacity-80 transition-opacity text-sm font-medium"
            >
              Vào hệ thống
            </button>
            <button
              onClick={scrollToRoles}
              className="px-6 py-3 border border-border text-foreground rounded-xl hover:bg-muted transition-colors text-sm font-medium flex items-center gap-2"
            >
              Tìm hiểu thêm <ArrowDown size={15} />
            </button>
          </div>

          {/* Stats */}
          <div className="flex flex-wrap gap-8 pt-2">
            {stats.map((s) => (
              <div key={s.label}>
                <p className="text-2xl font-bold text-foreground">{s.value}</p>
                <p className="text-sm text-muted-foreground mt-0.5">{s.label}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Right — image mosaic */}
        <div className="hidden lg:grid grid-cols-2 gap-3 h-[480px]">
          {/* Col 1: tall + short */}
          <div className="flex flex-col gap-3">
            <img
              src={collageImages[0].url}
              alt={collageImages[0].alt}
              className="flex-1 w-full object-cover rounded-2xl min-h-0"
              onError={(e) => { e.target.style.display = 'none'; }}
            />
            <img
              src={collageImages[2].url}
              alt={collageImages[2].alt}
              className="h-36 w-full object-cover rounded-2xl"
              onError={(e) => { e.target.style.display = 'none'; }}
            />
          </div>
          {/* Col 2: short + tall + short */}
          <div className="flex flex-col gap-3">
            <img
              src={collageImages[1].url}
              alt={collageImages[1].alt}
              className="h-36 w-full object-cover rounded-2xl"
              onError={(e) => { e.target.style.display = 'none'; }}
            />
            <img
              src={collageImages[3].url}
              alt={collageImages[3].alt}
              className="flex-1 w-full object-cover rounded-2xl min-h-0"
              onError={(e) => { e.target.style.display = 'none'; }}
            />
            <img
              src={collageImages[4].url}
              alt={collageImages[4].alt}
              className="h-24 w-full object-cover rounded-2xl"
              onError={(e) => { e.target.style.display = 'none'; }}
            />
          </div>
        </div>
      </section>

      {/* Role selection */}
      <section ref={rolesRef} className="bg-muted/40 border-t border-border py-20 px-6">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-foreground">Chọn vai trò của bạn</h2>
            <p className="text-muted-foreground mt-3 max-w-lg mx-auto">
              Mỗi vai trò có giao diện và quyền truy cập riêng biệt. Chọn vai trò phù hợp để đăng nhập.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {roles.map((role) => {
              const Icon = role.icon;
              return (
                <button
                  key={role.id}
                  onClick={() => handleRoleSelect(role.id)}
                  className="bg-card border border-border rounded-2xl p-6 text-left hover:border-primary/50 hover:shadow-md transition-all group"
                >
                  <div className={`w-11 h-11 rounded-xl ${role.color} flex items-center justify-center mb-4`}>
                    <Icon size={22} />
                  </div>
                  <p className="font-semibold text-foreground group-hover:text-primary transition-colors">{role.name}</p>
                  <p className="text-sm text-muted-foreground mt-1 leading-relaxed">{role.description}</p>
                  <div className="mt-4 flex items-center gap-1 text-sm text-primary opacity-0 group-hover:opacity-100 transition-opacity">
                    <span>Đăng nhập</span>
                    <ChevronRight size={15} />
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border py-6 px-6 text-center text-sm text-muted-foreground">
        © 2026 MangaK · Tài khoản và mật khẩu được cấp bởi quản trị viên hệ thống.
      </footer>

      {/* Login modal */}
      {selectedRole && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm"
          onClick={(e) => { if (e.target === e.currentTarget) closeModal(); }}
        >
          <div className="bg-card border border-border rounded-2xl p-8 w-full max-w-md shadow-2xl">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="text-xl font-semibold">Đăng nhập</h2>
                <p className="text-sm text-muted-foreground mt-0.5">
                  Vai trò:{' '}
                  <span className="text-primary font-medium">{selectedRoleInfo?.name}</span>
                </p>
              </div>
              <button
                onClick={closeModal}
                className="w-8 h-8 rounded-lg hover:bg-muted flex items-center justify-center text-muted-foreground hover:text-foreground transition-colors"
              >
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleSignIn} className="space-y-4">
              <div>
                <label htmlFor="username" className="block text-sm text-muted-foreground mb-1.5">
                  Tên đăng nhập hoặc Email
                </label>
                <input
                  id="username"
                  type="text"
                  value={username}
                  onChange={(e) => { setUsername(e.target.value); setError(''); }}
                  placeholder="Nhập tên đăng nhập hoặc email"
                  className="w-full px-4 py-3 bg-input-background rounded-xl border border-border focus:outline-none focus:ring-2 focus:ring-primary transition-shadow"
                  autoComplete="username"
                  autoFocus
                />
              </div>

              <div>
                <label htmlFor="password" className="block text-sm text-muted-foreground mb-1.5">
                  Mật khẩu
                </label>
                <div className="relative">
                  <input
                    id="password"
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => { setPassword(e.target.value); setError(''); }}
                    placeholder="Nhập mật khẩu"
                    className="w-full px-4 py-3 pr-12 bg-input-background rounded-xl border border-border focus:outline-none focus:ring-2 focus:ring-primary transition-shadow"
                    autoComplete="current-password"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                  >
                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
              </div>

              {error && <p className="text-sm text-destructive">{error}</p>}

              <button
                type="submit"
                className="w-full py-3 bg-primary text-primary-foreground rounded-xl hover:opacity-90 transition-opacity font-medium mt-1"
              >
                Đăng nhập
              </button>
            </form>

            <button
              onClick={closeModal}
              className="w-full mt-3 text-sm text-muted-foreground hover:text-foreground transition-colors py-2"
            >
              ← Chọn vai trò khác
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
