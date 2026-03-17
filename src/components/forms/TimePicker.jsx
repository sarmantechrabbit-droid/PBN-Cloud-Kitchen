import { useEffect, useMemo, useRef, useState } from "react";
import { Clock } from "lucide-react";

const HOURS = Array.from({ length: 12 }, (_, i) => i + 1);
const MINUTES = Array.from({ length: 12 }, (_, i) => i * 5);

const parseTime = (value) => {
  if (!value) return null;
  const parts = String(value).split(":");
  if (parts.length < 2) return null;
  const hour24 = parseInt(parts[0], 10);
  const minute = parseInt(parts[1], 10);
  if (Number.isNaN(hour24) || Number.isNaN(minute)) return null;
  const ampm = hour24 >= 12 ? "PM" : "AM";
  const hour12 = hour24 % 12 === 0 ? 12 : hour24 % 12;
  return { hour: hour12, minute, ampm };
};

const formatDisplayTime = (hour, minute, ampm) => {
  const h = String(hour).padStart(2, "0");
  const m = String(minute).padStart(2, "0");
  return `${h}:${m} ${ampm}`;
};

const to24Hour = (hour, minute, ampm) => {
  const base = hour % 12;
  const hour24 = ampm === "PM" ? base + 12 : base;
  return `${String(hour24).padStart(2, "0")}:${String(minute).padStart(2, "0")}`;
};

const roundToStep = (minute, step = 5) =>
  Math.round(minute / step) * step;

