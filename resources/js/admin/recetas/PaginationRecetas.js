import React from 'react';

const PaginationRecetas= ({ onPageChange, meta }) => {
    const totalPages = Math.ceil(meta.total / meta.limit);
    const pageNumbers = [];
    const maxPageNumbersToShow = 5;
    const leftSide = maxPageNumbersToShow / 5;
    const rightSide = maxPageNumbersToShow - leftSide;

    let startPage = Math.max(1, meta.page - leftSide);
    let endPage = Math.min(totalPages, meta.page + rightSide);

    if (meta.page <= leftSide) {
        endPage = Math.min(1 + maxPageNumbersToShow - 1, totalPages);
    }

    if (meta.page + rightSide >= totalPages) {
        startPage = Math.max(1, totalPages - maxPageNumbersToShow + 1);
    }

    for (let i = startPage; i <= endPage; i++) {
        pageNumbers.push(i);
    }

    const renderPageNumbers = () => {
        const pageLinks = [];

        if (startPage > 1) {
            pageLinks.push(
                <li key={1} className="paginate_button page-item">
                    <button onClick={() => onPageChange(1)} className="page-link">1</button>
                </li>
            );
            if (startPage > 2) {
                pageLinks.push(
                    <li key="startEllipsis" className="paginate_button page-item disabled">
                        <span className="page-link">…</span>
                    </li>
                );
            }
        }

        pageNumbers.forEach(number => {
            pageLinks.push(
                <li key={number} className={`paginate_button page-item ${meta.page === number ? 'active' : ''}`}>
                    <button onClick={() => onPageChange(number)} className="page-link">{number}</button>
                </li>
            );
        });

        if (endPage < totalPages) {
            if (endPage < totalPages - 1) {
                pageLinks.push(
                    <li key="endEllipsis" className="paginate_button page-item disabled">
                        <span className="page-link">…</span>
                    </li>
                );
            }
            pageLinks.push(
                <li key={totalPages} className="paginate_button page-item">
                    <button onClick={() => onPageChange(totalPages)} className="page-link">{totalPages}</button>
                </li>
            );
        }

        return pageLinks;
    };

    return (
        <div className="dt--bottom-section d-sm-flex justify-content-sm-between text-center">
            <div className="dt--pages-count mb-sm-0 mb-3">
                <div aria-live="polite" className="dataTables_info" role="status">
                    Showing page {meta.page} of {totalPages}
                </div>
            </div>
            <div className="dt--pagination">
                <div className="dataTables_paginate paging_simple_numbers">
                    <ul className="pagination">
                        <li className={`paginate_button page-item previous ${meta.page === 1 ? 'disabled' : ''}`}>
                            <button className="page-link" onClick={() => onPageChange(meta.page - 1)} disabled={meta.page === 1}>
                                <svg className="feather feather-arrow-left" fill="none" height="24" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24" width="24">
                                    <line x1="19" x2="5" y1="12" y2="12"></line>
                                    <polyline points="12 19 5 12 12 5"></polyline>
                                </svg>
                            </button>
                        </li>
                        {renderPageNumbers()}
                        <li className={`paginate_button page-item next ${meta.page === totalPages ? 'disabled' : ''}`}>
                            <button className="page-link" onClick={() => onPageChange(meta.page + 1)} disabled={meta.page === totalPages}>
                                <svg className="feather feather-arrow-right" fill="none" height="24" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24" width="24">
                                    <line x1="5" x2="19" y1="12" y2="12"></line>
                                    <polyline points="12 5 19 12 12 19"></polyline>
                                </svg>
                            </button>
                        </li>
                    </ul>
                </div>
            </div>
        </div>
    );
};

export default PaginationRecetas;
