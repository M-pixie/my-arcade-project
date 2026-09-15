import Link from "next/link";

export const metadata = {
  title: "Terms & Conditions | Arcade Nexus",
  description:
    "Terms and conditions governing the use of the independent Arcade Nexus community platform.",
};

const sections = [
  {
    title: "1. Acceptance of These Terms",
    content: [
      "By accessing or using Arcade Nexus, you acknowledge that you have read, understood and agreed to these Terms & Conditions. If you do not agree with any part of these terms, you should discontinue use of the website.",
      "These terms apply to the website, its pages, tools, calculators, dashboards, resources, community features and other services made available through Arcade Nexus.",
    ],
  },
  {
    title: "2. Nature of the Platform",
    content: [
      "Arcade Nexus is an independent, community-built platform created for educational and informational purposes. It is intended to provide convenience-oriented tools and resources for members of the learning community.",
      "Arcade Nexus is not an official Google Cloud Arcade platform and does not represent Google Cloud, Google LLC, Alphabet Inc. or any related organization.",
    ],
  },
  {
    title: "3. Educational and Informational Use",
    content: [
      "Information provided by Arcade Nexus is intended to assist users with learning, organization, tracking and community participation.",
      "The website does not replace official program documentation, official announcements, official policies, official eligibility requirements or instructions issued by the program owner.",
      "Where there is a difference between information shown on Arcade Nexus and information published by an official source, the official source should always be treated as authoritative.",
    ],
  },
  {
    title: "4. Accuracy of Information",
    content: [
      "Reasonable efforts may be made to keep platform information useful and up to date. However, no guarantee is made that every piece of information will always be complete, accurate, current or error-free.",
      "Programs, points structures, milestones, learning content, badge availability, URLs, rewards, event schedules and other details may change without notice.",
      "Users are responsible for verifying important information through official sources before relying on it.",
    ],
  },
  {
    title: "5. Calculations and Progress Information",
    content: [
      "Any point calculations, estimates, rankings, milestones, tier information or similar results provided by the website should be treated as convenience features and not as official records.",
      "Actual points, eligibility, completion status, rewards and program outcomes are determined by the relevant official systems and program administrators.",
      "Arcade Nexus shall not be responsible for differences between calculated information and information shown by official systems.",
    ],
  },
  {
    title: "6. Third-Party Websites and Services",
    content: [
      "Arcade Nexus may provide links to third-party websites, services, learning platforms or resources. These websites operate independently and may have their own terms, privacy policies and practices.",
      "A link or reference does not constitute an endorsement, partnership, sponsorship or guarantee regarding the third-party website or its content.",
      "Users should review the terms and privacy policies of external services before using them.",
    ],
  },
  {
    title: "7. User Responsibilities",
    content: [
      "Users agree to use Arcade Nexus only for lawful and legitimate purposes.",
      "Users must not attempt to disrupt, damage, overload, bypass or interfere with the website, its infrastructure, APIs, security systems or other users.",
      "Users must not use the platform for fraudulent activity, unauthorized access, malicious automation, scraping that violates applicable rules, or activities intended to harm the service or other users.",
    ],
  },
  {
    title: "8. Intellectual Property",
    content: [
      "The original website layout, original code, original written content, branding created specifically for Arcade Nexus and other original materials remain subject to applicable intellectual-property rights.",
      "Third-party names, trademarks, logos and other brand assets remain the property of their respective owners.",
      "Nothing on this website transfers ownership of third-party trademarks or intellectual property to Arcade Nexus or its users.",
    ],
  },
  {
    title: "9. Availability of the Website",
    content: [
      "Arcade Nexus may be changed, updated, temporarily unavailable, discontinued or restricted at any time.",
      "Maintenance, deployment, hosting issues, infrastructure failures, third-party dependencies, network problems or other technical circumstances may affect availability.",
      "No guarantee is provided that the website will remain available continuously or without interruption.",
    ],
  },
  {
    title: "10. No Warranty",
    content: [
      "Arcade Nexus is provided on an 'as available' and 'as is' basis to the extent permitted by applicable law.",
      "No express or implied warranty is made regarding accuracy, availability, reliability, fitness for a particular purpose, non-infringement or uninterrupted operation.",
    ],
  },
  {
    title: "11. Limitation of Liability",
    content: [
      "To the maximum extent permitted by applicable law, Arcade Nexus and its creators shall not be liable for indirect, incidental, consequential or special losses arising from use of, or inability to use, the website.",
      "This includes, where legally permitted, losses related to inaccurate calculations, missed milestones, unavailable resources, changes in third-party systems, external websites, rewards, swag availability or program decisions.",
    ],
  },
  {
    title: "12. Changes to These Terms",
    content: [
      "These Terms & Conditions may be updated from time to time to reflect changes in the website, services, legal requirements or operating practices.",
      "The updated version becomes effective when published on this page unless a different effective date is stated.",
    ],
  },
  {
    title: "13. Contact",
    content: [
      "For questions regarding these Terms & Conditions, please use the support or contact method provided on the Arcade Nexus website.",
    ],
  },
];

