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
      <div style={{ display: "flex", gap: 4 }}>
        {[1, 2, 3, 4, 5].map((s) => (
          <Star
            key={s}
            size={18}
            fill={s <= value ? "#f59e0b" : "transparent"}
            color={s <= value ? "#f59e0b" : "var(--border)"}
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
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          {answer === "yes" ? (
            <>
              <ThumbsUp size={16} style={{ color: "var(--success)" }} />
              <span style={{ fontWeight: 700, color: "var(--success)" }}>
                Yes
              </span>
            </>
          ) : (
            <>
              <ThumbsDown size={16} style={{ color: "var(--danger)" }} />
              <span style={{ fontWeight: 700, color: "var(--danger)" }}>
                No
              </span>
            </>
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
    <div style={{ animation: "fadeIn 0.4s ease-out" }}>
      <PageHeader
        title="Submit Feedbacks"
        subtitle="View and track all quality reviews by status."
        actions={[
          <div key="stats" style={{ display: "flex", gap: 12 }}>
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: 8,
                padding: "8px 16px",
                background: "var(--warning-glow)",
                borderRadius: 10,
                border: "1px solid rgba(245,158,11,0.2)",
                fontSize: 13,
                fontWeight: 700,
                color: "var(--warning)",
              }}
            >
              <Clock size={16} /> {pendingCount} Pending
            </div>
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: 8,
                padding: "8px 16px",
                background: "var(--success-glow)",
                borderRadius: 10,
                border: "1px solid rgba(34,197,94,0.2)",
                fontSize: 13,
                fontWeight: 700,
                color: "var(--success)",
              }}
            >
              <CheckCircle size={16} /> {completedCount} Completed
            </div>
          </div>,
        ]}
      />

      {/* Search & Filter Bar */}
      <Card style={{ marginBottom: 24 }}>
        <div
          style={{
            display: "flex",
            gap: 16,
            alignItems: "center",
            flexWrap: "wrap",
          }}
        >
          <div style={{ flex: 1, minWidth: 250, position: "relative" }}>
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
              type="text"
              placeholder="Search by recipe, ID, or chef..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="input-field"
              style={{ paddingLeft: 40, fontSize: 14, width: "100%" }}
            />
          </div>

          <div
            style={{
              display: "flex",
              gap: 6,
              padding: 4,
              background: "var(--bg-subtle)",
              borderRadius: 12,
            }}
          >
            {statusTabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setStatusFilter(tab.id)}
                style={{
                  padding: "8px 16px",
                  borderRadius: 8,
                  border: "none",
                  background:
                    statusFilter === tab.id ? "var(--primary)" : "transparent",
                  color: statusFilter === tab.id ? "white" : "var(--muted)",
                  fontWeight: 700,
                  fontSize: 13,
                  cursor: "pointer",
                  transition: "all 0.2s",
                  display: "flex",
                  alignItems: "center",
                  gap: 6,
                }}
              >
                {tab.label}
                <span
                  style={{
                    background:
                      statusFilter === tab.id
                        ? "rgba(255,255,255,0.25)"
                        : "var(--border)",
                    padding: "2px 8px",
                    borderRadius: 20,
                    fontSize: 11,
                    fontWeight: 800,
                  }}
                >
                  {tab.count}
                </span>
              </button>
            ))}
          </div>
        </div>
      </Card>

      {/* Reviews List */}
      <Card noPad>
        {/* Table Header */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: tableColumns,
            gap: 16,
            padding: "16px 24px",
            borderBottom: "2px solid var(--border)",
            fontSize: 11,
            fontWeight: 700,
            color: "var(--muted)",
            textTransform: "uppercase",
            letterSpacing: "0.05em",
          }}
        >
          <span>Experiment</span>
          <span>Chef</span>
          <span>Date</span>
          <span>Time</span>
          {showAIScore && <span>AI Score</span>}
          <span>Status</span>
          <span></span>
        </div>

        {filteredExperiments.length === 0 ? (
          <div
            style={{
              padding: "60px 40px",
              textAlign: "center",
              color: "var(--muted)",
            }}
          >
            <Search size={40} style={{ opacity: 0.2, marginBottom: 16 }} />
            <div style={{ fontSize: 15, fontWeight: 600 }}>
              No reviews found
            </div>
            <div style={{ fontSize: 13, marginTop: 4 }}>
              Try adjusting your search or filter.
            </div>
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
                  style={{
                    display: "grid",
                    gridTemplateColumns: tableColumns,
                    gap: 16,
                    padding: "18px 24px",
                    borderBottom: isExpanded
                      ? "none"
                      : "1px solid var(--border)",
                    cursor: "pointer",
                    transition: "all 0.2s",
                    background: isExpanded
                      ? "var(--primary-glow)"
                      : "transparent",
                    borderLeft: isExpanded
                      ? "4px solid var(--primary)"
                      : "4px solid transparent",
                  }}
                  onMouseEnter={(e) => {
                    if (!isExpanded)
                      e.currentTarget.style.background = "var(--bg-subtle)";
                  }}
                  onMouseLeave={(e) => {
                    if (!isExpanded)
                      e.currentTarget.style.background = "transparent";
                  }}
                >
                  <div>
                    <div
                      style={{
                        fontSize: 14,
                        fontWeight: 700,
                        color: "var(--text)",
                        marginBottom: 2,
                      }}
                    >
                      {exp.recipe}
                    </div>
                    <div
                      style={{
                        fontSize: 12,
                        color: "var(--muted)",
                        fontWeight: 500,
                      }}
                    >
                      {exp.id} • Batch {exp.batchNo}
                    </div>
                  </div>

                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      fontSize: 13,
                      fontWeight: 600,
                      color: "var(--text)",
                    }}
                  >
                    {exp.chef}
                  </div>

                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: 6,
                      fontSize: 13,
                      color: "var(--muted)",
                    }}
                  >
                    <Calendar size={13} />
                    {exp.date}
                  </div>

                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      fontSize: 13,
                      color: "var(--muted)",
                    }}
                  >
                    {exp.time || "—"}
                  </div>

                  {showAIScore && (
                    <div style={{ display: "flex", alignItems: "center" }}>
                      {exp.status === "Completed" ? (
                        <div
                          style={{
                            padding: "4px 12px",
                            borderRadius: 8,
                            background: `${getAiScoreColor(exp.aiScore)}15`,
                            color: getAiScoreColor(exp.aiScore),
                            fontWeight: 800,
                            fontSize: 13,
                            border: `1px solid ${getAiScoreColor(exp.aiScore)}30`,
                          }}
                        >
                          {exp.aiScore}/100
                        </div>
                      ) : (
                        <span
                          style={{ color: "var(--muted)", fontWeight: 700 }}
                        >
                          —
                        </span>
                      )}
                    </div>
                  )}

                  <div style={{ display: "flex", alignItems: "center" }}>
                    <StatusBadge status={exp.status} />
                  </div>

                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      color: "var(--muted)",
                      transition: "transform 0.3s",
                      transform: isExpanded ? "rotate(180deg)" : "rotate(0deg)",
                    }}
                  >
                    <ChevronDown size={18} />
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
                      style={{ overflow: "hidden" }}
                    >
                      <div
                        style={{
                          padding: "24px 28px 28px",
                          background: "var(--bg-subtle)",
                          borderBottom: "2px solid var(--primary)",
                        }}
                      >
                        {/* Experiment Info Grid */}
                        <div
                          style={{
                            display: "grid",
                            gridTemplateColumns: "repeat(5, 1fr)",
                            gap: 20,
                            padding: "20px",
                            background: "var(--card-bg)",
                            borderRadius: 16,
                            border: "1px solid var(--border)",
                            marginBottom: 24,
                          }}
                        >
                          <div>
                            <div
                              style={{
                                fontSize: 11,
                                color: "var(--muted)",
                                textTransform: "uppercase",
                                fontWeight: 700,
                                marginBottom: 6,
                              }}
                            >
                              Ingredients
                            </div>
                            <div style={{ fontSize: 15, fontWeight: 700 }}>
                              {getIngredientText(exp)}
                            </div>
                          </div>
                          <div>
                            <div
                              style={{
                                fontSize: 11,
                                color: "var(--muted)",
                                textTransform: "uppercase",
                                fontWeight: 700,
                                marginBottom: 6,
                              }}
                            >
                              Temperature
                            </div>
                            <div style={{ fontSize: 15, fontWeight: 700 }}>
                              {exp.temp}°C
                            </div>
                          </div>
                          <div>
                            <div
                              style={{
                                fontSize: 11,
                                color: "var(--muted)",
                                textTransform: "uppercase",
                                fontWeight: 700,
                                marginBottom: 6,
                              }}
                            >
                              Version
                            </div>
                            <div style={{ fontSize: 15, fontWeight: 700 }}>
                              {exp.version}
                            </div>
                          </div>
                          <div>
                            <div
                              style={{
                                fontSize: 11,
                                color: "var(--muted)",
                                textTransform: "uppercase",
                                fontWeight: 700,
                                marginBottom: 6,
                              }}
                            >
                              Timing
                            </div>
                            <div style={{ fontSize: 15, fontWeight: 700 }}>
                              {exp.timing} min
                            </div>
                          </div>
                        </div>

                        {reviewData ? (
                          <>
                            {/* Reviewed By */}
                            <div
                              style={{
                                display: "flex",
                                gap: 16,
                                marginBottom: 24,
                                alignItems: "center",
                              }}
                            >
                              <div
                                style={{
                                  padding: "8px 16px",
                                  background: "var(--primary-glow)",
                                  borderRadius: 10,
                                  fontSize: 13,
                                  fontWeight: 700,
                                  color: "var(--primary)",
                                  border: "1px solid var(--primary)",
                                }}
                              >
                                Reviewed by: {reviewData.reviewedBy}
                              </div>
                              <div
                                style={{
                                  fontSize: 13,
                                  color: "var(--muted)",
                                  display: "flex",
                                  alignItems: "center",
                                  gap: 6,
                                }}
                              >
                                <Calendar size={14} />
                                {reviewData.reviewedDate}
                              </div>
                            </div>

                            {/* Sensory Scores */}
                            <div style={{ marginBottom: 24 }}>
                              <h4
                                style={{
                                  fontSize: 15,
                                  fontWeight: 700,
                                  marginBottom: 16,
                                  display: "flex",
                                  alignItems: "center",
                                  gap: 8,
                                  color: "var(--text)",
                                }}
                              >
                                <Activity
                                  size={16}
                                  style={{
                                    color: "var(--primary)",
                                  }}
                                />
                                Sensory Scores
                              </h4>
                              <div
                                style={{
                                  display: "grid",
                                  gridTemplateColumns: "repeat(3, 1fr)",
                                  gap: 12,
                                }}
                              >
                                {sensoryLabels.map((s) => {
                                  const val = reviewData.sensoryScores[s.key];
                                  return (
                                    <div
                                      key={s.key}
                                      style={{
                                        display: "flex",
                                        alignItems: "center",
                                        justifyContent: "space-between",
                                        padding: "12px 16px",
                                        background: "var(--card-bg)",
                                        borderRadius: 12,
                                        border: "1px solid var(--border)",
                                      }}
                                    >
                                      <div
                                        style={{
                                          display: "flex",
                                          alignItems: "center",
                                          gap: 8,
                                          fontSize: 13,
                                          fontWeight: 600,
                                          color: "var(--text)",
                                        }}
                                      >
                                        <s.icon
                                          size={14}
                                          style={{
                                            color: s.color,
                                          }}
                                        />
                                        {s.label}
                                      </div>
                                      <div
                                        style={{
                                          fontWeight: 800,
                                          fontSize: 15,
                                          color: getScoreColor(val),
                                        }}
                                      >
                                        {val}/10
                                      </div>
                                    </div>
                                  );
                                })}
                              </div>
                            </div>

                            {/* Questions & Answers */}
                            <div style={{ marginBottom: 24 }}>
                              <h4
                                style={{
                                  fontSize: 15,
                                  fontWeight: 700,
                                  marginBottom: 16,
                                  display: "flex",
                                  alignItems: "center",
                                  gap: 8,
                                  color: "var(--text)",
                                }}
                              >
                                <CheckCircle
                                  size={16}
                                  style={{
                                    color: "var(--success)",
                                  }}
                                />
                                General Feedback Questions
                              </h4>
                              <div
                                style={{
                                  display: "flex",
                                  flexDirection: "column",
                                  gap: 12,
                                }}
                              >
                                {STATIC_QUESTIONS.map((q, i) => (
                                  <div
                                    key={q.id}
                                    style={{
                                      padding: "16px 20px",
                                      background: "var(--card-bg)",
                                      borderRadius: 12,
                                      border: "1px solid var(--border)",
                                    }}
                                  >
                                    <div
                                      style={{
                                        fontSize: 13,
                                        fontWeight: 700,
                                        color: "var(--text)",
                                        marginBottom: 10,
                                        display: "flex",
                                        alignItems: "center",
                                        gap: 8,
                                      }}
                                    >
                                      <span
                                        style={{
                                          color: "var(--primary)",
                                          fontWeight: 800,
                                        }}
                                      >
                                        Q{i + 1}.
                                      </span>
                                      {q.question}
                                    </div>
                                    <div
                                      style={{
                                        paddingLeft: 32,
                                      }}
                                    >
                                      {renderAnswer(
                                        q,
                                        reviewData.answers[q.id],
                                      )}
                                    </div>
                                  </div>
                                ))}
                              </div>
                            </div>

                            {/* Remarks */}
                            {reviewData.remarks && (
                              <div
                                style={{
                                  padding: "16px 20px",
                                  background: "var(--card-bg)",
                                  borderRadius: 12,
                                  border: "1px solid var(--border)",
                                }}
                              >
                                <div
                                  style={{
                                    fontSize: 13,
                                    fontWeight: 700,
                                    color: "var(--text)",
                                    marginBottom: 8,
                                    display: "flex",
                                    alignItems: "center",
                                    gap: 8,
                                  }}
                                >
                                  <MessageSquare
                                    size={14}
                                    style={{
                                      color: "var(--primary)",
                                    }}
                                  />
                                  Additional Remarks
                                </div>
                                <div
                                  style={{
                                    fontSize: 14,
                                    color: "var(--text)",
                                    lineHeight: 1.6,
                                    paddingLeft: 22,
                                  }}
                                >
                                  {reviewData.remarks}
                                </div>
                              </div>
                            )}
                          </>
                        ) : (
                          /* Pending Review - No Data Yet */
                          <div
                            style={{
                              padding: "40px",
                              textAlign: "center",
                              background: "var(--card-bg)",
                              borderRadius: 16,
                              border: "1px solid var(--border)",
                            }}
                          >
                            <Clock
                              size={40}
                              style={{
                                color: "var(--warning)",
                                opacity: 0.5,
                                marginBottom: 16,
                              }}
                            />
                            <div
                              style={{
                                fontSize: 16,
                                fontWeight: 700,
                                color: "var(--text)",
                                marginBottom: 6,
                              }}
                            >
                              Awaiting Review
                            </div>
                            <div
                              style={{
                                fontSize: 13,
                                color: "var(--muted)",
                              }}
                            >
                              This experiment has not been reviewed yet. A
                              Reviewer needs to complete the quality review.
                            </div>
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
      </Card>
    </div>
  );
}
