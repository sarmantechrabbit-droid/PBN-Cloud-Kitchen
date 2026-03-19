import React, { useState, useMemo } from "react";
import {
  Users,
  UserPlus,
  Edit3,
  Trash2,
  X,
  Eye,
  EyeOff,
  ChefHat,
  ShieldCheck,
  ClipboardCheck,
  Crown,
  Search,
  Mail,
  Lock,
  User,
  BadgeCheck,
  Sparkles,
} from "lucide-react";

const STORAGE_KEY = "ck_staff_list";

const defaultStaff = [
  {
    id: 1,
    name: "Ravi Kumar",
    email: "ravi@kitchen.com",
    role: "Chef",
    status: "Active",
    password: "pass123",
  },
  {
    id: 2,
    name: "Priya Shah",
    email: "priya@kitchen.com",
    role: "Chef",
    status: "Active",
    password: "pass123",
  },
  {
    id: 3,
    name: "Meena Joshi",
    email: "meena@kitchen.com",
    role: "Reviewer",
    status: "Active",
    password: "pass123",
  },
  {
    id: 4,
    name: "Vikram Nair",
    email: "vikram@kitchen.com",
    role: "CRA",
    status: "Active",
    password: "pass123",
  },
  {
    id: 5,
    name: "Sunita Rao",
    email: "sunita@kitchen.com",
    role: "Chef",
    status: "Inactive",
    password: "pass123",
  },
  {
    id: 6,
    name: "Amit Patel",
    email: "amit@kitchen.com",
    role: "Reviewer",
    status: "Active",
    password: "pass123",
  },
];

function getStaff() {
  const raw = localStorage.getItem(STORAGE_KEY);
  return raw ? JSON.parse(raw) : defaultStaff;
}

function saveStaff(list) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(list));
}

const roleConfig = {
  Chef: {
    icon: ChefHat,
    color: "text-orange-500",
    bg: "bg-orange-50 dark:bg-orange-900/20",
    border: "border-orange-200 dark:border-orange-800",
    badge:
      "bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-300",
  },
  Reviewer: {
    icon: ShieldCheck,
    color: "text-indigo-500",
    bg: "bg-indigo-50 dark:bg-indigo-900/20",
    border: "border-indigo-200 dark:border-indigo-800",
    badge:
      "bg-indigo-100 text-indigo-700 dark:bg-indigo-900/30 dark:text-indigo-300",
  },
  CRA: {
    icon: ClipboardCheck,
    color: "text-teal-500",
    bg: "bg-teal-50 dark:bg-teal-900/20",
    border: "border-teal-200 dark:border-teal-800",
    badge: "bg-teal-100 text-teal-700 dark:bg-teal-900/30 dark:text-teal-300",
  },
  Manager: {
    icon: Crown,
    color: "text-amber-500",
    bg: "bg-amber-50 dark:bg-amber-900/20",
    border: "border-amber-200 dark:border-amber-800",
    badge:
      "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-300",
  },
};

const avatarColors = [
  "from-orange-400 to-rose-500",
  "from-blue-400 to-indigo-500",
  "from-emerald-400 to-teal-500",
  "from-violet-400 to-purple-500",
  "from-pink-400 to-rose-500",
  "from-cyan-400 to-blue-500",
];

function getAvatarColor(id) {
  return avatarColors[id % avatarColors.length];
}

