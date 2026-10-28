export default function PageSectionHeading({ eyebrow, title, subtitle, count }) {
  return (
    <div className="section-heading">
      <div>
        {eyebrow && <span className="section-eyebrow">{eyebrow}</span>}
        <h2>{title}</h2>
        {subtitle && <p>{subtitle}</p>}
      </div>
      {count !== undefined && <span className="count-pill">{count} items</span>}
    </div>
  );
}

