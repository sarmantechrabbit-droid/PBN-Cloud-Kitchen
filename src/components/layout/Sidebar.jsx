import { NavLink, useLocation } from "react-router-dom";
import {
  LayoutDashboard,
  ChefHat,
  ShieldCheck,
  Brain,
  FileText,
  Settings,
  HelpCircle,
  LogOut,
  Menu,
  ChevronRight,
  Users,
  ScrollText,
} from "lucide-react";

import { Type } from "lucide-react";

const navItems = [
  {
    to: "/",
    label: "Dashboard",
    icon: <LayoutDashboard size={18} />,
    roles: ["Manager", "Chef", "Reviewer", "CRA"],
  },
  {
    to: "/all-recipes",
    label: "All Recipes",
    icon: <ChefHat size={18} />,
    roles: ["Chef", "Manager", "CRA"],
  },
  {
    to: "/reviews",
    label: "Submit Feedbacks",
    icon: <ShieldCheck size={18} />,
    roles: ["Manager", "Reviewer"],
  },
  {
    to: "/ai",
    label: "AI Analysis",
    icon: <Brain size={18} />,
    roles: ["Manager", "CRA"],
  },
  {
    to: "/quality-builder",
    label: "Question Builder",
    icon: <Type size={18} />,
    roles: ["Manager"],
  },
  {
    to: "/role-management",
    label: "Role Management",
    icon: <Users size={18} />,
    roles: ["Manager"],
  },
  {
    to: "/cra",
    label: " Audit Logs",
    icon: <FileText size={18} />,
    roles: ["CRA", "Manager"],
  },
  //  {
  //   to: "/audit-logs",
  //   label: "Audit Logs",
  //   icon: <ScrollText size={18} />,
  //   roles: ["Manager", "Chef", "Reviewer", "CRA"],
  // },

  {
    to: "/recipes",
    label: "Recipes",
    icon: <ChefHat size={18} />,
    roles: ["Chef"],
  },
  {
    to: "/quality",
    label: "Review Recipe",
    icon: <ShieldCheck size={18} />,
    roles: ["Reviewer"],
  },
];

export default function Sidebar({ collapsed, setCollapsed, onLogout }) {
  const location = useLocation();
  const role = localStorage.getItem("ck_role");
  const isChef = role === "Chef";
  const filteredItems = navItems.filter((item) => item.roles?.includes(role));

  return (
    <aside
      style={{
        width: collapsed ? 64 : 220,
        minHeight: "100vh",
        background: "var(--sidebar-bg)",
        borderRight: "1px solid var(--border)",
        display: "flex",
        flexDirection: "column",
        transition: "width 0.25s cubic-bezier(0.4,0,0.2,1)",
        position: "fixed",
        top: 0,
        left: 0,
        zIndex: 100,
        overflowX: "hidden",
      }}
    >
      {/* Logo */}
      <div
        style={{
          padding: collapsed ? "12px" : "18px 14px",
          display: "flex",
          alignItems: "center",
          gap: collapsed ? 0 : 10,
          borderBottom: "1px solid var(--border)",
          minHeight: 64,
          justifyContent: collapsed ? "center" : "flex-start",
        }}
      >
        <button
          onClick={() => setCollapsed(!collapsed)}
          style={{
            display: "flex",
            alignItems: "center",
            gap: collapsed ? 0 : 10,
            background: "transparent",
            border: "none",
            cursor: "pointer",
            padding: 0,
            width: collapsed ? 36 : "auto",
          }}
          aria-label={collapsed ? "Open sidebar" : "Close sidebar"}
          title={collapsed ? "Open sidebar" : "Close sidebar"}
        >
          <div
            style={{
              minWidth: 36,
              height: 36,
              background: "var(--primary)",
              borderRadius: 10,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              boxShadow: "0 4px 14px var(--primary-glow-strong)",
              flexShrink: 0,
            }}
          >
            <ChefHat size={18} color="#fff" />
          </div>
          {!collapsed && (
            <div style={{ overflow: "hidden", textAlign: "left" }}>
              <div
                style={{
                  fontSize: 13,
                  fontWeight: 800,
                  color: "var(--text)",
                  lineHeight: 1.2,
                  whiteSpace: "nowrap",
                }}
              >
                Cloud Kitchen
              </div>
              <div
                style={{
                  fontSize: 10,
                  color: "var(--muted)",
                  marginTop: 2,
                  whiteSpace: "nowrap",
                }}
              >
                Kitchen Admin
              </div>
            </div>
          )}
        </button>
        {!collapsed && (
          <button
            onClick={() => setCollapsed(true)}
            style={{
              width: 30,
              height: 30,
              borderRadius: 8,
              border: "1px solid var(--border)",
              background: "var(--bg)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              cursor: "pointer",
              marginLeft: "auto",
            }}
            aria-label="Close sidebar"
            title="Close sidebar"
          >
            <Menu size={16} style={{ color: "var(--muted)" }} />
          </button>
        )}
      </div>

      {/* Nav links */}
      <nav style={{ flex: 1, padding: "10px 8px", overflowY: "auto" }}>
        {!collapsed && filteredItems.length > 0 && (
          <div
            style={{
              fontSize: 10,
              fontWeight: 700,
              color: "var(--muted)",
              textTransform: "uppercase",
              letterSpacing: 1,
              padding: "4px 12px 10px",
            }}
          >
            Main Menu
          </div>
        )}
        {filteredItems.map((item) => {
          const isActive =
            location.pathname === item.to ||
            (item.to !== "/" && location.pathname.startsWith(item.to + "/"));
          return (
            <NavLink
              key={item.to}
              to={item.to}
              style={{
                textDecoration: "none",
                display: "block",
                marginBottom: 2,
              }}
            >
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 12,
                  padding: "10px 12px",
                  borderRadius: 10,
                  background: isActive ? "var(--primary-glow)" : "transparent",
                  color: isActive ? "var(--primary)" : "var(--muted)",
                  fontWeight: isActive ? 700 : 500,
                  fontSize: 13,
                  borderLeft: isActive
                    ? "2px solid var(--primary)"
                    : "2px solid transparent",
                  transition: "all 0.15s",
                  cursor: "pointer",
                }}
                onMouseEnter={(e) => {
                  if (!isActive) {
                    e.currentTarget.style.background = "var(--surface-hover)";
                    e.currentTarget.style.color = "var(--text)";
                  }
                }}
                onMouseLeave={(e) => {
                  if (!isActive) {
                    e.currentTarget.style.background = "transparent";
                    e.currentTarget.style.color = "var(--muted)";
                  }
                }}
              >
                <span style={{ minWidth: 18, display: "flex" }}>
                  {item.icon}
                </span>
                {!collapsed && (
                  <>
                    <span style={{ whiteSpace: "nowrap", flex: 1 }}>
                      {item.to === "/recipes" && isChef
                        ? "Create Experiment"
                        : item.label}
                    </span>
                    {isActive && <ChevronRight size={13} />}
                  </>
                )}
              </div>
            </NavLink>
          );
        })}
      </nav>
    </aside>
  );
}
