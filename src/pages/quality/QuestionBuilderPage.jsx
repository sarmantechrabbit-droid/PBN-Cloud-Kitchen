import { useState, useEffect } from "react";
import {
  AlignLeft,
  Activity,
  Calendar,
  ChevronDown,
  ChevronUp,
  Circle,
  CheckSquare,
  Download,
  Edit3,
  FileJson,
  GripVertical,
  Hash,
  ImageIcon,
  LayoutGrid,
  List,
  ListOrdered,
  Plus,
  Save,
  Smile,
  ThumbsUp,
  Trash2,
  Type,
  XCircle,
  Zap,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import Card from "../../components/ui/Card";
import PageHeader from "../../components/ui/PageHeader";
 
// ─── Constants ───────────────────────────────────────────────────────────────
 
const QUESTION_TYPES = [
  { id: "rating_stars", label: "⭐ Star Rating", icon: "★" },
  { id: "nps", label: "🔢 NPS Scale (0-10)", icon: <Hash size={16} /> },
  { id: "slider", label: "🎚️ Slider", icon: <Zap size={16} /> },
  { id: "single_choice", label: "🔘 Single Choice", icon: <Circle size={16} /> },
  { id: "multi_choice", label: "☑️ Multiple Choice", icon: <CheckSquare size={16} /> },
  { id: "dropdown", label: "📋 Dropdown", icon: <List size={16} /> },
  { id: "short_text", label: "✏️ Short Answer", icon: <Type size={16} /> },
  { id: "long_text", label: "📝 Long Answer", icon: <AlignLeft size={16} /> },
  { id: "yes_no", label: "👍 Yes / No", icon: <ThumbsUp size={16} /> },
  { id: "emoji_reaction", label: "😊 Emoji Reaction", icon: <Smile size={16} /> },
  { id: "date", label: "📅 Date Picker", icon: <Calendar size={16} /> },
  { id: "number", label: "🔢 Number Input", icon: <Hash size={16} /> },
  { id: "ranking", label: "🏆 Ranking", icon: <ListOrdered size={16} /> },
  { id: "matrix", label: "📊 Matrix / Grid", icon: <LayoutGrid size={16} /> },
  { id: "image_choice", label: "🖼️ Image Choice", icon: <ImageIcon size={16} /> },
  { id: "linear_scale", label: "📏 Linear Scale", icon: <Activity size={16} /> },
];
 
const DEFAULT_QUESTION = {
  id: null,
  question: "",
  type: "rating_stars",
  maxStars: 5,
  options: ["Option 1", "Option 2"],
  min: 0,
  max: 10,
  step: 1,
  rows: ["Row 1", "Row 2"],
  columns: ["Col 1", "Col 2"],
  
};
 
const SIMPLE_TYPES = ["short_text", "long_text", "yes_no", "emoji_reaction", "date", "number"];
 
// ─── Question Preview Components ─────────────────────────────────────────────
 
const QuestionComponents = {
  rating_stars: ({ value, onChange, maxStars = 5 }) => (
    <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
      {[...Array(maxStars)].map((_, i) => (
        <button
          key={i}
          onClick={() => onChange(i + 1)}
          style={{
            background: "none", border: "none", fontSize: "1.5rem", cursor: "pointer",
            color: value >= i + 1 ? "#f59e0b" : "var(--border)",
            transition: "all 0.15s",
            transform: value >= i + 1 ? "scale(1.1)" : "scale(1)",
            padding: 0,
          }}
        >★</button>
      ))}
      {value && (
        <span style={{ marginLeft: 12, fontWeight: 700, color: "var(--primary)", fontSize: "0.9rem" }}>
          {value}/{maxStars}
        </span>
      )}
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
              width: 38, height: 38, borderRadius: 10, fontWeight: 800, cursor: "pointer", fontSize: "0.9rem",
              border: value === i ? "2px solid var(--primary)" : "1px solid var(--border)",
              background: value === i ? "var(--primary)" : "var(--bg)",
              color: value === i ? "#fff" : "var(--text)",
              transition: "all 0.2s cubic-bezier(0.4, 0, 0.2, 1)",
              boxShadow: value === i ? "0 4px 12px var(--primary-glow)" : "none",
            }}
          >{i}</button>
        ))}
      </div>
      <div style={{ display: "flex", justifyContent: "space-between", marginTop: 10, fontSize: 11, color: "var(--muted)", fontWeight: 600 }}>
        <span>Not likely at all</span>
        <span>Extremely likely</span>
      </div>
    </div>
  ),
 
  slider: ({ value, onChange, min = 0, max = 100, step = 1 }) => (
    <div style={{ padding: "10px 0" }}>
      <input
        type="range" min={min} max={max} step={step} value={value ?? (max - min) / 2}
        onChange={(e) => onChange(Number(e.target.value))}
        style={{ width: "100%", accentColor: "var(--primary)", cursor: "pointer", height: 6, borderRadius: 3 }}
      />
      <div style={{ display: "flex", justifyContent: "space-between", marginTop: 12, fontSize: 12, fontWeight: 700 }}>
        <span style={{ color: "var(--muted)" }}>{min}</span>
        <span style={{ color: "var(--primary)", background: "var(--primary-glow)", padding: "2px 10px", borderRadius: 20 }}>
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
            display: "flex", alignItems: "center", gap: 12, cursor: "pointer",
            padding: "12px 16px", borderRadius: 12, transition: "all 0.2s", fontSize: 14,
            border: `1px solid ${value === opt ? "var(--primary)" : "var(--border)"}`,
            background: value === opt ? "var(--primary-glow)" : "var(--bg)",
            fontWeight: value === opt ? 600 : 400,
          }}
        >
          <input type="radio" checked={value === opt} onChange={() => onChange(opt)}
            style={{ width: 18, height: 18, accentColor: "var(--primary)" }} />
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
              display: "flex", alignItems: "center", gap: 12, cursor: "pointer",
              padding: "12px 16px", borderRadius: 12, transition: "all 0.2s", fontSize: 14,
              border: `1px solid ${isChecked ? "var(--primary)" : "var(--border)"}`,
              background: isChecked ? "var(--primary-glow)" : "var(--bg)",
              fontWeight: isChecked ? 600 : 400,
            }}
          >
            <input
              type="checkbox" checked={isChecked}
              onChange={() => onChange(isChecked ? value.filter((v) => v !== opt) : [...value, opt])}
              style={{ width: 18, height: 18, accentColor: "var(--primary)" }}
            />
            {opt}
          </label>
        );
      })}
    </div>
  ),
 
  dropdown: ({ value, onChange, options = [] }) => (
    <select value={value || ""} onChange={(e) => onChange(e.target.value)} className="input-field" style={{ fontSize: 14 }}>
      <option value="" disabled>Select an option...</option>
      {options.map((opt) => <option key={opt} value={opt}>{opt}</option>)}
    </select>
  ),
 
  short_text: ({ value, onChange, placeholder = "Enter text..." }) => (
    <input type="text" value={value || ""} onChange={(e) => onChange(e.target.value)}
      className="input-field" placeholder={placeholder} style={{ fontSize: 14 }} />
  ),
 
  long_text: ({ value, onChange, placeholder = "Enter detailed notes..." }) => (
    <textarea value={value || ""} onChange={(e) => onChange(e.target.value)}
      className="input-field" placeholder={placeholder}
      style={{ minHeight: 120, fontSize: 14, resize: "vertical" }} />
  ),
 
  yes_no: ({ value, onChange }) => (
    <div style={{ display: "flex", gap: 12 }}>
      {["Yes", "No"].map((opt) => (
        <button
          key={opt}
          onClick={() => onChange(opt)}
          style={{
            flex: 1, padding: "14px", borderRadius: 12, fontWeight: 700, cursor: "pointer", transition: "all 0.2s",
            display: "flex", alignItems: "center", justifyContent: "center", gap: 8,
            border: `1px solid ${value === opt ? (opt === "Yes" ? "var(--success)" : "var(--danger)") : "var(--border)"}`,
            background: value === opt ? (opt === "Yes" ? "var(--success-glow)" : "var(--danger-glow)") : "var(--bg)",
            color: value === opt ? (opt === "Yes" ? "var(--success)" : "var(--danger)") : "var(--text)",
          }}
        >
          {opt === "Yes" ? <ThumbsUp size={18} /> : <XCircle size={18} />}
          {opt}
        </button>
      ))}
    </div>
  ),
 
  emoji_reaction: ({ value, onChange }) => (
    <div style={{ display: "flex", justifyContent: "space-between", padding: "10px 20px" }}>
      {["😠", "😟", "😐", "🙂", "😍"].map((emoji, i) => (
        <button
          key={i}
          onClick={() => onChange(emoji)}
          style={{
            fontSize: "2.5rem", background: "none", border: "none", cursor: "pointer",
            filter: value === emoji ? "grayscale(0) scale(1.2)" : "grayscale(0.8) opacity(0.5)",
            transition: "all 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275)",
          }}
        >{emoji}</button>
      ))}
    </div>
  ),
 
  date: ({ value, onChange }) => (
    <input type="date" value={value || ""} onChange={(e) => onChange(e.target.value)}
      className="input-field" style={{ fontSize: 14 }} />
  ),
 
  number: ({ value, onChange, min, max }) => (
    <input type="number" min={min} max={max} value={value || ""} onChange={(e) => onChange(e.target.value)}
      className="input-field" placeholder="Enter number..." style={{ fontSize: 14 }} />
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
          <div key={opt} style={{ display: "flex", alignItems: "center", gap: 12, padding: "10px 16px", background: "var(--bg)", border: "1px solid var(--border)", borderRadius: 12 }}>
            <span style={{ fontWeight: 800, color: "var(--primary)", width: 24 }}>{i + 1}.</span>
            <span style={{ flex: 1, fontSize: 14 }}>{opt}</span>
            <div style={{ display: "flex", gap: 4 }}>
              <button onClick={() => handleMove(i, "up")} disabled={i === 0} style={{ padding: 4, borderRadius: 6, opacity: i === 0 ? 0.3 : 1 }}>
                <ChevronUp size={14} />
              </button>
              <button onClick={() => handleMove(i, "down")} disabled={i === (value.length || options.length) - 1} style={{ padding: 4, borderRadius: 6, opacity: i === (value.length || options.length) - 1 ? 0.3 : 1 }}>
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
      <table style={{ width: "100%", borderCollapse: "separate", borderSpacing: "0 8px" }}>
        <thead>
          <tr>
            <th style={{ textAlign: "left", padding: "8px 16px", fontSize: 11, color: "var(--muted)", textTransform: "uppercase" }}>Feature</th>
            {columns.map((col) => (
              <th key={col} style={{ textAlign: "center", padding: 8, fontSize: 11, color: "var(--muted)", textTransform: "uppercase" }}>{col}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((row) => (
            <tr key={row} style={{ background: "var(--bg-subtle)", borderRadius: 12 }}>
              <td style={{ padding: 16, fontSize: 13, fontWeight: 600, borderTopLeftRadius: 12, borderBottomLeftRadius: 12 }}>{row}</td>
              {columns.map((col) => (
                <td key={col} style={{ textAlign: "center", padding: 12 }}>
                  <input type="radio" checked={value[row] === col} onChange={() => onChange({ ...value, [row]: col })}
                    style={{ width: 18, height: 18, accentColor: "var(--primary)", cursor: "pointer" }} />
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  ),
 
  image_choice: ({ value, onChange, options = [] }) => (
    <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(140px, 1fr))", gap: 16 }}>
      {options.map((opt, i) => (
        <div
          key={i}
          onClick={() => onChange(opt)}
          style={{
            cursor: "pointer", borderRadius: 16, overflow: "hidden", transition: "all 0.2s", background: "var(--bg)",
            border: value === opt ? "3px solid var(--primary)" : "1px solid var(--border)",
          }}
        >
          <div style={{ height: 100, background: "var(--border)", display: "flex", alignItems: "center", justifyContent: "center" }}>
            <ImageIcon size={32} style={{ opacity: 0.3 }} />
          </div>
          <div style={{ padding: 10, fontSize: 12, textAlign: "center", fontWeight: value === opt ? 700 : 500 }}>{opt}</div>
        </div>
      ))}
    </div>
  ),
 
  linear_scale: ({ value, onChange, min = 1, max = 5 }) => (
    <div style={{ display: "flex", justifyContent: "center", gap: 12, padding: "10px 0" }}>
      {[...Array(max - min + 1)].map((_, i) => {
        const val = min + i;
        return (
          <button
            key={val}
            onClick={() => onChange(val)}
            style={{
              width: 44, height: 44, borderRadius: "50%", fontWeight: 700, fontSize: "1rem", cursor: "pointer", transition: "all 0.2s",
              border: value === val ? "none" : "1px solid var(--border)",
              background: value === val ? "var(--primary)" : "var(--bg)",
              color: value === val ? "white" : "var(--text)",
            }}
          >{val}</button>
        );
      })}
    </div>
  ),
};
 
// ─── Main Component ───────────────────────────────────────────────────────────
 
export default function QuestionBuilderPage() {
  const [questions, setQuestions] = useState(() => {
    const saved = localStorage.getItem("quality_questions");
    return saved ? JSON.parse(saved) : [];
  });
  const [currentQuestion, setCurrentQuestion] = useState(DEFAULT_QUESTION);
  const [isEditing, setIsEditing] = useState(false);
  const [showJson, setShowJson] = useState(false);
 
  useEffect(() => {
    localStorage.setItem("quality_questions", JSON.stringify(questions));
  }, [questions]);
 
  const updateCurrent = (patch) => setCurrentQuestion((q) => ({ ...q, ...patch }));
 
  const handleAddOrUpdate = () => {
    if (!currentQuestion.question.trim()) return;
    if (isEditing) {
      setQuestions(questions.map((q) => (q.id === currentQuestion.id ? { ...currentQuestion } : q)));
      setIsEditing(false);
    } else {
      setQuestions([...questions, { ...currentQuestion, id: String(Date.now()) }]);
    }
    setCurrentQuestion(DEFAULT_QUESTION);
  };
 
  const handleEdit = (q) => {
    setCurrentQuestion({ ...q });
    setIsEditing(true);
  };
 
  const handleDelete = (id) => setQuestions(questions.filter((q) => q.id !== id));
 
  const moveQuestion = (index, dir) => {
    const next = [...questions];
    const target = dir === "up" ? index - 1 : index + 1;
    if (target >= 0 && target < next.length) {
      [next[index], next[target]] = [next[target], next[index]];
      setQuestions(next);
    }
  };
 
  const exportJson = () => {
    const uri = "data:application/json;charset=utf-8," + encodeURIComponent(JSON.stringify({ questions }, null, 2));
    Object.assign(document.createElement("a"), { href: uri, download: "quality-questions.json" }).click();
  };
 
  return (
    <div style={{ animation: "fadeIn 0.3s ease-out" }}>
      <PageHeader
        title="🔧 Question Builder"
        subtitle="Build dynamic questions for Quality Review (Manager only)"
        actions={[
          <button
            key="export"
            onClick={exportJson}
            style={{
              padding: "8px 16px", background: "var(--primary)", color: "white",
              borderRadius: 8, border: "none", fontWeight: 600, cursor: "pointer",
              display: "flex", alignItems: "center", gap: 6,
            }}
          >
            <Download size={16} /> Export JSON
          </button>,
        ]}
      />
 
      <div style={{ display: "grid", gridTemplateColumns: "1fr 380px", gap: 24 }}>
 
        {/* ── Left: Question List ── */}
        <Card noPad style={{ maxHeight: "75vh", overflow: "auto" }}>
          <div style={{ padding: "20px", borderBottom: "1px solid var(--border)", fontSize: 14, fontWeight: 700, color: "var(--text)" }}>
            Review Form ({questions.length} questions)
          </div>
 
          {questions.length === 0 ? (
            <div style={{ padding: "60px 20px", textAlign: "center", color: "var(--muted)" }}>
              <Type size={48} style={{ opacity: 0.3, marginBottom: 16 }} />
              <div style={{ fontSize: 15, fontWeight: 600, marginBottom: 4 }}>No questions yet</div>
              <div style={{ fontSize: 12 }}>Add your first question using the editor</div>
            </div>
          ) : (
            <div style={{ display: "flex", flexDirection: "column" }}>
              {questions.map((q, idx) => {
                const Comp = QuestionComponents[q.type];
                const isLast = idx === questions.length - 1;
 
                return (
                  <div
                    key={q.id}
                    style={{
                      padding: 20,
                      borderBottom: isLast ? "none" : "1px solid var(--border)",
                      display: "flex", flexDirection: "column", gap: 16,
                      background: "transparent",
                    }}
                  >
                    {/* Row header */}
                    <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
                      <div style={{ color: "var(--muted)" }}>
                        <GripVertical size={16} />
                      </div>
                      <div style={{ flex: 1 }}>
                        <div style={{ fontSize: 14, fontWeight: 700, color: "var(--text)", marginBottom: 4 }}>
                          {q.question}
                        </div>
                        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                          <span style={{ fontSize: 11, background: "var(--primary-glow)", color: "var(--primary)", padding: "2px 8px", borderRadius: 6, fontWeight: 600 }}>
                            {q.type.replace("_", " ").toUpperCase()}
                          </span>
                        </div>
                      </div>
 
                      <div style={{ display: "flex", gap: 4 }}>
                        <div style={{ display: "flex", flexDirection: "column", gap: 2 }}>
                          <button
                            onClick={() => moveQuestion(idx, "up")}
                            disabled={idx === 0}
                            style={{ padding: 4, borderRadius: 4, background: "var(--bg)", border: "1px solid var(--border)", cursor: idx === 0 ? "not-allowed" : "pointer", opacity: idx === 0 ? 0.4 : 1 }}
                          >
                            <ChevronUp size={12} />
                          </button>
                          <button
                            onClick={() => moveQuestion(idx, "down")}
                            disabled={idx === questions.length - 1}
                            style={{ padding: 4, borderRadius: 4, background: "var(--bg)", border: "1px solid var(--border)", cursor: idx === questions.length - 1 ? "not-allowed" : "pointer", opacity: idx === questions.length - 1 ? 0.4 : 1 }}
                          >
                            <ChevronDown size={12} />
                          </button>
                        </div>
                        <button onClick={() => handleEdit(q)} style={{ padding: 8, borderRadius: 8, background: "var(--surface)", border: "1px solid var(--border)" }}>
                          <Edit3 size={14} />
                        </button>
                        <button onClick={() => handleDelete(q.id)} style={{ padding: 8, borderRadius: 8, background: "var(--danger-glow)", color: "var(--danger)", border: "1px solid var(--danger-glow)" }}>
                          <Trash2 size={14} />
                        </button>
                      </div>
                    </div>
 
                    {/* Live preview */}
                    <div style={{ padding: 16, background: "var(--bg-subtle)", borderRadius: 12, border: "1px dashed var(--border)", pointerEvents: "none", opacity: 0.8 }}>
                      {Comp
                        ? <Comp {...q} value={null} onChange={() => {}} />
                        : <div style={{ fontSize: 12, color: "var(--muted)" }}>Preview not available</div>
                      }
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </Card>
 
        {/* ── Right: Question Editor ── */}
        <Card>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20 }}>
            <div style={{ fontSize: 16, fontWeight: 700, color: "var(--text)", display: "flex", alignItems: "center", gap: 8 }}>
              <Edit3 size={20} style={{ color: "var(--primary)" }} />
              Question Editor
            </div>
            <button
              onClick={() => setShowJson(!showJson)}
              style={{
                padding: "8px 12px", borderRadius: 8, fontSize: 12, fontWeight: 600, cursor: "pointer",
                background: showJson ? "var(--primary)" : "var(--bg)",
                color: showJson ? "white" : "var(--text)",
                border: `1px solid ${showJson ? "var(--primary)" : "var(--border)"}`,
                display: "flex", alignItems: "center", gap: 6,
              }}
            >
              <FileJson size={14} /> {showJson ? "Hide JSON" : "Show JSON"}
            </button>
          </div>
 
          {showJson && (
            <motion.pre
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              style={{
                background: "#1e1e1e", color: "#7cc244", padding: 16, borderRadius: 12,
                fontSize: 11, overflowX: "auto", marginBottom: 20, fontFamily: "monospace",
                lineHeight: 1.4, border: "1px solid var(--border)",
              }}
            >
              {JSON.stringify({ questions }, null, 2)}
            </motion.pre>
          )}
 
          {/* Question text + type */}
          <div style={{ display: "flex", flexDirection: "column", gap: 16, marginBottom: 20 }}>
            <div>
              <label style={{ display: "block", fontSize: 12, fontWeight: 600, color: "var(--muted)", marginBottom: 6 }}>
                Question Text
              </label>
              <input
                type="text"
                value={currentQuestion.question}
                onChange={(e) => updateCurrent({ question: e.target.value })}
                placeholder="What did you think about the taste?"
                className="input-field"
                style={{ fontSize: 14 }}
              />
            </div>
            <div>
              <label style={{ display: "block", fontSize: 12, fontWeight: 600, color: "var(--muted)", marginBottom: 6 }}>
                Question Type
              </label>
              <select
                value={currentQuestion.type}
                onChange={(e) => {
                  const type = e.target.value;
                  updateCurrent({
                    type,
                    options: type.includes("choice") || type === "dropdown" ? ["Option 1", "Option 2"] : currentQuestion.options,
                    maxStars: type === "rating_stars" ? 5 : currentQuestion.maxStars,
                    min: type === "slider" || type === "nps" ? 0 : currentQuestion.min,
                    max: type === "nps" ? 10 : type === "slider" ? 100 : currentQuestion.max,
                    rows: type === "matrix" ? ["Row 1", "Row 2"] : currentQuestion.rows,
                    columns: type === "matrix" ? ["Col 1", "Col 2"] : currentQuestion.columns,
                  });
                }}
                className="input-field"
                style={{ fontSize: 14 }}
              >
                {QUESTION_TYPES.map((t) => (
                  <option key={t.id} value={t.id}>{t.label}</option>
                ))}
              </select>
            </div>
          </div>
 
          {/* Type-specific config */}
          <AnimatePresence mode="wait">
            <motion.div
              key={currentQuestion.type}
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              style={{ background: "var(--bg-subtle)", padding: 20, borderRadius: 12, border: "1px solid var(--border)", marginBottom: 20 }}
            >
              <div style={{ fontSize: 12, fontWeight: 700, color: "var(--primary)", marginBottom: 16, textTransform: "uppercase", letterSpacing: 0.5 }}>
                {currentQuestion.type.replace("_", " ").toUpperCase()} Settings
              </div>
 
              {/* Star count */}
              {currentQuestion.type === "rating_stars" && (
                <div style={{ display: "flex", gap: 12, alignItems: "center" }}>
                  <span style={{ fontSize: 13, minWidth: 80 }}>Max Stars:</span>
                  {[3, 5, 10].map((num) => (
                    <button
                      key={num}
                      onClick={() => updateCurrent({ maxStars: num })}
                      style={{
                        padding: "8px 16px", borderRadius: 8, fontWeight: 600,
                        border: `1px solid ${currentQuestion.maxStars === num ? "var(--primary)" : "var(--border)"}`,
                        background: currentQuestion.maxStars === num ? "var(--primary)" : "transparent",
                        color: currentQuestion.maxStars === num ? "white" : "var(--text)",
                      }}
                    >{num}</button>
                  ))}
                </div>
              )}
 
              {/* Choice options */}
              {(currentQuestion.type === "single_choice" || currentQuestion.type === "multi_choice" || currentQuestion.type === "dropdown") && (
                <div>
                  <div style={{ fontSize: 12, fontWeight: 600, color: "var(--muted)", marginBottom: 12 }}>
                    Options ({currentQuestion.options.length})
                  </div>
                  {currentQuestion.options.map((opt, idx) => (
                    <div key={idx} style={{ display: "flex", gap: 8, marginBottom: 8, alignItems: "center" }}>
                      <input
                        type="text" value={opt}
                        onChange={(e) => {
                          const newOpts = [...currentQuestion.options];
                          newOpts[idx] = e.target.value;
                          updateCurrent({ options: newOpts });
                        }}
                        className="input-field" style={{ flex: 1 }}
                        placeholder={`Option ${idx + 1}`}
                      />
                      <button
                        onClick={() => updateCurrent({ options: currentQuestion.options.filter((_, i) => i !== idx) })}
                        style={{ padding: 8, borderRadius: 6, background: "var(--danger)", color: "white", border: "none" }}
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>
                  ))}
                  <button
                    onClick={() => updateCurrent({ options: [...currentQuestion.options, `Option ${currentQuestion.options.length + 1}`] })}
                    style={{ width: "100%", padding: 10, borderRadius: 8, background: "var(--success-glow)", color: "var(--success)", border: "1px solid var(--success)", fontWeight: 600 }}
                  >
                    + Add Option
                  </button>
                </div>
              )}
 
              {/* Slider config */}
              {currentQuestion.type === "slider" && (
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 16 }}>
                  {["min", "max", "step"].map((field) => (
                    <div key={field}>
                      <label style={{ fontSize: 11, color: "var(--muted)", display: "block", marginBottom: 4 }}>
                        {field.toUpperCase()}
                      </label>
                      <input
                        type="number" value={currentQuestion[field]}
                        onChange={(e) => updateCurrent({ [field]: parseInt(e.target.value) || 0 })}
                        className="input-field"
                      />
                    </div>
                  ))}
                </div>
              )}
 
              {/* Matrix config */}
              {currentQuestion.type === "matrix" && (
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 20 }}>
                  {[{ key: "rows", label: "Rows", btnLabel: "Row" }, { key: "columns", label: "Columns", btnLabel: "Col" }].map(({ key, label, btnLabel }) => (
                    <div key={key}>
                      <div style={{ fontSize: 12, fontWeight: 600, marginBottom: 12 }}>{label}</div>
                      {currentQuestion[key].map((item, idx) => (
                        <input
                          key={idx} type="text" value={item}
                          onChange={(e) => {
                            const updated = [...currentQuestion[key]];
                            updated[idx] = e.target.value;
                            updateCurrent({ [key]: updated });
                          }}
                          className="input-field" style={{ marginBottom: 8 }}
                        />
                      ))}
                      <button
                        onClick={() => updateCurrent({ [key]: [...currentQuestion[key], `${btnLabel} ${currentQuestion[key].length + 1}`] })}
                        style={{ fontSize: 12, color: "var(--primary)" }}
                      >
                        + {btnLabel}
                      </button>
                    </div>
                  ))}
                </div>
              )}
 
              {/* Simple types */}
              {SIMPLE_TYPES.includes(currentQuestion.type) && (
                <div style={{ padding: 16, textAlign: "center", color: "var(--muted)", fontSize: 13 }}>
                  ✅ Standard configuration — ready to use
                </div>
              )}
            </motion.div>
          </AnimatePresence>
 
          {/* Submit button */}
          <button
            onClick={handleAddOrUpdate}
            disabled={!currentQuestion.question.trim()}
            style={{
              width: "100%", padding: "12px 16px", borderRadius: 10, fontWeight: 600, fontSize: 14,
              color: "#fff", border: "none", cursor: !currentQuestion.question.trim() ? "not-allowed" : "pointer",
              background: !currentQuestion.question.trim() ? "var(--border)" : "linear-gradient(135deg, var(--primary), #2563eb)",
              boxShadow: !currentQuestion.question.trim() ? "none" : "0 6px 18px var(--primary-glow)",
              display: "flex", alignItems: "center", justifyContent: "center", gap: 8,
              transition: "all 0.25s ease",
            }}
            onMouseEnter={(e) => {
              if (!currentQuestion.question.trim()) return;
              e.currentTarget.style.transform = "translateY(-2px)";
              e.currentTarget.style.boxShadow = "0 8px 24px var(--primary-glow)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = "translateY(0)";
              e.currentTarget.style.boxShadow = !currentQuestion.question.trim() ? "none" : "0 6px 18px var(--primary-glow)";
            }}
          >
            {isEditing ? <Save size={18} /> : <Plus size={18} />}
            {isEditing ? "Update Question" : "Add to Review Form"}
          </button>
        </Card>
      </div>
    </div>
  );
}
 
