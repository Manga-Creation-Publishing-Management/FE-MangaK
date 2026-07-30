import { useState } from 'react';

export function getTotalPage(currentPageCount, postPerPageCount, dataList) {
  const [currentPage, setCurrentPage] = useState(currentPageCount);
  const [postsPerPage, setPostsPerPage] = useState(postPerPageCount);
  const totalItems = dataList?.length || 0;
  const totalPages = Math.ceil(totalItems / postsPerPage);

  const lastPostIndex = currentPage * postsPerPage;
  const firstPostIndex = lastPostIndex - postsPerPage;

  const currentDataListDisplay = dataList?.slice(firstPostIndex, lastPostIndex);
  return {
    currentPage,
    setCurrentPage,
    postsPerPage,
    currentDataListDisplay,
    totalPages
  }
}