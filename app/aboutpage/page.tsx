import Link from "next/link";

export const metadata = {
  title: "About Arcade Nexus | Independent Community Platform",
  description:
    "Learn about Arcade Nexus, an independent community-built platform designed to help Google Cloud Arcade learners track progress, discover resources and organize their learning journey.",
};

const platformFeatures = [
  {
    number: "01",
    title: "Points Calculator",
    description:
      "A focused utility that helps learners understand their Arcade points and keep a clearer view of their progress without relying on manual calculations.",
  },
  {
    number: "02",
    title: "Progress Dashboard",
    description:
      "A centralized space for reviewing milestones, tiers, achievements and other useful progress information in a more structured way.",
  },
  {
    number: "03",
    title: "Community Leaderboard",
    description:
      "A simple way to explore community progress and rankings while keeping the experience readable, useful and easy to navigate.",
  },
  {
    number: "04",
    title: "Skill Badge Resources",
    description:
      "Curated access to useful learning and badge-related information so learners can spend less time searching and more time learning.",
  },
  {
    number: "05",
    title: "Arcade Resources",
    description:
      "Important resources, guides and links are brought together so community members can find frequently needed information from one place.",
  },
  {
    number: "06",
    title: "Community Tools",
    description:
      "Additional utilities and small quality-of-life features are designed around the practical needs of learners and Arcade enthusiasts.",
  },
];

const principles = [
  {
    title: "Clarity",
    description:
      "Information should be easy to understand, easy to scan and presented without unnecessary complexity.",
  },
  {
    title: "Practicality",
    description:
      "Features are built around real community workflows and repetitive tasks that can be made simpler.",
  },
  {
    title: "Accessibility",
    description:
      "The platform aims to provide a straightforward experience across modern desktop and mobile devices.",
  },
  {
    title: "Independence",
    description:
      "Arcade Nexus remains an independent community project and does not represent an official Google program platform.",
  },
];

function ArrowIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      className="h-4 w-4"
      aria-hidden="true"
    >
      <path strokeLinecap="round" strokeLinejoin="round" d="M5 12h14" />
      <path strokeLinecap="round" strokeLinejoin="round" d="m13 6 6 6-6 6" />
    </svg>
  );
}

function CheckIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      className="h-4 w-4"
      aria-hidden="true"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="m5 12 4 4L19 6"
      />
    </svg>
  );
}

function SparkIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      className="h-5 w-5"
      aria-hidden="true"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="m12 3 1.5 5.5L19 10l-5.5 1.5L12 17l-1.5-5.5L5 10l5.5-1.5L12 3Z"
      />
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="m19 16 .7 2.3L22 19l-2.3.7L19 22l-.7-2.3L16 19l2.3-.7L19 16Z"
      />
    </svg>
  );
}

function ShieldIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      className="h-5 w-5"
      aria-hidden="true"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M12 3 19 6v5c0 4.5-3 8-7 10-4-2-7-5.5-7-10V6l7-3Z"
      />
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="m9 12 2 2 4-4"
      />
    </svg>
  );
}

function UsersIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      className="h-5 w-5"
      aria-hidden="true"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"
      />
      <circle cx="9" cy="7" r="4" />
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M22 21v-2a4 4 0 0 0-3-3.87"
      />
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M16 3.13a4 4 0 0 1 0 7.75"
      />
    </svg>
  );
}

