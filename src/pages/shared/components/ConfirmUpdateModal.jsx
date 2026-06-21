import { AlertTriangle, X } from "lucide-react";

export function ConfirmUpdateModal({ show, onClose, onConfirm }) {
  if (!show) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
      <div className="bg-card w-full max-w-md p-6 rounded-xl border border-border shadow-lg">
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-amber-500/10 text-amber-500 rounded-full">
              <AlertTriangle size={24} />
            </div>
            <h3 className="text-lg font-semibold">Xác nhận cập nhật</h3>
          </div>
          <button
            onClick={onClose}
            className="text-muted-foreground hover:text-foreground transition-colors"
          >
            <X size={20} />
          </button>
        </div>
        <p className="mt-4 text-muted-foreground">
          Bạn có chắc chắn muốn cập nhật thông tin hồ sơ không?
        </p>
        <div className="mt-6 flex justify-end gap-3">
          <button
            onClick={onClose}
            className="px-4 py-2 border border-border rounded-lg hover:bg-accent transition-colors"
          >
            Hủy
          </button>
          <button
            onClick={onConfirm}
            className="px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:opacity-90 transition-opacity"
          >
            Xác nhận
          </button>
        </div>
      </div>
    </div>
  );
}
