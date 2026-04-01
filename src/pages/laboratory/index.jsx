import { useState, useEffect } from "react";
import { useCreateLabAccountMutation, useGetlaboratoriesQuery } from "../../api/laboratory";


const statusConfig = {
  Active:    { dot: "#22c55e", bg: "#f0fdf4", text: "#15803d", label: "Active" },
  Pending:   { dot: "#f59e0b", bg: "#fffbeb", text: "#b45309", label: "Pending" },
  Suspended: { dot: "#ef4444", bg: "#fef2f2", text: "#b91c1c", label: "Suspended" },
  Inactive:  { dot: "#94a3b8", bg: "#f8fafc", text: "#475569", label: "Inactive" },
};

function randomPass() {
  return Math.random().toString(36).slice(2, 10) + Math.random().toString(36).slice(2, 4).toUpperCase() + "!";
}

function timeAgo(iso) {
  if (!iso) return "Never";
  const diff = Date.now() - new Date(iso).getTime();
  const d = Math.floor(diff / 86400000);
  if (d === 0) return "Today";
  if (d === 1) return "Yesterday";
  if (d < 30) return `${d}d ago`;
  if (d < 365) return `${Math.floor(d / 30)}mo ago`;
  return `${Math.floor(d / 365)}y ago`;
}

