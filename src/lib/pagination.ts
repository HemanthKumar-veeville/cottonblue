export type PaginationWindow = {
  pages: number[];
  showFirst: boolean;
  showLast: boolean;
  showLeftEllipsis: boolean;
  showRightEllipsis: boolean;
};

export const clampPage = (page: number, totalPages: number) => {
  if (totalPages <= 0) return 1;
  return Math.min(Math.max(page, 1), totalPages);
};

export const getPaginationWindow = ({
  currentPage,
  totalPages,
  maxVisiblePages = 5,
}: {
  currentPage: number;
  totalPages: number;
  maxVisiblePages?: number;
}): PaginationWindow => {
  const safeCurrentPage = clampPage(currentPage, totalPages);
  const safeMaxVisiblePages = Math.max(1, Math.floor(maxVisiblePages));

  if (totalPages <= safeMaxVisiblePages) {
    return {
      pages: Array.from({ length: totalPages }, (_, i) => i + 1),
      showFirst: false,
      showLast: false,
      showLeftEllipsis: false,
      showRightEllipsis: false,
    };
  }

  const halfWindow = Math.floor(safeMaxVisiblePages / 2);
  let startPage = Math.max(1, safeCurrentPage - halfWindow);
  let endPage = Math.min(totalPages, startPage + safeMaxVisiblePages - 1);

  if (endPage - startPage + 1 < safeMaxVisiblePages) {
    startPage = Math.max(1, endPage - safeMaxVisiblePages + 1);
  }

  const pages: number[] = [];
  for (let page = startPage; page <= endPage; page += 1) {
    pages.push(page);
  }

  return {
    pages,
    showFirst: startPage > 1,
    showLeftEllipsis: startPage > 2,
    showLast: endPage < totalPages,
    showRightEllipsis: endPage < totalPages - 1,
  };
};

