import { useCallback } from 'react';

export default function BlockEditor({ blocks = [], onChange, dir = 'ltr', font = "'Inter', sans-serif" }) {
  const updateBlock = useCallback((index, updates) => {
    const next = blocks.map((b, i) => i === index ? { ...b, ...updates } : b);
    onChange(next);
  }, [blocks, onChange]);

  const addBlock = useCallback((afterIndex) => {
    const newBlock = { type: 'paragraph', text: '' };
    const next = [...blocks];
    next.splice(afterIndex + 1, 0, newBlock);
    onChange(next);
  }, [blocks, onChange]);

  const removeBlock = useCallback((index) => {
    onChange(blocks.filter((_, i) => i !== index));
  }, [blocks, onChange]);

  const duplicateBlock = useCallback((index) => {
    const next = [...blocks];
    next.splice(index + 1, 0, { ...blocks[index] });
    onChange(next);
  }, [blocks, onChange]);

  const moveBlock = useCallback((index, direction) => {
    const newIndex = index + direction;
    if (newIndex < 0 || newIndex >= blocks.length) return;
    const next = [...blocks];
    [next[index], next[newIndex]] = [next[newIndex], next[index]];
    onChange(next);
  }, [blocks, onChange]);

  const updateListItem = useCallback((blockIndex, itemIndex, value) => {
    const block = blocks[blockIndex];
    const items = [...(block.items || [])];
    items[itemIndex] = value;
    updateBlock(blockIndex, { items });
  }, [blocks, updateBlock]);

  const addListItem = useCallback((blockIndex) => {
    const block = blocks[blockIndex];
    const items = [...(block.items || []), ''];
    updateBlock(blockIndex, { items });
  }, [blocks, updateBlock]);

  const removeListItem = useCallback((blockIndex, itemIndex) => {
    const block = blocks[blockIndex];
    const items = (block.items || []).filter((_, i) => i !== itemIndex);
    updateBlock(blockIndex, { items });
  }, [blocks, updateBlock]);

  return (
    <div className="block-editor">
      {blocks.length === 0 && (
        <button className="block-add-btn" type="button" onClick={() => onChange([{ type: 'paragraph', text: '' }])}>
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
          Add first block
        </button>
      )}

      {blocks.map((block, i) => (
        <div key={i}>
          <div className="block-card">
            <div className="block-card-header">
              <select
                className="block-type-select"
                value={block.type}
                onChange={e => {
                  const newType = e.target.value;
                  const updates = { type: newType };
                  if (newType === 'list' && !block.items) updates.items = [''];
                  if (newType === 'heading' && !block.level) updates.level = 2;
                  updateBlock(i, updates);
                }}
              >
                <option value="paragraph">Paragraph</option>
                <option value="heading">Heading</option>
                <option value="list">List</option>
                <option value="quote">Quote</option>
              </select>

              {block.type === 'heading' && (
                <select
                  className="block-type-select"
                  value={block.level || 2}
                  onChange={e => updateBlock(i, { level: Number(e.target.value) })}
                >
                  <option value={2}>H2</option>
                  <option value={3}>H3</option>
                  <option value={4}>H4</option>
                </select>
              )}

              {block.type === 'list' && (
                <select
                  className="block-type-select"
                  value={block.ordered ? 'ordered' : 'unordered'}
                  onChange={e => updateBlock(i, { ordered: e.target.value === 'ordered' })}
                >
                  <option value="unordered">Unordered</option>
                  <option value="ordered">Ordered</option>
                </select>
              )}

              <div className="block-card-controls">
                <button className="block-control-btn" type="button" title="Move up" onClick={() => moveBlock(i, -1)} disabled={i === 0}>
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="18 15 12 9 6 15"/></svg>
                </button>
                <button className="block-control-btn" type="button" title="Move down" onClick={() => moveBlock(i, 1)} disabled={i === blocks.length - 1}>
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="6 9 12 15 18 9"/></svg>
                </button>
                <button className="block-control-btn" type="button" title="Duplicate" onClick={() => duplicateBlock(i)}>
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="9" y="9" width="13" height="13" rx="2" ry="2"/><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/></svg>
                </button>
                <button className="block-control-btn danger" type="button" title="Delete" onClick={() => removeBlock(i)}>
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/></svg>
                </button>
              </div>
            </div>

            <div className="block-card-body">
              {block.type === 'list' ? (
                <div className="block-list-items">
                  {(block.items || []).map((item, ii) => (
                    <div key={ii} className="block-list-item">
                      <span style={{ color: 'var(--text-muted)', fontSize: 12, width: 20, textAlign: 'center', flexShrink: 0 }}>
                        {block.ordered ? `${ii + 1}.` : '•'}
                      </span>
                      <input
                        type="text"
                        value={item}
                        onChange={e => updateListItem(i, ii, e.target.value)}
                        dir={dir}
                        style={{ fontFamily: font }}
                        placeholder={`Item ${ii + 1}`}
                      />
                      <button type="button" className="block-list-item-remove" onClick={() => removeListItem(i, ii)}>
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
                      </button>
                    </div>
                  ))}
                  <button type="button" className="btn btn-ghost btn-sm" style={{ alignSelf: 'flex-start' }} onClick={() => addListItem(i)}>
                    + Add item
                  </button>
                </div>
              ) : (
                <textarea
                  value={block.text || ''}
                  onChange={e => updateBlock(i, { text: e.target.value })}
                  dir={dir}
                  style={{ fontFamily: font }}
                  placeholder={
                    block.type === 'heading' ? 'Heading text...' :
                    block.type === 'quote' ? 'Quote text...' :
                    'Paragraph text...'
                  }
                />
              )}
            </div>
          </div>

          <button className="block-add-btn" type="button" onClick={() => addBlock(i)} style={{ marginTop: 4, marginBottom: 4, padding: 6, fontSize: 12 }}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
          </button>
        </div>
      ))}
    </div>
  );
}
