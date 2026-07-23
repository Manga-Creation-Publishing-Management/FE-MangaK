export const getPaginationRange = (currentPage, totalPages) => {
  if (totalPages <= 3) {
    const range = [];
    for (let i = 1; i <= totalPages; i++) range.push(i);
    return range;
  }

  if (currentPage <= 2) {
    return [1, 2, '...', totalPages];
  }

  if (currentPage >= totalPages - 1) {
    return [1, '...', totalPages - 1, totalPages];
  }

  return [1, '...', currentPage, '...', totalPages];
};