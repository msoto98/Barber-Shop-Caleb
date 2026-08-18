"use client";
import { useState, useEffect, useMemo } from "react";
import {
  Scissors, Calendar as CalendarIcon, Clock, Check, X, Settings,
  MessageCircle, DollarSign, ChevronLeft, ChevronRight, Lock,
  Unlock, ArrowLeft, Sparkles, User, Phone,
} from "lucide-react";
import { supabase } from "../lib/supabaseClient";

const PHONE = "50663789856";
const OPEN_HOUR = 10;
const CLOSE_HOUR = 20;
const ADMIN_PIN = "5151";

const SERVICES = [
  { id: "sombreado", name: "Sombreado", price: 5000, icon: Sparkles, desc: "Degradado preciso, acabado limpio" },
  { id: "clasico", name: "Clásico", price: 4000, icon: Scissors, desc: "Corte tradicional a tijera y máquina" },
  { id: "corteybarba", name: "Corte + Barba", price: 6000, icon: User, desc: "Corte completo con arreglo de barba" },
];
const HERO_IMAGES = ["/hero.jpg", "/2.jpg", "/3.jpg", "/4.jpg"];
const DAYS_ES = ["Dom", "Lun", "Mar", "Mié", "Jue", "Vie", "Sáb"];
const MONTHS_ES = ["Enero","Febrero","Marzo","Abril","Mayo","Junio","Julio","Agosto","Septiembre","Octubre","Noviembre","Diciembre"];

function crNow() {
  const parts = new Intl.DateTimeFormat("en-US", {
    timeZone: "America/Costa_Rica",
    year: "numeric", month: "2-digit", day: "2-digit",
    hour: "2-digit", minute: "2-digit", second: "2-digit",
    hourCycle: "h23",
  }).formatToParts(new Date());
  const get = (t) => parts.find((p) => p.type === t).value;
  return new Date(`${get("year")}-${get("month")}-${get("day")}T${get("hour")}:${get("minute")}:${get("second")}`);
}
function dateKey(d) {
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
}
function crTodayKey() { return dateKey(crNow()); }
function formatHour(h) {
  const period = h >= 12 ? "PM" : "AM";
  const hour12 = h % 12 === 0 ? 12 : h % 12;
  return `${hour12}:00 ${period}`;
}
function isPastDate(d) {
  const today = crNow();
  today.setHours(0, 0, 0, 0);
  return d < today;
}
function money(n) { return "₡" + n.toLocaleString("es-CR"); }

const colors = {
  bg: "#0a0f1a", panel: "#121b2c", panelLight: "#1a2740", border: "#26344d",
  text: "#eef1f7", muted: "#8b97ae", accent: "#3d6ea8", accentDeep: "#1e3a5f",
  accentSoft: "#0f2847", danger: "#b5564c", success: "#4a9d6f",
};

function Stripe() {
  return <div style={{ height: 3, width: "100%", background: `linear-gradient(90deg, ${colors.accentDeep}, ${colors.accent}, ${colors.accentDeep})` }} />;
}
function Logo() {
  return (
    <div className="flex items-center gap-3">
           <img src="/logo.png" alt="Barber Shop Caleb" style={{ width: 56, height: 56, borderRadius: "50%", objectFit: "cover", border: `1px solid ${colors.border}` }} />
      <div>
        <div className="text-lg tracking-wide" style={{ color: colors.text, fontWeight: 600, letterSpacing: "0.02em" }}>BARBER SHOP CALEB</div>
                <div className="text-[10px] uppercase" style={{ color: colors.muted, letterSpacing: "0.15em" }}> 📍 Coronado, Osa, Puntarenas</div>
      </div>
    </div>
  );
}
function Card({ children, style }) {
  return <div className="rounded-2xl p-5" style={{ background: colors.panel, border: `1px solid ${colors.border}`, ...style }}>{children}</div>;
}
function StepLabel({ n, label }) {
  return (
    <div className="flex items-center gap-2 mb-4">
      <div className="flex items-center justify-center rounded-full text-xs" style={{ width: 22, height: 22, background: colors.accentSoft, color: colors.accent, border: `1px solid ${colors.accent}`, fontWeight: 600 }}>{n}</div>
      <div className="text-sm uppercase" style={{ color: colors.muted, letterSpacing: "0.1em" }}>{label}</div>
    </div>
  );
}

