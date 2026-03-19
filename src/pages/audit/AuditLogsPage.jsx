import React, { useState, useMemo } from "react";
import {
  FileText,
  Search,
  ChefHat,
  ShieldCheck,
  ClipboardCheck,
  Crown,
  Filter,
  Activity,
  Calendar,
  Clock,
  ChevronRight,
} from "lucide-react";
import { auditLogs as dummyAuditLogs } from "../../data/dummy";
import PageHeader from "../../components/ui/PageHeader";
import Card from "../../components/ui/Card";

export default function AuditLogsPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [roleFilter, setRoleFilter] = useState("All");

  // Merge localStorage audit logs with dummy ones
  const allLogs = useMemo(() => {
    const customLogs = JSON.parse(
      localStorage.getItem("ck_audit_logs") || "[]",
    );
    const merged = [
      ...customLogs,
      ...dummyAuditLogs.map((l) => ({
        id: l.id,
        user: l.user,
        role: l.role,
        action: l.action,
        description: l.details,
        timestamp: l.timestamp,
      })),
    ];
    return merged.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
  }, []);

  const filtered = useMemo(() => {
    let result = allLogs;
    if (roleFilter !== "All") {
      result = result.filter((l) => l.role === roleFilter);
    }
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      result = result.filter(
        (l) =>
          l.user?.toLowerCase().includes(q) ||
          l.action?.toLowerCase().includes(q) ||
          l.description?.toLowerCase().includes(q),
      );
    }
    return result;
  }, [allLogs, roleFilter, searchQuery]);

  const roleIcon = (role) => {
    switch (role) {
      case "Chef":
        return <ChefHat size={14} />;
      case "Reviewer":
        return <ShieldCheck size={14} />;
      case "CRA":
        return <ClipboardCheck size={14} />;
      case "Manager":
        return <Crown size={14} />;
      default:
        return <FileText size={14} />;
    }
  };

  const actionColor = (action) => {
    switch (action) {
      case "Create":
        return "text-emerald-500 bg-emerald-500/10 border-emerald-500/20";
      case "Update":
        return "text-blue-500 bg-blue-500/10 border-blue-500/20";
      case "Delete":
        return "text-rose-500 bg-rose-500/10 border-rose-500/20";
      case "Completed":
        return "text-emerald-500 bg-emerald-500/10 border-emerald-500/20";
      case "Submitted":
        return "text-amber-500 bg-amber-500/10 border-amber-500/20";
      default:
        return "text-[var(--muted)] bg-[var(--bg-subtle)] border-[var(--border)]";
    }
  };

  return (
    <div className="animate-fade-in space-y-8">
      <PageHeader
        title="Universal Audit Logs"
        subtitle="Chronological record of every system interaction and security event."
        actions={[
          <div
            key="activity"
            className="flex items-center gap-2.5 px-5 py-2.5 bg-[var(--primary-glow)] rounded-2xl border border-[var(--primary)]/20 text-[11px] font-black text-[var(--primary)] uppercase tracking-widest shadow-sm"
          >
            <Activity size={14} strokeWidth={3} className="animate-pulse" />
            Live Monitoring Active
          </div>,
        ]}
      />

      {/* Filters Bar */}
      <Card className="p-2 lg:p-3 overflow-visible">
        <div className="flex flex-col lg:flex-row gap-6 lg:items-center">
          <div className="flex-1 relative group">
            <Search
              size={18}
              className="absolute left-4 top-1/2 -translate-y-1/2 text-[var(--muted)] group-focus-within:text-[var(--primary)] transition-colors"
            />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search across identity, action, or payload..."
              className="w-full pl-12 pr-4 py-4 rounded-[20px] bg-[var(--bg)] border border-[var(--border)] text-sm font-bold text-[var(--text)] focus:ring-4 focus:ring-[var(--primary)]/10 focus:border-[var(--primary)] outline-none transition-all placeholder:opacity-50"
            />
          </div>

          <div className="flex flex-wrap gap-2 p-1.5 bg-[var(--bg)] rounded-[24px] border border-[var(--border)] overflow-x-auto scrollbar-hide">
            {["All", "Manager", "Chef", "Reviewer", "CRA"].map((r) => (
              <button
                key={r}
                onClick={() => setRoleFilter(r)}
                className={`flex items-center gap-2 px-5 py-2.5 rounded-[18px] text-[11px] font-black uppercase tracking-wider transition-all duration-300 ${
                  roleFilter === r
                    ? "bg-[var(--primary)] text-white shadow-lg shadow-[var(--primary)]/30 scale-105"
                    : "text-[var(--muted)] hover:text-[var(--text)] hover:bg-[var(--surface-hover)]"
                }`}
              >
                {r !== "All" && roleIcon(r)}
                {r}
              </button>
            ))}
          </div>
        </div>
      </Card>

      {/* Table Container */}
      <Card
        noPad
        className="overflow-hidden border-[var(--border)] shadow-2xl shadow-black/5 rounded-[32px] bg-gradient-to-b from-[var(--surface)] to-[var(--bg)]"
      >
        <div className="overflow-x-auto scrollbar-hide">
          <div className="min-w-[1000px] lg:min-w-full">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-[var(--border)] bg-[var(--bg)]/50 backdrop-blur-xl">
                  <th className="px-8 py-6 text-[10px] font-black text-[var(--muted)] uppercase tracking-[0.2em]">
                    Executing Identity
                  </th>
                  <th className="px-8 py-6 text-[10px] font-black text-[var(--muted)] uppercase tracking-[0.2em]">
                    Authority Level
                  </th>
                  <th className="px-8 py-6 text-[10px] font-black text-[var(--muted)] uppercase tracking-[0.2em]">
                    Operation Type
                  </th>
                  <th className="px-8 py-6 text-[10px] font-black text-[var(--muted)] uppercase tracking-[0.2em]">
                    Activity Description
                  </th>
                  <th className="px-8 py-6 text-[10px] font-black text-[var(--muted)] uppercase tracking-[0.2em]">
                    System Timestamp
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[var(--border)]/50">
                {filtered.map((log, idx) => (
                  <tr
                    key={`${log.id}-${idx}`}
                    className="group hover:bg-[var(--primary-glow)] transition-all duration-500"
                  >
                    <td className="px-8 py-7">
                      <div className="flex items-center gap-4">
                        <div className="w-11 h-11 rounded-[14px] bg-[var(--bg)] border border-[var(--border)] flex items-center justify-center text-[13px] font-black text-[var(--primary)] shadow-sm group-hover:scale-110 group-hover:bg-[var(--primary)] group-hover:text-white transition-all duration-500">
                          {log.user?.charAt(0)?.toUpperCase() || "U"}
                        </div>
                        <div>
                          <div className="font-black text-sm text-[var(--text)] tracking-tight">
                            {log.user}
                          </div>
                          <div className="text-[10px] font-bold text-[var(--muted)] uppercase tracking-widest mt-0.5 opacity-60">
                            ID-{log.id || "N/A"}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-8 py-7">
                      <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-xl bg-[var(--surface)] border border-[var(--border)] text-[10px] font-black text-[var(--text)] uppercase tracking-[0.1em] shadow-sm">
                        <span className="text-[var(--primary)]">
                          {roleIcon(log.role)}
                        </span>
                        {log.role}
                      </div>
                    </td>
                    <td className="px-8 py-7">
                      <div
                        className={`inline-flex items-center px-4 py-1.5 rounded-xl text-[10px] font-black uppercase tracking-widest border border-current bg-transparent ${actionColor(log.action)}`}
                      >
                        {log.action}
                      </div>
                    </td>
                    <td className="px-8 py-7">
                      <div className="text-sm font-bold text-[var(--text)] max-w-xs leading-relaxed group-hover:translate-x-1 transition-transform duration-500">
                        {log.description}
                      </div>
                    </td>
                    <td className="px-8 py-7 whitespace-nowrap">
                      <div className="flex flex-col gap-1">
                        <div className="flex items-center gap-2 text-[11px] font-black text-[var(--text)]">
                          <Calendar
                            size={12}
                            className="text-[var(--primary)] opacity-60"
                          />
                          {log.timestamp?.split(",")[0]}
                        </div>
                        <div className="flex items-center gap-2 text-[11px] font-black text-[var(--muted)] uppercase tracking-tighter opacity-70">
                          <Clock size={12} className="opacity-40" />
                          {log.timestamp?.split(",")[1] || log.timestamp}
                        </div>
                      </div>
                    </td>
                  </tr>
                ))}
                {filtered.length === 0 && (
                  <tr>
                    <td colSpan={5} className="px-8 py-24 text-center">
                      <div className="flex flex-col items-center justify-center">
                        <div className="w-20 h-20 bg-[var(--border)]/30 rounded-[32px] flex items-center justify-center mb-6">
                          <FileText
                            size={32}
                            className="text-[var(--muted)] opacity-50"
                          />
                        </div>
                        <div className="text-xl font-black text-[var(--text)] uppercase tracking-widest">
                          No Logs Available
                        </div>
                        <p className="text-xs font-bold text-[var(--muted)] mt-2 max-w-[280px] leading-relaxed">
                          System logs for the selected criteria are currently
                          empty.
                        </p>
                      </div>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </Card>
    </div>
    //   );
    // }
  );
}
