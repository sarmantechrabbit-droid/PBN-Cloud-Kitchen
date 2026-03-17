import React, { useState } from "react";
import {
  Download,
  Filter,
  ChevronDown,
  ChevronUp,
  Search,
  Shield,
} from "lucide-react";
import Card from "../../components/ui/Card";
import PageHeader from "../../components/ui/PageHeader";
import StatusBadge from "../../components/ui/StatusBadge";
import { auditLogs } from "../../data/dummy";

export default function CRAPage() {
  const [expanded, setExpanded] = useState(null);
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("All");
  const [page, setPage] = useState(1);
  const pageSize = 10;

  const filtered = auditLogs.filter((l) => {
    const matchesSearch =
      l.id.toLowerCase().includes(search.toLowerCase()) ||
      l.expId.toLowerCase().includes(search.toLowerCase()) ||
      l.user.toLowerCase().includes(search.toLowerCase()) ||
      (l.details && l.details.toLowerCase().includes(search.toLowerCase()));

    const matchesFilter = filter === "All" || l.aiStatus === filter;

    return matchesSearch && matchesFilter;
  });

  const totalPages = Math.max(1, Math.ceil(filtered.length / pageSize));
  const pageItems = filtered.slice((page - 1) * pageSize, page * pageSize);

  return (
    <div style={{ animation: "fadeIn 0.3s ease-out" }}>
      <PageHeader
        title="Audit Logs"
        subtitle="Immutable AI-generated audit trail for all experiment actions."
      />

      {/* Log table */}
      <Card noPad>
        {/* Toolbar */}
        <div
          style={{
            padding: "14px 20px",
            borderBottom: "1px solid var(--border)",
            display: "flex",
            alignItems: "center",
            gap: 10,
            flexWrap: "wrap",
          }}
        >
          <div
            style={{
              position: "relative",
              flex: 1,
              minWidth: 200,
              maxWidth: 300,
            }}
          >
            <Search
              size={13}
              style={{
                position: "absolute",
                left: 10,
                top: "50%",
                transform: "translateY(-50%)",
                color: "var(--muted)",
              }}
            />
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search logs, users, IDs..."
              className="input-field"
              style={{ paddingLeft: 30, paddingTop: 8, paddingBottom: 8 }}
            />
          </div>
          <div style={{ display: "flex", gap: 6 }} />
          <div style={{ marginLeft: "auto", display: "flex", gap: 8 }}>
            {/* <button className="btn-ghost" style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '7px 12px' }}>
              <Filter size={13} /> Filter
            </button> */}
          </div>
        </div>

        <div style={{ overflowX: "auto" }}>
          <table className="table">
            <thead>
              <tr>
                {[
                  "Log ID",
                  "Exp ID",
                  "Role",
                  "Version",
                  "Action",
                  "AI Result",
                  "User",
                  "Timestamp",
                  "Details",
                ].map((h) => (
                  <th key={h}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {pageItems.map((log) => {
                const uniqueKey = `${log.id}-${log.expId}`;
                const isExpanded = expanded === uniqueKey;

                return (
                  <React.Fragment key={uniqueKey}>
                    <tr className="table-row">
                      <td className="table-cell-primary table-cell-mono">
                        {log.id}
                      </td>
                      <td className="table-cell-mono">{log.expId}</td>
                      <td>
                        <span
                          style={{
                            fontSize: 10,
                            fontWeight: 700,
                            padding: "2px 8px",
                            borderRadius: 6,
                            background: "var(--bg)",
                            color: "var(--muted)",
                            border: "1px solid var(--border)",
                          }}
                        >
                          {log.role}
                        </span>
                      </td>
                      <td
                        className="table-cell-mono"
                        style={{ fontWeight: 600 }}
                      >
                        {log.version}
                      </td>
                      <td>
                        <StatusBadge status={log.action} />
                      </td>
                      <td>
                        <StatusBadge status={log.aiStatus} />
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
                            {log.user
                              .split(" ")
                              .map((n) => n[0])
                              .join("")}
                          </div>
                          <span style={{ fontSize: 12, color: "var(--text)" }}>
                            {log.user}
                          </span>
                        </div>
                      </td>
                      <td
                        className="table-cell-muted table-cell-mono"
                        style={{ whiteSpace: "nowrap" }}
                      >
                        {log.timestamp}
                      </td>
                      <td>
                        <button
                          onClick={() =>
                            setExpanded(isExpanded ? null : uniqueKey)
                          }
                          style={{
                            background: isExpanded
                              ? "var(--primary-glow)"
                              : "var(--bg)",
                            border: `1px solid ${isExpanded ? "var(--primary)" : "var(--border)"}`,
                            borderRadius: 7,
                            padding: "5px 12px",
                            color: isExpanded
                              ? "var(--primary)"
                              : "var(--muted)",
                            cursor: "pointer",
                            fontSize: 11,
                            fontWeight: 600,
                            display: "flex",
                            alignItems: "center",
                            gap: 4,
                            fontFamily: "inherit",
                            transition: "all 0.15s",
                          }}
                        >
                          {isExpanded ? (
                            <>
                              <ChevronUp size={11} /> Hide
                            </>
                          ) : (
                            <>
                              <ChevronDown size={11} /> View
                            </>
                          )}
                        </button>
                      </td>
                    </tr>

                    {isExpanded && (
                      <tr key={`${uniqueKey}-detail`}>
                        <td
                          colSpan={9}
                          style={{
                            padding: "0 16px 16px",
                            background: "rgba(249,115,22,0.03)",
                          }}
                        >
                          <div
                            style={{
                              padding: 16,
                              background: "var(--surface)",
                              borderRadius: 10,
                              border: "1px solid var(--border)",
                              marginTop: 4,
                            }}
                          >
                            <div
                              style={{
                                display: "flex",
                                alignItems: "center",
                                gap: 8,
                                marginBottom: 10,
                              }}
                            >
                              <span
                                style={{
                                  fontSize: 10,
                                  fontWeight: 800,
                                  color: "var(--primary)",
                                  textTransform: "uppercase",
                                  letterSpacing: 1,
                                }}
                              >
                                Audit Log Detail
                              </span>
                              <span
                                style={{
                                  fontSize: 10,
                                  color: "var(--muted)",
                                  background: "var(--bg)",
                                  padding: "2px 8px",
                                  borderRadius: 4,
                                  fontFamily: "JetBrains Mono, monospace",
                                }}
                              >
                                {log.id}
                              </span>
                            </div>
                            <div
                              style={{
                                fontSize: 12,
                                color: "var(--subtle)",
                                lineHeight: 1.8,
                                fontFamily: "JetBrains Mono, monospace",
                              }}
                            >
                              {log.details}
                            </div>
                            <div
                              style={{
                                marginTop: 12,
                                paddingTop: 10,
                                borderTop: "1px solid var(--border)",
                                display: "flex",
                                gap: 20,
                                fontSize: 11,
                                color: "var(--muted)",
                              }}
                            >
                              <span>
                                🔐 Hash: {log.id.toLowerCase().replace("-", "")}
                                a3f9...
                              </span>
                              <span>📅 {log.timestamp}</span>
                              <span>👤 {log.user}</span>
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
                    style={{
                      padding: 40,
                      textAlign: "center",
                      color: "var(--muted)",
                      fontSize: 13,
                    }}
                  >
                    No audit logs found
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        <div
          style={{
            padding: "14px 20px",
            borderTop: "1px solid var(--border)",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <span style={{ fontSize: 12, color: "var(--muted)" }}>
            Showing {pageItems.length} of {filtered.length} log entries
          </span>
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <button
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              disabled={page === 1}
              className="btn-ghost"
              style={{ padding: "6px 10px", opacity: page === 1 ? 0.5 : 1 }}
            >
              Prev
            </button>
            <span style={{ fontSize: 12, color: "var(--muted)" }}>
              Page {page} / {totalPages}
            </span>
            <button
              onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
              disabled={page === totalPages}
              className="btn-ghost"
              style={{
                padding: "6px 10px",
                opacity: page === totalPages ? 0.5 : 1,
              }}
            >
              Next
            </button>
          </div>
          <span
            style={{
              fontSize: 11,
              color: "var(--muted)",
              fontFamily: "JetBrains Mono, monospace",
            }}
          >
            Last synced: 2024-12-14 09:47:30 UTC
          </span>
        </div>
      </Card>
    </div>
  );
}
