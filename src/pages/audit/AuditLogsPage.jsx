import React, { useState, useMemo } from "react";
import {
  FileText,
  Search,
  ChefHat,
  ShieldCheck,
  ClipboardCheck,
  Crown,
  Filter,
} from "lucide-react";
import { auditLogs as dummyAuditLogs } from "../../data/dummy";

export default function AuditLogsPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [roleFilter, setRoleFilter] = useState("All");

  // Merge localStorage audit logs with dummy ones
  const allLogs = useMemo(() => {
    const customLogs = JSON.parse(localStorage.getItem("ck_audit_logs") || "[]");
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
    return merged;
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
          l.description?.toLowerCase().includes(q)
      );
    }
    return result;
  }, [allLogs, roleFilter, searchQuery]);

  const roleIcon = (role) => {
    switch (role) {
      case "Chef": return <ChefHat size={12} />;
      case "Reviewer": return <ShieldCheck size={12} />;
      case "CRA": return <ClipboardCheck size={12} />;
      case "Manager": return <Crown size={12} />;
      default: return <FileText size={12} />;
    }
  };

  const actionColor = (action) => {
    switch (action) {
      case "Create": return "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400";
      case "Update": return "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400";
      case "Delete": return "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400";
      case "Completed": return "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400";
      case "Submitted": return "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400";
      default: return "bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-300";
    }
  };

  return (
    <div className="max-w-7xl mx-auto space-y-6" style={{ animation: "fadeIn 0.3s ease-out" }}>
      {/* Page Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Audit Logs</h1>
        <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">Track all system activity and user actions.</p>
      </div>

      {/* Filters */}
      <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700 shadow-sm p-4">
        <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
          <div className="relative flex-1 max-w-md">
            <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search logs..."
              className="w-full pl-9 pr-4 py-2.5 rounded-xl border border-gray-200 dark:border-gray-600 bg-gray-50 dark:bg-gray-900 text-sm text-gray-900 dark:text-white focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 outline-none transition-all"
            />
          </div>
          <div className="flex p-1 bg-gray-100 dark:bg-gray-900 rounded-lg">
            {["All", "Manager", "Chef", "Reviewer", "CRA"].map((r) => (
              <button
                key={r}
                onClick={() => setRoleFilter(r)}
                className={`px-3 py-1.5 rounded-md text-xs font-semibold transition-all ${
                  roleFilter === r
                    ? "bg-white dark:bg-gray-800 text-gray-900 dark:text-white shadow-sm"
                    : "text-gray-500 hover:text-gray-700 dark:hover:text-gray-300"
                }`}
              >
                {r}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Logs Table */}
      <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-gray-50 dark:bg-gray-900/50 text-gray-500 dark:text-gray-400 text-xs uppercase tracking-wider">
              <tr>
                <th className="px-6 py-4 font-semibold">User Name</th>
                <th className="px-6 py-4 font-semibold">Role</th>
                <th className="px-6 py-4 font-semibold">Action</th>
                <th className="px-6 py-4 font-semibold">Description</th>
                <th className="px-6 py-4 font-semibold">Date & Time</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 dark:divide-gray-700">
              {filtered.map((log, idx) => (
                <tr key={`${log.id}-${idx}`} className="hover:bg-gray-50 dark:hover:bg-gray-700/40 transition-colors">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-indigo-100 dark:bg-indigo-900/30 flex items-center justify-center text-xs font-bold text-indigo-700 dark:text-indigo-300">
                        {log.user?.charAt(0)?.toUpperCase() || "U"}
                      </div>
                      <span className="font-semibold text-sm text-gray-900 dark:text-white">{log.user}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-300">
                      {roleIcon(log.role)} {log.role}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold ${actionColor(log.action)}`}>
                      {log.action}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-600 dark:text-gray-300 max-w-xs truncate" title={log.description}>
                    {log.description}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-500 dark:text-gray-400 whitespace-nowrap">
                    {log.timestamp}
                  </td>
                </tr>
              ))}
              {filtered.length === 0 && (
                <tr>
                  <td colSpan={5} className="px-6 py-12 text-center text-sm text-gray-400">No audit logs found.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
