// components/Pagination.js
import { ChevronLeft, ChevronRight } from 'lucide-react';

const Pagination = ({ currentPage, totalPages, onPageChange }) => {
  if (totalPages <= 1) {
    return null; // Don't render pagination if there's only one page or no pages
  }

  const handlePrevious = () => {
    if (currentPage > 1) {
      onPageChange(currentPage - 1);
    }
  };

  const handleNext = () => {
    if (currentPage < totalPages) {
      onPageChange(currentPage + 1);
    }
  };

  // Determine page numbers to display
  let pageNumbers = [];
  const maxPagesToShow = 5; // Max number of page links to show (e.g., 1 ... 4 5 6 ... 10)
  
  if (totalPages <= maxPagesToShow) {
    pageNumbers = Array.from({ length: totalPages }, (_, i) => i + 1);
  } else {
    let startPage, endPage;
    if (currentPage <= Math.ceil(maxPagesToShow / 2)) {
      startPage = 1;
      endPage = maxPagesToShow -1; // one spot for ellipsis
      pageNumbers = Array.from({ length: endPage - startPage + 1 }, (_, i) => startPage + i);
      pageNumbers.push('...');
      pageNumbers.push(totalPages);
    } else if (currentPage + Math.floor(maxPagesToShow / 2) >= totalPages) {
      startPage = totalPages - (maxPagesToShow - 2); // one spot for ellipsis
      pageNumbers.push(1);
      pageNumbers.push('...');
      for (let i = startPage; i <= totalPages; i++) {
        pageNumbers.push(i);
      }
    } else {
      startPage = currentPage - Math.floor((maxPagesToShow - 2) / 2) ; // -2 for first/last and ellipses
      endPage = currentPage + Math.floor((maxPagesToShow - 2) / 2);
      pageNumbers.push(1);
      pageNumbers.push('...');
      for (let i = startPage; i <= endPage; i++) {
        pageNumbers.push(i);
      }
      pageNumbers.push('...');
      pageNumbers.push(totalPages);
    }
  }


  return (
    <nav className="flex items-center justify-center space-x-2 my-10" aria-label="Pagination">
      <button
        onClick={handlePrevious}
        disabled={currentPage === 1}
        className="px-4 py-2 text-sm font-medium text-slate-300 bg-slate-700 rounded-lg hover:bg-slate-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center"
      >
        <ChevronLeft className="w-5 h-5 mr-1" />
        Previous
      </button>

      {pageNumbers.map((page, index) => (
        page === '...' ? (
          <span key={`ellipsis-${index}`} className="px-4 py-2 text-sm text-slate-400">...</span>
        ) : (
          <button
            key={page}
            onClick={() => onPageChange(page)}
            className={`px-4 py-2 text-sm font-medium rounded-lg transition-colors ${
              currentPage === page
                ? 'bg-sky-600 text-white'
                : 'bg-slate-700 text-slate-300 hover:bg-slate-600'
            }`}
            aria-current={currentPage === page ? 'page' : undefined}
          >
            {page}
          </button>
        )
      ))}

      <button
        onClick={handleNext}
        disabled={currentPage === totalPages}
        className="px-4 py-2 text-sm font-medium text-slate-300 bg-slate-700 rounded-lg hover:bg-slate-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center"
      >
        Next
        <ChevronRight className="w-5 h-5 ml-1" />
      </button>
    </nav>
  );
};

export default Pagination;
