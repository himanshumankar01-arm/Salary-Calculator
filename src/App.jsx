import { useMemo, useState } from "react";

const CSS = `
:root {
  --bg: #f1f5f9;
  --card: #ffffff;
  --ink: #0f172a;
  --muted: #64748b;
  --line: #e2e8f0;
  --brand: #4f46e5;
  --brand-2: #7c3aed;
  --danger: #dc2626;
  --ok: #059669;
}

* { box-sizing: border-box; }

body {
  margin: 0;
  background: var(--bg);
  color: var(--ink);
  font-family: "Inter", system-ui, -apple-system, "Segoe UI", Roboto, sans-serif;
}

.page { min-height: 100vh; }

.topbar {
  background: linear-gradient(120deg, var(--brand), var(--brand-2));
  color: #fff;
  padding: 28px 24px 80px;
}
.brand { max-width: 1120px; margin: 0 auto; display: flex; gap: 16px; align-items: center; }
.logo {
  width: 52px; height: 52px; border-radius: 14px;
  background: rgba(255,255,255,.18);
  display: grid; place-items: center; font-size: 26px; font-weight: 700;
}
.brand h1 { margin: 0; font-size: 24px; }
.brand p { margin: 4px 0 0; opacity: .85; font-size: 14px; }

.layout {
  max-width: 1120px;
  margin: -56px auto 40px;
  padding: 0 24px;
  display: grid;
  grid-template-columns: 1fr 360px;
  gap: 24px;
  align-items: start;
}

.forms { display: grid; gap: 24px; }

.card {
  background: var(--card);
  border-radius: 16px;
  padding: 24px;
  box-shadow: 0 10px 30px rgba(15, 23, 42, .08);
}
.card-head { display: flex; align-items: center; gap: 12px; margin-bottom: 20px; }
.card-head h2 { margin: 0; font-size: 18px; }
.step {
  width: 28px; height: 28px; border-radius: 50%;
  background: #eef2ff; color: var(--brand);
  display: grid; place-items: center; font-weight: 700; font-size: 14px;
}

.grid { display: grid; grid-template-columns: 1fr 1fr; gap: 16px; }
.field { display: flex; flex-direction: column; gap: 6px; }
.field.full { grid-column: 1 / -1; }
.label { font-size: 13px; font-weight: 600; color: #334155; }

input, select, textarea {
  font: inherit;
  padding: 11px 12px;
  border: 1px solid var(--line);
  border-radius: 10px;
  background: #f8fafc;
  color: var(--ink);
  transition: border-color .15s, box-shadow .15s, background .15s;
  width: 100%;
}
input:focus, select:focus, textarea:focus {
  outline: none;
  border-color: var(--brand);
  background: #fff;
  box-shadow: 0 0 0 4px rgba(79, 70, 229, .12);
}
input[readonly] { color: var(--brand); font-weight: 600; background: #eef2ff; }
.invalid input, .invalid select, .invalid textarea { border-color: var(--danger); }
.error { color: var(--danger); font-size: 12px; }

.actions { display: flex; justify-content: flex-end; gap: 12px; }
.btn {
  font: inherit; font-weight: 600; cursor: pointer;
  padding: 12px 22px; border-radius: 10px; border: 1px solid transparent;
}
.btn.primary { background: var(--brand); color: #fff; }
.btn.primary:hover { background: #4338ca; }
.btn.ghost { background: #fff; border-color: var(--line); color: var(--muted); }
.btn.ghost:hover { background: #f8fafc; }

/* Summary */
.summary { position: sticky; top: 24px; }
.employee { display: flex; align-items: center; gap: 12px; padding-bottom: 16px; border-bottom: 1px dashed var(--line); }
.employee small { display: block; color: var(--muted); margin-top: 2px; }
.avatar {
  width: 44px; height: 44px; border-radius: 50%;
  background: linear-gradient(120deg, var(--brand), var(--brand-2));
  color: #fff; display: grid; place-items: center; font-weight: 700; font-size: 18px;
}

.rows { margin: 8px 0 0; }
.rows div { display: flex; justify-content: space-between; padding: 10px 0; border-bottom: 1px solid #f1f5f9; font-size: 14px; }
.rows dt { color: var(--muted); }
.rows dd { margin: 0; font-weight: 600; }
.rows .minus dd { color: var(--danger); }
.rows .strong dt, .rows .strong dd { color: var(--ink); }
.rows .strong { background: #f8fafc; margin: 0 -12px; padding: 10px 12px; border-radius: 8px; }

.formula { text-align: center; color: var(--muted); font-size: 13px; margin: 16px 0 10px; }
.total {
  background: linear-gradient(120deg, #059669, #10b981);
  color: #fff; border-radius: 14px; padding: 18px;
  display: flex; flex-direction: column; gap: 4px; text-align: center;
}
.total span { font-size: 13px; opacity: .9; }
.total strong { font-size: 30px; letter-spacing: -.5px; }
.alert { color: var(--danger); font-size: 13px; text-align: center; margin: 12px 0 0; }

@media (max-width: 900px) {
  .layout { grid-template-columns: 1fr; }
  .summary { position: static; }
}
@media (max-width: 560px) {
  .grid { grid-template-columns: 1fr; }
}

/* Print: only the salary summary */
@media print {
  .topbar, .forms { display: none; }
  body { background: #fff; }
  .layout { display: block; margin: 0; padding: 0; }
  .summary { box-shadow: none; }
}
`;