export default function RoleManagementPage() {
  const [staff, setStaff] = useState(getStaff);
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    role: "Chef",
  });
  const [showPass, setShowPass] = useState(false);
  const [editModal, setEditModal] = useState(null);
  const [deleteModal, setDeleteModal] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [showCreateForm, setShowCreateForm] = useState(false);

  const filtered = useMemo(() => {
    if (!searchQuery) return staff;
    const q = searchQuery.toLowerCase();
    return staff.filter(
      (s) =>
        s.name.toLowerCase().includes(q) ||
        s.email.toLowerCase().includes(q) ||
        s.role.toLowerCase().includes(q),
    );
  }, [staff, searchQuery]);

  // Role stats
  const roleCounts = useMemo(() => {
    return {
      Chef: staff.filter((s) => s.role === "Chef").length,
      Reviewer: staff.filter((s) => s.role === "Reviewer").length,
      CRA: staff.filter((s) => s.role === "CRA").length,
      Manager: staff.filter((s) => s.role === "Manager").length,
    };
  }, [staff]);

  const activeCount = staff.filter((s) => s.status === "Active").length;

  const handleCreate = (e) => {
    e.preventDefault();
    if (!form.name || !form.email || !form.password) return;
    const newStaff = { id: Date.now(), ...form, status: "Active" };
    const updated = [newStaff, ...staff];
    setStaff(updated);
    saveStaff(updated);
    setForm({ name: "", email: "", password: "", role: "Chef" });
    setShowCreateForm(false);
    addAuditLog(
      "Manager",
      "Create",
      `Created staff account "${form.name}" with role ${form.role}`,
    );
  };

  const handleDelete = (id) => {
    const target = staff.find((s) => s.id === id);
    const updated = staff.filter((s) => s.id !== id);
    setStaff(updated);
    saveStaff(updated);
    setDeleteModal(null);
    if (target)
      addAuditLog(
        "Manager",
        "Delete",
        `Deleted staff account "${target.name}"`,
      );
  };

  const handleEdit = (editedStaff) => {
    const updated = staff.map((s) =>
      s.id === editedStaff.id ? editedStaff : s,
    );
    setStaff(updated);
    saveStaff(updated);
    setEditModal(null);
    addAuditLog(
      "Manager",
      "Update",
      `Updated staff "${editedStaff.name}" role to ${editedStaff.role}`,
    );
  };

  function addAuditLog(role, action, description) {
    const logs = JSON.parse(localStorage.getItem("ck_audit_logs") || "[]");
    const userEmail = localStorage.getItem("ck_auth_email") || "admin";
    logs.unshift({
      id: `LOG-${Date.now()}`,
      user: userEmail.split("@")[0],
      role,
      action,
      description,
      timestamp: new Date().toLocaleString(),
    });
    localStorage.setItem("ck_audit_logs", JSON.stringify(logs));
  }

  return (
    <div className="max-w-7xl mx-auto animate-fade-in">
      {/* Header Section */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-3 mb-1">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-orange-400 to-rose-500 flex items-center justify-center shadow-lg shadow-orange-500/20">
              <Users size={20} className="text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
                Role Management
              </h1>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                Manage your team members and their permissions
              </p>
            </div>
          </div>
        </div>
        <button
          onClick={() => setShowCreateForm(!showCreateForm)}
          className="inline-flex items-center mb-5 gap-2 px-5 py-2.5 bg-gradient-to-r from-orange-500 to-rose-500 hover:from-orange-600 hover:to-rose-600 text-white rounded-xl font-semibold text-sm shadow-lg shadow-orange-500/25 transition-all hover:-translate-y-0.5 hover:shadow-xl hover:shadow-orange-500/30"
        >
          <UserPlus size={18} />
          {showCreateForm ? "Close Form" : "Add New Staff"}
        </button>
      </div>

      {/* Overview Stats Row */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-5">
        <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-100 dark:border-gray-700 p-4 flex items-center gap-3 shadow-sm hover:shadow-md transition-shadow">
          <div className="w-10 h-10 rounded-lg bg-gray-100 dark:bg-gray-700 flex items-center justify-center">
            <Users size={18} className="text-gray-600 dark:text-gray-300" />
          </div>
          <div>
            <div className="text-xl font-bold text-gray-900 dark:text-white">
              {staff.length}
            </div>
            <div className="text-[11px] font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wide">
              Total
            </div>
          </div>
        </div>
        {Object.entries(roleConfig)
          .filter(([roleName]) => roleName !== "Manager")
          .map(([roleName, cfg]) => {
            const Icon = cfg.icon;
            return (
              <div
                key={roleName}
                className={`bg-white dark:bg-gray-800 rounded-xl border border-gray-100 dark:border-gray-700 p-4 flex items-center gap-3 shadow-sm hover:shadow-md transition-shadow`}
              >
                <div
                  className={`w-10 h-10 rounded-lg ${cfg.bg} flex items-center justify-center`}
                >
                  <Icon size={18} className={cfg.color} />
                </div>
                <div>
                  <div className="text-xl font-bold text-gray-900 dark:text-white">
                    {roleCounts[roleName]}
                  </div>
                  <div className="text-[11px] font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wide">
                    {roleName}s
                  </div>
                </div>
              </div>
            );
          })}
      </div>

      {/* Staff Table Card */}
      <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700 shadow-sm overflow-hidden">
        {/* Table Header */}
        <div className="px-6 py-4 border-b border-gray-100 dark:border-gray-700 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <h2 className="text-base font-bold text-gray-900 dark:text-white">
              Team Members
            </h2>
            <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300">
              {staff.length}
            </span>
            <span className="hidden sm:inline-flex px-2.5 py-0.5 rounded-full text-xs font-bold bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400">
              {activeCount} active
            </span>
          </div>
          <div className="relative">
            <Search
              size={14}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
            />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search team..."
              className="pl-9 pr-4 py-2 rounded-xl border border-gray-200 dark:border-gray-600 bg-gray-50 dark:bg-gray-900 text-sm text-gray-900 dark:text-white focus:ring-2 focus:ring-orange-500/20 focus:border-orange-400 outline-none transition-all w-56"
            />
          </div>
        </div>

        {/* Staff Table */}
        <div className="hidden md:block overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-gray-50/80 dark:bg-gray-900/30 text-gray-500 dark:text-gray-400 text-xs uppercase tracking-wider">
              <tr>
                <th className="px-6 py-3.5 font-semibold">Member</th>
                <th className="px-6 py-3.5 font-semibold">Email</th>
                <th className="px-6 py-3.5 font-semibold">Role</th>
                <th className="px-6 py-3.5 font-semibold text-center">
                  Status
                </th>
                <th className="px-6 py-3.5 font-semibold text-right">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50 dark:divide-gray-700/50">
              {filtered.map((s) => {
                const cfg = roleConfig[s.role] || roleConfig.Chef;
                const Icon = cfg.icon;
                return (
                  <tr
                    key={s.id}
                    className="hover:bg-gray-50/60 dark:hover:bg-gray-700/20 transition-colors group"
                  >
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div
                          className={`w-9 h-9 rounded-full bg-gradient-to-br ${getAvatarColor(s.id)} flex items-center justify-center text-xs font-bold text-white shadow-sm`}
                        >
                          {s.name
                            .split(" ")
                            .map((n) => n[0])
                            .join("")}
                        </div>
                        <span className="font-semibold text-sm text-gray-900 dark:text-white">
                          {s.name}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-500 dark:text-gray-400">
                      {s.email}
                    </td>
                    <td className="px-6 py-4">
                      <span
                        className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-bold ${cfg.badge}`}
                      >
                        <Icon size={12} /> {s.role}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-center">
                      <span
                        className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-bold ${
                          s.status === "Active"
                            ? "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400"
                            : "bg-gray-100 text-gray-500 dark:bg-gray-700 dark:text-gray-400"
                        }`}
                      >
                        <span
                          className={`w-1.5 h-1.5 rounded-full ${s.status === "Active" ? "bg-green-500" : "bg-gray-400"}`}
                        />
                        {s.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button
                          onClick={() => setEditModal({ ...s })}
                          className="p-2 rounded-lg text-gray-400 hover:text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/20 transition-all"
                          title="Edit"
                        >
                          <Edit3 size={15} />
                        </button>
                        <button
                          onClick={() => setDeleteModal(s)}
                          className="p-2 rounded-lg text-gray-400 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 transition-all"
                          title="Delete"
                        >
                          <Trash2 size={15} />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
              {filtered.length === 0 && (
                <tr>
                  <td colSpan={5} className="px-6 py-16 text-center">
                    <div className="text-gray-400">
                      <Search size={32} className="mx-auto mb-3 opacity-40" />
                      <p className="text-sm font-medium">No members found</p>
                      <p className="text-xs mt-1">
                        Try a different search term
                      </p>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Mobile Cards */}
        <div className="md:hidden divide-y divide-gray-100 dark:divide-gray-700">
          {filtered.map((s) => {
            const cfg = roleConfig[s.role] || roleConfig.Chef;
            const Icon = cfg.icon;
            return (
              <div key={s.id} className="p-4 flex items-center gap-3">
                <div
                  className={`w-10 h-10 rounded-full bg-gradient-to-br ${getAvatarColor(s.id)} flex items-center justify-center text-xs font-bold text-white shadow-sm shrink-0`}
                >
                  {s.name
                    .split(" ")
                    .map((n) => n[0])
                    .join("")}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="font-semibold text-sm text-gray-900 dark:text-white truncate">
                    {s.name}
                  </div>
                  <div className="text-xs text-gray-500 dark:text-gray-400 truncate">
                    {s.email}
                  </div>
                  <div className="flex items-center gap-2 mt-1.5">
                    <span
                      className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[10px] font-bold ${cfg.badge}`}
                    >
                      <Icon size={10} /> {s.role}
                    </span>
                    <span
                      className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[10px] font-bold ${
                        s.status === "Active"
                          ? "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400"
                          : "bg-gray-100 text-gray-500 dark:bg-gray-700 dark:text-gray-400"
                      }`}
                    >
                      {s.status}
                    </span>
                  </div>
                </div>
                <div className="flex items-center gap-1 shrink-0">
                  <button
                    onClick={() => setEditModal({ ...s })}
                    className="p-2 rounded-lg text-gray-400 hover:text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/20 transition-all"
                  >
                    <Edit3 size={15} />
                  </button>
                  <button
                    onClick={() => setDeleteModal(s)}
                    className="p-2 rounded-lg text-gray-400 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 transition-all"
                  >
                    <Trash2 size={15} />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Create Modal */}
      {showCreateForm && (
        <CreateModal
          onSave={handleCreate}
          onClose={() => setShowCreateForm(false)}
        />
      )}

      {/* Edit Modal */}
      {editModal && (
        <EditModal
          staff={editModal}
          onSave={handleEdit}
          onClose={() => setEditModal(null)}
        />
      )}

      {/* Delete Confirmation Modal */}
      {deleteModal && (
        <div
          className="fixed inset-0 z-[999] flex items-center justify-center bg-black/50 backdrop-blur-sm"
          onClick={() => setDeleteModal(null)}
        >
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl border border-gray-100 dark:border-gray-700 w-full max-w-sm mx-4 overflow-hidden animate-fade-in">
            <div className="bg-red-50 dark:bg-red-900/10 px-6 py-6 text-center">
              <div className="w-16 h-16 rounded-full bg-red-100 dark:bg-red-900/30 flex items-center justify-center mx-auto mb-3">
                <Trash2 size={28} className="text-red-500" />
              </div>
              <h3 className="text-lg font-bold text-gray-900 dark:text-white">
                Delete Staff Member
              </h3>
            </div>
            <div className="px-6 py-5 text-center">
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Are you sure you want to delete{" "}
                <span className="font-bold text-gray-900 dark:text-white">
                  {deleteModal.name}
                </span>
                ? This action cannot be undone.
              </p>
              <div className="flex gap-3 mt-6">
                <button
                  onClick={() => setDeleteModal(null)}
                  className="flex-1 px-4 py-2.5 rounded-xl border border-gray-200 dark:border-gray-600 text-sm font-semibold text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 transition-all"
                >
                  Cancel
                </button>
                <button
                  onClick={() => handleDelete(deleteModal.id)}
                  className="flex-1 px-4 py-2.5 rounded-xl bg-red-500 hover:bg-red-600 text-white text-sm font-semibold shadow-lg shadow-red-500/20 transition-all"
                >
                  Delete
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function CreateModal({ onSave, onClose }) {
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    role: "Chef",
  });
  const [showPass, setShowPass] = useState(false);
  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});

  const validateName = (name) => {
    if (!name.trim()) return "Name is required";
    if (name.trim().length < 3) return "Name must be at least 3 characters";
    if (!/^[a-zA-Z\s]+$/.test(name.trim()))
      return "Name can only contain letters and spaces";
    return "";
  };

  const validateEmail = (email) => {
    if (!email.trim()) return "Email is required";
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email.trim()))
      return "Please enter a valid email address";
    return "";
  };

  const validatePassword = (password) => {
    if (!password) return "Password is required";
    if (password.length < 6) return "Password must be at least 6 characters";
    return "";
  };

  const validateField = (field, value) => {
    switch (field) {
      case "name":
        return validateName(value);
      case "email":
        return validateEmail(value);
      case "password":
        return validatePassword(value);
      default:
        return "";
    }
  };

  const handleChange = (field, value) => {
    setForm({ ...form, [field]: value });
    if (touched[field]) {
      setErrors({ ...errors, [field]: validateField(field, value) });
    }
  };

  const handleBlur = (field) => {
    setTouched({ ...touched, [field]: true });
    setErrors({ ...errors, [field]: validateField(field, form[field]) });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const newErrors = {
      name: validateName(form.name),
      email: validateEmail(form.email),
      password: validatePassword(form.password),
    };
    setTouched({ name: true, email: true, password: true });
    setErrors(newErrors);
    if (!newErrors.name && !newErrors.email && !newErrors.password) {
      onSave(form);
    }
  };

  const getInputClass = (field) => {
    const baseClass =
      "w-full px-4 py-2.5 rounded-xl border bg-gray-50/50 dark:bg-gray-900/50 text-sm text-gray-900 dark:text-white focus:ring-2 focus:ring-orange-500/20 focus:border-orange-400 outline-none transition-all";
    if (touched[field] && errors[field]) {
      return `${baseClass} border-red-400 dark:border-red-500`;
    }
    return `${baseClass} border-gray-200 dark:border-gray-600`;
  };

  return (
    <div
      className="fixed inset-0 z-[999] flex items-center justify-center bg-black/50 backdrop-blur-sm"
      onClick={onClose}
    >
      <div
        className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl border border-gray-100 dark:border-gray-700 w-full max-w-md mx-4 overflow-hidden animate-fade-in"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="bg-gradient-to-r from-orange-500/5 to-rose-500/5 dark:from-orange-500/10 dark:to-rose-500/10 px-6 py-4 border-b border-gray-100 dark:border-gray-700 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-orange-400 to-rose-500 flex items-center justify-center">
              <UserPlus size={16} className="text-white" />
            </div>
            <div>
              <h3 className="text-base font-bold text-gray-900 dark:text-white">
                Create New Staff
              </h3>
              <p className="text-[10px] text-gray-500 dark:text-gray-400">
                Fill in the details to add a member
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-gray-400 hover:text-gray-600 hover:bg-gray-100 dark:hover:bg-gray-700 transition-all"
          >
            <X size={18} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div>
            <label className="flex items-center gap-1.5 text-xs font-semibold text-gray-600 dark:text-gray-400 mb-1.5">
              <User size={12} /> Full Name
            </label>
            <input
              type="text"
              value={form.name}
              onChange={(e) => handleChange("name", e.target.value)}
              onBlur={() => handleBlur("name")}
              placeholder="e.g. Ravi Kumar"
              className={getInputClass("name")}
            />
            {touched.name && errors.name && (
              <p className="mt-1.5 text-xs text-red-500 dark:text-red-400">
                {errors.name}
              </p>
            )}
          </div>
          <div>
            <label className="flex items-center gap-1.5 text-xs font-semibold text-gray-600 dark:text-gray-400 mb-1.5">
              <Mail size={12} /> Email Address
            </label>
            <input
              type="email"
              value={form.email}
              onChange={(e) => handleChange("email", e.target.value)}
              onBlur={() => handleBlur("email")}
              placeholder="e.g. ravi@kitchen.com"
              className={getInputClass("email")}
            />
            {touched.email && errors.email && (
              <p className="mt-1.5 text-xs text-red-500 dark:text-red-400">
                {errors.email}
              </p>
            )}
          </div>
          <div>
            <label className="flex items-center gap-1.5 text-xs font-semibold text-gray-600 dark:text-gray-400 mb-1.5">
              <Lock size={12} /> Password
            </label>
            <div className="relative">
              <input
                type={showPass ? "text" : "password"}
                value={form.password}
                onChange={(e) => handleChange("password", e.target.value)}
                onBlur={() => handleBlur("password")}
                placeholder="Minimum 6 characters"
                className={getInputClass("password")}
              />
              <button
                type="button"
                onClick={() => setShowPass(!showPass)}
                className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
              >
                {showPass ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
            {touched.password && errors.password && (
              <p className="mt-1.5 text-xs text-red-500 dark:text-red-400">
                {errors.password}
              </p>
            )}
          </div>
          <div>
            <label className="flex items-center gap-1.5 text-xs font-semibold text-gray-600 dark:text-gray-400 mb-1.5">
              <BadgeCheck size={12} /> Assign Role
            </label>
            <select
              value={form.role}
              onChange={(e) => setForm({ ...form, role: e.target.value })}
              className="w-full px-4 py-2.5 rounded-xl border border-gray-200 dark:border-gray-600 bg-gray-50/50 dark:bg-gray-900/50 text-sm text-gray-900 dark:text-white focus:ring-2 focus:ring-orange-500/20 focus:border-orange-400 outline-none transition-all"
            >
              <option value="Chef">🧑‍🍳 Chef</option>
              <option value="Reviewer">🔍 Reviewer</option>
              <option value="CRA">📋 CRA</option>
              <option value="Manager">👑 Manager</option>
            </select>
          </div>
          <div className="flex gap-3 pt-4 border-t border-gray-100 dark:border-gray-700">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-2.5 rounded-xl border border-gray-200 dark:border-gray-600 text-sm font-semibold text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 transition-all"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex-1 px-4 py-2.5 rounded-xl bg-gradient-to-r from-orange-500 to-rose-500 hover:from-orange-600 hover:to-rose-600 text-white text-sm font-semibold shadow-lg shadow-orange-500/20 transition-all hover:-translate-y-0.5"
            >
              Create Staff
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

function EditModal({ staff, onSave, onClose }) {
  const [form, setForm] = useState({ ...staff });
  const [showPass, setShowPass] = useState(false);
  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});

  const validateName = (name) => {
    if (!name.trim()) return "Name is required";
    if (name.trim().length < 2) return "Name must be at least 2 characters";
    if (!/^[a-zA-Z\s]+$/.test(name.trim()))
      return "Name can only contain letters and spaces";
    return "";
  };

  const validateEmail = (email) => {
    if (!email.trim()) return "Email is required";
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email.trim()))
      return "Please enter a valid email address";
    return "";
  };

  const validatePassword = (password) => {
    if (!password) return "Password is required";
    if (password.length < 6) return "Password must be at least 6 characters";
    return "";
  };

  const validateField = (field, value) => {
    switch (field) {
      case "name":
        return validateName(value);
      case "email":
        return validateEmail(value);
      case "password":
        return validatePassword(value);
      default:
        return "";
    }
  };

  const handleChange = (field, value) => {
    setForm({ ...form, [field]: value });
    if (touched[field]) {
      setErrors({ ...errors, [field]: validateField(field, value) });
    }
  };

  const handleBlur = (field) => {
    setTouched({ ...touched, [field]: true });
    setErrors({ ...errors, [field]: validateField(field, form[field]) });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const newErrors = {
      name: validateName(form.name),
      email: validateEmail(form.email),
      password: validatePassword(form.password),
    };
    setTouched({ name: true, email: true, password: true });
    setErrors(newErrors);
    if (!newErrors.name && !newErrors.email && !newErrors.password) {
      onSave(form);
    }
  };

  const getInputClass = (field) => {
    const baseClass =
      "w-full px-4 py-2.5 rounded-xl border bg-gray-50/50 dark:bg-gray-900/50 text-sm text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500/20 focus:border-blue-400 outline-none transition-all";
    if (touched[field] && errors[field]) {
      return `${baseClass} border-red-400 dark:border-red-500`;
    }
    return `${baseClass} border-gray-200 dark:border-gray-600`;
  };

  return (
    <div
      className="fixed inset-0 z-[999] flex items-center justify-center bg-black/50 backdrop-blur-sm"
      onClick={onClose}
    >
      <div
        className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl border border-gray-100 dark:border-gray-700 w-full max-w-md mx-4 overflow-hidden animate-fade-in"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Header */}
        <div className="bg-gradient-to-r from-blue-500/5 to-indigo-500/5 dark:from-blue-500/10 dark:to-indigo-500/10 px-6 py-4 border-b border-gray-100 dark:border-gray-700 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-[#f97316] flex items-center justify-center">
              <Edit3 size={14} className="text-white" />
            </div>
            <h3 className="text-base font-bold text-gray-900 dark:text-white">
              Edit Staff Member
            </h3>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-gray-400 hover:text-gray-600 hover:bg-gray-100 dark:hover:bg-gray-700 transition-all"
          >
            <X size={18} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div>
            <label className="flex items-center gap-1.5 text-xs font-semibold text-gray-600 dark:text-gray-400 mb-1.5">
              <User size={12} /> Name
            </label>
            <input
              type="text"
              value={form.name}
              onChange={(e) => handleChange("name", e.target.value)}
              onBlur={() => handleBlur("name")}
              className={getInputClass("name")}
            />
            {touched.name && errors.name && (
              <p className="mt-1.5 text-xs text-red-500 dark:text-red-400">
                {errors.name}
              </p>
            )}
          </div>
          <div>
            <label className="flex items-center gap-1.5 text-xs font-semibold text-gray-600 dark:text-gray-400 mb-1.5">
              <Mail size={12} /> Email
            </label>
            <input
              type="email"
              value={form.email}
              onChange={(e) => handleChange("email", e.target.value)}
              onBlur={() => handleBlur("email")}
              className={getInputClass("email")}
            />
            {touched.email && errors.email && (
              <p className="mt-1.5 text-xs text-red-500 dark:text-red-400">
                {errors.email}
              </p>
            )}
          </div>
          <div>
            <label className="flex items-center gap-1.5 text-xs font-semibold text-gray-600 dark:text-gray-400 mb-1.5">
              <Lock size={12} /> Password
            </label>
            <div className="relative">
              <input
                type={showPass ? "text" : "password"}
                value={form.password}
                onChange={(e) => handleChange("password", e.target.value)}
                onBlur={() => handleBlur("password")}
                className={getInputClass("password")}
              />
              <button
                type="button"
                onClick={() => setShowPass(!showPass)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
              >
                {showPass ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
            {touched.password && errors.password && (
              <p className="mt-1.5 text-xs text-red-500 dark:text-red-400">
                {errors.password}
              </p>
            )}
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="flex items-center gap-1.5 text-xs font-semibold text-gray-600 dark:text-gray-400 mb-1.5">
                <BadgeCheck size={12} /> Role
              </label>
              <select
                value={form.role}
                onChange={(e) => setForm({ ...form, role: e.target.value })}
                className="w-full px-4 py-2.5 rounded-xl border border-gray-200 dark:border-gray-600 bg-gray-50/50 dark:bg-gray-900/50 text-sm text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500/20 focus:border-blue-400 outline-none transition-all"
              >
                <option value="Chef">Chef</option>
                <option value="Reviewer">Reviewer</option>
                <option value="CRA">CRA</option>
                <option value="Manager">Manager</option>
              </select>
            </div>
            <div>
              <label className="flex items-center gap-1.5 text-xs font-semibold text-gray-600 dark:text-gray-400 mb-1.5">
                Status
              </label>
              <select
                value={form.status}
                onChange={(e) => setForm({ ...form, status: e.target.value })}
                className="w-full px-4 py-2.5 rounded-xl border border-gray-200 dark:border-gray-600 bg-gray-50/50 dark:bg-gray-900/50 text-sm text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500/20 focus:border-blue-400 outline-none transition-all"
              >
                <option value="Active">Active</option>
                <option value="Inactive">Inactive</option>
              </select>
            </div>
          </div>
          <div className="flex gap-3 pt-3 border-t border-gray-100 dark:border-gray-700">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-2.5 rounded-xl border border-gray-200 dark:border-gray-600 text-sm font-semibold text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 transition-all"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex-1 px-4 py-2.5 rounded-xl bg-[#f97316] hover:bg-[#f97316] text-white text-sm font-semibold shadow-lg shadow-blue-500/20 transition-all"
            >
              Save Changes
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
