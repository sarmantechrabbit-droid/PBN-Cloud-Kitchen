export default function PageHeader({ title, subtitle, actions }) {
  return (
    <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4 mb-7">
      <div>
        <h1 className="text-[26px] font-extrabold text-[var(--text)] m-0 tracking-[-0.5px]">
          {title}
        </h1>
        {subtitle && (
          <p className="text-[13px] text-[var(--muted)] mt-1.5 leading-relaxed">
            {subtitle}
          </p>
        )}
      </div>
      {actions && (
        <div className="flex gap-2.5 items-center">
          {actions}
        </div>
      )}
    </div>
  );
}
