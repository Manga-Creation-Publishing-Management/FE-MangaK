import { useState } from 'react';
import { X, Upload, FileImage } from 'lucide-react';
import { useCreateTask } from '../hooks/useCreateTask';


export default function CreateTaskModal({
  onClose,
  showSeriesApproval,
  showAssistantList,
  chapters,
  selectedSeriesId,
  onSeriesChange,
  onSubmitCreateTask
}) {
  const [pageRangeError, setPageRangeError] = useState("");

  // 2. Hàm kiểm tra định dạng khi người dùng click ra ngoài (Blur)
  const handlePageRangeBlur = (e) => {
    const value = e.target.value.trim();

    // Nếu ô này trống và đang là required, bạn có thể check trống
    if (!value) {
      setPageRangeError("Page range is required.");
      return;
    }

    // Định nghĩa Regex: bắt buộc phải có dạng [Số]-[Số]
    const regex = /^\d+-\d+$/;

    if (!regex.test(value)) {
      // Nếu nhập sai định dạng, set câu thông báo lỗi
      setPageRangeError("Please use the format: number-number (e.g. 1-30).");
    } else {
      // Nếu nhập đúng, xóa bỏ thông báo lỗi
      setPageRangeError("");
    }
  };
  return (
    <>
      <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
        <div className="bg-card rounded-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
          <div className="sticky top-0 bg-card border-b border-border p-6 flex justify-between items-center">
            <div className="text-2xl font-semibold">Create New Task</div>
            <button
              onClick={onClose}
              className="p-2 hover:bg-muted rounded-lg transition-colors"
              
            >
              <X/>
            </button>
          </div>

          <form className="p-6 space-y-6" onSubmit={onSubmitCreateTask}>

            <div className="mb-4">
              <div className='mb-2 text-xl'>
              <label htmlFor="seriesName">Series</label>
              </div>
              <select
                name="seriesId"
                onChange={(e) => onSeriesChange(e.target.value)}
                value={selectedSeriesId}
                className='w-full px-4 py-3 bg-input-background rounded-lg border border-border focus:outline-none focus:ring-2 focus:ring-primary'>
                <option  value="">Choose a series...</option>
                {showSeriesApproval?.map((item) => (
                  <option
                    key={item.seriesId}
                    value={item.seriesId}
                  >{item.title}</option>
                ))}
                </select>
            </div>
            <div className="mb-4">
              <div className='mb-2 text-xl'>
                <label htmlFor="seriesName">Chapter Number</label>
              </div>
              <select name="chapterId" className='w-full px-4 py-3 bg-input-background rounded-lg border border-border focus:outline-none focus:ring-2 focus:ring-primary' id="">
                <option value="">Choose a chapter...</option>
                {chapters?.map((item) => (
                  <option
                    key={item.chapterId}
                    value={item.chapterId}
                  >Chapter {item.chapterNumber}</option>
                ))}
              </select>
            </div>

            <div className="mb-4">
              <div className='mb-2 text-xl'>
                <label htmlFor="seriesName">Assistant</label>
              </div>
              <select name="assignedToId" className='w-full px-4 py-3 bg-input-background rounded-lg border border-border focus:outline-none focus:ring-2 focus:ring-primary' >
                <option value="">Choose a Assistant...</option>
                {showAssistantList?.map((item) => (
                  <option
                    key={item.userId}
                    value={item.userId}
                  >{item.firstName}</option>
                ))}
              </select>
            </div>
            <div>
              <div className='mb-2 text-xl'>
                <label htmlFor="page_range">Description</label>
              </div>
              <textarea
                id="page_range"
                name="taskTitle"
                className="w-full px-4 py-2 bg-input-background rounded-lg border border-border focus:outline-none focus:ring-2 focus:ring-primary resize-none"
                // placeholder="..."
                required
                rows={3}
              />
            </div>

            <div className="grid grid-cols-2 gap-4 mb-4">
              {/* Bên trái: Page Range */}
              <div>
                <div className='mb-2 text-xl'>
                  <label htmlFor="page_range">Page Range</label>
                </div>
                <input
                  id="page_range"
                  name="page_range"
                  className="w-full px-4 py-2 bg-input-background rounded-lg border border-border focus:outline-none focus:ring-2 focus:ring-primary resize-none"
                  placeholder="e.g. 1-20"
                  required
                  type="text"
                  onBlur={handlePageRangeBlur}
                  onChange={() => setPageRangeError("")}
                />
                {/* 3. Hiển thị dòng chữ báo lỗi màu đỏ ngay dưới ô nhập nếu có lỗi */}
                {pageRangeError && (
                  <span className="text-red-500 text-sm mt-1 block">
                    {pageRangeError}
                  </span>
                )}
              </div>

              {/* Bên phải: Income */}
              <div>
                <div className='mb-2 text-xl'>
                  <label htmlFor="income">Income</label>
                </div>
                <input
                  min={0}
                  type="number"
                  id="income"
                  name="amountIncome"
                  className="w-full px-4 py-2 bg-input-background rounded-lg border border-border focus:outline-none focus:ring-2 focus:ring-primary"
                  placeholder="Enter income"
                  required
                />
              </div>
            </div>
            <div className="mb-4">
              <div className='mb-2 text-xl'>
                <label htmlFor="deadline">Deadline</label>
              </div>
              <input
                type="datetime-local"
                name="deadline" // Tên thuộc tính sẽ gửi lên Backend
                required
                className="w-full px-4 py-2 bg-input-background rounded-lg border border-border focus:outline-none focus:ring-2 focus:ring-primary"
              />
            </div>

            
            

            
            <div className="flex justify-end gap-3 pt-4">
              <button
                onClick={onClose}
                type="button"
                className=" cursor-pointer px-6 py-2 rounded-lg border border-border hover:bg-muted transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                // disabled={isLoading}
                className="px-6 py-2 bg-primary text-primary-foreground rounded-lg hover:opacity-90 transition-opacity"
              >
                create
                {/* {isLoading ? "Creating..." : "Create"} */}
              </button>
            </div>
          </form>
        </div>
      </div>
    </>
  );
}
