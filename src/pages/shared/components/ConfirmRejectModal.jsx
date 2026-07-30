
export function ConfirmRejectModal({ isOpen, onClose, onYes, onNo }) {
    
    if (!isOpen) return null;

    return (
        <div
            
            onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
            className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4">

            <div className="bg-card border border-border rounded-2xl shadow-2xl p-5 sm:p-6 flex flex-col items-center gap-4 relative w-full max-w-sm text-center animate-in zoom-in-95 duration-150">
                <div className="">
                    <h2 className="text-xl sm:text-2xl font-semibold">Confirm Reject</h2>
                </div>
                <div>
                    <p className="text-foreground text-sm leading-relaxed">Do you want to annotate on file instead of text feedback?</p>
                </div>
                <div className="flex flex-col-reverse sm:flex-row gap-3 w-full justify-center">
                    
                    <button onClick={onNo}
                        className="px-5 py-2.5 rounded-lg bg-destructive text-background font-semibold cursor-pointer transition-all duration-150 hover:opacity-90 active:scale-[0.98] w-full sm:w-auto text-center"
                    >
                        No
                    </button>
                    
                    <button onClick={onYes}
                        className="px-5 py-2.5 rounded-lg bg-primary text-background font-semibold cursor-pointer transition-all duration-150 hover:opacity-90 active:scale-[0.98] w-full sm:w-auto text-center"
                    >
                        Yes
                    </button>
                </div>
            </div>
        </div >
    );
}
