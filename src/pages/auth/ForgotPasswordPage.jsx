import { useState, useEffect } from 'react';
import { User } from 'lucide-react';
import { BackButton } from './BackButton';
import { authService } from '../../services/authService';
import { useNavigate } from 'react-router';

export function ForgotPasswordPage() {
    const [email, setEmail] = useState('');
    const [countdown, setCountdown] = useState(0);
    const [isSending, setIsSending] = useState(false);
    const navigate = useNavigate();

    // Tạo hoạ tiết nền dạng lưới (grid lines) giống LoginPage
    const gridStyle = {
        backgroundImage: `linear-gradient(to right, rgba(155, 126, 184, 0.06) 1px, transparent 1px),
                      linear-gradient(to bottom, rgba(155, 126, 184, 0.06) 1px, transparent 1px)`,
        backgroundSize: '24px 24px',
    };

    // Logic đếm ngược 120s
    useEffect(() => {
        let timer;
        if (countdown > 0) {
            timer = setInterval(() => {
                setCountdown((prev) => prev - 1);
            }, 1000);
        }
        return () => clearInterval(timer);
    }, [countdown]);

    const handleSendCode = async (e) => {
        e.preventDefault();
        if (!email) return;

        const forgotPasswordRes = await authService.forgotPassword(email);

        if (forgotPasswordRes.data === "Please check email") {
            console.log("Send CODE successfully!");
            setIsSending(true);
            navigate("/reset-password");

        } else {
            console.log("Send CODE failed!");
        }

        setTimeout(() => {
            setIsSending(false);
            setCountdown(120); // Bắt đầu đếm ngược 120s
        }, 1500);
    };

    return (
        <div className="min-h-screen bg-background text-foreground flex flex-col font-sans relative" style={gridStyle}>
            {/* Nút quay lại trang đăng nhập */}
            <BackButton url="/login" />

            {/* Container căn giữa phần trên (top-middle) */}
            <div className="flex-1 flex flex-col items-center pt-20 md:pt-32 px-6">

                {/* Thẻ Form (Card) chính */}
                <div className="w-full max-w-md bg-background border border-border rounded-xl p-8 shadow-xl transition-colors duration-300 relative">

                    {/* Tiêu đề & Mô tả */}
                    <div className="space-y-3 mb-8">
                        <h1 className="text-2xl font-extrabold tracking-tight text-foreground text-center">
                            Forgot your password?
                        </h1>
                        <p className="text-sm text-muted-foreground leading-relaxed text-center">
                            Please enter your registered email below for receiving M-CODE via email
                        </p>
                    </div>

                    {/* Form Nhập Liệu */}
                    <form onSubmit={handleSendCode} className="space-y-6">

                        {/* Input Email */}
                        <div className="space-y-2">
                            <label className="text-xs font-bold tracking-widest text-muted-foreground uppercase">
                                Email
                            </label>
                            <div className="w-full bg-muted/40 border border-border focus-within:border-primary focus-within:ring-2 focus-within:ring-primary/20 rounded-xl px-4 py-3 flex items-center gap-3 transition-all">
                                <User size={18} className="text-muted-foreground/80 shrink-0" />
                                <input
                                    type="email"
                                    required
                                    placeholder="Enter your registered email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    className="bg-transparent text-foreground placeholder-muted-foreground/70 outline-none w-full text-sm font-medium"
                                />
                            </div>
                        </div>

                        {/* Nút Submit & Đếm Ngược */}
                        <div className="space-y-4">
                            <button
                                type="submit"
                                disabled={countdown > 0 || isSending}
                                className="w-full py-3.5 bg-primary text-primary-foreground font-semibold rounded-xl hover:opacity-95 transition-opacity shadow-sm text-sm cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                {isSending ? 'Sending...' : 'Send Code'}
                            </button>

                            {/* Dòng mô tả đếm ngược chỉ hiện khi countdown > 0 */}
                            {countdown > 0 && (
                                <p className="text-center text-sm text-muted-foreground">
                                    You can require for re-send the code in <span className="font-bold text-primary">{countdown}s</span>
                                </p>
                            )}
                        </div>

                    </form>
                </div>
            </div>
        </div>
    );
}
