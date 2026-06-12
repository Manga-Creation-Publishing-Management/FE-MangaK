import { Outlet, useParams } from "react-router"
import { StatusBadge } from "../../../pages/shared/StatusBadge";
import { Outdent, Plus } from "lucide-react";
import { useCreateChapter } from "../hooks/useCreateChapter";
import { useSeriesManagement } from "../../series/hooks/useSeriesManagement";

// Component hiển thị danh sách các Chapter (chương) thuộc về một bộ truyện (Series)
export function ChapterList({ roleName, seriesData }) {

  console.log("seriesID:", seriesData?.seriesId)
  
  // Dùng hook useCreateChapter để fetch danh sách các chapter dựa trên seriesId
  const { chapterList } = useCreateChapter(seriesData?.seriesId);

  // Hook hỗ trợ việc điều hướng (chuyển trang) sang xem chi tiết một chapter
  const { handleNavigateToChapter } = useSeriesManagement();

  console.log("length", chapterList.length)

  return (
    <>
      {(seriesData?.status === "Approved" || seriesData?.status === "Publishing") && (
        <>
          {/* Header của phần danh sách Chapter */}
          <div className="flex justify-between items-center">
            <div>
              {/* Tiêu đề hiển thị kèm tổng số lượng chapter */}
              <h2 className="text-2xl ps-2 font-semibold ">Chapters ({chapterList?.length})</h2>
            </div>
            
            {/* Cụm nút bấm phía bên phải */}
            <div className="flex gap-3">
              <>
                {/* 
                  Đoạn code comment cũ có vẻ là tính năng Manage Tasks (Quản lý công việc),
                  tạm thời bị ẩn đi.
                */}
                
                {/* Chỉ hiển thị nút "Add New Chapter" nếu user hiện tại là Mangaka */}
                {roleName?.toLowerCase() === "mangaka" &&
                  <button
                    // onClick={() => setShowAddChapter(true)} // Tạm ẩn chức năng mở form thêm
                    className="cursor-pointer flex items-center gap-2 px-4 py-2 bg-accent text-accent-foreground rounded-lg hover:opacity-90 transition-opacity"
                  >
                    <Plus size={20} />
                    Add New Chapter
                  </button>
                }
              </>
            </div>
          </div>
          
          {/* Danh sách các card hiển thị thông tin từng chapter */}
          <div className="space-y-4">
            {chapterList?.map((chapter) => {
              const showChapter = roleName === 'reader'
                ? chapter.status?.toLowerCase() === 'publishing'
                : true; // nếu là reader, chapter k pub thì false, nếu không là reader thì true, 
              // nếu vừa là reader và pub thì true

              if (!showChapter) return null; //tức là nếu là reader mà chapter không pub sẽ không trả về

              return (
                <div key={chapter.chapterId} className="bg-card border border-border rounded-xl p-5 hover:shadow-lg transition-shadow">
                  <div className="flex items-center justify-between">
                    <div className="flex-1 min-w-0">
                      <h3 className="py-1 font-semibold text-xl break-words">
                        Chapter {chapter.chapterNumber}: {chapter.title}
                      </h3>
                      <p className="text-sm text-muted-foreground py-2">
                        Uploaded: {chapter.createdAt}
                      </p>
                    </div>
                    <div className="flex items-center gap-4 shrink-0">
                      <StatusBadge status={chapter.status} />

                      {/* Đã xóa mt-4 thừa ở nút bấm để không bị lệch trục dọc */}
                      {console.log(`${roleName?.toLowerCase()}${seriesData.id}${chapter.id}`)}
                      <button
                        className="cursor-pointer block text-center px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:opacity-90 transition-opacity"
                        onClick={() => handleNavigateToChapter(roleName?.toLowerCase(), seriesData?.seriesId, chapter?.chapterId)}
                      >

                        View Detail
                      </button>

                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </>
      )}

    </>
  )
}