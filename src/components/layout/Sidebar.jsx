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
  X,
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

export default function Sidebar({
  collapsed,
  setCollapsed,
  isMobileOpen,
  setIsMobileOpen,
  onLogout,
}) {
  const location = useLocation();
  const role = localStorage.getItem("ck_role");
  const isChef = role === "Chef";
  const filteredItems = navItems.filter((item) => item.roles?.includes(role));

  return (
    <>
      {/* Mobile Backdrop */}
      {isMobileOpen && (
        <div
          className="fixed inset-0 z-[110] bg-black/50 backdrop-blur-sm md:hidden"
          onClick={() => setIsMobileOpen(false)}
        />
      )}

      <aside
        className={`fixed top-0 left-0 z-[120] h-screen bg-[var(--sidebar-bg)] border-r border-[var(--border)] transition-all duration-250 ease-[cubic-bezier(0.4,0,0.2,1)] flex flex-col overflow-x-hidden ${
          collapsed ? "md:w-16" : "md:w-[220px]"
        } ${isMobileOpen ? "w-[260px] translate-x-0" : "w-[260px] md:translate-x-0 -translate-x-full"}`}
      >
        {/* Logo */}
        <div
          className={`flex items-center border-b border-[var(--border)] min-h-[64px] ${
            collapsed
              ? "p-3 justify-center"
              : "py-[18px] px-[14px] gap-[10px] justify-start"
          }`}
        >
          <button
            onClick={() => {
              setCollapsed(!collapsed);
              setIsMobileOpen(false);
            }}
            className={`flex items-center bg-transparent border-none cursor-pointer p-0 ${
              collapsed ? "w-9" : "auto gap-[10px]"
            }`}
            aria-label={collapsed ? "Open sidebar" : "Close sidebar"}
            title={collapsed ? "Open sidebar" : "Close sidebar"}
          >
            <div className="w-9 h-9 min-w-[36px] bg-[var(--primary)] rounded-[10px] flex items-center justify-center shadow-[0_4px_14px_var(--primary-glow-strong)] shrink-0">
              <ChefHat size={18} color="#fff" />
            </div>
            {!collapsed && (
              <div className="overflow-hidden text-left">
                <div className="text-[13px] font-extrabold text-[var(--text)] leading-[1.2] whitespace-nowrap">
                  Cloud Kitchen
                </div>
                <div className="text-[10px] text-[var(--muted)] mt-0.5 whitespace-nowrap">
                  Kitchen Admin
                </div>
              </div>
            )}
          </button>
          {!collapsed && (
            <button
              onClick={() => setCollapsed(true)}
              className="w-[30px] h-[30px] rounded-lg border border-[var(--border)] bg-[var(--bg)] hidden md:flex items-center justify-center cursor-pointer ml-auto"
              aria-label="Close sidebar"
              title="Close sidebar"
            >
              <Menu size={16} className="text-[var(--muted)]" />
            </button>
          )}
          {/* Mobile Close Button */}
          <button
            onClick={() => setIsMobileOpen(false)}
            className="w-[30px] h-[30px] rounded-lg border border-[var(--border)] bg-[var(--bg)] flex md:hidden items-center justify-center cursor-pointer ml-auto"
          >
            <X size={16} className="text-[var(--muted)]" />
          </button>
        </div>

        {/* Nav links */}
        <nav className="flex-1 p-[10px_8px] overflow-y-auto">
          {!collapsed && filteredItems.length > 0 && (
            <div className="text-[10px] font-bold text-[var(--muted)] uppercase tracking-wider px-3 pb-[10px] pt-1">
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
                onClick={() => setIsMobileOpen(false)}
                className="no-underline block mb-[2px]"
              >
                <div
                  className={`flex items-center gap-3 p-[10px_12px] rounded-[10px] text-[13px] border-l-2 transition-all duration-150 cursor-pointer ${
                    isActive
                      ? "bg-[var(--primary-glow)] text-[var(--primary)] font-bold border-[var(--primary)]"
                      : "bg-transparent text-[var(--muted)] font-medium border-transparent hover:bg-[var(--surface-hover)] hover:text-[var(--text)]"
                  }`}
                >
                  <span className="min-w-[18px] flex">{item.icon}</span>
                  {!collapsed && (
                    <>
                      <span className="whitespace-nowrap flex-1">
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

        {/* Logout at bottom */}
        {/* <div className="p-4 border-t border-[var(--border)]">
            <button
              onClick={() => {
                setIsMobileOpen(false);
                onLogout();
              }}
              className={`w-full flex items-center gap-3 p-[10px_12px] rounded-[10px] text-[13px] text-red-500 font-bold hover:bg-red-500/10 transition-all ${
                collapsed ? "justify-center" : ""
              }`}
            >
              <LogOut size={18} />
              {!collapsed && <span>Logout</span>}
            </button>
          </div> */}
      </aside>
    </>
  );
}
