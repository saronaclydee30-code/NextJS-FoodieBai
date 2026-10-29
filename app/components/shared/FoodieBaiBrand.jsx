import Image from "next/image";

export default function FoodieBaiBrand({ compact = false }) {
  return (
    <div className={`brand ${compact ? "brand-compact" : ""}`}>
      <span className="brand-logo">
        <Image
          src="/foodie-bai-mark.png"
          alt=""
          width={768}
          height={768}
        />
      </span>
      <span className="brand-name" aria-label="FoodieBai">
        Foodie<span>Bai</span>
      </span>
    </div>
  );
}
