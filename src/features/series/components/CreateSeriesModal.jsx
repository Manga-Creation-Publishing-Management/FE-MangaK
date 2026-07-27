import { useEffect } from "react";
import { X } from "lucide-react";
import useCreateSeries from "../hooks/useCreateSeries";
import ReactCropper from "react-cropper";
import "cropperjs/dist/cropper.css";
// Component Modal (Popup) dùng để tạo một bộ truyện mới
// Nhận vào 2 props: onClose (hàm đóng popup) và onReload (hàm load lại danh sách sau khi tạo)
export default function CreateSeriesModal({ onClose, onReload }) {

  // Sử dụng custom hook useCreateSeries để lấy các state và hàm xử lý form
  const {
    isLoading,         // Trạng thái đang tải (đang submit)
    genreList,         // Danh sách thể loại truyện
    selectGenres,      // Danh sách các thể loại người dùng đã chọn (Mảng ID)
    coverFile,         // File ảnh bìa đã chọn
    storyFile,         // File bản nháp (story) đã chọn (thường là PDF, ZIP)
    coverInputRef,     // Tham chiếu đến thẻ <input type="file"> của ảnh bìa (ẩn)
    storyInputRef,     // Tham chiếu đến thẻ <input type="file"> của bản nháp (ẩn)
    handleActive,      // Hàm xử lý click chọn/bỏ chọn thể loại
    handleChange,      // Hàm xử lý khi nhập nội dung vào ô text (tiêu đề, mô tả)
    handleCoverChange, // Hàm xử lý khi người dùng chọn xong file ảnh bìa
    handleStoryChange, // Hàm xử lý khi người dùng chọn xong file bản nháp
    handleSubmit,
    getCroppedImage,
    cropperRef,
    image// Hàm xử lý khi ấn nút Submit Form
  } = useCreateSeries(onClose, onReload); // Truyền hàm đóng và hàm reload vào hook

  return (
    // Lớp overlay (nền mờ) phủ toàn màn hình, dùng inset-0 để căn chỉnh
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">

      {/* Khung nội dung chính của Modal */}
      <div className="bg-card rounded-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">

        {/* Phần Header của Modal, dính cố định trên cùng khi cuộn (sticky) */}
        <div className="sticky top-0 bg-card border-b border-border p-6 flex justify-between items-center">
          <div className="text-2xl font-semibold text-card-foreground">Create New Series</div>
          <button onClick={onClose}
            className="p-2 hover:bg-muted text-foreground rounded-lg transition-colors cursor-pointer"
            disabled={isLoading}>
            <X />
          </button>
        </div>

        {/* Form nhập liệu */}
        <form className="p-6 space-y-6" onSubmit={handleSubmit}>

          {/* Input Tiêu đề truyện */}
          <div className="space-y-2">
            <label htmlFor="title" className="text-card-foreground font-medium">Title</label>
            <input
              id="title"
              type="text"
              className="w-full px-4 py-2 bg-input-background text-foreground rounded-lg border border-border focus:outline-none focus:ring-2 focus:ring-primary"
              placeholder="Enter series name"
              onChange={handleChange}
              name="title" // Đặt name chuẩn để handle thay đổi trong hook
            />
          </div>

          {/* Chọn Thể loại (Genres) */}
          <div className="space-y-2">
            <label className="text-card-foreground font-medium">Genres</label>
            <div className="flex flex-wrap gap-2">
              {/* Duyệt qua mảng genreList để render từng nút bấm thể loại */}
              {genreList.map(item => {
                // Kiểm tra xem thể loại này đã được chọn hay chưa (nằm trong mảng selectGenres)
                const isSelected = selectGenres.includes(item.categoryId);
                return (
                  <button
                    type="button" // Ngăn chặn việc bấm vào nút này bị hiểu là submit form
                    key={item.categoryId}
                    onClick={() => handleActive(item.categoryId)} // Click để đổi trạng thái
                    className={`px-3 py-1.5 rounded-lg border text-sm transition-colors cursor-pointer ${isSelected
                      ? "bg-primary text-primary-foreground border-primary" // Màu sắc khi ĐƯỢC CHỌN
                      : "bg-background text-foreground border-border hover:bg-muted"        // Màu sắc khi CHƯA CHỌN
                      }`}
                  >
                    {item.name}
                  </button>
                )
              })}
            </div>
          </div>

          {/* Ô nhập Mô tả */}
          <div className="space-y-2">
            <label htmlFor="description" className="text-card-foreground font-medium">Description</label>
            <textarea
              id="description"
              className="w-full px-4 py-2 bg-input-background text-foreground rounded-lg border border-border focus:outline-none focus:ring-2 focus:ring-primary min-h-32 resize-none"
              placeholder="Enter series description"
              required
              onChange={handleChange}
              name="description" // Đặt name chuẩn để handle thay đổi trong hook
            />
          </div>

          {/* Khu vực Upload Ảnh bìa (Cover) */}
          <div className="space-y-4">
            <label className="block font-medium text-card-foreground">Upload Cover Page</label>

            {/* 1. KHÚC TRÊN: Bộ cắt ảnh và nút Crop (Chỉ hiện khi ĐÃ CHỌN ảnh vào bộ nhớ tạm) */}
            {image && (
              <div className="space-y-2 border border-border p-2 rounded-lg bg-muted/20">
                <ReactCropper
                  ref={cropperRef}
                  src={image}
                  style={{ height: 400, width: "100%" }}
                  aspectRatio={3 / 4}
                  guides={true}
                  viewMode={1}
                  dragMode="move"
                  scalable={true}
                  cropBoxMovable={true}
                  cropBoxResizable={true}
                />
                <button
                  type="button"
                  onClick={getCroppedImage}
                  className="cursor-pointer px-6 py-2 bg-primary text-primary-foreground rounded-lg w-full font-medium hover:opacity-90 transition-opacity"
                >
                  Crop cover
                </button>
              </div>
            )}

            {/* 2. KHÚC DƯỚI: Component trạng thái hiển thị file (Thay đổi linh hoạt độc lập) */}
            {coverFile ? (
              /* Khi ĐÃ CẮT ảnh thành công -> Hiện component Selected theo đúng ý bạn */
              <div
                onClick={() => coverInputRef.current.click()}
                className="border-2 border-dashed border-border rounded-lg p-8 text-center hover:border-primary transition-colors cursor-pointer"
              >
                <div className="text-primary font-medium">
                  Selected: {coverFile.name}
                </div>
                <div className="text-muted-foreground text-xs italic">Click here to select a different cover image</div>
              </div>
            ) : (
              /* Khi CHƯA CHỌN ảnh nào hết -> Hiện khung nét đứt mặc định */
              <div
                onClick={() => coverInputRef.current.click()}
                className="border-2 border-dashed border-border rounded-lg p-8 text-center hover:border-primary transition-colors cursor-pointer"
              >
                <p className="text-muted-foreground">Click to upload or drag and drop</p>
                <p className="text-sm text-muted-foreground mt-1">PNG, JPG up to 10MB</p>
              </div>
            )}

            {/* Input ẩn để kích hoạt trình chọn file của hệ thống */}
            <input
              type="file"
              accept="image/*"
              className="hidden"
              ref={coverInputRef}
              onChange={handleCoverChange}
            />
          </div>

          {/* Khu vực Upload Bản nháp truyện (Story Name / NameFile) */}
          <div className="space-y-2">
            <label className="text-card-foreground font-medium">Upload Story Name</label>
            <div
              onClick={() => storyInputRef.current.click()} // Kích hoạt sự kiện click lên thẻ input bị ẩn
              name="nameFile"
              className="border-2 border-dashed border-border rounded-lg p-8 text-center hover:border-primary transition-colors cursor-pointer"
            >
              {/* Hiển thị tên file nếu đã chọn, nếu chưa thì hiển thị hướng dẫn */}
              {storyFile ? (
                <div className="text-primary font-medium">
                  Selected: {storyFile.name}
                </div>
              ) : (
                <>
                  <p className="text-muted-foreground">Click to upload or drag and drop</p>
                  <p className="text-sm text-muted-foreground mt-1">PDF, ZIP up to 50MB</p>
                </>
              )}
              {/* Thẻ input file bị ẩn */}
              <input
                type="file"
                accept=".pdf,.zip"
                className="hidden"
                ref={storyInputRef}
                onChange={handleStoryChange}
              />
            </div>
          </div>

          {/* Vùng chứa các nút điều khiển form (Hủy / Tạo mới) */}
          <div className="flex flex-col-reverse sm:flex-row sm:justify-end gap-3 pt-4">
            <button
              onClick={onClose}
              type="button"
              className="cursor-pointer px-6 py-2 rounded-lg border border-border text-foreground hover:bg-muted transition-colors w-full sm:w-auto"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isLoading} // Khóa nút bấm khi đang lưu để tránh spam
              className="cursor-pointer px-6 py-2 bg-primary text-primary-foreground rounded-lg hover:opacity-90 transition-opacity disabled:cursor-not-allowed w-full sm:w-auto"
            >
              {isLoading ? "Creating..." : "Create"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}