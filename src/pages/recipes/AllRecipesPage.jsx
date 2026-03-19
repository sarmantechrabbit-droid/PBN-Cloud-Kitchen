import React, { useState } from "react";
import {
  Search,
  Filter,
  ChefHat,
  Clock,
  Star,
  ArrowRight,
  LayoutGrid,
  List,
  X,
  Shield,
  Activity,
  Zap,
} from "lucide-react";
import PageHeader from "../../components/ui/PageHeader";
import StatusBadge from "../../components/ui/StatusBadge";
import { experiments } from "../../data/dummy";

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
};

const sensoryLabels = [
  { key: "taste", label: "Taste & Flavor" },
  { key: "aroma", label: "Aroma & Scent" },
  { key: "saltiness", label: "Saltiness" },
  { key: "visual", label: "Visual Appeal" },
  { key: "consistency", label: "Texture & Consistency" },
  { key: "spiciness", label: "Spiciness" },
  { key: "oiliness", label: "Oiliness" },
  { key: "freshness", label: "Freshness" },
  { key: "aftertaste", label: "Aftertaste" },
];

const ExperimentDetailModal = ({ recipe, onClose, showAiScore = true }) => {
  if (!recipe) return null;
  const ingredients = recipe.ingredients || [];
  const reviewData = MOCK_REVIEW_DATA[recipe.id] || {
    sensoryScores: { taste: 0, aroma: 0, saltiness: 0, visual: 0, consistency: 0 },
    reviewedBy: "Sanjay Dutt",
    reviewedDate: recipe.date,
  };

  const SummaryCard = ({ label, value, icon: Icon }) => (
    <div className="bg-white dark:bg-gray-800/50 rounded-xl p-4 text-center border border-gray-100 dark:border-gray-700 transition-all hover:shadow-md">
      <div className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-2">{label}</div>
      <div className="flex justify-center items-center gap-2">
        <Icon size={16} className="text-gray-400" />
        <div className="text-sm font-black text-gray-900 dark:text-white">{value || "—"}</div>
      </div>
    </div>
  );

  return (
    <div className="fixed inset-0 z-[150] flex items-center justify-center p-2 sm:p-4 bg-black/40 backdrop-blur-sm animate-fade-in">
      <div className="w-full max-w-3xl max-h-[95vh] sm:max-h-[90vh] overflow-y-auto bg-white dark:bg-gray-900 rounded-2xl shadow-2xl relative animate-slide-up no-scrollbar">
        {/* Header with AI Score */}
        <div className="sticky top-0 z-30 bg-white dark:bg-gray-900 px-4 sm:px-6 py-4 border-b border-gray-100 dark:border-gray-800 flex items-center justify-between shadow-sm">
          <div className="flex flex-col min-w-0 pr-2">
            <h2 className="text-base sm:text-xl font-bold text-gray-900 dark:text-white tracking-tight truncate">Recipe Details</h2>
            <p className="text-[10px] sm:text-xs font-semibold text-gray-400 truncate">{recipe.recipe}</p>
          </div>
          <div className="flex items-center gap-2 sm:gap-4 shrink-0">
            <div className="text-right flex flex-col items-end">
              {recipe.status === "Completed" && (
                <div className="text-lg sm:text-2xl font-black text-orange-500 leading-none mb-1">
                  {recipe.aiScore}<span className="text-[10px] text-gray-400 ml-0.5">/100</span>
                </div>
              )}
              <StatusBadge status={recipe.status} />
            </div>
            <button
              onClick={onClose}
              className="p-1.5 sm:p-2 bg-gray-50 dark:bg-gray-800 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-xl transition-all text-gray-400 hover:text-gray-900 dark:hover:text-white border border-gray-100 dark:border-gray-700"
            >
              <X size={18} />
            </button>
          </div>
        </div>

        <div className="p-5 sm:p-8 space-y-6 sm:space-y-8 text-gray-900 dark:text-white">
          {/* Top Section: Info & Image */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8 items-center">
            <div className="space-y-4 sm:space-y-6">
              <div>
                <h1 className="text-lg sm:text-2xl font-bold text-gray-900 dark:text-white mb-2 leading-tight">
                  {recipe.recipe}
                </h1>
                <div className="flex flex-wrap gap-x-2 gap-y-1.5 items-center">
                  <span className="text-[10px] sm:text-xs font-bold bg-gray-100 dark:bg-gray-800 px-2 py-0.5 rounded text-gray-600 dark:text-gray-400">{recipe.id}</span>
                  <span className="w-1 h-1 rounded-full bg-gray-300 dark:bg-gray-700" />
                  <span className="text-[10px] sm:text-xs font-bold text-gray-500 uppercase tracking-widest">Batch: {recipe.batchNo}</span>
                </div>
              </div>

              <div className="flex items-center gap-3 p-3 sm:p-4 bg-orange-500/5 dark:bg-orange-500/10 rounded-2xl border border-orange-500/10 transition-all hover:bg-orange-500/[0.08]">
                <div className="w-9 h-9 sm:w-11 sm:h-11 rounded-xl bg-orange-500 flex items-center justify-center text-white font-bold text-sm shadow-lg shadow-orange-500/20 shrink-0">
                  {recipe.chef.split(' ').map(n => n[0]).join('')}
                </div>
                <div className="min-w-0">
                  <div className="text-xs sm:text-sm font-bold text-gray-900 dark:text-white truncate">{recipe.chef}</div>
                  <div className="text-[10px] sm:text-xs font-medium text-gray-500 flex items-center gap-1.5">
                    <Clock size={10} />
                    {recipe.date}
                  </div>
                </div>
              </div>
            </div>

            <div className="relative group hidden md:block">
              <div className="absolute -inset-1 bg-gradient-to-r from-orange-500 to-amber-500 rounded-2xl blur opacity-25 group-hover:opacity-40 transition duration-1000 group-hover:duration-200"></div>
              <img
                src={recipe.image || "https://images.unsplash.com/photo-1604908176997-43149b0a7c0c"}
                alt={recipe.recipe}
                className="relative w-full h-32 lg:h-40 object-cover rounded-xl shadow-lg border border-white dark:border-gray-800"
              />
            </div>
          </div>

          {/* Summary Cards */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <SummaryCard icon={LayoutGrid} label="Ingredients" value={ingredients.length} />
            <SummaryCard icon={Activity} label="Temperature" value={`${recipe.temp}°C`} />
            <SummaryCard icon={Shield} label="Version" value={recipe.version} />
            <SummaryCard icon={Clock} label="Time" value={`${recipe.timing} min`} />
          </div>

          {/* Ingredients Section */}
          <section>
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-black uppercase tracking-widest text-gray-400">Ingredients</h3>
              <span className="text-[10px] font-bold bg-gray-100 dark:bg-gray-800 px-2 py-1 rounded-full text-gray-500">
                {ingredients.length} Total
              </span>
            </div>
            {ingredients.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {ingredients.map((ing, idx) => (
                  <div 
                    key={idx} 
                    className="flex justify-between items-center px-4 py-3 bg-white dark:bg-gray-800/20 border border-gray-100 dark:border-gray-800 rounded-xl transition-all hover:border-orange-200 dark:hover:border-orange-900/40"
                  >
                    <span className="text-sm font-bold text-gray-700 dark:text-gray-300">{ing.name}</span>
                    <span className="text-xs font-black text-orange-500 bg-orange-50 dark:bg-orange-900/20 px-2 py-1 rounded-lg">
                      {ing.quantity} {ing.unit}
                    </span>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-xs font-medium text-gray-400 italic">No ingredients recorded.</div>
            )}
          </section>

          {/* Audit & Sensory Section */}
          <section className="space-y-8">
            <div className="flex justify-between items-end border-b border-gray-100 dark:border-gray-800 pb-6">
              <div className="flex flex-col gap-2">
                <div className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">REVIEWED BY</div>
                <div className="text-xs font-black text-gray-900 dark:text-white bg-gray-100 dark:bg-gray-800 px-4 py-1.5 rounded-lg w-fit">
                  {reviewData.reviewedBy}
                </div>
              </div>
              <div className="text-xs font-bold text-gray-400">
                {reviewData.reviewedDate}
              </div>
            </div>

            <div>
              <h3 className="text-xs sm:text-sm font-bold text-gray-400 uppercase tracking-widest mb-4 sm:mb-6">Sensory Scores</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-y-4 sm:gap-y-6 gap-x-8 sm:gap-x-12">
                {sensoryLabels.map(({ key, label }) => {
                  const val = reviewData.sensoryScores[key];
                  return (
                    <div key={key} className="flex justify-between items-center group border-b border-gray-50 dark:border-gray-800 sm:border-0 pb-2 sm:pb-0">
                      <span className="text-sm font-medium text-gray-600 dark:text-gray-400 group-hover:text-gray-900 dark:group-hover:text-white transition-colors">{label}</span>
                      <span className="text-sm font-black text-orange-500 whitespace-nowrap">{val ? `${val}/10` : "—"}</span>
                    </div>
                  );
                })}
              </div>
            </div>
          </section>

          {/* General Feedback Questions */}
          <section className="space-y-6">
            <h3 className="text-sm font-bold text-gray-400 uppercase tracking-widest">General Feedback Questions</h3>
            <div className="space-y-6">
              {STATIC_QUESTIONS.map((q, idx) => {
                const answer = reviewData.answers?.[q.id];
                return (
                  <div key={q.id} className="space-y-3 pb-6 border-b border-gray-50 dark:border-gray-800/50 last:border-0 last:pb-0">
                    <p className="text-sm font-black text-gray-900 dark:text-white leading-snug">
                      Q{idx + 1}. {q.question}
                    </p>
                    <div className="text-sm text-gray-600 dark:text-gray-300 font-medium leading-relaxed bg-gray-50/50 dark:bg-gray-900/30 p-4 rounded-2xl border border-gray-100 dark:border-transparent">
                      {answer ? (
                        typeof answer === 'number' ? (
                          <div className="flex items-center gap-1 text-yellow-500">
                            {[...Array(5)].map((_, i) => (
                              <Star key={i} size={16} fill={i < answer ? "currentColor" : "none"} className={i < answer ? "text-yellow-500" : "text-gray-200 dark:text-gray-700"} />
                            ))}
                          </div>
                        ) : (
                          <span className="leading-relaxed block">{answer}</span>
                        )
                      ) : (
                        <span className="text-gray-400 italic">—</span>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </section>

          {/* Output Details */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="p-6 bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700 rounded-3xl shadow-sm">
              <div className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-4">EXPECTED OUTPUT</div>
              <div className="text-xl font-black text-gray-400 uppercase">
                {recipe.expOutputValue ? `${recipe.expOutputValue} ${recipe.expOutputUnit}` : "—"}
              </div>
            </div>
            <div className="p-6 bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700 rounded-3xl shadow-sm">
              <div className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-4">ACTUAL OUTPUT</div>
              <div className="text-xl font-black text-gray-400 uppercase">
                {recipe.actOutputValue ? `${recipe.actOutputValue} ${recipe.actOutputUnit}` : "—"}
              </div>
            </div>
          </div>

          {/* Remarks Section */}
          <section className="space-y-4">
            <h3 className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">CHEF NOTES / REMARKS</h3>
            <div className="p-6 bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700 rounded-3xl text-sm font-bold text-gray-600 dark:text-gray-300 leading-relaxed shadow-sm">
              {recipe.remarks || reviewData.remarks || "No additional remarks recorded."}
            </div>
          </section>
        </div>
      </div>
    </div>
  );
};

const VersionListModal = ({
  versions,
  baseName,
  onClose,
  onSelect,
  canSelect = true,
}) => {
  if (!versions) return null;

  return (
    <div className="fixed inset-0 z-[150] flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm animate-fade-in">
      <div className="w-full max-w-2xl max-h-[85vh] overflow-y-auto bg-white dark:bg-gray-900 rounded-2xl shadow-2xl relative animate-slide-up no-scrollbar">
        {/* Header */}
        <div className="sticky top-0 z-30 bg-white dark:bg-gray-900 px-5 py-4 border-b border-gray-100 dark:border-gray-800 flex items-center justify-between shadow-sm">
          <div className="flex flex-col min-w-0 pr-4">
            <h2 className="text-lg font-bold text-gray-900 dark:text-white tracking-tight">Recipe History</h2>
            <p className="text-[10px] sm:text-xs font-medium text-gray-400 truncate uppercase tracking-wider">{baseName}</p>
          </div>
          <button
            onClick={onClose}
            className="p-2 bg-gray-50 dark:bg-gray-800 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-xl transition-all text-gray-400 hover:text-gray-900 dark:hover:text-white border border-gray-100 dark:border-gray-700"
          >
            <X size={18} />
          </button>
        </div>

        <div className="p-4 sm:p-6">
          <div className="space-y-4">
            {versions.map((ver) => (
              <div
                key={ver.id}
                className="group flex flex-col sm:flex-row sm:items-center justify-between p-4 sm:p-5 bg-gray-50 dark:bg-gray-800/40 border border-gray-100 dark:border-gray-800 rounded-2xl transition-all hover:bg-white dark:hover:bg-gray-800 hover:shadow-xl hover:shadow-orange-500/5 hover:border-orange-500/30 gap-4"
              >
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl bg-white dark:bg-gray-900 flex items-center justify-center border border-gray-100 dark:border-gray-800 text-orange-500 text-xs sm:text-sm font-bold shadow-sm group-hover:bg-orange-500 group-hover:text-white transition-all">
                    {ver.version}
                  </div>
                  <div className="min-w-0">
                    <div className="text-sm font-bold text-gray-900 dark:text-white group-hover:text-orange-600 dark:group-hover:text-orange-400 transition-colors truncate">
                      {ver.recipe}
                    </div>
                    <div className="text-[10px] font-medium text-gray-400 uppercase tracking-widest mt-1.5 flex flex-wrap items-center gap-2">
                       <span className="flex items-center gap-1.5"><Clock size={10} /> {ver.date}</span>
                       <span className="text-gray-200 dark:text-gray-700">|</span>
                       <StatusBadge status={ver.status} />
                    </div>
                  </div>
                </div>

                <div className="flex items-center justify-between sm:justify-end gap-6 sm:gap-8 pt-4 sm:pt-0 border-t sm:border-t-0 border-gray-100 dark:border-gray-800/50">
                  {ver.status === "Completed" && (
                    <div className="text-left sm:text-right">
                      <div className="text-base sm:text-lg font-bold text-orange-500 leading-none mb-1">
                        {ver.aiScore}%
                      </div>
                      <div className="text-[9px] font-bold text-gray-400 tracking-tighter">AI SCORE</div>
                    </div>
                  )}
                  
                  <button
                    onClick={() => onSelect(ver)}
                    disabled={!canSelect}
                    className="flex-1 sm:flex-none px-6 py-2.5 bg-orange-500 hover:bg-orange-600 disabled:bg-gray-200 dark:disabled:bg-gray-800 text-white text-[10px] font-bold uppercase tracking-widest rounded-xl shadow-lg shadow-orange-500/20 transition-all active:scale-95"
                  >
                    VIEW
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

const RecipeDetailModal = ExperimentDetailModal;
const VersionDetailModal = ExperimentDetailModal;

export default function AllRecipesPage() {
  const role = localStorage.getItem("ck_role");
  const showAiScoreInDetails = role !== "Chef";
  const canOpenVersionDetails = role !== "CRA";
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("All");
  const [viewMode, setViewMode] = useState("grid");
  const [selectedRecipe, setSelectedRecipe] = useState(null);
  const [selectedBase, setSelectedBase] = useState(null);
  const [selectedVersion, setSelectedVersion] = useState(null);
  const [page, setPage] = useState(1);
  const pageSize = 12;
  const [storedExperiments] = useState(() => {
    try {
      const raw = localStorage.getItem("ck_experiments");
      const parsed = raw ? JSON.parse(raw) : [];
      return Array.isArray(parsed) ? parsed : [];
    } catch {
      return [];
    }
  });

  const allRecipes = [...storedExperiments, ...experiments];

  const normalizeRecipeName = (name) =>
    (name || "").replace(/\sv\d+\.\d+$/i, "").trim().toLowerCase();

  const getVersionsForRecipe = (recipeName) => {
    const base = normalizeRecipeName(recipeName);
    const matched = allRecipes.filter(
      (r) => normalizeRecipeName(r.recipe) === base,
    );
    const byVersion = new Map();
    matched.forEach((r) => {
      if (!byVersion.has(r.version)) {
        byVersion.set(r.version, r);
      }
    });
    return Array.from(byVersion.values()).sort((a, b) =>
      a.version > b.version ? -1 : 1,
    );
  };

  const filteredRecipes = allRecipes.filter((recipe) => {
    const matchesSearch =
      recipe.recipe.toLowerCase().includes(searchTerm.toLowerCase()) ||
      recipe.chef.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus =
      filterStatus === "All" || recipe.status === filterStatus;
    return matchesSearch && matchesStatus;
  });

  const groupedRecipes = Object.values(
    filteredRecipes.reduce((acc, recipe) => {
      const base = normalizeRecipeName(recipe.recipe);
      if (!acc[base]) acc[base] = [];
      acc[base].push(recipe);
      return acc;
    }, {}),
  ).map((group) => {
    const sorted = [...group].sort((a, b) =>
      a.version > b.version ? -1 : 1,
    );
    const latest = sorted[0];
    const baseName = latest.recipe.replace(/\sv\d+\.\d+$/i, "");
    return {
      baseName,
      latest,
      versions: sorted,
      status:
        sorted.find((r) => r.status === "Pending")?.status ||
        latest.status,
    };
  });
  const totalPages = Math.max(1, Math.ceil(groupedRecipes.length / pageSize));
  const pageItems = groupedRecipes.slice(
    (page - 1) * pageSize,
    page * pageSize,
  );

  return (
    <div className="animate-fade-in p-4 lg:p-8 min-h-screen transition-colors duration-300 bg-[var(--app-bg)]">
      <PageHeader
        title="All Recipes"
        subtitle="Explore and manage the complete collection of cloud kitchen recipes and experiments."
      />

      {/* Filters, Search & View Toggle */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
        <div className="flex flex-col md:flex-row gap-4 flex-1">
          <div className="relative flex-1 max-w-md">
            <Search
              className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--muted)]"
              size={18}
            />
            <input
              type="text"
              placeholder="Search recipes or chefs..."
              className="w-full pl-10 pr-4 py-2.5 bg-[var(--surface)] border border-[var(--border)] text-[var(--text)] rounded-xl focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 outline-none transition-all text-sm shadow-sm font-sans"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>

        {/* View Toggle Buttons */}
        <div className="flex items-center bg-[var(--surface)] border border-[var(--border)] rounded-xl p-1 shadow-sm">
          <button
            onClick={() => setViewMode("grid")}
            className={`p-2 rounded-lg transition-all ${viewMode === "grid" ? "bg-orange-500 text-white shadow-md" : "text-[var(--muted)] hover:bg-[var(--surface-hover)]"}`}
          >
            <LayoutGrid size={18} />
          </button>
          <button
            onClick={() => setViewMode("table")}
            className={`p-2 rounded-lg transition-all ${viewMode === "table" ? "bg-orange-500 text-white shadow-md" : "text-[var(--muted)] hover:bg-[var(--surface-hover)]"}`}
          >
            <List size={18} />
          </button>
        </div>
      </div>

      {/* Grid View */}
      {viewMode === "grid" && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {pageItems.map((item) => (
            <div
              key={item.baseName}
              className="group bg-[var(--surface)] border border-[var(--border)] rounded-2xl overflow-hidden hover:border-orange-500/30 hover:shadow-xl hover:shadow-orange-500/5 transition-all duration-300 flex flex-col shadow-sm"
            >
              {/* Minimalist Card Header */}
              <div className="p-5 flex-1">
                <div className="flex items-center justify-end mb-4">
                  <span className="text-[10px] font-mono tracking-tighter text-[var(--muted)]">
                    {item.latest.id}
                  </span>
                </div>

                <h3 className="text-lg font-bold mb-2 truncate group-hover:text-orange-500 transition-colors text-[var(--text)]">
                  {item.baseName}
                </h3>

                <div className="flex items-center gap-2 mb-4">
                  <div className="w-6 h-6 rounded-full bg-orange-500/20 flex items-center justify-center text-[10px] font-bold text-orange-500">
                    {item.latest.chef
                      .split(" ")
                      .map((n) => n[0])
                      .join("")}
                  </div>
                  <span className="text-xs font-medium text-[var(--muted)]">
                    {item.latest.chef}
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-3 pb-4 border-b border-[var(--border)]">
                  <div className="flex items-center gap-2">
                    <Clock size={14} className="text-[var(--muted)]" />
                    <span className="text-xs font-semibold text-[var(--subtle)]">
                      {item.latest.timing}m
                    </span>
                  </div>
                  {item.latest.status === "Completed" && (
                    <div className="flex items-center gap-2">
                      <Star size={14} className="text-[var(--muted)]" />
                      <span className="text-xs font-semibold text-[var(--subtle)]">
                        {item.latest.aiScore}%
                      </span>
                    </div>
                  )}
                </div>
              </div>

              {/* Card Footer */}
              <div className="px-5 py-4 flex items-center justify-between border-t bg-[var(--bg)] border-[var(--border)]">
                <div className="flex flex-col">
                  <span className="text-[10px] uppercase tracking-widest font-bold text-[var(--muted)]">
                    Created On
                  </span>
                  <span className="text-xs font-semibold text-[var(--text)]">
                    {item.latest.date}
                  </span>
                </div>
                <button
                  onClick={() => {
                    const versions = getVersionsForRecipe(item.latest.recipe);
                    setSelectedBase({
                      name: item.baseName,
                      versions,
                    });
                  }}
                  className="p-2 border bg-[var(--surface)] border-[var(--border)] text-[var(--muted)] hover:bg-orange-500 hover:text-white rounded-lg transition-all duration-300 shadow-sm"
                >
                  <ArrowRight size={16} />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Table View */}
      {viewMode === "table" && (
        <div className="bg-[var(--surface)] border border-[var(--border)] rounded-2xl overflow-hidden shadow-sm">
          <div className="overflow-x-auto">
            <table className="table">
              <thead>
                <tr>
                  {[
                    "ID",
                    "Recipe Name",
                    "Chef",
                    "Timing",
                    "AI Score",
                    "Date",
                    "Action",
                  ].map((h) => (
                    <th key={h}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {pageItems.map((item) => (
                  <tr key={item.baseName} className="table-row">
                    <td className="table-cell-primary table-cell-mono">
                      {item.latest.id}
                    </td>
                    <td className="font-semibold">{item.baseName}</td>
                    <td>
                      <div className="flex items-center gap-2">
                        <div className="w-6 h-6 rounded-full bg-orange-500/20 flex items-center justify-center text-[10px] font-bold text-orange-500">
                          {item.latest.chef
                            .split(" ")
                            .map((n) => n[0])
                            .join("")}
                        </div>
                        <span className="text-xs">{item.latest.chef}</span>
                      </div>
                    </td>
                    <td>
                      <span className="font-semibold">{item.latest.timing}m</span>
                    </td>
                    <td>
                      <span className="font-bold text-orange-500">
                        {item.latest.status === "Completed" ? `${item.latest.aiScore}%` : "—"}
                      </span>
                    </td>
                    <td className="table-cell-muted font-mono">
                      {item.latest.date}
                    </td>
                    <td>
                      <button
                        onClick={() => {
                          const versions = getVersionsForRecipe(item.latest.recipe);
                          setSelectedBase({
                            name: item.baseName,
                            versions,
                          });
                        }}
                        className="p-1.5 border bg-[var(--bg)] border-[var(--border)] text-[var(--muted)] hover:bg-orange-500 hover:text-white rounded-lg transition-all duration-300"
                      >
                        <ArrowRight size={14} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Modal */}
      {selectedRecipe && (
        <RecipeDetailModal
          recipe={selectedRecipe}
          onClose={() => setSelectedRecipe(null)}
          showAiScore={showAiScoreInDetails}
        />
      )}

      {selectedBase && (
        <VersionListModal
          baseName={selectedBase.name}
          versions={selectedBase.versions}
          onClose={() => setSelectedBase(null)}
          onSelect={(version) => {
            if (canOpenVersionDetails) setSelectedVersion(version);
          }}
          canSelect={canOpenVersionDetails}
        />
      )}

      {canOpenVersionDetails && selectedVersion && (
        <VersionDetailModal
          recipe={selectedVersion}
          onClose={() => setSelectedVersion(null)}
          showAiScore={showAiScoreInDetails}
        />
      )}

      {filteredRecipes.length === 0 && (
        <div className="py-20 flex flex-col items-center justify-center text-center">
          <div className="w-16 h-16 border border-[var(--border)] bg-[var(--surface)] text-[var(--muted)] rounded-full flex items-center justify-center mb-4 shadow-sm">
            <ChefHat size={32} />
          </div>
          <h3 className="text-lg font-bold text-[var(--text)]">
            No recipes found
          </h3>
          <p className="max-w-xs mt-2 text-sm italic text-[var(--muted)]">
            Try adjusting your search or filters to find what you're looking for.
          </p>
        </div>
      )}

      {groupedRecipes.length > 0 && (
        <div className="flex items-center justify-center gap-3 mt-8">
          <button
            onClick={() => setPage((p) => Math.max(1, p - 1))}
            className={`btn-ghost px-3 py-1.5 ${page === 1 ? "opacity-60" : "opacity-100"}`}
            disabled={page === 1}
          >
            Prev
          </button>
          <span className="text-xs text-[var(--muted)]">
            Page {page} / {totalPages}
          </span>
          <button
            onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
            className={`btn-ghost px-3 py-1.5 ${page === totalPages ? "opacity-60" : "opacity-100"}`}
            disabled={page === totalPages}
          >
            Next
          </button>
        </div>
      )}
    </div>
  );
}

