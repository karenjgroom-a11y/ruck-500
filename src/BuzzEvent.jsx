import React, { useEffect, useMemo, useRef, useState } from "react";
import { ArrowLeft, Camera, Check, Coffee, Flag, Image as ImageIcon, MapPin, RotateCcw, Trophy, X } from "lucide-react";

const LIME = "#C6E70A";
const LIME_DEEP = "#9FB800";
const INK = "#0D0D0D";
const INK_SOFT = "#1A1A1A";
const CREAM = "#F3F3EE";
const COFFEE = "#3B2417";
const KHAKI = "#767A54";

const EVENT = {
  id: "jan2027",
  name: "New Year Buzz Ruck",
  route: "Minnis Bay → Reculver → Minnis Bay",
  distanceKm: 12,
  dateStr: "9 January 2027",
  meetPoint: "Minnis Bay Car Park",
  meetTime: "1:00 PM",
  checkpoints: [
    { id: "cp1", name: "The Seawall Start", desc: "First stamp — get the crew moving along the coast path.", instructions: "Location to be confirmed after the route recce. Default: Minnis Bay slipway.", emoji: "🎒" },
    { id: "cp2", name: "Reculver Towers", desc: "The big one. Twin towers on the skyline.", instructions: "Get the whole group under the towers. Quick photo, then get moving.", emoji: "🏰" },
    { id: "cp3", name: "King Ethelbert Inn", desc: "Reculver's local landmark.", instructions: "Stand by the pub sign with your crew.", emoji: "🍺" },
    { id: "cp4", name: "The Last Stretch", desc: "Final stamp before the turn for home.", instructions: "Location to be confirmed after the route recce.", emoji: "🚩" },
  ],
};

const META_KEY = "ruckbuzz-jan2027:participant";
const DB_NAME = "ruck500-buzz-photos";
const DB_VERSION = 1;
const STORE_NAME = "checkpointPhotos";

function blankParticipant(prefill = "") {
  const trimmed = String(prefill || "").trim();
  const parts = trimmed.split(/\s+/).filter(Boolean);
  return {
    firstName: parts[0] || "",
    surname: parts.slice(1).join(" "),
    nickname: "",
    startTime: null,
    checkpointTimes: {},
    finishTime: null,
  };
}

function loadMeta(prefill) {
  try {
    const raw = localStorage.getItem(META_KEY);
    if (raw) return { ...blankParticipant(prefill), ...JSON.parse(raw) };
  } catch {}
  return blankParticipant(prefill);
}

function saveMeta(meta) {
  localStorage.setItem(META_KEY, JSON.stringify(meta));
}

function openDb() {
  return new Promise((resolve, reject) => {
    const req = indexedDB.open(DB_NAME, DB_VERSION);
    req.onupgradeneeded = () => {
      const db = req.result;
      if (!db.objectStoreNames.contains(STORE_NAME)) db.createObjectStore(STORE_NAME);
    };
    req.onsuccess = () => resolve(req.result);
    req.onerror = () => reject(req.error);
  });
}

async function getPhoto(key) {
  const db = await openDb();
  return new Promise((resolve, reject) => {
    const tx = db.transaction(STORE_NAME, "readonly");
    const req = tx.objectStore(STORE_NAME).get(key);
    req.onsuccess = () => resolve(req.result || null);
    req.onerror = () => reject(req.error);
    tx.oncomplete = () => db.close();
  });
}

async function putPhoto(key, value) {
  const db = await openDb();
  return new Promise((resolve, reject) => {
    const tx = db.transaction(STORE_NAME, "readwrite");
    tx.objectStore(STORE_NAME).put(value, key);
    tx.oncomplete = () => { db.close(); resolve(); };
    tx.onerror = () => { db.close(); reject(tx.error); };
  });
}

function compressImage(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const img = new Image();
      img.onload = () => {
        const maxW = 900;
        const scale = Math.min(1, maxW / img.width);
        const w = Math.round(img.width * scale);
        const h = Math.round(img.height * scale);
        const canvas = document.createElement("canvas");
        canvas.width = w;
        canvas.height = h;
        const ctx = canvas.getContext("2d");
        ctx.drawImage(img, 0, 0, w, h);
        canvas.toBlob((blob) => blob ? resolve(blob) : reject(new Error("Could not compress image")), "image/jpeg", 0.62);
      };
      img.onerror = reject;
      img.src = e.target.result;
    };
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}

