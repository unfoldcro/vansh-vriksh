interface FeatureCardProps {
  icon: string;
  title: string;
  description: string;
  className?: string;
  accent?: boolean;
}

export function FeatureCard({ icon, title, description, className = "", accent }: FeatureCardProps) {
  return (
    <div
      className={`group relative overflow-hidden rounded-card border border-border-warm bg-bg-card p-6 transition-all duration-300 hover:shadow-[0_8px_24px_rgba(0,200,83,0.08)] hover:-translate-y-1 ${
        accent ? "border-accent/30 bg-gradient-to-br from-accent/5 to-transparent" : ""
      } ${className}`}
    >
      <div className="text-4xl transition-transform duration-300 group-hover:scale-110">{icon}</div>
      <h3 className="mt-4 text-lg font-bold text-dark">{title}</h3>
      <p className="mt-2 text-sm leading-relaxed text-dark/60">{description}</p>
      {/* Decorative corner accent */}
      <div className="absolute -bottom-2 -right-2 h-16 w-16 rounded-full bg-accent/5 opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
    </div>
  );
}
