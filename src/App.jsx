mport { useState, useEffect, useRef } from "react";

const COLORS = {
  gold: "#F5A623",
  green: "#27AE60",
  blue: "#2980B9",
  purple: "#8E44AD",
  red: "#E74C3C",
  sun: "#F39C12",
  teal: "#16A085",
  bg: "#0B0D12",
  card: "rgba(255,255,255,0.04)",
  border: "rgba(255,255,255,0.08)",
};

const calcPct = (v, g) => Math.min(Math.round((v / g) * 100), 100);
const fmtMoney = (v) => v >= 1000 ? `$${(v / 1000).toFixed(1)}k` : `$${v}`;
const fmtThousand = (v) => v >= 1000 ? `${(v / 1000).toFixed(1)}k` : `${v}`;
const DAY_LABELS = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
const checkWeekend = () => { const d = new Date().getDay(); return d === 0 || d === 6; };

// ── Ring Chart ───────────────────────────────────────────────
function Ring({ pct, size = 80, stroke = 8, color = COLORS.gold }) {
  const r = (size - stroke) / 2;
  const circ = 2 * Math.PI * r;
  const dash = (Math.min(pct, 100) / 100) * circ;
  return (
    <svg width={size} height={size} style={{ transform: "rotate(-90deg)" }}>
      <circle cx={size / 2} cy={size / 2} r={r} fill="none"
        stroke="rgba(255,255,255,0.07)" strokeWidth={stroke} />
      <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke={color}
        strokeWidth={stroke} strokeDasharray={circ} strokeDashoffset={circ - dash}
        strokeLinecap="round"
        style={{ transition: "stroke-dashoffset 1s cubic-bezier(.4,0,.2,1)" }} />
      <foreignObject x={0} y={0} width={size} height={size}
        style={{ transform: "rotate(90deg)" }}>
        <div style={{
          width: size, height: size,
          display: "flex", alignItems: "center", justifyContent: "center"
        }}>
          <span style={{ fontSize: size * 0.16, fontWeight: 800, color, lineHeight: 1 }}>
            {pct}%
          </span>
        </div>
      </foreignObject>
    </svg>
  );
}

// ── Bar Chart ────────────────────────────────────────────────
function BarChart({ values, color, h = 44 }) {
  const mx = Math.max(...values, 1);
  return (
    <div style={{ display: "flex", alignItems: "flex-end", gap: 4, height: h }}>
      {values.map((v, i) => (
        <div key={i} style={{
          flex: 1, borderRadius: 4, minHeight: 3,
          background: i === values.length - 1 ? color : "rgba(255,255,255,0.1)",
          height: `${(v / mx) * 100}%`,
          transition: "height 0.9s ease"
        }} />
      ))}
    </div>
  );
}

// ── Progress Bar ─────────────────────────────────────────────
function ProgressBar({ value, goal, color }) {
  return (
    <div style={{
      height: 5, borderRadius: 5,
      background: "rgba(255,255,255,0.07)",
      overflow: "hidden", marginTop: 6
    }}>
      <div style={{
        height: "100%", borderRadius: 5, background: color,
        width: `${calcPct(value, goal)}%`,
        transition: "width 1s ease"
      }} />
    </div>
  );
}

// ── Card ─────────────────────────────────────────────────────
function Card({ children, style = {}, onClick }) {
  return (
    <div onClick={onClick} style={{
      background: COLORS.card,
      border: `1px solid ${COLORS.border}`,
      borderRadius: 18, padding: "16px 18px",
      backdropFilter: "blur(10px)",
      cursor: onClick ? "pointer" : "default",
      ...style
    }}>
      {children}
    </div>
  );
}

// ── Tag Badge ────────────────────────────────────────────────
function Tag({ label, color }) {
  return (
    <span style={{
      fontSize: 10, fontWeight: 700, padding: "3px 8px",
      borderRadius: 20, background: `${color}20`, color,
      border: `1px solid ${color}35`, letterSpacing: 0.4
    }}>
      {label}
    </span>
  );
}

// ── Button ───────────────────────────────────────────────────
function Btn({ children, onClick, color = COLORS.gold, outline = false, style = {}, disabled = false }) {
  return (
    <button onClick={onClick} disabled={disabled} style={{
      padding: "11px 16px", borderRadius: 12,
      cursor: disabled ? "not-allowed" : "pointer",
      fontSize: 13, fontWeight: 700,
      background: disabled ? "rgba(255,255,255,0.06)" : outline ? `${color}15` : color,
      border: `1px solid ${disabled ? "rgba(255,255,255,0.1)" : outline ? color + "44" : "transparent"}`,
      color: disabled ? "rgba(255,255,255,0.3)" : outline ? color : "#000",
      opacity: disabled ? 0.6 : 1,
      ...style
    }}>
      {children}
    </button>
  );
}

// ── Text Input ───────────────────────────────────────────────
function TextInput({ label, value, onChange, type = "text", placeholder = "" }) {
  return (
    <div style={{ marginBottom: 14 }}>
      {label && (
        <div style={{
          fontSize: 11, color: "rgba(255,255,255,0.4)",
          marginBottom: 5, fontWeight: 600, letterSpacing: 0.5
        }}>
          {label}
        </div>
      )}
      <input
        type={type} value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        style={{
          width: "100%", background: "rgba(255,255,255,0.06)",
          border: `1px solid ${COLORS.border}`, borderRadius: 10,
          padding: "11px 14px", color: "#EEF0F5", fontSize: 14,
          outline: "none", boxSizing: "border-box"
        }}
      />
    </div>
  );
}

// ── Bottom Sheet Modal ───────────────────────────────────────
function Modal({ title, children, onClose }) {
  return (
    <div
      onClick={onClose}
      style={{
        position: "fixed", inset: 0, background: "rgba(0,0,0,0.78)",
        zIndex: 1000, display: "flex", alignItems: "flex-end", justifyContent: "center"
      }}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        style={{
          background: "#161924", border: `1px solid ${COLORS.border}`,
          borderRadius: "24px 24px 0 0", padding: 28,
          width: "100%", maxWidth: 480, maxHeight: "88vh", overflowY: "auto"
        }}
      >
        <div style={{
          display: "flex", justifyContent: "space-between",
          alignItems: "center", marginBottom: 20
        }}>
          <div style={{ fontSize: 16, fontWeight: 800 }}>{title}</div>
          <button onClick={onClose} style={{
            background: "rgba(255,255,255,0.08)", border: "none",
            color: "#fff", borderRadius: 10, width: 30, height: 30,
            cursor: "pointer", fontSize: 16
          }}>
            x
          </button>
        </div>
        {children}
      </div>
    </div>
  );
}

// ── Facebook Connect Screen ──────────────────────────────────
function FBConnect({ onConnect, onSkip }) {
  const [pageId, setPageId] = useState("");
  const [token, setToken] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleConnect = () => {
    if (!token.trim()) {
      setError("Please paste your access token first.");
      return;
    }
    if (!token.trim().startsWith("EAA")) {
      setError("That doesn't look like a Facebook token — it should start with EAA...");
      return;
    }
    onConnect({
      id: "102907851890377",
      token: token.trim(),
      name: "Thumb Forecast",
      followers: 13000
    });
  };

  return (
    <div style={{
      minHeight: "100vh", background: COLORS.bg,
      display: "flex", flexDirection: "column",
      alignItems: "center", justifyContent: "center",
      padding: 24, fontFamily: "'Sora','DM Sans',sans-serif", color: "#EEF0F5"
    }}>
      <div style={{ width: "100%", maxWidth: 420, zIndex: 1 }}>
        <div style={{ textAlign: "center", marginBottom: 28 }}>
          <div style={{
            width: 72, height: 72, borderRadius: 20,
            background: `linear-gradient(135deg,${COLORS.blue},${COLORS.purple})`,
            display: "flex", alignItems: "center", justifyContent: "center",
            fontSize: 36, margin: "0 auto 14px",
            boxShadow: `0 8px 32px rgba(41,128,185,0.4)`
          }}>
            📱
          </div>
          <div style={{ fontSize: 22, fontWeight: 800, letterSpacing: -0.5 }}>
            Connect Thumb Forecast
          </div>
          <div style={{
            fontSize: 13, color: "rgba(255,255,255,0.4)", marginTop: 6, lineHeight: 1.5
          }}>
            Stored only in your browser — never sent to any server.
          </div>
        </div>

        <div style={{
          padding: "12px 16px",
          background: "rgba(39,174,96,0.08)",
          border: `1px solid ${COLORS.green}25`,
          borderRadius: 14, marginBottom: 20,
          display: "flex", gap: 10, alignItems: "flex-start"
        }}>
          <span style={{ fontSize: 18, flexShrink: 0 }}>🔐</span>
          <div style={{ fontSize: 12, color: "rgba(255,255,255,0.5)", lineHeight: 1.6 }}>
            Your token is sent directly to Facebook's API only. Never stored on any server.
          </div>
        </div>

        <div style={{
          background: "rgba(255,255,255,0.04)",
          border: `1px solid ${COLORS.border}`,
          borderRadius: 20, padding: 24, marginBottom: 12
        }}>
          {/* Page ID is hardcoded — just show it as info */}
          <div style={{
            marginBottom: 16, padding: "10px 14px",
            background: "rgba(41,128,185,0.08)",
            border: `1px solid ${COLORS.blue}25`, borderRadius: 12
          }}>
            <div style={{ fontSize: 10, color: COLORS.blue, fontWeight: 700, marginBottom: 3, letterSpacing: 0.5 }}>
              PAGE ALREADY SET
            </div>
            <div style={{ fontSize: 13, fontWeight: 700 }}>Thumb Forecast</div>
            <div style={{ fontSize: 11, color: "rgba(255,255,255,0.4)", fontFamily: "monospace" }}>
              ID: 102907851890377
            </div>
          </div>

          <div style={{ marginBottom: 16 }}>
            <div style={{
              fontSize: 11, color: "rgba(255,255,255,0.4)",
              marginBottom: 6, fontWeight: 700, letterSpacing: 0.5
            }}>
              PASTE YOUR ACCESS TOKEN
            </div>
            <textarea
              value={token}
              onChange={(e) => setToken(e.target.value)}
              placeholder="Paste your access token here — starts with EAA..."
              rows={4}
              style={{
                width: "100%", background: "rgba(255,255,255,0.06)",
                border: `1px solid ${COLORS.border}`, borderRadius: 12,
                padding: "13px 16px", color: "#EEF0F5", fontSize: 12,
                outline: "none", boxSizing: "border-box",
                resize: "none", fontFamily: "monospace", lineHeight: 1.5
              }}
            />
          </div>

          {error && (
            <div style={{
              padding: "10px 14px",
              background: "rgba(231,76,60,0.1)",
              border: `1px solid ${COLORS.red}30`,
              borderRadius: 10, fontSize: 12, color: COLORS.red,
              marginBottom: 14, lineHeight: 1.5
            }}>
              {error}
            </div>
          )}

          <button
            onClick={handleConnect}
            disabled={loading || !token.trim()}
            style={{
              width: "100%", padding: 14, borderRadius: 14, border: "none",
              cursor: loading || !token.trim() ? "not-allowed" : "pointer",
              background: token.trim()
                ? `linear-gradient(135deg,${COLORS.blue},${COLORS.purple})`
                : "rgba(255,255,255,0.08)",
              color: token.trim() ? "#fff" : "rgba(255,255,255,0.3)",
              fontSize: 15, fontWeight: 800, opacity: loading ? 0.7 : 1
            }}
          >
            {loading ? "🔄 Connecting…" : "🔗 Connect & Test"}
          </button>
        </div>

        <button onClick={onSkip} style={{
          width: "100%", padding: 12, borderRadius: 14,
          background: "transparent", border: `1px solid ${COLORS.border}`,
          color: "rgba(255,255,255,0.3)", cursor: "pointer", fontSize: 13
        }}>
          Skip — use sample data for now
        </button>

        <div style={{
          marginTop: 16, padding: "14px 16px",
          background: "rgba(255,255,255,0.03)",
          border: `1px solid ${COLORS.border}`, borderRadius: 14
        }}>
          <div style={{
            fontSize: 11, fontWeight: 700, color: "rgba(255,255,255,0.4)",
            letterSpacing: 1, textTransform: "uppercase", marginBottom: 8
          }}>
            Need a fresh token?
          </div>
          <div style={{ fontSize: 12, color: "rgba(255,255,255,0.4)", lineHeight: 1.7 }}>
            1. Go to developers.facebook.com/tools/explorer<br />
            2. Select MY Dashboard app<br />
            3. Add permissions: pages_show_list, pages_read_engagement, pages_read_user_content<br />
            4. Click Generate Access Token and paste above
          </div>
        </div>
      </div>
    </div>
  );
}

