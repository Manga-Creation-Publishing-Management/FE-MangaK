import { useNavigate } from 'react-router';
import { ArrowLeft } from 'lucide-react';
import { FooterPage } from '../shared/FooterPage';
import { LoginForm } from './LoginForm';

export function LoginPage() {
  const navigate = useNavigate();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const handleSignIn = (e) => {
    e.preventDefault();
    // Logic not configured yet as requested
    console.log('Sign in clicked', { username, password });
  };

  const gridStyle = {
    backgroundImage: `linear-gradient(to right, rgba(155, 126, 184, 0.06) 1px, transparent 1px),
                      linear-gradient(to bottom, rgba(155, 126, 184, 0.06) 1px, transparent 1px)`,
    backgroundSize: '24px 24px',
  };

  return (
    <div className="min-h-screen grid grid-cols-1 md:grid-cols-12 bg-background text-foreground transition-colors duration-300 font-sans">
      <div className="hidden md:flex md:col-span-5 bg-gradient-to-br from-[#1d1033] via-[#0d071e] to-[#220d3a] p-10 lg:p-12 flex-col justify-between text-white relative overflow-hidden">
        <div className="absolute top-[-20%] right-[-20%] w-[300px] h-[300px] rounded-full bg-primary/20 blur-[100px]" />
        <div className="absolute bottom-[-20%] left-[-20%] w-[300px] h-[300px] rounded-full bg-accent/15 blur-[100px]" />

        <div className="flex items-center gap-3 relative z-10 select-none">
          <img
            src="/logo.png"
            alt="MangaK Logo"
            className="h-9 w-9 object-contain rounded-lg"
          />
          <span className="text-xl font-bold tracking-wide flex items-center">
            <span>Manga</span>
            <span className="text-accent ml-0.5">K</span>
          </span>
        </div>

        <div className="space-y-6 max-w-sm my-auto relative z-10">
          <h2 className="text-3xl lg:text-4xl font-extrabold tracking-tight leading-[1.25] text-white">
            Create your own <br />
            <span className="text-primary-foreground/90">Manga Universe</span>
          </h2>
          <p className="text-white/60 text-sm leading-relaxed font-normal">
            A collaborative platform designed to streamline drawing tasks, review drafts, and manage publishing schedules in real-time.
          </p>

          {/* Features container (Glassmorphic) */}
          <div className="bg-white/5 border border-white/10 rounded-[24px] p-5 backdrop-blur-md">
            <div className="flex items-center gap-2 text-white/50 text-[10px] font-bold uppercase tracking-widest select-none">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 shadow-sm shadow-emerald-400 animate-pulse"></span>
              <span>System Features</span>
            </div>
            <div className="grid grid-cols-2 gap-3.5 mt-4">
              <div className="p-3.5 rounded-xl bg-white/5 border border-white/5 hover:bg-white/10 transition-colors">
                <div className="text-xs font-bold text-white">5+ Roles</div>
                <div className="text-[10px] text-white/40 mt-1">Granular Permissions</div>
              </div>
              <div className="p-3.5 rounded-xl bg-white/5 border border-white/5 hover:bg-white/10 transition-colors">
                <div className="text-xs font-bold text-white">Integrated system</div>
                <div className="text-[10px] text-white/40 mt-1">Real-time Tracking</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Right Panel - Form Section */}
      <div
        style={gridStyle}
        className="col-span-1 md:col-span-7 flex flex-col items-center justify-center p-6 md:p-12 relative"
      >
        {/* Back to Home Button */}
        <button
          onClick={() => navigate('/')}
          className="absolute top-6 right-6 flex items-center gap-2 px-4 py-2 bg-card border border-border text-foreground hover:bg-muted/80 rounded-xl text-sm font-semibold shadow-sm transition-all duration-200 cursor-pointer z-10"
        >
          <ArrowLeft size={16} />
          <span>Back to Home</span>
        </button>

        <LoginForm />

      </div>

      <FooterPage />

    </div>
  );
}
