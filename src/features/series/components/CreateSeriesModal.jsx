import { useEffect } from "react";
import { X } from "lucide-react";
import useCreateSeries from "../hooks/useCreateSeries";
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
  } = useCreateSeries(onClose, onReload);

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-card rounded-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-card border-b border-border p-6 flex justify-between items-center">
          <div className="text-2xl font-semibold">Create New Task</div>
          <button onClick={onClose}
            className="p-2 hover:bg-muted rounded-lg transition-colors"
            disabled={isLoading}>
              <X/>
          </button>
        </div>

        <form className="p-6 space-y-6" onSubmit={handleSubmit}>
          <div className="space-y-2">
            <label htmlFor="seriesName">Title</label>
            <input
              id="title"
              type="text"
              className="w-full px-4 py-2 bg-input-background rounded-lg border border-border focus:outline-none focus:ring-2 focus:ring-primary"
              placeholder="Enter series name"
              required
              onChange={handleChange}
              name="title"
            />
          </div>

          <div className="space-y-2">
            <label>Genres</label>
            <div className="flex flex-wrap gap-2">
              {genreList.map(item => {
                const isSelected = selectGenres.includes(item.categoryId);
                return (<button
                  type="button"
                  key={item.categoryId}
                  onClick={() => handleActive(item.categoryId)}
                  className={`px-3 py-1.5 rounded-lg border text-sm transition-colors cursor-pointer ${isSelected
                    ? "bg-primary text-primary-foreground border-primary" 
                    : "bg-background border-border hover:bg-muted"     
                    }`}
                >{item.name}
                </button>
                )
              })}
            </div>
          </div>

          <div className="space-y-2">
            <label htmlFor="description">Description</label>
            <textarea
              id="description"
              className="w-full px-4 py-2 bg-input-background rounded-lg border border-border focus:outline-none focus:ring-2 focus:ring-primary min-h-32 resize-none"
              placeholder="Enter series description"
              required
              onChange={handleChange}
              name="description"
            />
          </div>

          <div className="space-y-2">
            <label>Upload Cover Page</label>
            <div
              onClick={() => coverInputRef.current.click()}
              name="coverFile"
              className="border-2 border-dashed border-border rounded-lg p-8 text-center hover:border-primary transition-colors cursor-pointer"
            >
              {coverFile ? (
                <div className="text-primary font-medium">
                  Selected: {coverFile.name}
                </div>
              ) : (
                <>
                  <p className="text-muted-foreground">Click to upload or drag and drop</p>
                  <p className="text-sm text-muted-foreground mt-1">PNG, JPG up to 10MB</p>
                </>
              )}
              <input
                type="file"
                accept="image/*"
                className="hidden"
                ref={coverInputRef}
                onChange={handleCoverChange}
              />
            </div>
          </div>

          <div className="space-y-2">
            <label>Upload Story Name</label>
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
                  <p className="text-sm text-muted-foreground mt-1">PNG, JPG up to 10MB</p>
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
              className=" cursor-pointer px-6 py-2 rounded-lg border border-border hover:bg-muted transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isLoading}
              className="px-6 py-2 bg-primary text-primary-foreground rounded-lg hover:opacity-90 transition-opacity"
            >
              {isLoading ? "Creating..." : "Create"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}