export default function EmptyState({
  icon,
  text,
}: {
  icon: string;
  text: string;
}) {
  return (
    <div className="empty">
      <div className="empty__icon" aria-hidden>
        {icon}
      </div>
      <p className="empty__text">{text}</p>
    </div>
  );
}
