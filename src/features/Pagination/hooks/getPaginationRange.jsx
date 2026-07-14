export const getPaginationRange = (currentPage, totalPages) => {
  const range = [];
  const siblings = 1; // Số lượng trang hiển thị ở mỗi bên trang hiện tại

  // Nếu tổng số trang nhỏ, hiển thị hết không cần ẩn
  if (totalPages <= 5) {
    for (let i = 1; i <= totalPages; i++) range.push(i);
    return range;
  }

  // Luôn hiển thị trang đầu tiên
  range.push(1);

  // Tính toán vị trí dấu ba chấm bên trái và bên phải
  const showLeftDots = currentPage - siblings > 2;
  const showRightDots = currentPage + siblings < totalPages - 1;

  if (showLeftDots && !showRightDots) {
    // Trường hợp ở gần cuối: 1, '...', 7, 8, 9, 10
    range.push('...');
    for (let i = totalPages - 3; i <= totalPages; i++) {
      if (i > 1) range.push(i);
    }
  } else if (!showLeftDots && showRightDots) {
    // Trường hợp ở gần đầu: 1, 2, 3, 4, '...', 10
    for (let i = 2; i <= 4; i++) range.push(i);
    range.push('...');
    range.push(totalPages);
  } else if (showLeftDots && showRightDots) {
    // Trường hợp ở giữa: 1, '...', 4, 5, 6, '...', 10
    range.push('...');
    for (let i = currentPage - siblings; i <= currentPage + siblings; i++) {
      range.push(i);
    }
    range.push('...');
    range.push(totalPages);
  }

  return range;
};