// ── Goal Edit Modal ──────────────────────────────────────────
function GoalEditor({ goals, onSave, onClose }) {
  const [vals, setVals] = useState(
    goals.reduce((acc, g) => ({ ...acc, [g.key]: String(g.value) }), {})
  );

  return (
    <Modal title="🎯 Edit Goals" onClose={onClose}>
      <div style={{
        marginBottom: 16, padding: "10px 14px",
        background: "rgba(245,166,35,0.08)",
        border: `1px solid ${COLORS.gold}25`,
        borderRadius: 12, fontSize: 12,
        color: "rgba(255,255,255,0.5)", lineHeight: 1.5
      }}>
        Adjust any goal below. Changes apply immediately across all rings and charts.
      </div>

      {goals.map((g) => (
        <div key={g.key} style={{ marginBottom: 16 }}>
          <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 5 }}>
            <div style={{ fontSize: 12, fontWeight: 700, color: "rgba(255,255,255,0.7)" }}>
              {g.label}
            </div>
            <div style={{ fontSize: 11, color: "rgba(255,255,255,0.3)" }}>
              now: {g.current} {g.unit || ""}
            </div>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <input
              type="number" value={vals[g.key]}
              onChange={(e) => setVals((v) => ({ ...v, [g.key]: e.target.value }))}
              style={{
                flex: 1, background: "rgba(255,255,255,0.06)",
                border: `1px solid ${COLORS.border}`, borderRadius: 10,
                padding: "10px 14px", color: "#EEF0F5",
                fontSize: 14, outline: "none"
              }}
            />
            <div style={{ fontSize: 12, color: "rgba(255,255,255,0.3)", minWidth: 36 }}>
              {g.unit || ""}
            </div>
          </div>
          <div style={{ marginTop: 6, height: 3, borderRadius: 3, background: "rgba(255,255,255,0.06)" }}>
            <div style={{
              height: "100%", borderRadius: 3, background: g.color,
              width: `${Math.min(100, (g.current / Math.max(parseFloat(vals[g.key]) || 1, 1)) * 100)}%`,
              transition: "width 0.3s"
            }} />
          </div>
        </div>
      ))}

      <div style={{ display: "flex", gap: 10, marginTop: 4 }}>
        <Btn outline color="rgba(255,255,255,0.3)" onClick={onClose}
          style={{ flex: 1, color: "#aaa" }}>
          Cancel
        </Btn>
        <Btn onClick={() => onSave(vals)} style={{ flex: 1 }}>
          Save All Goals
        </Btn>
      </div>
    </Modal>
  );
}

// ── AI Nutrition Scanner ─────────────────────────────────────
function NutritionScanner({ onLog, onClose }) {
  const [stage, setStage] = useState("idle");
  const [imgSrc, setImgSrc] = useState(null);
  const [imgB64, setImgB64] = useState(null);
  const [result, setResult] = useState(null);
  const [desc, setDesc] = useState("");
  const fileRef = useRef();

  const handleFile = (file) => {
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (e) => {
      setImgSrc(e.target.result);
      setImgB64(e.target.result.split(",")[1]);
    };
    reader.readAsDataURL(file);
  };

  const analyze = async () => {
    setStage("analyzing");
    try {
      const resp = await fetch("https://api.anthropic.com/v1/messages", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          model: "claude-sonnet-4-20250514",
          max_tokens: 1000,
          messages: [{
            role: "user",
            content: [
              {
                type: "image",
                source: { type: "base64", media_type: "image/jpeg", data: imgB64 }
              },
              {
                type: "text",
                text: `Analyze this meal photo${desc ? ` (${desc})` : ""} and respond ONLY with a JSON object, no markdown:
{"meal":"name","calories":0,"protein":0,"carbs":0,"fat":0,"fiber":0,"items":[{"name":"item","calories":0,"protein":0,"carbs":0,"fat":0}],"notes":"tip","confidence":"high"}`
              }
            ]
          }]
        })
      });
      const data = await resp.json();
      const text = data.content?.map((c) => c.text || "").join("") || "";
      setResult(JSON.parse(text.replace(/```json|```/g, "").trim()));
      setStage("done");
    } catch (e) {
      setStage("error");
    }
  };

  return (
    <Modal title="📸 AI Nutrition Scanner" onClose={onClose}>
      {stage === "idle" && (
        <>
          <div
            onClick={() => fileRef.current.click()}
            style={{
              border: `2px dashed ${imgSrc ? COLORS.teal : COLORS.border}`,
              borderRadius: 16, padding: imgSrc ? "0" : "32px 16px",
              textAlign: "center", cursor: "pointer",
              background: "rgba(255,255,255,0.02)",
              overflow: "hidden", marginBottom: 14
            }}
          >
            {imgSrc ? (
              <img src={imgSrc} alt="meal" style={{ width: "100%", borderRadius: 14, display: "block" }} />
            ) : (
              <>
                <div style={{ fontSize: 36, marginBottom: 8 }}>🍽️</div>
                <div style={{ fontSize: 14, fontWeight: 700, color: "rgba(255,255,255,0.7)" }}>
                  Tap to upload a photo
                </div>
              </>
            )}
          </div>
          <input ref={fileRef} type="file" accept="image/*" capture="environment"
            style={{ display: "none" }} onChange={(e) => handleFile(e.target.files[0])} />
          {imgSrc && (
            <>
              <TextInput label="Optional: describe your meal" value={desc}
                onChange={setDesc} placeholder="e.g. medium salmon with veggies" />
              <div style={{ display: "flex", gap: 10 }}>
                <Btn outline color="rgba(255,255,255,0.3)"
                  onClick={() => { setImgSrc(null); setImgB64(null); setDesc(""); }}
                  style={{ flex: 1, color: "#aaa" }}>
                  Retake
                </Btn>
                <Btn onClick={analyze} color={COLORS.teal} style={{ flex: 1 }}>
                  🔍 Analyze
                </Btn>
              </div>
            </>
          )}
        </>
      )}

      {stage === "analyzing" && (
        <div style={{ textAlign: "center", padding: "32px 0" }}>
          <div style={{ fontSize: 32, marginBottom: 12 }}>⏳</div>
          <div style={{ fontSize: 15, fontWeight: 700, color: COLORS.teal }}>
            Analyzing your meal…
          </div>
        </div>
      )}

      {stage === "done" && result && (
        <>
          {imgSrc && (
            <img src={imgSrc} alt="meal"
              style={{ width: "100%", borderRadius: 14, marginBottom: 16 }} />
          )}
          <div style={{ fontSize: 15, fontWeight: 800, marginBottom: 8 }}>{result.meal}</div>
          <Tag
            label={`Confidence: ${result.confidence}`}
            color={result.confidence === "high" ? COLORS.green : result.confidence === "medium" ? COLORS.gold : COLORS.red}
          />
          <div style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: 8, margin: "14px 0" }}>
            {[
              { l: "Cal", v: result.calories, c: COLORS.teal, u: "kcal" },
              { l: "Protein", v: result.protein, c: COLORS.purple, u: "g" },
              { l: "Carbs", v: result.carbs, c: COLORS.gold, u: "g" },
              { l: "Fat", v: result.fat, c: COLORS.red, u: "g" }
            ].map(({ l, v, c, u }) => (
              <div key={l} style={{
                background: "rgba(255,255,255,0.04)",
                border: `1px solid ${COLORS.border}`,
                borderRadius: 12, padding: "10px 8px", textAlign: "center"
              }}>
                <div style={{ fontSize: 9, color: "rgba(255,255,255,0.35)", marginBottom: 3 }}>{l}</div>
                <div style={{ fontSize: 18, fontWeight: 800, color: c }}>{v}</div>
                <div style={{ fontSize: 9, color: "rgba(255,255,255,0.25)" }}>{u}</div>
              </div>
            ))}
          </div>
          {result.items?.length > 0 && result.items.map((item, i) => (
            <div key={i} style={{
              display: "flex", justifyContent: "space-between",
              padding: "7px 0", borderBottom: "1px solid rgba(255,255,255,0.05)"
            }}>
              <div style={{ fontSize: 13, color: "rgba(255,255,255,0.75)" }}>{item.name}</div>
              <div style={{ fontSize: 12, color: COLORS.teal, fontWeight: 700 }}>{item.calories} cal</div>
            </div>
          ))}
          {result.notes && (
            <div style={{
              padding: "10px 14px",
              background: "rgba(22,160,133,0.08)",
              border: `1px solid ${COLORS.teal}25`,
              borderRadius: 12, fontSize: 12,
              color: "rgba(255,255,255,0.55)", lineHeight: 1.5, margin: "14px 0"
            }}>
              💡 {result.notes}
            </div>
          )}
          <div style={{ display: "flex", gap: 10 }}>
            <Btn outline color="rgba(255,255,255,0.3)" onClick={onClose}
              style={{ flex: 1, color: "#aaa" }}>Discard</Btn>
            <Btn onClick={() => { onLog(result); onClose(); }} color={COLORS.teal} style={{ flex: 1 }}>
              Log Meal
            </Btn>
          </div>
        </>
      )}

      {stage === "error" && (
        <div style={{ textAlign: "center", padding: "32px 0" }}>
          <div style={{ fontSize: 36, marginBottom: 12 }}>😕</div>
          <div style={{ fontSize: 15, fontWeight: 700, color: COLORS.red, marginBottom: 16 }}>
            Could not analyze photo
          </div>
          <Btn onClick={() => setStage("idle")} color={COLORS.teal}>Try Again</Btn>
        </div>
      )}
    </Modal>
  );
}

