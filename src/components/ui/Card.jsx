export default function Card({ children, className = '', noPad = false }) {
  return (
    <div className={`bg-[var(--surface)] border border-[var(--border)] rounded-2xl ${noPad ? 'p-0' : 'p-6'} ${className}`}>
      {children}
    </div>
  );
}
