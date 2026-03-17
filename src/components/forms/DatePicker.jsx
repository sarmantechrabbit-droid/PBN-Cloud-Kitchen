import { useEffect, useMemo, useRef, useState } from "react";
import { Calendar, ChevronLeft, ChevronRight } from "lucide-react";

const MONTHS = [
  "Jan",
  "Feb",
  "Mar",
  "Apr",
  "May",
  "Jun",
  "Jul",
  "Aug",
  "Sep",
  "Oct",
  "Nov",
  "Dec",
];

const WEEKDAYS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

const parseISODate = (value) => {
  if (!value) return null;
  const parts = String(value).split("-");
  if (parts.length !== 3) return null;
  const [y, m, d] = parts.map((p) => parseInt(p, 10));
  if (!y || !m || !d) return null;
  return new Date(y, m - 1, d);
};

const formatISODate = (date) => {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, "0");
  const d = String(date.getDate()).padStart(2, "0");
  return `${y}-${m}-${d}`;
};

const formatDisplayDate = (date) => {
  const d = String(date.getDate()).padStart(2, "0");
  const m = MONTHS[date.getMonth()];
  const y = date.getFullYear();
  return `${d} ${m} ${y}`;
};

const isSameDay = (a, b) =>
  a &&
  b &&
  a.getFullYear() === b.getFullYear() &&
  a.getMonth() === b.getMonth() &&
  a.getDate() === b.getDate();

const clampToStartOfDay = (date) =>
  new Date(date.getFullYear(), date.getMonth(), date.getDate());