// ── AI Chat Assistant ────────────────────────────────────────
const PERSONAS = {
  sales: {
    label: "Sales Coach",
    icon: "💼",
    color: COLORS.gold,
    accent: "rgba(245,166,35,0.12)",
    border: "rgba(245,166,35,0.25)",
    buildPrompt: (d) =>
      `You are an expert sales coach inside a personal dashboard app. Help the user succeed in newspaper advertising sales — print, radio, and digital products.
Current stats: Revenue $${d.sales.revenue} of $${d.sales.revenueGoal} goal (${calcPct(d.sales.revenue, d.sales.revenueGoal)}%). Calls ${d.sales.calls}/${d.sales.callsGoal}. Deals ${d.sales.deals}/${d.sales.dealsGoal}.
Pipeline: ${d.sales.pipeline.map((p) => `${p.name} ($${p.value}, ${p.stage}, ${p.product})`).join("; ")}.
Today: ${new Date().toLocaleDateString("en-US", { weekday: "long", month: "long", day: "numeric" })}.
Be concise, practical, and encouraging. Short paragraphs. Reference their real numbers.`,
    starters: [
      "What should I focus on to hit my revenue goal this month?",
      "Which pipeline leads are closest to closing?",
      "How do I pitch a print + radio bundle?",
      "Help me plan my call strategy for this week",
      "I'm behind on my goal — what should I do?"
    ]
  },
  facebook: {
    label: "FB Thumb Forecast Coach",
    icon: "📱",
    color: COLORS.blue,
    accent: "rgba(41,128,185,0.12)",
    border: "rgba(41,128,185,0.25)",
    buildPrompt: (d, fb) =>
      `You are a Facebook brand growth specialist for the Thumb Forecast page — a meteorology/weather brand by a Central Michigan University student with ${fb?.followers || "13K"} followers.
Live stats: Reach ${d.facebook.reach}/${d.facebook.reachGoal} goal. Engagement ${d.facebook.engagement}%/${d.facebook.engGoal}% goal. Posts today ${d.facebook.posts}/${d.facebook.postsGoal}.
Focus ONLY on: thumbnail strategy that stops the scroll, reach and engagement growth, content calendars, Reels strategy, posting times, and building the weather brand to attract ad sales clients. Be specific, creative, and tactical.`,
    starters: [
      "What thumbnail style gets the most clicks right now?",
      "How do I grow from 13K to 20K followers?",
      "Give me a 7-day content calendar",
      "What should my thumb image look like for a weather post?",
      "How do I turn my weather brand into ad sales leads?"
    ]
  }
};

function AIChat({ mode, dashData, fbData, onClose }) {
  const persona = PERSONAS[mode];
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const bottomRef = useRef();
  const inputRef = useRef();

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const sendMessage = async (text) => {
    const msg = text || input.trim();
    if (!msg || loading) return;
    setInput("");
    const history = [...messages, { role: "user", content: msg }];
    setMessages(history);
    setLoading(true);
    try {
      const systemPrompt = mode === "facebook"
        ? persona.buildPrompt(dashData, fbData)
        : persona.buildPrompt(dashData);
      const resp = await fetch("https://api.anthropic.com/v1/messages", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          model: "claude-sonnet-4-20250514",
          max_tokens: 1000,
          system: systemPrompt,
          messages: history.map((m) => ({ role: m.role, content: m.content }))
        })
      });
      const data = await resp.json();
      const reply = data.content?.map((c) => c.text || "").join("") || "Sorry, try again.";
      setMessages((h) => [...h, { role: "assistant", content: reply }]);
    } catch (e) {
      setMessages((h) => [...h, { role: "assistant", content: "Connection error — please try again." }]);
    }
    setLoading(false);
    setTimeout(() => inputRef.current?.focus(), 100);
  };

  return (
    <div style={{
      position: "fixed", inset: 0, background: "rgba(0,0,0,0.82)",
      zIndex: 2000, display: "flex", flexDirection: "column",
      alignItems: "center", justifyContent: "flex-end"
    }}>
      <div style={{
        width: "100%", maxWidth: 540, height: "92vh",
        display: "flex", flexDirection: "column",
        background: "#0F1118",
        borderRadius: "28px 28px 0 0",
        border: `1px solid ${persona.border}`,
        overflow: "hidden"
      }}>
        {/* Header */}
        <div style={{
          padding: "18px 20px 14px",
          background: `linear-gradient(135deg,${persona.accent},transparent)`,
          borderBottom: `1px solid ${persona.border}`,
          flexShrink: 0
        }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
            <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
              <div style={{
                width: 44, height: 44, borderRadius: 14,
                background: `linear-gradient(135deg,${persona.color},${persona.color}88)`,
                display: "flex", alignItems: "center", justifyContent: "center",
                fontSize: 22, boxShadow: `0 4px 16px ${persona.color}40`
              }}>
                {persona.icon}
              </div>
              <div>
                <div style={{ fontSize: 16, fontWeight: 800 }}>{persona.label}</div>
                <div style={{ fontSize: 11, color: "rgba(255,255,255,0.4)", marginTop: 1 }}>
                  Powered by Claude · Live data
                </div>
              </div>
            </div>
            <div style={{ display: "flex", gap: 8 }}>
              {messages.length > 0 && (
                <button onClick={() => setMessages([])} style={{
                  background: "rgba(255,255,255,0.07)",
                  border: `1px solid ${COLORS.border}`,
                  color: "rgba(255,255,255,0.4)",
                  borderRadius: 10, padding: "5px 10px",
                  cursor: "pointer", fontSize: 11, fontWeight: 600
                }}>
                  Clear
                </button>
              )}
              <button onClick={onClose} style={{
                background: "rgba(255,255,255,0.08)", border: "none",
                color: "#fff", borderRadius: 10, width: 30, height: 30,
                cursor: "pointer", fontSize: 16
              }}>
                x
              </button>
            </div>
          </div>
          {mode === "facebook" && fbData && (
            <div style={{
              marginTop: 10, padding: "6px 12px",
              background: "rgba(255,255,255,0.05)",
              border: `1px solid ${COLORS.border}`,
              borderRadius: 20, display: "inline-flex", alignItems: "center", gap: 6
            }}>
              <div style={{
                width: 6, height: 6, borderRadius: "50%",
                background: COLORS.green, boxShadow: `0 0 6px ${COLORS.green}`
              }} />
              <span style={{ fontSize: 11, color: "rgba(255,255,255,0.5)" }}>
                Live · {fbData.name} · {fbData.followers?.toLocaleString()} followers
              </span>
            </div>
          )}
        </div>

        {/* Messages */}
        <div style={{
          flex: 1, overflowY: "auto", padding: "16px 16px 8px",
          display: "flex", flexDirection: "column", gap: 12
        }}>
          {messages.length === 0 && (
            <div style={{
              flex: 1, display: "flex", flexDirection: "column",
              justifyContent: "flex-end", gap: 10
            }}>
              <div style={{ textAlign: "center", paddingBottom: 8 }}>
                <div style={{ fontSize: 32, marginBottom: 8 }}>{persona.icon}</div>
                <div style={{ fontSize: 15, fontWeight: 700, color: "rgba(255,255,255,0.7)" }}>
                  {mode === "sales"
                    ? "How can I help you crush it this month?"
                    : "How can I grow your Thumb Forecast reach?"}
                </div>
                <div style={{ fontSize: 12, color: "rgba(255,255,255,0.35)", marginTop: 4 }}>
                  I have access to your live dashboard data.
                </div>
              </div>
              {persona.starters.map((s, i) => (
                <button key={i} onClick={() => sendMessage(s)} style={{
                  textAlign: "left", padding: "12px 14px", borderRadius: 14,
                  background: persona.accent, border: `1px solid ${persona.border}`,
                  color: "rgba(255,255,255,0.75)", cursor: "pointer",
                  fontSize: 13, lineHeight: 1.4
                }}>
                  {s}
                </button>
              ))}
            </div>
          )}

          {messages.map((m, i) => (
            <div key={i} style={{
              display: "flex", flexDirection: "column",
              alignItems: m.role === "user" ? "flex-end" : "flex-start", gap: 4
            }}>
              {m.role === "assistant" && (
                <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 2 }}>
                  <div style={{
                    width: 20, height: 20, borderRadius: 6,
                    background: persona.color,
                    display: "flex", alignItems: "center", justifyContent: "center",
                    fontSize: 11
                  }}>
                    {persona.icon}
                  </div>
                  <span style={{ fontSize: 10, color: "rgba(255,255,255,0.3)", fontWeight: 600 }}>
                    {persona.label}
                  </span>
                </div>
              )}
              <div style={{
                maxWidth: "88%", padding: "12px 14px",
                borderRadius: m.role === "user" ? "18px 18px 4px 18px" : "18px 18px 18px 4px",
                background: m.role === "user"
                  ? `linear-gradient(135deg,${persona.color},${persona.color}cc)`
                  : "rgba(255,255,255,0.07)",
                border: m.role === "assistant" ? `1px solid ${COLORS.border}` : "none",
                color: m.role === "user" ? "#000" : "rgba(255,255,255,0.87)",
                fontSize: 14, lineHeight: 1.65,
                fontWeight: m.role === "user" ? 600 : 400
              }}>
                {m.content.split("\n").map((line, li) => (
                  <span key={li}>
                    {line}
                    {li < m.content.split("\n").length - 1 && <br />}
                  </span>
                ))}
              </div>
            </div>
          ))}

          {loading && (
            <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
              <div style={{
                width: 20, height: 20, borderRadius: 6, background: persona.color,
                display: "flex", alignItems: "center", justifyContent: "center", fontSize: 11
              }}>
                {persona.icon}
              </div>
              <div style={{
                padding: "12px 16px",
                borderRadius: "18px 18px 18px 4px",
                background: "rgba(255,255,255,0.07)",
                border: `1px solid ${COLORS.border}`,
                display: "flex", gap: 5, alignItems: "center"
              }}>
                <span style={{ fontSize: 14, color: "rgba(255,255,255,0.5)" }}>Thinking…</span>
              </div>
            </div>
          )}
          <div ref={bottomRef} />
        </div>

        {/* Input */}
        <div style={{
          padding: "12px 16px 20px",
          borderTop: `1px solid ${COLORS.border}`,
          flexShrink: 0, background: "rgba(0,0,0,0.3)"
        }}>
          <div style={{ display: "flex", gap: 10, alignItems: "flex-end" }}>
            <textarea
              ref={inputRef} value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter" && !e.shiftKey) {
                  e.preventDefault();
                  sendMessage();
                }
              }}
              placeholder={
                mode === "sales"
                  ? "Ask about your pipeline, goals, strategy…"
                  : "Ask about thumbnails, reach, content ideas…"
              }
              rows={1}
              style={{
                flex: 1, background: "rgba(255,255,255,0.07)",
                border: `1px solid ${COLORS.border}`,
                borderRadius: 14, padding: "12px 14px",
                color: "#EEF0F5", fontSize: 14, outline: "none",
                resize: "none", lineHeight: 1.5,
                fontFamily: "inherit", maxHeight: 100, overflowY: "auto"
              }}
            />
            <button
              onClick={() => sendMessage()}
              disabled={!input.trim() || loading}
              style={{
                width: 44, height: 44, borderRadius: 13, border: "none",
                cursor: "pointer",
                background: input.trim() && !loading ? persona.color : "rgba(255,255,255,0.08)",
                color: input.trim() && !loading ? "#000" : "rgba(255,255,255,0.3)",
                fontSize: 20, display: "flex", alignItems: "center",
                justifyContent: "center", flexShrink: 0, transition: "all 0.2s"
              }}
            >
              ↑
            </button>
          </div>
          <div style={{ fontSize: 10, color: "rgba(255,255,255,0.2)", marginTop: 8, textAlign: "center" }}>
            Enter to send · Shift+Enter for new line
          </div>
        </div>
      </div>
    </div>
  );
}

