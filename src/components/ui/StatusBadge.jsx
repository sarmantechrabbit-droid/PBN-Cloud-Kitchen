import { CheckCircle, XCircle, Clock, AlertTriangle } from "lucide-react";

const configs = {
  Completed: {
    bg: "var(--success-glow)",
    color: "var(--success)",
    icon: <CheckCircle size={11} />,
  },
  Pending: {
    bg: "var(--warning-glow)",
    color: "var(--warning)",
    icon: <Clock size={11} />,
  },
  Submitted: {
    bg: "var(--info-glow)",
    color: "var(--info)",
    icon: <Clock size={11} />,
  },
  // Completed: {
  //   bg: "var(--success-glow)",
  //   color: "var(--success)",
  //   icon: <CheckCircle size={11} />,
  // },
  Cancel: {
    bg: "var(--danger-glow)",
    color: "var(--danger)",
    icon: <XCircle size={11} />,
  },
  Review: {
    bg: "var(--warning-glow)",
    color: "var(--warning)",
    icon: <AlertTriangle size={11} />,
  },
  Low: { bg: "var(--success-glow)", color: "var(--success)", icon: null },
  Medium: { bg: "var(--warning-glow)", color: "var(--warning)", icon: null },
  High: { bg: "var(--danger-glow)", color: "var(--danger)", icon: null },
};

const statusStyles = {
  Completed: "bg-[var(--success-glow)] text-[var(--success)]",
  Pending: "bg-[var(--warning-glow)] text-[var(--warning)]",
  Submitted: "bg-[var(--info-glow)] text-[var(--info)]",
  // Completed: "bg-[var(--success-glow)] text-[var(--success)]",
  Cancel: "bg-[var(--danger-glow)] text-[var(--danger)]",
  Review: "bg-[var(--warning-glow)] text-[var(--warning)]",
  Low: "bg-[var(--success-glow)] text-[var(--success)]",
  Medium: "bg-[var(--warning-glow)] text-[var(--warning)]",
  High: "bg-[var(--danger-glow)] text-[var(--danger)]",
};

export default function StatusBadge({ status }) {
  const cfg = configs[status] || configs.Pending;
  const styleClass = statusStyles[status] || statusStyles.Pending;

  return (
    <span
      className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-bold whitespace-nowrap transition-colors ${styleClass}`}
    >
      {cfg.icon}
      {status}
    </span>
  );
}