export default function AboutPage() {
  return (
    <main className="min-h-screen bg-white text-slate-900">
      {/* =========================================================
          HERO
      ========================================================== */}
      <section className="relative isolate overflow-hidden border-b border-slate-200">
        <div className="absolute inset-0 -z-10 bg-[radial-gradient(circle_at_80%_15%,rgba(37,99,235,0.10),transparent_28%),radial-gradient(circle_at_15%_80%,rgba(79,70,229,0.07),transparent_30%)]" />

        <div className="absolute right-[-8rem] top-[-8rem] -z-10 h-72 w-72 rounded-full border border-slate-200/70 bg-white/40 blur-3xl" />
        <div className="absolute bottom-[-10rem] left-[-8rem] -z-10 h-80 w-80 rounded-full border border-blue-100 bg-blue-50/40 blur-3xl" />

        <div className="mx-auto max-w-7xl px-6 py-20 sm:px-8 lg:px-10 lg:py-28">
          <div className="max-w-5xl">
            <div className="mb-7 inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-600 shadow-sm">
              <span className="flex h-6 w-6 items-center justify-center rounded-full bg-slate-950 text-white">
                <SparkIcon />
              </span>

              Independent • Community Built • Educational
            </div>

            <h1 className="max-w-4xl text-5xl font-bold tracking-[-0.035em] text-slate-950 sm:text-6xl lg:text-7xl">
              Built to make the Arcade journey
              <span className="block text-slate-500">
                simpler, clearer and more useful.
              </span>
            </h1>

            <p className="mt-8 max-w-3xl text-lg leading-8 text-slate-600 sm:text-xl sm:leading-9">
              Arcade Nexus is an independent, community-driven platform created
              to help Google Cloud Arcade learners better understand, organize
              and navigate their learning journey. It brings practical tools,
              progress tracking, resources and community-focused features
              together in one clean experience.
            </p>

            <p className="mt-6 max-w-3xl text-base leading-8 text-slate-500">
              The idea behind Arcade Nexus is straightforward: reduce the time
              spent manually calculating points, searching for scattered
              resources and repeatedly checking different places for
              information, so learners can stay focused on learning, building
              and reaching their next milestone.
            </p>

            <div className="mt-9 flex flex-wrap gap-3">
              <Link
                href="/dashboard"
                className="group inline-flex items-center gap-2 rounded-xl bg-slate-950 px-5 py-3 text-sm font-bold text-white shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:bg-slate-800"
              >
                Explore the Platform
                <ArrowIcon />
              </Link>

              <Link
                href="/calculator"
                className="inline-flex items-center rounded-xl border border-slate-200 bg-white px-5 py-3 text-sm font-bold text-slate-700 shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:border-slate-300 hover:text-slate-950"
              >
                Open Calculator
              </Link>
            </div>
          </div>

          <div className="mt-16 grid gap-4 sm:grid-cols-3">
            <div className="rounded-2xl border border-slate-200 bg-white/80 p-5 shadow-sm backdrop-blur">
              <p className="text-xs font-bold uppercase tracking-[0.16em] text-slate-400">
                Built for
              </p>
              <p className="mt-2 text-lg font-bold text-slate-950">
                Arcade Learners
              </p>
            </div>

            <div className="rounded-2xl border border-slate-200 bg-white/80 p-5 shadow-sm backdrop-blur">
              <p className="text-xs font-bold uppercase tracking-[0.16em] text-slate-400">
                Purpose
              </p>
              <p className="mt-2 text-lg font-bold text-slate-950">
                Learning & Productivity
              </p>
            </div>

            <div className="rounded-2xl border border-slate-200 bg-white/80 p-5 shadow-sm backdrop-blur">
              <p className="text-xs font-bold uppercase tracking-[0.16em] text-slate-400">
                Organization
              </p>
              <p className="mt-2 text-lg font-bold text-slate-950">
                Independent Community Project
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* =========================================================
          MISSION
      ========================================================== */}
      <section className="mx-auto max-w-7xl px-6 py-20 sm:px-8 lg:px-10 lg:py-28">
        <div className="grid gap-14 lg:grid-cols-[1.15fr_0.85fr] lg:items-start">
          <div>
            <p className="text-sm font-bold uppercase tracking-[0.18em] text-blue-600">
              Our Mission
            </p>

            <h2 className="mt-4 max-w-3xl text-3xl font-bold tracking-tight text-slate-950 sm:text-4xl">
              Turning a scattered learning journey into a more organized
              experience.
            </h2>

            <div className="mt-7 max-w-3xl space-y-5 text-base leading-8 text-slate-600">
              <p>
                Learning through an Arcade-style program can involve activities,
                milestones, badges, points, resources and community updates.
                With information spread across different places, keeping track
                of progress can become unnecessarily time-consuming.
              </p>

              <p>
                Arcade Nexus was created to reduce that friction. The platform
                provides a central environment where learners can calculate,
                review, explore and organize information related to their
                learning journey.
              </p>

              <p>
                The goal is not to replace official resources. Instead, Arcade
                Nexus is designed as a practical companion that makes publicly
                available information and common learner workflows easier to
                access and understand.
              </p>
            </div>
          </div>

          <div className="rounded-3xl border border-slate-200 bg-slate-50 p-7 sm:p-8">
            <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-slate-950 text-white">
              <ShieldIcon />
            </div>

            <h3 className="mt-6 text-xl font-bold text-slate-950">
              Designed with a clear purpose
            </h3>

            <div className="mt-7 space-y-4">
              {[
                "Independent community-built platform",
                "Educational and informational in nature",
                "Focused on practical learner workflows",
                "Designed for clarity and convenience",
                "Not an official Google Cloud program platform",
              ].map((item) => (
                <div key={item} className="flex items-start gap-3">
                  <span className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-blue-100 text-blue-700">
                    <CheckIcon />
                  </span>

                  <p className="text-sm leading-6 text-slate-600">{item}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* =========================================================
          PRINCIPLES
      ========================================================== */}
      <section className="border-y border-slate-200 bg-slate-50/70">
        <div className="mx-auto max-w-7xl px-6 py-20 sm:px-8 lg:px-10 lg:py-24">
          <div className="max-w-3xl">
            <p className="text-sm font-bold uppercase tracking-[0.18em] text-blue-600">
              What Guides Us
            </p>

            <h2 className="mt-4 text-3xl font-bold tracking-tight text-slate-950 sm:text-4xl">
              Simple principles behind the platform
            </h2>

            <p className="mt-5 text-base leading-8 text-slate-600">
              Arcade Nexus is built around a small set of principles intended to
              keep the product useful as it grows.
            </p>
          </div>

          <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {principles.map((item, index) => (
              <div
                key={item.title}
                className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm transition duration-200 hover:-translate-y-1 hover:shadow-md"
              >
                <span className="text-xs font-bold tracking-[0.18em] text-slate-400">
                  0{index + 1}
                </span>

                <h3 className="mt-6 text-lg font-bold text-slate-950">
                  {item.title}
                </h3>

                <p className="mt-3 text-sm leading-7 text-slate-600">
                  {item.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* =========================================================
          PLATFORM FEATURES
      ========================================================== */}
      <section className="mx-auto max-w-7xl px-6 py-20 sm:px-8 lg:px-10 lg:py-28">
        <div className="max-w-3xl">
          <p className="text-sm font-bold uppercase tracking-[0.18em] text-blue-600">
            The Platform
          </p>

          <h2 className="mt-4 text-3xl font-bold tracking-tight text-slate-950 sm:text-4xl">
            Useful tools, brought together in one place.
          </h2>

          <p className="mt-5 text-base leading-8 text-slate-600">
            Each feature exists to solve a practical problem faced by learners
            while navigating their Arcade experience.
          </p>
        </div>

        <div className="mt-12 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
          {platformFeatures.map((feature) => (
            <div
              key={feature.number}
              className="group rounded-3xl border border-slate-200 bg-white p-7 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:border-slate-300 hover:shadow-lg"
            >
              <div className="flex items-center justify-between">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-slate-950 text-xs font-bold text-white">
                  {feature.number}
                </div>

                <ArrowIcon />
              </div>

              <h3 className="mt-7 text-xl font-bold tracking-tight text-slate-950">
                {feature.title}
              </h3>

              <p className="mt-4 text-sm leading-7 text-slate-600">
                {feature.description}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* =========================================================
          INDEPENDENCE / DISCLAIMER
      ========================================================== */}
      <section className="bg-slate-950 text-white">
        <div className="mx-auto max-w-7xl px-6 py-20 sm:px-8 lg:px-10 lg:py-24">
          <div className="grid gap-12 lg:grid-cols-[0.8fr_1.2fr] lg:items-start">
            <div>
              <p className="text-sm font-bold uppercase tracking-[0.18em] text-blue-300">
                Important Notice
              </p>

              <h2 className="mt-4 text-3xl font-bold tracking-tight sm:text-4xl">
                Independent from Google Cloud
              </h2>
            </div>

            <div className="space-y-6 text-[15px] leading-8 text-slate-300">
              <p>
                Arcade Nexus is an independent, community-built website
                created for educational and informational purposes. It is not
                affiliated with, endorsed by, sponsored by, or officially
                connected to Google Cloud Arcade, Google LLC, Alphabet Inc., or
                any other Google entity.
              </p>

              <p>
                Google, Google Cloud, Google Cloud Arcade and related names,
                trademarks, logos and branding remain the property of their
                respective owners. References to these names on Arcade Nexus
                are made solely for identification, educational and
                informational purposes.
              </p>

              <p>
                Official program rules, eligibility requirements, points,
                milestones, rewards, swag availability, schedules and other
                program decisions are determined by the relevant official
                sources and may change independently of Arcade Nexus.
              </p>

              <div className="rounded-2xl border border-white/10 bg-white/[0.04] p-6">
                <p className="text-sm font-semibold text-white">
                  Always verify important program information through official
                  program sources.
                </p>

                <p className="mt-2 text-sm leading-7 text-slate-400">
                  Arcade Nexus is intended to make the community experience
                  easier, not to act as the final authority for official
                  program decisions.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* =========================================================
          PEOPLE
      ========================================================== */}
      <section className="border-b border-slate-200 bg-slate-50">
        <div className="mx-auto max-w-7xl px-6 py-20 sm:px-8 lg:px-10 lg:py-24">
          <div className="max-w-3xl">
            <p className="text-sm font-bold uppercase tracking-[0.18em] text-blue-600">
              Created by the Community
            </p>

            <h2 className="mt-4 text-3xl font-bold tracking-tight text-slate-950 sm:text-4xl">
              Built by people who understand the learner experience.
            </h2>

            <p className="mt-5 text-base leading-8 text-slate-600">
              Arcade Nexus is a community-driven project designed and developed
              by Manish and Anjali with a shared goal of making the learning
              experience more organized, understandable and enjoyable.
            </p>
          </div>

          <div className="mt-12 grid gap-5 md:grid-cols-2">
            <div className="rounded-3xl border border-slate-200 bg-white p-8 shadow-sm">
              <div className="flex items-center gap-4">
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-slate-950 text-lg font-bold text-white">
                  M
                </div>

                <div>
                  <h3 className="text-xl font-bold text-slate-950">
                    Manish
                  </h3>

                  <p className="mt-1 text-sm font-semibold text-blue-600">
                    Founder & Developer
                  </p>
                </div>
              </div>

              <p className="mt-6 text-sm leading-7 text-slate-600">
                Focused on platform engineering, practical tools, product
                functionality and creating a clean experience that makes
                community workflows easier to manage.
              </p>

              <div className="mt-6 border-t border-slate-100 pt-5">
                <span className="text-xs font-bold uppercase tracking-[0.16em] text-slate-400">
                  Focus
                </span>

                <p className="mt-2 text-sm font-semibold text-slate-800">
                  Product • Development • User Experience
                </p>
              </div>
            </div>

            <div className="rounded-3xl border border-slate-200 bg-white p-8 shadow-sm">
              <div className="flex items-center gap-4">
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-slate-950 text-lg font-bold text-white">
                  A
                </div>

                <div>
                  <h3 className="text-xl font-bold text-slate-950">
                    Anjali
                  </h3>

                  <p className="mt-1 text-sm font-semibold text-blue-600">
                    Co-Founder & Contributor
                  </p>
                </div>
              </div>

              <p className="mt-6 text-sm leading-7 text-slate-600">
                Contributes to the platform vision, community-oriented
                development and the content and ideas that help make Arcade
                Nexus more useful for learners.
              </p>

              <div className="mt-6 border-t border-slate-100 pt-5">
                <span className="text-xs font-bold uppercase tracking-[0.16em] text-slate-400">
                  Focus
                </span>

                <p className="mt-2 text-sm font-semibold text-slate-800">
                  Vision • Community • Contribution
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* =========================================================
          CTA
      ========================================================== */}
      <section className="mx-auto max-w-7xl px-6 py-20 sm:px-8 lg:px-10 lg:py-24">
        <div className="relative overflow-hidden rounded-[2rem] bg-slate-950 px-7 py-10 text-white sm:px-10 sm:py-12 lg:px-14 lg:py-14">
          <div className="absolute right-[-5rem] top-[-5rem] h-48 w-48 rounded-full bg-blue-500/20 blur-3xl" />
          <div className="absolute bottom-[-6rem] left-[30%] h-48 w-48 rounded-full bg-indigo-500/10 blur-3xl" />

          <div className="relative max-w-3xl">
            <p className="text-sm font-bold uppercase tracking-[0.18em] text-blue-300">
              Explore Arcade Nexus
            </p>

            <h2 className="mt-4 text-3xl font-bold tracking-tight sm:text-4xl">
              Everything you need to keep your Arcade journey organized.
            </h2>

            <p className="mt-5 text-sm leading-7 text-slate-300 sm:text-base">
              Explore the calculator, dashboard and resources available across
              the platform and use the tools that make your learning experience
              easier to manage.
            </p>

            <div className="mt-8 flex flex-wrap gap-3">
              <Link
                href="/calculator"
                className="inline-flex items-center gap-2 rounded-xl bg-white px-5 py-3 text-sm font-bold text-slate-950 transition hover:bg-slate-100"
              >
                Open Calculator
                <ArrowIcon />
              </Link>

              <Link
                href="/dashboard"
                className="inline-flex items-center rounded-xl border border-white/15 px-5 py-3 text-sm font-bold text-white transition hover:bg-white/10"
              >
                View Dashboard
              </Link>

              <Link
                href="/resources"
                className="inline-flex items-center rounded-xl border border-white/15 px-5 py-3 text-sm font-bold text-white transition hover:bg-white/10"
              >
                Explore Resources
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* =========================================================
          FINAL LEGAL / NAVIGATION
      ========================================================== */}
      <footer className="border-t border-slate-200 bg-white">
        <div className="mx-auto max-w-7xl px-6 py-10 sm:px-8 lg:px-10">
          <div className="grid gap-8 lg:grid-cols-[1.2fr_auto] lg:items-center">
            <div>
              <p className="text-sm font-semibold text-slate-900">
                Arcade Nexus
              </p>

              <p className="mt-2 max-w-2xl text-sm leading-7 text-slate-500">
                An independent, community-built platform designed for
                educational and informational purposes, created to help Arcade
                learners make their journey simpler and more organized.
              </p>
            </div>

            <nav
              aria-label="Legal and information"
              className="flex flex-wrap items-center gap-x-7 gap-y-3 text-sm font-semibold"
            >
              <Link
                href="/terms"
                className="text-slate-500 transition-colors hover:text-slate-950"
              >
                Terms & Conditions
              </Link>

              <Link
                href="/privacy"
                className="text-slate-500 transition-colors hover:text-slate-950"
              >
                Privacy Policy
              </Link>

              <Link
                href="/about"
                className="text-slate-950 transition-colors"
              >
                About
              </Link>
            </nav>
          </div>

          <div className="mt-8 flex flex-col gap-3 border-t border-slate-100 pt-6 text-xs text-slate-400 sm:flex-row sm:items-center sm:justify-between">
            <p>
              © {new Date().getFullYear()} Arcade Nexus. All rights reserved.
            </p>

            <p>
              Independent community platform • Educational & informational use
            </p>
          </div>
        </div>
      </footer>
    </main>
  );
}