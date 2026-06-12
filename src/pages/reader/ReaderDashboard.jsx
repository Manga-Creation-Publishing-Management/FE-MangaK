import { WelcomeLine } from '../shared/WelcomeLine'
import { Search } from 'lucide-react'
import { SeriesManagement } from '../shared/SeriesManagement'
import { useSearch } from '../../features/series/hooks/useSearch'
import { HeaderPage } from '../shared/HeaderPage';
import avatarImgDemo from "../shared/avatarImgDemo.png";
import { Outlet } from 'react-router';

// Component Trang chủ dành cho Reader (Độc giả)
export function ReaderDashboard() {
    // Sử dụng custom hook search để lấy ra chuỗi tìm kiếm, kết quả lọc và hàm xử lý input
    const { searchTxt, searchResult, handleSearch } = useSearch();

    return (
        <div className='h-screen p-2 bg-background'>
            <HeaderPage roleName="Reader" avatarUrl={avatarImgDemo} />
            <div className='p-5 bg-background'>
                {/* Lời chào */}
                <WelcomeLine roleName="Reader" />

                {/* Vùng Tìm Kiếm (Search Box) */}
                <div className='p-3 mx-3 bg-card rounded-lg border border-border hover:shadow'>
                    <p className='p-3 pb-5 text-muted-foreground '>Search for a series and rate your favourite chapters</p>
                    
                    {/* Thanh input có icon Kính lúp */}
                    <div className='p-3 bg-muted rounded-full flex gap-3 hover:border-2 hover:border-primary'>
                        <Search color='rgba(123, 100, 138, 1)' />
                        <input 
                            className='w-full focus:outline-none ' 
                            type="text"
                            placeholder='Search series by name ... '
                            onChange={(e) => { handleSearch(e.target.value) }} // Cập nhật state searchTxt mỗi khi gõ
                        />
                    </div>
                </div>

                {/* Logic hiển thị danh sách truyện:
                    - Nếu searchTxt có dữ liệu (> 0 ký tự) thì:
                        + Nếu kết quả (searchResult) rỗng -> Báo lỗi "không có truyện khớp"
                        + Nếu có kết quả -> Render component SeriesManagement với danh sách đã lọc (seriesFiltered)
                    - Nếu searchTxt rỗng -> Hiển thị mặc định toàn bộ truyện có trạng thái "Publishing"
                */}
                {searchTxt.length > 0
                    ? (searchResult.length === 0
                        ? <div className='p-6 text-warning'>There is no series matches</div>
                        : <SeriesManagement role="reader" seriesFiltered={searchResult} />
                    )
                    : <SeriesManagement role="reader" statusFilter={"Publishing"} />
                }

            </div>
        </div >
    )
}