export default function LabOwnerManagement() {
  const {data} = useGetlaboratoriesQuery({ page: 1, limit: 10, search: "", status: "all" })
  const owners = data?.laboratories
  
  const [search, setSearch] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");
  const [showCreate, setShowCreate] = useState(false);
  const [actionModal, setActionModal] = useState(null); // { type, owner }
  const [toast, setToast] = useState(null);
  const [detailOwner, setDetailOwner] = useState(null);


  useEffect(() => {
    if (toast) { const t = setTimeout(() => setToast(null), 3000); return () => clearTimeout(t); }
  }, [toast]);

  const notify = (msg, type = "success") => setToast({ msg, type });

  const filtered = owners?.filter(o => {
    const q = search.toLowerCase();
    const match = o.name.toLowerCase().includes(q) || o.email.toLowerCase().includes(q) || o.labName.toLowerCase().includes(q);
    const statusMatch = filterStatus === "all" || o.status === filterStatus;
    return match && statusMatch;
  });

  const stats = {
    total: owners?.length,
    active: owners?.filter(o => o.status === "Active").length,
    pending: owners?.filter(o => o.status === "Pending").length,
    suspended: owners?.filter(o => o.status === "Suspended").length,
  };



  const [createLabOnwerAccount] =  useCreateLabAccountMutation()
  const handleCreate = async(data) => {
   try {
      const response =  await createLabOnwerAccount(data).unwrap()
      alert("account created successfully")
   } catch (error) {
    alert("error" , error)
   }
  };

  const doAction = (type, owner) => {
    switch (type) {
      case "activate":   updateOwner(owner.id, { status: "Active" });    notify(`${owner.name} activated`); break;
      case "suspend":    updateOwner(owner.id, { status: "Suspended" }); notify(`${owner.name} suspended`, "warn"); break;
      case "deactivate": updateOwner(owner.id, { status: "Inactive" });  notify(`${owner.name} deactivated`, "warn"); break;
      case "reset":      updateOwner(owner.id, { _tempPass: randomPass() }); notify(`Password reset sent to ${owner.email}`); break;
      case "delete":     setOwners(prev => prev.filter(o => o.id !== owner.id)); notify(`${owner.name} deleted`, "error"); break;
    }
    setActionModal(null);
  };

  return (
    <div style={{ minHeight: "100vh", background: "#f5f6fa", fontFamily: "'DM Sans', 'Segoe UI', sans-serif", padding: "32px 24px" }}>
      {/* Header */}
      <div style={{ maxWidth: 1100, margin: "0 auto" }}>
        <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", marginBottom: 32 }}>
          <div>
            <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: 2, color: "#6366f1", textTransform: "uppercase", marginBottom: 6 }}>Admin Panel</div>
            <h1 style={{ fontSize: 28, fontWeight: 800, color: "#0f172a", margin: 0, letterSpacing: -0.5 }}>Lab Owner Accounts</h1>
            <p style={{ color: "#64748b", fontSize: 14, margin: "6px 0 0" }}>Create accounts for lab owners — they'll set up their own profile.</p>
          </div>
          <button onClick={() => setShowCreate(true)} style={{ background: "#6366f1", color: "#fff", border: "none", borderRadius: 10, padding: "11px 20px", fontWeight: 700, fontSize: 14, cursor: "pointer", display: "flex", alignItems: "center", gap: 8, boxShadow: "0 4px 14px rgba(99,102,241,0.35)" }}>
            <span style={{ fontSize: 18, lineHeight: 1 }}>+</span> Create Account
          </button>
        </div>

        {/* Stats Row */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 16, marginBottom: 28 }}>
          {[
            { label: "Total Owners", value: stats.total, color: "#6366f1", bg: "#eef2ff" },
            { label: "Active", value: stats.active, color: "#16a34a", bg: "#f0fdf4" },
            { label: "Pending Setup", value: stats.pending, color: "#d97706", bg: "#fffbeb" },
            { label: "Suspended", value: stats.suspended, color: "#dc2626", bg: "#fef2f2" },
          ].map(s => (
            <div key={s.label} style={{ background: "#fff", borderRadius: 12, padding: "18px 20px", border: "1px solid #e8eaf0", boxShadow: "0 1px 4px rgba(0,0,0,0.04)" }}>
              <div style={{ fontSize: 12, color: "#94a3b8", fontWeight: 600, marginBottom: 6 }}>{s.label}</div>
              <div style={{ fontSize: 30, fontWeight: 800, color: s.color }}>{s.value}</div>
            </div>
          ))}
        </div>

        {/* Search + Filter */}
        <div style={{ background: "#fff", borderRadius: 12, padding: "14px 18px", border: "1px solid #e8eaf0", display: "flex", gap: 12, marginBottom: 20, boxShadow: "0 1px 4px rgba(0,0,0,0.04)" }}>
          <div style={{ flex: 1, position: "relative" }}>
            <span style={{ position: "absolute", left: 12, top: "50%", transform: "translateY(-50%)", color: "#94a3b8", fontSize: 14 }}>🔍</span>
            <input
              placeholder="Search by name, email or lab..."
              value={search}
              onChange={e => setSearch(e.target.value)}
              style={{ width: "100%", paddingLeft: 36, paddingRight: 14, paddingTop: 9, paddingBottom: 9, border: "1px solid #e2e8f0", borderRadius: 8, fontSize: 14, outline: "none", background: "#f8fafc", boxSizing: "border-box" }}
            />
          </div>
          <select value={filterStatus} onChange={e => setFilterStatus(e.target.value)}
            style={{ padding: "9px 14px", border: "1px solid #e2e8f0", borderRadius: 8, fontSize: 14, background: "#f8fafc", outline: "none", color: "#374151", cursor: "pointer" }}>
            <option value="all">All Status</option>
            <option value="Active">Active</option>
            <option value="Pending">Pending</option>
            <option value="Suspended">Suspended</option>
            <option value="Inactive">Inactive</option>
          </select>
        </div>

        {/* Table */}
        <div style={{ background: "#fff", borderRadius: 14, border: "1px solid #e8eaf0", overflow: "hidden", boxShadow: "0 2px 8px rgba(0,0,0,0.05)" }}>
          <table style={{ width: "100%", borderCollapse: "collapse" }}>
            <thead>
              <tr style={{ background: "#f8fafc", borderBottom: "1px solid #e8eaf0" }}>
                {["Lab Owner", "Email", "Lab Name", "Status", "Profile", "Last Login", "Actions"].map(h => (
                  <th key={h} style={{ padding: "13px 18px", textAlign: "left", fontSize: 11, fontWeight: 700, color: "#94a3b8", letterSpacing: 1, textTransform: "uppercase" }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filtered?.map((owner, i) => {
                const sc = statusConfig[owner?.status] || statusConfig.Inactive;
                return (
                  <tr key={owner.id} style={{ borderBottom: i < filtered.length - 1 ? "1px solid #f1f5f9" : "none", transition: "background 0.15s" }}
                    onMouseEnter={e => e.currentTarget.style.background = "#fafbff"}
                    onMouseLeave={e => e.currentTarget.style.background = "transparent"}>
                    {/* Name */}
                    <td style={{ padding: "14px 18px" }}>
                      <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                        <div style={{ width: 38, height: 38, borderRadius: "50%", background: `linear-gradient(135deg, #6366f1, #818cf8)`, display: "flex", alignItems: "center", justifyContent: "center", color: "#fff", fontWeight: 800, fontSize: 14, flexShrink: 0 }}>
                          {owner?.name.split(" ").map(w => w[0]).slice(0, 2).join("")}
                        </div>
                        <span style={{ fontWeight: 600, color: "#0f172a", fontSize: 14 }}>{owner?.name}</span>
                      </div>
                    </td>
                    {/* Email */}
                    <td style={{ padding: "14px 18px", fontSize: 13, color: "#64748b" }}>{owner?.email}</td>
                    {/* Lab Name */}
                    <td style={{ padding: "14px 18px", fontSize: 13, color: owner?.labName === "—" ? "#cbd5e1" : "#334155", fontWeight: owner?.labName === "—" ? 400 : 600 }}>{owner?.labName}</td>
                    {/* Status */}
                    <td style={{ padding: "14px 18px" }}>
                      <span style={{ background: sc.bg, color: sc.text, padding: "4px 12px", borderRadius: 20, fontSize: 12, fontWeight: 700, display: "inline-flex", alignItems: "center", gap: 6 }}>
                        <span style={{ width: 6, height: 6, borderRadius: "50%", background: sc.dot, display: "inline-block" }} />
                        {sc.label}
                      </span>
                    </td>
                    {/* Profile Complete */}
                    <td style={{ padding: "14px 18px" }}>
                      {owner?.profileComplete
                        ? <span style={{ color: "#16a34a", fontSize: 12, fontWeight: 700 }}>✓ Complete</span>
                        : <span style={{ color: "#f59e0b", fontSize: 12, fontWeight: 700 }}>⚠ Incomplete</span>}
                    </td>
                    {/* Last Login */}
                    <td style={{ padding: "14px 18px", fontSize: 13, color: "#94a3b8" }}>{timeAgo(owner?.lastLogin)}</td>
                    {/* Actions */}
                    <td style={{ padding: "14px 18px" }}>
                      <div style={{ display: "flex", gap: 6 }}>
                        <ActionBtn label="View" color="#6366f1" bg="#eef2ff" onClick={() => setDetailOwner(owner)} />
                        <ActionBtn label="⋯" color="#475569" bg="#f1f5f9" onClick={() => setActionModal({ owner })} />
                      </div>
                    </td>
                  </tr>
                );
              })}
              {filtered?.length === 0 && (
                <tr><td colSpan={7} style={{ padding: 48, textAlign: "center", color: "#94a3b8", fontSize: 14 }}>No lab owners found</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Create Account Modal */}
      {showCreate && <CreateModal onClose={() => setShowCreate(false)} onCreate={handleCreate} />}

      {/* Actions Popover */}
      {actionModal && <ActionsModal owner={actionModal.owner} onClose={() => setActionModal(null)} onAction={doAction} />}

      {/* Detail Modal */}
      {detailOwner && <DetailModal owner={detailOwner} onClose={() => setDetailOwner(null)} onAction={(type) => { doAction(type, detailOwner); setDetailOwner(null); }} />}

      {/* Toast */}
      {toast && (
        <div style={{
          position: "fixed", bottom: 28, right: 28, zIndex: 9999,
          background: toast.type === "error" ? "#dc2626" : toast.type === "warn" ? "#d97706" : "#16a34a",
          color: "#fff", padding: "12px 20px", borderRadius: 10, fontSize: 14, fontWeight: 600,
          boxShadow: "0 8px 24px rgba(0,0,0,0.2)", display: "flex", alignItems: "center", gap: 8,
          animation: "slideUp 0.25s ease"
        }}>
          {toast.type === "error" ? "🗑" : toast.type === "warn" ? "⚠️" : "✓"} {toast.msg}
        </div>
      )}

      <style>{`@keyframes slideUp { from { opacity:0; transform:translateY(12px); } to { opacity:1; transform:translateY(0); } }`}</style>
    </div>
  );
}

function ActionBtn({ label, color, bg, onClick }) {
  return (
    <button onClick={onClick} style={{ background: bg, color, border: "none", borderRadius: 7, padding: "6px 12px", fontSize: 13, fontWeight: 700, cursor: "pointer", transition: "opacity 0.15s" }}
      onMouseEnter={e => e.currentTarget.style.opacity = "0.75"}
      onMouseLeave={e => e.currentTarget.style.opacity = "1"}>
      {label}
    </button>
  );
}

function CreateModal({ onClose, onCreate }) {
  const [form, setForm] = useState({ name: "", email: "", password: "" });
  const [showPass, setShowPass] = useState(false);
  const [errors, setErrors] = useState({});

  const gen = () => setForm(f => ({ ...f, password: randomPass() }));

  const submit = () => {
    const e = {};
    if (!form.name.trim()) e.name = "Required";
    if (!form.email.includes("@")) e.email = "Valid email required";
    if (form.password.length < 6) e.password = "Min 6 characters";
    if (Object.keys(e).length) { setErrors(e); return; }
    onCreate(form);
  };

  return (
    <Overlay onClose={onClose}>
      <div style={{ width: "100%", maxWidth: 460 }}>
        <div style={{ marginBottom: 24 }}>
          <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: 2, color: "#6366f1", textTransform: "uppercase", marginBottom: 6 }}>New Account</div>
          <h2 style={{ margin: 0, fontSize: 22, fontWeight: 800, color: "#0f172a" }}>Create Lab Owner Account</h2>
          <p style={{ margin: "8px 0 0", color: "#64748b", fontSize: 14 }}>The owner will complete their lab profile after logging in.</p>
        </div>

        <Field label="Full Name" error={errors.name}>
          <input value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} placeholder="Dr. Ahmed Khan" style={inputStyle} />
        </Field>
        <Field label="Email Address" error={errors.email}>
          <input value={form.email} onChange={e => setForm(f => ({ ...f, email: e.target.value }))} placeholder="owner@lab.com" type="email" style={inputStyle} />
        </Field>
        <Field label="Temporary Password" error={errors.password}>
          <div style={{ position: "relative" }}>
            <input value={form.password} onChange={e => setForm(f => ({ ...f, password: e.target.value }))}
              type={showPass ? "text" : "password"} placeholder="Set a password" style={{ ...inputStyle, paddingRight: 90 }} />
            <div style={{ position: "absolute", right: 10, top: "50%", transform: "translateY(-50%)", display: "flex", gap: 6 }}>
              <button onClick={() => setShowPass(s => !s)} style={{ background: "none", border: "none", color: "#6366f1", fontSize: 12, cursor: "pointer", fontWeight: 600 }}>{showPass ? "Hide" : "Show"}</button>
              <button onClick={gen} style={{ background: "#eef2ff", border: "none", color: "#6366f1", fontSize: 11, cursor: "pointer", fontWeight: 700, padding: "3px 8px", borderRadius: 5 }}>Auto</button>
            </div>
          </div>
        </Field>

        <div style={{ background: "#f0fdf4", border: "1px solid #bbf7d0", borderRadius: 10, padding: "12px 14px", marginBottom: 24, fontSize: 13, color: "#15803d", display: "flex", gap: 8 }}>
          <span>💡</span>
          <span>Share this login with the owner. They'll update the password and fill in lab details from their dashboard.</span>
        </div>

        <div style={{ display: "flex", gap: 10, justifyContent: "flex-end" }}>
          <button onClick={onClose} style={{ ...outlineBtn }}>Cancel</button>
          <button onClick={submit} style={{ ...primaryBtn }}>Create Account</button>
        </div>
      </div>
    </Overlay>
  );
}

