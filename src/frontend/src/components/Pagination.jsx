function Pagination({ page, setPage, totalPages }) {
  return (
    <div className="pagination-wrapper">
      <div className="pagination-content">
        <button
          onClick={() => setPage((p) => Math.max(1, p - 1))}
          disabled={page === 1}
          className="standard-button"
        >
          Prev
        </button>
        <span className="secondary-text">
          {page} / {totalPages}
        </span>
        <button
          onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
          disabled={page === totalPages}
          className="standard-button"
        >
          Next
        </button>
      </div>
    </div>
  );
}

export default Pagination;