export default function TermsPage() {
  return (
    <main className="min-h-screen bg-white text-slate-900">
      <section className="border-b border-slate-200 bg-slate-50">
        <div className="mx-auto max-w-5xl px-6 py-16 sm:px-8 lg:px-10 lg:py-20">
          <Link
            href="/"
            className="text-sm font-semibold text-blue-600 hover:text-blue-700"
          >
            ← Back to Arcade Nexus
          </Link>

          <h1 className="mt-7 text-4xl font-bold tracking-tight text-slate-950 sm:text-5xl">
            Terms & Conditions
          </h1>

          <p className="mt-5 max-w-3xl text-base leading-8 text-slate-600">
            These Terms & Conditions explain the rules and conditions that
            apply when using Arcade Nexus. Please read them carefully before
            using the platform.
          </p>

          <div className="mt-6 rounded-2xl border border-amber-200 bg-amber-50 px-5 py-4 text-sm leading-6 text-amber-900">
            Arcade Nexus is an independent, community-built platform for
            educational and informational purposes. It is not affiliated with,
            endorsed by or officially connected to Google Cloud Arcade,
            Google LLC or Alphabet Inc.
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-5xl px-6 py-12 sm:px-8 lg:px-10 lg:py-16">
        <div className="divide-y divide-slate-200">
          {sections.map((section) => (
            <article key={section.title} className="py-9 first:pt-0">
              <h2 className="text-xl font-bold text-slate-950 sm:text-2xl">
                {section.title}
              </h2>

              <div className="mt-4 space-y-4">
                {section.content.map((paragraph) => (
                  <p
                    key={paragraph}
                    className="text-[15px] leading-8 text-slate-600"
                  >
                    {paragraph}
                  </p>
                ))}
              </div>
            </article>
          ))}
        </div>

        <div className="mt-12 rounded-2xl border border-slate-200 bg-slate-50 p-6">
          <p className="text-sm leading-7 text-slate-600">
            <strong className="text-slate-900">Important:</strong> These terms
            are a website-use template and should be reviewed and customized
            for your actual business, data practices and applicable law before
            being treated as formal legal terms.
          </p>
        </div>
      </section>

      <footer className="border-t border-slate-200">
        <div className="mx-auto flex max-w-5xl flex-wrap gap-5 px-6 py-8 text-sm text-slate-500 sm:px-8 lg:px-10">
          <Link href="/about" className="hover:text-slate-950">
            About
          </Link>
          <Link href="/privacy" className="hover:text-slate-950">
            Privacy Policy
          </Link>
          <Link href="/" className="hover:text-slate-950">
            Home
          </Link>
        </div>
      </footer>
    </main>
  );
}