import Image from "next/image";

export default function FoodieBaiBrand({ compact = false }) {
  return (
    <div className={`brand ${compact ? "brand-compact" : ""}`}>
      <span className="brand-logo">
        <Image src="/foodie-bai.png" alt="FoodieBai scooter logo" width={768} height={768} />
      </span>
      <span className="brand-name">
        Foodie<span>Bai</span>
      </span>
    </div>
  );
}