function ActionsModal({ owner, onClose, onAction }) {
  const sc = statusConfig[owner.status] || statusConfig.Inactive;
  const actions = [
    owner.status !== "Active"    && { key: "activate",   label: "Activate Account",  icon: "✓", color: "#16a34a", bg: "#f0fdf4" },
    owner.status === "Active"    && { key: "suspend",    label: "Suspend Account",   icon: "⊘", color: "#d97706", bg: "#fffbeb" },
    owner.status !== "Inactive"  && { key: "deactivate", label: "Deactivate",        icon: "○", color: "#64748b", bg: "#f8fafc" },
    { key: "reset",   label: "Reset Password",    icon: "↺", color: "#6366f1", bg: "#eef2ff" },
    { key: "delete",  label: "Delete Account",    icon: "🗑", color: "#dc2626", bg: "#fef2f2" },
  ].filter(Boolean);

  return (
    <Overlay onClose={onClose}>
      <div style={{ width: "100%", maxWidth: 380 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 14, marginBottom: 22, paddingBottom: 18, borderBottom: "1px solid #f1f5f9" }}>
          <div style={{ width: 46, height: 46, borderRadius: "50%", background: "linear-gradient(135deg, #6366f1, #818cf8)", display: "flex", alignItems: "center", justifyContent: "center", color: "#fff", fontWeight: 800, fontSize: 16 }}>
            {owner?.name.split(" ").map(w => w[0]).slice(0, 2).join("")}
          </div>
          <div>
            <div style={{ fontWeight: 700, fontSize: 16, color: "#0f172a" }}>{owner.name}</div>
            <div style={{ fontSize: 13, color: "#94a3b8" }}>{owner?.email}</div>
          </div>
          <span style={{ marginLeft: "auto", background: sc.bg, color: sc.text, padding: "3px 10px", borderRadius: 20, fontSize: 11, fontWeight: 700 }}>{sc.label}</span>
        </div>

        <div style={{ marginBottom: 6, fontSize: 11, fontWeight: 700, color: "#94a3b8", letterSpacing: 1, textTransform: "uppercase" }}>Admin Actions</div>
        <div style={{ display: "flex", flexDirection: "column", gap: 8, marginBottom: 20 }}>
          {actions.map(a => (
            <button key={a.key} onClick={() => onAction(a.key, owner)}
              style={{ background: a.bg, color: a.color, border: "none", borderRadius: 10, padding: "13px 16px", fontSize: 14, fontWeight: 700, cursor: "pointer", textAlign: "left", display: "flex", alignItems: "center", gap: 10, transition: "opacity 0.15s" }}
              onMouseEnter={e => e.currentTarget.style.opacity = "0.8"}
              onMouseLeave={e => e.currentTarget.style.opacity = "1"}>
              <span style={{ fontSize: 16 }}>{a.icon}</span> {a.label}
            </button>
          ))}
        </div>
        <button onClick={onClose} style={{ ...outlineBtn, width: "100%" }}>Cancel</button>
      </div>
    </Overlay>
  );
}