function fmtTime(ts) {
  if (!ts) return "—";
  return new Date(ts).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
}

function fmtDate(ts) {
  if (!ts) return "";
  return new Date(ts).toLocaleDateString([], { day: "numeric", month: "short", year: "numeric" });
}

function fmtElapsed(ms) {
  if (!ms || ms < 0) ms = 0;
  const totalSec = Math.floor(ms / 1000);
  const h = Math.floor(totalSec / 3600);
  const m = Math.floor((totalSec % 3600) / 60);
  const s = totalSec % 60;
  return `${String(h).padStart(2, "0")}:${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")}`;
}

function LoopGraphic() {
  return (
    <svg viewBox="0 0 330 110" width="100%" role="img" aria-label="12 kilometre loop from Minnis Bay to Reculver and back">
      <defs>
        <marker id="event-loop-arrow" markerWidth="8" markerHeight="8" refX="6" refY="4" orient="auto">
          <path d="M0,0 L8,4 L0,8 Z" fill={LIME} />
        </marker>
      </defs>
      <path d="M75 32 C120 4 211 4 256 32" fill="none" stroke={LIME} strokeWidth="4" strokeLinecap="round" markerEnd="url(#event-loop-arrow)" />
      <path d="M256 76 C211 104 120 104 75 76" fill="none" stroke={LIME} strokeWidth="4" strokeLinecap="round" markerEnd="url(#event-loop-arrow)" />
      <circle cx="66" cy="54" r="9" fill={LIME} />
      <circle cx="265" cy="54" r="9" fill={LIME} />
      <text x="8" y="58" fill={CREAM} fontSize="13" fontWeight="700">MINNIS BAY</text>
      <text x="278" y="58" fill={CREAM} fontSize="13" fontWeight="700">RECULVER</text>
      <text x="165" y="50" fill="white" fontSize="22" fontWeight="800" textAnchor="middle">12K</text>
      <text x="165" y="70" fill="#BDBDB8" fontSize="11" fontWeight="700" textAnchor="middle">LOOP</text>
    </svg>
  );
}

