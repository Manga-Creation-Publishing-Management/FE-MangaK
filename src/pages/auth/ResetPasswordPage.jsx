import { useState } from 'react';
import { Lock, User, Eye, EyeOff } from 'lucide-react';
import { BackButton } from './BackButton';
import { authService } from '../../services/authService';
import { useToast } from '../../shared/hooks/useToast';
import { useNavigate } from 'react-router';

export function ResetPasswordPage() {
    const navigate = useNavigate();
    const [code, setCode] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const { showAlert } = useToast();
    const [isSending, setIsSending] = useState(false);
    const [showPassword, setShowPassword] = useState(false);


    // Tạo hoạ tiết nền dạng lưới (grid lines) giống LoginPage
    const gridStyle = {
        backgroundImage: `linear-gradient(to right, rgba(155, 126, 184, 0.06) 1px, transparent 1px),
                      linear-gradient(to bottom, rgba(155, 126, 184, 0.06) 1px, transparent 1px)`,
        backgroundSize: '24px 24px',
    };


    const handleResetPassword = async (e) => {
        e.preventDefault();
        if (!code || !newPassword) return;

        const resetPasswordRes = await authService.resetPassword(code, newPassword);

        if (resetPasswordRes.message === "Change password successfully") {
            console.log("Change password successfully!");
            setIsSending(true);
            showAlert("Your password has been reset successfully!", "success");
            navigate("/");

        } else {
            console.log("Change password failed!");
            showAlert("Your password has been reset failed!", "error");
        }
        setIsSending(false);
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
                            Reset your password
                        </h1>
                        <p className="text-sm text-muted-foreground leading-relaxed text-center">
                            Please enter your M-CODE and new password below
                        </p>
                    </div>

                    {/* Form Nhập Liệu */}
                    <form onSubmit={handleResetPassword} className="space-y-6">

                        {/* Input Email */}
                        <div className="space-y-2">
                            <label className="text-xs font-bold tracking-widest text-muted-foreground uppercase">
                                M-CODE
                            </label>
                            <div className="w-full bg-muted/40 border border-border focus-within:border-primary focus-within:ring-2 focus-within:ring-primary/20 rounded-xl px-4 py-3 flex items-center gap-3 transition-all">
                                <User size={18} className="text-muted-foreground/80 shrink-0" />
                                <input
                                    type="text"
                                    maxLength={6}
                                    required
                                    placeholder="Enter received M-CODE"
                                    value={code}
                                    onChange={(e) => setCode(e.target.value)}
                                    className="bg-transparent font-medium text-foreground placeholder-muted-foreground/70 outline-none w-full text-sm font-medium"
                                />
                            </div>

                            <label className="text-xs font-bold tracking-widest text-muted-foreground uppercase">
                                New Password
                            </label>
                            <div className="w-full bg-muted/40 border border-border focus-within:border-primary focus-within:ring-2 focus-within:ring-primary/20 rounded-xl px-4 py-3 flex items-center gap-3 transition-all">
                                <Lock size={18} className="text-muted-foreground/80 shrink-0" />
                                {/* Ẩn/Hiện mật khẩu phụ thuộc vào giá trị state showPassword */}
                                <input
                                    required
                                    type={showPassword ? 'text' : 'password'}
                                    placeholder="Enter password"
                                    value={newPassword}
                                    onChange={(e) => setNewPassword(e.target.value)}
                                    className="bg-transparent text-foreground placeholder-muted-foreground/70 outline-none w-full text-sm font-medium"
                                />

                                {/* Nút bấm con mắt để thay đổi cờ showPassword */}
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="text-muted-foreground hover:text-foreground shrink-0 focus:outline-none cursor-pointer"
                                >
                                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                                </button>
                            </div>
                        </div>

                        {/* Nút Submit*/}
                        <div className="space-y-4">
                            <button
                                type="submit"
                                disabled={isSending}
                                className="w-full py-3.5 bg-primary text-primary-foreground font-semibold rounded-xl hover:opacity-95 transition-opacity shadow-sm text-sm cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                {isSending ? 'Verifying...' : 'Change password'}
                            </button>

                        </div>

                    </form>
                </div>
            </div>
        </div>
    );
}
