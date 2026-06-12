import { LogOut } from 'lucide-react';
import { LoginHook } from '../../features/auth/hooks/LoginHook';
import { authService } from '../../services/authService';
import { Logo } from '../../shared/components/Logo';

export function HeaderPage({ roleName, avatarUrl }) {
    const { navigate } = LoginHook();

    const handleLogout = async () => {
        await authService.logout();
        navigate('/');
    };

    return (
        <>
            <div className="grid grid-cols-12 shadow p-2 px-8 bg-card">
                <div className="hidden md:block col-span-1 px-2 content-center">
                    <img className="rounded-full w-10"
                        src={avatarUrl} alt="Avatar Image" />

                </div>

                <div className={`${roleName === 'reader' ? 'col-span-3' : 'col-span-5'} content-center`}>
                    <span className="text-sidebar-foreground text-lg font-medium">Welcome back!</span><br />
                    <span className="text-muted-foreground">{roleName}</span>
                </div>
                {roleName === 'reader' &&
                    <div className="col-span-4 content-center justify-center">
                        <Logo />
                    </div>}

                <div className={`${roleName === 'reader' ? 'col-span-4' : 'col-span-6'} content-center`}>
                    <div className='place-self-end'>
                        <button onClick={handleLogout}
                            className='flex 
                        color-background text-muted-foreground
                        hover:text-accent
                        hover:rounded
                        p-2'>
                            <div className='content-center'> <LogOut /> </div>
                            <span className='p-2 font-medium'>Logout</span>
                        </button>
                    </div>
                </div>
            </div>
        </>
    );
}