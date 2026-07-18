import { useState, useEffect } from 'react';
import { Bell, Mail } from 'lucide-react';
import { Logo } from '@/shared/components/Logo';
import { useGetFeedback } from '@/features/series/hooks/useGetFeedback';
import { FeedbackItem } from '@/shared/components/FeedbackItem';
import { userService } from '@/services/userService';
import { HeaderMenu } from './HeaderMenu';

export function HeaderPage({ roleName, avatarUrl }) {
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);

    const normalizedRole = roleName ? roleName.toLowerCase() : "";
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
            <div className="grid grid-cols-12 shadow p-2 px-8 bg-card relative">
                <div className="hidden md:block col-span-1 px-2 content-center">
                    <img className="rounded-full w-10 h-10 object-cover border border-border"
                        src={currentUserAvatar || "/avatarImgDemo.png"} alt="Avatar Image" />
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
                    <div className='place-self-end flex items-center gap-3 relative'>
                        {/* Bell Icon & Feedback Dropdown */}
                        {hasFeedbackSupport && (
                            <div className="bell-container">
                                <button
                                    onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                                    className="relative flex text-muted-foreground hover:text-accent hover:rounded p-2 transition-colors"
                                    title="Feedback Mailbox"
                                >
                                    <div className="content-center">
                                        <Bell size={20} />
                                    </div>
                                </button>

                                {isDropdownOpen && (
                                    <div className="absolute right-0 top-full mt-2 w-80 sm:w-96 bg-card border border-border shadow-2xl rounded-2xl z-50 overflow-hidden">
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

                        {/* Hamburger Menu */}
                        <HeaderMenu roleName={roleName} />
                    </div>
                </div>
            </div>
        </>
    );
}
