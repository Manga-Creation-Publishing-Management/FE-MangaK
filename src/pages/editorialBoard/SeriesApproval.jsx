import { SeriesManagement } from "../shared/SeriesManagement";

// Component SeriesApproval: Dành cho màn hình phê duyệt của Editorial Board
export function SeriesApproval() {
  return (
    <>
      <div className="p-3">
        {/* Header chào mừng và mô tả trang */}
        <div className="p-3 flex justify-start">
          <div className="p-3 mb-5">
            <p className="text-sidebar-foreground font-medium text-2xl pb-1">Series Approval</p>
            <p className="text-muted-foreground">Review and approve series submitted by Tantou Editors</p>
          </div>
        </div>
        
        {/* Nhúng component SeriesManagement:
            - Truyền role="editorial" để điều chỉnh hiển thị/logic phù hợp.
            - statusFilter: Giới hạn chỉ hiển thị các truyện có trạng thái nằm trong mảng này (Pending, Approved, v.v.)
        */}
        <SeriesManagement role="editorial" statusFilter={["Pending", "Approved", "Rejected", "Publishing", "Cancelled"]} />
      </div>
    </>
  )
}