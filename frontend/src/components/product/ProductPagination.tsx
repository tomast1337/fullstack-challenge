'use client';
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from '@frontend/components/ui/pagination';

export const ProductPagination = ({
  query,
  limit,
  total,
  current,
}: {
  limit: number;
  total: number;
  current: number;
  query: string;
}) => {
  // Calculate the total number of pages
  const totalPages = Math.ceil(total / limit);

  // Generate the URL for a specific page
  const getUrl = (page: number) => {
    const queryParams = new URLSearchParams();
    queryParams.append('query', query);
    queryParams.append('page', page.toString());
    queryParams.append('limit', limit.toString());
    queryParams.append('sort', 'createdAt');
    queryParams.append('order', 'false');

    return `/product?${queryParams.toString()}`;
  };

  // Generate the range of pages to display
  const getPageRange = () => {
    const range = [];
    const maxPagesToShow = 5; // Number of pages to show in the pagination
    let start = Math.max(1, current - Math.floor(maxPagesToShow / 2));
    const end = Math.min(totalPages, start + maxPagesToShow - 1);

    if (end - start + 1 < maxPagesToShow) {
      start = Math.max(1, end - maxPagesToShow + 1);
    }

    for (let i = start; i <= end; i++) {
      range.push(i);
    }

    return range;
  };

  return (
    <Pagination>
      <PaginationContent>
        {/* Previous Button */}
        <PaginationItem>
          <PaginationPrevious
            href={current > 1 ? getUrl(current - 1) : '#'}
            aria-disabled={current === 1}
          />
        </PaginationItem>

        {/* Page Numbers */}
        {getPageRange().map((pageNumber) => (
          <PaginationItem key={pageNumber}>
            <PaginationLink
              href={getUrl(pageNumber)}
              isActive={pageNumber === current}
            >
              {pageNumber}
            </PaginationLink>
          </PaginationItem>
        ))}

        {/* Ellipsis for More Pages */}
        {totalPages > getPageRange().length && (
          <PaginationItem>
            <PaginationEllipsis />
          </PaginationItem>
        )}

        {/* Next Button */}
        <PaginationItem>
          <PaginationNext
            href={current < totalPages ? getUrl(current + 1) : '#'}
            aria-disabled={current === totalPages}
          />
        </PaginationItem>
      </PaginationContent>
    </Pagination>
  );
};