function DetailModal({ owner, onClose, onAction }) {
  const sc = statusConfig[owner.status] || statusConfig.Inactive;
  return (
    <Overlay onClose={onClose}>
      <div style={{ width: "100%", maxWidth: 480 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 16, marginBottom: 24 }}>
          <div style={{ width: 56, height: 56, borderRadius: "50%", background: "linear-gradient(135deg, #6366f1, #818cf8)", display: "flex", alignItems: "center", justifyContent: "center", color: "#fff", fontWeight: 800, fontSize: 20 }}>
            {owner.name.split(" ").map(w => w[0]).slice(0, 2).join("")}
          </div>
          <div>
            <h2 style={{ margin: 0, fontSize: 20, fontWeight: 800, color: "#0f172a" }}>{owner.name}</h2>
            <span style={{ background: sc.bg, color: sc.text, padding: "3px 10px", borderRadius: 20, fontSize: 11, fontWeight: 700, display: "inline-block", marginTop: 4 }}>{sc.label}</span>
          </div>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14, marginBottom: 20 }}>
          {[
            { label: "Email", value: owner.email, icon: "✉" },
            { label: "Lab Name", value: owner.labName, icon: "🏥" },
            { label: "Account Created", value: new Date(owner.createdAt).toLocaleDateString("en-PK", { day: "numeric", month: "short", year: "numeric" }), icon: "📅" },
            { label: "Last Login", value: timeAgo(owner.lastLogin), icon: "🕒" },
            { label: "Profile Status", value: owner.profileComplete ? "Complete" : "Incomplete", icon: "📋", highlight: owner.profileComplete ? "#16a34a" : "#d97706" },
          ].map(row => (
            <div key={row.label} style={{ background: "#f8fafc", borderRadius: 10, padding: "12px 14px" }}>
              <div style={{ fontSize: 11, color: "#94a3b8", fontWeight: 600, marginBottom: 4 }}>{row.icon} {row.label}</div>
              <div style={{ fontSize: 14, fontWeight: 700, color: row.highlight || "#0f172a" }}>{row.value}</div>
            </div>
          ))}
        </div>

        <div style={{ display: "flex", gap: 8, flexWrap: "wrap", marginBottom: 20 }}>
          {owner.status !== "Active"   && <button onClick={() => onAction("activate")}   style={{ ...primaryBtn, flex: 1, background: "#16a34a" }}>Activate</button>}
          {owner.status === "Active"   && <button onClick={() => onAction("suspend")}    style={{ ...primaryBtn, flex: 1, background: "#d97706" }}>Suspend</button>}
          <button onClick={() => onAction("reset")}    style={{ ...primaryBtn, flex: 1 }}>Reset Password</button>
          <button onClick={() => onAction("delete")}   style={{ ...primaryBtn, flex: 1, background: "#dc2626" }}>Delete</button>
        </div>

        <button onClick={onClose} style={{ ...outlineBtn, width: "100%" }}>Close</button>
      </div>
    </Overlay>
  );
}

