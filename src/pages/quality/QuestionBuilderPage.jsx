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
  CheckCircle,
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
    <div className="flex gap-2 items-center">
      {[...Array(maxStars)].map((_, i) => (
        <button
          key={i}
          onClick={() => onChange(i + 1)}
          className={`text-2xl transition-all ${value >= i + 1 ? "text-amber-500 scale-110" : "text-[var(--border)] dark:text-[var(--muted)]/40 scale-100"}`}
        >★</button>
      ))}
      {value && (
        <span className="ml-3 font-black text-[var(--primary)] dark:text-[var(--primary)] text-sm">
          {value}/{maxStars}
        </span>
      )}
    </div>
  ),

  nps: ({ value, onChange }) => (
    <div>
      <div className="flex gap-1.5 flex-wrap">
        {[...Array(11)].map((_, i) => (
          <button
            key={i}
            onClick={() => onChange(i)}
            className={`w-9 h-9 rounded-xl font-bold text-xs transition-all border ${
              value === i 
                ? "bg-[var(--primary)] text-white border-[var(--primary)] shadow-lg shadow-[var(--primary)]/30" 
                : "bg-[var(--bg)] text-[var(--text)] border-[var(--border)] hover:border-[var(--primary)]/30"
            }`}
          >{i}</button>
        ))}
      </div>
      <div className="flex justify-between mt-3 text-[10px] text-[var(--muted)] font-bold uppercase tracking-widest opacity-60">
        <span>Not likely at all</span>
        <span>Extremely likely</span>
      </div>
    </div>
  ),

  slider: ({ value, onChange, min = 0, max = 100, step = 1 }) => (
    <div className="py-2">
      <input
        type="range" min={min} max={max} step={step} value={value ?? (max - min) / 2}
        onChange={(e) => onChange(Number(e.target.value))}
        className="w-full accent-[var(--primary)] cursor-pointer h-1.5 rounded-full bg-[var(--border)]"
      />
      <div className="flex justify-between mt-4 text-[11px] font-bold items-center">
        <span className="text-[var(--muted)] uppercase tracking-widest leading-none">{min}</span>
        <span className="px-3 py-1 bg-[var(--primary-glow)] text-[var(--primary)] rounded-lg shadow-sm border border-[var(--primary)]/10">
          {value ?? "--"}
        </span>
        <span className="text-[var(--muted)] uppercase tracking-widest leading-none">{max}</span>
      </div>
    </div>
  ),

  single_choice: ({ value, onChange, options = [] }) => (
    <div className="flex flex-col gap-3">
      {options.map((opt) => (
        <label
          key={opt}
          className={`flex items-center gap-4 cursor-pointer px-5 py-4 rounded-[20px] border transition-all ${
            value === opt 
              ? "bg-[var(--primary-glow)] border-[var(--primary)] shadow-md dark:shadow-none dark:bg-[var(--primary)]/10" 
              : "bg-[var(--bg)] border-[var(--border)] hover:border-[var(--primary)]/30 dark:bg-[var(--surface)]"
          }`}
        >
          <input type="radio" checked={value === opt} onChange={() => onChange(opt)}
            className="w-5 h-5 accent-[var(--primary)]" />
          <span className={`text-sm ${value === opt ? "font-bold text-[var(--primary)]" : "font-semibold text-[var(--text)]"}`}>{opt}</span>
        </label>
      ))}
    </div>
  ),

  multi_choice: ({ value = [], onChange, options = [] }) => (
    <div className="flex flex-col gap-3">
      {options.map((opt) => {
        const isChecked = value.includes(opt);
        return (
          <label
            key={opt}
            className={`flex items-center gap-4 cursor-pointer px-5 py-4 rounded-[20px] border transition-all ${
              isChecked 
                ? "bg-[var(--primary-glow)] border-[var(--primary)] shadow-md dark:shadow-none dark:bg-[var(--primary)]/10" 
                : "bg-[var(--bg)] border-[var(--border)] hover:border-[var(--primary)]/30 dark:bg-[var(--surface)]"
            }`}
          >
            <input
              type="checkbox" checked={isChecked}
              onChange={() => onChange(isChecked ? value.filter((v) => v !== opt) : [...value, opt])}
              className="w-5 h-5 accent-[var(--primary)]"
            />
            <span className={`text-sm ${isChecked ? "font-bold text-[var(--primary)]" : "font-semibold text-[var(--text)]"}`}>{opt}</span>
          </label>
        );
      })}
    </div>
  ),

  dropdown: ({ value, onChange, options = [] }) => (
    <div className="relative">
      <select 
        value={value || ""} 
        onChange={(e) => onChange(e.target.value)} 
        className="w-full px-5 py-4 rounded-[18px] bg-[var(--bg)] border border-[var(--border)] text-sm font-bold text-[var(--text)] appearance-none outline-none focus:border-[var(--primary)] shadow-sm"
      >
        <option value="" disabled>Select inquiry response...</option>
        {options.map((opt) => <option key={opt} value={opt}>{opt}</option>)}
      </select>
      <div className="absolute right-5 top-1/2 -translate-y-1/2 pointer-events-none opacity-40">
        <ChevronDown size={18} strokeWidth={3} />
      </div>
    </div>
  ),

  short_text: ({ value, onChange, placeholder = "Enter synthesis text..." }) => (
    <input 
      type="text" value={value || ""} onChange={(e) => onChange(e.target.value)}
      className="w-full px-5 py-4 rounded-[18px] bg-[var(--bg)] border border-[var(--border)] text-sm font-bold text-[var(--text)] outline-none focus:border-[var(--primary)] shadow-sm placeholder:opacity-40" 
      placeholder={placeholder} 
    />
  ),

  long_text: ({ value, onChange, placeholder = "Input comprehensive analysis..." }) => (
    <textarea 
      value={value || ""} onChange={(e) => onChange(e.target.value)}
      className="w-full px-5 py-4 rounded-[18px] bg-[var(--bg)] border border-[var(--border)] text-sm font-bold text-[var(--text)] outline-none focus:border-[var(--primary)] shadow-sm placeholder:opacity-40 min-h-[140px] resize-none" 
      placeholder={placeholder} 
    />
  ),

  yes_no: ({ value, onChange }) => (
    <div className="flex gap-4">
      {["Yes", "No"].map((opt) => (
        <button
          key={opt}
          onClick={() => onChange(opt)}
          className={`flex-1 py-5 rounded-[24px] font-bold uppercase tracking-widest text-xs flex items-center justify-center gap-3 border transition-all ${
            value === opt 
              ? (opt === "Yes" ? "bg-emerald-500 text-white border-emerald-500 shadow-lg shadow-emerald-500/30" : "bg-rose-500 text-white border-rose-500 shadow-lg shadow-rose-500/30") 
              : "bg-[var(--bg)] text-[var(--muted)] border-[var(--border)] hover:border-[var(--primary)]/30"
          }`}
        >
          {opt === "Yes" ? <ThumbsUp size={16} strokeWidth={3} /> : <XCircle size={16} strokeWidth={3} />}
          {opt}
        </button>
      ))}
    </div>
  ),

  emoji_reaction: ({ value, onChange }) => (
    <div className="flex justify-between px-4 sm:px-10">
      {["😠", "😟", "😐", "🙂", "😍"].map((emoji, i) => (
        <button
          key={i}
          onClick={() => onChange(emoji)}
          className={`text-4xl transition-all duration-500 filter hover:scale-125 ${
            value === emoji ? "grayscale-0 scale-125 drop-shadow-lg" : "grayscale opacity-30 scale-90"
          }`}
        >{emoji}</button>
      ))}
    </div>
  ),

  date: ({ value, onChange }) => (
    <div className="relative">
      <input 
        type="date" value={value || ""} onChange={(e) => onChange(e.target.value)}
        className="w-full px-5 py-4 rounded-[18px] bg-[var(--bg)] border border-[var(--border)] text-sm font-bold text-[var(--text)] outline-none focus:border-[var(--primary)] shadow-sm" 
      />
      <div className="absolute right-5 top-1/2 -translate-y-1/2 pointer-events-none opacity-40">
        <Calendar size={18} strokeWidth={3} />
      </div>
    </div>
  ),

  number: ({ value, onChange, min, max }) => (
    <div className="relative">
      <input 
        type="number" min={min} max={max} value={value || ""} onChange={(e) => onChange(e.target.value)}
        className="w-full px-5 py-4 rounded-[18px] bg-[var(--bg)] border border-[var(--border)] text-sm font-bold text-[var(--text)] outline-none focus:border-[var(--primary)] shadow-sm" 
        placeholder="Integer magnitude..." 
      />
      <div className="absolute right-5 top-1/2 -translate-y-1/2 pointer-events-none opacity-40">
        <Hash size={18} strokeWidth={3} />
      </div>
    </div>
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
      <div className="flex flex-col gap-2">
        {(value.length > 0 ? value : options).map((opt, i) => (
          <div key={opt} className="flex items-center gap-4 px-5 py-3.5 bg-[var(--bg)] dark:bg-[var(--bg)]/40 border border-[var(--border)] shadow-sm rounded-xl">
            <span className="text-[10px] font-bold text-[var(--primary)] bg-[var(--primary-glow)] dark:bg-[var(--primary)]/10 w-6 h-6 rounded-lg flex items-center justify-center border border-[var(--primary)]/10">
              {i + 1}
            </span>
            <span className="flex-1 text-sm font-bold text-[var(--text)]">{opt}</span>
            <div className="flex gap-1">
              <button 
                onClick={() => handleMove(i, "up")} 
                disabled={i === 0} 
                className={`p-1.5 rounded-lg border transition-all ${i === 0 ? "opacity-20 bg-transparent text-[var(--muted)] border-transparent" : "bg-[var(--surface)] text-[var(--text)] border-[var(--border)] hover:text-[var(--primary)] hover:border-[var(--primary)]/30"}`}
              >
                <ChevronUp size={14} strokeWidth={3} />
              </button>
              <button 
                onClick={() => handleMove(i, "down")} 
                disabled={i === (value.length || options.length) - 1} 
                className={`p-1.5 rounded-lg border transition-all ${i === (value.length || options.length) - 1 ? "opacity-20 bg-transparent text-[var(--muted)] border-transparent" : "bg-[var(--surface)] text-[var(--text)] border-[var(--border)] hover:text-[var(--primary)] hover:border-[var(--primary)]/30"}`}
              >
                <ChevronDown size={14} strokeWidth={3} />
              </button>
            </div>
          </div>
        ))}
      </div>
    );
  },

  matrix: ({ value = {}, onChange, rows = [], columns = [] }) => (
    <div className="overflow-x-auto -mx-8 px-8 pb-4">
      <table className="w-full border-separate border-spacing-y-2">
        <thead>
          <tr>
            <th className="text-left py-3 px-4 text-[9px] font-bold text-[var(--muted)] uppercase tracking-widest leading-none">Inquiry Node</th>
            {columns.map((col) => (
              <th key={col} className="text-center py-3 px-2 text-[9px] font-bold text-[var(--muted)] uppercase tracking-widest leading-none min-w-[60px]">{col}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((row) => (
            <tr key={row} className="bg-[var(--bg)]/50 rounded-2xl border border-[var(--border)] shadow-sm">
              <td className="py-4 px-5 text-xs font-bold text-[var(--text)] rounded-l-2xl border-y border-l border-[var(--border)]">{row}</td>
              {columns.map((col, colIdx) => (
                <td key={col} className={`text-center py-4 px-2 border-y border-[var(--border)] ${colIdx === columns.length - 1 ? "rounded-r-2xl border-r" : ""}`}>
                  <input 
                    type="radio" 
                    checked={value[row] === col} 
                    onChange={() => onChange({ ...value, [row]: col })}
                    className="w-5 h-5 accent-[var(--primary)] cursor-pointer" 
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
    <div className="grid grid-cols-2 sm:grid-cols-3 gap-6">
      {options.map((opt, i) => (
        <div
          key={i}
          onClick={() => onChange(opt)}
          className={`cursor-pointer rounded-3xl overflow-hidden transition-all duration-300 border-4 group hover:shadow-2xl ${
            value === opt ? "border-[var(--primary)] shadow-xl dark:shadow-none scale-105" : "border-[var(--border)] grayscale opacity-60 hover:opacity-100 hover:grayscale-0 dark:bg-[var(--surface)]"
          }`}
        >
          <div className="aspect-square bg-[var(--surface)] flex items-center justify-center relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
            <ImageIcon size={32} className="text-[var(--text)] opacity-10 group-hover:opacity-30 group-hover:scale-110 transition-all duration-500" />
            {value === opt && (
               <div className="absolute top-3 right-3 w-6 h-6 bg-[var(--primary)] text-white rounded-full flex items-center justify-center shadow-lg border-2 border-white animate-in zoom-in-0 duration-300">
                  <CheckCircle size={14} strokeWidth={3} />
               </div>
            )}
          </div>
          <div className={`py-4 px-3 text-[10px] font-bold uppercase tracking-widest text-center bg-[var(--bg)] ${value === opt ? "text-[var(--primary)]" : "text-[var(--muted)]"}`}>
            {opt}
          </div>
        </div>
      ))}
    </div>
  ),

  linear_scale: ({ value, onChange, min = 1, max = 5 }) => (
    <div className="flex justify-center gap-2 sm:gap-4 py-4">
      {[...Array(max - min + 1)].map((_, i) => {
        const val = min + i;
        return (
          <button
            key={val}
            onClick={() => onChange(val)}
            className={`w-12 h-12 sm:w-16 sm:h-16 rounded-[20px] font-bold text-lg transition-all border ${
              value === val 
                ? "bg-[var(--primary)] text-white border-[var(--primary)] shadow-xl shadow-[var(--primary)]/30 scale-110" 
                : "bg-[var(--bg)] text-[var(--muted)] border-[var(--border)] hover:border-[var(--primary)]/30"
            }`}
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
    <div className="animate-fade-in pb-10">
      <PageHeader
        title="🔧 Question Builder"
        subtitle="Build dynamic questions for Quality Review (Manager only)"
        actions={[
          <button
            key="export"
            onClick={exportJson}
            className="flex items-center gap-2 px-5 py-2.5 bg-[var(--primary)] text-white rounded-2xl font-bold uppercase tracking-widest text-[11px] shadow-lg shadow-[var(--primary)]/30 hover:scale-105 transition-all"
          >
            <Download size={16} strokeWidth={3} />
            <span className="hidden sm:inline">Export JSON</span>
          </button>,
        ]}
      />

      <div className="flex flex-col lg:grid lg:grid-cols-[1fr,400px] gap-8">

        {/* ── Left: Question List ── */}
        <div className="space-y-6 order-2 lg:order-1">
          <Card noPad className="overflow-hidden border-[var(--border)] shadow-2xl shadow-black/5 dark:shadow-none rounded-[32px] bg-gradient-to-b from-[var(--surface)] to-[var(--bg)] dark:from-[var(--surface)] dark:to-[var(--surface)]">
            <div className="px-8 py-6 border-b border-[var(--border)]/50 bg-[var(--bg)]/50 dark:bg-[var(--surface)]/50 backdrop-blur-md flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-2 h-7 bg-[var(--primary)] rounded-full" />
                <h3 className="text-sm font-bold text-[var(--text)] uppercase tracking-wider">
                  Question List ({questions.length})
                </h3>
              </div>
            </div>

            {questions.length === 0 ? (
              <div className="py-24 px-10 text-center max-w-md mx-auto">
                <div className="w-20 h-20 bg-[var(--surface)] rounded-[32px] flex items-center justify-center mx-auto mb-8 shadow-inner opacity-40">
                  <Type size={40} className="text-[var(--text)]" />
                </div>
                <h4 className="text-lg font-bold text-[var(--text)] tracking-tight mb-2">No Questions Found</h4>
                <p className="text-sm font-bold text-[var(--muted)] opacity-60">Start by adding a new question using the editor.</p>
              </div>
            ) : (
              <div className="divide-y divide-[var(--border)]/30">
                {questions.map((q, idx) => {
                  const Comp = QuestionComponents[q.type];
                  return (
                    <motion.div
                      layout
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      key={q.id}
                      className="p-8 hover:bg-[var(--primary-glow)]/30 dark:hover:bg-[var(--primary-glow)]/10 transition-all duration-500 group"
                    >
                      <div className="flex flex-col sm:flex-row sm:items-start gap-6">
                        <div className="flex items-start gap-5 flex-1">
                          <div className="pt-1 text-[var(--muted)] opacity-30 group-hover:opacity-100 transition-opacity">
                            <GripVertical size={18} />
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="text-lg font-bold text-[var(--text)] tracking-tight leading-tight mb-3">
                              {q.question}
                            </div>
                            <div className="flex items-center gap-2">
                              <span className="text-[10px] font-bold px-3 py-1 bg-[var(--bg)] text-[var(--primary)] border border-[var(--primary)]/20 rounded-lg uppercase tracking-widest shadow-sm">
                                {q.type.replace("_", " ")}
                              </span>
                            </div>
                          </div>
                        </div>

                        <div className="flex sm:flex-col gap-3 self-end sm:self-start">
                          <div className="flex gap-1 bg-[var(--bg)] p-1 rounded-xl border border-[var(--border)] shadow-sm">
                            <button
                              onClick={() => moveQuestion(idx, "up")}
                              disabled={idx === 0}
                              className={`p-2 rounded-lg transition-all ${idx === 0 ? "opacity-20 cursor-not-allowed" : "hover:bg-[var(--surface-hover)] hover:text-[var(--primary)]"}`}
                            >
                              <ChevronUp size={14} strokeWidth={3} />
                            </button>
                            <button
                              onClick={() => moveQuestion(idx, "down")}
                              disabled={idx === questions.length - 1}
                              className={`p-2 rounded-lg transition-all ${idx === questions.length - 1 ? "opacity-20 cursor-not-allowed" : "hover:bg-[var(--surface-hover)] hover:text-[var(--primary)]"}`}
                            >
                              <ChevronDown size={14} strokeWidth={3} />
                            </button>
                          </div>
                          <div className="flex gap-2">
                            <button 
                              onClick={() => handleEdit(q)} 
                              className="w-10 h-10 rounded-xl bg-[var(--surface)] border border-[var(--border)] flex items-center justify-center text-[var(--muted)] hover:text-[var(--primary)] hover:border-[var(--primary)]/30 transition-all shadow-sm"
                            >
                              <Edit3 size={16} />
                            </button>
                            <button 
                              onClick={() => handleDelete(q.id)} 
                              className="w-10 h-10 rounded-xl bg-rose-500/5 text-rose-500 border border-rose-500/10 flex items-center justify-center hover:bg-rose-500 hover:text-white transition-all shadow-sm"
                            >
                              <Trash2 size={16} />
                            </button>
                          </div>
                        </div>
                      </div>

                      {/* Live preview */}
                      <div className="mt-8 p-8 bg-[var(--bg)] dark:bg-[var(--bg)]/40 rounded-[32px] border border-[var(--border)]/50 shadow-inner opacity-80 pointer-events-none group-hover:opacity-100 transition-all dark:opacity-60 dark:group-hover:opacity-100">
                        {Comp ? (
                          <Comp {...q} value={null} onChange={() => {}} />
                        ) : (
                          <div className="text-[10px] font-bold uppercase tracking-widest text-[var(--muted)] text-center py-4">Preview Not Available</div>
                        )}
                      </div>
                    </motion.div>
                  );
                })}
              </div>
            )}
          </Card>
        </div>

        {/* ── Right: Question Editor ── */}
        <div className="order-1 lg:order-2">
          <Card className="sticky top-24 border-[var(--border)] shadow-2xl shadow-black/5 dark:shadow-none rounded-[40px] bg-gradient-to-b from-[var(--surface)] to-[var(--bg)] dark:from-[var(--surface)] dark:to-[var(--surface)] p-8">
            <div className="flex items-center justify-between mb-10">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-2xl bg-[var(--primary-glow)] flex items-center justify-center text-[var(--primary)] shadow-inner">
                  <Edit3 size={24} strokeWidth={2.5} />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-[var(--text)] tracking-tight leading-none mb-1">Question Editor</h3>
                  <p className="text-[10px] font-bold uppercase tracking-widest text-[var(--muted)] opacity-50">Edit Question Details</p>
                </div>
              </div>
              <button
                onClick={() => setShowJson(!showJson)}
                className={`p-3 rounded-2xl transition-all duration-300 ${
                  showJson ? "bg-[var(--primary)] text-white shadow-lg shadow-[var(--primary)]/30" : "bg-[var(--bg)] text-[var(--muted)] border border-[var(--border)] hover:text-[var(--primary)]"
                }`}
              >
                <FileJson size={20} />
              </button>
            </div>

            <AnimatePresence>
              {showJson && (
                <motion.pre
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                  className="bg-[#1e1e1e] dark:bg-[#0a0a0a] text-[#b5cea8] p-6 rounded-[24px] text-[10px] overflow-x-auto mb-8 font-mono border border-black/50 shadow-2xl"
                >
                  {JSON.stringify({ questions }, null, 2)}
                </motion.pre>
              )}
            </AnimatePresence>

            <div className="space-y-8 mb-10">
              <div>
                <label className="text-[10px] font-bold uppercase tracking-[0.2em] text-[var(--muted)] mb-3 block px-2">
                  Question Statement
                </label>
                <textarea
                  value={currentQuestion.question}
                  onChange={(e) => updateCurrent({ question: e.target.value })}
                  placeholder="What would you like to ask?"
                  className="w-full px-6 py-5 rounded-[24px] bg-[var(--bg)] border border-[var(--border)] text-sm font-bold text-[var(--text)] focus:ring-8 focus:ring-[var(--primary)]/5 focus:border-[var(--primary)] outline-none transition-all placeholder:opacity-30 min-h-[100px] resize-none shadow-inner"
                />
              </div>

              <div>
                <label className="text-[10px] font-bold uppercase tracking-[0.2em] text-[var(--muted)] mb-3 block px-2">
                  Question Type
                </label>
                <div className="relative">
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
                    className="w-full px-6 py-5 pr-12 rounded-[24px] bg-[var(--bg)] border border-[var(--border)] text-sm font-bold text-[var(--text)] focus:ring-8 focus:ring-[var(--primary)]/5 focus:border-[var(--primary)] outline-none transition-all appearance-none shadow-sm cursor-pointer"
                  >
                    {QUESTION_TYPES.map((t) => (
                      <option key={t.id} value={t.id}>{t.label}</option>
                    ))}
                  </select>
                  <ChevronDown className="absolute right-6 top-1/2 -translate-y-1/2 text-[var(--muted)] pointer-events-none" size={18} strokeWidth={3} />
                </div>
              </div>
            </div>

            <AnimatePresence mode="wait">
              <motion.div
                key={currentQuestion.type}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="bg-[var(--bg)]/50 dark:bg-[var(--bg)]/30 rounded-[32px] border border-[var(--border)] p-8 mb-8 relative overflow-hidden group/conf"
              >
                <div className="absolute top-0 right-0 w-32 h-32 bg-[var(--primary)]/5 rounded-full -mr-16 -mt-16 blur-3xl group-hover/conf:scale-150 transition-transform duration-700" />
                
                <div className="text-[10px] font-bold text-[var(--primary)] uppercase tracking-[0.3em] mb-8 flex items-center gap-3">
                  <div className="w-1.5 h-1.5 rounded-full bg-[var(--primary)] animate-pulse" />
                  Options
                </div>

                {/* Star count */}
                {currentQuestion.type === "rating_stars" && (
                  <div className="flex flex-col gap-4">
                    <span className="text-xs font-bold text-[var(--muted)] uppercase tracking-widest opacity-60 px-2">Number of Stars</span>
                    <div className="flex gap-3">
                      {[3, 5, 10].map((num) => (
                        <button
                          key={num}
                          onClick={() => updateCurrent({ maxStars: num })}
                          className={`flex-1 py-4 rounded-2xl font-bold transition-all ${
                            currentQuestion.maxStars === num 
                              ? "bg-[var(--primary)] text-white shadow-lg shadow-[var(--primary)]/30 scale-105" 
                              : "bg-[var(--bg)] text-[var(--muted)] border border-[var(--border)] hover:border-[var(--primary)]/30"
                          }`}
                        >{num}</button>
                      ))}
                    </div>
                  </div>
                )}

                {/* Choice options */}
                {(currentQuestion.type === "single_choice" || currentQuestion.type === "multi_choice" || currentQuestion.type === "dropdown") && (
                  <div className="space-y-4">
                    <div className="flex items-center justify-between mb-2">
                       <span className="text-xs font-bold text-[var(--muted)] uppercase tracking-widest opacity-60 px-2">Choices</span>
                       <button
                         onClick={() => updateCurrent({ options: [...currentQuestion.options, "New Option"] })}
                         className="w-10 h-10 rounded-full bg-[var(--primary-glow)] text-[var(--primary)] flex items-center justify-center hover:scale-110 transition-transform shadow-sm"
                       >
                         <Plus size={18} strokeWidth={3} />
                       </button>
                    </div>
                    {currentQuestion.options.map((opt, idx) => (
                      <motion.div initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} key={idx} className="flex gap-3 items-center">
                        <input
                          type="text" value={opt}
                          onChange={(e) => {
                            const newOpts = [...currentQuestion.options];
                            newOpts[idx] = e.target.value;
                            updateCurrent({ options: newOpts });
                          }}
                          className="flex-1 px-5 py-4 rounded-[18px] bg-[var(--bg)] border border-[var(--border)] text-sm font-bold text-[var(--text)] focus:border-[var(--primary)] outline-none shadow-sm"
                          placeholder="Option text..."
                        />
                        <button
                          onClick={() => updateCurrent({ options: currentQuestion.options.filter((_, i) => i !== idx) })}
                          className="w-10 h-10 rounded-xl bg-rose-500/5 text-rose-500 flex items-center justify-center hover:bg-rose-500 hover:text-white transition-all shadow-sm"
                        >
                          <Trash2 size={16} />
                        </button>
                      </motion.div>
                    ))}
                  </div>
                )}

                {/* Slider config */}
                {currentQuestion.type === "slider" && (
                  <div className="grid grid-cols-3 gap-6">
                    {["min", "max", "step"].map((field) => (
                      <div key={field}>
                        <label className="text-[9px] font-bold text-[var(--muted)] uppercase tracking-widest mb-2 block px-1 truncate">
                          {field}
                        </label>
                        <input
                          type="number" value={currentQuestion[field]}
                          onChange={(e) => updateCurrent({ [field]: parseInt(e.target.value) || 0 })}
                          className="w-full px-4 py-3 rounded-xl bg-[var(--bg)] border border-[var(--border)] text-sm font-bold text-[var(--text)] outline-none focus:border-[var(--primary)]"
                        />
                      </div>
                    ))}
                  </div>
                )}

                {/* Matrix config */}
                {currentQuestion.type === "matrix" && (
                  <div className="grid grid-cols-2 gap-8">
                    {[{ key: "rows", label: "Rows", btnLabel: "Row" }, { key: "columns", label: "Columns", btnLabel: "Col" }].map(({ key, label, btnLabel }) => (
                      <div key={key} className="space-y-3">
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-[10px] font-bold uppercase text-[var(--muted)] opacity-60">{label}</span>
                          <button
                            onClick={() => updateCurrent({ [key]: [...currentQuestion[key], `${btnLabel} ${currentQuestion[key].length + 1}`] })}
                            className="text-[var(--primary)] hover:scale-110 transition-transform"
                          >
                            <Plus size={14} strokeWidth={3} />
                          </button>
                        </div>
                        {currentQuestion[key].map((item, idx) => (
                          <input
                            key={idx} type="text" value={item}
                            onChange={(e) => {
                              const updated = [...currentQuestion[key]];
                              updated[idx] = e.target.value;
                              updateCurrent({ [key]: updated });
                            }}
                            className="w-full px-4 py-3 rounded-xl bg-[var(--bg)] border border-[var(--border)] text-xs font-bold text-[var(--text)] outline-none focus:border-[var(--primary)]"
                          />
                        ))}
                      </div>
                    ))}
                  </div>
                )}

                {/* Simple types */}
                {SIMPLE_TYPES.includes(currentQuestion.type) && (
                  <div className="py-8 text-center px-4">
                     <div className="w-12 h-12 bg-emerald-500/10 text-emerald-500 rounded-full flex items-center justify-center mx-auto mb-4">
                       <CheckCircle size={24} strokeWidth={3} />
                     </div>
                     <p className="text-[10px] font-bold text-emerald-500 uppercase tracking-widest">No Additional Options</p>
                     <p className="text-[9px] font-bold text-[var(--muted)] mt-1 opacity-60 whitespace-pre-wrap">This question type does not require further configuration.</p>
                  </div>
                )}
              </motion.div>
            </AnimatePresence>

            <button
              onClick={handleAddOrUpdate}
              disabled={!currentQuestion.question.trim()}
              className={`w-full group relative overflow-hidden py-6 rounded-[32px] font-bold uppercase tracking-[0.3em] text-xs transition-all duration-700 ${
                !currentQuestion.question.trim()
                  ? "bg-[var(--border)] text-[var(--muted)] cursor-not-allowed"
                  : "bg-[var(--primary)] text-white shadow-2xl shadow-[var(--primary)]/40 hover:scale-[1.02] hover:-translate-y-1 active:scale-[0.98]"
              }`}
            >
              <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/10 to-white/0 -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />
              <span className="relative z-10 flex items-center justify-center gap-4">
                {isEditing ? <Save size={18} strokeWidth={3} /> : <Zap size={18} fill="currentColor" className="animate-pulse" />}
                {isEditing ? "Encrypt Protocol Update" : "Inject Inquiry Vector"}
              </span>
            </button>
          </Card>
        </div>
      </div>
    </div>
  );
}
