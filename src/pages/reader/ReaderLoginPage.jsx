import { BackButton } from '../auth/BackButton';
import { GoogleLogin } from '@react-oauth/google';
import { authService } from '../../services/authService';
import { useNavigate } from 'react-router';


export function ReaderLoginPage() {
    const navigate = useNavigate();

    const handleSucessLogin = async (credentialResponse) => {
        try {
            const idToken = credentialResponse.credential;
            const response = await authService.loginGoogle(idToken);
            alert("Login with Google sucessfully!");
            localStorage.setItem("mangak-token", JSON.stringify(response.data?.acessToken));

            const user = {
                role: response.data?.role || "reader",
                email: response.data?.email,
                name: response.data?.name
            }
            localStorage.setItem("user", JSON.stringify(user));

            console.log("Acess token:", localStorage.getItem('mangak-token'));
            console.log("Info user:", response.data);
            navigate("/reader");
        } catch (error) {
            console.log("Login with Google failed!")
        }
    }


    const gridStyle = {
        backgroundImage: `linear-gradient(to right, rgba(155, 126, 184, 0.06) 1px, transparent 1px),
    linear-gradient(to bottom, rgba(155, 126, 184, 0.06) 1px, transparent 1px)`,
        backgroundSize: '24px 24px',
    };

    return (
        <>


            <div className='min-h-screen flex flex-col '>
                <div className="flex-1 grid grid-cols-1 md:grid-cols-12 bg-background text-foreground transition-colors duration-300 font-sans">

                    <div className="hidden md:flex md:col-span-5 bg-foreground p-10 lg:p-12 flex-col justify-between text-background relative overflow-hidden">

                        <div className="flex items-center gap-3 relative z-10 select-none">
                            <img
                                src="/logo.png"
                                alt="MangaK Logo"
                                className="h-9 w-9 object-contain rounded-lg"
                            />
                            <span className="text-xl font-bold tracking-wide flex items-center">
                                <span className='text-background'>Manga</span>
                                <span className="text-accent ml-0.5">K</span>
                            </span>
                        </div>

                        <div className="space-y-6 max-w-sm my-auto relative z-10">
                            <h2 className="text-3xl lg:text-4xl font-extrabold tracking-tight leading-[1.25] text-background">
                                Join your own <br />
                                <span className="text-accent">Manga Universe</span>
                            </h2>
                            <p className="text-background text-sm leading-relaxed font-normal">
                                A real-time platform for rating your favourite series
                            </p>


                            <div className="bg-foreground border border-white/10 rounded-[24px] p-5 backdrop-blur-md">
                                <div className="flex items-center gap-2 text-background text-[10px] font-bold uppercase tracking-widest select-none">
                                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 shadow-sm shadow-emerald-400 animate-pulse"></span>
                                    <span className='text-background'>Outstanding Features</span>
                                </div>
                                <div className="grid grid-cols-2 gap-3.5 mt-4">
                                    <div className="p-3.5 rounded-xl bg-foreground border border-white/5 hover:bg-background/40 transition-colors">
                                        <div className="text-xs font-bold text-background">50+ series</div>
                                        <div className="text-sm text-background/40 mt-1">Update real-time rating of 50+ series</div>
                                    </div>
                                    <div className="p-3.5 rounded-xl bg-foreground border border-white/5 hover:bg-background/40 transition-colors">
                                        <div className="text-xs font-bold text-background">Easy to follow</div>
                                        <div className="text-sm text-background/40 mt-1">Track your favourite manga top- board</div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <BackButton url='/' />
                    <div style={gridStyle}
                        className="lg:mx-20 col-span-1 md:col-span-7 flex flex-col items-center justify-center p-6 px-12 md:p-12 relative">
                        <div className="w-full bg-background border border-border rounded-xl p-8
                        shadow-xl transition-colors duration-300 relative">
                            <div className="space-y-2 mb-8">
                                <h1 className="text-2xl font-extrabold tracking-tight text-foreground">
                                    Join in Manga<span className="text-accent">K</span>
                                </h1>

                                <p className="text-xs md:text-sm text-muted-foreground">
                                    Log in/ Sign up with Google
                                </p>
                            </div>
                            <GoogleLogin
                                onSuccess={handleSucessLogin}

                                onError={() => {
                                    console.log("Omg, login failed");
                                }}
                            />
                        </div >
                    </div>
                </div>
            </div>
        </>
    )
}