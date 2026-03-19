import { useState } from "react";
import {
  CheckCircle,
  Clock,
  Search,
  Calendar,
  ChevronDown,
  Activity,
  Eye,
  Utensils,
  Wind,
  Zap,
  Droplets,
  Smile,
  Star,
  ThumbsUp,
  ThumbsDown,
  MessageSquare,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import Card from "../../components/ui/Card";
import PageHeader from "../../components/ui/PageHeader";
import StatusBadge from "../../components/ui/StatusBadge";
import { experiments } from "../../data/dummy";

// Static questions that are always part of every review
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

// Mock review answers for completed experiments
const MOCK_REVIEW_DATA = {
  "EXP-001": {
    sensoryScores: {
      taste: 9,
      aroma: 8,
      saltiness: 7,
      visual: 9,
      consistency: 8,
      spiciness: 6,
      oiliness: 5,
      freshness: 9,
      aftertaste: 8,
    },
    answers: {
      static_overall:
        "Excellent dish with rich, creamy texture and perfectly balanced spices. The butter chicken had a great depth of flavor.",
      static_satisfaction: 5,
      static_understanding: "yes",
      static_expectations: "yes",
      static_quality: 4,
    },
    remarks:
      "One of the best batches yet. Slight improvement in consistency recommended.",
    reviewedBy: "Sunita Rao",
    reviewedDate: "2024-12-15",
  },
  "EXP-003": {
    sensoryScores: {
      taste: 4,
      aroma: 5,
      saltiness: 3,
      visual: 6,
      consistency: 4,
      spiciness: 7,
      oiliness: 6,
      freshness: 5,
      aftertaste: 3,
    },
    answers: {
      static_overall:
        "The dal was under-seasoned and lacked the characteristic smoky flavor. Needs more work.",
      static_satisfaction: 2,
      static_understanding: "yes",
      static_expectations: "no",
      static_quality: 2,
    },
    remarks: "Needs significant improvement in flavor profile and consistency.",
    reviewedBy: "Vikram Nair",
    reviewedDate: "2024-12-13",
  },
  "EXP-004": {
    sensoryScores: {
      taste: 9,
      aroma: 9,
      saltiness: 8,
      visual: 8,
      consistency: 9,
      spiciness: 8,
      oiliness: 6,
      freshness: 9,
      aftertaste: 9,
    },
    answers: {
      static_overall:
        "Outstanding biryani with perfect layering and aroma. The rice-to-meat ratio was ideal.",
      static_satisfaction: 5,
      static_understanding: "yes",
      static_expectations: "yes",
      static_quality: 5,
    },
    remarks: "Approved for production. Excellent quality.",
    reviewedBy: "Meena Joshi",
    reviewedDate: "2024-12-12",
  },
  "EXP-006": {
    sensoryScores: {
      taste: 8,
      aroma: 7,
      saltiness: 7,
      visual: 9,
      consistency: 8,
      spiciness: 5,
      oiliness: 4,
      freshness: 8,
      aftertaste: 7,
    },
    answers: {
      static_overall:
        "Good palak paneer with vibrant color and smooth texture. Could use slightly more seasoning.",
      static_satisfaction: 4,
      static_understanding: "yes",
      static_expectations: "yes",
      static_quality: 4,
    },
    remarks: "Approved with minor suggestions for seasoning.",
    reviewedBy: "Ravi Kumar",
    reviewedDate: "2024-12-10",
  },
  "EXP-007": {
    sensoryScores: {
      taste: 9,
      aroma: 8,
      saltiness: 7,
      visual: 8,
      consistency: 9,
      spiciness: 6,
      oiliness: 5,
      freshness: 9,
      aftertaste: 8,
    },
    answers: {
      static_overall:
        "Rich and creamy korma with excellent balance. The cashew paste gave a wonderful smoothness.",
      static_satisfaction: 5,
      static_understanding: "yes",
      static_expectations: "yes",
      static_quality: 5,
    },
    remarks: "Production ready. Outstanding batch.",
    reviewedBy: "Priya Shah",
    reviewedDate: "2024-12-09",
  },
  "EXP-008": {
    sensoryScores: {
      taste: 4,
      aroma: 3,
      saltiness: 5,
      visual: 5,
      consistency: 3,
      spiciness: 2,
      oiliness: 6,
      freshness: 4,
      aftertaste: 3,
    },
    answers: {
      static_overall:
        "Bland and overcooked. The cauliflower lost its texture and the potatoes were mushy.",
      static_satisfaction: 1,
      static_understanding: "yes",
      static_expectations: "no",
      static_quality: 2,
    },
    remarks: "Rejected. Needs complete rework of cooking method and timing.",
    reviewedBy: "Amit Patel",
    reviewedDate: "2024-12-08",
  },
};

const sensoryLabels = [
  { key: "taste", label: "Taste & Flavor", icon: Utensils, color: "#3b82f6" },
  { key: "aroma", label: "Aroma & Scent", icon: Wind, color: "#f59e0b" },
  { key: "saltiness", label: "Saltiness", icon: Zap, color: "#8b5cf6" },
  { key: "visual", label: "Visual Appeal", icon: Eye, color: "#10b981" },
  {
    key: "consistency",
    label: "Texture & Consistency",
    icon: Droplets,
    color: "#f97316",
  },
  { key: "spiciness", label: "Spiciness", icon: Activity, color: "#ef4444" },
  { key: "oiliness", label: "Oiliness", icon: Droplets, color: "#84cc16" },
  { key: "freshness", label: "Freshness", icon: Activity, color: "#06b6d4" },
  { key: "aftertaste", label: "Aftertaste", icon: Smile, color: "#d946ef" },
];

export default function ReviewsPage() {
  const [statusFilter, setStatusFilter] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [expandedId, setExpandedId] = useState(null);
  const role = localStorage.getItem("ck_role");
  const showAIScore = role === "Manager";
  const tableColumns = showAIScore
    ? "1fr 140px 110px 90px 100px 100px 50px"
    : "1fr 140px 110px 90px 100px 50px";

  const filteredExperiments = experiments.filter((exp) => {
    const matchesStatus =
      statusFilter === "all" ||
      (statusFilter === "pending" && exp.status === "Pending") ||
      (statusFilter === "completed" && exp.status === "Completed");
    const matchesSearch =
      exp.recipe.toLowerCase().includes(searchQuery.toLowerCase()) ||
      exp.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      exp.chef.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesStatus && matchesSearch;
  });

  const pendingCount = experiments.filter((e) => e.status === "Pending").length;
  const completedCount = experiments.filter(
    (e) => e.status === "Completed",
  ).length;

  const statusTabs = [
    { id: "all", label: "All Feedbacks", count: experiments.length },
    { id: "pending", label: "Pending", count: pendingCount },
    { id: "completed", label: "Completed", count: completedCount },
  ];

  const getScoreColor = (score) => {
    if (score >= 8) return "var(--success)";
    if (score >= 5) return "var(--warning)";
    return "var(--danger)";
  };

  const getAiScoreColor = (score) => {
    if (score >= 80) return "var(--success)";
    if (score >= 50) return "var(--warning)";
    return "var(--danger)";
  };

  const getIngredientText = (exp) =>
    exp?.ingredients?.length
      ? exp.ingredients
          .map((ing) => ing.name)
          .filter(Boolean)
          .join(", ")
      : "—";

  const renderStars = (value) => {
    return (
      <div className="flex gap-1">
        {[1, 2, 3, 4, 5].map((s) => (
          <Star
            key={s}
            size={16}
            className={`${s <= value ? "fill-amber-500 text-amber-500" : "fill-transparent text-[var(--border)]"}`}
          />
        ))}
      </div>
    );
  };

  const renderAnswer = (q, answer) => {
    if (answer === undefined || answer === null) {
      return (
        <span style={{ color: "var(--muted)", fontStyle: "italic" }}>
          Not answered
        </span>
      );
    }
    if (q.type === "rating_stars") return renderStars(answer);
    if (q.type === "yes_no") {
      return (
        <div className="flex items-center gap-2">
          {answer === "yes" ? (
            <div className="flex items-center gap-2 px-3 py-1 bg-emerald-500/10 rounded-lg">
              <ThumbsUp size={14} className="text-emerald-500" />
              <span className="text-[11px] font-black uppercase tracking-wider text-emerald-600">
                YES
              </span>
            </div>
          ) : (
            <div className="flex items-center gap-2 px-3 py-1 bg-rose-500/10 rounded-lg">
              <ThumbsDown size={14} className="text-rose-500" />
              <span className="text-[11px] font-black uppercase tracking-wider text-rose-600">
                NO
              </span>
            </div>
          )}
        </div>
      );
    }
    return (
      <div
        style={{
          fontSize: 14,
          color: "var(--text)",
          lineHeight: 1.6,
        }}
      >
        {answer}
      </div>
    );
  };

  return (
    <div className="animate-fade-in">
      <PageHeader
        title="Quality Feedback"
        subtitle="Comprehensive review history and quality assurance metrics."
        actions={[
          <div key="stats" className="flex flex-wrap gap-3">
            <div className="flex items-center gap-2.5 px-5 py-2.5 bg-amber-500/10 rounded-2xl border border-amber-500/20 text-[11px] font-black text-amber-600 uppercase tracking-widest shadow-sm">
              <Clock size={14} strokeWidth={3} className="animate-pulse" />{" "}
              {pendingCount} Pending Audit
            </div>
            <div className="flex items-center gap-2.5 px-5 py-2.5 bg-emerald-500/10 rounded-2xl border border-emerald-500/20 text-[11px] font-black text-emerald-600 uppercase tracking-widest shadow-sm">
              <CheckCircle size={14} strokeWidth={3} /> {completedCount}{" "}
              Approved
            </div>
          </div>,
        ]}
      />

      {/* Search & Filter Bar */}
      <Card className="mb-6">
        <div className="flex flex-col lg:flex-row gap-4 lg:items-center">
          <div className="flex-1 min-w-0 lg:min-w-[250px] relative">
            <Search
              size={16}
              className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[var(--muted)]"
            />
            <input
              type="text"
              placeholder="Search by recipe, ID, or chef..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="input-field pl-10 text-sm w-full"
            />
          </div>

          <div className="flex flex-wrap gap-1.5 p-1 bg-[var(--bg-subtle)] rounded-xl">
            {statusTabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setStatusFilter(tab.id)}
                className={`flex items-center gap-1.5 px-4 py-2 rounded-lg font-bold text-[13px] transition-all duration-200 cursor-pointer border-none ${
                  statusFilter === tab.id
                    ? "bg-[var(--primary)] text-white"
                    : "bg-transparent text-[var(--muted)] hover:text-[var(--text)]"
                }`}
              >
                {tab.label}
                <span
                  className={`px-2 py-0.5 rounded-full text-[11px] font-extrabold ${
                    statusFilter === tab.id
                      ? "bg-white/25"
                      : "bg-[var(--border)]"
                  }`}
                >
                  {tab.count}
                </span>
              </button>
            ))}
          </div>
        </div>
      </Card>

      {/* Reviews List */}
      <Card
        noPad
        className="overflow-hidden border-[var(--border)] shadow-2xl shadow-black/5 dark:shadow-none rounded-[32px]"
      >
        <div className="overflow-x-auto scrollbar-hide">
          <div className="min-w-[1000px] lg:min-w-full">
            {/* Table Header */}
            <div
              className={`grid gap-4 px-8 py-6 border-b border-[var(--border)] text-[10px] font-black text-[var(--muted)] uppercase tracking-[0.2em] bg-[var(--bg)]/50 backdrop-blur-md sticky top-0 z-10`}
              style={{ gridTemplateColumns: tableColumns }}
            >
              <span>Experiment Identity</span>
              <span>Primary Chef</span>
              <span>Submission Date</span>
              <span>Timestamp</span>
              {showAIScore && <span>AI Consensus</span>}
              <span className="text-center">Audit Status</span>
              <span></span>
            </div>

            {filteredExperiments.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-24 px-8 text-center bg-gradient-to-b from-transparent to-[var(--bg)]/30">
                <div className="w-20 h-20 bg-[var(--border)]/30 rounded-[32px] flex items-center justify-center mb-6">
                  <Search
                    size={32}
                    className="text-[var(--muted)] opacity-50"
                  />
                </div>
                <div className="text-xl font-black text-[var(--text)] uppercase tracking-widest">
                  Zero Records Found
                </div>
                <p className="text-xs font-bold text-[var(--muted)] mt-2 max-w-[280px] leading-relaxed">
                  We couldn't find any results matching your current filters or
                  search query.
                </p>
              </div>
            ) : (
              filteredExperiments.map((exp) => {
                const isExpanded = expandedId === exp.id;
                const reviewData = MOCK_REVIEW_DATA[exp.id];

                return (
                  <div key={exp.id}>
                    {/* Row */}
                    <div
                      onClick={() => setExpandedId(isExpanded ? null : exp.id)}
                      className={`grid gap-4 px-8 py-7 cursor-pointer transition-all duration-500 border-l-[6px] relative group overflow-hidden ${
                        isExpanded
                          ? "bg-[var(--primary-glow)] border-[var(--primary)]"
                          : "bg-transparent border-transparent hover:bg-[var(--bg)] border-b border-[var(--border)]/50"
                      }`}
                      style={{ gridTemplateColumns: tableColumns }}
                    >
                      {isExpanded && (
                        <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-r from-[var(--primary)]/5 to-transparent pointer-events-none" />
                      )}

                      <div className="relative z-10">
                        <div className="text-sm font-black text-[var(--text)] tracking-tight group-hover:text-[var(--primary)] transition-colors">
                          {exp.recipe}
                        </div>
                        <div className="text-[10px] font-black text-[var(--muted)] uppercase tracking-[0.2em] mt-1.5 opacity-60">
                          {exp.id} • BATCH-{exp.batchNo}
                        </div>
                      </div>

                      <div className="flex items-center text-xs font-bold text-[var(--text)] relative z-10">
                        <div className="w-7 h-7 rounded-lg bg-[var(--surface)] border border-[var(--border)] flex items-center justify-center text-[9px] font-black text-[var(--primary)] mr-2.5 shadow-sm group-hover:scale-110 transition-transform">
                          {exp.chef
                            ?.split(" ")
                            .map((n) => n[0])
                            .join("")}
                        </div>
                        {exp.chef}
                      </div>

                      <div className="flex items-center gap-2 text-xs font-bold text-[var(--muted)] relative z-10">
                        <Calendar size={13} className="opacity-50" />
                        {exp.date}
                      </div>

                      <div className="flex items-center text-xs font-bold text-[var(--muted)] relative z-10">
                        {exp.time || "—"}
                      </div>

                      {showAIScore && (
                        <div className="flex items-center relative z-10">
                          {exp.status === "Completed" ? (
                            <div className="flex items-center gap-3 w-full max-w-[120px]">
                              <div className="flex-1 h-1.5 bg-[var(--bg)] rounded-full overflow-hidden shadow-inner">
                                <div
                                  style={{ width: `${exp.aiScore}%` }}
                                  className={`h-full rounded-full transition-all duration-1000 ${
                                    exp.aiScore > 80
                                      ? "bg-emerald-500"
                                      : exp.aiScore > 60
                                        ? "bg-amber-500"
                                        : "bg-rose-500"
                                  }`}
                                />
                              </div>
                              <span className="text-[11px] font-black text-[var(--text)] w-8 text-right">
                                {exp.aiScore}%
                              </span>
                            </div>
                          ) : (
                            <span className="text-[10px] font-black text-[var(--muted)] uppercase tracking-widest opacity-40">
                              AWAITING
                            </span>
                          )}
                        </div>
                      )}

                      <div className="flex items-center justify-center relative z-10">
                        <StatusBadge status={exp.status} />
                      </div>

                      <div className="flex items-center justify-end relative z-10">
                        <div
                          className={`w-8 h-8 rounded-full border border-[var(--border)] flex items-center justify-center text-[var(--muted)] transition-all duration-500 group-hover:border-[var(--primary)] group-hover:text-[var(--primary)] ${
                            isExpanded
                              ? "rotate-180 bg-[var(--primary)] text-white border-[var(--primary)]"
                              : "rotate-0"
                          }`}
                        >
                          <ChevronDown size={14} strokeWidth={3} />
                        </div>
                      </div>
                    </div>

                    {/* Expanded Detail */}
                    <AnimatePresence>
                      {isExpanded && (
                        <motion.div
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: "auto", opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          transition={{ duration: 0.3, ease: "easeInOut" }}
                          className="bg-[var(--bg-subtle)] border-b-2 border-[var(--primary)] text-[var(--text)]"
                        >
                          <div className="p-10 md:p-12 space-y-12">
                            {/* Experiment Info Grid */}
                            <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 p-8 bg-[var(--surface)] rounded-[32px] border border-[var(--border)] shadow-inner relative overflow-hidden">
                              <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-[var(--primary)]/5 to-transparent rounded-full -mr-16 -mt-16" />
                              {[
                                {
                                  label: "Selected Ingredients",
                                  val: getIngredientText(exp),
                                  icon: Utensils,
                                  color: "orange",
                                },
                                {
                                  label: "Cooking Precision",
                                  val: `${exp.temp}°C`,
                                  icon: Activity,
                                  color: "rose",
                                },
                                {
                                  label: "Product Version",
                                  val: `${exp.version}`,
                                  icon: Zap,
                                  color: "amber",
                                },
                                {
                                  label: "Cycle Duration",
                                  val: `${exp.timing} MIN`,
                                  icon: Clock,
                                  color: "indigo",
                                },
                              ].map((item) => (
                                <div key={item.label} className="space-y-2">
                                  <div className="text-[10px] text-[var(--muted)] uppercase font-black tracking-[0.2em] opacity-60 flex items-center gap-2">
                                    {item.label}
                                  </div>
                                  <div className="text-base font-black text-[var(--text)] tracking-tight">
                                    {item.val}
                                  </div>
                                </div>
                              ))}
                            </div>

                            {reviewData ? (
                              <div className="space-y-12 pb-4">
                                {/* Reviewed By Header */}
                                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6 p-8 bg-[var(--surface)] rounded-[32px] border-l-[6px] border-[var(--primary)] shadow-sm">
                                  <div className="flex items-center gap-5">
                                    <div className="w-14 h-14 rounded-2xl bg-[var(--primary-glow)] flex items-center justify-center text-lg font-black text-[var(--primary)] shadow-inner border border-[var(--primary)]/20">
                                      {reviewData.reviewedBy?.charAt(0)}
                                    </div>
                                    <div>
                                      <div className="text-xs font-black text-[var(--muted)] uppercase tracking-widest mb-1">
                                        AUDIT CONDUCTED BY
                                      </div>
                                      <div className="text-lg font-black text-[var(--text)] tracking-tight">
                                        {reviewData.reviewedBy}
                                      </div>
                                    </div>
                                  </div>
                                  <div className="flex items-center gap-3 px-6 py-3 bg-[var(--bg)] rounded-2xl border border-[var(--border)] text-xs font-bold text-[var(--muted)] shadow-sm">
                                    <Calendar
                                      size={16}
                                      className="text-[var(--primary)] opacity-70"
                                    />
                                    <span className="uppercase tracking-widest">
                                      {reviewData.reviewedDate}
                                    </span>
                                  </div>
                                </div>

                                {/* Sensory Intelligence */}
                                <div className="space-y-6">
                                  <div className="flex items-center gap-3 px-2">
                                    <div className="w-2 h-6 bg-indigo-500 rounded-full" />
                                    <h4 className="text-sm font-black text-[var(--text)] uppercase tracking-[0.2em]">
                                      Sensory Analytics
                                    </h4>
                                  </div>
                                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
                                    {sensoryLabels.map((s) => {
                                      const val =
                                        reviewData.sensoryScores[s.key];
                                      return (
                                        <div
                                          key={s.key}
                                          className="group flex items-center justify-between p-6 bg-[var(--surface)] rounded-[24px] border border-[var(--border)] hover:border-[var(--primary)]/30 hover:shadow-xl hover:shadow-black/5 transition-all duration-500 relative overflow-hidden"
                                        >
                                          <div
                                            className="absolute top-0 right-0 w-16 h-16 bg-gradient-to-br from-current to-transparent opacity-[0.03] -mr-8 -mt-8 rounded-full"
                                            style={{ color: s.color }}
                                          />
                                          <div className="flex items-center gap-4 relative z-10">
                                            <div
                                              className="w-12 h-12 rounded-xl flex items-center justify-center shadow-inner group-hover:scale-110 transition-transform duration-500"
                                              style={{
                                                backgroundColor: `${s.color}10`,
                                                color: s.color,
                                              }}
                                            >
                                              <s.icon
                                                size={20}
                                                strokeWidth={2.5}
                                              />
                                            </div>
                                            <span className="text-xs font-bold text-[var(--text)] uppercase tracking-widest opacity-80">
                                              {s.label}
                                            </span>
                                          </div>
                                          <div
                                            className="text-xl font-black relative z-10"
                                            style={{
                                              color: getScoreColor(val),
                                            }}
                                          >
                                            {val}
                                            <span className="text-[10px] opacity-40 ml-1">
                                              /10
                                            </span>
                                          </div>
                                        </div>
                                      );
                                    })}
                                  </div>
                                </div>

                                {/* Modular Response Section */}
                                <div className="space-y-6">
                                  <div className="flex items-center gap-3 px-2">
                                    <div className="w-2 h-6 bg-emerald-500 rounded-full" />
                                    <h4 className="text-sm font-black text-[var(--text)] uppercase tracking-[0.2em]">
                                      Compliance Assessment
                                    </h4>
                                  </div>
                                  <div className="grid grid-cols-1 gap-4">
                                    {STATIC_QUESTIONS.map((q, i) => (
                                      <div
                                        key={q.id}
                                        className="flex flex-col md:flex-row md:items-center justify-between gap-6 p-7 bg-[var(--surface)] rounded-[28px] border border-[var(--border)] hover:bg-[var(--bg)]/30 transition-colors duration-500"
                                      >
                                        <div className="flex gap-5 max-w-2xl">
                                          <div className="flex-shrink-0 w-8 h-8 rounded-full bg-[var(--bg)] border border-[var(--border)] flex items-center justify-center text-[10px] font-black text-[var(--primary)] shadow-sm">
                                            {i + 1}
                                          </div>
                                          <div className="text-sm font-bold text-[var(--text)] leading-relaxed tracking-tight">
                                            {q.question}
                                          </div>
                                        </div>
                                        <div className="flex-shrink-0 flex justify-end md:justify-center min-w-[120px]">
                                          {renderAnswer(
                                            q,
                                            reviewData.answers[q.id],
                                          )}
                                        </div>
                                      </div>
                                    ))}
                                  </div>
                                </div>

                                {/* Executive Summary / Remarks */}
                                {reviewData.remarks && (
                                  <div className="space-y-6">
                                    <div className="flex items-center gap-3 px-2">
                                      <div className="w-2 h-6 bg-orange-500 rounded-full" />
                                      <h4 className="text-sm font-black text-[var(--text)] uppercase tracking-[0.2em]">
                                        Reviewer Conclusion
                                      </h4>
                                    </div>
                                    <div className="p-8 bg-orange-500/5 rounded-[32px] border border-orange-500/10 relative overflow-hidden group">
                                      <div className="absolute top-0 left-0 w-1 h-full bg-orange-500 rounded-full" />
                                      <div className="absolute top-0 right-0 p-6 opacity-10 group-hover:opacity-20 transition-opacity">
                                        <MessageSquare
                                          size={48}
                                          className="text-orange-500"
                                        />
                                      </div>
                                      <div className="text-sm text-[var(--text)] leading-[1.8] font-bold tracking-tight italic relative z-10 pl-4">
                                        “ {reviewData.remarks} ”
                                      </div>
                                    </div>
                                  </div>
                                )}
                              </div>
                            ) : (
                              /* Pending Review - No Data Yet */
                              <div className="py-20 px-8 text-center bg-[var(--surface)] rounded-[40px] border border-dashed border-[var(--border)] relative overflow-hidden group">
                                <div className="absolute inset-0 bg-gradient-to-b from-amber-500/[0.02] to-transparent pointer-events-none" />
                                <div className="w-24 h-24 bg-amber-500/10 rounded-[40px] flex items-center justify-center mx-auto mb-8 group-hover:scale-110 transition-transform duration-700">
                                  <Clock
                                    size={40}
                                    strokeWidth={2.5}
                                    className="text-amber-500 animate-pulse"
                                  />
                                </div>
                                <div className="text-2xl font-black text-[var(--text)] uppercase tracking-widest mb-3">
                                  Pending Consensus
                                </div>
                                <p className="text-sm text-[var(--muted)] font-bold max-w-sm mx-auto leading-relaxed opacity-70">
                                  This submission is currently in the quality
                                  queue. An authorized Reviewer must conduct a
                                  sensory audit to finalize the status.
                                </p>
                              </div>
                            )}
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                );
              })
            )}
          </div>
        </div>
      </Card>
    </div>
  );
}
