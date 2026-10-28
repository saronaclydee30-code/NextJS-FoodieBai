export default function FoodFilterChip({ active, children, onClick, tone = "default" }) {
  return (
    <button className={`chip ${active ? `chip-active chip-${tone}` : ""}`} type="button" onClick={onClick} aria-pressed={active}>
      {children}
    </button>
  );
}
