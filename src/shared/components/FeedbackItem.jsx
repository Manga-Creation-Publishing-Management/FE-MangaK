import { AlertCircle } from 'lucide-react';

export function FeedbackItem({ senderName, seriesTitle, content, createdAt, hasIcon, isNew }) {
    return (
        <div className={`group bg-card border border-border hover:border-primary/40 hover:shadow-md hover:-translate-y-0.5 transition-all duration-300 rounded-2xl p-5 flex gap-4 ${isNew ? 'ring-1 ring-primary/20' : ''}`}>
            <div className="flex-shrink-0 flex items-start pt-0.5">
                {hasIcon ? (
                    <div className="w-10 h-10 rounded-full bg-secondary text-primary flex items-center justify-center transition-transform duration-300 group-hover:scale-110">
                        <AlertCircle size={20} className="stroke-[2.2]" />
                    </div>
                ) : (
                    <div className="w-10" />
                )}
            </div>

            <div className="flex-grow">
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-baseline gap-1 mb-2">
                    <h4 className="text-foreground font-semibold text-base md:text-lg group-hover:text-primary transition-colors duration-200">
                        {seriesTitle}
                    </h4>
                    <span className="text-muted-foreground text-xs md:text-sm font-light whitespace-nowrap">
                        {createdAt}
                    </span>
                </div>
                <p className="text-muted-foreground font-medium text-xs md:text-sm mb-1.5">{senderName}</p>
                <p className="text-foreground/90 text-sm leading-relaxed font-light">{content}</p>
            </div>
        </div>
    );
}
