"use client";

import { Menu, X } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef } from "react";
import { ThemeToggle } from "@/components/theme/ThemeToggle";
import { isActive, mainNav } from "@/lib/nav";
import { Logo } from "./Logo";

const linkBase =
  "rounded-md px-3 py-2 text-sm font-medium transition-colors hover:bg-surface-2 hover:text-fg";

export function Navbar() {
  const pathname = usePathname();
  const dialogRef = useRef<HTMLDialogElement>(null);
  const openButtonRef = useRef<HTMLButtonElement>(null);

  // Close the drawer whenever navigation completes.
  useEffect(() => {
    dialogRef.current?.close();
  }, [pathname]);

  const openDrawer = () => dialogRef.current?.showModal();
  const closeDrawer = () => dialogRef.current?.close();

  return (
    <header className="sticky top-0 z-40 border-b border-border bg-bg/90 backdrop-blur supports-[backdrop-filter]:bg-bg/75">
      <div className="mx-auto flex h-16 w-full max-w-6xl items-center justify-between gap-4 px-4 sm:px-6 lg:px-8">
        <Logo />

        <nav aria-label="Main" className="hidden xl:block">
          <ul className="flex items-center gap-1">
            {mainNav.map((item) => {
              const active = isActive(pathname, item.href);
              return (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    aria-current={active ? "page" : undefined}
                    className={`${linkBase} ${active ? "bg-accent-soft text-fg" : "text-muted"}`}
                  >
                    {item.label}
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>

        <div className="flex items-center gap-1">
          <ThemeToggle />
          <button
            ref={openButtonRef}
            type="button"
            onClick={openDrawer}
            className="inline-flex h-10 w-10 items-center justify-center rounded-md text-muted hover:bg-surface-2 hover:text-fg xl:hidden"
            aria-label="Open menu"
            aria-haspopup="dialog"
            aria-controls="mobile-nav"
          >
            <Menu className="h-5 w-5" aria-hidden="true" />
          </button>
        </div>
      </div>

      {/*
        A modal <dialog> gives the drawer focus containment, Escape-to-close and
        an inert background without extra code.
      */}
      <dialog
        id="mobile-nav"
        ref={dialogRef}
        aria-label="Site menu"
        onClose={() => openButtonRef.current?.focus()}
        onClick={(event) => {
          // A click on the backdrop lands on the dialog element itself.
          if (event.target === dialogRef.current) closeDrawer();
        }}
        className="m-0 ml-auto h-dvh max-h-dvh w-[min(20rem,85vw)] max-w-none border-l border-border bg-surface p-0 text-fg shadow-raised backdrop:bg-navy/50 open:flex open:flex-col"
      >
        <div className="flex h-16 items-center justify-between border-b border-border px-4">
          <span className="font-serif text-lg font-bold">Menu</span>
          <button
            type="button"
            onClick={closeDrawer}
            className="inline-flex h-10 w-10 items-center justify-center rounded-md text-muted hover:bg-surface-2 hover:text-fg"
            aria-label="Close menu"
          >
            <X className="h-5 w-5" aria-hidden="true" />
          </button>
        </div>
        <nav aria-label="Mobile" className="flex-1 overflow-y-auto p-4">
          <ul className="flex flex-col gap-1">
            <li>
              <Link
                href="/"
                aria-current={pathname === "/" ? "page" : undefined}
                onClick={closeDrawer}
                className={`block ${linkBase} text-base ${pathname === "/" ? "bg-accent-soft text-fg" : "text-muted"}`}
              >
                Home
              </Link>
            </li>
            {mainNav.map((item) => {
              const active = isActive(pathname, item.href);
              return (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    aria-current={active ? "page" : undefined}
                    onClick={closeDrawer}
                    className={`block ${linkBase} text-base ${active ? "bg-accent-soft text-fg" : "text-muted"}`}
                  >
                    {item.label}
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>
      </dialog>
    </header>
  );
}
