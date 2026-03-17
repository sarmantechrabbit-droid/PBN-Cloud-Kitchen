import { useState, useEffect } from "react";
import {
  Activity,
  ChevronDown,
  ChevronUp,
  CheckCircle,
  Clock,
  Droplets,
  Eye,
  ImageIcon,
  Smile,
  Utensils,
  Wind,
  XCircle,
  Zap,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import Card from "../../components/ui/Card";
import PageHeader from "../../components/ui/PageHeader";
import StatusBadge from "../../components/ui/StatusBadge";
import { experiments } from "../../data/dummy";

// â”€â”€â”€ Static Questions â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€

const STATIC_QUESTIONS = [
  {
    id: "static_overall",
    question: "What did you think about the test overall?",
    type: "long_text",
  },
  {
    id: "static_satisfaction",
    question: "How satisfied are you with the test experience?",
    type: "rating_stars",
  },
  {
    id: "static_understanding",
    question: "Was the test easy to understand?",
    type: "yes_no",
  },
  {
    id: "static_expectations",
    question: "Did the test meet your expectations?",
    type: "yes_no",
  },
  {
    id: "static_quality",
    question: "How would you rate the quality of the test?",
    type: "rating_stars",
  },
];

// â”€â”€â”€ Question Components â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€

const QuestionComponents = {
  rating_stars: ({ value, onChange, maxStars = 5 }) => (
    <div style={{ display: "flex", gap: "8px", alignItems: "center" }}>
      {[...Array(maxStars)].map((_, i) => {
        const star = i + 1;
        return (
          <button
            key={star}
            onClick={() => onChange(star)}
            style={{
              background: "none",
              border: "none",
              fontSize: "1.8rem",
              cursor: "pointer",
              color: value >= star ? "#f59e0b" : "var(--border)",
              transition: "all 0.15s",
              transform: value >= star ? "scale(1.1)" : "scale(1)",
              padding: 0,
            }}
          >
            â˜…
          </button>
        );
      })}
      {value && (
        <span
          style={{
            marginLeft: 12,
            fontWeight: 700,
            color: "var(--primary)",
            fontSize: "0.9rem",
          }}
        >
          {value}/{maxStars}
        </span>
      )}
    </div>
  ),

  short_text: ({ value, onChange, placeholder = "Enter text..." }) => (
    <input
      type="text"
      value={value || ""}
      onChange={(e) => onChange(e.target.value)}
      className="input-field"
      placeholder={placeholder}
      style={{ fontSize: 14 }}
    />
  ),

  long_text: ({ value, onChange, placeholder = "Share your thoughts..." }) => (
    <textarea
      value={value || ""}
      onChange={(e) => onChange(e.target.value)}
      className="input-field"
      placeholder={placeholder}
      style={{ minHeight: 120, fontSize: 14, resize: "vertical" }}
    />
  ),

  yes_no: ({ value, onChange }) => (
    <div style={{ display: "flex", gap: 12 }}>
      {["Yes", "No"].map((opt) => (
        <button
          key={opt}
          onClick={() => onChange(opt)}
          style={{
            flex: 1,
            padding: "14px",
            borderRadius: 12,
            border: "1px solid var(--border)",
            background:
              value === opt
                ? opt === "Yes"
                  ? "var(--success-glow)"
                  : "var(--danger-glow)"
                : "var(--bg)",
            borderColor:
              value === opt
                ? opt === "Yes"
                  ? "var(--success)"
                  : "var(--danger)"
                : "var(--border)",
            color:
              value === opt
                ? opt === "Yes"
                  ? "var(--success)"
                  : "var(--danger)"
                : "var(--text)",
            fontWeight: 700,
            cursor: "pointer",
            transition: "all 0.2s",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: 8,
          }}
        >
          {opt === "Yes" ? <CheckCircle size={18} /> : <XCircle size={18} />}
          {opt}
        </button>
      ))}
    </div>
  ),

  nps: ({ value, onChange }) => (
    <div>
      <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
        {[...Array(11)].map((_, i) => (
          <button
            key={i}
            onClick={() => onChange(i)}
            style={{
              width: 38,
              height: 38,
              borderRadius: 10,
              fontWeight: 800,
              cursor: "pointer",
              fontSize: "0.9rem",
              border:
                value === i
                  ? "2px solid var(--primary)"
                  : "1px solid var(--border)",
              background: value === i ? "var(--primary)" : "var(--bg)",
              color: value === i ? "#fff" : "var(--text)",
              transition: "all 0.2s cubic-bezier(0.4, 0, 0.2, 1)",
              boxShadow:
                value === i ? "0 4px 12px var(--primary-glow)" : "none",
            }}
          >
            {i}
          </button>
        ))}
      </div>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          marginTop: 10,
          fontSize: 11,
          color: "var(--muted)",
          fontWeight: 600,
        }}
      >
        <span>Not likely at all</span>
        <span>Extremely likely</span>
      </div>
    </div>
  ),

  slider: ({ value, onChange, min = 0, max = 100, step = 1 }) => (
    <div style={{ padding: "10px 0" }}>
      <input
        type="range"
        min={min}
        max={max}
        step={step}
        value={value ?? (max - min) / 2}
        onChange={(e) => onChange(Number(e.target.value))}
        style={{
          width: "100%",
          accentColor: "var(--primary)",
          cursor: "pointer",
          height: 6,
          borderRadius: 3,
        }}
      />
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          marginTop: 12,
          fontSize: 12,
          fontWeight: 700,
        }}
      >
        <span style={{ color: "var(--muted)" }}>{min}</span>
        <span
          style={{
            color: "var(--primary)",
            background: "var(--primary-glow)",
            padding: "2px 10px",
            borderRadius: 20,
          }}
        >
          {value ?? "--"}
        </span>
        <span style={{ color: "var(--muted)" }}>{max}</span>
      </div>
    </div>
  ),

  single_choice: ({ value, onChange, options = [] }) => (
    <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
      {options.map((opt) => (
        <label
          key={opt}
          style={{
            display: "flex",
            alignItems: "center",
            gap: 12,
            cursor: "pointer",
            padding: "12px 16px",
            borderRadius: 12,
            transition: "all 0.2s",
            fontSize: 14,
            border: `1px solid ${
              value === opt ? "var(--primary)" : "var(--border)"
            }`,
            background: value === opt ? "var(--primary-glow)" : "var(--bg)",
            fontWeight: value === opt ? 600 : 400,
          }}
        >
          <input
            type="radio"
            checked={value === opt}
            onChange={() => onChange(opt)}
            style={{ width: 18, height: 18, accentColor: "var(--primary)" }}
          />
          {opt}
        </label>
      ))}
    </div>
  ),

  multi_choice: ({ value = [], onChange, options = [] }) => (
    <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
      {options.map((opt) => {
        const isChecked = value.includes(opt);
        return (
          <label
            key={opt}
            style={{
              display: "flex",
              alignItems: "center",
              gap: 12,
              cursor: "pointer",
              padding: "12px 16px",
              borderRadius: 12,
              transition: "all 0.2s",
              fontSize: 14,
              border: `1px solid ${
                isChecked ? "var(--primary)" : "var(--border)"
              }`,
              background: isChecked ? "var(--primary-glow)" : "var(--bg)",
              fontWeight: isChecked ? 600 : 400,
            }}
          >
            <input
              type="checkbox"
              checked={isChecked}
              onChange={() =>
                onChange(
                  isChecked ? value.filter((v) => v !== opt) : [...value, opt],
                )
              }
              style={{ width: 18, height: 18, accentColor: "var(--primary)" }}
            />
            {opt}
          </label>
        );
      })}
    </div>
  ),

  dropdown: ({ value, onChange, options = [] }) => (
    <select
      value={value || ""}
      onChange={(e) => onChange(e.target.value)}
      className="input-field"
      style={{ fontSize: 14 }}
    >
      <option value="" disabled>
        Select an option...
      </option>
      {options.map((opt) => (
        <option key={opt} value={opt}>
          {opt}
        </option>
      ))}
    </select>
  ),

  emoji_reaction: ({ value, onChange }) => (
    <div
      style={{
        display: "flex",
        justifyContent: "space-between",
        padding: "10px 20px",
      }}
    >
      {["😠", "😟", "😐", "🙂", "😍"].map((emoji, i) => (
        <button
          key={i}
          onClick={() => onChange(emoji)}
          style={{
            fontSize: "2.5rem",
            background: "none",
            border: "none",
            cursor: "pointer",
            filter:
              value === emoji
                ? "grayscale(0) scale(1.2)"
                : "grayscale(0.8) opacity(0.5)",
            transition: "all 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275)",
          }}
        >
          {emoji}
        </button>
      ))}
    </div>
  ),

  date: ({ value, onChange }) => (
    <input
      type="date"
      value={value || ""}
      onChange={(e) => onChange(e.target.value)}
      className="input-field"
      style={{ fontSize: 14 }}
    />
  ),

  number: ({ value, onChange, min, max }) => (
    <input
      type="number"
      min={min}
      max={max}
      value={value || ""}
      onChange={(e) => onChange(e.target.value)}
      className="input-field"
      placeholder="Enter number..."
      style={{ fontSize: 14 }}
    />
  ),

  ranking: ({ value = [], onChange, options = [] }) => {
    const handleMove = (idx, dir) => {
      const newList = [...value];
      const target = dir === "up" ? idx - 1 : idx + 1;
      if (target >= 0 && target < newList.length) {
        [newList[idx], newList[target]] = [newList[target], newList[idx]];
        onChange(newList);
      }
    };

    useEffect(() => {
      if (value.length === 0 && options.length > 0) onChange([...options]);
    }, [options]);

    return (
      <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
        {(value.length > 0 ? value : options).map((opt, i) => (
          <div
            key={opt}
            style={{
              display: "flex",
              alignItems: "center",
              gap: 12,
              padding: "10px 16px",
              background: "var(--bg)",
              border: "1px solid var(--border)",
              borderRadius: 12,
            }}
          >
            <span
              style={{ fontWeight: 800, color: "var(--primary)", width: 24 }}
            >
              {i + 1}.
            </span>
            <span style={{ flex: 1, fontSize: 14 }}>{opt}</span>
            <div style={{ display: "flex", gap: 4 }}>
              <button
                onClick={() => handleMove(i, "up")}
                disabled={i === 0}
                style={{
                  padding: 4,
                  borderRadius: 6,
                  opacity: i === 0 ? 0.3 : 1,
                }}
              >
                <ChevronUp size={14} />
              </button>
              <button
                onClick={() => handleMove(i, "down")}
                disabled={i === (value.length || options.length) - 1}
                style={{
                  padding: 4,
                  borderRadius: 6,
                  opacity: i === (value.length || options.length) - 1 ? 0.3 : 1,
                }}
              >
                <ChevronDown size={14} />
              </button>
            </div>
          </div>
        ))}
      </div>
    );
  },

  matrix: ({ value = {}, onChange, rows = [], columns = [] }) => (
    <div style={{ overflowX: "auto" }}>
      <table
        style={{
          width: "100%",
          borderCollapse: "separate",
          borderSpacing: "0 8px",
        }}
      >
        <thead>
          <tr>
            <th
              style={{
                textAlign: "left",
                padding: "8px 16px",
                fontSize: 11,
                color: "var(--muted)",
                textTransform: "uppercase",
              }}
            >
              Feature
            </th>
            {columns.map((col) => (
              <th
                key={col}
                style={{
                  textAlign: "center",
                  padding: 8,
                  fontSize: 11,
                  color: "var(--muted)",
                  textTransform: "uppercase",
                }}
              >
                {col}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((row) => (
            <tr key={row} style={{ background: "var(--bg-subtle)" }}>
              <td
                style={{
                  padding: 16,
                  fontSize: 13,
                  fontWeight: 600,
                  borderTopLeftRadius: 12,
                  borderBottomLeftRadius: 12,
                }}
              >
                {row}
              </td>
              {columns.map((col) => (
                <td key={col} style={{ textAlign: "center", padding: 12 }}>
                  <input
                    type="radio"
                    checked={value[row] === col}
                    onChange={() => onChange({ ...value, [row]: col })}
                    style={{
                      width: 18,
                      height: 18,
                      accentColor: "var(--primary)",
                      cursor: "pointer",
                    }}
                  />
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  ),

  image_choice: ({ value, onChange, options = [] }) => (
    <div
      style={{
        display: "grid",
        gridTemplateColumns: "repeat(auto-fit, minmax(140px, 1fr))",
        gap: 16,
      }}
    >
      {options.map((opt, i) => (
        <div
          key={i}
          onClick={() => onChange(opt)}
          style={{
            cursor: "pointer",
            borderRadius: 16,
            overflow: "hidden",
            transition: "all 0.2s",
            background: "var(--bg)",
            border:
              value === opt
                ? "3px solid var(--primary)"
                : "1px solid var(--border)",
          }}
        >
          <div
            style={{
              height: 100,
              background: "var(--border)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <ImageIcon size={32} style={{ opacity: 0.3 }} />
          </div>
          <div
            style={{
              padding: 10,
              fontSize: 12,
              textAlign: "center",
              fontWeight: value === opt ? 700 : 500,
            }}
          >
            {opt}
          </div>
        </div>
      ))}
    </div>
  ),

  linear_scale: ({ value, onChange, min = 1, max = 5 }) => (
    <div
      style={{
        display: "flex",
        justifyContent: "center",
        gap: 12,
        padding: "10px 0",
      }}
    >
      {[...Array(max - min + 1)].map((_, i) => {
        const val = min + i;
        return (
          <button
            key={val}
            onClick={() => onChange(val)}
            style={{
              width: 44,
              height: 44,
              borderRadius: "50%",
              fontWeight: 700,
              fontSize: "1rem",
              cursor: "pointer",
              transition: "all 0.2s",
              border: value === val ? "none" : "1px solid var(--border)",
              background: value === val ? "var(--primary)" : "var(--bg)",
              color: value === val ? "white" : "var(--text)",
            }}
          >
            {val}
          </button>
        );
      })}
    </div>
  ),
};

// â”€â”€â”€ Main Component â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€

export default function QualityPage() {
  const [experimentsState, setExperimentsState] = useState(experiments);
  const pendingExps = experimentsState.filter((e) => e.status === "Pending");

  const [questions] = useState(() => {
    const saved = localStorage.getItem("quality_questions");
    return saved ? JSON.parse(saved) : [];
  });
  const [selected, setSelected] = useState(null);
  const [reviewType, setReviewType] = useState(() => {
    const saved = localStorage.getItem("quality_questions");
    const hasCustom = saved ? JSON.parse(saved).length > 0 : false;
    return hasCustom ? "qa" : "rating";
  });
  const [queueFilter, setQueueFilter] = useState("Pending");
  const [sensoryScores, setSensoryScores] = useState({
    taste: 0,
    aroma: 0,
    visual: 0,
    consistency: 0,
    saltiness: 0,
    spiciness: 0,
    oiliness: 0,
    freshness: 0,
    aftertaste: 0,
  });
  const [formAnswers, setFormAnswers] = useState({});
  const [remarks, setRemarks] = useState("");
  const [statusMessage, setStatusMessage] = useState(null);

  const ingredientText = selected?.ingredients?.length
    ? selected.ingredients
        .map((ing) => ing.name)
        .filter(Boolean)
        .join(", ")
    : "—";

  const handleSelect = (exp) => {
    setSelected(exp);
    setStatusMessage(null);
    setRemarks("");
    setSensoryScores({
      taste: 0,
      aroma: 0,
      visual: 0,
      consistency: 0,
      saltiness: 0,
      spiciness: 0,
      oiliness: 0,
      freshness: 0,
      aftertaste: 0,
    });
    setFormAnswers({});
  };

  const handleSubmitReview = () => {
    if (!selected) return;
    const updatedExperiments = experimentsState.map((exp) =>
      exp.id === selected.id ? { ...exp, status: "Approved" } : exp,
    );
    setExperimentsState(updatedExperiments);
    setStatusMessage({ text: "Experiment APPROVED! Review data saved." });
    setTimeout(() => {
      setSelected(null);
      setStatusMessage(null);
    }, 3000);
  };

  const isFormValid =
    reviewType === "rating"
      ? true
      : Object.keys(formAnswers).length === questions.length;

  const RatingRow = ({ icon: Icon, label, value, onChange, color }) => (
    <div style={{ marginBottom: 16 }}>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: 8,
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 8,
            color: "var(--text)",
            fontSize: 13,
            fontWeight: 600,
          }}
        >
          <Icon size={14} style={{ color }} />
          {label}
        </div>
      </div>
      <div style={{ position: "relative" }}>
        <input
          type="number"
          min="0"
          max="10"
          value={value === 0 ? "" : value}
          onChange={(e) => {
            const val =
              e.target.value === ""
                ? 0
                : Math.min(10, Math.max(0, parseInt(e.target.value) || 0));
            onChange(val);
          }}
          placeholder="0-10"
          className="input-field"
          style={{
            paddingRight: 40,
            textAlign: "center",
            fontWeight: 800,
            fontSize: 15,
            color: value > 0 ? color : "var(--muted)",
            borderColor: value > 0 ? color : "var(--border)",
            background: value > 0 ? `${color}08` : "transparent",
          }}
        />
        <span
          style={{
            position: "absolute",
            right: 12,
            top: "50%",
            transform: "translateY(-50%)",
            fontSize: 11,
            fontWeight: 600,
            color: "var(--muted)",
          }}
        >
          /10
        </span>
      </div>
    </div>
  );

  const queueItems = experimentsState.filter((e) =>
    queueFilter === "All" ? true : e.status === queueFilter,
  );

  return (
    <div style={{ animation: "fadeIn 0.4s ease-out" }}>
      <PageHeader
        title="Review Recipe"
        subtitle="Review cooking experiments and approve or reject based on AI analysis."
        actions={[
          <div
            key="pending"
            style={{
              display: "flex",
              alignItems: "center",
              gap: 8,
              padding: "8px 16px",
              background:
                pendingExps.length > 0
                  ? "var(--warning-glow)"
                  : "var(--success-glow)",
              borderRadius: 10,
              border: `1px solid ${pendingExps.length > 0 ? "rgba(245,158,11,0.2)" : "rgba(34,197,94,0.2)"}`,
              fontSize: 13,
              fontWeight: 700,
              color:
                pendingExps.length > 0 ? "var(--warning)" : "var(--success)",
            }}
          >
            <Clock size={16} /> {pendingExps.length} Pending Reviews
          </div>,
        ]}
      />

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "300px 1fr",
          gap: 24,
          alignItems: "start",
        }}
      >
        {/* Left: Review Queue */}
        <Card
          noPad
          style={{ height: "fit-content", position: "sticky", top: 88 }}
        >
          <div
            style={{
              padding: "20px",
              borderBottom: "1px solid var(--border)",
              fontSize: 15,
              fontWeight: 700,
              color: "var(--text)",
            }}
          >
            Review Queue
          </div>

          <div style={{ maxHeight: "calc(100vh - 200px)", overflowY: "auto" }}>
            {queueItems.length === 0 ? (
              <div
                style={{
                  padding: "24px 20px",
                  fontSize: 12,
                  color: "var(--muted)",
                  textAlign: "center",
                }}
              >
                No pending review items.
              </div>
            ) : (
              queueItems.map((exp) => (
                <div
                  key={exp.id}
                  onClick={() => handleSelect(exp)}
                  style={{
                    padding: "16px 20px",
                    cursor: "pointer",
                    borderBottom: "1px solid var(--border)",
                    background:
                      selected?.id === exp.id
                        ? "var(--primary-glow)"
                        : "transparent",
                    borderLeft: `5px solid ${selected?.id === exp.id ? "var(--primary)" : "transparent"}`,
                    transition: "all 0.2s cubic-bezier(0.4, 0, 0.2, 1)",
                  }}
                >
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "flex-start",
                      marginBottom: 6,
                    }}
                  >
                    <span
                      style={{
                        fontSize: 14,
                        fontWeight: 700,
                        color:
                          selected?.id === exp.id
                            ? "var(--primary)"
                            : "var(--text)",
                      }}
                    >
                      {exp.recipe}
                    </span>
                    <StatusBadge status={exp.status} />
                  </div>
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      fontSize: 12,
                      color: "var(--muted)",
                      fontWeight: 500,
                    }}
                  >
                    <span>{exp.id}</span>
                    <span>{exp.chef}</span>
                  </div>
                </div>
              ))
            )}
          </div>
        </Card>

        {/* Right: Review Form */}
        <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
          <AnimatePresence>
            {selected ? (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95 }}
              >
                <Card style={{ borderLeft: "6px solid var(--primary)" }}>
                  {/* Header */}
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "flex-start",
                      marginBottom: 20,
                    }}
                  >
                    <div>
                      <h2
                        style={{
                          fontSize: 22,
                          fontWeight: 800,
                          marginBottom: 4,
                        }}
                      >
                        {selected.recipe}
                      </h2>
                      <div style={{ fontSize: 13, color: "var(--muted)" }}>
                        {selected.id} â€¢ Submitted by {selected.chef} â€¢{" "}
                        {selected.date}
                      </div>
                    </div>
                    <StatusBadge status={selected.status} />
                  </div>

                  {/* Metadata */}
                  <div
                    style={{
                      display: "grid",
                      gridTemplateColumns: "repeat(4, 1fr)",
                      gap: 20,
                      padding: "20px",
                      background: "var(--bg-subtle)",
                      borderRadius: 16,
                      marginBottom: 30,
                    }}
                  >
                    {[
                      { label: "Ingredients", value: ingredientText },
                      { label: "Temperature", value: `${selected.temp}Â°C` },
                      { label: "Version", value: selected.version },
                    ].map(({ label, value }) => (
                      <div key={label}>
                        <div
                          style={{
                            fontSize: 11,
                            color: "var(--muted)",
                            textTransform: "uppercase",
                            fontWeight: 700,
                            marginBottom: 6,
                          }}
                        >
                          {label}
                        </div>
                        <div
                          style={{
                            fontSize: label === "AI Score" ? 20 : 15,
                            fontWeight: 800,
                          }}
                        >
                          {value}
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Sensory Evaluation */}
                  <div
                    style={{
                      fontSize: 18,
                      fontWeight: 700,
                      marginBottom: 20,
                      display: "flex",
                      alignItems: "center",
                      gap: 10,
                    }}
                  >
                    <Activity size={20} style={{ color: "var(--primary)" }} />
                    Sensory Evaluation
                  </div>

                  {/* Review Type Toggle */}
                  <div
                    style={{
                      display: "flex",
                      gap: 10,
                      marginBottom: 24,
                      padding: 6,
                      background: "var(--bg-subtle)",
                      borderRadius: 12,
                    }}
                  >
                    {[
                      { key: "rating", label: "Rating Based" },
                      { key: "qa", label: "Question & Answer" },
                    ].map(({ key, label }) => (
                      <button
                        key={key}
                        onClick={() => setReviewType(key)}
                        style={{
                          flex: 1,
                          padding: "10px",
                          borderRadius: 8,
                          border: "1px solid #e2e8f0",
                          background:
                            reviewType === key
                              ? "var(--primary)"
                              : "transparent",
                          color: reviewType === key ? "white" : "var(--muted)",
                          fontWeight: 700,
                          transition: "0.2s",
                          cursor: "pointer",
                        }}
                      >
                        {label}
                      </button>
                    ))}
                  </div>

                  {/* Rating Based */}
                  {reviewType === "rating" ? (
                    <div
                      style={{
                        display: "grid",
                        gridTemplateColumns: "1fr 1fr 1fr",
                        gap: 24,
                      }}
                    >
                      {[
                        [
                          {
                            label: "Taste & Flavor",
                            icon: Utensils,
                            color: "#3b82f6",
                            key: "taste",
                          },
                          {
                            label: "Aroma & Scent",
                            icon: Wind,
                            color: "#f59e0b",
                            key: "aroma",
                          },
                          {
                            label: "Saltiness Balance",
                            icon: Zap,
                            color: "#8b5cf6",
                            key: "saltiness",
                          },
                        ],
                        [
                          {
                            label: "Visual Appeal",
                            icon: Eye,
                            color: "#10b981",
                            key: "visual",
                          },
                          {
                            label: "Texture & Consistency",
                            icon: Droplets,
                            color: "#f97316",
                            key: "consistency",
                          },
                          {
                            label: "Spiciness Level",
                            icon: Activity,
                            color: "#ef4444",
                            key: "spiciness",
                          },
                        ],
                        [
                          {
                            label: "Oiliness/Greasiness",
                            icon: Droplets,
                            color: "#84cc16",
                            key: "oiliness",
                          },
                          {
                            label: "Ingredient Freshness",
                            icon: Activity,
                            color: "#06b6d4",
                            key: "freshness",
                          },
                          {
                            label: "Aftertaste Quality",
                            icon: Smile,
                            color: "#d946ef",
                            key: "aftertaste",
                          },
                        ],
                      ].map((col, ci) => (
                        <div
                          key={ci}
                          style={{
                            display: "flex",
                            flexDirection: "column",
                            gap: 4,
                          }}
                        >
                          {col.map(({ label, icon, color, key }) => (
                            <RatingRow
                              key={key}
                              label={label}
                              icon={icon}
                              color={color}
                              value={sensoryScores[key]}
                              onChange={(v) =>
                                setSensoryScores((s) => ({ ...s, [key]: v }))
                              }
                            />
                          ))}
                        </div>
                      ))}
                    </div>
                  ) : (
                    /* Q&A Based */
                    <div
                      style={{
                        display: "flex",
                        flexDirection: "column",
                        gap: 20,
                      }}
                    >
                      {questions.length === 0 ? (
                        <div
                          style={{
                            padding: "40px",
                            textAlign: "center",
                            color: "var(--muted)",
                            background: "var(--bg-subtle)",
                            borderRadius: 12,
                          }}
                        >
                          No custom questions configured.
                        </div>
                      ) : (
                        questions.map((q, i) => {
                          const Comp = QuestionComponents[q.type];
                          return (
                            <div
                              key={q.id}
                              style={{
                                padding: "24px",
                                background: "var(--bg)",
                                border: "1px solid var(--border)",
                                borderRadius: 16,
                              }}
                            >
                              <div
                                style={{
                                  display: "flex",
                                  gap: 16,
                                  marginBottom: 20,
                                }}
                              >
                                <div
                                  style={{
                                    width: 36,
                                    height: 36,
                                    borderRadius: 10,
                                    background: "var(--primary-glow)",
                                    color: "var(--primary)",
                                    display: "flex",
                                    alignItems: "center",
                                    justifyContent: "center",
                                    fontSize: 14,
                                    fontWeight: 800,
                                    flexShrink: 0,
                                  }}
                                >
                                  {i + 1}
                                </div>
                                <div style={{ flex: 1 }}>
                                  <div
                                    style={{
                                      fontSize: 16,
                                      fontWeight: 700,
                                      color: "var(--text)",
                                    }}
                                  >
                                    {q.question}
                                  </div>
                                </div>
                              </div>
                              {Comp ? (
                                <Comp
                                  {...q}
                                  value={formAnswers[q.id]}
                                  onChange={(val) =>
                                    setFormAnswers((prev) => ({
                                      ...prev,
                                      [q.id]: val,
                                    }))
                                  }
                                />
                              ) : (
                                <div
                                  style={{
                                    color: "var(--danger)",
                                    fontSize: 13,
                                    background: "var(--danger-glow)",
                                    padding: 12,
                                    borderRadius: 8,
                                  }}
                                >
                                  Component for {q.type} not found.
                                </div>
                              )}
                            </div>
                          );
                        })
                      )}
                    </div>
                  )}

                  {/* General Feedback (Static Questions) */}
                  <div style={{ marginTop: 40 }}>
                    <h4
                      style={{
                        fontSize: 16,
                        fontWeight: 700,
                        marginBottom: 20,
                        display: "flex",
                        alignItems: "center",
                        gap: 8,
                        color: "var(--text)",
                      }}
                    >
                      <CheckCircle
                        size={18}
                        style={{ color: "var(--success)" }}
                      />
                      General Feedback Questions
                    </h4>

                    <div
                      style={{
                        display: "flex",
                        flexDirection: "column",
                        gap: 20,
                      }}
                    >
                      {/* {STATIC_QUESTIONS.map((q, i) => {
                        const Comp = QuestionComponents[q.type];
                        return (
                          <div
                            key={q.id}
                            style={{
                              padding: "24px",
                              border: "1px solid var(--border)",
                              borderRadius: 16,
                            }}
                          >
                            <div
                              style={{
                                fontSize: 15,
                                fontWeight: 700,
                                color: "var(--text)",
                                marginBottom: 16,
                              }}
                            >
                              <span
                                style={{
                                  color: "var(--primary)",
                                  marginRight: 8,
                                }}
                              >
                                {i + 1}.
                              </span>
                              {q.question}
                            </div>
                            {Comp ? (
                              <Comp
                                {...q}
                                value={formAnswers[q.id]}
                                onChange={(val) =>
                                  setFormAnswers((prev) => ({
                                    ...prev,
                                    [q.id]: val,
                                  }))
                                }
                              />
                            ) : (
                              <div
                                style={{
                                  color: "var(--danger)",
                                  fontSize: 13,
                                  background: "var(--danger-glow)",
                                  padding: 12,
                                  borderRadius: 8,
                                }}
                              >
                                Component not found.
                              </div>
                            )}
                          </div>
                        );
                      })} */}
                    </div>
                  </div>

                  {/* Additional Remarks */}
                  <div style={{ marginTop: 32 }}>
                    <label
                      style={{
                        display: "block",
                        fontSize: 14,
                        fontWeight: 700,
                        marginBottom: 12,
                      }}
                    >
                      Additional Remarks
                    </label>
                    <textarea
                      value={remarks}
                      onChange={(e) => setRemarks(e.target.value)}
                      placeholder="Add any specific observations or feedback here..."
                      className="input-field"
                      style={{ minHeight: 120, resize: "vertical" }}
                    />
                  </div>

                  {/* Status Message */}
                  {statusMessage && (
                    <div
                      style={{
                        marginTop: 24,
                        padding: "16px",
                        borderRadius: 12,
                        background: "var(--success-glow)",
                        color: "var(--success)",
                        fontWeight: 700,
                        display: "flex",
                        alignItems: "center",
                        gap: 10,
                      }}
                    >
                      <CheckCircle size={20} /> {statusMessage.text}
                    </div>
                  )}

                  {/* Submit */}
                  <div style={{ display: "flex", gap: 16, marginTop: 32 }}>
                    <button
                      disabled={!isFormValid}
                      onClick={handleSubmitReview}
                      style={{
                        flex: 1,
                        padding: "18px",
                        borderRadius: 14,
                        background: !isFormValid
                          ? "var(--border)"
                          : "var(--success)",
                        border: "none",
                        color: "white",
                        fontWeight: 800,
                        fontSize: 15,
                        cursor: !isFormValid ? "not-allowed" : "pointer",
                        boxShadow: !isFormValid
                          ? "none"
                          : "0 8px 24px var(--success-glow)",
                        transition: "0.3s",
                      }}
                    >
                      Submit
                    </button>
                  </div>
                </Card>
              </motion.div>
            ) : (
              <Card
                style={{
                  textAlign: "center",
                  padding: "80px 40px",
                  color: "var(--muted)",
                }}
              >
                <Activity
                  size={48}
                  style={{ opacity: 0.2, marginBottom: 20 }}
                />
                <h3 style={{ fontSize: 18, fontWeight: 700, marginBottom: 8 }}>
                  Select an experiment to start review
                </h3>
                <p style={{ fontSize: 14 }}>
                  Choose a pending batch from the list on the left.
                </p>
              </Card>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
