import { useState, useEffect } from "react";
import useCreateSeries from "./useCreateSeries";

// Custom hook hỗ trợ tính năng tìm kiếm (search) bộ truyện
export function useSearch() {
    // Tái sử dụng useCreateSeries để lấy danh sách dữ liệu bộ truyện
    const { seriesData } = useCreateSeries();

    // State lưu trữ từ khóa tìm kiếm (search text)
    const [searchTxt, setSearchText] = useState("");
    // State lưu trữ mảng kết quả sau khi đã lọc
    const [searchResult, setSearchResult] = useState([]);

    // Hàm dùng để cập nhật từ khóa tìm kiếm mỗi khi người dùng gõ
    const handleSearch = (txtInput) => {
        setSearchText(txtInput);
    };

    // Theo dõi sự thay đổi của searchTxt hoặc seriesData để thực hiện lọc lại (filter)
    useEffect(() => {
        // Nếu ô tìm kiếm trống (hoặc toàn dấu cách), thì reset kết quả tìm kiếm về mảng rỗng
        if (!searchTxt.trim()) {
            setSearchResult([]);
            return;
        }

        // Thực hiện lọc danh sách bộ truyện:
        // Yêu cầu 1: Trạng thái (status) phải là "Publishing" (đang xuất bản)
        // Yêu cầu 2: Tiêu đề bộ truyện (in thường) phải bắt đầu bằng (startsWith) từ khóa tìm kiếm (in thường)
        const filtered = (seriesData || []).filter((series) =>
            series.status === "Publishing" &&
            series.title.toLowerCase().startsWith(searchTxt.toLowerCase())
        );

        // Lưu kết quả tìm kiếm vào state
        setSearchResult(filtered);
    }, [searchTxt, seriesData]);

    // Trả ra cho component bên ngoài sử dụng
    return ({
        searchTxt,     // Từ khóa hiện tại
        searchResult,  // Kết quả lọc
        handleSearch   // Hàm bắt sự kiện onChange
    });

}