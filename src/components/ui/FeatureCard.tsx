interface FeatureCardProps {
  icon: string;
  title: string;
  description: string;
}

export function FeatureCard({ icon, title, description }: FeatureCardProps) {
  return (
    <div className="rounded-xl border border-border-warm bg-bg-card p-5 transition-shadow hover:shadow-md">
      <div className="text-3xl">{icon}</div>
      <h3 className="mt-3 text-lg font-semibold text-earth">{title}</h3>
      <p className="mt-1.5 text-sm leading-relaxed text-earth/70">{description}</p>
    </div>
  );
}