// Daily wage data, based on position (edit freely)
const POSITIONS = [
  { name: "Senior Manager", wage: 2000 },
  { name: "Manager", wage: 1500 },
  { name: "Team Leader", wage: 1200 },
  { name: "Jr. Manager", wage: 1000 },
  { name: "Accountant", wage: 900 },
  { name: "Clerk", wage: 800 },
  { name: "Receptionist", wage: 700 },
  { name: "Office Assistant", wage: 600 },
  { name: "Sales Executive", wage: 500 },
  { name: "Peon", wage: 250 },
];

const INITIAL = {
  employeeId: "",
  name: "",
  email: "",
  phone: "",
  address: "",
  position: "",
  joinDate: "",
  paymentDate: "",
  leaves: "0",
};

const inr = (n) =>
  new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 2,
  }).format(n);

const toUTC = (iso) => {
  const [y, m, d] = iso.split("-").map(Number);
  return Date.UTC(y, m - 1, d);
};

const fmtDate = (iso) =>
  iso
    ? new Date(toUTC(iso)).toLocaleDateString("en-IN", {
        day: "2-digit",
        month: "short",
        year: "numeric",
        timeZone: "UTC",
      })
    : "—";

// Defined outside App so inputs keep focus while typing
function Field({ label, error, children, full }) {
  return (
    <label className={`field ${full ? "full" : ""} ${error ? "invalid" : ""}`}>
      <span className="label">{label}</span>
      {children}
      {error && <span className="error">{error}</span>}
    </label>
  );
}

