import { Outlet } from "react-router-dom";

type AuthLayoutProps = {
  title: string;
  description: string;
};

export function AuthLayout({ title, description }: AuthLayoutProps) {
  return (
    <div className="grid min-h-screen w-full lg:grid-cols-2">
      {/* Left brand — full height */}
      <section className="hidden min-h-screen flex-col justify-between bg-sidebar p-10 text-sidebar-foreground lg:flex xl:p-14">
        <div>
          <h1 className="font-serif text-4xl font-semibold tracking-tight text-white xl:text-5xl">EBRS</h1>
          <p className="mt-3 max-w-sm text-sm leading-relaxed text-sidebar-muted xl:text-base">
            Enterprise Booking &amp; Reservation System
          </p>
        </div>
        <div className="mt-10 overflow-hidden rounded-2xl">
          <img
            src="/login-hero.jpg"
            alt="Modern conference room ready for booking"
            className="aspect-[4/3] w-full object-cover"
          />
        </div>
      </section>

      {/* Right form — full screen panel */}
      <section className="flex min-h-screen w-full flex-col justify-center bg-background px-6 py-10 sm:px-12 lg:px-16 xl:px-24">
        <div className="mx-auto w-full max-w-md">
          <div className="mb-8 flex items-center gap-2 lg:hidden">
            <span className="grid h-9 w-9 place-items-center rounded-lg bg-sidebar text-sm font-bold text-white">E</span>
            <p className="text-sm font-semibold">EBRS</p>
          </div>
          <div className="mb-8">
            <h2 className="text-3xl font-semibold tracking-tight text-foreground">{title}</h2>
            <p className="mt-2 text-sm text-muted-foreground">{description}</p>
          </div>
          <Outlet />
        </div>
      </section>
    </div>
  );
}
