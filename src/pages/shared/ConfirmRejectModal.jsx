// ConfirmRejectModal.jsx
export function ConfirmRejectModal({ isOpen, onClose, onYes, onNo }) {
    // Nếu isOpen = false thì không render gì cả
    if (!isOpen) return null;

    return (
        <div
            // Bấm ra ngoài vùng tối (backdrop) thì đóng Modal
            onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
            className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4">

            <div className="bg-card border border-border rounded-2xl shadow-2xl p-6 flex flex-col items-center gap-4 relative">
                <div className="">
                    <h2 className="text-2xl font-semibold">Confirm Reject</h2>
                </div>
                <div>
                    <p className="text-foreground font-small">Do you want to annotate on file instead of text feedback?</p>
                </div>
                <div className="flex gap-4">
                    {/* Bấm Yes -> Gọi hàm onYes từ cha truyền xuống */}
                    <button onClick={onYes}
                        className="px-5 py-2.5 rounded-lg bg-primary text-background font-semibold cursor-pointer transition-all duration-150 hover:opacity-90 active:scale-[0.98]">
                        Yes
                    </button>
                    {/* Bấm No -> Gọi hàm onNo từ cha truyền xuống */}
                    <button onClick={onNo}
                        className="px-5 py-2.5 rounded-lg bg-destructive text-background font-semibold cursor-pointer transition-all duration-150 hover:opacity-90 active:scale-[0.98]">
                        No
                    </button>
                </div>
            </div>
        </div >
    );
}