function Field({ label, children, error }) {
  return (
    <div style={{ marginBottom: 16 }}>
      <label style={{ display: "block", fontSize: 13, fontWeight: 600, color: "#374151", marginBottom: 6 }}>{label}</label>
      {children}
      {error && <div style={{ fontSize: 12, color: "#dc2626", marginTop: 4 }}>{error}</div>}
    </div>
  );
}

function Overlay({ onClose, children }) {
  return (
    <div onClick={onClose} style={{ position: "fixed", inset: 0, background: "rgba(15,23,42,0.55)", backdropFilter: "blur(3px)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 1000, padding: 20 }}>
      <div onClick={e => e.stopPropagation()} style={{ background: "#fff", borderRadius: 16, padding: 28, boxShadow: "0 24px 60px rgba(0,0,0,0.18)", width: "100%", maxWidth: 520, maxHeight: "90vh", overflowY: "auto" }}>
        {children}
      </div>
    </div>
  );
}

const inputStyle = {
  width: "100%", padding: "10px 14px", border: "1px solid #e2e8f0", borderRadius: 8,
  fontSize: 14, outline: "none", background: "#f8fafc", boxSizing: "border-box", color: "#0f172a"
};
const primaryBtn = {
  background: "#6366f1", color: "#fff", border: "none", borderRadius: 9,
  padding: "11px 20px", fontSize: 14, fontWeight: 700, cursor: "pointer"
};
const outlineBtn = {
  background: "#fff", color: "#374151", border: "1px solid #e2e8f0", borderRadius: 9,
  padding: "11px 20px", fontSize: 14, fontWeight: 600, cursor: "pointer"
};