export default function DatePicker({
  label,
  value,
  onChange,
  required,
  min,
  placeholder = "DD MMM YYYY",
}) {
  const rootRef = useRef(null);
  const buttonRef = useRef(null);
  const [open, setOpen] = useState(false);
  const [activeDate, setActiveDate] = useState(() => parseISODate(value));
  const [viewMonth, setViewMonth] = useState(() => {
    const base = parseISODate(value) || new Date();
    return base.getMonth();
  });
  const [viewYear, setViewYear] = useState(() => {
    const base = parseISODate(value) || new Date();
    return base.getFullYear();
  });

  const minDate = useMemo(() => {
    const parsed = parseISODate(min);
    return parsed ? clampToStartOfDay(parsed) : null;
  }, [min]);

  useEffect(() => {
    const parsed = parseISODate(value);
    setActiveDate(parsed);
    if (parsed) {
      setViewMonth(parsed.getMonth());
      setViewYear(parsed.getFullYear());
    }
  }, [value]);

  useEffect(() => {
    if (!open) return;
    const handleClick = (e) => {
      if (!rootRef.current?.contains(e.target)) setOpen(false);
    };
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, [open]);

  const today = useMemo(() => clampToStartOfDay(new Date()), []);

  const firstOfMonth = new Date(viewYear, viewMonth, 1);
  const startDay = firstOfMonth.getDay();
  const daysInMonth = new Date(viewYear, viewMonth + 1, 0).getDate();

  const calendarDays = useMemo(() => {
    const cells = [];
    const prevMonthDays = new Date(viewYear, viewMonth, 0).getDate();
    for (let i = startDay - 1; i >= 0; i -= 1) {
      const day = prevMonthDays - i;
      cells.push({
        date: new Date(viewYear, viewMonth - 1, day),
        current: false,
      });
    }
    for (let day = 1; day <= daysInMonth; day += 1) {
      cells.push({
        date: new Date(viewYear, viewMonth, day),
        current: true,
      });
    }
    while (cells.length < 42) {
      const nextDay = cells.length - (startDay + daysInMonth) + 1;
      cells.push({
        date: new Date(viewYear, viewMonth + 1, nextDay),
        current: false,
      });
    }
    return cells;
  }, [viewYear, viewMonth, startDay, daysInMonth]);

  const handleSelect = (date) => {
    if (minDate && clampToStartOfDay(date) < minDate) return;
    setActiveDate(date);
    onChange?.({ target: { value: formatISODate(date) } });
    setOpen(false);
  };

  const handleKeyDown = (e) => {
    if (!open) {
      if (e.key === "Enter" || e.key === " " || e.key === "ArrowDown") {
        e.preventDefault();
        setOpen(true);
      }
      return;
    }
    const current = activeDate || new Date(viewYear, viewMonth, 1);
    let next = current;
    if (e.key === "ArrowLeft") next = new Date(current.getFullYear(), current.getMonth(), current.getDate() - 1);
    if (e.key === "ArrowRight") next = new Date(current.getFullYear(), current.getMonth(), current.getDate() + 1);
    if (e.key === "ArrowUp") next = new Date(current.getFullYear(), current.getMonth(), current.getDate() - 7);
    if (e.key === "ArrowDown") next = new Date(current.getFullYear(), current.getMonth(), current.getDate() + 7);
    if (e.key === "Home") next = new Date(current.getFullYear(), current.getMonth(), 1);
    if (e.key === "End") next = new Date(current.getFullYear(), current.getMonth() + 1, 0);
    if (e.key === "Enter") {
      e.preventDefault();
      handleSelect(current);
      return;
    }
    if (e.key === "Escape") {
      e.preventDefault();
      setOpen(false);
      buttonRef.current?.focus();
      return;
    }
    if (next !== current) {
      e.preventDefault();
      setActiveDate(next);
      setViewMonth(next.getMonth());
      setViewYear(next.getFullYear());
    }
  };

  return (
    <div ref={rootRef} style={{ position: "relative" }}>
      {label && (
        <label
          style={{
            display: "block",
            fontSize: 12,
            fontWeight: 600,
            color: "var(--muted)",
            marginBottom: 6,
          }}
        >
          {label} {required && <span style={{ color: "var(--danger)" }}>*</span>}
        </label>
      )}
      <div style={{ position: "relative" }}>
        <span
          style={{
            position: "absolute",
            left: 12,
            top: "50%",
            transform: "translateY(-50%)",
            color: "var(--muted)",
            pointerEvents: "none",
            display: "flex",
            alignItems: "center",
          }}
        >
          <Calendar size={16} />
        </span>
        <input
          ref={buttonRef}
          type="text"
          readOnly
          value={activeDate ? formatDisplayDate(activeDate) : ""}
          placeholder={placeholder}
          onClick={() => setOpen((o) => !o)}
          onKeyDown={handleKeyDown}
          aria-label={label || "Date picker"}
          aria-haspopup="dialog"
          aria-expanded={open}
          className="input-field"
          style={{ paddingLeft: 38, cursor: "pointer" }}
        />
      </div>

      <div
        role="dialog"
        aria-hidden={!open}
        style={{
          position: "absolute",
          top: "calc(100% + 8px)",
          left: 0,
          width: 280,
          maxWidth: "100%",
          background: "var(--surface)",
          border: "1px solid var(--border)",
          borderRadius: 12,
          // boxShadow: "0 12px 28px var(--primary-glow-strong)",
          padding: 10,
          opacity: open ? 1 : 0,
          transform: open ? "translateY(0)" : "translateY(-6px)",
          transition: "opacity 0.16s ease, transform 0.16s ease",
          pointerEvents: open ? "auto" : "none",
          zIndex: 50,
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            marginBottom: 8,
            gap: 8,
          }}
        >
          <button
            type="button"
            onClick={() => {
              const prev = new Date(viewYear, viewMonth - 1, 1);
              setViewMonth(prev.getMonth());
              setViewYear(prev.getFullYear());
            }}
            aria-label="Previous month"
            style={{
              width: 32,
              height: 32,
              borderRadius: 8,
              border: "1px solid var(--border)",
              background: "var(--bg)",
              color: "var(--muted)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              cursor: "pointer",
            }}
          >
            <ChevronLeft size={14} />
          </button>

          <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
            <select
              value={viewMonth}
              onChange={(e) => setViewMonth(parseInt(e.target.value, 10))}
            style={{
              background: "var(--bg)",
              border: "1px solid var(--border)",
              borderRadius: 8,
              padding: "4px 6px",
              fontSize: 11,
              color: "var(--text)",
              fontWeight: 600,
            }}
              aria-label="Select month"
            >
              {MONTHS.map((m, i) => (
                <option key={m} value={i}>
                  {m}
                </option>
              ))}
            </select>
            <select
              value={viewYear}
              onChange={(e) => setViewYear(parseInt(e.target.value, 10))}
            style={{
              background: "var(--bg)",
              border: "1px solid var(--border)",
              borderRadius: 8,
              padding: "4px 6px",
              fontSize: 11,
              color: "var(--text)",
              fontWeight: 600,
            }}
              aria-label="Select year"
            >
              {Array.from({ length: 8 }, (_, i) => viewYear - 4 + i).map(
                (year) => (
                  <option key={year} value={year}>
                    {year}
                  </option>
                ),
              )}
            </select>
          </div>

          <button
            type="button"
            onClick={() => {
              const next = new Date(viewYear, viewMonth + 1, 1);
              setViewMonth(next.getMonth());
              setViewYear(next.getFullYear());
            }}
            aria-label="Next month"
            style={{
              width: 32,
              height: 32,
              borderRadius: 8,
              border: "1px solid var(--border)",
              background: "var(--bg)",
              color: "var(--muted)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              cursor: "pointer",
            }}
          >
            <ChevronRight size={14} />
          </button>
        </div>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(7, 1fr)",
            gap: 4,
            marginBottom: 4,
          }}
        >
          {WEEKDAYS.map((day) => (
            <div
              key={day}
              style={{
                fontSize: 9,
                fontWeight: 700,
                color: "var(--muted)",
                textAlign: "center",
              }}
            >
              {day}
            </div>
          ))}
        </div>

        <div
          role="grid"
          tabIndex={0}
          onKeyDown={handleKeyDown}
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(7, 1fr)",
            gap: 4,
          }}
        >
          {calendarDays.map(({ date, current }, idx) => {
            const isSelected = isSameDay(date, activeDate);
            const isToday = isSameDay(date, today);
            const isDisabled =
              minDate && clampToStartOfDay(date) < minDate;
            return (
              <button
                key={`${date.toISOString()}-${idx}`}
                type="button"
                onClick={() => handleSelect(date)}
                disabled={isDisabled}
                style={{
                  height: 28,
                  borderRadius: 8,
                  border: isSelected
                    ? "1px solid var(--primary)"
                    : "1px solid transparent",
                  background: isSelected
                    ? "var(--primary)"
                    : isToday
                      ? "var(--primary-glow)"
                      : "transparent",
                  color: isSelected
                    ? "var(--surface)"
                    : current
                      ? "var(--text)"
                      : "var(--muted)",
                  fontSize: 11,
                  fontWeight: 700,
                  cursor: isDisabled ? "not-allowed" : "pointer",
                  opacity: isDisabled ? 0.4 : 1,
                  transition: "all 0.15s ease",
                }}
                aria-label={formatDisplayDate(date)}
              >
                {date.getDate()}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