function Calendar({ selected, onSelect, blockedDays, restrictPast = true }) {
  const [viewDate, setViewDate] = useState(selected ? new Date(...selected.split("-").map((n, i) => i === 1 ? Number(n) - 1 : Number(n))) : new Date());
  const year = viewDate.getFullYear();
  const month = viewDate.getMonth();
  const grid = useMemo(() => {
    const first = new Date(year, month, 1);
    const startOffset = first.getDay();
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    const cells = [];
    for (let i = 0; i < startOffset; i++) cells.push(null);
    for (let d = 1; d <= daysInMonth; d++) cells.push(new Date(year, month, d));
    return cells;
  }, [year, month]);
  const yearOptions = [];
  for (let y = new Date().getFullYear() - 1; y <= new Date().getFullYear() + 5; y++) yearOptions.push(y);

  return (
    <div>
      <div className="flex items-center justify-between mb-4 gap-2">
        <button onClick={() => setViewDate(new Date(year, month - 1, 1))} className="p-2 rounded-lg" style={{ background: colors.panelLight, border: `1px solid ${colors.border}` }}>
          <ChevronLeft size={16} color={colors.text} />
        </button>
        {restrictPast ? (
          <div style={{ color: colors.text, fontWeight: 600, letterSpacing: "0.03em" }}>{MONTHS_ES[month]} {year}</div>
        ) : (
          <div className="flex items-center gap-2">
            <div style={{ color: colors.text, fontWeight: 600, letterSpacing: "0.03em" }}>{MONTHS_ES[month]}</div>
            <select value={year} onChange={(e) => setViewDate(new Date(Number(e.target.value), month, 1))} className="text-sm rounded-lg px-2 py-1" style={{ background: colors.panelLight, border: `1px solid ${colors.border}`, color: colors.text }}>
              {yearOptions.map((y) => <option key={y} value={y}>{y}</option>)}
            </select>
          </div>
        )}
        <button onClick={() => setViewDate(new Date(year, month + 1, 1))} className="p-2 rounded-lg" style={{ background: colors.panelLight, border: `1px solid ${colors.border}` }}>
          <ChevronRight size={16} color={colors.text} />
        </button>
      </div>
      <div className="grid grid-cols-7 gap-1 mb-2">
        {DAYS_ES.map((d) => <div key={d} className="text-center text-[10px] uppercase" style={{ color: colors.muted, letterSpacing: "0.1em" }}>{d}</div>)}
      </div>
      <div className="grid grid-cols-7 gap-1">
        {grid.map((d, i) => {
          if (!d) return <div key={i} />;
          const key = dateKey(d);
          const isSunday = restrictPast && d.getDay() === 0;
          const past = restrictPast && isPastDate(d);
          const blocked = restrictPast && blockedDays.includes(key);
          const disabled = isSunday || past || blocked;
          const isSelected = selected === key;
          return (
            <button key={i} disabled={disabled} onClick={() => onSelect(key)} className="aspect-square rounded-lg text-sm flex items-center justify-center transition"
              style={{ background: isSelected ? colors.accent : disabled ? "transparent" : colors.panelLight, color: disabled ? "#3a4763" : isSelected ? "#fff" : colors.text, border: `1px solid ${isSelected ? colors.accent : colors.border}`, cursor: disabled ? "not-allowed" : "pointer", textDecoration: disabled ? "line-through" : "none" }}>
              {d.getDate()}
            </button>
          );
        })}
      </div>
    </div>
  );
}
function ClienteView({ bookings, blockedDays, blockedHours, onCreateBooking, onCancelBooking, onGoAdmin, heroImages }) {
  const [heroIndex, setHeroIndex] = useState(0);
  useEffect(() => {
    if (heroImages.length <= 1) return;
    const t = setInterval(() => setHeroIndex((i) => (i + 1) % heroImages.length), 5000);
    return () => clearInterval(t);
  }, [heroImages.length]);
  const [step, setStep] = useState(1);
  const [service, setService] = useState(null);
  const [date, setDate] = useState(null);
  const [time, setTime] = useState(null);
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [eyebrows, setEyebrows] = useState(false);
  const [confirmed, setConfirmed] = useState(null);
  const [view, setView] = useState("reservar");
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [myIds, setMyIds] = useState([]);

  useEffect(() => {
    try {
      const stored = JSON.parse(localStorage.getItem("mis-citas-ids") || "[]");
      setMyIds(stored);
    } catch (e) {}
  }, []);

  const takenTimes = useMemo(() => {
    if (!date) return [];
    return bookings.filter((a) => a.date === date && a.status !== "cancelada").map((a) => a.time);
  }, [bookings, date]);

  const availableHours = useMemo(() => {
    if (!date) return [];
    const hrsBlocked = blockedHours[date] || [];
    const hrs = [];
    for (let h = OPEN_HOUR; h < CLOSE_HOUR; h++) if (!hrsBlocked.includes(h) && !takenTimes.includes(h)) hrs.push(h);
    return hrs;
  }, [date, blockedHours, takenTimes]);

  function reset() {
    setStep(1); setService(null); setDate(null); setTime(null);
    setName(""); setPhone(""); setEyebrows(false); setConfirmed(null); setError("");
  }

  async function confirmBooking() {
    setSubmitting(true);
    setError("");
    const result = await onCreateBooking({ service, date, time, name, phone, eyebrows });
    setSubmitting(false);
    if (result.error) {
      setError(result.error.message || "Ese horario ya se ocupó, elige otra hora.");
      setStep(3);
      return;
    }
    const newIds = [...myIds, result.id];
    setMyIds(newIds);
    try { localStorage.setItem("mis-citas-ids", JSON.stringify(newIds)); } catch (e) {}
    setConfirmed(result.booking);
    setStep(5);
  }

  function canCancel(a) {
    const [y, m, d] = a.date.split("-").map(Number);
    const apptDate = new Date(y, m - 1, d, a.time, 0, 0);
    return apptDate.getTime() - crNow().getTime() > 60 * 60 * 1000;
  }

  const myAppointments = bookings.filter((a) => myIds.includes(a.id) && a.status !== "cancelada");
  const waMessage = confirmed ? `Hola, soy ${confirmed.name}. Deseo mi cita en Barber Shop Caleb: ${confirmed.serviceName} el ${confirmed.date} a las ${formatHour(confirmed.time)}.${confirmed.eyebrows ? " Con arreglo de cejas." : ""}` : "";

  return (
    <div className="max-w-md mx-auto">
      {step === 1 && view === "reservar" ? (
        <div className="relative rounded-2xl overflow-hidden mb-5" style={{ height: 190 }}>
                    {heroImages.map((src, i) => (
            <img key={src} src={src} alt="Barber Shop Caleb" className="w-full h-full object-cover absolute inset-0"
              style={{ filter: "saturate(0.85) brightness(0.68)", opacity: i === heroIndex ? 1 : 0, transition: "opacity 1s ease" }} />
          ))}
          <div className="absolute inset-0" style={{ background: `linear-gradient(180deg, rgba(10,15,26,0.15) 0%, ${colors.bg} 96%)` }} />
          <div className="absolute bottom-3 left-4 right-4 flex items-end justify-between">
            <Logo />
            <button onClick={onGoAdmin} className="p-2 rounded-lg" style={{ background: "rgba(10,15,26,0.55)", border: `1px solid ${colors.border}` }}>
              <Settings size={14} color={colors.muted} />
            </button>
          </div>
        </div>
      ) : (
        <div className="flex items-center justify-between mb-6">
          <Logo />
          <button onClick={onGoAdmin} className="p-2 rounded-lg opacity-60" style={{ border: `1px solid ${colors.border}` }}>
            <Settings size={14} color={colors.muted} />
          </button>
        </div>
      )}

      <div className="flex gap-2 mb-5">
        <button onClick={() => setView("reservar")} className="flex-1 py-2 rounded-lg text-sm" style={{ background: view === "reservar" ? colors.accent : "transparent", color: view === "reservar" ? "#fff" : colors.muted, border: `1px solid ${view === "reservar" ? colors.accent : colors.border}`, fontWeight: 600 }}>Reservar</button>
        <button onClick={() => setView("mis-citas")} className="flex-1 py-2 rounded-lg text-sm" style={{ background: view === "mis-citas" ? colors.accent : "transparent", color: view === "mis-citas" ? "#fff" : colors.muted, border: `1px solid ${view === "mis-citas" ? colors.accent : colors.border}`, fontWeight: 600 }}>Mis citas</button>
      </div>

      {view === "mis-citas" && (
        <div className="space-y-3">
          {myAppointments.length === 0 && <Card><div className="text-center py-4" style={{ color: colors.muted }}>Aún no tienes citas reservadas desde este teléfono.</div></Card>}
          {myAppointments.map((a) => (
            <Card key={a.id}>
              <div className="flex justify-between items-start">
                <div>
                  <div style={{ color: colors.text, fontWeight: 600 }}>{a.serviceName}</div>
                  <div className="text-sm" style={{ color: colors.muted }}>{a.date} · {formatHour(a.time)}</div>
                  <div className="text-sm mt-1" style={{ color: colors.accent }}>{money(a.price)}</div>
                </div>
                {canCancel(a) ? (
                  <button onClick={() => onCancelBooking(a.id)} className="text-xs px-3 py-1.5 rounded-lg" style={{ background: "transparent", border: `1px solid ${colors.danger}`, color: colors.danger }}>Cancelar</button>
                ) : <span className="text-xs" style={{ color: colors.muted }}>No cancelable</span>}
              </div>
            </Card>
          ))}
        </div>
      )}

      {view === "reservar" && (
        <>
          {step === 1 && (
            <Card>
              <StepLabel n={1} label="Elige tu servicio" />
              <div className="space-y-3">
                {SERVICES.map((s) => {
                  const Icon = s.icon;
                  return (
                    <button key={s.id} onClick={() => { setService(s); setStep(2); }} className="w-full flex items-center gap-4 p-4 rounded-xl text-left transition" style={{ background: colors.panelLight, border: `1px solid ${colors.border}` }}>
                      <div className="flex items-center justify-center rounded-lg shrink-0" style={{ width: 44, height: 44, background: colors.accentSoft }}><Icon size={20} color={colors.accent} /></div>
                      <div className="flex-1"><div style={{ color: colors.text, fontWeight: 600 }}>{s.name}</div><div className="text-xs" style={{ color: colors.muted }}>{s.desc}</div></div>
                      <div style={{ color: colors.accent, fontWeight: 600 }}>{money(s.price)}</div>
                    </button>
                  );
                })}
              </div>
            </Card>
          )}
          {step === 1 && (
            <div className="text-xs text-center mt-4 px-2" style={{ color: colors.muted }}>
              ✂️ ¡Bienvenidos sin cita previa! Con gusto te atenderemos; solo agradecemos tu paciencia!
            </div>
          )}

          {step === 2 && (
            <Card>
              <div className="flex items-center gap-2 mb-4"><button onClick={() => setStep(1)}><ArrowLeft size={16} color={colors.muted} /></button><StepLabel n={2} label="Elige la fecha" /></div>
              <Calendar selected={date} onSelect={(d) => { setDate(d); setStep(3); }} blockedDays={blockedDays} />
            </Card>
          )}

          {step === 3 && (
            <Card>
              <div className="flex items-center gap-2 mb-4"><button onClick={() => setStep(2)}><ArrowLeft size={16} color={colors.muted} /></button><StepLabel n={3} label="Elige la hora" /></div>
              {error && <div className="text-sm mb-3 text-center" style={{ color: colors.danger }}>{error}</div>}
              {availableHours.length === 0 ? (
                <div className="text-center py-6" style={{ color: colors.muted }}>No hay horas disponibles ese día. Elige otra fecha.</div>
              ) : (
                <div className="grid grid-cols-3 gap-2">
                  {availableHours.map((h) => (
                    <button key={h} onClick={() => { setTime(h); setStep(4); }} className="py-2.5 rounded-lg text-sm" style={{ background: colors.panelLight, border: `1px solid ${colors.border}`, color: colors.text }}>{formatHour(h)}</button>
                  ))}
                </div>
              )}
            </Card>
          )}

          {step === 4 && (
            <Card>
              <div className="flex items-center gap-2 mb-4"><button onClick={() => setStep(3)}><ArrowLeft size={16} color={colors.muted} /></button><StepLabel n={4} label="Tus datos" /></div>
              <div className="space-y-3 mb-4">
                <div><label className="text-xs" style={{ color: colors.muted }}>Nombre completo</label>
                  <input value={name} onChange={(e) => setName(e.target.value)} className="w-full mt-1 p-3 rounded-lg text-sm" style={{ background: colors.panelLight, border: `1px solid ${colors.border}`, color: colors.text }} placeholder="Tu nombre" />
                </div>
                <div><label className="text-xs" style={{ color: colors.muted }}>Teléfono</label>
                  <input value={phone} onChange={(e) => setPhone(e.target.value)} className="w-full mt-1 p-3 rounded-lg text-sm" style={{ background: colors.panelLight, border: `1px solid ${colors.border}`, color: colors.text }} placeholder="8888-8888" />
                </div>
              </div>
              <div className="flex items-center justify-between p-3 rounded-lg mb-4" style={{ background: colors.accentSoft, border: `1px solid ${colors.accentDeep}` }}>
                <div className="text-sm" style={{ color: colors.text }}>✨ Llévate arreglo de cejas gratis</div>
                <button onClick={() => setEyebrows(!eyebrows)} className="w-11 h-6 rounded-full relative transition" style={{ background: eyebrows ? colors.accent : colors.border }}>
                  <div className="absolute top-0.5 w-5 h-5 rounded-full bg-white transition" style={{ left: eyebrows ? 22 : 2 }} />
                </button>
              </div>
              <Card style={{ background: colors.panelLight, marginBottom: 16 }}>
                <div className="text-sm" style={{ color: colors.muted }}>Resumen</div>
                <div className="mt-1" style={{ color: colors.text }}>{service?.name} · {date} · {formatHour(time)}</div>
                <div className="mt-1" style={{ color: colors.accent, fontWeight: 600 }}>{money(service?.price || 0)}</div>
              </Card>
              <button disabled={!name || !phone || submitting} onClick={confirmBooking} className="w-full py-3 rounded-xl text-sm" style={{ background: !name || !phone || submitting ? colors.border : colors.accent, color: "#fff", fontWeight: 600, opacity: !name || !phone || submitting ? 0.5 : 1 }}>
                {submitting ? "Reservando..." : "Confirmar cita"}
              </button>
            </Card>
          )}

          {step === 5 && confirmed && (
            <Card>
              <div className="text-center py-2">
                <div className="mx-auto flex items-center justify-center rounded-full mb-4" style={{ width: 56, height: 56, background: colors.accentSoft, border: `1px solid ${colors.success}` }}><Check size={24} color={colors.success} /></div>
                <div style={{ color: colors.text, fontWeight: 600 }} className="text-lg mb-1">¡Cita confirmada!</div>
                <div className="text-sm mb-5" style={{ color: colors.muted }}>{confirmed.serviceName} · {confirmed.date} · {formatHour(confirmed.time)}</div>
                <a href={`https://wa.me/${PHONE}?text=${encodeURIComponent(waMessage)}`} target="_blank" rel="noopener noreferrer" className="w-full flex items-center justify-center gap-2 py-3 rounded-xl text-sm mb-3" style={{ background: colors.success, color: "#fff", fontWeight: 600 }}>
                  <MessageCircle size={16} /> Enviar por WhatsApp
                </a>
                <button onClick={reset} className="w-full py-3 rounded-xl text-sm" style={{ background: colors.panelLight, border: `1px solid ${colors.border}`, color: colors.text }}>Reservar otra cita</button>
              </div>
            </Card>
          )}
        </>
      )}
    </div>
  );
}

