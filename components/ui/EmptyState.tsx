export function EmptyState({
  kicker,
  title,
  body,
}: {
  kicker: string;
  title: string;
  body: string;
}) {
  return (
    <div className="max-w-xl py-16">
      <p className="label text-forest">{kicker}</p>
      <h1 className="display mt-3 text-5xl md:text-7xl">{title}</h1>
      <p className="mt-6 max-w-md text-base leading-8 text-ink/75">{body}</p>
    </div>
  );
}
