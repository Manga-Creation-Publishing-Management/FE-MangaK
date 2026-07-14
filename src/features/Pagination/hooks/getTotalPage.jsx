import { useState } from "react";

export function getTotalPage(currentPageCount, postPerPageCount, dataList) {
  const [currentPage, setCurrentPage] = useState(currentPageCount);
  const [postsPerPage, setPostsPerPage] = useState(postPerPageCount);
  const totalItems = dataList?.length || 0;
  const totalPages = Math.ceil(totalItems / postsPerPage);

  // Tính toán vị trí cắt mảng
  const lastPostIndex = currentPage * postsPerPage;
  const firstPostIndex = lastPostIndex - postsPerPage;

  // Mảng dữ liệu thực tế sau khi đã phân trang để đem đi hiển thị UI
  const currentDataListDisplay = dataList?.slice(firstPostIndex, lastPostIndex);
  return {
    currentPage,
    setCurrentPage,
    postsPerPage,
    currentDataListDisplay,
    totalPages
  }
}