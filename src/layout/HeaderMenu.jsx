import { useState, useEffect, useContext } from 'react';
import { Menu, Sun, Moon, User, LogOut } from 'lucide-react';
import { useNavigate } from 'react-router';
import { ThemeContext } from '@/features/theme/ThemeContext.jsx';
import { authService } from '@/services/authService';

const roleRouteMap = {
    "Mangaka": "mangaka",
    "Assistant": "assistant",
    "Tantou Editor": "tantou",
    "Editorial Board": "editorial",
    "Admin": "admin",
    "Reader": "reader",
};

export function HeaderMenu({ roleName }) {
    const [isOpen, setIsOpen] = useState(false);
    const { theme, toggle } = useContext(ThemeContext);
    const navigate = useNavigate();

    useEffect(() => {
        if (!isOpen) return;
        const handleOutsideClick = (e) => {
            if (!e.target.closest('.header-menu-container')) {
                setIsOpen(false);
            }
        };
        document.addEventListener('mousedown', handleOutsideClick);
        return () => document.removeEventListener('mousedown', handleOutsideClick);
    }, [isOpen]);

    const handleThemeToggle = () => {
        toggle();
    };

    const handleProfile = () => {
        const routeRole = roleRouteMap[roleName] || roleName?.toLowerCase() || 'mangaka';
        navigate(`/${routeRole}/profile`);
        setIsOpen(false);
    };

    const handleLogout = async () => {
        setIsOpen(false);
        await authService.logout();
        navigate('/');
    };

    return (
        <div className="header-menu-container relative">
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="flex items-center justify-center text-muted-foreground hover:text-accent p-2 rounded-lg transition-colors hover:bg-muted/50"
                title="Menu"
                aria-label="Toggle menu"
            >
                <Menu size={22} />
            </button>

            {isOpen && (
                <div className="absolute right-0 top-full mt-2 w-56 bg-card border border-border shadow-2xl rounded-2xl z-[999] overflow-hidden">
                    <div className="px-4 py-3 border-b border-border bg-muted/40">
                        <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Menu</p>
                    </div>

                    <div className="py-1.5">
                        <button
                            onClick={handleThemeToggle}
                            className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-foreground hover:bg-muted/60 transition-colors"
                        >
                            <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-muted/80">
                                {theme === 'dark' ? <Sun size={16} /> : <Moon size={16} />}
                            </div>
                            <span>{theme === 'dark' ? 'Light Mode' : 'Dark Mode'}</span>
                        </button>

                        <div className="mx-4 my-1 border-t border-border/60"></div>

                        {roleName !== 'Reader' && roleName !== 'reader' && (
                            <>
                                <button
                                    onClick={handleProfile}
                                    className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-foreground hover:bg-muted/60 transition-colors cursor-pointer"
                                >
                                    <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-muted/80">
                                        <User size={16} />
                                    </div>
                                    <span>Profile</span>
                                </button>
                            </>
                        )}

                        <div className="mx-4 my-1 border-t border-border/60"></div>

                        <button
                            onClick={handleLogout}
                            className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-destructive hover:bg-destructive/10 transition-colors"
                        >
                            <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-destructive/10">
                                <LogOut size={16} />
                            </div>
                            <span>Logout</span>
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
}
