// Compact badge signaling that LINGOCRAFT is built for school-going students.

export default function SchoolBadge() {
  return (
    <span className="inline-flex items-center gap-1 rounded-[0.3rem] border-2 border-brand-700/30 bg-brand-100 px-2 py-0.5 text-[10px] font-extrabold uppercase tracking-wide text-brand-800 shadow-[0_2px_0_0_#78350f22]">
      <span aria-hidden>🎒</span>
      Student Mode
    </span>
  );
}
