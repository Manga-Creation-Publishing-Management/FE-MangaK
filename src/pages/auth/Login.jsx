import { useState, useRef } from 'react';

{
  { id: 'tantou', name: 'Tantou Editor', description: 'Review series và cung cấp feedback', icon: FileCheck, color: 'bg-orange-100 text-orange-600 dark:bg-orange-900/40 dark:text-orange-300' },
  { id: 'editorial', name: 'Editorial Board', description: 'Giám sát toàn bộ series và phê duyệt', icon: BookMarked, color: 'bg-green-100 text-green-600 dark:bg-green-900/40 dark:text-green-300' },
  { id: 'admin', name: 'System Admin', description: 'Quản lý tài khoản và phân quyền', icon: ShieldCheck, color: 'bg-red-100 text-red-600 dark:bg-red-900/40 dark:text-red-300' },
  { id: 'reader', name: 'Reader', description: 'Duyệt series và đánh giá chapter', icon: Star, color: 'bg-yellow-100 text-yellow-600 dark:bg-yellow-900/40 dark:text-yellow-300' },
};

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
  const rolesRef = useRef<HTMLDivElement>(null);
  const [selectedRole, setSelectedRole] = useState<RoleId | null>(null);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');

  const scrollToRoles = () => {
    rolesRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleRoleSelect = (roleId: RoleId) => {
    setSelectedRole(roleId);
    setUsername('');
    setPassword('');
    setError('');
  };

  const handleSignIn = (e: React.FormEvent) => {
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

