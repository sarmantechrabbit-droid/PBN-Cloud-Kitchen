import { useState, useEffect, useRef } from "react";
import {
  Search,
  Download,
  Filter,
  Activity,
  Shield,
  ShieldCheck,
  ChefHat,
  Star,
  Zap,
  ChevronDown,
  FileText,
  User,
  Thermometer,
  Clock,
  Layers,
  FlaskConical,
  CheckCircle2,
  AlertCircle,
  ChevronUp,
  X,
  Check,
  Calendar,
} from "lucide-react";
import { motion } from "framer-motion";
import Card from "../../components/ui/Card";
import StatCard from "../../components/ui/StatCard";
import StatusBadge from "../../components/ui/StatusBadge";
import PageHeader from "../../components/ui/PageHeader";
import { aiAnalysis } from "../../data/dummy";
import { AnimatePresence } from "framer-motion";

const FilterDropdown = ({
  label,
  icon: Icon,
  options,
  selectedValue,
  onChange,
  iconColor = "var(--primary)",
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleSelect = (option) => {
    onChange(option);
    setIsOpen(false);
  };

  const isAllSelected = selectedValue.startsWith("All");

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`flex items-center justify-between gap-3 px-4 py-2.5 min-w-[200px] rounded-xl border transition-all duration-200 bg-white dark:bg-gray-800 shadow-sm
          ${isOpen ? "border-orange-500 ring-2 ring-orange-500/10" : "border-gray-200 dark:border-gray-700 hover:border-orange-400"}`}
      >
        <div className="flex items-center gap-2.5 truncate">
          <Icon size={18} style={{ color: iconColor }} />
          <div className="flex items-center gap-2 truncate">
            {!isAllSelected && (
              <span className="bg-orange-100 dark:bg-orange-900/30 text-orange-600 dark:text-orange-400 px-2 py-0.5 rounded-full text-[10px] font-bold whitespace-nowrap flex items-center gap-1">
                {selectedValue}
                <X
                  size={10}
                  className="cursor-pointer hover:text-orange-800"
                  onClick={(e) => {
                    e.stopPropagation();
                    onChange(`All ${label}s`);
                  }}
                />
              </span>
            )}
            <span
              className={`text-sm font-bold truncate ${isAllSelected ? "text-gray-700 dark:text-gray-200" : "text-gray-400"}`}
            >
              {isAllSelected ? label : ""}
            </span>
          </div>
        </div>
        <ChevronDown
          size={14}
          className={`text-gray-400 transition-transform duration-200 ${isOpen ? "rotate-180" : ""}`}
        />
      </button>

      {isOpen && (
        <div className="absolute top-full left-0 mt-2 w-full min-w-[240px] bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 rounded-2xl shadow-2xl z-[100] overflow-hidden animate-in fade-in slide-in-from-top-2 duration-200">
          <div className="p-2 max-h-[300px] overflow-y-auto no-scrollbar">
            {options.map((option) => {
              const isSelected = selectedValue === option;
              const isAll = option.startsWith("All");
              const initials = option
                .split(" ")
                .map((n) => n[0])
                .join("")
                .substring(0, 2);

              return (
                <div
                  key={option}
                  onClick={() => handleSelect(option)}
                  className={`flex items-center justify-between px-3 py-2.5 rounded-xl cursor-pointer transition-all duration-150 mb-1 last:mb-0
                    ${
                      isSelected
                        ? "bg-orange-50 dark:bg-orange-900/20 text-orange-600 dark:text-orange-400 shadow-sm"
                        : "hover:bg-gray-50 dark:hover:bg-gray-800 text-gray-700 dark:text-gray-300"
                    }`}
                >
                  <div className="flex items-center gap-3">
                    {!isAll ? (
                      <div
                        className={`w-8 h-8 rounded-full flex items-center justify-center text-[11px] font-black shadow-sm
                        ${isSelected ? "bg-orange-500 text-white" : "bg-orange-100 dark:bg-orange-900/30 text-orange-600 dark:text-orange-400"}`}
                      >
                        {initials}
                      </div>
                    ) : (
                      <div className="w-8 h-8 rounded-full bg-gray-100 dark:bg-gray-800 flex items-center justify-center">
                        <Icon size={14} className="text-gray-400" />
                      </div>
                    )}
                    <span
                      className={`text-sm ${isSelected ? "font-bold" : "font-semibold"}`}
                    >
                      {option}
                    </span>
                  </div>
                  {isSelected && <Check size={16} />}
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};

export default function AIPage() {
  const [search, setSearch] = useState("");
  const [chefFilter, setChefFilter] = useState("All Chefs");
  const [reviewerFilter, setReviewerFilter] = useState("All Reviewers");
  const role = localStorage.getItem("ck_role");

  // Get unique chefs and reviewers
  const chefs = [
    "All Chefs",
    ...new Set(aiAnalysis.map((a) => a.submittedBy).filter(Boolean)),
  ];
  const reviewers = [
    "All Reviewers",
    ...new Set(aiAnalysis.map((a) => a.reviewedBy).filter(Boolean)),
  ];

  const filtered = aiAnalysis.filter((a) => {
    const matchesSearch =
      a.recipe.toLowerCase().includes(search.toLowerCase()) ||
      a.id.toLowerCase().includes(search.toLowerCase());
    const matchesChef =
      chefFilter === "All Chefs" || a.submittedBy === chefFilter;
    const matchesReviewer =
      reviewerFilter === "All Reviewers" || a.reviewedBy === reviewerFilter;
    return matchesSearch && matchesChef && matchesReviewer;
  });

  const ExperimentCard = ({ data }) => {
    const [expanded, setExpanded] = useState(false);
    const barColor =
      data.variance < 5
        ? "var(--success)"
        : data.variance < 15
          ? "var(--warning)"
          : "var(--danger)";

    return (
      <Card
        noPad
        className="mb-8 overflow-hidden border-[var(--border)] shadow-xl shadow-black/5 dark:shadow-none hover:shadow-2xl hover:shadow-primary/10 transition-all duration-500 bg-gradient-to-b from-[var(--surface)] to-[var(--bg)] rounded-[32px] group"
      >
        <div className="p-6 lg:p-10">
          {/* Header */}
          <div className="flex flex-col lg:flex-row justify-between items-start gap-8 mb-10">
            <div className="flex items-center gap-6 w-full">
              <div className="relative shrink-0">
                <div className="absolute -inset-2 bg-gradient-to-br from-[var(--primary)] to-amber-500 rounded-[24px] blur-xl opacity-20 group-hover:opacity-40 transition-all duration-700"></div>
                <img
                  src={
                    data.image ||
                    "https://images.unsplash.com/photo-1604908176997-43149b0a7c0c"
                  }
                  alt={data.recipe}
                  className="relative w-20 h-20 lg:w-24 lg:h-24 rounded-[22px] object-cover border-2 border-[var(--surface)] shadow-2xl z-10"
                />
              </div>
              <div className="min-w-0 space-y-1.5">
                <div className="flex items-center gap-3">
                  <span className="text-[10px] font-black px-3 py-1 bg-[var(--primary-glow)] text-[var(--primary)] border border-[var(--primary)]/20 rounded-full uppercase tracking-widest shadow-sm">
                    {data.id}
                  </span>
                  <span className="text-[10px] font-black px-3 py-1 bg-[var(--bg)] text-[var(--muted)] border border-[var(--border)] rounded-full uppercase tracking-widest opacity-60">
                    Batch {data.batchNo}
                  </span>
                </div>
                <h3 className="text-xl lg:text-2xl font-black text-[var(--text)] tracking-tight group-hover:text-[var(--primary)] transition-colors duration-500">
                  {data.recipe}
                </h3>
                <div className="flex items-center gap-4 text-[12px] font-bold text-[var(--muted)]">
                  <div className="flex items-center gap-1.5">
                    <Calendar size={14} className="opacity-40" />
                    {data.date}
                  </div>
                  {data.time && (
                    <div className="flex items-center gap-1.5">
                      <Clock size={14} className="opacity-40" />
                      {data.time}
                    </div>
                  )}
                  <div className="w-1.5 h-1.5 rounded-full bg-[var(--border)]" />
                  <div className="flex items-center gap-1.5 text-rose-500/80">
                    <AlertCircle size={14} />
                    Risk Level: {data.risk}
                  </div>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-3 self-end lg:self-start">
              <StatusBadge status={data.status} size="lg" />
              <button
                onClick={() => setExpanded(!expanded)}
                className={`w-14 h-14 rounded-full border-2 flex items-center justify-center transition-all duration-700 shadow-lg ${
                  expanded
                    ? "bg-[var(--primary)] text-white border-[var(--primary)] rotate-180 scale-90"
                    : "bg-[var(--surface)] text-[var(--muted)] border-[var(--border)] hover:border-[var(--primary)] hover:text-[var(--primary)]"
                }`}
              >
                <ChevronDown size={20} strokeWidth={3} />
              </button>
            </div>
          </div>

          {/* Primary Metrics Grid */}
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 mb-10">
            {[
              {
                label: "Precision",
                val: data.temp,
                icon: Thermometer,
                color: "rose",
              },
              {
                label: "Cycle",
                val: data.timing,
                icon: Clock,
                color: "indigo",
              },
              {
                label: "Target Texture",
                val: data.expTexture,
                icon: FlaskConical,
                color: "blue",
              },
              {
                label: "Actual Texture",
                val: data.actTexture,
                icon: Layers,
                color:
                  data.expTexture !== data.actTexture ? "amber" : "emerald",
              },
              {
                label: "Predicted Yield",
                val: data.expYield,
                icon: Zap,
                color: "orange",
              },
              {
                label: "Actual Yield",
                val: data.actYield,
                icon: Activity,
                color: "emerald",
              },
            ].map((metric) => (
              <div
                key={metric.label}
                className="p-5 bg-[var(--bg)] border border-[var(--border)]/50 rounded-[24px] shadow-sm hover:shadow-md transition-all duration-500 group/metric relative overflow-hidden"
              >
                <div className="absolute top-0 right-0 w-12 h-12 bg-gradient-to-br from-[var(--primary)]/5 to-transparent rounded-full -mr-6 -mt-6 group-hover/metric:scale-150 transition-transform duration-700" />
                <div className="text-[9px] font-black text-[var(--muted)] uppercase tracking-[0.2em] mb-3 flex items-center gap-2">
                  <metric.icon
                    size={12}
                    className="text-[var(--primary)] opacity-60"
                  />
                  {metric.label}
                </div>
                <div className="text-sm font-black text-[var(--text)] tracking-tight">
                  {metric.val}
                </div>
              </div>
            ))}
          </div>

          {/* AI Convergence Analysis */}
          <div className="relative p-8 lg:p-10 bg-[var(--bg)] rounded-[40px] border border-[var(--border)] overflow-hidden">
            <div className="absolute top-0 right-0 w-96 h-96 bg-[var(--primary)]/5 blur-[100px] rounded-full -mr-48 -mt-48" />

            <div className="relative z-10 flex flex-col lg:flex-row items-center gap-10">
              <div className="flex flex-col items-center gap-2">
                <div className="text-[10px] font-black text-[var(--muted)] uppercase tracking-widest opacity-60 mb-2">
                  Convergence Variance
                </div>
                <div className="relative w-32 h-32 flex items-center justify-center">
                  <svg className="w-full h-full -rotate-90">
                    <circle
                      cx="64"
                      cy="64"
                      r="58"
                      className="stroke-[var(--border)] fill-none stroke-[8px]"
                    />
                    <circle
                      cx="64"
                      cy="64"
                      r="58"
                      className="fill-none stroke-[8px] transition-all duration-1000 ease-out"
                      strokeDasharray="364.4"
                      strokeDashoffset={364.4 - (364.4 * data.variance) / 100}
                      stroke={barColor}
                      strokeLinecap="round"
                    />
                  </svg>
                  <div className="absolute inset-0 flex items-center justify-center flex-col">
                    <span className="text-3xl font-black text-[var(--text)]">
                      {data.variance}%
                    </span>
                    <span className="text-[9px] font-black text-[var(--muted)] uppercase tracking-tighter opacity-60">
                      Delta
                    </span>
                  </div>
                </div>
              </div>

              <div className="flex-1 w-full space-y-6">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div
                      className={`w-10 h-10 rounded-2xl flex items-center justify-center bg-white border border-[var(--border)] shadow-sm ${data.variance < 10 ? "text-emerald-500" : "text-amber-500"}`}
                    >
                      {data.variance < 10 ? (
                        <ShieldCheck size={20} />
                      ) : (
                        <AlertCircle size={20} />
                      )}
                    </div>
                    <div>
                      <div className="text-sm font-black text-[var(--text)] uppercase tracking-wider">
                        {data.varianceStatus}
                      </div>
                      <div className="text-[10px] font-extrabold text-[var(--muted)] uppercase tracking-widest opacity-60">
                        AI Semantic Validation Engine
                      </div>
                    </div>
                  </div>
                  <div className="hidden sm:block text-[10px] font-black text-[var(--muted)] uppercase tracking-widest">
                    Confidence Score: 98.4%
                  </div>
                </div>

                <div className="h-4 bg-[var(--bg-subtle)] rounded-full w-full p-1 border border-[var(--border)]/50">
                  <div
                    className="h-full rounded-full transition-all duration-1000 ease-out shadow-lg"
                    style={{
                      backgroundColor: barColor,
                      width: `${data.variance}%`,
                    }}
                  />
                </div>
                <p className="text-[13px] font-bold text-[var(--text-subtle)] leading-relaxed italic opacity-80">
                  "The anomaly detection algorithm identified a {data.variance}%
                  deviation in production parameters compared to the baseline
                  recipe {data.version}."
                </p>
              </div>
            </div>
          </div>

          <AnimatePresence>
            {expanded && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: "auto", opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.5, ease: "easeInOut" }}
                className="overflow-hidden"
              >
                <div className="pt-10 mt-10 border-t border-[var(--border)]/50 space-y-10">
                  {/* Secondary Details Grid */}
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    <div className="p-6 bg-[var(--bg)] border border-[var(--border)] rounded-[24px]">
                      <div className="text-[10px] font-black text-[var(--muted)] uppercase tracking-widest mb-4">
                        Sensory Calibration
                      </div>
                      <div className="flex items-center gap-4">
                        <div className="flex-1 space-y-1">
                          <div className="text-[9px] font-black text-[var(--muted)] uppercase">
                            Expected
                          </div>
                          <div className="text-sm font-black text-[var(--text)]">
                            ★ {data.expTaste}
                          </div>
                        </div>
                        <div className="w-[1px] h-8 bg-[var(--border)]" />
                        <div className="flex-1 space-y-1">
                          <div className="text-[9px] font-black text-[var(--muted)] uppercase">
                            Actual
                          </div>
                          <div className="text-sm font-black text-[var(--primary)]">
                            ★ {data.actTaste}
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="p-6 bg-[var(--bg)] border border-[var(--border)] rounded-[24px]">
                      <div className="text-[10px] font-black text-[var(--muted)] uppercase tracking-widest mb-4">
                        Identity Verification
                      </div>
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-[var(--primary-glow)] flex items-center justify-center text-[11px] font-black text-[var(--primary)]">
                          {data.submittedBy
                            .split(" ")
                            .map((n) => n[0])
                            .join("")}
                        </div>
                        <div>
                          <div className="text-xs font-black text-[var(--text)]">
                            {data.submittedBy}
                          </div>
                          <div className="text-[9px] font-black text-[var(--muted)] uppercase tracking-widest">
                            Protocol Submitter
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="p-6 bg-[var(--bg)] border border-[var(--border)] rounded-[24px]">
                      <div className="text-[10px] font-black text-[var(--muted)] uppercase tracking-widest mb-4">
                        Schema Version
                      </div>
                      <div className="flex items-center gap-3 text-[var(--text)]">
                        <FileText size={18} className="text-[var(--primary)]" />
                        <span className="text-sm font-bold">
                          {data.version} - Stable Release
                        </span>
                      </div>
                    </div>

                    <div className="p-6 bg-[var(--bg)] border border-[var(--border)] rounded-[24px]">
                      <div className="text-[10px] font-black text-[var(--muted)] uppercase tracking-widest mb-4">
                        Peer Audit
                      </div>
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-[var(--bg-subtle)] border border-[var(--border)] flex items-center justify-center text-[11px] font-black text-[var(--muted)]">
                          {data.reviewedBy
                            ?.split(" ")
                            .map((n) => n[0])
                            .join("") || "??"}
                        </div>
                        <div>
                          <div className="text-xs font-black text-[var(--text)]">
                            {data.reviewedBy || "Pending"}
                          </div>
                          <div className="text-[9px] font-black text-[var(--muted)] uppercase tracking-widest">
                            Senior Reviewer
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Remarks & Assets */}
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
                    <div className="space-y-6">
                      <div className="flex items-center gap-3">
                        <div className="w-2 h-6 bg-[var(--primary)] rounded-full" />
                        <h4 className="text-sm font-black text-[var(--text)] uppercase tracking-widest">
                          AI Synthesis Remarks
                        </h4>
                      </div>
                      <div className="p-8 bg-[var(--surface)] rounded-[32px] border border-[var(--border)] shadow-inner leading-relaxed text-sm font-medium text-[var(--text-subtle)]">
                        {data.remarks}
                      </div>
                    </div>

                    <div className="space-y-6">
                      <div className="flex items-center gap-3">
                        <div className="w-2 h-6 bg-blue-500 rounded-full" />
                        <h4 className="text-sm font-black text-[var(--text)] uppercase tracking-widest">
                          Protocol Artifacts
                        </h4>
                      </div>
                      <div className="flex flex-wrap gap-4">
                        {data.files.map((f) => (
                          <button
                            key={f}
                            className="group/file flex items-center gap-3 px-6 py-4 bg-[var(--bg)] border border-[var(--border)] rounded-[24px] text-xs font-black text-[var(--text)] hover:border-[var(--primary)]/30 hover:bg-[var(--primary-glow)] transition-all duration-300 shadow-sm"
                          >
                            <div className="w-8 h-8 rounded-xl bg-[var(--surface)] flex items-center justify-center group-hover/file:bg-[var(--primary)] group-hover/file:text-white transition-colors">
                              <FileText size={16} />
                            </div>
                            {f}
                            <Download
                              size={14}
                              className="text-[var(--muted)] group-hover/file:text-[var(--primary)] ml-2"
                            />
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </Card>
    );
  };

  const MetricBox = ({ label, value, icon: Icon, color = "var(--text)" }) => (
    <div className="bg-[var(--bg)] border border-[var(--border)] rounded-2xl p-3.5 sm:p-4 shadow-sm group hover:shadow-md transition-all hover:bg-[var(--surface-hover)]">
      <div className="text-[10px] text-[var(--muted)] font-bold uppercase tracking-widest mb-2 flex items-center gap-2">
        <Icon
          size={12}
          className="text-[var(--primary)] opacity-70 group-hover:opacity-100"
        />
        <span className="truncate">{label}</span>
      </div>
      <div className="text-sm font-black truncate" style={{ color }}>
        {value}
      </div>
    </div>
  );

  return (
    <div className="animate-in fade-in duration-700 space-y-8">
      <PageHeader
        title="AI Analytics"
        subtitle="Approve or reject production batches based on deep neural analysis of variance data."
        actions={[
          <div
            key="monitor"
            className="flex items-center gap-2.5 px-5 py-2.5 bg-[var(--primary-glow)] rounded-2xl border border-[var(--primary)]/20 text-[11px] font-black text-[var(--primary)] uppercase tracking-widest shadow-sm"
          >
            <Activity size={14} strokeWidth={3} className="animate-pulse" />
            AI Training Online
          </div>,
        ]}
      />

      {/* Top Stat Row */}
      {role === "Manager" && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <StatCard
            icon={<Zap size={20} />}
            label="Yield Reliability"
            value="94.8%"
            trend="+1.2%"
            trendUp
            sub="Predicted vs Actual"
          />
          <StatCard
            icon={<Star size={20} />}
            label="Texture Precision"
            value="91.2%"
            trend="+3.8%"
            trendUp
            sub="Neural Match Confidence"
          />
          <StatCard
            icon={<Shield size={20} />}
            label="Security Signatures"
            value="156"
            sub="Verified Protocols"
          />
          <StatCard
            icon={<Activity size={20} />}
            label="Analytic Throughput"
            value={aiAnalysis.length}
            sub="Experiments Processed"
          />
        </div>
      )}

      {/* Toolbar & Filters */}
      <Card className="p-2 lg:p-3 overflow-visible">
        <div className="flex flex-col lg:flex-row gap-6 lg:items-center">
          <div className="flex-1 relative group">
            <Search
              size={18}
              className="absolute left-4 top-1/2 -translate-y-1/2 text-[var(--muted)] group-focus-within:text-[var(--primary)] transition-colors"
            />
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Query experiments by name, identity, or batch hash..."
              className="w-full pl-12 pr-4 py-4 rounded-[20px] bg-[var(--bg)] border border-[var(--border)] text-sm font-bold text-[var(--text)] focus:ring-4 focus:ring-[var(--primary)]/10 focus:border-[var(--primary)] outline-none transition-all placeholder:opacity-50"
            />
          </div>

          <div className="flex flex-wrap lg:flex-nowrap gap-4">
            <FilterDropdown
              label="Submitter"
              icon={ChefHat}
              options={chefs}
              selectedValue={chefFilter}
              onChange={setChefFilter}
              iconColor="var(--primary)"
            />

            <FilterDropdown
              label="Reviewer"
              icon={ShieldCheck}
              options={reviewers}
              selectedValue={reviewerFilter}
              onChange={setReviewerFilter}
              iconColor="var(--primary)"
            />

            <button className="flex items-center justify-center gap-3 px-8 py-4 bg-[var(--primary)] text-white rounded-[20px] text-[11px] font-black uppercase tracking-widest shadow-xl shadow-[var(--primary)]/20 hover:scale-[1.02] hover:shadow-2xl hover:shadow-[var(--primary)]/30 transition-all duration-300 min-w-[160px]">
              <Download size={18} strokeWidth={3} />
              Export
            </button>
          </div>
        </div>
      </Card>

      {/* Experiment List */}
      <div className="space-y-2">
        <div className="flex items-center justify-between px-4 mb-4">
          <div className="text-[10px] font-black text-[var(--muted)] uppercase tracking-[0.2em] opacity-60">
            Result Set: {filtered.length} Entities Found
          </div>
          <div className="flex items-center gap-2 text-[10px] font-black text-[var(--primary)] uppercase tracking-widest">
            <div className="w-1.5 h-1.5 rounded-full bg-[var(--primary)] animate-pulse" />
            Real-time Sync Active
          </div>
        </div>

        {filtered.map((e) => (
          <ExperimentCard key={e.id} data={e} />
        ))}
        {filtered.length === 0 && (
          <div className="p-32 text-center bg-[var(--surface)] rounded-[48px] border-2 border-dashed border-[var(--border)]">
            <div className="w-20 h-20 bg-[var(--bg)] rounded-full flex items-center justify-center mx-auto mb-6 shadow-inner">
              <Search size={32} className="text-[var(--muted)] opacity-30" />
            </div>
            <div className="text-xl font-black text-[var(--text)] uppercase tracking-widest">
              No Intelligence Data
            </div>
            <p className="text-sm font-bold text-[var(--muted)] mt-2 max-w-sm mx-auto leading-relaxed">
              The current query parameters yielded zero matches in the neural
              database.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
