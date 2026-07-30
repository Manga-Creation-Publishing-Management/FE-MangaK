import { X } from 'lucide-react';
import useCreateSeries from '@/features/series/hooks/useCreateSeries';
import ReactCropper from 'react-cropper';
import "cropperjs/dist/cropper.css";

export default function CreateSeriesModal({ onClose, onReload }) {

  const {
    isLoading,         
    genreList,         
    selectGenres,      
    coverFile,         
    storyFile,         
    coverInputRef,     
    storyInputRef,     
    handleActive,      
    handleChange,      
    handleCoverChange, 
    handleStoryChange, 
    handleSubmit,
    getCroppedImage,
    cropperRef,
    image
  } = useCreateSeries(onClose, onReload); 

  return (
    
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">

      <div className="bg-card rounded-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">

        <div className="sticky top-0 bg-card border-b border-border p-6 flex justify-between items-center">
          <div className="text-2xl font-semibold text-card-foreground">Create New Series</div>
          <button onClick={onClose}
            className="p-2 hover:bg-muted text-foreground rounded-lg transition-colors cursor-pointer"
            disabled={isLoading}>
            <X />
          </button>
        </div>

        <form className="p-6 space-y-6" onSubmit={handleSubmit}>

          <div className="space-y-2">
            <label htmlFor="title" className="text-card-foreground font-medium">Title</label>
            <input
              id="title"
              type="text"
              className="w-full px-4 py-2 bg-input-background text-foreground rounded-lg border border-border focus:outline-none focus:ring-2 focus:ring-primary"
              placeholder="Enter series name"
              onChange={handleChange}
              name="title" 
            />
          </div>

          <div className="space-y-2">
            <label className="text-card-foreground font-medium">Genres</label>
            <div className="flex flex-wrap gap-2">
              
              {genreList.map(item => {
                
                const isSelected = selectGenres.includes(item.categoryId);
                return (
                  <button
                    type="button" 
                    key={item.categoryId}
                    onClick={() => handleActive(item.categoryId)} 
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

          <div className="space-y-2">
            <label htmlFor="description" className="text-card-foreground font-medium">Description</label>
            <textarea
              id="description"
              className="w-full px-4 py-2 bg-input-background text-foreground rounded-lg border border-border focus:outline-none focus:ring-2 focus:ring-primary min-h-32 resize-none"
              placeholder="Enter series description"
              required
              onChange={handleChange}
              name="description" 
            />
          </div>

          <div className="space-y-4">
            <label className="block font-medium text-card-foreground">Upload Cover Page</label>

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

            {coverFile ? (
              
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
              
              <div
                onClick={() => coverInputRef.current.click()}
                className="border-2 border-dashed border-border rounded-lg p-8 text-center hover:border-primary transition-colors cursor-pointer"
              >
                <p className="text-muted-foreground">Click to upload or drag and drop</p>
                <p className="text-sm text-muted-foreground mt-1">PNG, JPG up to 10MB</p>
              </div>
            )}

            <input
              type="file"
              accept="image/*"
              className="hidden"
              ref={coverInputRef}
              onChange={handleCoverChange}
            />
          </div>

          <div className="space-y-2">
            <label className="text-card-foreground font-medium">Upload Story Name</label>
            <div
              onClick={() => storyInputRef.current.click()} 
              name="nameFile"
              className="border-2 border-dashed border-border rounded-lg p-8 text-center hover:border-primary transition-colors cursor-pointer"
            >
              
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
              
              <input
                type="file"
                accept=".pdf,.zip"
                className="hidden"
                ref={storyInputRef}
                onChange={handleStoryChange}
              />
            </div>
          </div>

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
              disabled={isLoading} 
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