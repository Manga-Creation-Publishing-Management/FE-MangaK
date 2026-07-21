import { useState } from 'react';
import { X, Upload, FileImage } from 'lucide-react';
import { useCreateTask } from '../hooks/useCreateTask';
import { CustomSelect } from '@/shared/components/CustomSelect';
import { useToast } from '../../../shared/hooks/useToast';


export default function CreateTaskModal({
  onClose,
  showSeriesApproval,
  showAssistantList,
  chapters,
  selectedSeriesId,
  onSeriesChange,
  onSubmitCreateTask,
  onReload,
  selectedChapterId,
  onChapterChange,
  maxPagesAllowed,
  isLoading
}) {
  const [pageRangeError, setPageRangeError] = useState("");
  const [localAssignedToId, setLocalAssignedToId] = useState("");

  const { showAlert } = useToast();

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
  const selectedChapter = (chapters || []).find(
    (item) => item.chapterId === selectedChapterId
  );
  return (
    <>
      <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
        <div className="bg-card rounded-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
          <div className="sticky top-0 bg-card border-b border-border p-6 flex justify-between items-center">
            <div className="text-2xl font-semibold text-card-foreground">Create New Task</div>
            <button
              onClick={onClose}
              className="p-2 hover:bg-muted text-foreground rounded-lg transition-colors cursor-pointer"

            >
              <X />
            </button>
          </div>

          <form className="p-6 space-y-6" onSubmit={onSubmitCreateTask}>

            <div className="mb-4">
              <div className='mb-2 text-l'>
                <label htmlFor="seriesName">Series</label>
              </div>
              <CustomSelect
                name="seriesId"
                value={selectedSeriesId}
                onChange={onSeriesChange}
                options={[
                  { value: "", label: "Choose a series..." },
                  ...(showSeriesApproval || []).map((item) => ({
                    value: item.seriesId,
                    label: item.title,
                  })),
                ]}
              />
            </div>
            <div className="mb-4">
              <div className='mb-2 text-l'>
                <label htmlFor="seriesName">Chapter Number</label>
              </div>
              <CustomSelect
                name="chapterId"
                value={selectedChapterId}
                onChange={onChapterChange}
                options={[
                  { value: "", label: "Choose a chapter..." },
                  ...(chapters || []).map((item) => ({
                    value: item.chapterId,
                    label: `Chapter ${item.chapterNumber}`,
                  })),
                ]}
              />
            </div>

            <div className="mb-4">
              <div className='mb-2 text-xl'>
                <label htmlFor="seriesName">Assistant</label>
              </div>
              <CustomSelect
                name="assignedToId"
                value={localAssignedToId}
                onChange={setLocalAssignedToId}
                options={[
                  { value: "", label: "Choose an Assistant..." },
                  ...(showAssistantList || []).map((item) => ({
                    value: item.userId,
                    label: `${item.lastName} ${item.firstName}`,
                  })),
                ]}
              />
            </div>
            <div>
              <div className='mb-2 text-l'>
                <label htmlFor="">Description</label>
              </div>
              <textarea
                id="page_range"
                name="taskTitle"
                className="w-full px-4 py-2 bg-input-background rounded-lg border border-border focus:outline-none focus:ring-2 focus:ring-primary resize-none"
                // placeholder="..."
                required
                rows={3}
                onInvalid={(e) => {
                  e.preventDefault(); // Chặn popup mặc định của trình duyệt
                  showAlert(`Description cannot be empty`);
                }}
              />
            </div>

            <div className="grid grid-cols-3 gap-4 mb-4">
              {/* Bên trái: Page Range */}

              <div>
                <div className='mb-2 text-l'>
                  <label htmlFor="">From Page</label>
                </div>
                <input
                  min={1}
                  max={maxPagesAllowed || undefined}
                  type="number"
                  id="fromPage"
                  name="fromPage"
                  className="w-full px-4 py-2 bg-input-background rounded-lg border border-border focus:outline-none focus:ring-2 focus:ring-primary"
                  placeholder="Enter From Page"
                  required
                />
              </div>
              <div>
                <div className='mb-2 text-l flex items-center gap-2'>
                  <label htmlFor="">To Page</label>
                  {selectedChapter && (
                    <span className="text-xs text-gray-400">
                      (Max: {selectedChapter?.totalPage} pages)
                    </span>
                  )}
                </div>
                <input
                  min={1}
                  max={maxPagesAllowed || undefined}
                  type="number"
                  id="toPage"
                  name="toPage"
                  className="w-full px-4 py-2 bg-input-background rounded-lg border border-border focus:outline-none focus:ring-2 focus:ring-primary"
                  placeholder="Enter To Page"
                  required
                  onInvalid={(e) => {
                    e.preventDefault(); // Chặn popup mặc định của trình duyệt
                    // Kiểm tra xem lỗi là do vượt quá max hay do chưa nhập
                    if (e.target.validity.rangeOverflow) {
                      showAlert(`Value must be less than or equal to ${maxPagesAllowed}`);
                    }
                  }}
                />

              </div>
              <div>
                <div className='mb-2 text-l'>
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
              <div className='mb-2 text-l'>
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
                className="cursor-pointer px-6 py-2 rounded-lg border border-border text-foreground hover:bg-muted transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isLoading}
                className="cursor-pointer px-6 py-2 bg-primary text-primary-foreground rounded-lg hover:opacity-90 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isLoading ? "Creating..." : "Create"}
              </button>
            </div>
          </form>
        </div >
      </div >
    </>
  );
}
