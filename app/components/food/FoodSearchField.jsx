import AppIcon from "../shared/AppIcon";

export default function FoodSearchField({ value, onChange, placeholder }) {
  return (
    <label className="search-field">
      <AppIcon name="search" size={20} />
      <input value={value} onChange={(event) => onChange(event.target.value)} placeholder={placeholder} aria-label={placeholder} />
      {value && (
        <button type="button" className="search-clear" onClick={() => onChange("")} aria-label="Clear search">
          <AppIcon name="close" size={16} />
        </button>
      )}
    </label>
  );
}

