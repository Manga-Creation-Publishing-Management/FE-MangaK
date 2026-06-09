import { useState, useEffect } from "react";
import useCreateSeries from "./useCreateSeries";

export function useSearch() {
    const { seriesData } = useCreateSeries();

    const [searchTxt, setSearchText] = useState("");
    const [searchResult, setSearchResult] = useState([]);

    const handleSearch = (txtInput) => {
        setSearchText(txtInput);
    };

    useEffect(() => {
        // Nếu ô tìm kiếm trống, reset kết quả tìm kiếm về mảng rỗng
        if (!searchTxt.trim()) {
            setSearchResult([]);
            return;
        }

        // Lọc danh sách: chỉ lấy series có status là "Publishing" và khớp với từ khóa tìm kiếm
        const filtered = (seriesData || []).filter((series) =>
            series.status === "Publishing" &&
            series.title.toLowerCase().startsWith(searchTxt.toLowerCase()) //search mấy chữ đầu
        );

        setSearchResult(filtered);
    }, [searchTxt, seriesData]);



    return ({
        searchTxt,
        searchResult,
        handleSearch
    });

}