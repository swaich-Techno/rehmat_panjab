export function PageIntro({
  kicker,
  title,
  body,
  align = "start",
}: {
  kicker: string;
  title: string;
  body?: string;
  align?: "start" | "end";
}) {
  return (
    <header className={`site-grid py-16 md:py-24 ${align === "end" ? "text-right" : ""}`}>
      <div className={align === "end" ? "col-span-12 md:col-span-7 md:col-start-6" : "col-span-12 md:col-span-8"}>
        <p className="label text-forest">{kicker}</p>
        <h1 className="display mt-4 whitespace-pre-line text-5xl md:text-8xl">{title}</h1>
        {body ? <p className="mt-6 max-w-lg text-base leading-8 text-ink/75">{body}</p> : null}
      </div>
    </header>
  );
}
