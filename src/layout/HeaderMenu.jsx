import { useState, useEffect, useContext } from 'react';
import { Menu, Sun, Moon, Settings, LogOut } from 'lucide-react';
import { useNavigate } from 'react-router';
import { ThemeContext } from '@/features/theme/ThemeContext.jsx';
import { authService } from '@/services/authService';

// Map roleName hiển thị (display) về roleName dùng trong URL routing
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

    // Click outside để đóng dropdown
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
        // Không đóng dropdown để user thấy theme đã đổi
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
            {/* Nút Hamburger */}
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="flex items-center justify-center text-muted-foreground hover:text-accent p-2 rounded-lg transition-colors"
                title="Menu"
                aria-label="Toggle menu"
            >
                <Menu size={22} />
            </button>

            {/* Dropdown Menu */}
            {isOpen && (
                <div className="absolute right-0 top-full mt-2 w-56 bg-card border border-border shadow-2xl rounded-2xl z-50 overflow-hidden">
                    {/* Header */}
                    <div className="px-4 py-3 border-b border-border bg-muted/40">
                        <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Menu</p>
                    </div>

                    {/* Menu Items */}
                    <div className="py-1.5">
                        {/* Theme Toggle */}
                        <button
                            onClick={handleThemeToggle}
                            className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-foreground hover:bg-muted/60 transition-colors"
                        >
                            <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-muted/80">
                                {theme === 'dark' ? <Sun size={16} /> : <Moon size={16} />}
                            </div>
                            <span>{theme === 'dark' ? 'Light Mode' : 'Dark Mode'}</span>
                        </button>

                        {/* Divider */}
                        <div className="mx-4 my-1 border-t border-border/60"></div>

                        {/* Profile & Settings */}
                        <button
                            onClick={handleProfile}
                            className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-foreground hover:bg-muted/60 transition-colors"
                        >
                            <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-muted/80">
                                <Settings size={16} />
                            </div>
                            <span>Profile & Settings</span>
                        </button>

                        {/* Divider */}
                        <div className="mx-4 my-1 border-t border-border/60"></div>

                        {/* Logout */}
                        <button
                            onClick={handleLogout}
                            className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-red-500 hover:bg-red-500/10 transition-colors"
                        >
                            <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-red-500/10">
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
