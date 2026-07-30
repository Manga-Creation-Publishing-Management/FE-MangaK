import { AlertCircle } from 'lucide-react';
import { useNavigate } from 'react-router';
import dayjs from 'dayjs';

export function FeedbackItem({ seriesId, chapterId, taskId, senderName, seriesTitle, content, createdAt, hasIcon, onClick, isNew }) {
    const navigate = useNavigate();
    const formattedDate = dayjs(createdAt).isValid()
        ? dayjs(createdAt).format('DD/MM/YYYY HH:mm')
        : createdAt;

    return (
        <div
            onClick={onClick}
            className={`relative cursor-pointer group rounded-2xl p-5 flex gap-4 transition-all duration-300 ${isNew
                ? 'bg-primary/10 border-2 border-primary/60 border-l-4 border-l-primary ring-2 ring-primary/20 shadow-md'
                : 'bg-card border border-border opacity-70 hover:opacity-100'
                }`}
        >
            
            {isNew && (
                <span className="absolute top-3 right-3 flex h-3 w-3">
                    <span className="bg-card animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-3 w-3 bg-primary"></span>
                </span>
            )}
            {hasIcon && (
                <div className="flex-shrink-0 flex items-start pt-0.5">
                    <div className="w-10 h-10 rounded-full bg-secondary text-primary flex items-center justify-center transition-transform duration-300 group-hover:scale-110">
                        <AlertCircle size={20} className="stroke-[2.2]" />
                    </div>
                </div>
            )}

            <div className="flex-grow min-w-0">
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-baseline gap-2 mb-2">
                    <h4 className="text-foreground font-semibold text-base md:text-lg group-hover:text-primary transition-colors duration-200 break-words">
                        {seriesTitle}
                    </h4>
                    <span className="text-muted-foreground text-xs md:text-sm font-light whitespace-nowrap shrink-0">
                        {formattedDate}
                    </span>
                </div>
                <p className="text-muted-foreground font-medium text-xs md:text-sm mb-1.5">{senderName}</p>
                <p className="text-foreground/90 text-sm leading-relaxed font-light break-words">{content}</p>
            </div>
        </div>
    );

}