export default function BuzzEvent({ onExit, ruck500Name = "" }) {
  const [participant, setParticipant] = useState(() => loadMeta(ruck500Name));
  const [screen, setScreen] = useState("loading");
  const [activeCpId, setActiveCpId] = useState(null);
  const [photos, setPhotos] = useState({});
  const [pendingPhoto, setPendingPhoto] = useState(null);
  const [toast, setToast] = useState("");
  const [now, setNow] = useState(Date.now());
  const [firstName, setFirstName] = useState(participant.firstName || "");
  const [surname, setSurname] = useState(participant.surname || "");
  const [nickname, setNickname] = useState(participant.nickname || "");
  const toastTimer = useRef(null);

  function showToast(msg) {
    setToast(msg);
    clearTimeout(toastTimer.current);
    toastTimer.current = setTimeout(() => setToast(""), 2200);
  }

  useEffect(() => () => clearTimeout(toastTimer.current), []);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      const loaded = {};
      for (const cp of EVENT.checkpoints) {
        try {
          const blob = await getPhoto(`${EVENT.id}:${cp.id}`);
          if (blob) loaded[cp.id] = URL.createObjectURL(blob);
        } catch {}
      }
      if (cancelled) {
        Object.values(loaded).forEach((url) => URL.revokeObjectURL(url));
        return;
      }
      setPhotos(loaded);
      const nextScreen = participant.finishTime
        ? "complete"
        : participant.startTime
          ? "hub"
          : participant.firstName && participant.surname
            ? "welcome"
            : "landing";
      setScreen(nextScreen);
    })();
    return () => { cancelled = true; };
  }, []);

  useEffect(() => {
    if (screen !== "hub" || !participant.startTime) return;
    const t = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(t);
  }, [screen, participant.startTime]);

  function persistParticipant(next) {
    setParticipant(next);
    saveMeta(next);
  }

  function displayName() {
    return participant.nickname || [participant.firstName, participant.surname].filter(Boolean).join(" ") || "Rucker";
  }

  const doneCount = useMemo(
    () => EVENT.checkpoints.filter((cp) => participant.checkpointTimes?.[cp.id]).length,
    [participant.checkpointTimes]
  );
  const allDone = doneCount === EVENT.checkpoints.length;

  function checkpointStatus(cp, idx) {
    if (participant.checkpointTimes?.[cp.id]) return "done";
    const prevDone = idx === 0 || participant.checkpointTimes?.[EVENT.checkpoints[idx - 1].id];
    return prevDone ? "active" : "todo";
  }

  function doRegister() {
    const first = firstName.trim();
    const last = surname.trim();
    if (!first || !last) {
      showToast("Add your first name and surname");
      return;
    }
    const next = { ...participant, firstName: first, surname: last, nickname: nickname.trim() };
    persistParticipant(next);
    setScreen("welcome");
  }

  function doStart() {
    const next = { ...participant, startTime: Date.now(), finishTime: null };
    persistParticipant(next);
    setNow(Date.now());
    setScreen("hub");
  }

  async function handlePhoto(file) {
    if (!file) return;
    showToast("Processing photo…");
    try {
      const blob = await compressImage(file);
      if (pendingPhoto?.url) URL.revokeObjectURL(pendingPhoto.url);
      setPendingPhoto({ blob, url: URL.createObjectURL(blob) });
    } catch {
      showToast("Could not read photo — try again");
    }
  }

  async function stampCheckpoint() {
    if (!activeCpId || !pendingPhoto?.blob) return;
    try {
      await putPhoto(`${EVENT.id}:${activeCpId}`, pendingPhoto.blob);
      const cp = EVENT.checkpoints.find((c) => c.id === activeCpId);
      const ts = Date.now();
      const next = {
        ...participant,
        checkpointTimes: { ...participant.checkpointTimes, [activeCpId]: ts },
      };
      persistParticipant(next);

      setPhotos((prev) => {
        if (prev[activeCpId]) URL.revokeObjectURL(prev[activeCpId]);
        return { ...prev, [activeCpId]: pendingPhoto.url };
      });
      setPendingPhoto(null);
      setActiveCpId(null);
      setScreen("hub");
      showToast(`${cp?.name || "Checkpoint"} stamped ✓`);
    } catch {
      showToast("Could not save photo on this device");
    }
  }

  function doFinish() {
    const next = { ...participant, finishTime: Date.now() };
    persistParticipant(next);
    setScreen("complete");
  }

  async function downloadCertificate() {
    const W = 1000, H = 860;
    const canvas = document.createElement("canvas");
    canvas.width = W; canvas.height = H;
    const ctx = canvas.getContext("2d");
    ctx.fillStyle = COFFEE; ctx.fillRect(0, 0, W, H);
    ctx.fillStyle = CREAM; ctx.fillRect(30, 30, W - 60, H - 60);
    ctx.strokeStyle = COFFEE; ctx.lineWidth = 6; ctx.strokeRect(48, 48, W - 96, H - 96);
    ctx.strokeStyle = COFFEE; ctx.lineWidth = 2; ctx.strokeRect(58, 58, W - 116, H - 116);
    ctx.textAlign = "center"; ctx.fillStyle = COFFEE;
    ctx.font = "300 20px Georgia, serif";
    ctx.fillText("C E R T I F I C A T E   O F   C O M P L E T I O N", W / 2, 120);
    ctx.font = "700 42px Arial";
    ctx.fillText("RUCK BUZZ", W / 2, 177);
    ctx.font = "16px Arial";
    ctx.fillText(EVENT.route, W / 2, 208);
    ctx.font = "700 52px Arial";
    ctx.fillText(displayName(), W / 2, 285);
    ctx.font = "16px Arial";
    ctx.fillText(`has completed the ${EVENT.distanceKm}km ruck${allDone ? ", all checkpoints stamped" : ""}.`, W / 2, 323);
    ctx.font = "13px Arial"; ctx.fillStyle = KHAKI;
    ctx.fillText("DATE", W / 2 - 150, 374);
    ctx.fillText("TOTAL TIME", W / 2 + 150, 374);
    ctx.font = "700 20px Arial"; ctx.fillStyle = COFFEE;
    ctx.fillText(fmtDate(participant.finishTime), W / 2 - 150, 402);
    ctx.fillText(fmtElapsed(participant.finishTime - participant.startTime), W / 2 + 150, 402);

    const rowY = 455, thumb = 190, gap = 20;
    const totalW = EVENT.checkpoints.length * thumb + (EVENT.checkpoints.length - 1) * gap;
    let x = W / 2 - totalW / 2;

    for (const cp of EVENT.checkpoints) {
      ctx.fillStyle = KHAKI; ctx.fillRect(x, rowY, thumb, thumb);
      const url = photos[cp.id];
      if (url) {
        const img = new Image();
        await new Promise((resolve) => { img.onload = resolve; img.onerror = resolve; img.src = url; });
        if (img.width) {
          const s = Math.max(thumb / img.width, thumb / img.height);
          const iw = img.width * s, ih = img.height * s;
          ctx.save();
          ctx.beginPath(); ctx.rect(x, rowY, thumb, thumb); ctx.clip();
          ctx.drawImage(img, x + (thumb - iw) / 2, rowY + (thumb - ih) / 2, iw, ih);
          ctx.restore();
        }
      }
      ctx.strokeStyle = COFFEE; ctx.lineWidth = 3; ctx.strokeRect(x, rowY, thumb, thumb);
      ctx.fillStyle = COFFEE; ctx.font = "600 13px Arial";
      ctx.fillText(cp.name, x + thumb / 2, rowY + thumb + 22);
      x += thumb + gap;
    }

    ctx.font = "14px Arial"; ctx.fillStyle = KHAKI;
    ctx.fillText("MINNIS BAY  →  RECULVER  →  MINNIS BAY", W / 2, H - 50);

    canvas.toBlob(async (blob) => {
      if (!blob) return;
      const file = new File([blob], "ruck-buzz-certificate.png", { type: "image/png" });
      if (navigator.share && navigator.canShare?.({ files: [file] })) {
        try {
          await navigator.share({ files: [file], title: "Ruck Buzz Certificate" });
          return;
        } catch {}
      }
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url; a.download = "ruck-buzz-certificate.png"; a.click();
      URL.revokeObjectURL(url);
    }, "image/png");
  }

  const shell = {
    position: "fixed", inset: 0, zIndex: 80, overflowY: "auto", overflowX: "hidden",
    background: INK, color: CREAM, fontFamily: "'Barlow', system-ui, sans-serif",
    width: "100vw", maxWidth: "100vw", WebkitOverflowScrolling: "touch",
  };

  const topbar = (
    <div style={{ position: "sticky", top: 0, zIndex: 5, background: "rgba(13,13,13,0.96)", borderBottom: "1px solid #262626" }} className="px-5 py-3 flex items-center justify-between">
      <button onClick={onExit} className="flex items-center gap-1 text-sm font-semibold" style={{ color: LIME, background: "none" }}>
        <ArrowLeft size={17} /> Ruck 500
      </button>
      <span className="font-bold uppercase tracking-wide text-xs" style={{ color: "#c8c8c2" }}>New Year Buzz Ruck</span>
    </div>
  );

  if (screen === "loading") {
    return <div style={shell}>{topbar}<div className="p-8 text-center" style={{ color: LIME }}>Loading event…</div></div>;
  }

  if (screen === "landing") {
    return (
      <div style={shell}>
        {topbar}
        <section style={{ background: LIME, color: INK }} className="px-5 pt-8 pb-7">
          <div className="max-w-md mx-auto text-center">
            <span className="inline-block border-2 rounded-full px-4 py-1.5 text-xs font-bold tracking-widest mb-5" style={{ borderColor: INK }}>ONE-DAY EVENT</span>
            <h1 className="display" style={{ fontSize: "3.5rem", lineHeight: 0.9 }}>NEW YEAR<br />BUZZ RUCK</h1>
            <p className="font-bold mt-4">9 January 2027 · Minnis Bay</p>
            <div style={{ background: INK, borderRadius: 16 }} className="mt-5 p-4"><LoopGraphic /></div>
            <div className="grid grid-cols-2 gap-3 mt-4 text-left">
              <div style={{ background: CREAM, borderRadius: 12 }} className="p-3">
                <span className="text-xs font-bold uppercase opacity-60">Meet</span>
                <p className="font-semibold mt-1">{EVENT.meetPoint}</p>
              </div>
              <div style={{ background: CREAM, borderRadius: 12 }} className="p-3">
                <span className="text-xs font-bold uppercase opacity-60">Time</span>
                <p className="font-semibold mt-1">{EVENT.meetTime}</p>
              </div>
            </div>
          </div>
        </section>
        <section className="px-5 py-8">
          <div className="max-w-md mx-auto">
            <p className="text-center text-sm opacity-70 mb-5">Photo checkpoints. No GPS. No fuss.</p>
            <button onClick={() => setScreen("register")} className="w-full py-4 rounded-full font-bold text-lg" style={{ background: LIME, color: INK }}>
              JOIN THE RUCK
            </button>
          </div>
        </section>
      </div>
    );
  }

  if (screen === "register") {
    return (
      <div style={{ ...shell, background: CREAM, color: INK }}>
        {topbar}
        <div className="max-w-md mx-auto w-full px-5 py-8">
          <button onClick={() => setScreen("landing")} className="text-sm underline mb-5">← Back</button>
          <h2 className="display" style={{ fontSize: "2.4rem" }}>SIGN UP</h2>
          <p className="text-sm opacity-65 mb-5">Just the basics. Stored only on this phone.</p>
          <label className="text-xs font-bold uppercase tracking-wide">First name
            <input value={firstName} onChange={(e) => setFirstName(e.target.value)} className="mt-1 mb-3 w-full border-2 rounded-xl px-3 py-3 text-base font-normal" style={{ borderColor: KHAKI, background: "white" }} />
          </label>
          <label className="text-xs font-bold uppercase tracking-wide">Surname
            <input value={surname} onChange={(e) => setSurname(e.target.value)} className="mt-1 mb-3 w-full border-2 rounded-xl px-3 py-3 text-base font-normal" style={{ borderColor: KHAKI, background: "white" }} />
          </label>
          <label className="text-xs font-bold uppercase tracking-wide">Nickname / ruck name (optional)
            <input value={nickname} onChange={(e) => setNickname(e.target.value)} className="mt-1 mb-5 w-full border-2 rounded-xl px-3 py-3 text-base font-normal" style={{ borderColor: KHAKI, background: "white" }} />
          </label>
          <button onClick={doRegister} className="w-full py-4 rounded-full font-bold text-lg" style={{ background: INK, color: LIME }}>CONTINUE</button>
        </div>
      </div>
    );
  }

  if (screen === "welcome") {
    return (
      <div style={shell}>
        {topbar}
        <div className="min-h-[calc(100dvh-52px)] flex items-center">
          <div className="max-w-md mx-auto w-full px-5 py-8 text-center">
            <span className="inline-block border rounded-full px-4 py-1.5 text-xs font-bold tracking-widest mb-5" style={{ borderColor: LIME, color: LIME }}>WELCOME</span>
            <h1 className="display" style={{ color: LIME, fontSize: "3rem", lineHeight: 0.95 }}>WELCOME TO<br />THE RUCK,<br />{displayName().toUpperCase()}</h1>
            <p className="mt-5 text-sm opacity-70">Start when you're ready at Minnis Bay.</p>
            <button onClick={doStart} className="w-full py-4 rounded-full font-bold text-lg mt-7" style={{ background: LIME, color: INK }}>START RUCK</button>
          </div>
        </div>
      </div>
    );
  }

  if (screen === "checkpoint") {
    const cp = EVENT.checkpoints.find((c) => c.id === activeCpId);
    const idx = EVENT.checkpoints.findIndex((c) => c.id === activeCpId);
    return (
      <div style={shell}>
        {topbar}
        <div className="max-w-md mx-auto w-full px-5 py-6">
          <button onClick={() => { if (pendingPhoto?.url) URL.revokeObjectURL(pendingPhoto.url); setPendingPhoto(null); setScreen("hub"); }} className="text-sm underline mb-4">← Back to checkpoints</button>
          <p className="text-xs font-bold tracking-widest" style={{ color: LIME }}>CHECKPOINT {idx + 1}</p>
          <h2 className="display mt-1" style={{ fontSize: "2.2rem", color: LIME }}>{cp.name}</h2>
          <p className="text-sm opacity-70 mt-2">{cp.instructions}</p>

          <div className="mt-5 rounded-2xl overflow-hidden flex items-center justify-center" style={{ aspectRatio: "4/3", background: INK_SOFT, border: "2px dashed #555" }}>
            {pendingPhoto?.url ? <img src={pendingPhoto.url} alt="Checkpoint preview" style={{ width: "100%", height: "100%", objectFit: "cover" }} /> : <div className="text-center opacity-60 text-sm"><Camera className="mx-auto mb-2" />Get the team in.<br />Quick photo. Then get moving.</div>}
          </div>

          {!pendingPhoto ? (
            <div className="grid grid-cols-2 gap-2 mt-4">
              <label className="relative py-3 rounded-full font-bold text-center overflow-hidden" style={{ background: LIME, color: INK }}>
                TAKE PHOTO
                <input type="file" accept="image/*" capture="environment" className="absolute inset-0 opacity-0" onChange={(e) => handlePhoto(e.target.files?.[0])} />
              </label>
              <label className="relative py-3 rounded-full font-bold text-center overflow-hidden border-2" style={{ borderColor: CREAM }}>
                CHOOSE PHOTO
                <input type="file" accept="image/*" className="absolute inset-0 opacity-0" onChange={(e) => handlePhoto(e.target.files?.[0])} />
              </label>
            </div>
          ) : (
            <div className="mt-4">
              <button onClick={stampCheckpoint} className="w-full py-4 rounded-full font-bold text-lg" style={{ background: LIME, color: INK }}>STAMP CHECKPOINT</button>
              <button onClick={() => { URL.revokeObjectURL(pendingPhoto.url); setPendingPhoto(null); }} className="w-full py-3 rounded-full font-semibold mt-2 border-2" style={{ borderColor: CREAM }}>RETAKE</button>
            </div>
          )}
        </div>
      </div>
    );
  }

  if (screen === "finish") {
    return (
      <div style={shell}>
        {topbar}
        <div className="min-h-[calc(100dvh-52px)] flex items-center">
          <div className="max-w-md mx-auto w-full px-5 py-8 text-center">
            <Flag size={44} className="mx-auto mb-3" color={LIME} />
            <h2 className="display" style={{ fontSize: "2.3rem", color: LIME }}>ARE YOU BACK AT MINNIS BAY?</h2>
            <p className="opacity-70 mt-3">{doneCount} / {EVENT.checkpoints.length} checkpoints stamped.</p>
            {!allDone && <p className="text-sm mt-3" style={{ color: "#ff775f" }}>You can finish early, but your certificate will show that not all checkpoints were stamped.</p>}
            <button onClick={doFinish} className="w-full py-4 rounded-full font-bold mt-6" style={{ background: LIME, color: INK }}>CONFIRM FINISH</button>
            <button onClick={() => setScreen("hub")} className="w-full py-3 rounded-full font-semibold mt-2 border-2" style={{ borderColor: CREAM }}>NOT YET</button>
          </div>
        </div>
      </div>
    );
  }

  if (screen === "complete" || screen === "certificate") {
    const total = participant.finishTime && participant.startTime ? participant.finishTime - participant.startTime : 0;
    return (
      <div style={{ ...shell, background: COFFEE }}>
        {topbar}
        <div className="max-w-md mx-auto w-full px-5 py-7">
          <div className="text-center mb-4">
            <Trophy size={46} color={LIME} className="mx-auto" />
            <h1 className="display mt-2" style={{ fontSize: "2.6rem", color: LIME }}>RUCK COMPLETE</h1>
            <p className="text-sm opacity-75">{EVENT.route}</p>
          </div>

          <div className="rounded-2xl p-5 text-center" style={{ background: CREAM, color: INK, border: `5px double ${COFFEE}` }}>
            <p className="text-xs font-bold tracking-[0.18em] opacity-60">CERTIFICATE OF COMPLETION</p>
            <p className="font-bold mt-2">RUCK BUZZ</p>
            <h2 className="display mt-3" style={{ fontSize: "2.2rem", color: COFFEE }}>{displayName()}</h2>
            <p className="text-sm">has completed the {EVENT.distanceKm}km ruck{allDone ? ", all checkpoints stamped" : ""}.</p>
            <div className="grid grid-cols-2 gap-3 mt-4 text-sm">
              <div><span className="block text-xs uppercase opacity-50">Date</span>{fmtDate(participant.finishTime)}</div>
              <div><span className="block text-xs uppercase opacity-50">Total time</span>{fmtElapsed(total)}</div>
            </div>
            <div className="grid grid-cols-4 gap-2 mt-5">
              {EVENT.checkpoints.map((cp) => (
                <div key={cp.id}>
                  <div className="rounded-lg overflow-hidden" style={{ aspectRatio: 1, background: KHAKI }}>
                    {photos[cp.id] ? <img src={photos[cp.id]} alt={cp.name} style={{ width: "100%", height: "100%", objectFit: "cover" }} /> : null}
                  </div>
                  <span className="block mt-1" style={{ fontSize: 9, opacity: 0.65 }}>{cp.name}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="rounded-2xl p-4 mt-4 text-center" style={{ background: INK, color: CREAM }}>
            <Coffee size={24} color={LIME} className="mx-auto mb-2" />
            <p className="font-bold">Show your completed certificate at the Buzz.</p>
            <p className="text-xs opacity-65 mt-1">Then grab your coffee or hot chocolate — £1 donation appreciated.</p>
          </div>

          <button onClick={downloadCertificate} className="w-full py-4 rounded-full font-bold mt-4" style={{ background: LIME, color: INK }}>SAVE / SHARE CERTIFICATE</button>
          <button onClick={onExit} className="w-full py-3 rounded-full font-semibold mt-2 border-2" style={{ borderColor: CREAM }}>BACK TO RUCK 500</button>
        </div>
      </div>
    );
  }

  // HUB / PROGRESS
  return (
    <div style={shell}>
      {topbar}
      <div className="max-w-md mx-auto w-full px-5 py-6">
        <div className="rounded-2xl p-4 mb-5 flex justify-between items-center" style={{ background: INK_SOFT }}>
          <div><span className="display block" style={{ color: LIME, fontSize: "1.9rem" }}>{doneCount} / {EVENT.checkpoints.length}</span><span className="text-xs opacity-55 uppercase">Checkpoints</span></div>
          <div className="text-right"><span className="display block" style={{ color: LIME, fontSize: "1.5rem" }}>{fmtElapsed(now - participant.startTime)}</span><span className="text-xs opacity-55 uppercase">Elapsed</span></div>
        </div>

        <div>
          <div className="flex gap-3 pb-5">
            <div className="w-12 h-12 rounded-full flex items-center justify-center shrink-0" style={{ background: LIME, color: INK }}><Flag size={20} /></div>
            <div className="pt-1"><p className="font-bold text-lg">START — MINNIS BAY</p><p className="text-xs" style={{ color: LIME }}>{fmtTime(participant.startTime)}</p></div>
          </div>

          {EVENT.checkpoints.map((cp, idx) => {
            const status = checkpointStatus(cp, idx);
            return (
              <div key={cp.id} className="flex gap-3 pb-5">
                <div className="relative shrink-0">
                  <div className="w-12 h-12 rounded-full flex items-center justify-center overflow-hidden border-2" style={{ borderColor: status === "active" || status === "done" ? LIME : "#555", opacity: status === "todo" ? 0.45 : 1, background: status === "done" ? LIME : INK_SOFT }}>
                    {status === "done" && photos[cp.id] ? <img src={photos[cp.id]} alt="" style={{ width: "100%", height: "100%", objectFit: "cover" }} /> : <span>{cp.emoji}</span>}
                  </div>
                  {status === "done" && <span className="absolute -bottom-1 -right-1 w-5 h-5 rounded-full flex items-center justify-center" style={{ background: INK, color: LIME, border: `2px solid ${LIME}` }}><Check size={11} /></span>}
                </div>
                <div className="flex-1 min-w-0 pt-1">
                  <p className="font-bold text-lg">{cp.name}</p>
                  <p className="text-xs opacity-65 mt-0.5">{cp.desc}</p>
                  {status === "done" ? (
                    <p className="text-xs font-bold mt-1" style={{ color: LIME }}>STAMPED {fmtTime(participant.checkpointTimes[cp.id])}</p>
                  ) : status === "active" ? (
                    <button onClick={() => { setActiveCpId(cp.id); setPendingPhoto(null); setScreen("checkpoint"); }} className="mt-2 px-4 py-2 rounded-full text-sm font-bold" style={{ background: LIME, color: INK }}>TAKE CHECKPOINT PHOTO</button>
                  ) : (
                    <p className="text-xs opacity-40 mt-1">Locked — finish previous stop</p>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        <button onClick={() => setScreen("finish")} className="w-full py-4 rounded-full font-bold text-lg mt-2" style={{ background: allDone ? LIME : "transparent", color: allDone ? INK : CREAM, border: allDone ? "none" : `2px solid ${CREAM}` }}>
          I'M BACK — FINISH RUCK
        </button>
        {!allDone && <p className="text-center text-xs opacity-50 mt-2">You can finish early, but all four photos are needed for a fully stamped certificate.</p>}
      </div>

      {toast && <div className="fixed bottom-5 left-1/2 -translate-x-1/2 px-4 py-2 rounded-full font-semibold text-sm z-[100]" style={{ background: LIME, color: INK, whiteSpace: "nowrap", maxWidth: "calc(100vw - 32px)" }}>{toast}</div>}
    </div>
  );
}
