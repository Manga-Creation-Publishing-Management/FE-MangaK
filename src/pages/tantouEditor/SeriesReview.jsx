import { SeriesManagement } from "../shared/SeriesManagement";

// Component SeriesReview: Dành cho màn hình Đánh giá Truyện của Tantou Editor
export function SeriesReview() {
  return (
    <>
      {/* <div className="p-3"> */}
      <div className="p-3 flex justify-start">
        {/* Phần tiêu đề giải thích mục đích của trang */}
        <div className="p-3 mb-5">
          <p className="text-sidebar-foreground font-medium text-2xl pb-1">Series Management</p>
          <p className="text-muted-foreground">Review and approve series for Editorial Board</p>
        </div>
      </div>
      <SeriesManagement role="tantou" statusFilter={["Processing", "Rejected", "PendingBoard", "Approved", "Publishing"]} />

      {/* </div > */}
    </>
  )
}