// ── App Data ─────────────────────────────────────────────────
const INITIAL_DATA = {
  steps: { current: 6240, goal: 10000, history: [4200, 7800, 9100, 5500, 8300, 6240] },
  eating: {
    calories: 1640, calGoal: 2200, protein: 88, proteinGoal: 150,
    water: 5, waterGoal: 8, history: [1800, 2100, 1500, 2300, 1950, 1640], meals: []
  },
  lifting: {
    sessions: 2, sessionsGoal: 4, history: [6200, 9800, 7100, 11200, 9500, 8400], log: []
  },
  sun: { minutes: 25, goal: 30, weekendGoal: 60, history: [0, 40, 15, 0, 20, 25] },
  facebook: {
    reach: 1840, reachGoal: 5000, engagement: 4.2, engGoal: 8,
    posts: 3, postsGoal: 5, history: [1200, 1500, 1100, 1800, 2100, 1840],
    tips: [
      "Post between 7–9 PM — your audience is most active then",
      "Reels get 3x more reach than static posts right now",
      "Add a question to your caption to boost comments",
      "Reply to every comment in the first hour after posting",
      "Bundle ad success stories into carousel posts"
    ]
  },
  sales: {
    calls: 8, callsGoal: 15, deals: 2, dealsGoal: 5,
    revenue: 1400, revenueGoal: 5000,
    history: [800, 1200, 600, 2100, 1800, 1400],
    pipeline: [
      { id: 1, name: "Riverside Auto", value: 800, stage: "Proposal", product: "Print", notes: "" },
      { id: 2, name: "Bloom Salon", value: 400, stage: "Follow-up", product: "Digital", notes: "" },
      { id: 3, name: "Cruz Law Group", value: 1200, stage: "Negotiation", product: "Radio", notes: "" },
      { id: 4, name: "Peak Gym", value: 600, stage: "New Lead", product: "Digital", notes: "" }
    ]
  },
  streak: 5
};

const STAGE_COLORS = {
  "New Lead": COLORS.blue, "Follow-up": COLORS.purple,
  "Proposal": COLORS.gold, "Negotiation": COLORS.green, "Closed": COLORS.green
};
const PRODUCT_COLORS = { Print: "#E67E22", Digital: COLORS.blue, Radio: COLORS.purple };
const ALL_STAGES = ["New Lead", "Follow-up", "Proposal", "Negotiation", "Closed"];

