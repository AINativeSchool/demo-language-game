// Compact badge signaling that LingoQuest is built for school-going students.

export default function SchoolBadge() {
  return (
    <span className="inline-flex items-center gap-1 rounded-full bg-brand-100 px-2.5 py-0.5 text-xs font-extrabold text-brand-800 ring-1 ring-brand-200">
      <span aria-hidden>🎒</span>
      For students
    </span>
  );
}
