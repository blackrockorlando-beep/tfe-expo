export default function BrandLogo({ name, logoUrl, size = 40 }: { name: string; logoUrl?: string | null; size?: number }) {
    const initials = name.split(" ").map((w) => w[0]).join("").slice(0, 2).toUpperCase();
  
    if (logoUrl) {
      return (
        <img
          src={logoUrl}
          alt={name}
          style={{ width: size, height: size, borderRadius: 8, objectFit: "contain" }}
          className="border border-slate-200 bg-white"
        />
      );
    }
  
    return (
      <div
        style={{ width: size, height: size, borderRadius: 8, fontSize: size * 0.3 }}
        className="flex items-center justify-center bg-slate-900 font-bold text-white"
      >
        {initials}
      </div>
    );
  }