export default function TimePicker({
  label,
  value,
  onChange,
  required,
  placeholder = "HH:MM AM",
}) {
  const rootRef = useRef(null);
  const inputRef = useRef(null);
  const [open, setOpen] = useState(false);
  const [activeSection, setActiveSection] = useState("hour");

  const initial = useMemo(() => {
    const parsed = parseTime(value);
    if (parsed) return parsed;
    const now = new Date();
    const minute = roundToStep(now.getMinutes());
    const hour24 = now.getHours();
    const ampm = hour24 >= 12 ? "PM" : "AM";
    const hour = hour24 % 12 === 0 ? 12 : hour24 % 12;
    return { hour, minute, ampm };
  }, [value]);

  const [hour, setHour] = useState(initial.hour);
  const [minute, setMinute] = useState(initial.minute);
  const [ampm, setAmpm] = useState(initial.ampm);
  const hasValue = Boolean(value);

  useEffect(() => {
    const parsed = parseTime(value);
    if (!parsed) return;
    setHour(parsed.hour);
    setMinute(parsed.minute);
    setAmpm(parsed.ampm);
  }, [value]);

  useEffect(() => {
    if (!open) return;
    const handleClick = (e) => {
      if (!rootRef.current?.contains(e.target)) setOpen(false);
    };
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, [open]);

  const updateTime = (nextHour, nextMinute, nextAmpm) => {
    setHour(nextHour);
    setMinute(nextMinute);
    setAmpm(nextAmpm);
    onChange?.({ target: { value: to24Hour(nextHour, nextMinute, nextAmpm) } });
  };

  const handleKeyDown = (e) => {
    if (!open) {
      if (e.key === "Enter" || e.key === " " || e.key === "ArrowDown") {
        e.preventDefault();
        setOpen(true);
      }
      return;
    }
    if (e.key === "Escape") {
      e.preventDefault();
      setOpen(false);
      inputRef.current?.focus();
      return;
    }
    if (e.key === "ArrowLeft") {
      e.preventDefault();
      setActiveSection((s) =>
        s === "hour" ? "ampm" : s === "minute" ? "hour" : "minute",
      );
    }
    if (e.key === "ArrowRight") {
      e.preventDefault();
      setActiveSection((s) =>
        s === "hour" ? "minute" : s === "minute" ? "ampm" : "hour",
      );
    }
    if (e.key === "ArrowUp" || e.key === "ArrowDown") {
      e.preventDefault();
      const dir = e.key === "ArrowUp" ? -1 : 1;
      if (activeSection === "hour") {
        const idx = HOURS.indexOf(hour);
        const nextHour = HOURS[(idx + dir + HOURS.length) % HOURS.length];
        updateTime(nextHour, minute, ampm);
      } else if (activeSection === "minute") {
        const idx = MINUTES.indexOf(minute);
        const nextMinute = MINUTES[(idx + dir + MINUTES.length) % MINUTES.length];
        updateTime(hour, nextMinute, ampm);
      } else {
        updateTime(hour, minute, ampm === "AM" ? "PM" : "AM");
      }
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
          <Clock size={16} />
        </span>
        <input
          ref={inputRef}
          type="text"
          readOnly
          value={hasValue ? formatDisplayTime(hour, minute, ampm) : ""}
          placeholder={placeholder}
          onClick={() => setOpen((o) => !o)}
          onKeyDown={handleKeyDown}
          aria-label={label || "Time picker"}
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
          width: 260,
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
        onKeyDown={handleKeyDown}
      >
        <div style={{ display: "flex", gap: 10 }}>
          <div style={{ flex: 1 }}>
            <div
              style={{
                fontSize: 9,
                fontWeight: 700,
                color: "var(--muted)",
                textTransform: "uppercase",
                letterSpacing: 0.8,
                marginBottom: 4,
              }}
            >
              Hour
            </div>
            <div
              style={{
                maxHeight: 120,
                overflowY: "auto",
                borderRadius: 8,
                border: "1px solid var(--border)",
                background: "var(--bg)",
              }}
              onMouseEnter={() => setActiveSection("hour")}
            >
              {HOURS.map((h) => {
                const selected = h === hour;
                return (
                  <button
                    key={h}
                    type="button"
                    onClick={() => updateTime(h, minute, ampm)}
                    style={{
                      width: "100%",
                      padding: "6px 8px",
                      textAlign: "left",
                      border: "none",
                      background: selected ? "var(--primary-glow)" : "transparent",
                      color: selected ? "var(--primary)" : "var(--text)",
                      fontWeight: selected ? 700 : 600,
                      fontSize: 12,
                      cursor: "pointer",
                    }}
                  >
                    {String(h).padStart(2, "0")}
                  </button>
                );
              })}
            </div>
          </div>

          <div style={{ flex: 1 }}>
            <div
              style={{
                fontSize: 9,
                fontWeight: 700,
                color: "var(--muted)",
                textTransform: "uppercase",
                letterSpacing: 0.8,
                marginBottom: 4,
              }}
            >
              Minute
            </div>
            <div
              style={{
                maxHeight: 120,
                overflowY: "auto",
                borderRadius: 8,
                border: "1px solid var(--border)",
                background: "var(--bg)",
              }}
              onMouseEnter={() => setActiveSection("minute")}
            >
              {MINUTES.map((m) => {
                const selected = m === minute;
                return (
                  <button
                    key={m}
                    type="button"
                    onClick={() => updateTime(hour, m, ampm)}
                    style={{
                      width: "100%",
                      padding: "6px 8px",
                      textAlign: "left",
                      border: "none",
                      background: selected ? "var(--primary-glow)" : "transparent",
                      color: selected ? "var(--primary)" : "var(--text)",
                      fontWeight: selected ? 700 : 600,
                      fontSize: 12,
                      cursor: "pointer",
                    }}
                  >
                    {String(m).padStart(2, "0")}
                  </button>
                );
              })}
            </div>
          </div>

          <div style={{ width: 70 }}>
            <div
              style={{
                fontSize: 9,
                fontWeight: 700,
                color: "var(--muted)",
                textTransform: "uppercase",
                letterSpacing: 0.8,
                marginBottom: 4,
              }}
            >
              AM/PM
            </div>
            <div
              style={{
                display: "grid",
                gap: 8,
                borderRadius: 8,
                border: "1px solid var(--border)",
                background: "var(--bg)",
                padding: 6,
              }}
              onMouseEnter={() => setActiveSection("ampm")}
            >
              {["AM", "PM"].map((period) => {
                const selected = period === ampm;
                return (
                  <button
                    key={period}
                    type="button"
                    onClick={() => updateTime(hour, minute, period)}
                    style={{
                      width: "100%",
                      padding: "6px 4px",
                      borderRadius: 6,
                      border: "1px solid var(--border)",
                      background: selected ? "var(--primary)" : "var(--bg)",
                      color: selected ? "var(--surface)" : "var(--text)",
                      fontWeight: 700,
                      fontSize: 12,
                      cursor: "pointer",
                    }}
                  >
                    {period}
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
