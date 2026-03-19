import { useEffect, useState } from "react";
import {
  Thermometer,
  Timer,
  ChefHat,
  CheckCircle,
  Plus,
  Trash2,
} from "lucide-react";
import Card from "../../components/ui/Card";
import PageHeader from "../../components/ui/PageHeader";
import FormInput from "../../components/forms/FormInput";
import DatePicker from "../../components/forms/DatePicker";
import TimePicker from "../../components/forms/TimePicker";
import FileUploader from "../../components/forms/FileUploader";
import { experiments } from "../../data/dummy";

const steps = [
  { label: "Recipe Info", icon: "" },
  { label: "Cooking Parameters", icon: "" },
  { label: "Output Data", icon: "" },
  { label: "Upload & Submit", icon: "" },
];

const INGREDIENT_UNITS = ["g", "kg", "ml", "l", "tsp", "tbsp", "pcs"];
const OUTPUT_UNITS = ["g", "kg", "ml", "l", "pcs"];
const RECIPE_INGREDIENTS = {
  "butter paneer": [
    "Paneer",
    "Butter",
    "Cream",
    "Tomato",
    "Ginger Garlic Paste",
    "Garam Masala",
    "Salt",
  ],
  "paneer tikka": ["Paneer", "Yogurt", "Capsicum", "Onion", "Tikka Masala"],
  "butter chicken": [
    "Chicken",
    "Butter",
    "Cream",
    "Tomato",
    "Ginger Garlic Paste",
    "Garam Masala",
    "Salt",
  ],
  "dal makhani": ["Black Lentil", "Kidney Beans", "Butter", "Cream", "Tomato"],
};

