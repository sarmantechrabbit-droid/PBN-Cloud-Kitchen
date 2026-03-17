import React, { useState, useMemo } from "react";
import {
  FlaskConical,
  CheckCircle,
  XCircle,
  Clock,
  Download,
  ChevronRight,
  Plus,
  FileText,
  ShieldCheck,
  BarChart3,
  Search,
  Filter,
  ArrowRight,
  Utensils,
  Users,
  ChefHat,
  ClipboardCheck,
} from "lucide-react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from "recharts";
import { useNavigate } from "react-router-dom";
import Card from "../../components/ui/Card";
import StatCard from "../../components/ui/StatCard";
import StatusBadge from "../../components/ui/StatusBadge";
import PageHeader from "../../components/ui/PageHeader";
import { experiments, monthlyData } from "../../data/dummy";

const CustomTooltip = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null;
  return (
    <div
      style={{
        background: "var(--surface)",
        border: "1px solid var(--border)",
        borderRadius: 10,
        padding: "10px 14px",
        fontSize: 12,
      }}
    >
      <div style={{ fontWeight: 700, color: "var(--text)", marginBottom: 6 }}>
        {label}
      </div>
      {payload.map((p) => (
        <div key={p.dataKey} style={{ color: p.color, marginBottom: 2 }}>
          {p.dataKey}: {p.value}
        </div>
      ))}
    </div>
  );
};