function AdminView({ bookings, blockedDays, blockedHours, extraIncome, onCancelBooking, onToggleDay, onToggleHour, onAddExtra, onExit }) {
  const [unlocked, setUnlocked] = useState(false);
  const [pin, setPin] = useState("");
  const [pinError, setPinError] = useState(false);
  const [tab, setTab] = useState("citas");
    const [manageDate, setManageDate] = useState(dateKey(new Date()));
  const [citasDate, setCitasDate] = useState(dateKey(new Date()));
  const [extraAmount, setExtraAmount] = useState("");
  const [extraNote, setExtraNote] = useState("");

  const active = bookings.filter((a) => a.status !== "cancelada");

 function handleToggleDay() {
    const isBlocking = !blockedDays.includes(manageDate);
    if (isBlocking) {
      const affected = active.filter((a) => a.date === manageDate);
      if (affected.length > 0) {
        if (!window.confirm(`Hay ${affected.length} cita(s) agendada(s) ese día. Si bloqueas, esas citas se CANCELARÁN automáticamente. ¿Continuar?`)) return;
        affected.forEach((a) => onCancelBooking(a.id));
      }
    }
    onToggleDay(manageDate);
  }
  
  function handleToggleHour(h) {
    const isBlocking = !(blockedHours[manageDate] || []).includes(h);
    if (isBlocking) {
      const conflict = active.find((a) => a.date === manageDate && a.time === h);
      if (conflict) {
        if (!window.confirm(`Ya hay una cita a las ${formatHour(h)} (${conflict.name}). Si bloqueas, esa cita se CANCELARÁ automáticamente. ¿Continuar?`)) return;
        onCancelBooking(conflict.id);
      }
    }
    onToggleHour(manageDate, h);
  }
  const revenue = useMemo(() => {
    const todayKey = crTodayKey();
    const happened = active.filter((a) => a.date <= todayKey);
    const now = crNow();
    const startOfWeek = new Date(now);
    const dow = (now.getDay() + 6) % 7;
    startOfWeek.setDate(now.getDate() - dow);
    startOfWeek.setHours(0, 0, 0, 0);
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    const halfStart = now.getDate() <= 15 ? new Date(now.getFullYear(), now.getMonth(), 1) : new Date(now.getFullYear(), now.getMonth(), 16);
    function sumSince(start) {
      const fromBookings = happened.filter((a) => { const [y, m, d] = a.date.split("-").map(Number); return new Date(y, m - 1, d) >= start; }).reduce((acc, a) => acc + a.price, 0);
      const fromExtra = extraIncome.filter((e) => { const [y, m, d] = e.date.split("-").map(Number); return new Date(y, m - 1, d) >= start; }).reduce((acc, e) => acc + e.amount, 0);
      return fromBookings + fromExtra;
    }
    return {
      week: sumSince(startOfWeek), biweek: sumSince(halfStart), month: sumSince(startOfMonth),
      countMonth: happened.filter((a) => { const [y, m, d] = a.date.split("-").map(Number); return new Date(y, m - 1, d) >= startOfMonth; }).length,
    };
  }, [active, extraIncome]);

  if (!unlocked) {
    return (
      <div className="max-w-sm mx-auto pt-20">
        <Card>
          <div className="text-center mb-4"><Lock size={20} color={colors.accent} className="mx-auto mb-2" /><div style={{ color: colors.text, fontWeight: 600 }}>Panel administrativo</div></div>
          <input type="tel" inputMode="numeric" autoFocus value={pin} onChange={(e) => { setPin(e.target.value); setPinError(false); }}
            onKeyDown={(e) => { if (e.key === "Enter") { if (pin === ADMIN_PIN) setUnlocked(true); else setPinError(true); } }}
            placeholder="PIN" className="w-full p-3 rounded-lg text-sm mb-2 text-center" style={{ background: colors.panelLight, border: `1px solid ${pinError ? colors.danger : colors.border}`, color: colors.text }} />
          {pinError && <div className="text-xs text-center mb-2" style={{ color: colors.danger }}>PIN incorrecto, intenta de nuevo.</div>}
          <button onClick={() => { if (pin === ADMIN_PIN) setUnlocked(true); else setPinError(true); }} className="w-full py-3 rounded-xl text-sm mb-2" style={{ background: colors.accent, color: "#fff", fontWeight: 600 }}>Entrar</button>
          <button onClick={onExit} className="w-full py-2 text-sm" style={{ color: colors.muted }}>Volver a reservas</button>
        </Card>
      </div>
    );
  }

  return (
    <div className="max-w-md mx-auto">
      <div className="flex items-center justify-between mb-6"><Logo /><button onClick={onExit} className="p-2 rounded-lg" style={{ border: `1px solid ${colors.border}` }}><Unlock size={14} color={colors.muted} /></button></div>
      <div className="grid grid-cols-3 gap-2 mb-5">
        {[["citas", "Citas"], ["ingresos", "Ingresos"], ["horarios", "Horarios"]].map(([k, label]) => (
          <button key={k} onClick={() => setTab(k)} className="py-2 rounded-lg text-xs" style={{ background: tab === k ? colors.accent : "transparent", color: tab === k ? "#fff" : colors.muted, border: `1px solid ${tab === k ? colors.accent : colors.border}`, fontWeight: 600 }}>{label}</button>
        ))}
      </div>
            {tab === "citas" && (
        <div className="space-y-3">
          <Card>
            <Calendar selected={citasDate} onSelect={setCitasDate} blockedDays={[]} restrictPast={false} />
          </Card>
          <div className="text-xs uppercase mt-2 mb-1 px-1" style={{ color: colors.muted, letterSpacing: "0.1em" }}>
            Citas del {citasDate}
          </div>
          {active.filter((a) => a.date === citasDate).length === 0 && <Card><div className="text-center py-4" style={{ color: colors.muted }}>Sin citas ese día.</div></Card>}
          {active.filter((a) => a.date === citasDate).sort((a, b) => a.time - b.time).map((a) => (
            <Card key={a.id}>
              <div className="flex justify-between items-start">
                <div>
                  <div style={{ color: colors.text, fontWeight: 600 }}>{a.name}</div>
                  <div className="text-xs" style={{ color: colors.muted }}>{a.serviceName} · {formatHour(a.time)}</div>
                  <div className="text-xs flex items-center gap-1 mt-1" style={{ color: colors.muted }}><Phone size={10} /> {a.phone}</div>
                </div>
                <div className="flex flex-col gap-1.5 items-end">
                  <span className="text-xs px-2 py-0.5 rounded-full" style={{ color: colors.success, border: `1px solid ${colors.success}` }}>Asistirá</span>
                  <button onClick={() => { if (window.confirm(`¿Cancelar la cita de ${a.name}? Úsalo solo si te avisó personalmente que no va a llegar.`)) onCancelBooking(a.id); }} className="text-xs px-3 py-1 rounded-lg" style={{ background: "transparent", border: `1px solid ${colors.danger}`, color: colors.danger }}>Cancelar</button>
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}

      {tab === "ingresos" && (
        <div className="space-y-3">
          <Card><div className="flex items-center gap-2 mb-1"><DollarSign size={14} color={colors.accent} /><div className="text-xs uppercase" style={{ color: colors.muted, letterSpacing: "0.1em" }}>Esta semana</div></div><div className="text-2xl" style={{ color: colors.text, fontWeight: 700 }}>{money(revenue.week)}</div></Card>
          <Card><div className="flex items-center gap-2 mb-1"><DollarSign size={14} color={colors.accent} /><div className="text-xs uppercase" style={{ color: colors.muted, letterSpacing: "0.1em" }}>Quincena actual</div></div><div className="text-2xl" style={{ color: colors.text, fontWeight: 700 }}>{money(revenue.biweek)}</div></Card>
          <Card><div className="flex items-center gap-2 mb-1"><DollarSign size={14} color={colors.accent} /><div className="text-xs uppercase" style={{ color: colors.muted, letterSpacing: "0.1em" }}>Este mes</div></div><div className="text-2xl" style={{ color: colors.text, fontWeight: 700 }}>{money(revenue.month)}</div><div className="text-xs mt-1" style={{ color: colors.muted }}>{revenue.countMonth} cortes completados</div></Card>
          <div className="text-xs text-center pt-2 mb-4" style={{ color: colors.muted }}>Solo cuenta citas de días que ya llegaron, no reservas futuras.</div>
          <Card>
            <div className="text-sm mb-3" style={{ color: colors.text, fontWeight: 600 }}>Agregar ingreso extra de hoy</div>
            <input type="number" value={extraAmount} onChange={(e) => setExtraAmount(e.target.value)} placeholder="Monto (₡)" className="w-full p-3 rounded-lg text-sm mb-2" style={{ background: colors.panelLight, border: `1px solid ${colors.border}`, color: colors.text }} />
            <input value={extraNote} onChange={(e) => setExtraNote(e.target.value)} placeholder="Nota (opcional, ej: cliente sin cita)" className="w-full p-3 rounded-lg text-sm mb-3" style={{ background: colors.panelLight, border: `1px solid ${colors.border}`, color: colors.text }} />
            <button onClick={() => { const amt = parseInt(extraAmount, 10); if (amt > 0) { onAddExtra(amt, extraNote); setExtraAmount(""); setExtraNote(""); } }} className="w-full py-2.5 rounded-xl text-sm" style={{ background: colors.accent, color: "#fff", fontWeight: 600 }}>Agregar</button>
          </Card>
          {extraIncome.filter((e) => e.date === crTodayKey()).length > 0 && (
            <Card>
              <div className="text-xs uppercase mb-2" style={{ color: colors.muted, letterSpacing: "0.1em" }}>Extras de hoy</div>
              <div className="space-y-2">{extraIncome.filter((e) => e.date === crTodayKey()).map((e) => (<div key={e.id} className="flex justify-between text-sm"><span style={{ color: colors.muted }}>{e.note || "Sin nota"}</span><span style={{ color: colors.text, fontWeight: 600 }}>{money(e.amount)}</span></div>))}</div>
            </Card>
          )}
        </div>
      )}

      {tab === "horarios" && (
        <Card>
          <div className="text-sm mb-3" style={{ color: colors.muted }}>Elige la fecha a administrar</div>
          <input type="date" value={manageDate} onChange={(e) => setManageDate(e.target.value)} className="w-full p-3 rounded-lg text-sm mb-4" style={{ background: colors.panelLight, border: `1px solid ${colors.border}`, color: colors.text }} />
          <div className="flex items-center justify-between p-3 rounded-lg mb-4" style={{ background: colors.panelLight, border: `1px solid ${colors.border}` }}>
            <div className="text-sm" style={{ color: colors.text }}>Bloquear día completo</div>
            <button onClick={handleToggleDay} className="w-11 h-6 rounded-full relative" style={{ background: blockedDays.includes(manageDate) ? colors.danger : colors.border }}>
              <div className="absolute top-0.5 w-5 h-5 rounded-full bg-white" style={{ left: blockedDays.includes(manageDate) ? 22 : 2 }} />
            </button>
          </div>
          <div className="text-xs mb-2" style={{ color: colors.muted }}>Bloquear horas individuales</div>
          <div className="grid grid-cols-2 gap-2">
            {Array.from({ length: CLOSE_HOUR - OPEN_HOUR }, (_, i) => OPEN_HOUR + i).map((h) => {
              const blocked = (blockedHours[manageDate] || []).includes(h);
              return (
               <button key={h} onClick={() => handleToggleHour(h)} className="py-2 rounded-lg text-xs flex items-center justify-center gap-1" style={{ background: blocked ? colors.accentSoft : colors.panelLight, border: `1px solid ${blocked ? colors.danger : colors.border}`, color: blocked ? colors.danger : colors.text, textDecoration: blocked ? "line-through" : "none" }}>{formatHour(h)}</button>
              );
            })}
          </div>
        </Card>
      )}
    </div>
  );
}

export default function App() {
  const [bookings, setBookings] = useState([]);
  const [blockedDays, setBlockedDays] = useState([]);
  const [blockedHours, setBlockedHours] = useState({});
  const [extraIncome, setExtraIncome] = useState([]);
  const [screen, setScreen] = useState("cliente");
  const [loaded, setLoaded] = useState(false);

  async function fetchAll() {
    const [{ data: b }, { data: bd }, { data: bh }, { data: ei }] = await Promise.all([
      supabase.from("bookings").select("*"),
      supabase.from("blocked_days").select("*"),
      supabase.from("blocked_hours").select("*"),
      supabase.from("extra_income").select("*"),
    ]);
    if (b) setBookings(b.map((r) => ({
      id: r.id, service: r.service_id, serviceName: r.service_name, price: r.price,
      date: r.appt_date, time: r.appt_hour, name: r.client_name, phone: r.client_phone,
      eyebrows: r.eyebrows, status: r.status,
    })));
    if (bd) setBlockedDays(bd.map((r) => r.appt_date));
    if (bh) {
      const grouped = {};
      bh.forEach((r) => { grouped[r.appt_date] = [...(grouped[r.appt_date] || []), r.appt_hour]; });
      setBlockedHours(grouped);
    }
    if (ei) setExtraIncome(ei.map((r) => ({ id: r.id, amount: r.amount, note: r.note, date: r.income_date })));
    setLoaded(true);
  }

  useEffect(() => {
    fetchAll();
    const channel = supabase
      .channel("barberia-changes")
      .on("postgres_changes", { event: "*", schema: "public", table: "bookings" }, fetchAll)
      .on("postgres_changes", { event: "*", schema: "public", table: "blocked_days" }, fetchAll)
      .on("postgres_changes", { event: "*", schema: "public", table: "blocked_hours" }, fetchAll)
      .on("postgres_changes", { event: "*", schema: "public", table: "extra_income" }, fetchAll)
      .subscribe();
    return () => { supabase.removeChannel(channel); };
  }, []);

  async function onCreateBooking({ service, date, time, name, phone, eyebrows }) {
    const { data, error } = await supabase.from("bookings").insert({
      service_id: service.id, service_name: service.name, price: service.price,
      appt_date: date, appt_hour: time, client_name: name, client_phone: phone, eyebrows,
    }).select().single();
    if (error) return { error };
    await fetchAll();
    return { id: data.id, booking: { id: data.id, serviceName: service.name, price: service.price, date, time, name, phone, eyebrows } };
  }

  async function onCancelBooking(id) {
    await supabase.from("bookings").update({ status: "cancelada" }).eq("id", id);
  }

  async function onToggleDay(key) {
    if (blockedDays.includes(key)) await supabase.from("blocked_days").delete().eq("appt_date", key);
    else await supabase.from("blocked_days").insert({ appt_date: key });
  }

  async function onToggleHour(key, hour) {
    const current = blockedHours[key] || [];
    if (current.includes(hour)) await supabase.from("blocked_hours").delete().eq("appt_date", key).eq("appt_hour", hour);
    else await supabase.from("blocked_hours").insert({ appt_date: key, appt_hour: hour });
  }

  async function onAddExtra(amount, note) {
    await supabase.from("extra_income").insert({ amount, note });
  }

  if (!loaded) {
    return <div className="min-h-screen flex items-center justify-center" style={{ background: colors.bg }}><div style={{ color: colors.muted }}>Cargando...</div></div>;
  }

  return (
    <div className="min-h-screen" style={{ background: colors.bg }}>
      <Stripe />
      <div className="p-5 pb-16">
        {screen === "cliente" ? (
          <ClienteView bookings={bookings} blockedDays={blockedDays} blockedHours={blockedHours}
                        onCreateBooking={onCreateBooking} onCancelBooking={onCancelBooking} onGoAdmin={() => setScreen("admin")} heroImages={HERO_IMAGES} />
        ) : (
          <AdminView bookings={bookings} blockedDays={blockedDays} blockedHours={blockedHours} extraIncome={extraIncome}
            onCancelBooking={onCancelBooking} onToggleDay={onToggleDay} onToggleHour={onToggleHour} onAddExtra={onAddExtra} onExit={() => setScreen("cliente")} />
        )}
      </div>
    </div>
  );
}
