import { memo } from "react";

interface PaginationBarProps {
  page: number;
  totalPages: number;
  setPage: (page: number) => void;
}

function PaginationBar({ page, totalPages, setPage }: PaginationBarProps) {
  const nextPage = () => setPage(page < totalPages ? page + 1 : page);
  const prevPage = () => setPage(page > 1 ? page - 1 : 1);

  return (
    <div className="flex justify-center mt-10 gap-4">
      <button
        onClick={prevPage}
        className="px-4 py-2 bg-red-600 text-white rounded-lg"
        disabled={page === 1}
      >
        Previous
      </button>
      {Array.from({ length: totalPages }, (_, index) => index + 1).map(
        (pageNumber) => (
          <button
            key={pageNumber}
            onClick={() => setPage(pageNumber)}
            className={`px-4 py-2 rounded-lg ${
              page === pageNumber
                ? "bg-red-600 text-white"
                : "bg-gray-200 text-black"
            }`}
          >
            {pageNumber}
          </button>
        )
      )}
      <button
        onClick={nextPage}
        className="px-4 py-2 bg-red-600 text-white rounded-lg"
        disabled={page === totalPages}
      >
        Next
      </button>
    </div>
  );
}

export default memo(PaginationBar);
