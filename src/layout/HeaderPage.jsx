import { useState, useEffect } from 'react';
import { Bell, Mail, PanelLeft } from 'lucide-react';
import { Link } from 'react-router';
import { Logo } from '@/shared/components/Logo';
import { useGetFeedback } from '@/features/series/hooks/useGetFeedback';
import { FeedbackItem } from '@/shared/components/FeedbackItem';
import { userService } from '@/services/userService';
import { HeaderMenu } from './HeaderMenu';

const roleRouteMap = {
    mangaka: "mangaka",
    assistant: "assistant",
    tantou: "tantou",
    editorial: "editorial",
    admin: "admin",
    reader: "reader",
    "tantou editor": "tantou",
    "editorial board": "editorial",
};

export function HeaderPage({ roleName, avatarUrl, onToggleMobileSidebar }) {
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);

    const normalizedRole = roleName ? roleName.toLowerCase() : "";
    const routeRole = roleRouteMap[normalizedRole] || "mangaka";
    const profilePath = `/${routeRole}/profile`;
    const hasFeedbackSupport = ["mangaka", "assistant", "tantou editor", "editorial board", "tantou", "editorial"].includes(normalizedRole);

    const { feedbackData } = useGetFeedback(hasFeedbackSupport);

    useEffect(() => {
        if (!isDropdownOpen) return;
        const handleOutsideClick = (e) => {
            if (!e.target.closest('.bell-container')) {
                setIsDropdownOpen(false);
            }
        };
        document.addEventListener('mousedown', handleOutsideClick);
        return () => document.removeEventListener('mousedown', handleOutsideClick);
    }, [isDropdownOpen]);

    const [currentUserAvatar, setCurrentUserAvatar] = useState(avatarUrl || "/avatarImgDemo.png");

    useEffect(() => {
        if (normalizedRole === 'reader') {
            const user = JSON.parse(localStorage.getItem('user') || '{}');
            if (user?.avatarUrl) {
                setCurrentUserAvatar(user.avatarUrl);
            }
            return;
        }
        const fetchHeaderProfile = async () => {
            try {
                const res = await userService.getProfile();
                if (res?.data?.avatarUrl) {
                    setCurrentUserAvatar(res.data.avatarUrl);
                }
            } catch (error) {
                console.error("Failed to load header profile avatar:", error);
            }
        };

        fetchHeaderProfile();
    }, [avatarUrl, normalizedRole]);

    return (
        <>
            <div className="flex items-center justify-between shadow p-2.5 px-4 sm:px-8  relative z-50">
                <div className="flex items-center gap-2 sm:gap-3">
                    {/* Mobile Sidebar Toggle Button */}
                    {normalizedRole !== 'reader' && (
                        <button
                            onClick={onToggleMobileSidebar}
                            className="md:hidden p-2 text-muted-foreground hover:text-foreground border border-sidebar-border transition-colors cursor-pointer toggle-btn"
                            title="Open Navigation"
                        >
                            <PanelLeft size={22} />
                        </button>
                    )}

                    <Link to={profilePath} className="shrink-0 hover:opacity-85 transition-opacity" title="View Profile">
                        <img className="rounded-full w-9 h-9 sm:w-10 sm:h-10 object-cover ring-2 ring-primary/50 p-0.5 border border-primary/60 cursor-pointer"
                            src={currentUserAvatar || "/avatarImgDemo.png"} alt="Avatar Image" />
                    </Link>
                    <div>
                        <span className="text-foreground text-xs sm:text-base font-semibold leading-snug block">Welcome back!</span>
                        <span className="text-muted-foreground text-[10px] sm:text-xs font-medium capitalize block">{roleName}</span>
                    </div>
                </div>

                {roleName === 'reader' && (
                    <div className="hidden sm:flex items-center justify-center">
                        <Logo />
                    </div>
                )}

                <div className="flex items-center gap-2 sm:gap-3">
                    {hasFeedbackSupport && (
                        <div className="bell-container relative">
                            <button
                                onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                                className="relative flex text-muted-foreground hover:text-accent p-2 transition-colors cursor-pointer toggle-btn"
                                title="Feedback Mailbox"
                            >
                                <div className="content-center">
                                    <Bell size={20} />
                                </div>
                            </button>

                            {isDropdownOpen && (
                                <div className="fixed sm:absolute left-4 right-4 sm:left-auto sm:right-0 top-16 sm:top-full mt-2 w-auto sm:w-96 bg-card border border-border shadow-2xl rounded-2xl z-[999] overflow-hidden">
                                    <div className="p-4 border-b border-border flex justify-between items-center bg-muted/40">
                                        <div className="flex items-center gap-2">
                                            <Mail size={18} className="text-primary" />
                                            <h3 className="font-bold text-foreground text-sm sm:text-base">Feedback Mailbox</h3>
                                        </div>
                                        {feedbackData?.data?.length > 0 && (
                                            <span className="bg-primary/10 text-primary px-2.5 py-0.5 rounded-full text-xs font-semibold">
                                                {feedbackData.data.length} messages
                                            </span>
                                        )}
                                    </div>
                                    <div className="max-h-80 overflow-y-auto p-3 flex flex-col gap-3 custom-scrollbar">
                                        {feedbackData?.data?.length > 0 ? (
                                            feedbackData.data.map((feedback) => (
                                                <FeedbackItem
                                                    key={feedback.id}
                                                    senderName={feedback.senderName}
                                                    seriesTitle={feedback.seriesTitle}
                                                    content={feedback.content}
                                                    createdAt={feedback.createdAt}
                                                    hasIcon={false}
                                                    isNew={true}
                                                />
                                            ))
                                        ) : (
                                            <div className="text-center py-8 text-muted-foreground flex flex-col items-center justify-center">
                                                <Mail size={36} className="mb-2 opacity-30 stroke-[1.5]" />
                                                <p className="text-xs">No feedback messages</p>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            )}
                        </div>
                    )}

                    <HeaderMenu roleName={roleName} />
                </div>
            </div>
        </>
    );
}
