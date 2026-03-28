import { createFileRoute, Link } from "@tanstack/react-router"
import { Button } from "@/components/ui/button"

export const Route = createFileRoute("/")({ component: Home })

function GrainyBackground() {
  return (
    <div className="pointer-events-none fixed inset-0 -z-10">
      <div className="absolute inset-0 bg-white" />
      <svg className="absolute inset-0 w-full h-full opacity-20">
        <filter id="sandFilter">
          <feTurbulence
            type="turbulence"
            baseFrequency="3"
            numOctaves="5"
            stitchTiles="stitch"
          />
          <feColorMatrix type="saturate" values="0" />
        </filter>
        <rect width="100%" height="100%" filter="url(#sandFilter)" />
      </svg>
    </div>
  )
}

function Home() {
  return (
    <>
      <GrainyBackground />
      <main className="flex flex-col items-center justify-center overflow-hidden px-4 pt-24 pb-14">
        <div className="flex max-w-3xl flex-col items-center text-center">
          <p className="mt-4 max-w-xl tracking-wide text-xs uppercase font-semibold text-slate-700 sm:text-sm">
            Secure by blockchain
          </p>
          <p className="mt-4 text-3xl font-bold tracking-tight text-slate-800 sm:text-4xl md:text-5xl">
            Get booked. Get committed.
          </p>
          <p className="mt-6 max-w-lg text-base text-slate-500 sm:text-lg">
            Prevent no-shows, get paid instantly, and sync your calendar
            seamlessly — all in one place.
          </p>

          <div className="mt-8 sm:mt-10">
            <Link to="/login" viewTransition>
              <Button
                size="lg"
                className="px-6 py-5 text-base font-semibold rounded-full sm:px-8 sm:py-6 sm:text-lg"
              >
                Start Free
              </Button>
            </Link>
          </div>
        </div>
      </main>

      <section className="flex flex-col items-center justify-center overflow-hidden px-4 py-14">
        <div className="flex w-full flex-wrap justify-center gap-4 sm:gap-6">
          <div className="w-[calc(50%-0.5rem)] max-w-[16rem] shrink-0 rounded-xl border border-slate-200 bg-white p-4 shadow-sm sm:w-64 sm:p-5">
            <div className="h-8 w-8 rounded-full bg-blue-100 flex items-center justify-center mb-2 sm:h-10 sm:w-10 sm:mb-3">
              <svg
                className="w-4 h-4 text-blue-600 sm:w-5 sm:h-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
                />
              </svg>
            </div>
            <h3 className="min-h-[2rem] text-sm font-semibold text-slate-900 sm:min-h-[2.5rem] sm:text-base">
              No-Show Protection
            </h3>
            <p className="mt-1 text-xs text-slate-500 sm:text-sm">
              Crypto deposits deter missed appointments
            </p>
          </div>
          <div className="w-[calc(50%-0.5rem)] max-w-[16rem] shrink-0 rounded-xl border border-slate-200 bg-white p-4 shadow-sm sm:w-64 sm:p-5">
            <div className="h-8 w-8 rounded-full bg-green-100 flex items-center justify-center mb-2 sm:h-10 sm:w-10 sm:mb-3">
              <svg
                className="w-4 h-4 text-green-600 sm:w-5 sm:h-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
            </div>
            <h3 className="min-h-[2rem] text-sm font-semibold text-slate-900 sm:min-h-[2.5rem] sm:text-base">
              Instant Crypto Payments
            </h3>
            <p className="mt-1 text-xs text-slate-500 sm:text-sm">
              Get paid instantly in cryptocurrency
            </p>
          </div>
          <div className="w-[calc(50%-0.5rem)] max-w-[16rem] shrink-0 rounded-xl border border-slate-200 bg-white p-4 shadow-sm sm:w-64 sm:p-5">
            <div className="h-8 w-8 rounded-full bg-purple-100 flex items-center justify-center mb-2 sm:h-10 sm:w-10 sm:mb-3">
              <svg
                className="w-4 h-4 text-purple-600 sm:w-5 sm:h-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                />
              </svg>
            </div>
            <h3 className="min-h-[2rem] text-sm font-semibold text-slate-900 sm:min-h-[2.5rem] sm:text-base">
              Calendar Sync
            </h3>
            <p className="mt-1 text-xs text-slate-500 sm:text-sm">
              Seamless integration with your calendar
            </p>
          </div>
          <div className="w-[calc(50%-0.5rem)] max-w-[16rem] shrink-0 rounded-xl border border-slate-200 bg-white p-4 shadow-sm sm:w-64 sm:p-5">
            <div className="h-8 w-8 rounded-full bg-amber-100 flex items-center justify-center mb-2 sm:h-10 sm:w-10 sm:mb-3">
              <svg
                className="w-4 h-4 text-amber-600 sm:w-5 sm:h-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
                />
              </svg>
            </div>
            <h3 className="min-h-[2rem] text-sm font-semibold text-slate-900 sm:min-h-[2.5rem] sm:text-base">
              Blockchain Secured
            </h3>
            <p className="mt-1 text-xs text-slate-500 sm:text-sm">
              Deposits refund on show, kept on no-show
            </p>
          </div>
        </div>
      </section>
    </>
  )
}
