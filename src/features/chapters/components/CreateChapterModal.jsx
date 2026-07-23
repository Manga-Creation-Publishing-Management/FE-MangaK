import { X } from "lucide-react";
import { useCreateChapter } from "../hooks/useCreateChapter";

export function CreateChapterModal({ onClose, seriesId, onReload }) {

  const {
    handleSubmitChapter,
    handleChange,
    storyInputRef,
    storyFile,
    handleStoryChange,
    isLoading,
    pageCount,
    isReadingPdf
  } = useCreateChapter(seriesId, onClose, onReload);

  return (
    <>
      <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
        <div className="bg-card rounded-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
          <div className="sticky top-0 bg-card border-b border-border p-6 flex justify-between items-center">
            <div className="text-2xl font-semibold text-card-foreground">Create New Chapter</div>
            <button
              onClick={onClose}
              className="p-2 hover:bg-muted text-foreground rounded-lg transition-colors cursor-pointer"
            >
              <X className="cursor-pointer text-foreground" />
            </button>
          </div>

          <form className="p-6 space-y-6" onSubmit={handleSubmitChapter}>

            <div className="mb-4">
              <div className='mb-2 text-xl'>
                <label htmlFor="title" className="text-card-foreground font-medium">Title</label>
              </div>
              <div className="space-y-2">
                <input
                  id="title"
                  type="text"
                  className="w-full px-4 py-2 bg-input-background text-foreground rounded-lg border border-border focus:outline-none focus:ring-2 focus:ring-primary"
                  placeholder="Enter chapter's title"
                  required
                  onChange={handleChange}
                  name="Title"
                />
              </div>
            </div>
            <div className="mb-4">
              <div className='mb-2 text-xl'>
                <label htmlFor="summary" className="text-card-foreground font-medium">Summary</label>
              </div>
              <div className="space-y-2">
                <input
                  id="summary"
                  type="text"
                  className="w-full px-4 py-2 bg-input-background text-foreground rounded-lg border border-border focus:outline-none focus:ring-2 focus:ring-primary"
                  placeholder="Enter summary"
                  required
                  onChange={handleChange}
                  name="Summary"
                />
              </div>
            </div>

            <div className="space-y-2">
              <div className='mb-2 text-xl'>
                <label className="text-card-foreground font-medium">Upload Manuscript</label>
              </div>
              <div
                onClick={() => storyInputRef.current.click()}
                name="nameFile"
                className="border-2 border-dashed border-border rounded-lg p-8 text-center hover:border-primary transition-colors cursor-pointer"
              >
                {storyFile ? (
                  <div className="space-y-1">
                    <div className="text-primary font-medium">
                      Selected: {storyFile.name}
                    </div>

                    {/* Hiển thị số trang khi đã quét xong hoặc đang quét */}
                    {isReadingPdf && (
                      <p className="text-xs text-muted-foreground animate-pulse">
                        Analyzing PDF pages...
                      </p>
                    )}
                    {pageCount !== null && (
                      <div className="inline-block bg-primary/10 text-primary text-xs font-semibold px-2.5 py-1 rounded-full mt-1">
                        Total: {pageCount} pages
                      </div>
                    )}
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
                className="cursor-pointer px-6 py-2 bg-primary text-primary-foreground rounded-lg hover:opacity-90 transition-opacity"
              >
                {isLoading ? "Creating..." : "Create"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </>
  )
}