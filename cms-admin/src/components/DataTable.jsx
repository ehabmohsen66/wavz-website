import { useState, useMemo } from 'react';

export default function DataTable({
  columns = [],
  data = [],
  loading = false,
  searchable = true,
  searchPlaceholder = 'Search...',
  onEdit,
  onDelete,
  onRowClick,
  emptyTitle = 'No data found',
  emptyDescription = 'Try adjusting your search or filters.',
  selectable = false,
  extraFilters,
  perPageOptions = [10, 25, 50],
}) {
  const [search, setSearch] = useState('');
  const [sortKey, setSortKey] = useState(null);
  const [sortDir, setSortDir] = useState('asc');
  const [page, setPage] = useState(1);
  const [perPage, setPerPage] = useState(perPageOptions[0]);
  const [selected, setSelected] = useState(new Set());

  const filtered = useMemo(() => {
    let result = [...data];
    if (search.trim()) {
      const q = search.toLowerCase();
      result = result.filter(row =>
        columns.some(col => {
          const val = row[col.key];
          return val != null && String(val).toLowerCase().includes(q);
        })
      );
    }
    if (sortKey) {
      result.sort((a, b) => {
        const aVal = a[sortKey] ?? '';
        const bVal = b[sortKey] ?? '';
        const cmp = String(aVal).localeCompare(String(bVal), undefined, { numeric: true });
        return sortDir === 'asc' ? cmp : -cmp;
      });
    }
    return result;
  }, [data, search, sortKey, sortDir, columns]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / perPage));
  const safeCurrentPage = Math.min(page, totalPages);
  const paged = filtered.slice((safeCurrentPage - 1) * perPage, safeCurrentPage * perPage);
  const startIdx = (safeCurrentPage - 1) * perPage + 1;
  const endIdx = Math.min(safeCurrentPage * perPage, filtered.length);

  const handleSort = (key) => {
    if (sortKey === key) {
      setSortDir(d => d === 'asc' ? 'desc' : 'asc');
    } else {
      setSortKey(key);
      setSortDir('asc');
    }
  };

  const toggleAll = () => {
    if (selected.size === paged.length) {
      setSelected(new Set());
    } else {
      setSelected(new Set(paged.map((_, i) => (safeCurrentPage - 1) * perPage + i)));
    }
  };

  const toggleRow = (idx) => {
    const next = new Set(selected);
    if (next.has(idx)) next.delete(idx); else next.add(idx);
    setSelected(next);
  };

  const handlePerPageChange = (val) => {
    setPerPage(Number(val));
    setPage(1);
  };

  const getPageButtons = () => {
    const pages = [];
    const max = 5;
    let start = Math.max(1, safeCurrentPage - Math.floor(max / 2));
    let end = Math.min(totalPages, start + max - 1);
    if (end - start + 1 < max) start = Math.max(1, end - max + 1);
    for (let i = start; i <= end; i++) pages.push(i);
    return pages;
  };

  if (loading) {
    return (
      <div className="data-table-wrapper">
        <div className="data-table-toolbar">
          <div className="data-table-toolbar-left">
            <div className="skeleton" style={{ width: 280, height: 36 }} />
          </div>
        </div>
        <div>
          {[...Array(5)].map((_, i) => (
            <div key={i} className="skeleton-row">
              <div className="skeleton skeleton-text" style={{ width: '20%' }} />
              <div className="skeleton skeleton-text" style={{ width: '30%' }} />
              <div className="skeleton skeleton-text" style={{ width: '15%' }} />
              <div className="skeleton skeleton-text" style={{ width: '10%' }} />
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="data-table-wrapper">
      <div className="data-table-toolbar">
        <div className="data-table-toolbar-left">
          {searchable && (
            <div className="data-table-search">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/>
              </svg>
              <input
                type="text"
                placeholder={searchPlaceholder}
                value={search}
                onChange={e => { setSearch(e.target.value); setPage(1); }}
              />
            </div>
          )}
          {extraFilters}
        </div>
      </div>

      {paged.length === 0 ? (
        <div className="empty-state">
          <div className="empty-state-icon">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M13 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V9z"/><polyline points="13 2 13 9 20 9"/>
            </svg>
          </div>
          <div className="empty-state-title">{emptyTitle}</div>
          <div className="empty-state-desc">{emptyDescription}</div>
        </div>
      ) : (
        <>
          <div style={{ overflowX: 'auto' }}>
            <table className="data-table">
              <thead>
                <tr>
                  {selectable && (
                    <th style={{ width: 44 }}>
                      <div
                        className={`table-checkbox ${selected.size === paged.length && paged.length > 0 ? 'checked' : ''}`}
                        onClick={toggleAll}
                      >
                        {selected.size === paged.length && paged.length > 0 && (
                          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg>
                        )}
                      </div>
                    </th>
                  )}
                  {columns.map(col => (
                    <th
                      key={col.key}
                      className={sortKey === col.key ? 'sorted' : ''}
                      onClick={() => col.sortable !== false && handleSort(col.key)}
                      style={col.width ? { width: col.width } : undefined}
                    >
                      {col.label}
                      {sortKey === col.key && (
                        <span className="sort-icon">{sortDir === 'asc' ? '↑' : '↓'}</span>
                      )}
                    </th>
                  ))}
                  {(onEdit || onDelete) && <th style={{ width: 100 }}>Actions</th>}
                </tr>
              </thead>
              <tbody>
                {paged.map((row, ri) => {
                  const globalIdx = (safeCurrentPage - 1) * perPage + ri;
                  return (
                    <tr
                      key={row.id || ri}
                      onClick={() => onRowClick && onRowClick(row)}
                      style={onRowClick ? { cursor: 'pointer' } : undefined}
                    >
                      {selectable && (
                        <td onClick={e => e.stopPropagation()}>
                          <div
                            className={`table-checkbox ${selected.has(globalIdx) ? 'checked' : ''}`}
                            onClick={() => toggleRow(globalIdx)}
                          >
                            {selected.has(globalIdx) && (
                              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg>
                            )}
                          </div>
                        </td>
                      )}
                      {columns.map(col => (
                        <td key={col.key}>
                          {col.render ? col.render(row[col.key], row) : (row[col.key] ?? '—')}
                        </td>
                      ))}
                      {(onEdit || onDelete) && (
                        <td onClick={e => e.stopPropagation()}>
                          <div className="row-actions">
                            {onEdit && (
                              <button className="row-action-btn" onClick={() => onEdit(row)} title="Edit">
                                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                  <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/>
                                  <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/>
                                </svg>
                              </button>
                            )}
                            {onDelete && (
                              <button className="row-action-btn danger" onClick={() => onDelete(row)} title="Delete">
                                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                  <polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/>
                                </svg>
                              </button>
                            )}
                          </div>
                        </td>
                      )}
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          <div className="data-table-pagination">
            <div className="pagination-info">
              Showing {startIdx}–{endIdx} of {filtered.length}
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
              <div className="per-page-select">
                <span>Rows:</span>
                <select value={perPage} onChange={e => handlePerPageChange(e.target.value)}>
                  {perPageOptions.map(v => <option key={v} value={v}>{v}</option>)}
                </select>
              </div>
              <div className="pagination-controls">
                <button className="pagination-btn" disabled={safeCurrentPage <= 1} onClick={() => setPage(p => p - 1)}>
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="15 18 9 12 15 6"/></svg>
                </button>
                {getPageButtons().map(p => (
                  <button key={p} className={`pagination-btn ${p === safeCurrentPage ? 'active' : ''}`} onClick={() => setPage(p)}>
                    {p}
                  </button>
                ))}
                <button className="pagination-btn" disabled={safeCurrentPage >= totalPages} onClick={() => setPage(p => p + 1)}>
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="9 18 15 12 9 6"/></svg>
                </button>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
