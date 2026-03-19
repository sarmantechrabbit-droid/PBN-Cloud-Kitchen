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
    <div className="bg-[var(--surface)] border border-[var(--border)] rounded-xl p-2.5 text-xs shadow-xl backdrop-blur-md">
      <div className="font-bold text-[var(--text)] mb-1.5">{label}</div>
      {payload.map((p) => (
        <div
          key={p.dataKey}
          className="flex items-center gap-2 mb-0.5"
          style={{ color: p.color }}
        >
          <div
            className="w-2 h-2 rounded-full"
            style={{ backgroundColor: p.color }}
          />
          <span>
            {p.dataKey}: {p.value}
          </span>
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
    <div className="space-y-10 animate-in fade-in slide-in-from-bottom-6 duration-700">
      {/* Top Section */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-8">
        <div className="space-y-2">
          <div className="flex items-center gap-3">
            <div className="w-2 h-8 bg-orange-500 rounded-full" />
            <h1 className="text-3xl sm:text-4xl font-black text-[var(--text)] tracking-tight">
              Hello, {username}
            </h1>
          </div>
          <p className="text-sm font-bold text-[var(--muted)] uppercase tracking-[0.2em] opacity-80 pl-5">
            Executive Chef • Kitchen Experiment Center
          </p>
        </div>
        <div className="flex flex-col sm:flex-row gap-4">
          <button
            onClick={() => navigate("/recipes")}
            className="group flex items-center justify-center gap-2.5 px-8 py-4 bg-orange-500 hover:bg-orange-600 text-white rounded-[20px] font-black italic tracking-tight shadow-xl shadow-orange-500/20 transition-all hover:-translate-y-1 active:scale-95"
          >
            <Plus
              size={20}
              strokeWidth={3}
              className="group-hover:rotate-90 transition-transform"
            />
            CREATE EXPERIMENT
          </button>
          <button
            onClick={() => navigate("/all-recipes")}
            className="flex items-center justify-center gap-2.5 px-8 py-4 bg-[var(--surface)] text-[var(--text)] border border-[var(--border)] rounded-[20px] font-black italic tracking-tight hover:bg-[var(--bg)] transition-all hover:-translate-y-1 shadow-sm active:scale-95"
          >
            <Utensils size={20} strokeWidth={2.5} />
            ALL RECIPES
          </button>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        <SummaryCard
          icon={<Utensils className="text-orange-500" />}
          count={stats.all}
          label="Total Experiments"
          bgColor="bg-orange-500/10"
          accentColor="orange"
        />
        <SummaryCard
          icon={<CheckCircle className="text-emerald-500" />}
          count={stats.completed}
          label="Quality Approved"
          bgColor="bg-emerald-500/10"
          accentColor="emerald"
        />
        <SummaryCard
          icon={<Clock className="text-amber-500" />}
          count={stats.pending}
          label="Pending Review"
          bgColor="bg-amber-500/10"
          accentColor="amber"
        />
      </div>

      {/* Table Section */}
      <Card
        noPad
        className="overflow-hidden border-[var(--border)] shadow-2xl shadow-black/5 dark:shadow-none rounded-[32px]"
      >
        <div className="p-8 border-b border-[var(--border)] bg-gradient-to-r from-orange-500/5 to-transparent">
          <div className="flex items-center gap-3">
            <FlaskConical className="text-orange-500" size={20} />
            <h2 className="text-lg font-black text-[var(--text)] uppercase tracking-widest">
              My Experiment History
            </h2>
          </div>
          <p className="text-xs font-bold text-[var(--muted)] mt-1 ml-8">
            Track and monitor your recent kitchen submissions
          </p>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-[var(--bg)] text-[var(--muted)] text-[10px] font-black uppercase tracking-[0.2em]">
              <tr>
                <th className="px-8 py-5 border-b border-[var(--border)]">
                  Recipe Name
                </th>
                <th className="px-8 py-5 border-b border-[var(--border)] hidden sm:table-cell">
                  Created Date
                </th>
                <th className="px-8 py-5 border-b border-[var(--border)] text-center">
                  Status
                </th>
                <th className="px-8 py-5 border-b border-[var(--border)] text-right">
                  Created Time
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[var(--border)]/50">
              {filteredData.map((exp) => (
                <tr
                  key={exp.id}
                  className="hover:bg-orange-500/[0.02] transition-colors group cursor-pointer"
                >
                  <td className="px-8 py-6">
                    <div className="font-black text-[var(--text)] text-sm tracking-tight group-hover:text-orange-500 transition-colors">
                      {exp.recipe}
                    </div>
                    <div className="text-[10px] font-black text-[var(--muted)] uppercase tracking-widest mt-1 opacity-60">
                      ID: {exp.id}
                    </div>
                  </td>
                  <td className="px-8 py-6 text-xs font-bold text-[var(--muted)] hidden sm:table-cell">
                    {exp.date}
                  </td>
                  <td className="px-8 py-6">
                    <div className="flex justify-center">
                      <StatusPill status={exp.status} />
                    </div>
                  </td>
                  <td className="px-8 py-6 text-right text-xs font-bold text-[var(--muted)]">
                    <div className="flex items-center justify-end gap-2 px-1">
                      <Clock size={12} className="text-orange-500" />
                      {exp.time || "10:00 AM"}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );

  const renderReviewerDashboard = () => (
    <div className="space-y-10 animate-in fade-in slide-in-from-bottom-6 duration-700">
      {/* Top Section */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-8">
        <div className="space-y-2">
          <div className="flex items-center gap-3">
            <div className="w-2 h-8 bg-orange-500 rounded-full" />
            <h1 className="text-3xl sm:text-4xl font-bold text-[var(--text)] tracking-tight">
              Quality Review Dashboard
            </h1>
          </div>
          <p className="text-sm font-medium text-[var(--muted)] pl-5">
            Monitor and audit experiment quality standards.
          </p>
        </div>
        <div className="flex flex-col sm:flex-row gap-4">
          <button
            onClick={() => navigate("/quality")}
            className="group flex items-center justify-center gap-2.5 px-8 py-4 bg-orange-500 hover:bg-orange-600 text-white rounded-[20px] font-bold tracking-tight shadow-xl shadow-orange-500/20 transition-all hover:-translate-y-1 active:scale-95"
          >
            <ShieldCheck size={20} strokeWidth={2.5} />
            ADD NEW REVIEW
          </button>
          <button
            onClick={() => navigate("/reviews")}
            className="flex items-center justify-center gap-2.5 px-8 py-4 bg-[var(--surface)] text-[var(--text)] border border-[var(--border)] rounded-[20px] font-black italic tracking-tight hover:bg-[var(--bg)] transition-all hover:-translate-y-1 shadow-sm active:scale-95"
          >
            <FileText size={20} strokeWidth={2.5} />
            FEEDBACK LOGS
          </button>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        <SummaryCard
          icon={<FileText className="text-orange-500" />}
          count={stats.all}
          label="Total Reviews"
          bgColor="bg-orange-500/10"
          accentColor="orange"
        />
        <SummaryCard
          icon={<CheckCircle className="text-emerald-500" />}
          count={stats.completed}
          label="Approved"
          bgColor="bg-emerald-500/10"
          accentColor="emerald"
        />
        <SummaryCard
          icon={<Clock className="text-rose-500" />}
          count={stats.pending}
          label="Awaiting Audit"
          bgColor="bg-rose-500/10"
          accentColor="rose"
        />
      </div>

      {/* Table Section */}
      <Card
        noPad
        className="overflow-hidden border-[var(--border)] shadow-2xl shadow-black/5 dark:shadow-none rounded-[32px]"
      >
        <div className="p-8 border-b border-[var(--border)] bg-gradient-to-r from-orange-500/5 to-transparent">
          <div className="flex items-center gap-3">
            <ClipboardCheck className="text-orange-500" size={20} />
            <h2 className="text-lg font-bold text-[var(--text)] uppercase tracking-widest">
              Review Pipeline
            </h2>
          </div>
          <p className="text-xs font-medium text-[var(--muted)] mt-1 ml-8">
            Real-time status of all active quality inspections
          </p>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-[var(--bg)] text-[var(--muted)] text-[10px] font-black uppercase tracking-[0.2em]">
              <tr>
                <th className="px-8 py-5 border-b border-[var(--border)]">
                  Experiment
                </th>
                <th className="px-8 py-5 border-b border-[var(--border)] hidden sm:table-cell">
                  Assigned Chef
                </th>
                <th className="px-8 py-5 border-b border(--border) hidden lg:table-cell">
                  Target Date
                </th>
                <th className="px-8 py-5 border-b border-[var(--border)] text-center">
                  Audit Status
                </th>
                <th className="px-8 py-5 border-b border-[var(--border)] text-right">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[var(--border)]/50">
              {filteredData.map((exp) => (
                <tr
                  key={exp.id}
                  className="hover:bg-orange-500/[0.02] transition-colors group cursor-pointer"
                >
                  <td className="px-8 py-6">
                    <div className="font-bold text-[var(--text)] text-sm tracking-tight group-hover:text-orange-500 transition-colors">
                      {exp.recipe}
                    </div>
                    <div className="text-[10px] font-medium text-[var(--muted)] uppercase tracking-widest mt-1 opacity-60">
                      {exp.id}
                    </div>
                  </td>
                  <td className="px-8 py-6 hidden sm:table-cell">
                    <div className="flex items-center gap-2">
                      <div className="w-7 h-7 rounded-lg bg-orange-500/10 flex items-center justify-center text-[10px] font-bold text-orange-600">
                        {exp.chef?.charAt(0) || "U"}
                      </div>
                      <span className="text-xs font-medium text-[var(--text)] tracking-tight">
                        {exp.chef}
                      </span>
                    </div>
                  </td>
                  <td className="px-8 py-6 text-xs font-medium text-[var(--muted)] hidden lg:table-cell">
                    {exp.date}
                  </td>
                  <td className="px-8 py-6">
                    <div className="flex justify-center">
                      <StatusPill status={exp.status} />
                    </div>
                  </td>
                  <td className="px-8 py-6 text-right">
                    <button className="w-10 h-10 rounded-xl bg-[var(--bg)] border border-[var(--border)] text-[var(--muted)] flex items-center justify-center hover:bg-[#f06f0f] hover:text-white hover:border-orange-600 transition-all group-hover:scale-110 active:scale-95 shadow-sm">
                      <ArrowRight size={18} strokeWidth={3} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );

  return (
    <div className="animate-fade-in">
      {role === "Chef" ? (
        renderChefDashboard()
      ) : role === "Reviewer" ? (
        renderReviewerDashboard()
      ) : (
        // Management dashboard fallback (Restored original UI)
        <div className="max-w-8xl mx-auto space-y-12 animate-in fade-in slide-in-from-bottom-6 duration-700">
          <PageHeader
            title="Dashboard"
            subtitle="Centralized intelligence hub for cloud kitchen operations and performance metrics."
          />

          {/* Stat Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            <StatCard
              icon={<FlaskConical size={20} strokeWidth={2.5} />}
              label="Total Experiments"
              value="86"
              trend="12.4%"
              trendUp
              sub="Vs previous month"
            />
            <StatCard
              icon={<CheckCircle size={20} strokeWidth={2.5} />}
              label="Completed"
              value={monthlyData[5].completed}
              trend="8.2%"
              trendUp
              sub="Production ready"
            />
            <StatCard
              icon={<Clock size={20} strokeWidth={2.5} />}
              label="Pending Review"
              value="16"
              sub="Pending QA review"
            />
          </div>

          {/* Staff Summary Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <StaffCard
              icon={<ChefHat className="text-orange-500" />}
              label="Total Chefs"
              count={staffCounts.chefs}
              bgColor="bg-orange-500/10"
            />
            <StaffCard
              icon={<ShieldCheck className="text-indigo-500" />}
              label="Total Reviewers"
              count={staffCounts.reviewers}
              bgColor="bg-indigo-500/10"
            />
            <StaffCard
              icon={<ClipboardCheck className="text-emerald-500" />}
              label="Total CRA"
              count={staffCounts.cra}
              bgColor="bg-emerald-500/10"
            />
          </div>

          {/* Monthly Total Experiments Chart */}
          <Card className="rounded-[40px] p-8 border-[var(--border)] shadow-2xl shadow-black/5 dark:shadow-none overflow-hidden relative group">
            <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-br from-[var(--primary)]/5 to-transparent rounded-full -mr-32 -mt-32 blur-3xl transition-opacity opacity-0 group-hover:opacity-100 duration-1000" />

            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6 mb-10 relative z-10">
              <div className="space-y-1">
                <div className="flex items-center gap-3">
                  <div className="w-2 h-6 bg-[var(--primary)] rounded-full" />
                  <h2 className="text-lg font-black text-[var(--text)] uppercase tracking-widest">
                    Monthly Total Experiments
                  </h2>
                </div>
                <p className="text-xs font-bold text-[var(--muted)] opacity-70 ml-5">
                  Total experiments per month — last 6 months
                </p>
              </div>
              {/* <select className="bg-[var(--surface)] border border-[var(--border)] text-[var(--text)] rounded-xl px-5 py-2.5 text-xs font-black uppercase tracking-widest outline-none shadow-sm hover:border-[var(--primary)] transition-colors appearance-none cursor-pointer">
                <option>H1 ANALYSIS (JAN-JUN)</option>
              </select> */}
            </div>

            <div className="h-[300px] w-full relative z-10">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={totalMonthlyData} barCategoryGap="25%">
                  <CartesianGrid
                    strokeDasharray="4 4"
                    stroke="var(--border)"
                    vertical={false}
                    opacity={0.5}
                  />
                  <XAxis
                    dataKey="month"
                    tick={{
                      fill: "var(--muted)",
                      fontSize: 10,
                      fontWeight: 800,
                    }}
                    axisLine={false}
                    tickLine={false}
                    interval={0}
                  />
                  <YAxis
                    tick={{
                      fill: "var(--muted)",
                      fontSize: 10,
                      fontWeight: 800,
                    }}
                    axisLine={false}
                    tickLine={false}
                  />
                  <Tooltip
                    content={<CustomTooltip />}
                    cursor={{ fill: "var(--primary)", opacity: 0.03 }}
                  />
                  <Bar
                    dataKey="total"
                    fill="var(--primary)"
                    radius={[8, 8, 0, 0]}
                    animationDuration={2000}
                  />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </Card>

          {/* Experiments Table */}
          {role === "Manager" && (
            <Card
              noPad
              className="overflow-hidden border-[var(--border)] shadow-2xl shadow-black/5 dark:shadow-none rounded-[32px]"
            >
              <div className="p-8 border-b border-[var(--border)] bg-gradient-to-r from-[var(--primary)]/5 to-transparent">
                <div className="flex items-center gap-3">
                  <BarChart3 className="text-[var(--primary)]" size={20} />
                  <h2 className="text-lg font-black text-[var(--text)] uppercase tracking-widest">
                    Recent Experiments
                  </h2>
                </div>
                <p className="text-xs font-bold text-[var(--muted)] mt-1 ml-8 font-jakarta">
                  Latest cooking experiments submitted
                </p>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-left">
                  <thead className="bg-[var(--bg)] text-[var(--muted)] text-[10px] font-black uppercase tracking-[0.2em]">
                    <tr>
                      <th className="px-8 py-5 border-b border-[var(--border)]">
                        Identity
                      </th>
                      <th className="px-8 py-5 border-b border-[var(--border)]">
                        Target Recipe
                      </th>
                      <th className="px-8 py-5 border-b border-[var(--border)] hidden sm:table-cell">
                        Timeline
                      </th>
                      <th className="px-8 py-5 border-b border-[var(--border)]">
                        Operator
                      </th>
                      <th className="px-8 py-5 border-b border-[var(--border)] text-right">
                        Confidence Score
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[var(--border)]/50">
                    {experiments.map((e) => (
                      <tr
                        key={e.id}
                        className="hover:bg-[var(--primary-glow)] transition-all group group cursor-pointer duration-300"
                      >
                        <td className="px-8 py-6">
                          <span className="font-mono text-[11px] font-black text-[var(--primary)] opacity-70 group-hover:opacity-100 transition-opacity">
                            {e.id}
                          </span>
                        </td>
                        <td className="px-8 py-6">
                          <div className="font-black text-sm text-[var(--text)] tracking-tight group-hover:text-[var(--primary)] transition-colors">
                            {e.recipe}
                          </div>
                        </td>
                        <td className="px-8 py-6 text-xs font-bold text-[var(--muted)] hidden sm:table-cell">
                          {e.date}
                        </td>
                        <td className="px-8 py-6">
                          <div className="flex items-center gap-3">
                            <div className="w-9 h-9 rounded-xl bg-[var(--surface)] border border-[var(--border)] flex items-center justify-center text-[10px] font-black text-[var(--primary)] shadow-sm group-hover:scale-110 transition-transform">
                              {e.chef
                                .split(" ")
                                .map((n) => n[0])
                                .join("")}
                            </div>
                            <span className="text-xs font-bold text-[var(--text)] tracking-tight">
                              {e.chef}
                            </span>
                          </div>
                        </td>
                        <td className="px-8 py-6">
                          <div className="flex items-center justify-end gap-4 min-w-[120px]">
                            <div className="flex-1 h-2 bg-[var(--bg)] rounded-full overflow-hidden max-w-[80px] shadow-inner">
                              <div
                                style={{ width: `${e.aiScore}%` }}
                                className={`h-full rounded-full transition-all duration-1000 ${
                                  e.aiScore > 80
                                    ? "bg-emerald-500 shadow-[0_0_10px_rgba(16,185,129,0.3)]"
                                    : e.aiScore > 60
                                      ? "bg-amber-500 shadow-[0_0_10px_rgba(245,158,11,0.3)]"
                                      : "bg-rose-500 shadow-[0_0_10px_rgba(244,63,94,0.3)]"
                                }`}
                              />
                            </div>
                            <span className="text-xs font-black text-[var(--text)] w-8 text-right">
                              {e.aiScore}%
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

function SummaryCard({ icon, count, label, bgColor, accentColor }) {
  const accentClasses = {
    orange: "group-hover:text-orange-600 shadow-orange-500/10",
    emerald: "group-hover:text-emerald-600 shadow-emerald-500/10",
    amber: "group-hover:text-amber-600 shadow-amber-500/10",
    indigo: "group-hover:text-indigo-600 shadow-indigo-500/10",
    rose: "group-hover:text-rose-600 shadow-rose-500/10",
  }[accentColor || "orange"];

  return (
    <div className="group bg-[var(--surface)] p-8 rounded-[32px] border border-[var(--border)] shadow-xl shadow-black/5 dark:shadow-none hover:shadow-2xl transition-all duration-500 hover:-translate-y-2 relative overflow-hidden">
      <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-current to-transparent opacity-[0.03] -mr-16 -mt-16 rounded-full" />

      <div
        className={`w-14 h-14 rounded-2xl ${bgColor} flex items-center justify-center mb-6 transition-all duration-500 group-hover:scale-110 group-hover:rotate-6 shadow-lg ${accentClasses}`}
      >
        {React.cloneElement(icon, { size: 28, strokeWidth: 2.5 })}
      </div>
      <div className="space-y-2">
        <h3 className="text-4xl font-black text-[var(--text)] tracking-tighter">
          {count}
        </h3>
        <p className="text-[10px] font-black text-[var(--muted)] uppercase tracking-[0.2em] opacity-80">
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
      className={`inline-flex items-center px-4 py-1.5 rounded-full text-[9px] font-black uppercase tracking-[0.15em] shadow-sm ${
        isCompleted
          ? "bg-emerald-500/10 text-emerald-600 border border-emerald-500/20"
          : isPending
            ? "bg-amber-500/10 text-amber-600 border border-amber-500/20"
            : "bg-rose-500/10 text-rose-600 border border-rose-500/20"
      }`}
    >
      <div
        className={`w-1.5 h-1.5 rounded-full mr-2 ${isCompleted ? "bg-emerald-500" : isPending ? "bg-amber-500" : "bg-rose-500"} animate-pulse`}
      />
      {status}
    </span>
  );
}

function StaffCard({ icon, label, count, bgColor }) {
  return (
    <div className="group bg-[var(--surface)] p-6 rounded-[24px] border border-[var(--border)] shadow-md hover:shadow-xl transition-all duration-500 hover:-translate-y-1">
      <div className="flex items-center gap-5">
        <div
          className={`w-14 h-14 rounded-2xl ${bgColor} flex items-center justify-center transition-all duration-500 group-hover:scale-110 group-hover:shadow-lg shadow-inner`}
        >
          {React.cloneElement(icon, { size: 24, strokeWidth: 2.5 })}
        </div>
        <div>
          <div className="text-3xl font-black text-[var(--text)] tracking-tighter">
            {count}
          </div>
          <div className="text-[10px] font-black text-[var(--muted)] uppercase tracking-widest opacity-80">
            {label}
          </div>
        </div>
      </div>
    </div>
  );
}
