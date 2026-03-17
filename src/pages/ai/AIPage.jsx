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
} from "lucide-react";
import Card from "../../components/ui/Card";
import StatCard from "../../components/ui/StatCard";
import StatusBadge from "../../components/ui/StatusBadge";
import PageHeader from "../../components/ui/PageHeader";
import { aiAnalysis } from "../../data/dummy";

const FilterDropdown = ({ label, icon: Icon, options, selectedValue, onChange, iconColor = "var(--primary)" }) => {
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
          ${isOpen ? 'border-orange-500 ring-2 ring-orange-500/10' : 'border-gray-200 dark:border-gray-700 hover:border-orange-400'}`}
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
            <span className={`text-sm font-bold truncate ${isAllSelected ? 'text-gray-700 dark:text-gray-200' : 'text-gray-400'}`}>
              {isAllSelected ? label : ""}
            </span>
          </div>
        </div>
        <ChevronDown size={14} className={`text-gray-400 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      {isOpen && (
        <div className="absolute top-full left-0 mt-2 w-full min-w-[240px] bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 rounded-2xl shadow-2xl z-[100] overflow-hidden animate-in fade-in slide-in-from-top-2 duration-200">
          <div className="p-2 max-h-[300px] overflow-y-auto no-scrollbar">
            {options.map((option) => {
              const isSelected = selectedValue === option;
              const isAll = option.startsWith("All");
              const initials = option.split(' ').map(n => n[0]).join('').substring(0, 2);

              return (
                <div
                  key={option}
                  onClick={() => handleSelect(option)}
                  className={`flex items-center justify-between px-3 py-2.5 rounded-xl cursor-pointer transition-all duration-150 mb-1 last:mb-0
                    ${isSelected 
                      ? 'bg-orange-50 dark:bg-orange-900/20 text-orange-600 dark:text-orange-400 shadow-sm' 
                      : 'hover:bg-gray-50 dark:hover:bg-gray-800 text-gray-700 dark:text-gray-300'}`}
                >
                  <div className="flex items-center gap-3">
                    {!isAll ? (
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center text-[11px] font-black shadow-sm
                        ${isSelected ? 'bg-orange-500 text-white' : 'bg-orange-100 dark:bg-orange-900/30 text-orange-600 dark:text-orange-400'}`}>
                        {initials}
                      </div>
                    ) : (
                      <div className="w-8 h-8 rounded-full bg-gray-100 dark:bg-gray-800 flex items-center justify-center">
                        <Icon size={14} className="text-gray-400" />
                      </div>
                    )}
                    <span className={`text-sm ${isSelected ? 'font-bold' : 'font-semibold'}`}>{option}</span>
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
  const chefs = ["All Chefs", ...new Set(aiAnalysis.map(a => a.submittedBy).filter(Boolean))];
  const reviewers = ["All Reviewers", ...new Set(aiAnalysis.map(a => a.reviewedBy).filter(Boolean))];

  const filtered = aiAnalysis.filter((a) => {
    const matchesSearch =
      a.recipe.toLowerCase().includes(search.toLowerCase()) ||
      a.id.toLowerCase().includes(search.toLowerCase());
    const matchesChef = chefFilter === "All Chefs" || a.submittedBy === chefFilter;
    const matchesReviewer = reviewerFilter === "All Reviewers" || a.reviewedBy === reviewerFilter;
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
      <Card style={{ marginBottom: 20, padding: 24 }}>
        {/* Header */}
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "flex-start",
            marginBottom: 20,
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
            <div className="relative group">
              <div className="absolute -inset-0.5 bg-gradient-to-r from-orange-500 to-amber-500 rounded-xl blur opacity-20 group-hover:opacity-40 transition-all"></div>
              <img 
                src={data.image || "https://images.unsplash.com/photo-1604908176997-43149b0a7c0c"} 
                alt={data.recipe}
                className="relative w-16 h-16 rounded-xl object-cover border border-white/10 shadow-sm"
              />
            </div>
            <div>
              <div
                style={{ fontSize: 18, fontWeight: 800, color: "var(--text)" }}
              >
                {data.recipe}
              </div>
              <div
                style={{
                  fontSize: 13,
                  color: "var(--muted)",
                  display: "flex",
                  gap: 8,
                }}
              >
                <span className="bg-gray-100 dark:bg-gray-800 px-1.5 py-0.5 rounded text-[11px] font-bold">{data.id}</span>
                <span>•</span>
                <span>Batch: {data.batchNo}</span>
                <span>•</span>
                <span>{data.date}</span>
              </div>
            </div>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: 6,
                padding: "4px 10px",
                background: "var(--bg)",
                borderRadius: 20,
                border: "1px solid var(--border)",
                fontSize: 11,
                fontWeight: 700,
                color: "var(--muted)",
              }}
            >
              <div
                style={{
                  width: 6,
                  height: 6,
                  borderRadius: "50%",
                  background:
                    data.risk === "Low" ? "var(--success)" : "var(--warning)",
                }}
              />
              Risk: {data.risk}
            </div>
            <StatusBadge status={data.status} />
            <button
              onClick={() => setExpanded(!expanded)}
              style={{
                width: 32,
                height: 32,
                borderRadius: 8,
                border: "none",
                background: "var(--primary-glow)",
                color: "var(--primary)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                cursor: "pointer",
                transition: "all 0.2s",
                marginLeft: 4,
                transform: expanded ? "rotate(180deg)" : "none",
              }}
            >
              <ChevronDown size={14} />
            </button>
          </div>
        </div>

        {/* Metric Grid 1 */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(6, 1fr)",
            gap: 12,
            marginBottom: 24,
          }}
        >
          <MetricBox label="Temp" value={data.temp} icon={Thermometer} />
          <MetricBox label="Timing" value={data.timing} icon={Clock} />
          <MetricBox
            label="Exp. Texture"
            value={data.expTexture}
            icon={FlaskConical}
          />
          <MetricBox
            label="Act. Texture"
            value={data.actTexture}
            icon={Layers}
            color={
              data.expTexture !== data.actTexture
                ? "var(--warning)"
                : "var(--success)"
            }
          />
          <MetricBox label="Exp. Yield" value={data.expYield} icon={Zap} />
          <MetricBox label="Act. Yield" value={data.actYield} icon={Activity} />
        </div>

        {/* AI Variance Analysis Section */}
        <div style={{ marginBottom: expanded ? 24 : 0 }}>
          <div
            style={{
              fontSize: 12,
              fontWeight: 700,
              color: "var(--muted)",
              textTransform: "uppercase",
              letterSpacing: 0.5,
              marginBottom: 12,
            }}
          >
            AI Variance Analysis
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 20 }}>
            <div style={{ fontSize: 32, fontWeight: 900, color: barColor }}>
              {data.variance}%
            </div>
            <div style={{ flex: 1 }}>
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 6,
                  marginBottom: 8,
                  fontSize: 13,
                  fontWeight: 600,
                  color: "var(--text)",
                }}
              >
                {data.variance < 5 ? (
                  <CheckCircle2 size={14} color="var(--success)" />
                ) : (
                  <AlertCircle size={14} color="var(--warning)" />
                )}
                {data.varianceStatus}
              </div>
              <div
                style={{
                  height: 8,
                  background: "var(--border)",
                  borderRadius: 4,
                  width: "100%",
                  position: "relative",
                }}
              >
                <div
                  style={{
                    height: "100%",
                    background: barColor,
                    borderRadius: 4,
                    width: `${Math.min(100, data.variance * 2)}%`,
                    transition: "width 0.5s ease",
                  }}
                />
              </div>
            </div>
          </div>
        </div>

        {expanded && (
          <div style={{ animation: "fadeIn 0.3s ease-out" }}>
            {/* Metric Grid 2 */}
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(4, 1fr)",
                gap: 12,
                marginBottom: 24,
              }}
            >
              <MetricBox
                label="Exp. Taste"
                value={`★ ${data.expTaste}`}
                icon={Star}
              />
              <MetricBox
                label="Act. Taste"
                value={`★ ${data.actTaste}`}
                icon={Star}
                color="var(--primary)"
              />
              <MetricBox
                label="Submitted by"
                value={data.submittedBy}
                icon={User}
              />
              <MetricBox
                label="Recipe Ver."
                value={data.version}
                icon={FileText}
              />
            </div>

            {/* Attached Files & Remarks */}
            <div
              style={{
                borderTop: "1px solid var(--border)",
                paddingTop: 20,
                display: "flex",
                flexDirection: "column",
                gap: 16,
              }}
            >
              <div>
                <div
                  style={{
                    fontSize: 12,
                    fontWeight: 700,
                    color: "var(--muted)",
                    textTransform: "uppercase",
                    letterSpacing: 0.5,
                    marginBottom: 8,
                  }}
                >
                  Attached Files
                </div>
                <div style={{ display: "flex", gap: 8 }}>
                  {data.files.map((f) => (
                    <div
                      key={f}
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: 6,
                        padding: "6px 12px",
                        background: "var(--bg)",
                        border: "1px solid var(--border)",
                        borderRadius: 8,
                        fontSize: 12,
                        color: "var(--text)",
                        fontWeight: 500,
                      }}
                    >
                      <FileText size={14} color="var(--primary)" />
                      {f}
                    </div>
                  ))}
                </div>
              </div>
              <div>
                <div
                  style={{
                    fontSize: 12,
                    fontWeight: 700,
                    color: "var(--muted)",
                    textTransform: "uppercase",
                    letterSpacing: 0.5,
                    marginBottom: 8,
                  }}
                >
                  Reviewer Remarks
                </div>
                <div
                  style={{
                    padding: "12px 16px",
                    background: "var(--bg)",
                    border: "1px solid var(--border)",
                    borderRadius: 10,
                    fontSize: 13,
                    color: "var(--muted)",
                    lineHeight: 1.5,
                  }}
                >
                  {data.remarks}
                </div>
              </div>
            </div>
          </div>
        )}
      </Card>
    );
  };

  const MetricBox = ({ label, value, icon: Icon, color = "var(--text)" }) => (
    <div
      style={{
        background: "var(--bg)",
        border: "1px solid var(--border)",
        borderRadius: 12,
        padding: "12px 14px",
      }}
    >
      <div
        style={{
          fontSize: 11,
          color: "var(--muted)",
          fontWeight: 600,
          textTransform: "uppercase",
          marginBottom: 6,
          display: "flex",
          alignItems: "center",
          gap: 4,
        }}
      >
        <Icon size={12} color="var(--muted)" />
        {label}
      </div>
      <div style={{ fontSize: 14, fontWeight: 700, color }}>{value}</div>
    </div>
  );

  return (
    <div style={{ animation: "fadeIn 0.3s ease-out" }}>
      <PageHeader
        title="AI Analysis"
        subtitle="Approve or reject experiments based on granular AI variance data."
      />

      {/* Top Stat Row */}
      {role === "Manager" && (
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(4,1fr)",
            gap: 16,
            marginBottom: 24,
          }}
        >
          <StatCard
            icon={<Zap size={20} />}
            label="Yield Pred."
            value="94.8%"
            trend="1.2%"
            trendUp
            sub="Avg. Performance"
          />
          <StatCard
            icon={<Star size={20} />}
            label="Texture Match Rate"
            value="91%"
            trend="3.8%"
            trendUp
            sub="AI accuracy"
          />
          <StatCard
            icon={<Shield size={20} />}
            label="Total Predictions"
            value="156"
            sub="All time"
          />
          <StatCard
            icon={<Activity size={20} />}
            label="Total Experiments"
            value={aiAnalysis.length}
            sub="Analyzed items"
          />
        </div>
      )}

      {/* Toolbar & Filters */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: 20,
        }}
      >
        <div style={{ fontSize: 15, fontWeight: 700, color: "var(--text)" }}>
          {filtered.length} experiments results
        </div>
      </div>

      <div style={{ marginBottom: 24, display: "flex", gap: 12, flexWrap: "wrap", alignItems: "center" }}>
        {/* Search Input */}
        <div style={{ position: "relative", flex: 2, minWidth: 300 }}>
          <Search
            size={16}
            style={{
              position: "absolute",
              left: 14,
              top: "50%",
              transform: "translateY(-50%)",
              color: "var(--muted)",
            }}
          />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search experiments by name or ID..."
            className="input-field"
            style={{ 
              paddingLeft: 42, 
              height: 44,
              fontSize: 14,
              borderRadius: 12,
              background: "var(--surface)",
              boxShadow: "0 2px 4px rgba(0,0,0,0.02)"
            }}
          />
        </div>

        {/* Chef Filter */}
        <FilterDropdown 
          label="Chef"
          icon={ChefHat}
          options={chefs}
          selectedValue={chefFilter}
          onChange={setChefFilter}
          iconColor="var(--primary)"
        />

        {/* Reviewer Filter */}
        <FilterDropdown 
          label="Reviewer"
          icon={ShieldCheck}
          options={reviewers}
          selectedValue={reviewerFilter}
          onChange={setReviewerFilter}
          iconColor="var(--indigo-500)"
        />

        <button
          className="btn-primary"
          style={{ 
            display: "flex", 
            alignItems: "center", 
            gap: 8,
            height: 44,
            padding: "0 20px",
            borderRadius: 12,
            boxShadow: "0 4px 12px var(--primary-glow)"
          }}
        >
          <Download size={16} /> Export Report
        </button>
      </div>

      {/* Experiment List */}
      <div>
        {filtered.map((e) => (
          <ExperimentCard key={e.id} data={e} />
        ))}
        {filtered.length === 0 && (
          <div
            style={{
              padding: 60,
              textAlign: "center",
              color: "var(--muted)",
              background: "var(--surface)",
              borderRadius: 16,
              border: "1px dashed var(--border)",
            }}
          >
            No experiments found matching your criteria.
          </div>
        )}
      </div>
    </div>
  );
}