export default function App() {
  const [form, setForm] = useState(INITIAL);
  const [touched, setTouched] = useState(false);

  const set = (key) => (e) => setForm({ ...form, [key]: e.target.value });

  const wage = POSITIONS.find((p) => p.name === form.position)?.wage ?? 0;

  // Total days = joining date to payment date, both inclusive
  const totalDays = useMemo(() => {
    if (!form.joinDate || !form.paymentDate) return 0;
    const diff = (toUTC(form.paymentDate) - toUTC(form.joinDate)) / 86400000;
    return diff >= 0 ? Math.round(diff) + 1 : 0;
  }, [form.joinDate, form.paymentDate]);

  const leaves = Number(form.leaves) || 0;
  const payableDays = Math.max(totalDays - leaves, 0);
  const salary = payableDays * wage;

  const errors = useMemo(() => {
    const e = {};
    if (!form.name.trim()) e.name = "Name is required";
    if (!/^\S+@\S+\.\S+$/.test(form.email)) e.email = "Enter a valid email";
    if (!/^[6-9]\d{9}$/.test(form.phone))
      e.phone = "Enter a valid 10-digit mobile number";
    if (!form.position) e.position = "Select a position";
    if (!form.joinDate) e.joinDate = "Select joining date";
    if (!form.paymentDate) e.paymentDate = "Select payment date";
    if (form.joinDate && form.paymentDate && totalDays === 0)
      e.paymentDate = "Payment date must be on or after joining date";
    if (leaves < 0) e.leaves = "Leaves cannot be negative";
    if (totalDays > 0 && leaves > totalDays)
      e.leaves = `Leaves cannot exceed total days (${totalDays})`;
    return e;
  }, [form, totalDays, leaves]);

  const valid = Object.keys(errors).length === 0;
  const show = (k) => touched && errors[k];

  const reset = () => {
    setForm(INITIAL);
    setTouched(false);
  };

  return (
    <div className="page">
      <style>{CSS}</style>
      <header className="topbar">
        <div className="brand">
          <div className="logo">₹</div>
          <div>
            <h1>Daily Wage Salary Calculator</h1>
            <p>Calculate employee pay from attendance and position</p>
          </div>
        </div>
      </header>

      <main className="layout">
        <section className="forms">
          {/* Employee details */}
          <div className="card">
            <div className="card-head">
              <span className="step">1</span>
              <h2>Employee Details</h2>
            </div>
            <div className="grid">
              <Field label="Employee ID" error={show("employeeId")}>
                <input
                  value={form.employeeId}
                  onChange={set("employeeId")}
                  placeholder="EMP-001"
                />
              </Field>
              <Field label="Full Name *" error={show("name")}>
                <input
                  value={form.name}
                  onChange={set("name")}
                  placeholder="e.g. Rahul Sharma"
                />
              </Field>
              <Field label="Email *" error={show("email")}>
                <input
                  type="email"
                  value={form.email}
                  onChange={set("email")}
                  placeholder="rahul@example.com"
                />
              </Field>
              <Field label="Phone *" error={show("phone")}>
                <input
                  inputMode="numeric"
                  maxLength={10}
                  value={form.phone}
                  onChange={(e) =>
                    setForm({ ...form, phone: e.target.value.replace(/\D/g, "") })
                  }
                  placeholder="10-digit mobile number"
                />
              </Field>
              <Field label="Address" error={show("address")} full>
                <textarea
                  rows={2}
                  value={form.address}
                  onChange={set("address")}
                  placeholder="House no., street, city, state, PIN"
                />
              </Field>
            </div>
          </div>

          {/* Attendance */}
          <div className="card">
            <div className="card-head">
              <span className="step">2</span>
              <h2>Position &amp; Attendance</h2>
            </div>
            <div className="grid">
              <Field label="Position *" error={show("position")}>
                <select value={form.position} onChange={set("position")}>
                  <option value="">Select position</option>
                  {POSITIONS.map((p) => (
                    <option key={p.name} value={p.name}>
                      {p.name} — {inr(p.wage)}/day
                    </option>
                  ))}
                </select>
              </Field>
              <Field label="Wage per Day" error={show("wage")}>
                <input value={wage ? inr(wage) : ""} readOnly placeholder="Auto-filled" />
              </Field>
              <Field label="Date of Joining *" error={show("joinDate")}>
                <input
                  type="date"
                  value={form.joinDate}
                  onChange={set("joinDate")}
                />
              </Field>
              <Field label="Date of Payment *" error={show("paymentDate")}>
                <input
                  type="date"
                  min={form.joinDate || undefined}
                  value={form.paymentDate}
                  onChange={set("paymentDate")}
                />
              </Field>
              <Field label="Leaves Taken (days)" error={show("leaves")}>
                <input
                  type="number"
                  min="0"
                  step="1"
                  value={form.leaves}
                  onChange={set("leaves")}
                />
              </Field>
            </div>
          </div>

          <div className="actions">
            <button className="btn ghost" onClick={reset}>
              Reset
            </button>
            <button
              className="btn primary"
              onClick={() => {
                setTouched(true);
                if (valid) window.print();
              }}
            >
              Print Salary Slip
            </button>
          </div>
        </section>

        {/* Summary */}
        <aside className="summary card">
          <div className="card-head">
            <span className="step">3</span>
            <h2>Salary Summary</h2>
          </div>

          <div className="employee">
            <div className="avatar">
              {(form.name.trim()[0] || "?").toUpperCase()}
            </div>
            <div>
              <strong>{form.name || "Employee name"}</strong>
              <small>
                {form.position || "Position"}
                {form.employeeId && ` · ${form.employeeId}`}
              </small>
            </div>
          </div>

          <dl className="rows">
            <div><dt>Date of joining</dt><dd>{fmtDate(form.joinDate)}</dd></div>
            <div><dt>Date of payment</dt><dd>{fmtDate(form.paymentDate)}</dd></div>
            <div><dt>Total days</dt><dd>{totalDays}</dd></div>
            <div className="minus"><dt>Leaves taken</dt><dd>− {leaves}</dd></div>
            <div className="strong"><dt>Days worked</dt><dd>{payableDays}</dd></div>
            <div><dt>Wage per day</dt><dd>{wage ? inr(wage) : "—"}</dd></div>
          </dl>

          <div className="formula">
            {payableDays} days × {wage ? inr(wage) : "₹0"}
          </div>

          <div className="total">
            <span>Net Salary Payable</span>
            <strong>{inr(salary)}</strong>
          </div>

          {touched && !valid && (
            <p className="alert">Please fix the highlighted fields.</p>
          )}
        </aside>
      </main>
    </div>
  );
}