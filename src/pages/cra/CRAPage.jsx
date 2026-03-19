import React, { useState } from "react";
import {
  Download,
  Filter,
  ChevronDown,
  ChevronUp,
  Search,
  Shield,
  Clock,
  ChevronRight,
  Activity,
  Calendar,
} from "lucide-react";
import Card from "../../components/ui/Card";
import PageHeader from "../../components/ui/PageHeader";
import StatusBadge from "../../components/ui/StatusBadge";
import { auditLogs } from "../../data/dummy";

export default function CRAPage() {
  const [expanded, setExpanded] = useState(null);
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const pageSize = 10;

  const filtered = auditLogs.filter((l) => {
    const matchesSearch =
      l.id.toLowerCase().includes(search.toLowerCase()) ||
      l.expId.toLowerCase().includes(search.toLowerCase()) ||
      l.user.toLowerCase().includes(search.toLowerCase()) ||
      (l.details && l.details.toLowerCase().includes(search.toLowerCase()));

    return matchesSearch;
  });

  const totalPages = Math.max(1, Math.ceil(filtered.length / pageSize));
  const pageItems = filtered.slice((page - 1) * pageSize, page * pageSize);

  return (
    <div className="animate-fade-in">
      <PageHeader
        title="Audit Logs"
        subtitle="Immutable ledger of experiment events analyzed by AI for quality assurance."
        // actions={[
        //   <div
        //     key="stats"
        //     className="flex items-center gap-2.5 px-5 py-2.5 bg-blue-500/10 rounded-2xl border border-blue-500/20 text-[11px] font-black text-blue-600 uppercase tracking-widest shadow-sm"
        //   >
        //     <Shield size={14} strokeWidth={3} className="animate-pulse" />
        //     Security Shield Active
        //   </div>,
        // ]}
      />
 
      {/* Toolbar & Filters */}
      <Card className="mb-8 p-3 lg:p-4">
        <div className="flex flex-col lg:flex-row gap-6 lg:items-center">
          <div className="flex-1 relative group">
            <Search
              size={18}
              className="absolute left-4 top-1/2 -translate-y-1/2 text-[var(--muted)] group-focus-within:text-[var(--primary)] transition-colors"
            />
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Query logs by identity, experiment ID, or operator..."
              className="w-full pl-12 pr-4 py-4 rounded-[20px] bg-[var(--bg)] border border-[var(--border)] text-sm font-bold text-[var(--text)] focus:ring-4 focus:ring-[var(--primary)]/10 focus:border-[var(--primary)] outline-none transition-all placeholder:opacity-50"
            />
          </div>
        </div>
      </Card>

      <Card
        noPad
        className="overflow-hidden border-[var(--border)] shadow-2xl shadow-black/5 dark:shadow-none rounded-[32px] bg-gradient-to-b from-[var(--surface)] to-[var(--bg)]"
      >
        <div className="overflow-x-auto scrollbar-hide">
          <div className="min-w-[1000px] lg:min-w-full">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-[var(--border)] bg-[var(--bg)]/50 backdrop-blur-xl">
                  <th className="px-6 py-5 text-[10px] font-black text-[var(--muted)] uppercase tracking-[0.2em] text-center">
                    Identity
                  </th>
                  <th className="px-6 py-5 text-[10px] font-black text-[var(--muted)] uppercase tracking-[0.2em]">
                    Context
                  </th>
                  <th className="px-6 py-5 text-[10px] font-black text-[var(--muted)] uppercase tracking-[0.2em]">
                    Authority
                  </th>
                  <th className="px-6 py-5 text-[10px] font-black text-[var(--muted)] uppercase tracking-[0.2em]">
                    Operation
                  </th>
                  <th className="px-6 py-5 text-[10px] font-black text-[var(--muted)] uppercase tracking-[0.2em]">
                    AI Verdict
                  </th>
                  <th className="px-6 py-5 text-[10px] font-black text-[var(--muted)] uppercase tracking-[0.2em]">
                    Operator
                  </th>
                  <th className="px-6 py-5 text-[10px] font-black text-[var(--muted)] uppercase tracking-[0.2em]">
                    Time Dimension
                  </th>
                  <th className="px-6 py-5 text-[10px] font-black text-[var(--muted)] uppercase tracking-[0.2em]">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[var(--border)]/50">
                {pageItems.map((log) => {
                  const uniqueKey = `${log.id}-${log.expId}`;
                  const isExpanded = expanded === uniqueKey;

                  return (
                    <React.Fragment key={uniqueKey}>
                      <tr
                        className={`group transition-all duration-500 hover:bg-[var(--primary-glow)] ${isExpanded ? "bg-[var(--primary-glow)]" : ""}`}
                      >
                        <td className="px-6 py-6 text-center">
                          <span className="text-[11px] font-black text-[var(--text)] bg-[var(--bg)] px-3 py-1.5 rounded-xl border border-[var(--border)] font-mono shadow-sm">
                            {log.id}
                          </span>
                        </td>
                        <td className="px-6 py-6 font-mono text-xs font-bold text-[var(--primary)]">
                          {log.expId}
                        </td>
                        <td className="px-6 py-6">
                          <span className="text-[10px] font-black px-3 py-1.5 rounded-xl bg-[var(--bg)] text-[var(--muted)] border border-[var(--border)] uppercase tracking-wider">
                            {log.role}
                          </span>
                        </td>
                        <td className="px-6 py-6">
                          <StatusBadge status={log.action} />
                        </td>
                        <td className="px-6 py-6">
                          <StatusBadge status={log.aiStatus} />
                        </td>
                        <td className="px-6 py-6">
                          <div className="flex items-center gap-3">
                            <div className="w-8 h-8 rounded-[10px] bg-[var(--surface)] border border-[var(--border)] flex items-center justify-center text-[10px] font-black text-[var(--primary)] shadow-sm group-hover:scale-110 transition-transform">
                              {log.user
                                .split(" ")
                                .map((n) => n[0])
                                .join("")}
                            </div>
                            <span className="text-xs font-black text-[var(--text)] tracking-tight">
                              {log.user}
                            </span>
                          </div>
                        </td>
                        <td className="px-6 py-6 whitespace-nowrap">
                          <div className="text-[11px] font-black text-[var(--muted)] flex items-center gap-2 opacity-80 uppercase tracking-tighter">
                            <Clock size={12} className="opacity-40" />
                            {log.timestamp}
                          </div>
                        </td>
                        <td className="px-6 py-6 text-right">
                          <button
                            onClick={() =>
                              setExpanded(isExpanded ? null : uniqueKey)
                            }
                            className={`w-10 h-10 rounded-full border flex items-center justify-center transition-all duration-500 shadow-sm ${
                              isExpanded
                                ? "bg-[var(--primary)] text-white border-[var(--primary)] rotate-180"
                                : "bg-[var(--surface)] text-[var(--muted)] border-[var(--border)] hover:border-[var(--primary)] hover:text-[var(--primary)]"
                            }`}
                          >
                            <ChevronDown size={14} strokeWidth={3} />
                          </button>
                        </td>
                      </tr>

                      {isExpanded && (
                        <tr key={`${uniqueKey}-detail`}>
                          <td
                            colSpan={8}
                            className="px-8 py-0 bg-transparent overflow-hidden"
                          >
                            <div className="mb-8 p-10 bg-[var(--surface)] rounded-[40px] border border-[var(--border)] shadow-inner relative overflow-hidden group/detail">
                              <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-br from-[var(--primary)]/5 to-transparent rounded-full -mr-32 -mt-32 blur-3xl" />

                              <div className="relative z-10 space-y-8">
                                <div className="flex items-center justify-between">
                                  <div className="flex items-center gap-3">
                                    <div className="w-2.5 h-7 bg-[var(--primary)] rounded-full" />
                                    <h4 className="text-sm font-black text-[var(--text)] uppercase tracking-[0.2em]">
                                      Deep Protocol Analysis
                                    </h4>
                                  </div>
                                  <button className="flex items-center gap-2 px-6 py-2.5 bg-[var(--bg)] rounded-2xl border border-[var(--border)] hover:border-[var(--primary)]/30 text-[10px] font-black text-[var(--muted)] hover:text-[var(--primary)] uppercase tracking-widest transition-all shadow-sm">
                                    <Download size={12} />
                                    Export Ledger
                                  </button>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-3 gap-8 p-8 bg-[var(--bg)]/50 rounded-[32px] border border-[var(--border)]">
                                  <div className="space-y-1.5">
                                    <div className="text-[10px] font-black text-[var(--muted)] uppercase tracking-widest opacity-50">
                                      Log Verification Hash
                                    </div>
                                    <div className="text-xs font-black text-[var(--text)] font-mono break-all bg-[var(--surface)] p-3 rounded-xl border border-[var(--border)]/50">
                                      {log.id.toLowerCase().replace("-", "")}
                                      9a2b7c4d8e1f5g0h
                                    </div>
                                  </div>
                                  <div className="space-y-1.5">
                                    <div className="text-[10px] font-black text-[var(--muted)] uppercase tracking-widest opacity-50">
                                      Sync Integrity
                                    </div>
                                    <div className="flex items-center gap-2 text-xs font-black text-emerald-500 uppercase">
                                      <Shield size={14} /> Global Ledger
                                      Consistent
                                    </div>
                                  </div>
                                  <div className="space-y-1.5">
                                    <div className="text-[10px] font-black text-[var(--muted)] uppercase tracking-widest opacity-50">
                                      Experiment Reference
                                    </div>
                                    <div className="text-xs font-black text-[var(--primary)]">
                                      {log.expId}
                                    </div>
                                  </div>
                                </div>

                                <div className="space-y-4">
                                  <div className="text-[10px] font-black text-[var(--muted)] uppercase tracking-widest flex items-center gap-2">
                                    <Activity size={12} /> Log Internal Payload
                                  </div>
                                  <div className="p-8 bg-[var(--bg)] rounded-[32px] border border-[var(--border)]/50 shadow-inner group-hover/detail:border-[var(--primary)]/20 transition-colors duration-500">
                                    <div className="text-[13px] font-bold text-[var(--text)] leading-relaxed tracking-tight">
                                      {log.details}
                                    </div>
                                  </div>
                                </div>

                                <div className="flex flex-wrap gap-6 pt-4 text-[10px] font-black text-[var(--muted)] uppercase tracking-[0.1em]">
                                  <div className="flex items-center gap-2 px-4 py-2 bg-[var(--bg)] rounded-xl border border-[var(--border)]/50">
                                    <Calendar
                                      size={12}
                                      className="opacity-50"
                                    />
                                    {log.timestamp}
                                  </div>
                                  <div className="flex items-center gap-2 px-4 py-2 bg-[var(--bg)] rounded-xl border border-[var(--border)]/50">
                                    <div className="w-2 h-2 rounded-full bg-[var(--primary)]" />
                                    Operator: {log.user}
                                  </div>
                                </div>
                              </div>
                            </div>
                          </td>
                        </tr>
                      )}
                    </React.Fragment>
                  );
                })}
                {pageItems.length === 0 && (
                  <tr>
                    <td
                      colSpan={9}
                      className="p-10 text-center text-[var(--muted)] text-[13px]"
                    >
                      No audit logs found
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        <div className="px-8 py-6 border-t border-[var(--border)] flex flex-col lg:flex-row justify-between items-center gap-6 bg-[var(--bg)]/30 backdrop-blur-md">
          <div className="flex items-center gap-4">
            <div className="flex -space-x-3">
              {[1, 2, 3].map((i) => (
                <div
                  key={i}
                  className="w-8 h-8 rounded-full border-2 border-[var(--surface)] bg-[var(--bg)] flex items-center justify-center text-[10px] font-black text-[var(--muted)]"
                >
                  {i}
                </div>
              ))}
              <div className="w-8 h-8 rounded-full border-2 border-[var(--surface)] bg-[var(--primary-glow)] flex items-center justify-center text-[10px] font-black text-[var(--primary)]">
                +
              </div>
            </div>
            <span className="text-[11px] font-black text-[var(--muted)] uppercase tracking-widest opacity-70">
              Validated {filtered.length} Protocol Events
            </span>
          </div>

          <div className="flex items-center gap-4 bg-[var(--surface)] p-1.5 rounded-full border border-[var(--border)] shadow-sm">
            <button
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              disabled={page === 1}
              className={`w-10 h-10 rounded-full flex items-center justify-center transition-all ${
                page === 1
                  ? "text-[var(--muted)] opacity-30 cursor-not-allowed"
                  : "text-[var(--text)] hover:bg-[var(--bg)] hover:text-[var(--primary)]"
              }`}
            >
              <ChevronRight size={18} className="rotate-180" />
            </button>
            <div className="px-5 text-[11px] font-black text-[var(--text)] uppercase tracking-[0.2em] border-x border-[var(--border)]/50">
              Page {page} <span className="text-[var(--muted)] mx-1">/</span>{" "}
              {totalPages}
            </div>
            <button
              onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
              disabled={page === totalPages}
              className={`w-10 h-10 rounded-full flex items-center justify-center transition-all ${
                page === totalPages
                  ? "text-[var(--muted)] opacity-30 cursor-not-allowed"
                  : "text-[var(--text)] hover:bg-[var(--bg)] hover:text-[var(--primary)]"
              }`}
            >
              <ChevronRight size={18} />
            </button>
          </div>

          <div className="hidden lg:flex items-center gap-2.5 px-5 py-2.5 bg-[var(--bg)] rounded-2xl border border-[var(--border)] text-[10px] font-black text-[var(--muted)] uppercase tracking-widest font-mono">
            <Activity size={12} className="text-emerald-500 animate-pulse" />
            Node Synced: {new Date().toISOString().split("T")[0]}
          </div>
        </div>
      </Card>
    </div>
  );
}