// ════════════════════════════════════════════════════════════
export default function App() {
  const [data, setData] = useState(INITIAL_DATA);
  const [tab, setTab] = useState("overview");
  const [modal, setModal] = useState(null);
  const [tipIdx, setTipIdx] = useState(0);
  const [toast, setToast] = useState(null);
  const [form, setForm] = useState({});
  const [showGoalEditor, setShowGoalEditor] = useState(false);
  const [showScanner, setShowScanner] = useState(false);
  const [aiMode, setAiMode] = useState(null);
  const [fbCreds, setFbCreds] = useState(null);
  const [fbLoading, setFbLoading] = useState(false);
  const [showFBConnect, setShowFBConnect] = useState(false);
  const weekend = checkWeekend();

  // Fetch live Facebook data
  useEffect(() => {
    if (!fbCreds) return;
    const fetchFB = async () => {
      setFbLoading(true);
      try {
        const url = `https://graph.facebook.com/v19.0/${fbCreds.id}/insights?metric=page_impressions_unique,page_post_engagements,page_fans&period=day&access_token=${fbCreds.token}`;
        const resp = await fetch(url);
        const json = await resp.json();
        if (json.data) {
          const imp = json.data.find((m) => m.name === "page_impressions_unique");
          const eng = json.data.find((m) => m.name === "page_post_engagements");
          const fans = json.data.find((m) => m.name === "page_fans");
          const reach = imp?.values?.slice(-1)[0]?.value || 0;
          const engCount = eng?.values?.slice(-1)[0]?.value || 0;
          const followers = fans?.values?.slice(-1)[0]?.value || fbCreds.followers || 0;
          const engRate = reach > 0 ? parseFloat(((engCount / reach) * 100).toFixed(1)) : 0;
          const hist = imp?.values?.slice(-6).map((v) => v.value) || data.facebook.history;
          setData((prev) => ({
            ...prev,
            facebook: {
              ...prev.facebook,
              reach: reach,
              engagement: engRate,
              history: hist.length >= 6 ? hist : prev.facebook.history
            }
          }));
          setFbCreds((prev) => ({ ...prev, followers }));
        }
      } catch (e) {
        console.log("FB fetch error", e);
      }
      setFbLoading(false);
    };
    fetchFB();
    const interval = setInterval(fetchFB, 5 * 60 * 1000);
    return () => clearInterval(interval);
  }, [fbCreds?.id]);

  // Rotate tips
  useEffect(() => {
    const t = setInterval(() => setTipIdx((i) => (i + 1) % data.facebook.tips.length), 6000);
    return () => clearInterval(t);
  }, []);

  const showToast = (msg) => { setToast(msg); setTimeout(() => setToast(null), 2600); };
  const openLog = (field, cur) => { setModal("log"); setForm({ field, value: String(cur) }); };

  const saveLog = () => {
    const v = parseFloat(form.value);
    if (isNaN(v)) return;
    setData((prev) => {
      const n = JSON.parse(JSON.stringify(prev));
      const [section, key] = form.field.split(".");
      n[section][key] = v;
      return n;
    });
    setModal(null); setForm({});
    showToast("Saved!");
  };

  const getGoalsForTab = () => {
    if (tab === "wellness") return [
      { key: "steps.goal", label: "Daily Steps", value: data.steps.goal, current: data.steps.current, color: COLORS.green, unit: "steps" },
      { key: "eating.calGoal", label: "Calories", value: data.eating.calGoal, current: data.eating.calories, color: COLORS.teal, unit: "kcal" },
      { key: "eating.proteinGoal", label: "Protein", value: data.eating.proteinGoal, current: data.eating.protein, color: COLORS.purple, unit: "g" },
      { key: "eating.waterGoal", label: "Water", value: data.eating.waterGoal, current: data.eating.water, color: COLORS.blue, unit: "cups" },
      { key: "lifting.sessionsGoal", label: "Lift Sessions", value: data.lifting.sessionsGoal, current: data.lifting.sessions, color: COLORS.red, unit: "sessions" },
      { key: "sun.goal", label: "Weekday Sun", value: data.sun.goal, current: data.sun.minutes, color: COLORS.sun, unit: "min" },
      { key: "sun.weekendGoal", label: "Weekend Sun", value: data.sun.weekendGoal, current: data.sun.minutes, color: COLORS.sun, unit: "min" }
    ];
    if (tab === "facebook") return [
      { key: "facebook.reachGoal", label: "Reach Goal", value: data.facebook.reachGoal, current: data.facebook.reach, color: COLORS.blue, unit: "people" },
      { key: "facebook.engGoal", label: "Engagement Goal", value: data.facebook.engGoal, current: data.facebook.engagement, color: COLORS.purple, unit: "%" },
      { key: "facebook.postsGoal", label: "Daily Posts", value: data.facebook.postsGoal, current: data.facebook.posts, color: COLORS.gold, unit: "posts" }
    ];
    if (tab === "sales") return [
      { key: "sales.callsGoal", label: "Daily Calls", value: data.sales.callsGoal, current: data.sales.calls, color: COLORS.blue, unit: "calls" },
      { key: "sales.dealsGoal", label: "Monthly Deals", value: data.sales.dealsGoal, current: data.sales.deals, color: COLORS.green, unit: "deals" },
      { key: "sales.revenueGoal", label: "Monthly Revenue", value: data.sales.revenueGoal, current: data.sales.revenue, color: COLORS.gold, unit: "$" }
    ];
    return [
      { key: "steps.goal", label: "Steps", value: data.steps.goal, current: data.steps.current, color: COLORS.green, unit: "steps" },
      { key: "eating.calGoal", label: "Calories", value: data.eating.calGoal, current: data.eating.calories, color: COLORS.teal, unit: "kcal" },
      { key: "lifting.sessionsGoal", label: "Lift Sessions", value: data.lifting.sessionsGoal, current: data.lifting.sessions, color: COLORS.red, unit: "sessions" },
      { key: "sun.goal", label: "Sun (weekday)", value: data.sun.goal, current: data.sun.minutes, color: COLORS.sun, unit: "min" },
      { key: "sales.revenueGoal", label: "Revenue", value: data.sales.revenueGoal, current: data.sales.revenue, color: COLORS.gold, unit: "$" }
    ];
  };

  const saveGoals = (vals) => {
    setData((prev) => {
      const n = JSON.parse(JSON.stringify(prev));
      Object.entries(vals).forEach(([key, val]) => {
        const v = parseFloat(val);
        if (!isNaN(v)) { const [s, k] = key.split("."); n[s][k] = v; }
      });
      return n;
    });
    setShowGoalEditor(false);
    showToast("Goals updated!");
  };

  const logMeal = (result) => {
    setData((prev) => {
      const n = JSON.parse(JSON.stringify(prev));
      n.eating.calories = Math.round(n.eating.calories + (result.calories || 0));
      n.eating.protein = Math.round(n.eating.protein + (result.protein || 0));
      n.eating.meals.unshift({
        name: result.meal, calories: result.calories,
        protein: result.protein, carbs: result.carbs, fat: result.fat,
        time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
        items: result.items || []
      });
      return n;
    });
    showToast(`Logged: ${result.meal} (${result.calories} cal)`);
  };

  const saveLead = () => {
    if (!form.name) return;
    setData((prev) => {
      const n = JSON.parse(JSON.stringify(prev));
      n.sales.pipeline.push({
        id: Date.now(), name: form.name,
        value: parseFloat(form.value) || 0,
        stage: form.stage || "New Lead",
        product: form.product || "Print",
        notes: form.notes || ""
      });
      return n;
    });
    setModal(null); setForm({});
    showToast("Lead added!");
  };

  const saveLift = () => {
    if (!form.exercise) return;
    setData((prev) => {
      const n = JSON.parse(JSON.stringify(prev));
      n.lifting.log.unshift({
        exercise: form.exercise, sets: form.sets || "",
        reps: form.reps || "", weight: form.weight || "",
        date: new Date().toLocaleDateString()
      });
      n.lifting.sessions = Math.min(n.lifting.sessions + 1, n.lifting.sessionsGoal * 2);
      return n;
    });
    setModal(null); setForm({});
    showToast("Workout logged!");
  };

  const removeLead = (id) => {
    setData((prev) => ({
      ...prev,
      sales: { ...prev.sales, pipeline: prev.sales.pipeline.filter((p) => p.id !== id) }
    }));
    showToast("Removed");
  };

  // Show FB connect screen
  if (showFBConnect) {
    return (
      <FBConnect
        onConnect={(creds) => {
          setFbCreds(creds);
          setShowFBConnect(false);
          showToast(`Connected: ${creds.name}!`);
        }}
        onSkip={() => setShowFBConnect(false)}
      />
    );
  }

  const TABS = ["overview", "wellness", "facebook", "sales"];

  return (
    <div style={{
      minHeight: "100vh", background: COLORS.bg, color: "#EEF0F5",
      fontFamily: "'Sora','DM Sans','Segoe UI',sans-serif",
      paddingBottom: 80, position: "relative", overflowX: "hidden"
    }}>
      {/* Background glows */}
      <div style={{ position: "fixed", inset: 0, pointerEvents: "none", zIndex: 0 }}>
        <div style={{
          position: "absolute", top: -140, left: -120, width: 520, height: 520,
          borderRadius: "50%",
          background: "radial-gradient(circle,rgba(245,166,35,0.07) 0%,transparent 70%)"
        }} />
        <div style={{
          position: "absolute", bottom: -80, right: -100, width: 420, height: 420,
          borderRadius: "50%",
          background: "radial-gradient(circle,rgba(41,128,185,0.06) 0%,transparent 70%)"
        }} />
      </div>

      {/* Toast */}
      {toast && (
        <div style={{
          position: "fixed", top: 18, left: "50%", transform: "translateX(-50%)",
          background: "#1C2030", border: `1px solid ${COLORS.border}`,
          borderRadius: 14, padding: "10px 22px", zIndex: 9999,
          fontSize: 13, fontWeight: 700, boxShadow: "0 8px 32px rgba(0,0,0,0.5)",
          whiteSpace: "nowrap"
        }}>
          {toast}
        </div>
      )}

      {/* Modals */}
      {showGoalEditor && (
        <GoalEditor goals={getGoalsForTab()} onSave={saveGoals} onClose={() => setShowGoalEditor(false)} />
      )}
      {showScanner && (
        <NutritionScanner onLog={logMeal} onClose={() => setShowScanner(false)} />
      )}
      {aiMode && (
        <AIChat mode={aiMode} dashData={data} fbData={fbCreds} onClose={() => setAiMode(null)} />
      )}

      {modal === "log" && (
        <Modal title="Update Value" onClose={() => setModal(null)}>
          <TextInput label="New value" type="number" value={form.value}
            onChange={(v) => setForm((f) => ({ ...f, value: v }))} />
          <div style={{ display: "flex", gap: 10 }}>
            <Btn outline color="rgba(255,255,255,0.3)" onClick={() => setModal(null)}
              style={{ flex: 1, color: "#aaa" }}>Cancel</Btn>
            <Btn onClick={saveLog} style={{ flex: 1 }}>Save</Btn>
          </div>
        </Modal>
      )}

      {modal === "lead" && (
        <Modal title="Add New Lead" onClose={() => setModal(null)}>
          <TextInput label="Business Name" value={form.name || ""}
            onChange={(v) => setForm((f) => ({ ...f, name: v }))} placeholder="e.g. Sunrise Bakery" />
          <TextInput label="Deal Value ($)" type="number" value={form.value || ""}
            onChange={(v) => setForm((f) => ({ ...f, value: v }))} placeholder="750" />
          <div style={{ marginBottom: 14 }}>
            <div style={{ fontSize: 11, color: "rgba(255,255,255,0.4)", marginBottom: 6, fontWeight: 600 }}>Product</div>
            <div style={{ display: "flex", gap: 8 }}>
              {["Print", "Digital", "Radio"].map((p) => (
                <button key={p} onClick={() => setForm((f) => ({ ...f, product: p }))} style={{
                  flex: 1, padding: "9px 0", borderRadius: 10, cursor: "pointer",
                  fontSize: 13, fontWeight: 700,
                  border: `1px solid ${form.product === p ? PRODUCT_COLORS[p] + "88" : COLORS.border}`,
                  background: form.product === p ? `${PRODUCT_COLORS[p]}20` : "rgba(255,255,255,0.04)",
                  color: form.product === p ? PRODUCT_COLORS[p] : "rgba(255,255,255,0.4)"
                }}>
                  {p}
                </button>
              ))}
            </div>
          </div>
          <div style={{ marginBottom: 14 }}>
            <div style={{ fontSize: 11, color: "rgba(255,255,255,0.4)", marginBottom: 6, fontWeight: 600 }}>Stage</div>
            <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
              {ALL_STAGES.slice(0, 4).map((s) => (
                <button key={s} onClick={() => setForm((f) => ({ ...f, stage: s }))} style={{
                  padding: "7px 14px", borderRadius: 10, cursor: "pointer",
                  fontSize: 12, fontWeight: 700,
                  border: `1px solid ${form.stage === s ? STAGE_COLORS[s] + "88" : COLORS.border}`,
                  background: form.stage === s ? `${STAGE_COLORS[s]}20` : "rgba(255,255,255,0.04)",
                  color: form.stage === s ? STAGE_COLORS[s] : "rgba(255,255,255,0.4)"
                }}>
                  {s}
                </button>
              ))}
            </div>
          </div>
          <TextInput label="Notes" value={form.notes || ""}
            onChange={(v) => setForm((f) => ({ ...f, notes: v }))} placeholder="Any details..." />
          <div style={{ display: "flex", gap: 10 }}>
            <Btn outline color="rgba(255,255,255,0.3)" onClick={() => setModal(null)}
              style={{ flex: 1, color: "#aaa" }}>Cancel</Btn>
            <Btn onClick={saveLead} style={{ flex: 1 }}>Add Lead</Btn>
          </div>
        </Modal>
      )}

      {modal === "lift" && (
        <Modal title="Log Workout" onClose={() => setModal(null)}>
          <TextInput label="Exercise" value={form.exercise || ""}
            onChange={(v) => setForm((f) => ({ ...f, exercise: v }))} placeholder="e.g. Bench Press" />
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 10, marginBottom: 14 }}>
            {[["Sets", "sets", "3"], ["Reps", "reps", "10"], ["lbs", "weight", "135"]].map(([lbl, key, ph]) => (
              <div key={key}>
                <div style={{ fontSize: 11, color: "rgba(255,255,255,0.4)", marginBottom: 5, fontWeight: 600 }}>
                  {lbl}
                </div>
                <input type="number" value={form[key] || ""}
                  onChange={(e) => setForm((f) => ({ ...f, [key]: e.target.value }))}
                  placeholder={ph} style={{
                    width: "100%", background: "rgba(255,255,255,0.06)",
                    border: `1px solid ${COLORS.border}`, borderRadius: 10,
                    padding: "11px 10px", color: "#EEF0F5",
                    fontSize: 14, outline: "none", boxSizing: "border-box"
                  }} />
              </div>
            ))}
          </div>
          <div style={{ display: "flex", gap: 10 }}>
            <Btn outline color="rgba(255,255,255,0.3)" onClick={() => setModal(null)}
              style={{ flex: 1, color: "#aaa" }}>Cancel</Btn>
            <Btn onClick={saveLift} color={COLORS.red} style={{ flex: 1 }}>Log It</Btn>
          </div>
        </Modal>
      )}

      {/* ── HEADER ── */}
      <div style={{ position: "relative", zIndex: 1, padding: "26px 18px 0" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
          <div>
            <div style={{
              fontSize: 10, fontWeight: 700, color: COLORS.gold,
              letterSpacing: 2.5, textTransform: "uppercase", marginBottom: 3
            }}>
              Command Center
            </div>
            <div style={{ fontSize: 24, fontWeight: 800, letterSpacing: -0.5 }}>
              {weekend ? "Weekend Warrior! ☀️" : "Let's get it. 🚀"}
            </div>
            <div style={{ fontSize: 12, color: "rgba(255,255,255,0.35)", marginTop: 2 }}>
              {new Date().toLocaleDateString("en-US", { weekday: "long", month: "long", day: "numeric" })}
            </div>
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: 6, alignItems: "flex-end" }}>
            <div style={{
              display: "flex", alignItems: "center", gap: 5,
              background: "rgba(245,166,35,0.12)",
              border: `1px solid ${COLORS.gold}33`, borderRadius: 20, padding: "6px 12px"
            }}>
              <span style={{ fontSize: 16 }}>🔥</span>
              <span style={{ fontSize: 13, fontWeight: 800, color: COLORS.gold }}>{data.streak}d</span>
            </div>
            <button onClick={() => setShowGoalEditor(true)} style={{
              background: "rgba(255,255,255,0.06)",
              border: `1px solid ${COLORS.border}`,
              borderRadius: 20, padding: "5px 12px",
              color: "rgba(255,255,255,0.55)", fontSize: 11,
              fontWeight: 700, cursor: "pointer"
            }}>
              🎯 Edit Goals
            </button>
          </div>
        </div>

        {/* FB Live Bar */}
        {fbCreds ? (
          <div style={{
            marginTop: 14, padding: "10px 14px",
            background: "rgba(39,174,96,0.08)",
            border: `1px solid ${COLORS.green}25`,
            borderRadius: 14, display: "flex",
            justifyContent: "space-between", alignItems: "center"
          }}>
            <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
              <div style={{
                width: 8, height: 8, borderRadius: "50%",
                background: fbLoading ? "#F39C12" : COLORS.green,
                boxShadow: `0 0 8px ${fbLoading ? "#F39C12" : COLORS.green}`
              }} />
              <span style={{ fontSize: 12, fontWeight: 700, color: fbLoading ? "#F39C12" : COLORS.green }}>
                {fbLoading ? "Syncing…" : "Live"}
              </span>
              <span style={{ fontSize: 12, color: "rgba(255,255,255,0.5)" }}>
                · {fbCreds.name} · {fbCreds.followers?.toLocaleString()} followers
              </span>
            </div>
            <button onClick={() => setShowFBConnect(true)} style={{
              fontSize: 10, color: "rgba(255,255,255,0.3)",
              background: "none", border: "none", cursor: "pointer", fontWeight: 600
            }}>
              Reconnect
            </button>
          </div>
        ) : (
          <button onClick={() => setShowFBConnect(true)} style={{
            marginTop: 14, width: "100%", padding: "12px 16px", borderRadius: 14,
            background: "rgba(41,128,185,0.1)",
            border: `2px dashed ${COLORS.blue}44`,
            color: COLORS.blue, cursor: "pointer", fontSize: 13, fontWeight: 700,
            display: "flex", alignItems: "center", justifyContent: "center", gap: 8
          }}>
            <span style={{ fontSize: 18 }}>📱</span> Connect Thumb Forecast · Live Data
          </button>
        )}

        {/* AI Launchers */}
        <div style={{ display: "flex", gap: 10, marginTop: 12 }}>
          <button onClick={() => setAiMode("sales")} style={{
            flex: 1, display: "flex", alignItems: "center", gap: 8,
            padding: "11px 14px", borderRadius: 14,
            background: "rgba(245,166,35,0.1)",
            border: `1px solid ${COLORS.gold}35`,
            color: COLORS.gold, cursor: "pointer", fontSize: 13, fontWeight: 700
          }}>
            <span style={{ fontSize: 18 }}>💼</span>
            <div style={{ textAlign: "left" }}>
              <div style={{ fontSize: 12, fontWeight: 800 }}>Sales Coach</div>
              <div style={{ fontSize: 10, color: "rgba(255,255,255,0.4)", fontWeight: 400 }}>Pipeline · Strategy</div>
            </div>
            <span style={{ marginLeft: "auto", fontSize: 16, opacity: 0.5 }}>›</span>
          </button>
          <button onClick={() => setAiMode("facebook")} style={{
            flex: 1, display: "flex", alignItems: "center", gap: 8,
            padding: "11px 14px", borderRadius: 14,
            background: "rgba(41,128,185,0.1)",
            border: `1px solid ${COLORS.blue}35`,
            color: COLORS.blue, cursor: "pointer", fontSize: 13, fontWeight: 700
          }}>
            <span style={{ fontSize: 18 }}>📱</span>
            <div style={{ textAlign: "left" }}>
              <div style={{ fontSize: 12, fontWeight: 800 }}>Thumb Coach</div>
              <div style={{ fontSize: 10, color: "rgba(255,255,255,0.4)", fontWeight: 400 }}>Reach · Growth</div>
            </div>
            <span style={{ marginLeft: "auto", fontSize: 16, opacity: 0.5 }}>›</span>
          </button>
        </div>

        {/* Tabs */}
        <div style={{ display: "flex", gap: 8, marginTop: 16, overflowX: "auto", paddingBottom: 2 }}>
          {TABS.map((t) => (
            <button key={t} onClick={() => setTab(t)} style={{
              padding: "8px 16px", borderRadius: 30, border: "none",
              cursor: "pointer", fontSize: 12, fontWeight: 700, whiteSpace: "nowrap",
              background: tab === t ? COLORS.gold : "rgba(255,255,255,0.06)",
              color: tab === t ? "#000" : "rgba(255,255,255,0.5)",
              transition: "all 0.2s"
            }}>
              {t.charAt(0).toUpperCase() + t.slice(1)}
            </button>
          ))}
        </div>
      </div>

      {/* ── CONTENT ── */}
      <div style={{ position: "relative", zIndex: 1, padding: "18px 16px 0" }}>

        {/* OVERVIEW */}
        {tab === "overview" && (
          <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(5,1fr)", gap: 8 }}>
              {[
                { label: "Steps", p: calcPct(data.steps.current, data.steps.goal), color: COLORS.green },
                { label: "Eating", p: calcPct(data.eating.calories, data.eating.calGoal), color: COLORS.teal },
                { label: "Lifting", p: calcPct(data.lifting.sessions, data.lifting.sessionsGoal), color: COLORS.red },
                { label: "☀️", p: calcPct(data.sun.minutes, weekend ? data.sun.weekendGoal : data.sun.goal), color: COLORS.sun },
                { label: "Sales", p: calcPct(data.sales.revenue, data.sales.revenueGoal), color: COLORS.gold }
              ].map(({ label, p, color }) => (
                <Card key={label} style={{ padding: "12px 6px", display: "flex", flexDirection: "column", alignItems: "center", gap: 6 }}>
                  <Ring pct={p} size={54} stroke={6} color={color} />
                  <div style={{ fontSize: 9, color: "rgba(255,255,255,0.35)", textAlign: "center" }}>{label}</div>
                </Card>
              ))}
            </div>

            <Card style={{ borderLeft: `3px solid ${COLORS.blue}` }}>
              <div style={{ fontSize: 9, fontWeight: 700, color: COLORS.blue, letterSpacing: 2, textTransform: "uppercase", marginBottom: 6 }}>
                💡 Facebook Tip
              </div>
              <div style={{ fontSize: 13, lineHeight: 1.6, color: "rgba(255,255,255,0.75)" }}>
                {data.facebook.tips[tipIdx]}
              </div>
            </Card>

            <Card>
              <div style={{ fontSize: 10, fontWeight: 700, color: "rgba(255,255,255,0.4)", letterSpacing: 1.5, textTransform: "uppercase", marginBottom: 14 }}>
                Today's Targets
              </div>
              {[
                { done: data.steps.current >= data.steps.goal, label: `${data.steps.goal.toLocaleString()} steps`, color: COLORS.green },
                { done: data.eating.protein >= data.eating.proteinGoal, label: `${data.eating.proteinGoal}g protein`, color: COLORS.teal },
                { done: data.lifting.sessions >= data.lifting.sessionsGoal, label: `${data.lifting.sessionsGoal} lift sessions`, color: COLORS.red },
                { done: data.sun.minutes >= (weekend ? data.sun.weekendGoal : data.sun.goal), label: `${weekend ? data.sun.weekendGoal : data.sun.goal} min outside`, color: COLORS.sun },
                { done: data.sales.calls >= data.sales.callsGoal, label: `${data.sales.callsGoal} sales calls`, color: COLORS.gold },
                { done: data.facebook.posts >= data.facebook.postsGoal, label: `${data.facebook.postsGoal} Facebook posts`, color: COLORS.blue }
              ].map(({ done, label, color }) => (
                <div key={label} style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 10 }}>
                  <div style={{
                    width: 22, height: 22, borderRadius: 6, flexShrink: 0,
                    border: `2px solid ${done ? color : "rgba(255,255,255,0.14)"}`,
                    background: done ? color : "transparent",
                    display: "flex", alignItems: "center", justifyContent: "center"
                  }}>
                    {done && <span style={{ fontSize: 11, color: "#000" }}>✓</span>}
                  </div>
                  <span style={{
                    fontSize: 13,
                    color: done ? "rgba(255,255,255,0.9)" : "rgba(255,255,255,0.4)",
                    textDecoration: done ? "line-through" : "none"
                  }}>
                    {label}
                  </span>
                </div>
              ))}
            </Card>

            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
              <Card onClick={() => setAiMode("sales")} style={{ cursor: "pointer", borderBottom: `2px solid ${COLORS.gold}44` }}>
                <div style={{ fontSize: 10, color: "rgba(255,255,255,0.4)", marginBottom: 4 }}>💰 Revenue</div>
                <div style={{ fontSize: 22, fontWeight: 800, color: COLORS.gold }}>{fmtMoney(data.sales.revenue)}</div>
                <ProgressBar value={data.sales.revenue} goal={data.sales.revenueGoal} color={COLORS.gold} />
                <div style={{ fontSize: 9, color: `${COLORS.gold}88`, marginTop: 6 }}>Tap → Sales Coach</div>
              </Card>
              <Card onClick={() => setAiMode("facebook")} style={{ cursor: "pointer", borderBottom: `2px solid ${COLORS.blue}44` }}>
                <div style={{ fontSize: 10, color: "rgba(255,255,255,0.4)", marginBottom: 4 }}>
                  📱 {fbCreds ? "Live Reach" : "FB Reach"}
                </div>
                <div style={{ fontSize: 22, fontWeight: 800, color: COLORS.blue }}>
                  {fmtThousand(data.facebook.reach)}
                  {fbLoading && <span style={{ fontSize: 12, marginLeft: 6 }}>🔄</span>}
                </div>
                <ProgressBar value={data.facebook.reach} goal={data.facebook.reachGoal} color={COLORS.blue} />
                <div style={{ fontSize: 9, color: `${COLORS.blue}88`, marginTop: 6 }}>Tap → Thumb Coach</div>
              </Card>
            </div>
          </div>
        )}

        {/* WELLNESS */}
        {tab === "wellness" && (
          <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
            <button onClick={() => setShowGoalEditor(true)} style={{
              display: "flex", alignItems: "center", justifyContent: "center", gap: 8,
              padding: "10px", borderRadius: 14,
              background: "rgba(245,166,35,0.08)", border: `1px solid ${COLORS.gold}30`,
              color: COLORS.gold, cursor: "pointer", fontSize: 13, fontWeight: 700
            }}>
              🎯 Edit Wellness Goals
            </button>

            {/* Steps */}
            <Card>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <div>
                  <div style={{ fontSize: 10, color: "rgba(255,255,255,0.4)", marginBottom: 2, fontWeight: 700, letterSpacing: 1, textTransform: "uppercase" }}>
                    👟 Daily Steps
                  </div>
                  <div style={{ fontSize: 38, fontWeight: 800, color: COLORS.green, letterSpacing: -1 }}>
                    {data.steps.current.toLocaleString()}
                  </div>
                  <div style={{ fontSize: 12, color: "rgba(255,255,255,0.35)" }}>
                    Goal {data.steps.goal.toLocaleString()}
                  </div>
                </div>
                <Ring pct={calcPct(data.steps.current, data.steps.goal)} size={80} stroke={8} color={COLORS.green} />
              </div>
              <BarChart values={data.steps.history} color={COLORS.green} h={44} />
              <div style={{ display: "flex", gap: 8, marginTop: 12 }}>
                <Btn outline color={COLORS.green} onClick={() => openLog("steps.current", data.steps.current)} style={{ flex: 1 }}>
                  + Log Steps
                </Btn>
                <Btn outline color="rgba(255,255,255,0.3)" onClick={() => setShowGoalEditor(true)}
                  style={{ flex: 1, color: "rgba(255,255,255,0.45)", fontSize: 12 }}>
                  ✏️ Goal
                </Btn>
              </div>
            </Card>

            {/* Nutrition */}
            <Card>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12 }}>
                <div style={{ fontSize: 10, fontWeight: 700, color: "rgba(255,255,255,0.4)", letterSpacing: 1, textTransform: "uppercase" }}>
                  🥗 Nutrition
                </div>
                <button onClick={() => setShowScanner(true)} style={{
                  display: "flex", alignItems: "center", gap: 6, padding: "7px 12px",
                  borderRadius: 12, background: "rgba(22,160,133,0.15)",
                  border: `1px solid ${COLORS.teal}44`, color: COLORS.teal,
                  cursor: "pointer", fontSize: 12, fontWeight: 700
                }}>
                  📸 Scan Meal
                </button>
              </div>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 10, marginBottom: 12 }}>
                {[
                  { label: "Calories", v: data.eating.calories, g: data.eating.calGoal, color: COLORS.teal, unit: "kcal", key: "eating.calories" },
                  { label: "Protein", v: data.eating.protein, g: data.eating.proteinGoal, color: COLORS.purple, unit: "g", key: "eating.protein" },
                  { label: "Water", v: data.eating.water, g: data.eating.waterGoal, color: COLORS.blue, unit: "cups", key: "eating.water" }
                ].map(({ label, v, g, color, unit, key }) => (
                  <div key={label} onClick={() => openLog(key, v)} style={{
                    background: "rgba(255,255,255,0.03)", border: `1px solid ${COLORS.border}`,
                    borderRadius: 12, padding: "12px 10px", cursor: "pointer", textAlign: "center"
                  }}>
                    <div style={{ fontSize: 9, color: "rgba(255,255,255,0.35)", marginBottom: 4 }}>{label}</div>
                    <div style={{ fontSize: 20, fontWeight: 800, color }}>{v}</div>
                    <div style={{ fontSize: 9, color: "rgba(255,255,255,0.25)" }}>/ {g} {unit}</div>
                    <ProgressBar value={v} goal={g} color={color} />
                  </div>
                ))}
              </div>
              <BarChart values={data.eating.history} color={COLORS.teal} h={36} />
              {data.eating.meals.length > 0 ? (
                <div style={{ marginTop: 14 }}>
                  <div style={{ fontSize: 10, fontWeight: 700, color: "rgba(255,255,255,0.35)", letterSpacing: 1, textTransform: "uppercase", marginBottom: 8 }}>
                    Today's Meals
                  </div>
                  {data.eating.meals.map((m, i) => (
                    <div key={i} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "8px 0", borderBottom: "1px solid rgba(255,255,255,0.05)" }}>
                      <div>
                        <div style={{ fontSize: 13, fontWeight: 600 }}>{m.name}</div>
                        <div style={{ fontSize: 11, color: "rgba(255,255,255,0.3)" }}>
                          P:{m.protein}g · C:{m.carbs}g · F:{m.fat}g · {m.time}
                        </div>
                      </div>
                      <div style={{ fontSize: 14, fontWeight: 800, color: COLORS.teal }}>{m.calories} cal</div>
                    </div>
                  ))}
                </div>
              ) : (
                <div style={{ marginTop: 12, textAlign: "center", padding: "16px 0", borderTop: "1px solid rgba(255,255,255,0.05)" }}>
                  <div style={{ fontSize: 28, marginBottom: 6 }}>📸</div>
                  <div style={{ fontSize: 13, color: "rgba(255,255,255,0.35)" }}>
                    Tap <b style={{ color: COLORS.teal }}>Scan Meal</b> to log food with AI
                  </div>
                </div>
              )}
            </Card>

            {/* Lifting */}
            <Card>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 14 }}>
                <div>
                  <div style={{ fontSize: 10, fontWeight: 700, color: "rgba(255,255,255,0.4)", letterSpacing: 1, textTransform: "uppercase", marginBottom: 2 }}>
                    🏋️ Lifting
                  </div>
                  <div style={{ fontSize: 28, fontWeight: 800, color: COLORS.red }}>
                    {data.lifting.sessions}
                    <span style={{ fontSize: 13, color: "rgba(255,255,255,0.3)" }}>/{data.lifting.sessionsGoal} sessions</span>
                  </div>
                </div>
                <Ring pct={calcPct(data.lifting.sessions, data.lifting.sessionsGoal)} size={70} stroke={7} color={COLORS.red} />
              </div>
              <BarChart values={data.lifting.history} color={COLORS.red} h={40} />
              <div style={{ display: "flex", gap: 8, marginTop: 12 }}>
                <Btn onClick={() => setModal("lift")} color={COLORS.red} style={{ flex: 1 }}>+ Log Workout</Btn>
                <Btn outline color="rgba(255,255,255,0.3)" onClick={() => setShowGoalEditor(true)}
                  style={{ flex: 1, color: "rgba(255,255,255,0.45)", fontSize: 12 }}>
                  ✏️ Goal
                </Btn>
              </div>
              {data.lifting.log.slice(0, 4).map((l, i) => (
                <div key={i} style={{ display: "flex", justifyContent: "space-between", padding: "8px 0", borderBottom: "1px solid rgba(255,255,255,0.05)" }}>
                  <div style={{ fontSize: 13, fontWeight: 600 }}>{l.exercise}</div>
                  <div style={{ fontSize: 12, color: "rgba(255,255,255,0.4)" }}>{l.sets}x{l.reps} @ {l.weight}lbs</div>
                </div>
              ))}
            </Card>

            {/* Sun */}
            <Card style={{ borderLeft: `3px solid ${COLORS.sun}` }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <div>
                  <div style={{ fontSize: 10, fontWeight: 700, color: "rgba(255,255,255,0.4)", letterSpacing: 1, textTransform: "uppercase", marginBottom: 2 }}>
                    ☀️ Outside Time{weekend ? " (Weekend!)" : ""}
                  </div>
                  <div style={{ fontSize: 36, fontWeight: 800, color: COLORS.sun }}>
                    {data.sun.minutes}<span style={{ fontSize: 14, color: "rgba(255,255,255,0.35)" }}>min</span>
                  </div>
                  <div style={{ fontSize: 12, color: "rgba(255,255,255,0.35)" }}>
                    Goal: {weekend ? data.sun.weekendGoal : data.sun.goal} min
                  </div>
                </div>
                <Ring pct={calcPct(data.sun.minutes, weekend ? data.sun.weekendGoal : data.sun.goal)} size={78} stroke={8} color={COLORS.sun} />
              </div>
              <BarChart values={data.sun.history} color={COLORS.sun} h={36} />
              <div style={{ display: "flex", gap: 8, marginTop: 12 }}>
                <Btn outline color={COLORS.sun} onClick={() => openLog("sun.minutes", data.sun.minutes)} style={{ flex: 1 }}>
                  + Log Sun Time
                </Btn>
                <Btn outline color="rgba(255,255,255,0.3)" onClick={() => setShowGoalEditor(true)}
                  style={{ flex: 1, color: "rgba(255,255,255,0.45)", fontSize: 12 }}>
                  ✏️ Goal
                </Btn>
              </div>
            </Card>
          </div>
        )}

        {/* FACEBOOK */}
        {tab === "facebook" && (
          <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
            {!fbCreds ? (
              <button onClick={() => setShowFBConnect(true)} style={{
                padding: "20px", borderRadius: 18,
                background: "rgba(41,128,185,0.1)",
                border: `2px dashed ${COLORS.blue}44`,
                color: COLORS.blue, cursor: "pointer",
                fontSize: 14, fontWeight: 700, textAlign: "center"
              }}>
                <div style={{ fontSize: 32, marginBottom: 8 }}>📱</div>
                <div>Connect Thumb Forecast</div>
                <div style={{ fontSize: 12, color: "rgba(255,255,255,0.4)", marginTop: 4, fontWeight: 400 }}>
                  Tap to enter your Page ID and Access Token
                </div>
              </button>
            ) : (
              <div style={{
                padding: "12px 16px", background: "rgba(39,174,96,0.08)",
                border: `1px solid ${COLORS.green}25`, borderRadius: 14,
                display: "flex", justifyContent: "space-between", alignItems: "center"
              }}>
                <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                  <div style={{
                    width: 8, height: 8, borderRadius: "50%",
                    background: fbLoading ? "#F39C12" : COLORS.green,
                    boxShadow: `0 0 8px ${fbLoading ? "#F39C12" : COLORS.green}`
                  }} />
                  <span style={{ fontSize: 13, fontWeight: 700, color: fbLoading ? "#F39C12" : COLORS.green }}>
                    {fbLoading ? "Syncing…" : "Live Data"}
                  </span>
                  <span style={{ fontSize: 12, color: "rgba(255,255,255,0.5)" }}>
                    · {fbCreds.followers?.toLocaleString()} followers
                  </span>
                </div>
                <button onClick={() => setShowFBConnect(true)} style={{
                  fontSize: 11, color: COLORS.blue, background: "none",
                  border: "none", cursor: "pointer", fontWeight: 600
                }}>
                  Reconnect
                </button>
              </div>
            )}

            <button onClick={() => setAiMode("facebook")} style={{
              display: "flex", alignItems: "center", gap: 12, padding: "14px 16px",
              borderRadius: 16, background: "rgba(41,128,185,0.12)",
              border: `1px solid ${COLORS.blue}40`, cursor: "pointer"
            }}>
              <div style={{
                width: 40, height: 40, borderRadius: 12,
                background: `linear-gradient(135deg,${COLORS.blue},${COLORS.purple})`,
                display: "flex", alignItems: "center", justifyContent: "center",
                fontSize: 20, flexShrink: 0
              }}>
                📱
              </div>
              <div style={{ textAlign: "left" }}>
                <div style={{ fontSize: 14, fontWeight: 800, color: COLORS.blue }}>FB Thumb Forecast Coach</div>
                <div style={{ fontSize: 12, color: "rgba(255,255,255,0.4)" }}>
                  Ask about thumbnails, reach growth, content strategy
                </div>
              </div>
              <span style={{ marginLeft: "auto", fontSize: 20, color: COLORS.blue, opacity: 0.6 }}>›</span>
            </button>

            <button onClick={() => setShowGoalEditor(true)} style={{
              display: "flex", alignItems: "center", justifyContent: "center", gap: 8,
              padding: "10px", borderRadius: 14,
              background: "rgba(245,166,35,0.08)", border: `1px solid ${COLORS.gold}30`,
              color: COLORS.gold, cursor: "pointer", fontSize: 13, fontWeight: 700
            }}>
              🎯 Edit Facebook Goals
            </button>

            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
              {[
                { label: "Reach", v: data.facebook.reach, g: data.facebook.reachGoal, color: COLORS.blue, key: "facebook.reach", live: !!fbCreds },
                { label: "Engagement", v: data.facebook.engagement, g: data.facebook.engGoal, color: COLORS.purple, key: "facebook.engagement", sfx: "%" },
                { label: "Posts Today", v: data.facebook.posts, g: data.facebook.postsGoal, color: COLORS.gold, key: "facebook.posts" },
                { label: "Followers", v: fbCreds?.followers || 13000, g: 20000, color: COLORS.green, key: null, live: !!fbCreds }
              ].map(({ label, v, g, color, key, sfx = "", live }) => (
                <Card key={label} onClick={key ? () => openLog(key, v) : null}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 3 }}>
                    <div style={{ fontSize: 10, color: "rgba(255,255,255,0.4)" }}>{label}</div>
                    {live && <div style={{ width: 6, height: 6, borderRadius: "50%", background: COLORS.green, boxShadow: `0 0 4px ${COLORS.green}` }} />}
                  </div>
                  <div style={{ fontSize: 26, fontWeight: 800, color }}>{fmtThousand(v)}{sfx}</div>
                  <div style={{ fontSize: 10, color: "rgba(255,255,255,0.25)", marginBottom: 4 }}>/ {fmtThousand(g)}{sfx}</div>
                  <ProgressBar value={v} goal={g} color={color} />
                </Card>
              ))}
            </div>

            <Card>
              <div style={{ fontSize: 10, fontWeight: 700, color: "rgba(255,255,255,0.4)", letterSpacing: 1, textTransform: "uppercase", marginBottom: 10 }}>
                Reach — 6 Day Trend {fbCreds ? "(Live)" : ""}
              </div>
              <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 5 }}>
                {DAY_LABELS.map((d) => (
                  <div key={d} style={{ flex: 1, textAlign: "center", fontSize: 10, color: "rgba(255,255,255,0.3)" }}>{d}</div>
                ))}
              </div>
              <BarChart values={data.facebook.history} color={COLORS.blue} h={52} />
            </Card>

            <Card style={{ borderLeft: `3px solid ${COLORS.purple}` }}>
              <div style={{ fontSize: 9, fontWeight: 700, color: COLORS.purple, letterSpacing: 2, textTransform: "uppercase", marginBottom: 12 }}>
                Thumb Strategy Tips
              </div>
              {data.facebook.tips.map((tip, i) => (
                <div key={i} style={{ display: "flex", gap: 10, alignItems: "flex-start", marginBottom: 10 }}>
                  <div style={{
                    width: 20, height: 20, borderRadius: "50%",
                    background: `${COLORS.purple}22`, border: `1px solid ${COLORS.purple}44`,
                    display: "flex", alignItems: "center", justifyContent: "center",
                    fontSize: 9, color: COLORS.purple, flexShrink: 0, fontWeight: 800
                  }}>
                    {i + 1}
                  </div>
                  <div style={{ fontSize: 13, color: "rgba(255,255,255,0.7)", lineHeight: 1.5 }}>{tip}</div>
                </div>
              ))}
            </Card>
          </div>
        )}

        {/* SALES */}
        {tab === "sales" && (
          <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
            <button onClick={() => setAiMode("sales")} style={{
              display: "flex", alignItems: "center", gap: 12, padding: "14px 16px",
              borderRadius: 16, background: "rgba(245,166,35,0.1)",
              border: `1px solid ${COLORS.gold}40`, cursor: "pointer"
            }}>
              <div style={{
                width: 40, height: 40, borderRadius: 12,
                background: `linear-gradient(135deg,${COLORS.gold},${COLORS.gold}88)`,
                display: "flex", alignItems: "center", justifyContent: "center",
                fontSize: 20, flexShrink: 0
              }}>
                💼
              </div>
              <div style={{ textAlign: "left" }}>
                <div style={{ fontSize: 14, fontWeight: 800, color: COLORS.gold }}>Sales Coach AI</div>
                <div style={{ fontSize: 12, color: "rgba(255,255,255,0.4)" }}>
                  Discuss your pipeline, monthly goals, and strategy
                </div>
              </div>
              <span style={{ marginLeft: "auto", fontSize: 20, color: COLORS.gold, opacity: 0.6 }}>›</span>
            </button>

            <button onClick={() => setShowGoalEditor(true)} style={{
              display: "flex", alignItems: "center", justifyContent: "center", gap: 8,
              padding: "10px", borderRadius: 14,
              background: "rgba(245,166,35,0.08)", border: `1px solid ${COLORS.gold}30`,
              color: COLORS.gold, cursor: "pointer", fontSize: 13, fontWeight: 700
            }}>
              🎯 Edit Sales Goals
            </button>

            <Card>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <div>
                  <div style={{ fontSize: 10, color: "rgba(255,255,255,0.4)", marginBottom: 2 }}>💰 MONTHLY REVENUE</div>
                  <div style={{ fontSize: 38, fontWeight: 800, color: COLORS.gold, letterSpacing: -1 }}>
                    {fmtMoney(data.sales.revenue)}
                  </div>
                  <div style={{ fontSize: 12, color: "rgba(255,255,255,0.35)" }}>
                    Goal {fmtMoney(data.sales.revenueGoal)}
                  </div>
                </div>
                <Ring pct={calcPct(data.sales.revenue, data.sales.revenueGoal)} size={82} stroke={9} color={COLORS.gold} />
              </div>
              <div style={{ display: "flex", gap: 8, marginTop: 14 }}>
                <Btn onClick={() => openLog("sales.revenue", data.sales.revenue)} style={{ flex: 1 }}>💵 Revenue</Btn>
                <Btn outline color={COLORS.gold} onClick={() => openLog("sales.calls", data.sales.calls)} style={{ flex: 1 }}>📞 Calls</Btn>
                <Btn outline color={COLORS.gold} onClick={() => openLog("sales.deals", data.sales.deals)} style={{ flex: 1 }}>🤝 Deals</Btn>
              </div>
            </Card>

            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 10 }}>
              {[
                { label: "Calls", v: data.sales.calls, g: data.sales.callsGoal, color: COLORS.blue },
                { label: "Deals", v: data.sales.deals, g: data.sales.dealsGoal, color: COLORS.green },
                { label: "Close%", v: `${data.sales.calls > 0 ? Math.round((data.sales.deals / data.sales.calls) * 100) : 0}%`, g: "25%", color: COLORS.purple }
              ].map(({ label, v, g, color }) => (
                <Card key={label} style={{ padding: "14px 10px" }}>
                  <div style={{ fontSize: 9, color: "rgba(255,255,255,0.35)", marginBottom: 3 }}>{label}</div>
                  <div style={{ fontSize: 24, fontWeight: 800, color }}>{v}</div>
                  <div style={{ fontSize: 9, color: "rgba(255,255,255,0.25)" }}>goal {g}</div>
                </Card>
              ))}
            </div>

            <Card>
              <div style={{ fontSize: 10, fontWeight: 700, color: "rgba(255,255,255,0.4)", letterSpacing: 1, textTransform: "uppercase", marginBottom: 10 }}>
                Revenue Trend
              </div>
              <BarChart values={data.sales.history} color={COLORS.gold} h={48} />
            </Card>

            <Card>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 14 }}>
                <div style={{ fontSize: 10, fontWeight: 700, color: "rgba(255,255,255,0.4)", letterSpacing: 1, textTransform: "uppercase" }}>
                  Pipeline ({data.sales.pipeline.length})
                </div>
                <Btn onClick={() => { setModal("lead"); setForm({ stage: "New Lead", product: "Print" }); }}
                  style={{ padding: "7px 14px", fontSize: 12 }}>
                  + Add Lead
                </Btn>
              </div>
              {data.sales.pipeline.map((p, i) => (
                <div key={p.id} style={{
                  display: "flex", justifyContent: "space-between", alignItems: "center",
                  padding: "10px 0",
                  borderBottom: i < data.sales.pipeline.length - 1 ? "1px solid rgba(255,255,255,0.06)" : "none"
                }}>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontSize: 14, fontWeight: 600 }}>{p.name}</div>
                    {p.notes && <div style={{ fontSize: 11, color: "rgba(255,255,255,0.3)", marginTop: 1 }}>{p.notes}</div>}
                    <div style={{ display: "flex", gap: 6, marginTop: 5 }}>
                      <Tag label={p.stage} color={STAGE_COLORS[p.stage] || COLORS.gold} />
                      <Tag label={p.product} color={PRODUCT_COLORS[p.product] || COLORS.blue} />
                    </div>
                  </div>
                  <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                    <div style={{ fontSize: 15, fontWeight: 800, color: COLORS.gold }}>{fmtMoney(p.value)}</div>
                    <button onClick={() => removeLead(p.id)} style={{
                      background: "rgba(231,76,60,0.1)", border: `1px solid ${COLORS.red}30`,
                      color: COLORS.red, borderRadius: 8, width: 26, height: 26,
                      cursor: "pointer", fontSize: 13
                    }}>
                      x
                    </button>
                  </div>
                </div>
              ))}
              <div style={{ marginTop: 12, paddingTop: 12, borderTop: "1px solid rgba(255,255,255,0.06)", display: "flex", justifyContent: "space-between" }}>
                <div style={{ fontSize: 12, color: "rgba(255,255,255,0.4)" }}>Total Pipeline</div>
                <div style={{ fontSize: 16, fontWeight: 800, color: COLORS.green }}>
                  {fmtMoney(data.sales.pipeline.reduce((a, p) => a + p.value, 0))}
                </div>
              </div>
            </Card>
          </div>
        )}

      </div>
    </div>
  );
}