export default function DashboardPage() {
  const navigate = useNavigate();
  const role = localStorage.getItem("ck_role") || "Manager";
  const userEmail = localStorage.getItem("ck_auth_email") || "Admin";
  const username = userEmail.split("@")[0];


  // Get experiments (stored + dummy)
  const storedExperiments = useMemo(() => {
    const raw = localStorage.getItem("ck_experiments");
    return raw ? JSON.parse(raw) : [];
  }, []);

  const allExperiments = useMemo(() => {
    return [...storedExperiments, ...experiments];
  }, [storedExperiments]);

  // Role-specific stats and data
  const stats = useMemo(() => {
    const chefExps = allExperiments.filter((e) =>
      e.chef?.toLowerCase().includes(username.toLowerCase()),
    );
    // If the logged-in username doesn't match demo chef names, fall back to all.
    const chefData = chefExps.length ? chefExps : allExperiments;

    // Original chart data logic
    const chefChartData = monthlyData.map((m) => {
      const counts = chefData.reduce(
        (acc, e) => {
          if (!e.date) return acc;
          const mFull = new Date(e.date).toLocaleString("en-US", {
            month: "short",
          });
          if (mFull !== m.month) return acc;
          if (e.status === "Completed") acc.completed += 1;
          if (e.status === "Pending") acc.pending += 1;
          return acc;
        },
        { completed: 0, pending: 0 },
      );
      return { ...m, ...counts };
    });

    if (role === "Chef") {
      return {
        all: chefData.length,
        completed: chefData.filter((e) => e.status === "Completed").length,
        pending: chefData.filter((e) => e.status === "Pending").length,
        data: chefData,
        chartData: chefChartData,
      };
    } else if (role === "Reviewer") {
      return {
        all: allExperiments.length,
        completed: allExperiments.filter((e) => e.status === "Completed")
          .length,
        pending: allExperiments.filter((e) => e.status === "Pending").length,
        data: allExperiments,
        chartData: monthlyData,
      };
    } else {
      return {
        all: allExperiments.length,
        completed: allExperiments.filter((e) => e.status === "Completed")
          .length,
        pending: allExperiments.filter((e) => e.status === "Pending").length,
        data: allExperiments,
        chartData: monthlyData,
      };
    }
  }, [role, allExperiments, username]);

  const chartData = useMemo(() => {
    return role === "Chef" ? stats.chartData : monthlyData;
  }, [role, stats.chartData]);

  // Staff counts from localStorage
  const staffCounts = useMemo(() => {
    const raw = localStorage.getItem("ck_staff_list");
    const staffList = raw
      ? JSON.parse(raw)
      : [
          { role: "Chef" },
          { role: "Chef" },
          { role: "Chef" },
          { role: "Reviewer" },
          { role: "Reviewer" },
          { role: "CRA" },
        ];
    return {
      chefs: staffList.filter((s) => s.role === "Chef").length,
      reviewers: staffList.filter((s) => s.role === "Reviewer").length,
      cra: staffList.filter((s) => s.role === "CRA").length,
    };
  }, []);

  // Total experiments per month for modified chart
  const totalMonthlyData = useMemo(() => {
    return monthlyData.map((m) => ({
      month: m.month,
      total: (m.completed || 0) + (m.pending || 0),
    }));
  }, []);

  const filteredData = stats.data;

  const renderChefDashboard = () => (
    <div className="space-y-8 animate-in fade-in duration-500">
      {/* Top Section */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
            Hello, {username}
          </h1>
          <p className="text-gray-600 dark:text-gray-400 font-medium">
            Hello Chef, create and manage your experiments.
          </p>
        </div>
        <div className="flex flex-col sm:flex-row gap-3">
          <button
            onClick={() => navigate("/recipes")}
            className="flex items-center justify-center gap-2 px-6 py-3 bg-orange-500 hover:bg-orange-600 text-white rounded-xl font-semibold shadow-lg shadow-orange-500/20 transition-all hover:-translate-y-0.5"
          >
            <Plus size={20} />
            Create Experiment
          </button>
          <button
            onClick={() => navigate("/all-recipes")}
            className="flex items-center justify-center gap-2 px-6 py-3 bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-200 border border-gray-200 dark:border-gray-700 rounded-xl font-semibold hover:bg-gray-50 dark:hover:bg-gray-700 transition-all hover:-translate-y-0.5"
          >
            <Utensils size={20} />
            All Recipes
          </button>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        <SummaryCard
          icon={<Utensils className="text-blue-500" />}
          count={stats.all}
          label="All Recipes"
          bgColor="bg-blue-50 dark:bg-blue-900/20"
        />
        <SummaryCard
          icon={<CheckCircle className="text-green-500" />}
          count={stats.completed}
          label="Completed Recipes"
          bgColor="bg-green-50 dark:bg-green-900/20"
        />
        <SummaryCard
          icon={<Clock className="text-amber-500" />}
          count={stats.pending}
          label="Pending Recipes"
          bgColor="bg-amber-50 dark:bg-amber-900/20"
        />
      </div>

      {/* Table Section */}
      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 overflow-hidden">
        <div className="p-6 border-b border-gray-100 dark:border-gray-700 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <h2 className="text-xl font-bold text-gray-900 dark:text-white">
            Recipe Data Table
          </h2>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-gray-50 dark:bg-gray-900/50 text-gray-500 dark:text-gray-400 text-xs uppercase tracking-wider">
              <tr>
                <th className="px-6 py-4 font-semibold">Recipe Name</th>
                <th className="px-6 py-4 font-semibold">Created Date</th>
                <th className="px-6 py-4 font-semibold text-center">Status</th>
                <th className="px-6 py-4 font-semibold text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 dark:divide-gray-700">
              {filteredData.map((exp) => (
                <tr
                  key={exp.id}
                  className="hover:bg-gray-50 dark:hover:bg-gray-700/40 transition-colors group"
                >
                  <td className="px-6 py-4">
                    <div className="font-semibold text-gray-900 dark:text-white">
                      {exp.recipe}
                    </div>
                    <div className="text-xs text-gray-500">{exp.id}</div>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-600 dark:text-gray-300">
                    {exp.date}
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex justify-center">
                      <StatusPill status={exp.status} />
                    </div>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <button className="p-2 text-gray-400 hover:text-orange-500 transition-colors">
                      <ArrowRight size={18} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );

  const renderReviewerDashboard = () => (
    <div className="space-y-8 animate-in fade-in duration-500">
      {/* Top Section */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
            Hello, {username}
          </h1>
          <p className="text-gray-600 dark:text-gray-400 font-medium">
            Hello Reviewer, add and manage quality reviews.
          </p>
        </div>
        <div className="flex flex-col sm:flex-row gap-3">
          <button
            onClick={() => navigate("/quality")}
            className="flex items-center justify-center gap-2 px-6 py-3 bg-[#f97316] text-white rounded-xl font-semibold shadow-lg shadow-indigo-500/20 transition-all hover:-translate-y-0.5"
          >
            <ShieldCheck size={20} />
            Add Review
          </button>
          <button
            onClick={() => navigate("/reviews")}
            className="flex items-center justify-center gap-2 px-6 py-3 bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-200 border border-gray-200 dark:border-gray-700 rounded-xl font-semibold hover:bg-gray-50 dark:hover:bg-gray-700 transition-all hover:-translate-y-0.5"
          >
            <FileText size={20} />
            Feedbacks
          </button>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        <SummaryCard
          icon={<FileText className="text-indigo-500" />}
          count={stats.all}
          label="All Reviews"
          bgColor="bg-indigo-50 dark:bg-indigo-900/20"
        />
        <SummaryCard
          icon={<CheckCircle className="text-emerald-500" />}
          count={stats.completed}
          label="Completed Reviews"
          bgColor="bg-emerald-50 dark:bg-emerald-900/20"
        />
        <SummaryCard
          icon={<Clock className="text-rose-500" />}
          count={stats.pending}
          label="Pending Reviews"
          bgColor="bg-rose-50 dark:bg-rose-900/20"
        />
      </div>

      {/* Table Section */}
      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 overflow-hidden">
        <div className="p-6 border-b border-gray-100 dark:border-gray-700 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <h2 className="text-xl font-bold text-gray-900 dark:text-white">
            Reviews Table
          </h2>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-gray-50 dark:bg-gray-900/50 text-gray-500 dark:text-gray-400 text-xs uppercase tracking-wider">
              <tr>
                <th className="px-6 py-4 font-semibold">Experiment Name</th>
                <th className="px-6 py-4 font-semibold">Reviewer</th>
                <th className="px-6 py-4 font-semibold">Review Date</th>
                <th className="px-6 py-4 font-semibold text-center">Status</th>
                <th className="px-6 py-4 font-semibold text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 dark:divide-gray-700">
              {filteredData.map((exp) => (
                <tr
                  key={exp.id}
                  className="hover:bg-gray-50 dark:hover:bg-gray-700/40 transition-colors group"
                >
                  <td className="px-6 py-4">
                    <div className="font-semibold text-gray-900 dark:text-white">
                      {exp.recipe}
                    </div>
                    <div className="text-xs text-gray-500">{exp.id}</div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      <div className="w-7 h-7 rounded-full bg-indigo-100 dark:bg-indigo-900 flex items-center justify-center text-[10px] font-bold text-indigo-700 dark:text-indigo-300">
                        {exp.chef?.charAt(0) || "U"}
                      </div>
                      <span className="text-sm text-gray-700 dark:text-gray-300">
                        {exp.chef}
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-600 dark:text-gray-300">
                    {exp.date}
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex justify-center">
                      <StatusPill status={exp.status} />
                    </div>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <button className="p-2 text-gray-400 hover:text-indigo-600 transition-colors">
                      <ArrowRight size={18} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );

  return (
    <div style={{ animation: "fadeIn 0.3s ease-out" }}>
      {role === "Chef" ? (
        renderChefDashboard()
      ) : role === "Reviewer" ? (
        renderReviewerDashboard()
      ) : (
        // Management dashboard fallback (Restored original UI)
        <div className="max-w-8xl mx-auto">
          <PageHeader
            title="Dashboard"
            subtitle="Monitor your cloud kitchen experiment analytics and performance."
          />

          {/* Stat Cards */}
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(3,1fr)",
              gap: 16,
              marginBottom: 24,
            }}
          >
            <StatCard
              icon={<FlaskConical size={20} />}
              label="Total Experiments"
              value="86"
              trend="12.4%"
              trendUp
              sub="This month"
            />
            <StatCard
              icon={<CheckCircle size={20} />}
              label="Completed"
              value={monthlyData[5].completed}
              trend="8.2%"
              trendUp
              sub="Ready for production"
            />
            <StatCard
              icon={<Clock size={20} />}
              label="Pending Review"
              value="16"
              sub="Awaiting quality check"
            />
            {/* <StatCard
              icon={<FlaskConical size={20} />}
              label="Monthly Success Experiments"
              value="82%"
              trend="4.5%"
              trendUp
              sub="Current Month"
            /> */}
          </div>

          {/* Staff Summary Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
            <StaffCard
              icon={<ChefHat size={22} className="text-orange-500" />}
              label="Total Chefs"
              count={staffCounts.chefs}
              bgColor="bg-orange-50 dark:bg-orange-900/20"
            />
            <StaffCard
              icon={<ShieldCheck size={22} className="text-indigo-500" />}
              label="Total Reviewers"
              count={staffCounts.reviewers}
              bgColor="bg-indigo-50 dark:bg-indigo-900/20"
            />
            <StaffCard
              icon={<ClipboardCheck size={22} className="text-teal-500" />}
              label="Total CRA"
              count={staffCounts.cra}
              bgColor="bg-teal-50 dark:bg-teal-900/20"
            />
          </div>

          {/* Monthly Total Experiments Chart */}
          <div style={{ marginBottom: 24 }}>
            <Card>
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  marginBottom: 20,
                }}
              >
                <div>
                  <div
                    style={{
                      fontSize: 15,
                      fontWeight: 700,
                      color: "var(--text)",
                    }}
                  >
                    Monthly Total Experiments
                  </div>
                  <div
                    style={{
                      fontSize: 12,
                      color: "var(--muted)",
                      marginTop: 2,
                    }}
                  >
                    Total experiments per month — last 6 months
                  </div>
                </div>
                <select
                  style={{
                    background: "var(--bg)",
                    border: "1px solid var(--border)",
                    color: "var(--muted)",
                    borderRadius: 8,
                    padding: "5px 10px",
                    fontSize: 12,
                    fontFamily: "inherit",
                    outline: "none",
                  }}
                >
                  <option>Last 6 Months</option>
                </select>
              </div>
              <ResponsiveContainer width="100%" height={240}>
                <BarChart data={totalMonthlyData} barCategoryGap="30%">
                  <CartesianGrid
                    strokeDasharray="3 3"
                    stroke="var(--border)"
                    vertical={false}
                  />
                  <XAxis
                    dataKey="month"
                    tick={{ fill: "var(--muted)", fontSize: 12 }}
                    axisLine={false}
                    tickLine={false}
                  />
                  <YAxis
                    tick={{ fill: "var(--muted)", fontSize: 12 }}
                    axisLine={false}
                    tickLine={false}
                  />
                  <Tooltip content={<CustomTooltip />} />
                  <Bar
                    dataKey="total"
                    fill="var(--primary)"
                    radius={[6, 6, 0, 0]}
                  />
                </BarChart>
              </ResponsiveContainer>
              <div style={{ display: "flex", gap: 18, marginTop: 12 }}>
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 6,
                    fontSize: 11,
                    color: "var(--muted)",
                  }}
                >
                  <div
                    style={{
                      width: 8,
                      height: 8,
                      borderRadius: 2,
                      background: "var(--primary)",
                    }}
                  />
                  Total Experiments
                </div>
              </div>
            </Card>
          </div>

          {/* Experiments Table */}
          {role === "Manager" && (
            <Card noPad>
              <div
                style={{
                  padding: "18px 24px",
                  borderBottom: "1px solid var(--border)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                }}
              >
                <div>
                  <div
                    style={{
                      fontSize: 15,
                      fontWeight: 700,
                      color: "var(--text)",
                    }}
                  >
                    Recent Experiments
                  </div>
                  <div
                    style={{
                      fontSize: 12,
                      color: "var(--muted)",
                      marginTop: 2,
                    }}
                  >
                    Latest cooking experiments submitted
                  </div>
                </div>
                {/* <button
                  className="btn-primary"
                  style={{ display: "flex", alignItems: "center", gap: 6 }}
                >
                  <Download size={13} /> Export
                </button> */}
              </div>
              <div style={{ overflowX: "auto" }}>
                <table className="table">
                  <thead>
                    <tr>
                      {["Exp ID", "Recipe", "Date", "Chef", "AI Score"].map(
                        (h) => (
                          <th key={h}>{h}</th>
                        ),
                      )}
                    </tr>
                  </thead>
                  <tbody>
                    {experiments.map((e) => (
                      <tr key={e.id} className="table-row">
                        <td className="table-cell-primary">{e.id}</td>
                        <td style={{ fontWeight: 500 }}>{e.recipe}</td>
                        <td className="table-cell-muted">{e.date}</td>
                        <td>
                          <div
                            style={{
                              display: "flex",
                              alignItems: "center",
                              gap: 8,
                            }}
                          >
                            <div
                              style={{
                                width: 26,
                                height: 26,
                                borderRadius: "50%",
                                background: "var(--primary-glow)",
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                                fontSize: 9,
                                fontWeight: 800,
                                color: "var(--primary)",
                              }}
                            >
                              {e.chef
                                .split(" ")
                                .map((n) => n[0])
                                .join("")}
                            </div>
                            <span
                              style={{ fontSize: 13, color: "var(--text)" }}
                            >
                              {e.chef}
                            </span>
                          </div>
                        </td>
                        <td>
                          <div
                            style={{
                              display: "flex",
                              alignItems: "center",
                              gap: 8,
                            }}
                          >
                            <div
                              style={{
                                width: 52,
                                height: 4,
                                background: "var(--bg)",
                                borderRadius: 2,
                              }}
                            >
                              <div
                                style={{
                                  height: "100%",
                                  borderRadius: 2,
                                  width: `${e.aiScore}%`,
                                  background:
                                    e.aiScore > 80
                                      ? "var(--success)"
                                      : e.aiScore > 60
                                        ? "var(--warning)"
                                        : "var(--danger)",
                                }}
                              />
                            </div>
                            <span
                              style={{
                                fontSize: 12,
                                fontWeight: 700,
                                color: "var(--text)",
                              }}
                            >
                              {e.aiScore}
                            </span>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </Card>
          )}
        </div>
      )}
    </div>
  );
}

function SummaryCard({ icon, count, label, bgColor, countSuffix = "" }) {
  return (
    <div className="group bg-white dark:bg-gray-800 p-6 rounded-2xl border border-gray-100 dark:border-gray-700 shadow-sm hover:shadow-md transition-all duration-300 hover:-translate-y-1">
      <div
        className={`w-12 h-12 rounded-xl ${bgColor} flex items-center justify-center mb-4 transition-transform group-hover:scale-110`}
      >
        {React.cloneElement(icon, { size: 24 })}
      </div>
      <div className="space-y-1">
        <h3 className="text-3xl font-bold text-gray-900 dark:text-white">
          {count}
          {countSuffix}
        </h3>
        <p className="text-sm font-medium text-gray-500 dark:text-gray-400">
          {label}
        </p>
      </div>
    </div>
  );
}

function StatusPill({ status }) {
  const isCompleted = status === "Completed" || status === "Pass";
  const isPending = status === "Pending" || status === "Review";

  return (
    <span
      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold ${
        isCompleted
          ? "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400"
          : isPending
            ? "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400"
            : "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400"
      }`}
    >
      {status}
    </span>
  );
}

function StaffCard({ icon, label, count, bgColor }) {
  return (
    <div className="group bg-white dark:bg-gray-800 p-5 rounded-2xl border border-gray-100 dark:border-gray-700 shadow-sm hover:shadow-md transition-all duration-300 hover:-translate-y-1">
      <div className="flex items-center gap-4">
        <div
          className={`w-12 h-12 rounded-xl ${bgColor} flex items-center justify-center transition-transform group-hover:scale-110`}
        >
          {icon}
        </div>
        <div>
          <div className="text-2xl font-bold text-gray-900 dark:text-white">
            {count}
          </div>
          <div className="text-sm font-medium text-gray-500 dark:text-gray-400">
            {label}
          </div>
        </div>
      </div>
    </div>
  );
}
