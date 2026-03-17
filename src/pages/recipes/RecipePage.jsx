import { useEffect, useState } from "react";
import { Thermometer, Timer, ChefHat, CheckCircle, Plus, Trash2 } from "lucide-react";
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

const INGREDIENT_UNITS = ['g', 'kg', 'ml', 'l', 'tsp', 'tbsp', 'pcs'];
const OUTPUT_UNITS = ['g', 'kg', 'ml', 'l', 'pcs'];
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
    <div
      style={{
        background: "var(--surface)",
        border: "1px solid var(--border)",
        borderRadius: 18,
        padding: "24px 28px",
        marginBottom: 28,
        boxShadow: "0 20px 50px rgba(0,0,0,0.06)",
      }}
    >
      <div style={{ position: "relative" }}>
        <div
          style={{
            position: "absolute",
            top: "17px",
            left: 0,
            right: 0,
            height: 3,
            background: "var(--border)",
            borderRadius: 999,
          }}
        />
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "flex-start",
            position: "relative",
            zIndex: 1,
          }}
        >
          {steps.map((s, i) => {
            const done = current > i + 1;
            const active = current === i + 1;
            return (
              <div key={s.label} style={{ textAlign: "center", flex: 1 }}>
                <div
                  style={{
                    width: 34,
                    height: 34,
                    borderRadius: "50%",
                    display: "inline-flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontSize: done ? 14 : 12,
                    fontWeight: 800,
                    border: `2px solid ${
                      active || done ? "var(--primary)" : "var(--border)"
                    }`,
                    background: active
                      ? "var(--primary)"
                      : done
                        ? "var(--primary-glow)"
                        : "var(--bg)",
                    color: active
                      ? "#fff"
                      : done
                        ? "var(--primary)"
                        : "var(--muted)",
                    transition: "all 0.25s",
                  }}
                >
                  {done ? <CheckCircle size={16} /> : i + 1}
                </div>
                <div style={{ marginTop: 10 }}>
                  <div
                    style={{
                      fontSize: 10,
                      color: "var(--muted)",
                      letterSpacing: 1,
                      textTransform: "uppercase",
                      fontWeight: 700,
                    }}
                  >
                    Step {i + 1}
                  </div>
                  <div
                    style={{
                      fontSize: 13,
                      fontWeight: active ? 700 : 600,
                      color: active ? "var(--text)" : "var(--muted)",
                      whiteSpace: "nowrap",
                    }}
                  >
                    {s.label}
                  </div>
                  <div
                    style={{
                      fontSize: 11,
                      fontWeight: 700,
                      marginTop: 4,
                      color: done
                        ? "var(--success)"
                        : active
                          ? "var(--primary)"
                          : "var(--muted)",
                    }}
                  >
                    {done ? "Completed" : active ? "In Progress" : "Pending"}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
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
    localStorage.setItem(
      "savedIngredients",
      JSON.stringify(savedIngredients),
    );
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
    const safeName =
      typeof name === "string" ? name : "";
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

  const normalizeIngredientName = (name) =>
    String(name ?? "").trim();

  const findSavedIngredient = (name) => {
    const key = normalizeIngredientName(name).toLowerCase();
    if (!key) return null;
    return (
      savedIngredients.find(
        (item) => String(item.name || "").trim().toLowerCase() === key,
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
          String(item.name || "").trim().toLowerCase() ===
          trimmedName.toLowerCase(),
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
    const q = String(query ?? "").trim().toLowerCase();
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
        .concat(customRecipes.map((r) => normalizeRecipeName(r)).filter(Boolean)),
    ),
  ).map(
    (key) =>
      [...experiments, ...storedExperiments].find(
        (e) => normalizeRecipeName(e.recipe) === key,
      )?.recipe?.replace(/\sv\d+\.\d+$/i, "") ||
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
    (name) => normalizeRecipeName(name) === normalizeRecipeName(form.recipeName),
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
    const date =
      form.expDate || now.toISOString().slice(0, 10);
    const chef =
      (localStorage.getItem("ck_auth_email") || "Unknown Chef").split("@")[0];
      const newExp = {
        id,
        recipe: `${recipeName} ${form.version}`,
        version: form.version,
        date,
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
    <div style={{ animation: "fadeIn 0.3s ease-out" }}>
      <PageHeader
        title="Create Experiment"
        subtitle="Submit a new cooking experiment for quality review and AI analysis."
      />

      <div className="max-w-5xl mx-auto w-full">
        <StepIndicator current={step} />

        <Card
          noPad
          style={{
            background: "var(--surface)",
            borderRadius: 22,
            border: "1px solid var(--border)",
            boxShadow: "0 30px 80px rgba(0,0,0,0.08)",
            padding:"30px"
          }}
        >
          <div style={{ padding: 12 }}>
        {/* Step 1 */}
        {step === 1 && (
          <div>
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: 12,
                marginBottom: 24,
              }}
            >
              {/* <div style={{ fontSize: 28 }}>ðŸ“‹</div>   */}
              <div>
                <div
                  style={{
                    fontSize: 16,
                    fontWeight: 700,
                    color: "var(--text)",
                  }}
                >
                  Recipe Information
                </div>
                <div
                  style={{ fontSize: 12, color: "var(--muted)", marginTop: 2 }}
                >
                  Basic details about the recipe experiment
                </div>
              </div>
            </div>
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "1fr 1fr",
                gap: 16,
              }}
            >
              <div style={{ position: "relative" }}>
                <label
                  style={{
                    display: "block",
                    fontSize: 12,
                    fontWeight: 600,
                    color: "var(--muted)",
                    marginBottom: 6,
                  }}
                >
                  Recipe Name <span style={{ color: "var(--danger)" }}>*</span>
                </label>
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
                  onBlur={() => setTimeout(() => setShowSuggestions(false), 150)}
                  placeholder="e.g. Butter Chicken"
                  className="input-field"
                />
                {showSuggestions &&
                  (suggestions.length > 0 ||
                    (!isExistingRecipeExact && form.recipeName.trim())) && (
                    <div
                      style={{
                        position: "absolute",
                        top: "100%",
                        left: 0,
                        right: 0,
                        marginTop: 6,
                        border: "1px solid var(--border)",
                        borderRadius: 10,
                        background: "var(--bg)",
                        overflow: "hidden",
                        boxShadow: "0 10px 24px rgba(0,0,0,0.08)",
                        zIndex: 20,
                      }}
                    >
                      {suggestions.map((name) => (
                        <button
                          key={name}
                          type="button"
                          onMouseDown={(e) => {
                            e.preventDefault();
                            handleSelectRecipe(name);
                          }}
                          style={{
                            width: "100%",
                            textAlign: "left",
                            padding: "10px 12px",
                            border: "none",
                            background: "transparent",
                            cursor: "pointer",
                            fontSize: 13,
                            fontWeight: 600,
                            color: "var(--text)",
                          }}
                          onMouseEnter={(e) =>
                            (e.currentTarget.style.background =
                              "var(--primary-glow)")
                          }
                          onMouseLeave={(e) =>
                            (e.currentTarget.style.background = "transparent")
                          }
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
                          style={{
                            width: "100%",
                            textAlign: "left",
                            padding: "10px 12px",
                            border: "none",
                            background: "var(--success-glow)",
                            cursor: "pointer",
                            fontSize: 13,
                            fontWeight: 700,
                            color: "var(--success)",
                          }}
                        >
                          Create "{form.recipeName.trim()}"
                        </button>
                      )}
                    </div>
                  )}
              </div>
              <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                <div>
                  <label
                    style={{
                      display: "block",
                      fontSize: 12,
                      fontWeight: 600,
                      color: "var(--muted)",
                      marginBottom: 6,
                    }}
                  >
                    Recipe Version <span style={{ color: "var(--danger)" }}>*</span>
                  </label>
                  <div
                    style={{
                      display: "grid",
                      gridTemplateColumns: "1fr auto",
                      gap: 10,
                      alignItems: "center",
                    }}
                  >
                    <input
                      type="text"
                      value={form.version}
                      placeholder="e.g. v1.0"
                      className="input-field"
                      readOnly
                      style={{ background: "var(--bg)", opacity: 0.85 }}
                    />
                    <button
                      type="button"
                      onClick={handleChangeVersionMajor}
                      disabled={versionBumped}
                      style={{
                        padding: "10px 12px",
                        borderRadius: 10,
                        border: "1px solid var(--border)",
                        background: versionBumped ? "var(--border)" : "var(--bg)",
                        fontSize: 12,
                        fontWeight: 700,
                        color: versionBumped ? "var(--muted)" : "var(--text)",
                        cursor: versionBumped ? "not-allowed" : "pointer",
                        whiteSpace: "nowrap",
                      }}
                    >
                      Change Version
                    </button>
                  </div>
                </div>
                {/* <div style={{ display: "flex", gap: 8 }}>
                  <button
                    type="button"
                    onClick={() => {
                      setRecipeMode("create");
                      setVersionManual(false);
                    }}
                    style={{
                      flex: 1,
                      padding: "8px 12px",
                      borderRadius: 8,
                      border:
                        recipeMode === "create"
                          ? "1px solid var(--primary)"
                          : "1px solid var(--border)",
                      background:
                        recipeMode === "create"
                          ? "var(--primary)"
                          : "var(--bg)",
                      color: recipeMode === "create" ? "#fff" : "var(--text)",
                      fontWeight: 700,
                      cursor: "pointer",
                      transition: "all 0.2s",
                    }}
                  >
                    Create
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setRecipeMode("existing");
                      setVersionManual(false);
                    }}
                    style={{
                      flex: 1,
                      padding: "8px 12px",
                      borderRadius: 8,
                      border:
                        recipeMode === "existing"
                          ? "1px solid var(--primary)"
                          : "1px solid var(--border)",
                      background:
                        recipeMode === "existing"
                          ? "var(--primary)"
                          : "var(--bg)",
                      color:
                        recipeMode === "existing" ? "#fff" : "var(--text)",
                      fontWeight: 700,
                      cursor: "pointer",
                      transition: "all 0.2s",
                    }}
                  >
                    Existing
                  </button>
                </div> */}
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
            <div style={{ marginTop: 24 }}>
              <div
                style={{
                  fontSize: 14,
                  fontWeight: 700,
                  color: "var(--text)",
                  marginBottom: 12,
                }}
              >
                Ingredients
              </div>
                <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "2fr 1fr 1fr 44px",
                  gap: 12,
                  fontSize: 11,
                  color: "var(--muted)",
                  fontWeight: 700,
                  textTransform: "uppercase",
                  letterSpacing: 0.6,
                  marginBottom: 8,
                }}
              >
                <div>Ingredient</div>
                <div>Quantity</div>
                <div>Unit</div>
                <div />
              </div>
              {ingredients.map((ing, idx) => (
                <div
                  key={`ingredient-${idx}`}
                  style={{
                    display: "grid",
                    gridTemplateColumns: "2fr 1fr 1fr 44px",
                    gap: 12,
                    alignItems: "center",
                    marginBottom: 10,
                  }}
                >
                  <div style={{ position: "relative" }}>
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
                          const suggestions = getIngredientSuggestions(ing.name);
                          if (!ingredientSuggest.open || ingredientSuggest.row !== idx) return;
                          if (e.key === "ArrowDown") {
                            e.preventDefault();
                          setIngredientSuggest((s) => ({
                            ...s,
                            index: Math.min(s.index + 1, suggestions.length - 1),
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
                            const pick = suggestions[ingredientSuggest.index];
                            if (pick) {
                              handleIngredientSelect(idx, pick);
                            } else {
                              handleIngredientCreate(idx, ing.name, { saveUnit: true });
                            }
                          }
                          if (e.key === "Escape") {
                            setIngredientSuggest({ row: null, index: -1, open: false });
                          }
                        }}
                      placeholder="e.g. Paneer"
                      className="input-field"
                    />
                    {(() => {
                      const suggestions = getIngredientSuggestions(ing.name);
                      const typed = String(ing.name ?? "").trim();
                      const canCreate =
                        typed &&
                        !suggestions.some(
                          (name) => name.toLowerCase() === typed.toLowerCase(),
                        );
                      if (
                        !ingredientSuggest.open ||
                        ingredientSuggest.row !== idx ||
                        (!suggestions.length && !canCreate)
                      ) {
                        return null;
                      }
                        return (
                          <div
                            className="absolute bg-white shadow-md rounded-md max-h-40 overflow-y-auto"
                            style={{
                              position: "absolute",
                              top: "100%",
                              left: 0,
                              right: 0,
                            marginTop: 6,
                            border: "1px solid var(--border)",
                            borderRadius: 10,
                            background: "var(--bg)",
                            overflow: "hidden",
                            boxShadow: "0 10px 24px rgba(0,0,0,0.08)",
                            zIndex: 20,
                          }}
                        >
                            {suggestions.map((name, i) => (
                              <button
                                key={`${name}-${i}`}
                                type="button"
                                onMouseDown={(e) => e.preventDefault()}
                                onClick={() => handleIngredientSelect(idx, name)}
                              style={{
                                width: "100%",
                                textAlign: "left",
                                padding: "10px 12px",
                                border: "none",
                                background:
                                  i === ingredientSuggest.index
                                    ? "var(--primary-glow)"
                                    : "transparent",
                                cursor: "pointer",
                                fontSize: 13,
                                fontWeight: 600,
                                color: "var(--text)",
                              }}
                            >
                              {name}
                            </button>
                          ))}
                            {canCreate && (
                                <button
                                  type="button"
                                  onMouseDown={(e) => e.preventDefault()}
                                  onClick={() => handleIngredientCreate(idx, ing.name, { saveUnit: true })}
                                  style={{
                                    width: "100%",
                                    textAlign: "left",
                                    padding: "10px 12px",
                                  border: "none",
                                  background: "var(--success-glow)",
                                  cursor: "pointer",
                                  fontSize: 13,
                                  fontWeight: 700,
                                  color: "var(--success)",
                                }}
                              >
                                Create "{typed}"
                              </button>
                            )}
                        </div>
                      );
                    })()}
                  </div>

                  <select
                    value={ing.unit}
                    onChange={(e) =>
                      updateIngredient(idx, { unit: e.target.value })
                    }
                    className="input-field"
                  >
                    {INGREDIENT_UNITS.map((u) => (
                      <option key={u} value={u}>
                        {u}
                      </option>
                    ))}
                  </select>
                      <input
                    type="number"
                    min="0"
                    value={ing.quantity}
                    onChange={(e) =>
                      updateIngredient(idx, { quantity: e.target.value })
                    }
                    placeholder="e.g. 200"
                    className="input-field"
                  />
                  <button
                    type="button"
                    onClick={() => removeIngredient(idx)}
                    disabled={ingredients.length === 1}
                    style={{
                      height: 42,
                      borderRadius: 10,
                      border: "1px solid var(--border)",
                      background:
                        ingredients.length === 1
                          ? "var(--border)"
                          : "var(--danger-glow)",
                      color:
                        ingredients.length === 1
                          ? "var(--muted)"
                          : "var(--danger)",
                      cursor:
                        ingredients.length === 1 ? "not-allowed" : "pointer",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                    aria-label="Remove ingredient"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              ))}
              <button
                type="button"
                onClick={addIngredient}
                style={{
                  marginTop: 6,
                  padding: "10px 14px",
                  borderRadius: 10,
                  border: "1px dashed var(--primary)",
                  background: "var(--primary-glow)",
                  color: "var(--primary)",
                  fontWeight: 700,
                  display: "flex",
                  alignItems: "center",
                  gap: 8,
                  cursor: "pointer",
                }}
              >
                <Plus size={16} /> Add Ingredient
              </button>
            </div>
          </div>
        )}

        {/* Step 2 */}
        {step === 2 && (
          <div>
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: 12,
                marginBottom: 24,
              }}
            >
              {/* <div style={{ fontSize: 28 }}>ðŸŒ¡ï¸</div> */}
              <div>
                <div
                  style={{
                    fontSize: 16,
                    fontWeight: 700,
                    color: "var(--text)",
                  }}
                >
                  Cooking Parameters
                </div>
                <div
                  style={{ fontSize: 12, color: "var(--muted)", marginTop: 2 }}
                >
                  Temperature and timing are immutable after submission
                </div>
              </div>
            </div>
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "1fr 1fr",
                gap: 16,
              }}
            >
              <FormInput
                label="Temperature (Â°C)"
                value={form.temp}
                onChange={set("temp")}
                placeholder="e.g. 185"
                type="number"
                icon={<Thermometer size={15} />}
                required
              />
              <FormInput
                label="Cooking Duration (mins)"
                value={form.timing}
                onChange={set("timing")}
                placeholder="e.g. 45"
                type="number"
                icon={<Timer size={15} />}
                required
              />
            </div>

            <div
              style={{
                marginTop: 20,
                display: "grid",
                gridTemplateColumns: "1fr 1fr",
                gap: 12,
              }}
            >
              {[
                {
                  title: "Locked on Submit",
                  desc: "Cannot be modified after submission",
                },
                {
                  title: "Audit Logged",
                  desc: "Every change is recorded",
                },
              ].map((item) => (
                <div
                  key={item.title}
                  style={{
                    padding: 16,
                    borderRadius: 12,
                    border: "1px solid var(--border)",
                    background: "var(--surface)",
                    display: "flex",
                    alignItems: "flex-start",
                    gap: 12,
                  }}
                >
                  <div
                    style={{
                      width: 10,
                      height: 10,
                      borderRadius: "50%",
                      background: "var(--primary)",
                      marginTop: 6,
                      boxShadow: "0 0 0 4px var(--primary-glow)",
                      flexShrink: 0,
                    }}
                    aria-hidden="true"
                  />
                  <div>
                    <div
                      style={{
                        fontSize: 12,
                        fontWeight: 700,
                        color: "var(--text)",
                        textTransform: "uppercase",
                        letterSpacing: 0.6,
                        marginBottom: 4,
                      }}
                    >
                      {item.title}
                    </div>
                    <div
                      style={{
                        fontSize: 12,
                        color: "var(--muted)",
                        lineHeight: 1.4,
                      }}
                    >
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
          <div>
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: 12,
                marginBottom: 24,
              }}
            >
              {/* <div style={{ fontSize: 28 }}>ðŸ“Š</div> */}
              <div>
                <div
                  style={{
                    fontSize: 16,
                    fontWeight: 700,
                    color: "var(--text)",
                  }}
                >
                  Output Data
                </div>
                <div
                  style={{ fontSize: 12, color: "var(--muted)", marginTop: 2 }}
                >
                  Expected vs. actual cooking results
                </div>
              </div>
            </div>
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "1fr 1fr",
                gap: 24,
                marginBottom: 20,
              }}
            >
              {/* Expected */}
              <div>
                <div
                  style={{
                    fontSize: 12,
                    fontWeight: 700,
                    color: "var(--primary)",
                    textTransform: "uppercase",
                    letterSpacing: 0.8,
                    borderBottom: "1px solid var(--border)",
                    paddingBottom: 10,
                    marginBottom: 16,
                    display: "flex",
                    alignItems: "center",
                    gap: 6,
                  }}
                >
                   Expected Output
                </div>
                <div
                  style={{ display: "flex", flexDirection: "column", gap: 12 }}
                >
                  <FormInput
                    label="Expected Texture"
                    value={form.expTexture}
                    onChange={set("expTexture")}
                    placeholder="e.g. Smooth, Creamy"
                  />
                  <div>
                    <label
                      style={{
                        display: "block",
                        fontSize: 12,
                        fontWeight: 600,
                        color: "var(--muted)",
                        marginBottom: 6,
                      }}
                    >
                      Expected Output
                    </label>
                    <div
                      style={{
                        display: "grid",
                        gridTemplateColumns: "1fr 110px",
                        gap: 10,
                      }}
                    >
                      <input
                        type="number"
                        min="0"
                        value={form.expOutputValue}
                        onChange={set("expOutputValue")}
                        placeholder="e.g. 2"
                        className="input-field"
                      />
                      <select
                        value={form.expOutputUnit}
                        onChange={set("expOutputUnit")}
                        className="input-field"
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
              <div>
                <div
                  style={{
                    fontSize: 12,
                    fontWeight: 700,
                    color: "var(--success)",
                    textTransform: "uppercase",
                    letterSpacing: 0.8,
                    borderBottom: "1px solid var(--border)",
                    paddingBottom: 10,
                    marginBottom: 16,
                    display: "flex",
                    alignItems: "center",
                    gap: 6,
                  }}
                >
                   Actual Output
                </div>
                <div
                  style={{ display: "flex", flexDirection: "column", gap: 12 }}
                >
                  <FormInput
                    label="Achieved Texture"
                    value={form.actTexture}
                    onChange={set("actTexture")}
                    placeholder="e.g. Smooth"
                  />
                  <div>
                    <label
                      style={{
                        display: "block",
                        fontSize: 12,
                        fontWeight: 600,
                        color: "var(--muted)",
                        marginBottom: 6,
                      }}
                    >
                      Actual Output
                    </label>
                    <div
                      style={{
                        display: "grid",
                        gridTemplateColumns: "1fr 110px",
                        gap: 10,
                      }}
                    >
                      <input
                        type="number"
                        min="0"
                        value={form.actOutputValue}
                        onChange={set("actOutputValue")}
                        placeholder="e.g. 1.9"
                        className="input-field"
                      />
                      <select
                        value={form.actOutputUnit}
                        onChange={set("actOutputUnit")}
                        className="input-field"
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

            <div
              style={{
                padding: 14,
                borderRadius: 10,
                background: "var(--warning-glow)",
                border: "1px solid rgba(245,158,11,0.2)",
              }}
            >
              <div
                style={{
                  fontSize: 11,
                  color: "var(--warning)",
                  fontWeight: 700,
                  marginBottom: 4,
                }}
              >
                AI Variance Note
              </div>
              <div style={{ fontSize: 11, color: "var(--subtle)" }}>
                AI will compute variance between expected and actual outputs
                after submission.
              </div>
            </div>

            <div style={{ marginTop: 18 }}>
              <label
                style={{
                  display: "block",
                  fontSize: 12,
                  fontWeight: 600,
                  color: "var(--muted)",
                  marginBottom: 6,
                }}
              >
                Remarks
              </label>
              <textarea
                value={form.remarks}
                onChange={set("remarks")}
                placeholder="Add any notes or observations..."
                className="input-field"
                style={{ minHeight: 90, resize: "vertical" }}
              />
            </div>
          </div>
        )}

        {/* Step 4 */}
        {step === 4 && (
          <div>
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: 12,
                marginBottom: 24,
              }}
            >
              {/* <div style={{ fontSize: 28 }}>ðŸš€</div> */}
              <div>
                <div
                  style={{
                    fontSize: 16,
                    fontWeight: 700,
                    color: "var(--text)",
                  }}
                >
                  Upload image & Submit
                </div>
                <div
                  style={{ fontSize: 12, color: "var(--muted)", marginTop: 2 }}
                >
                  Add supporting evidence before final submission
                </div>
              </div>
            </div>
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "1fr",
                gap: 16,
                marginBottom: 20,
              }}
            >
              <FileUploader
                label="Dish Images"
                hint="JPG, PNG  up to 10MB each (max 3 files)"
                accept="image/*"
                maxFiles={3}
              />
            </div>

            {/* Submission summary */}
            <div
              style={{
                padding: 20,
                background: "var(--bg)",
                borderRadius: 12,
                border: "1px solid var(--border)",
                marginBottom: 20,
              }}
            >
              <div
                style={{
                  fontSize: 13,
                  fontWeight: 700,
                  color: "var(--text)",
                  marginBottom: 14,
                }}
              >
                Submission Summary
              </div>
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "1fr 1fr",
                  gap: "16px 24px",
                }}
              >
                {[
                  ["Recipe", form.recipeName || "â€”"],
                  ["Version", form.version || "â€”"],
                  ["Date", form.expDate || "â€”"],
                  ["Time", form.expTime || "â€”"],
                  ["Temperature", form.temp ? `${form.temp}Â°C` : "â€”"],
                  ["Duration", form.timing ? `${form.timing} mins` : "â€”"],
                  ["Expected Texture", form.expTexture || "â€”"],
                  [
                    "Expected Output",
                    form.expOutputValue
                      ? `${form.expOutputValue} ${form.expOutputUnit}`
                      : "â€”",
                  ],
                  ["Actual Texture", form.actTexture || "â€”"],
                  [
                    "Actual Output",
                    form.actOutputValue
                      ? `${form.actOutputValue} ${form.actOutputUnit}`
                      : "â€”",
                  ],
                ].map(([l, v]) => (
                  <div key={l}>
                    <div
                      style={{
                        fontSize: 10,
                        color: "var(--muted)",
                        fontWeight: 700,
                        textTransform: "uppercase",
                        letterSpacing: 0.6,
                        marginBottom: 3,
                      }}
                    >
                      {l}
                    </div>
                    <div
                      style={{
                        fontSize: 13,
                        fontWeight: 600,
                        color: v === "â€”" ? "var(--muted)" : "var(--text)",
                      }}
                    >
                      {v}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div
              style={{
                padding: 16,
                background: "var(--success-glow)",
                borderRadius: 12,
                border: "1px solid rgba(34,197,94,0.2)",
              }}
            >
              <div
                style={{
                  fontSize: 12,
                  fontWeight: 700,
                  color: "var(--success)",
                  marginBottom: 4,
                }}
              >
                Immutable Submission
              </div>
              <div
                style={{
                  fontSize: 12,
                  color: "var(--subtle)",
                  lineHeight: 1.6,
                }}
              >
                Once submitted, this experiment{" "}
                <strong style={{ color: "var(--text)" }}>
                  cannot be edited, deleted, or modified
                </strong>
                . Timestamps and file hashes will be cryptographically sealed in
                the audit log.
              </div>
            </div>
          </div>
        )}

        {/* Navigation */}
        <div
          style={{
            display: "flex",
            justifyContent: step === 1 ? "flex-end" : "space-between",
            marginTop: 28,
            paddingTop: 20,
            borderTop: "1px solid var(--border)",
          }}
        >
          {step > 1 && (
            <button
              onClick={() => setStep((s) => Math.max(1, s - 1))}
              className="btn-ghost"
            >
              Back
            </button>
          )}
          {step < 4 ? (
            <button
              onClick={() => setStep((s) => s + 1)}
              className="btn-primary"
            >
              Continue 
            </button>
          ) : (
            <button
              onClick={handleSubmitExperiment}
              className="btn-primary"
              style={{ gap: 8, display: "flex", alignItems: "center" }}
            >
              <ChefHat size={14} /> Submit Experiment
            </button>
          )}
        </div>
        {submitMessage && (
          <div
            style={{
              marginTop: 16,
              padding: "12px 14px",
              borderRadius: 10,
              background: "var(--success-glow)",
              border: "1px solid rgba(34,197,94,0.2)",
              color: "var(--success)",
              fontWeight: 700,
              fontSize: 12,
            }}
          >
            {submitMessage}
          </div>
        )}
          </div>
        </Card>
      </div>
    </div>
  );
}
