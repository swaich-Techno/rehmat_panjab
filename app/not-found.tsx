import Link from "next/link";

export default function NotFound() {
  return (
    <div className="site-grid py-28">
      <div className="col-span-12 md:col-span-8">
        <p className="label text-wine">404</p>
        <h1 className="display mt-4 text-6xl md:text-8xl">This room is empty.</h1>
        <p className="mt-6 max-w-md text-base leading-8 text-ink/70">
          The oil you asked for is not in the house — or the page was never built with that name.
        </p>
        <Link href="/collection" className="label mt-8 inline-block">
          Return to the collection
        </Link>
      </div>
    </div>
  );
}
