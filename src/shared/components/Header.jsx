import { LogOut, User } from 'lucide-react';
import { useNavigate, useLocation } from 'react-router';

export function Header() {
  const navigate = useNavigate();
  const location = useLocation();

  const role = location.pathname.includes('mangaka') ? 'Mangaka' :
               location.pathname.includes('assistant') ? 'Assistant' :
               location.pathname.includes('tantou') ? 'Tantou Editor' : 'Editorial Board';

  const handleLogout = () => {
    console.log('Logging out...');
    navigate('/');
  };

  return (
    <div className="h-16 bg-card border-b border-border px-6 flex items-center justify-between">
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 bg-gradient-to-br from-primary to-accent rounded-full flex items-center justify-center text-primary-foreground">
          <User size={20} />
        </div>
        <div>
          <p className="font-medium">Welcome back!</p>
          <p className="text-sm text-muted-foreground">{role}</p>
        </div>
      </div>

      <button
        onClick={handleLogout}
        className="flex items-center gap-2 px-4 py-2 text-muted-foreground hover:text-destructive hover:bg-destructive/10 rounded-lg transition-colors"
      >
        <LogOut size={18} />
        <span>Logout</span>
      </button>
    </div>
  );
}
