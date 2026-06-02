import { ArrowLeft } from "lucide-react";
import { LoginHook } from "../../features/auth/hooks/LoginHook"

export function BackButton({ url }) {
    const { navigate } = LoginHook();

    return (
        <button onClick={() => navigate(url)}
            className="absolute top-6 right-6 flex items-center gap-2 px-4 py-2 bg-card border border-border 
            text-foreground hover:bg-muted/80 rounded-xl text-sm font-semibold shadow-sm transition-all 
            duration-200 cursor-pointer z-10"
        >
            <ArrowLeft size={16} />
            <span>Back to Home</span>
        </button>
    )
}