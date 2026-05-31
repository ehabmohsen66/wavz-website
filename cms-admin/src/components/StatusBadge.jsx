export default function StatusBadge({ status }) {
  const classMap = {
    published: 'badge-published',
    draft: 'badge-draft',
    archived: 'badge-archived',
    active: 'badge-published',
    inactive: 'badge-archived',
  };
  const cls = classMap[status] || 'badge-draft';
  return <span className={`badge ${cls}`}>{status}</span>;
}