function StepIndicator({ current }) {
  return (
    <div className="bg-[var(--surface)] border border-[var(--border)] rounded-[24px] p-4 sm:p-6 mb-8 shadow-xl shadow-black/5 dark:shadow-none">
      <div className="relative">
        <div className="absolute top-[17px] left-8 right-8 h-0.5 bg-[var(--border)] rounded-full" />
        <div className="flex justify-between items-start relative z-10">
          {steps.map((s, i) => {
            const done = current > i + 1;
            const active = current === i + 1;
            return (
              <div key={s.label} className="flex flex-col items-center flex-1">
                <div
                  className={`w-9 h-9 rounded-full flex items-center justify-center font-black border-2 transition-all duration-300 ${
                    active || done
                      ? "border-[var(--primary)] shadow-lg shadow-orange-500/20"
                      : "border-[var(--border)]"
                  } ${
                    active
                      ? "bg-[var(--primary)] text-white scale-110"
                      : done
                        ? "bg-[var(--primary-glow)] text-[var(--primary)]"
                        : "bg-[var(--bg)] text-[var(--muted)]"
                  }`}
                >
                  {done ? <CheckCircle size={18} strokeWidth={3} /> : i + 1}
                </div>
                <div className="mt-3 hidden sm:block">
                  <div className="text-[10px] text-[var(--muted)] tracking-[0.2em] uppercase font-black text-center">
                    Step {i + 1}
                  </div>
                  <div
                    className={`text-xs mt-0.5 text-center whitespace-nowrap ${
                      active
                        ? "font-black text-[var(--text)]"
                        : "font-bold text-[var(--muted)]"
                    }`}
                  >
                    {s.label}
                  </div>
                </div>
                {/* Mobile label - only for active step */}
                {active && (
                  <div className="sm:hidden absolute -bottom-8 left-1/2 -translate-x-1/2 w-full text-center">
                    <span className="text-[10px] font-black uppercase tracking-wider text-[var(--primary)] bg-[var(--primary-glow)] px-3 py-1 rounded-full border border-[var(--primary)]/20">
                      Step {i + 1}: {s.label}
                    </span>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
      {/* Spacer for mobile label */}
      <div className="h-4 sm:hidden" />
    </div>
  );
}

export default function RecipePage() {
  const [step, setStep] = useState(1);
  const [form, setForm] = useState({
    recipeName: "",
    version: "v1.0",
    expDate: "",
    expTime: "",
    temp: "",
    timing: "",
    expTexture: "",
    expOutputValue: "",
    expOutputUnit: "g",
    actTexture: "",
    actOutputValue: "",
    actOutputUnit: "g",
    remarks: "",
  });
  const [recipeMode, setRecipeMode] = useState("create");
  const [ingredients, setIngredients] = useState([
    { name: "", quantity: "", unit: "g" },
  ]);
  const [customRecipes, setCustomRecipes] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [versionManual, setVersionManual] = useState(false);
  const [versionBumped, setVersionBumped] = useState(false);
  const [submitMessage, setSubmitMessage] = useState(null);
  const [ingredientSuggest, setIngredientSuggest] = useState({
    row: null,
    index: -1,
    open: false,
  });
  const [customIngredients, setCustomIngredients] = useState([]);
  const [customIngredientsLoaded, setCustomIngredientsLoaded] = useState(false);
  const [savedIngredients, setSavedIngredients] = useState([]);
  const [savedIngredientsLoaded, setSavedIngredientsLoaded] = useState(false);
  const [storedExperiments, setStoredExperiments] = useState(() => {
    try {
      const raw = localStorage.getItem("ck_experiments");
      const parsed = raw ? JSON.parse(raw) : [];
      return Array.isArray(parsed) ? parsed : [];
    } catch {
      return [];
    }
  });
  const set = (k) => (e) => setForm((f) => ({ ...f, [k]: e.target.value }));

  useEffect(() => {
    try {
      const raw = localStorage.getItem("ck_custom_ingredients");
      const parsed = raw ? JSON.parse(raw) : [];
      if (Array.isArray(parsed)) setCustomIngredients(parsed);
    } catch {
      // ignore invalid storage
    } finally {
      setCustomIngredientsLoaded(true);
    }
  }, []);

  useEffect(() => {
    if (!customIngredientsLoaded) return;
    localStorage.setItem(
      "ck_custom_ingredients",
      JSON.stringify(customIngredients),
    );
  }, [customIngredients, customIngredientsLoaded]);

  useEffect(() => {
    try {
      const raw = localStorage.getItem("savedIngredients");
      const parsed = raw ? JSON.parse(raw) : [];
      if (Array.isArray(parsed)) {
        const cleaned = parsed
          .filter((item) => item && item.name && item.unit)
          .map((item) => ({
            name: String(item.name).trim(),
            unit: String(item.unit).trim(),
          }))
          .filter((item) => item.name && item.unit);
        setSavedIngredients(cleaned);
      }
    } catch {
      // ignore invalid storage
    } finally {
      setSavedIngredientsLoaded(true);
    }
  }, []);

  useEffect(() => {
    if (!savedIngredientsLoaded) return;
    localStorage.setItem("savedIngredients", JSON.stringify(savedIngredients));
  }, [savedIngredients, savedIngredientsLoaded]);

  const normalizeRecipeName = (name) =>
    (name || "")
      .replace(/\sv\d+\.\d+$/i, "")
      .trim()
      .toLowerCase();

  const parseVersion = (version) => {
    const match = /^v(\d+)\.(\d+)$/i.exec(String(version || "").trim());
    if (!match) return { major: 1, minor: 0 };
    return { major: parseInt(match[1], 10), minor: parseInt(match[2], 10) };
  };

  const formatVersion = (major, minor) => `v${major}.${minor}`;

  const getNextVersion = (name) => {
    const base = normalizeRecipeName(name);
    if (!base) return "v1.0";
    const versions = [...experiments, ...storedExperiments]
      .filter((e) => normalizeRecipeName(e.recipe) === base)
      .map((e) => String(e.version || ""))
      .filter((v) => /^v\d+\.\d+$/i.test(v))
      .map(parseVersion);
    if (versions.length === 0) return "v1.0";
    const maxMajor = Math.max(...versions.map((v) => v.major));
    const maxMinor = Math.max(
      ...versions.filter((v) => v.major === maxMajor).map((v) => v.minor),
    );
    return formatVersion(maxMajor, maxMinor + 1);
  };

  useEffect(() => {
    if (versionManual) return;
    const nextVersion =
      recipeMode === "create" ? "v1.0" : getNextVersion(form.recipeName);
    if (form.version !== nextVersion) {
      setForm((f) => ({ ...f, version: nextVersion }));
    }
  }, [recipeMode, form.recipeName, form.version, versionManual]);

  useEffect(() => {
    setVersionBumped(false);
  }, [recipeMode, form.recipeName]);

  useEffect(() => {
    setForm((f) => ({
      ...f,
      expOutputUnit: f.expOutputUnit || "g",
      actOutputUnit: f.expOutputUnit || "g",
    }));
  }, []);

  useEffect(() => {
    setForm((f) => ({ ...f, actOutputUnit: f.expOutputUnit || "g" }));
  }, [form.expOutputUnit]);

  const addIngredient = (name = "") => {
    const safeName = typeof name === "string" ? name : "";
    setIngredients((list) => [
      ...list,
      { name: safeName, quantity: "", unit: "g" },
    ]);
    setIngredientSuggest({ row: null, index: -1, open: false });
  };

  const updateIngredient = (index, patch) =>
    setIngredients((list) =>
      list.map((item, i) => (i === index ? { ...item, ...patch } : item)),
    );

  const removeIngredient = (index) =>
    setIngredients((list) =>
      list.length === 1 ? list : list.filter((_, i) => i !== index),
    );

  const normalizeIngredientName = (name) => String(name ?? "").trim();

  const findSavedIngredient = (name) => {
    const key = normalizeIngredientName(name).toLowerCase();
    if (!key) return null;
    return (
      savedIngredients.find(
        (item) =>
          String(item.name || "")
            .trim()
            .toLowerCase() === key,
      ) || null
    );
  };

  const saveIngredientUnit = (name, unit) => {
    const trimmedName = normalizeIngredientName(name);
    const trimmedUnit = String(unit ?? "").trim();
    if (!trimmedName || !trimmedUnit) return;
    setSavedIngredients((list) => {
      const exists = list.some(
        (item) =>
          String(item.name || "")
            .trim()
            .toLowerCase() === trimmedName.toLowerCase(),
      );
      if (exists) return list;
      return [...list, { name: trimmedName, unit: trimmedUnit }];
    });
  };

  const getIngredientSuggestions = (query) => {
    const recipeKey = normalizeRecipeName(form.recipeName);
    const recipeList = RECIPE_INGREDIENTS[recipeKey] || [];
    const savedList = savedIngredients.map((item) => item.name);
    const allList = Array.from(
      new Set(
        Object.values(RECIPE_INGREDIENTS)
          .flat()
          .concat(recipeList)
          .concat(customIngredients)
          .concat(savedList),
      ),
    );
    const q = String(query ?? "")
      .trim()
      .toLowerCase();
    const base = q
      ? allList.filter((ing) => ing.toLowerCase().includes(q))
      : recipeList;
    return base.slice(0, 5);
  };

  const handleIngredientSelect = (idx, name) => {
    const saved = findSavedIngredient(name);
    if (saved?.unit) {
      updateIngredient(idx, { name, unit: saved.unit });
    } else {
      updateIngredient(idx, { name });
    }
    setIngredientSuggest({ row: null, index: -1, open: false });
  };

  const handleIngredientCreate = (idx, name, options = {}) => {
    const trimmed = String(name ?? "").trim();
    if (!trimmed) return;
    if (options.saveUnit) {
      const currentUnit = ingredients[idx]?.unit;
      saveIngredientUnit(trimmed, currentUnit);
    }
    setCustomIngredients((list) =>
      list.some((i) => i.toLowerCase() === trimmed.toLowerCase())
        ? list
        : [...list, trimmed],
    );
    handleIngredientSelect(idx, trimmed);
  };

  const handleIngredientBlur = (idx, name) => {
    const trimmed = String(name ?? "").trim();
    if (!trimmed) return;
    const suggestions = getIngredientSuggestions(trimmed);
    const exists = suggestions.some(
      (s) => s.toLowerCase() === trimmed.toLowerCase(),
    );
    if (!exists) handleIngredientCreate(idx, trimmed, { saveUnit: false });
  };

  const existingRecipeNames = Array.from(
    new Set(
      [...experiments, ...storedExperiments]
        .map((e) => normalizeRecipeName(e.recipe))
        .filter(Boolean)
        .concat(
          customRecipes.map((r) => normalizeRecipeName(r)).filter(Boolean),
        ),
    ),
  ).map(
    (key) =>
      [...experiments, ...storedExperiments]
        .find((e) => normalizeRecipeName(e.recipe) === key)
        ?.recipe?.replace(/\sv\d+\.\d+$/i, "") ||
      customRecipes.find((r) => normalizeRecipeName(r) === key) ||
      key,
  );

  const suggestionQuery = form.recipeName.trim().toLowerCase();
  const suggestions = suggestionQuery
    ? existingRecipeNames.filter((name) =>
        name.toLowerCase().includes(suggestionQuery),
      )
    : [];

  const isExistingRecipeExact = existingRecipeNames.some(
    (name) =>
      normalizeRecipeName(name) === normalizeRecipeName(form.recipeName),
  );

  const handleSelectRecipe = (name) => {
    setForm((f) => ({ ...f, recipeName: name }));
    setRecipeMode("existing");
    setVersionManual(false);
    setShowSuggestions(false);
  };

  const handleCreateRecipe = () => {
    const trimmed = form.recipeName.trim();
    if (!trimmed) return;
    setCustomRecipes((list) =>
      list.some((r) => normalizeRecipeName(r) === normalizeRecipeName(trimmed))
        ? list
        : [...list, trimmed],
    );
    setRecipeMode("create");
    setVersionManual(false);
    setShowSuggestions(false);
  };

  const handleChangeVersionMajor = () => {
    const { major } = parseVersion(form.version);
    const next = formatVersion(major + 1, 0);
    setForm((f) => ({ ...f, version: next }));
    setVersionManual(true);
    setVersionBumped(true);
  };

  const handleSubmitExperiment = () => {
    const baseName = form.recipeName.trim();
    if (!baseName) return;
    const recipeName = baseName.replace(/\sv\d+\.\d+$/i, "").trim();
    const id = `EXP-${Date.now().toString().slice(-6)}`;
    const now = new Date();
    const date = form.expDate || now.toISOString().slice(0, 10);
    const chef = (
      localStorage.getItem("ck_auth_email") || "Unknown Chef"
    ).split("@")[0];
    const newExp = {
      id,
      recipe: `${recipeName} ${form.version}`,
      version: form.version,
      date,
      time:
        form.expTime ||
        new Date().toLocaleTimeString([], {
          hour: "2-digit",
          minute: "2-digit",
          hour12: false,
        }),
      chef,
      status: "Pending",
      aiScore: 0,
      batchNo: `BATCH-${Date.now().toString().slice(-6)}`,
      temp: form.temp,
      timing: form.timing,
      expTexture: form.expTexture,
      actTexture: form.actTexture,
      expOutputValue: form.expOutputValue,
      expOutputUnit: form.expOutputUnit,
      actOutputValue: form.actOutputValue,
      actOutputUnit: form.actOutputUnit,
      remarks: form.remarks,
      ingredients,
    };

    const nextList = [newExp, ...storedExperiments];
    setStoredExperiments(nextList);
    localStorage.setItem("ck_experiments", JSON.stringify(nextList));
    setSubmitMessage("Recipe added successfully.");
    setTimeout(() => setSubmitMessage(null), 3000);
  };

  return (
    <div className="animate-fade-in">
      <PageHeader
        title="Create Experiment"
        subtitle="Submit a new cooking experiment for quality review and AI analysis."
      />

      <div className="max-w-5xl mx-auto w-full px-4 sm:px-0">
        <StepIndicator current={step} />

        <Card className="rounded-[32px] shadow-2xl shadow-black/5 dark:shadow-none p-6 sm:p-10 border-[var(--border)]">
          <div className="space-y-6">
            {/* Step 1 */}
            {step === 1 && (
              <div className="space-y-8 animate-in fade-in slide-in-from-right-4 duration-500">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-2xl bg-orange-500/10 flex items-center justify-center text-orange-600 shrink-0 shadow-lg shadow-orange-500/10">
                    <ChefHat size={24} strokeWidth={2.5} />
                  </div>
                  <div>
                    <h2 className="text-xl font-black text-[var(--text)] tracking-tight text-glow-sm">
                      Recipe Information
                    </h2>
                    <p className="text-xs font-bold text-[var(--muted)] uppercase tracking-widest mt-0.5 opacity-70">
                      Define the core details of your experiment
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6">
                  {/* Recipe Name */}
                  <div className="relative group">
                    <label className="block text-[11px] font-black text-[var(--muted)] uppercase tracking-widest mb-2 px-1">
                      Recipe Name{" "}
                      <span className="text-[var(--danger)]">*</span>
                    </label>
                    <div className="relative">
                      <input
                        type="text"
                        value={form.recipeName}
                        onChange={(e) => {
                          set("recipeName")(e);
                          setShowSuggestions(true);
                          setRecipeMode("create");
                          setVersionManual(false);
                        }}
                        onFocus={() => setShowSuggestions(true)}
                        onBlur={() =>
                          setTimeout(() => setShowSuggestions(false), 150)
                        }
                        placeholder="e.g. Butter Paneer"
                        className="input-field w-full pl-4 pr-10 py-3.5 font-bold shadow-sm"
                      />
                      <div className="absolute right-4 top-1/2 -translate-y-1/2 text-[var(--primary)] pointer-events-none group-focus-within:scale-110 transition-transform">
                        <Plus size={18} strokeWidth={3} />
                      </div>
                    </div>
                    {showSuggestions &&
                      (suggestions.length > 0 ||
                        (!isExistingRecipeExact && form.recipeName.trim())) && (
                        <div className="absolute top-full left-0 right-0 mt-3 border border-[var(--border)] rounded-2xl bg-[var(--surface)] overflow-hidden shadow-2xl z-30 backdrop-blur-xl">
                          {suggestions.map((name) => (
                            <button
                              key={name}
                              type="button"
                              onMouseDown={(e) => {
                                e.preventDefault();
                                handleSelectRecipe(name);
                              }}
                              className="w-full text-left p-4 border-none bg-transparent cursor-pointer text-sm font-bold text-[var(--text)] hover:bg-[var(--primary-glow)] transition-colors border-b last:border-b-0 border-[var(--border)]/30"
                            >
                              {name}
                            </button>
                          ))}
                          {!isExistingRecipeExact && form.recipeName.trim() && (
                            <button
                              type="button"
                              onMouseDown={(e) => {
                                e.preventDefault();
                                handleCreateRecipe();
                              }}
                              className="w-full text-left p-4 border-none bg-emerald-500/10 cursor-pointer text-sm font-black text-emerald-600 dark:text-emerald-400"
                            >
                              Create "{form.recipeName.trim()}"
                            </button>
                          )}
                        </div>
                      )}
                  </div>

                  {/* Version Bump */}
                  <div className="space-y-2">
                    <label className="block text-[11px] font-black text-[var(--muted)] uppercase tracking-widest mb-2 px-1">
                      Version <span className="text-orange-500">*</span>
                    </label>
                    <div className="flex gap-3 border-[var(--border)]">
                      <input
                        type="text"
                        value={form.version}
                        className="input-field grow bg-[var(--bg)] font-black text-center tracking-wider text-orange-500 border-none shadow-inner"
                        readOnly
                      />
                      <button
                        type="button"
                        onClick={handleChangeVersionMajor}
                        disabled={versionBumped}
                        className={`px-5 py-3 rounded-xl border-2 font-black text-[10px] uppercase tracking-[0.2em] transition-all shrink-0 ${
                          versionBumped
                            ? "bg-[var(--border)] border-[var(--border)] text-[var(--muted)] cursor-not-allowed opacity-40"
                            : "bg-white dark:bg-zinc-900 border-[var(--border)] text-[var(--text)] hover:border-orange-500 hover:text-orange-600 hover:shadow-lg active:scale-95"
                        }`}
                      >
                        Bump V
                      </button>
                    </div>
                  </div>

                  <DatePicker
                    label="Experiment Date"
                    value={form.expDate}
                    onChange={set("expDate")}
                  />
                  <TimePicker
                    label="Experiment Time"
                    value={form.expTime}
                    onChange={set("expTime")}
                    required
                  />
                </div>

                <div className="mt-12 pt-10 border-t border-[var(--border)] relative">
                  <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-[var(--surface)] px-6 py-1.5 rounded-full border border-[var(--border)] text-[10px] font-black text-[var(--muted)] uppercase tracking-[0.3em]">
                    Ingredients Component
                  </div>

                  <div className="text-sm font-black text-[var(--text)] uppercase tracking-widest mb-6 flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-[var(--primary)] text-white flex items-center justify-center shadow-lg shadow-orange-500/20">
                      <Plus size={16} strokeWidth={3} />
                    </div>
                    Composition List
                  </div>

                  <div className="hidden sm:grid grid-cols-[2fr_1fr_1fr_56px] gap-6 text-[10px] text-[var(--muted)] font-black uppercase tracking-[0.2em] mb-4 px-2">
                    <div>Ingredient Target</div>
                    <div>Quantity</div>
                    <div>Unit</div>
                    <div />
                  </div>

                  <div className="space-y-4">
                    {ingredients.map((ing, idx) => (
                      <div
                        key={`ingredient-${idx}`}
                        className="flex flex-col sm:grid sm:grid-cols-[2fr_1fr_1fr_56px] gap-4 sm:gap-6 p-5 sm:p-0 bg-zinc-500/5 sm:bg-transparent rounded-2xl border border-[var(--border)] sm:border-none relative group transition-all"
                      >
                        <div className="sm:hidden text-[10px] font-black text-[var(--primary)] uppercase tracking-widest mb-1 pb-1 border-b border-orange-500/10">
                          Ingredient #{idx + 1}
                        </div>

                        <div className="relative">
                          <input
                            type="text"
                            value={ing.name}
                            onChange={(e) => {
                              updateIngredient(idx, { name: e.target.value });
                              setIngredientSuggest({
                                row: idx,
                                index: -1,
                                open: true,
                              });
                            }}
                            onFocus={() =>
                              setIngredientSuggest({
                                row: idx,
                                index: -1,
                                open: true,
                              })
                            }
                            onBlur={() =>
                              setTimeout(() => {
                                setIngredientSuggest({
                                  row: null,
                                  index: -1,
                                  open: false,
                                });
                                handleIngredientBlur(idx, ing.name);
                              }, 150)
                            }
                            onKeyDown={(e) => {
                              const suggestions = getIngredientSuggestions(
                                ing.name,
                              );
                              if (
                                !ingredientSuggest.open ||
                                ingredientSuggest.row !== idx
                              )
                                return;
                              if (e.key === "ArrowDown") {
                                e.preventDefault();
                                setIngredientSuggest((s) => ({
                                  ...s,
                                  index: Math.min(
                                    s.index + 1,
                                    suggestions.length - 1,
                                  ),
                                }));
                              }
                              if (e.key === "ArrowUp") {
                                e.preventDefault();
                                setIngredientSuggest((s) => ({
                                  ...s,
                                  index: Math.max(s.index - 1, 0),
                                }));
                              }
                              if (e.key === "Enter") {
                                e.preventDefault();
                                const pick =
                                  suggestions[ingredientSuggest.index];
                                if (pick) {
                                  handleIngredientSelect(idx, pick);
                                } else {
                                  handleIngredientCreate(idx, ing.name, {
                                    saveUnit: true,
                                  });
                                }
                              }
                              if (e.key === "Escape") {
                                setIngredientSuggest({
                                  row: null,
                                  index: -1,
                                  open: false,
                                });
                              }
                            }}
                            placeholder="Search or add ingredient"
                            className="input-field w-full px-4 py-3.5 font-bold"
                          />
                          {(() => {
                            const sList = getIngredientSuggestions(ing.name);
                            const typed = String(ing.name ?? "").trim();
                            const canCreate =
                              typed &&
                              !sList.some(
                                (name) =>
                                  name.toLowerCase() === typed.toLowerCase(),
                              );
                            if (
                              !ingredientSuggest.open ||
                              ingredientSuggest.row !== idx ||
                              (!sList.length && !canCreate)
                            ) {
                              return null;
                            }
                            return (
                              <div className="absolute top-full left-0 right-0 mt-2 border border-[var(--border)] rounded-2xl bg-[var(--surface)] overflow-hidden shadow-2xl z-30 max-h-56 overflow-y-auto backdrop-blur-xl">
                                {sList.map((name, i) => (
                                  <button
                                    key={`${name}-${i}`}
                                    type="button"
                                    onMouseDown={(e) => e.preventDefault()}
                                    onClick={() =>
                                      handleIngredientSelect(idx, name)
                                    }
                                    className={`w-full text-left p-4 border-none transition-colors cursor-pointer text-xs font-black text-[var(--text)] border-b last:border-b-0 border-[var(--border)]/30 ${
                                      i === ingredientSuggest.index
                                        ? "bg-orange-500/10 text-orange-600"
                                        : "bg-transparent opacity-80"
                                    } hover:bg-orange-500/5 hover:opacity-100`}
                                  >
                                    {name}
                                  </button>
                                ))}
                                {canCreate && (
                                  <button
                                    type="button"
                                    onMouseDown={(e) => e.preventDefault()}
                                    onClick={() =>
                                      handleIngredientCreate(idx, ing.name, {
                                        saveUnit: true,
                                      })
                                    }
                                    className="w-full text-left p-4 border-none bg-emerald-500/5 cursor-pointer text-xs font-black text-emerald-600"
                                  >
                                    + CREATE "{typed.toUpperCase()}"
                                  </button>
                                )}
                              </div>
                            );
                          })()}
                        </div>

                        <div className="grid grid-cols-2 gap-4 sm:contents">
                          <div className="relative">
                            <input
                              type="number"
                              min="0"
                              value={ing.quantity}
                              onChange={(e) =>
                                updateIngredient(idx, {
                                  quantity: e.target.value,
                                })
                              }
                              placeholder="0.00"
                              className="input-field w-full px-4 py-3.5 font-black text-center sm:text-left"
                            />
                          </div>
                          <div className="relative">
                            <select
                              value={ing.unit}
                              onChange={(e) =>
                                updateIngredient(idx, { unit: e.target.value })
                              }
                              className="input-field w-full px-4 py-3.5 font-black appearance-none cursor-pointer"
                            >
                              {INGREDIENT_UNITS.map((u) => (
                                <option key={u} value={u}>
                                  {u}
                                </option>
                              ))}
                            </select>
                          </div>
                        </div>

                        <button
                          type="button"
                          onClick={() => removeIngredient(idx)}
                          disabled={ingredients.length === 1}
                          className={`h-12 w-12 sm:w-full rounded-2xl flex items-center justify-center transition-all self-end sm:self-auto ${
                            ingredients.length === 1
                              ? "bg-[var(--border)]/30 text-[var(--muted)]/30 cursor-not-allowed"
                              : "bg-rose-500/5 text-rose-500 hover:bg-rose-500 hover:text-white shadow-sm hover:shadow-rose-500/20 active:scale-90"
                          }`}
                        >
                          <Trash2 size={20} />
                        </button>
                      </div>
                    ))}
                  </div>

                  <div className="mt-10 flex flex-col sm:flex-row items-center gap-4">
                    <button
                      type="button"
                      onClick={addIngredient}
                      className="w-full sm:w-auto p-4 px-8 rounded-2xl border-2 border-dashed border-orange-500/50 bg-orange-500/5 text-orange-600 font-black text-sm uppercase tracking-widest flex items-center justify-center gap-3 hover:bg-orange-500 hover:text-white hover:border-orange-500 transition-all shadow-sm active:scale-95 group"
                    >
                      <Plus
                        size={20}
                        className="group-hover:rotate-90 transition-transform"
                      />
                      Append Ingredient
                    </button>
                    <div className="text-[10px] font-black text-[var(--muted)] uppercase tracking-widest opacity-50 hidden sm:block">
                      Automatic Unit Sync Enabled
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Step 2 */}
            {step === 2 && (
              <div className="space-y-8 animate-in fade-in slide-in-from-right-4 duration-500">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-2xl bg-orange-500/10 flex items-center justify-center text-orange-600 shrink-0">
                    <Thermometer size={24} strokeWidth={2.5} />
                  </div>
                  <div>
                    <h2 className="text-xl font-black text-[var(--text)] tracking-tight">
                      Cooking Parameters
                    </h2>
                    <p className="text-xs font-bold text-[var(--muted)] uppercase tracking-widest mt-0.5 opacity-70">
                      Temperature and timing are immutable after submission
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <FormInput
                    label="Target Temperature (°C)"
                    value={form.temp}
                    onChange={set("temp")}
                    placeholder="e.g. 185"
                    type="number"
                    icon={<Thermometer size={16} />}
                    required
                  />
                  <FormInput
                    label="Cooking Duration (mins)"
                    value={form.timing}
                    onChange={set("timing")}
                    placeholder="e.g. 45"
                    type="number"
                    icon={<Timer size={16} />}
                    required
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {[
                    {
                      title: "Locked on Submit",
                      desc: "Parameters cannot be modified once the experiment is logged.",
                      icon: <CheckCircle size={16} />,
                      color: "text-orange-600",
                      bg: "bg-orange-500/5",
                    },
                    {
                      title: "Audit Logged",
                      desc: "Every parameter change is cryptographically recorded in the log.",
                      icon: <CheckCircle size={16} />,
                      color: "text-emerald-600",
                      bg: "bg-emerald-500/5",
                    },
                  ].map((item) => (
                    <div
                      key={item.title}
                      className={`p-5 rounded-2xl border border-[var(--border)] ${item.bg} flex items-start gap-4 transition-transform hover:scale-[1.02]`}
                    >
                      <div className={`mt-1 ${item.color}`}>{item.icon}</div>
                      <div>
                        <div className="text-[11px] font-black text-[var(--text)] uppercase tracking-widest mb-1">
                          {item.title}
                        </div>
                        <div className="text-xs font-medium text-[var(--muted)] leading-relaxed">
                          {item.desc}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Step 3 */}
            {step === 3 && (
              <div className="space-y-8 animate-in fade-in slide-in-from-right-4 duration-500">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 flex items-center justify-center text-emerald-600 shrink-0">
                    <ChefHat size={24} strokeWidth={2.5} />
                  </div>
                  <div>
                    <h2 className="text-xl font-black text-[var(--text)] tracking-tight">
                      Output Data
                    </h2>
                    <p className="text-xs font-bold text-[var(--muted)] uppercase tracking-widest mt-0.5 opacity-70">
                      Expected vs. actual cooking results
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
                  {/* Expected */}
                  <div className="space-y-6">
                    <div className="text-[11px] font-black text-[var(--primary)] uppercase tracking-[0.2em] border-b-2 border-[var(--primary)]/20 pb-3 flex items-center gap-2">
                      <div className="w-2 h-2 rounded-full bg-[var(--primary)] animate-pulse" />
                      Expected Result
                    </div>
                    <div className="space-y-5">
                      <FormInput
                        label="Expected Texture"
                        value={form.expTexture}
                        onChange={set("expTexture")}
                        placeholder="e.g. Smooth, Creamy"
                      />
                      <div className="space-y-2">
                        <label className="block text-[11px] font-black text-[var(--muted)] uppercase tracking-widest px-1">
                          Expected Output
                        </label>
                        <div className="grid grid-cols-[1fr_120px] gap-3">
                          <input
                            type="number"
                            min="0"
                            value={form.expOutputValue}
                            onChange={set("expOutputValue")}
                            placeholder="e.g. 2.5"
                            className="input-field grow px-4 py-3 font-bold"
                          />
                          <select
                            value={form.expOutputUnit}
                            onChange={set("expOutputUnit")}
                            className="input-field px-4 py-3 font-bold bg-[var(--surface)]"
                          >
                            {OUTPUT_UNITS.map((u) => (
                              <option key={u} value={u}>
                                {u}
                              </option>
                            ))}
                          </select>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Actual */}
                  <div className="space-y-6">
                    <div className="text-[11px] font-black text-emerald-600 dark:text-emerald-400 uppercase tracking-[0.2em] border-b-2 border-emerald-500/20 pb-3 flex items-center gap-2">
                      <div className="w-2 h-2 rounded-full bg-emerald-500" />
                      Actual Result
                    </div>
                    <div className="space-y-5">
                      <FormInput
                        label="Achieved Texture"
                        value={form.actTexture}
                        onChange={set("actTexture")}
                        placeholder="e.g. Slightly Grainy"
                      />
                      <div className="space-y-2">
                        <label className="block text-[11px] font-black text-[var(--muted)] uppercase tracking-widest px-1">
                          Actual Output
                        </label>
                        <div className="grid grid-cols-[1fr_120px] gap-3">
                          <input
                            type="number"
                            min="0"
                            value={form.actOutputValue}
                            onChange={set("actOutputValue")}
                            placeholder="e.g. 2.4"
                            className="input-field grow px-4 py-3 font-bold"
                          />
                          <select
                            value={form.actOutputUnit}
                            onChange={set("actOutputUnit")}
                            className="input-field px-4 py-3 font-bold bg-[var(--bg)] opacity-50 cursor-not-allowed"
                            disabled
                          >
                            {OUTPUT_UNITS.map((u) => (
                              <option key={u} value={u}>
                                {u}
                              </option>
                            ))}
                          </select>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="p-5 rounded-2xl bg-amber-500/5 border border-amber-500/20 flex items-start gap-4">
                  <div className="mt-1 text-amber-600">
                    <Timer size={18} strokeWidth={2.5} />
                  </div>
                  <div>
                    <div className="text-[11px] font-black text-amber-800 dark:text-amber-500 uppercase tracking-widest mb-1">
                      AI Variance Analysis
                    </div>
                    <p className="text-xs font-medium text-amber-700/80 dark:text-amber-500/80 leading-relaxed">
                      The AI engine will automatically compute texture and
                      weight variance between expected and actual results upon
                      submission to determine the quality score.
                    </p>
                  </div>
                </div>

                <div className="space-y-3">
                  <label className="block text-[11px] font-black text-[var(--muted)] uppercase tracking-widest px-1">
                    Chef Observations & Remarks
                  </label>
                  <textarea
                    value={form.remarks}
                    onChange={set("remarks")}
                    placeholder="Share any specific notes, deviations, or unexpected observations during the cooking process..."
                    className="input-field w-full min-h-[120px] resize-none p-4 text-sm font-medium"
                  />
                </div>
              </div>
            )}
            {/* Step 4 */}
            {step === 4 && (
              <div className="space-y-8 animate-in fade-in slide-in-from-right-4 duration-500">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-2xl bg-indigo-500/10 flex items-center justify-center text-indigo-600 shrink-0">
                    <Plus size={24} strokeWidth={2.5} />
                  </div>
                  <div>
                    <h2 className="text-xl font-black text-[var(--text)] tracking-tight">
                      Final Review & Submit
                    </h2>
                    <p className="text-xs font-bold text-[var(--muted)] uppercase tracking-widest mt-0.5 opacity-70">
                      Verify experiment details and add visual documentation
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-1 gap-6">
                  <FileUploader
                    label="Supporting Images"
                    hint="Capture or upload images of final dish (max 3 files)"
                    accept="image/*"
                    maxFiles={3}
                  />
                </div>

                <div className="p-8 bg-[var(--bg)] rounded-[32px] border-2 border-dashed border-[var(--border)]">
                  <div className="flex items-center gap-4 mb-8 pb-6 border-b border-[var(--border)]">
                    <div className="w-14 h-14 rounded-2xl bg-[var(--primary-glow)] flex items-center justify-center text-[var(--primary)] text-2xl shadow-inner">
                      <CheckCircle size={28} strokeWidth={2.5} />
                    </div>
                    <div>
                      <div className="text-[10px] text-[var(--primary)] uppercase font-black tracking-[0.2em] mb-1">
                        Ready for AI Audit
                      </div>
                      <div className="text-lg font-black text-[var(--text)] tracking-tight">
                        Experiment Summary
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
                    {[
                      {
                        label: "Target Recipe",
                        val: `${form.recipeName} ${form.version}`,
                      },
                      {
                        label: "Batch Reference",
                        val: `EXP-${Date.now().toString().slice(-6)}`,
                      },
                      {
                        label: "Cook Profile",
                        val: `${form.temp}°C / ${form.timing} mins`,
                      },
                      {
                        label: "Data Integrity",
                        val: `${ingredients.length} Items Logged`,
                      },
                    ].map((item) => (
                      <div key={item.label} className="space-y-1">
                        <div className="text-[10px] text-[var(--muted)] uppercase font-black tracking-widest opacity-60">
                          {item.label}
                        </div>
                        <div className="text-sm font-black text-[var(--text)] tracking-tight">
                          {item.val}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="p-6 rounded-2xl bg-emerald-500/5 border border-emerald-500/20 shadow-sm relative overflow-hidden group">
                  <div className="absolute right-0 top-0 w-24 h-full bg-emerald-500/5 -skew-x-12 translate-x-8 group-hover:translate-x-4 transition-transform duration-700" />
                  <div className="relative z-10">
                    <div className="text-xs font-black text-emerald-600 dark:text-emerald-400 mb-2 uppercase tracking-wider flex items-center gap-2">
                      <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                      Immutable Submission Guaranteed
                    </div>
                    <p className="text-xs font-bold text-[var(--muted)] leading-relaxed max-w-2xl">
                      Once submitted, this experiment is cryptographically
                      sealed. It{" "}
                      <span className="text-[var(--text)]">
                        cannot be modified or removed
                      </span>{" "}
                      from the PBN Cloud Kitchen history.
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* Navigation */}
            <div className="flex items-center justify-between mt-10 pt-8 border-t border-[var(--border)]">
              {step > 1 ? (
                <button
                  onClick={() => setStep((s) => Math.max(1, s - 1))}
                  className="px-8 py-3.5 rounded-xl text-sm font-black text-[var(--muted)] uppercase tracking-widest hover:text-[var(--text)] hover:bg-[var(--bg)] transition-all active:scale-95"
                >
                  Back
                </button>
              ) : (
                <div />
              )}

              <div className="flex items-center gap-4">
                {step < 4 ? (
                  <button
                    onClick={() => setStep((s) => s + 1)}
                    className="btn-primary min-w-[160px] py-3.5 rounded-xl font-black italic tracking-tight text-sm shadow-xl shadow-orange-500/20 active:scale-95"
                  >
                    PROCEED TO NEXT STEP
                  </button>
                ) : (
                  <button
                    onClick={handleSubmitExperiment}
                    className="btn-primary flex items-center gap-2.5 px-8 py-3.5 rounded-xl font-black italic tracking-tight text-sm shadow-2xl shadow-orange-500/30 active:scale-95 group"
                  >
                    <ChefHat
                      size={18}
                      className="group-hover:rotate-12 transition-transform"
                    />
                    SUBMIT FINAL EXPERIMENT
                  </button>
                )}
              </div>
            </div>

            {submitMessage && (
              <div className="mt-8 p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-600 dark:text-emerald-400 font-black text-xs text-center animate-in fade-in slide-in-from-bottom-2">
                {submitMessage}
              </div>
            )}
          </div>
        </Card>
      </div>
    </div>
  );
}
