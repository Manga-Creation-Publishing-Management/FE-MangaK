import { BackButton } from '../auth/BackButton';
import { GoogleLogin } from '@react-oauth/google';
import { authService } from '../../services/authService';
import { useNavigate } from 'react-router';
import { useToast } from '../../shared/hooks/useToast';

export function ReaderLoginPage() {
    const navigate = useNavigate();
    const { showAlert } = useToast();

    const handleSucessLogin = async (credentialResponse) => {
        try {
            const idToken = credentialResponse.credential;
            console.log(idToken);

            const response = await authService.loginGoogle(idToken);

            // Kiểm tra xem dữ liệu trả về có hợp lệ không
            if (!response || typeof response !== "object" || !response.success) {
                throw new Error(response?.message || "Google login failed on server.");
            }

            showAlert("Login with Google successfully!");
            console.log("Login success!");

            localStorage.setItem("accessToken", response.data?.accessToken);
            localStorage.setItem("refreshToken", response.data?.refreshToken || "");

            // Decode Google JWT để lấy avatar
            const payload = JSON.parse(atob(idToken.split('.')[1]));

            const user = {
                id: response.data?.userId,
                role: response.data?.role || "reader",
                email: response.data?.email,
                name: response.data?.name || `${response.data?.firstName || ''} ${response.data?.lastName || ''}`.trim(),
                avatarUrl: payload.picture || ""
            };
            localStorage.setItem("user", JSON.stringify(user));

            // in ra để check xem thông tin nhận về
            console.log("Access token:", localStorage.getItem('accessToken'));
            console.log("Info user:", response.data);
            navigate("/reader");
        } catch (error) {
            showAlert("Login with Google failed!");
            console.log("Login with Google failed!");
            console.error("login error: ", error);
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

                    {/* --- Cột bên Trái (Mảng Banner Giới Thiệu Reader) --- */}
                    {/* Giữ nguyên màu sắc cố định ở cả theme tối và theme sáng */}
                    <div className="hidden md:flex md:col-span-5 bg-slate-950 p-10 lg:p-12 flex-col justify-between text-white relative overflow-hidden border-r border-slate-800">

                        <div className="flex items-center gap-3 relative z-10 select-none">
                            <img
                                src="/logo.png"
                                alt="MangaK Logo"
                                className="h-9 w-9 object-contain rounded-lg"
                            />
                            <span className="text-xl font-bold tracking-wide flex items-center">
                                <span className='text-white'>Manga</span>
                                <span className="text-accent ml-0.5">K</span>
                            </span>
                        </div>

                        <div className="space-y-6 max-w-sm my-auto relative z-10">
                            <h2 className="text-3xl lg:text-4xl font-extrabold tracking-tight leading-[1.25] text-white">
                                Join your own <br />
                                <span className="text-accent">Manga Universe</span>
                            </h2>
                            <p className="text-slate-300 text-sm leading-relaxed font-normal">
                                A real-time platform for rating your favourite series
                            </p>


                            <div className="bg-slate-900/90 border border-slate-800 rounded-[24px] p-5 backdrop-blur-md">
                                <div className="flex items-center gap-2 text-slate-300 text-[10px] font-bold uppercase tracking-widest select-none">
                                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 shadow-sm shadow-emerald-400 animate-pulse"></span>
                                    <span className='text-slate-300'>Outstanding Features</span>
                                </div>
                                <div className="grid grid-cols-2 gap-3.5 mt-4">
                                    <div className="p-3.5 rounded-xl bg-slate-950/80 border border-slate-800 hover:bg-slate-800/50 transition-colors">
                                        <div className="text-xs font-bold text-white">50+ series</div>
                                        <div className="text-sm text-slate-400 mt-1">Update real-time rating of 50+ series</div>
                                    </div>
                                    <div className="p-3.5 rounded-xl bg-slate-950/80 border border-slate-800 hover:bg-slate-800/50 transition-colors">
                                        <div className="text-xs font-bold text-white">Easy to follow</div>
                                        <div className="text-sm text-slate-400 mt-1">Track your favourite manga top-board</div>
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