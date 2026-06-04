import { User, Lock, Eye, EyeOff } from 'lucide-react';
import { LoginHook } from '../../features/auth/hooks/LoginHook';


export function LoginForm() {

    const {
        email, setEmail, password, setPassword,
        showPassword, setShowPassword, handleSignIn,
        error, isLoading
    } = LoginHook();

    return (
        <div className="w-full bg-background border border-border rounded-xl p-8
        shadow-xl transition-colors duration-300 relative">
            <div className="space-y-2 mb-8">
                <h1 className="text-2xl font-extrabold tracking-tight text-foreground">
                    Sign in to Manga<span className="text-accent">K</span>
                </h1>

                <p className="text-xs md:text-sm text-muted-foreground">
                    Enter your credentials below to access the system
                </p>
            </div>

            <form onSubmit={handleSignIn} className="space-y-5">

                <div className="space-y-2">
                    <label className="text text-xs font-bold tracking-widest text-muted-foreground uppercase">
                        Email
                    </label>
                    <div className="w-full bg-muted/40 border border-border focus-within:border-primary focus-within:ring-2 
                    focus-within:ring-primary/20 rounded-xl px-4 py-3 flex items-center gap-3 transition-all">
                        <User size={18} className="text-muted-foreground/80 shrink-0" />

                        <input
                            type="email"
                            required
                            placeholder="Enter email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="bg-transparent text-foreground placeholder-muted-foreground/70 outline-none w-full text-sm font-medium"
                        />

                    </div>
                </div>


                <div className="space-y-2">
                    <div className="flex items-center justify-between">
                        <label className="text text-xs font-bold tracking-widest text-muted-foreground uppercase">
                            Password
                        </label>

                    </div>
                    <div className="w-full bg-muted/40 border border-border focus-within:border-primary focus-within:ring-2 focus-within:ring-primary/20 rounded-xl px-4 py-3 flex items-center gap-3 transition-all">
                        <Lock size={18} className="text-muted-foreground/80 shrink-0" />
                        <input
                            required
                            type={showPassword ? 'text' : 'password'}
                            placeholder="Enter password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="bg-transparent text-foreground placeholder-muted-foreground/70 outline-none w-full text-sm font-medium"
                        />
                        <button
                            type="button"
                            onClick={() => setShowPassword(!showPassword)}
                            className="text-muted-foreground hover:text-foreground shrink-0 focus:outline-none cursor-pointer"
                        >
                            {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                        </button>
                    </div>
                    <div className='flex w-full justify-end'>
                        <a
                            href="#"
                            className="text-xs font-semibold text-primary hover:underline"
                        >
                            Forgot password?
                        </a>
                    </div>
                </div>

                {error && <p className='text-warning font-sm'> {error} </p>}

                <button
                    type="submit" disabled={isLoading}
                    className="w-full py-3.5 bg-primary text-primary-foreground font-semibold rounded-xl hover:opacity-95 transition-opacity shadow-sm text-sm mt-6 cursor-pointer"
                >
                    {isLoading ? 'Loging in...' : 'Log In'}
                </button>
            </form>


            <div className="mt-8 text-center text-xs md:text-sm">
                <span className="text-muted-foreground">Don't have an account? </span>
                <a
                    href="#"
                    className="font-bold text-primary hover:underline ml-0.5"
                >
                    Register now
                </a>
            </div>
        </div >
    )
}