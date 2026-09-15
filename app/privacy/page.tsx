import Link from "next/link";

export const metadata = {
  title: "Privacy Policy | Arcade Nexus",
  description:
    "Privacy Policy explaining how Arcade Nexus handles information and privacy-related practices.",
};

const sections = [
  {
    title: "1. Introduction",
    content: [
      "Arcade Nexus respects the privacy of visitors and users of the platform. This Privacy Policy explains the types of information that may be handled when you access or use the website.",
      "Because the exact technical configuration of the website may change over time, this policy should be read together with the actual functionality and services available on the platform.",
    ],
  },
  {
    title: "2. Information You Provide",
    content: [
      "Some areas of the platform may allow users to voluntarily provide information, such as information submitted through forms, feedback, support requests, community interactions or other website features.",
      "You should avoid submitting sensitive, confidential or unnecessary personal information through public or community-facing areas of the website.",
    ],
  },
  {
    title: "3. Information Generated During Use",
    content: [
      "Depending on the hosting environment, browser and technical services used by the website, standard technical information may be processed. This can include information such as IP address, browser type, device information, operating-system details, referring pages, timestamps and general diagnostic information.",
      "Such technical information may be used for security, troubleshooting, performance monitoring, abuse prevention and reliable operation of the website.",
    ],
  },
  {
    title: "4. Local Data and Progress Information",
    content: [
      "Some website features may process or retain progression-related information locally within the user's browser or device.",
      "Information stored locally may remain on the user's device until the relevant browser data is cleared, the feature is reset or otherwise removed by the user or application.",
      "Users should understand that local browser storage can be affected by browser settings, extensions, device changes and clearing of website data.",
    ],
  },
  {
    title: "5. Cookies and Similar Technologies",
    content: [
      "Websites may use cookies, local storage or similar technologies for essential functionality, preferences, security or other technical purposes.",
      "Where third-party services are integrated into the website, those services may use their own cookies or similar technologies subject to their own policies.",
    ],
  },
  {
    title: "6. Third-Party Services",
    content: [
      "Arcade Nexus may depend on external infrastructure, hosting providers, analytics services, content platforms, communication services or third-party links.",
      "When you interact with a third-party website or service, the third party may process information according to its own privacy policy and terms.",
      "Arcade Nexus does not control the privacy practices of external websites.",
    ],
  },
  {
    title: "7. How Information May Be Used",
    content: [
      "Information may be used, where applicable, to operate website features, respond to support requests, improve functionality, protect the platform, detect abuse, troubleshoot technical issues and maintain service reliability.",
      "Information should not be collected or used beyond what is reasonably necessary for legitimate operational, security or user-experience purposes.",
    ],
  },
  {
    title: "8. Data Security",
    content: [
      "Reasonable technical and organizational measures may be used to protect information handled by the platform. However, no internet-based service can guarantee absolute security.",
      "Users should understand that transmitting information over the internet always involves some degree of risk.",
    ],
  },
  {
    title: "9. Data Retention",
    content: [
      "The retention period for information depends on how and why the information is processed. Technical logs, support requests and other operational information may be retained for periods necessary for security, troubleshooting, compliance or legitimate operational purposes.",
      "Locally stored browser information can generally remain until cleared by the user or removed by the application.",
    ],
  },
  {
    title: "10. Children's Privacy",
    content: [
      "Arcade Nexus is not intentionally designed to collect sensitive personal information from children. Users should not submit unnecessary personal or sensitive information through community features or support channels.",
    ],
  },
  {
    title: "11. External Links",
    content: [
      "The website may contain links to official program resources and other third-party websites. These destinations are not operated by Arcade Nexus and may collect information independently.",
      "Before providing information to an external service, users should review that service's privacy policy.",
    ],
  },
  {
    title: "12. Your Choices",
    content: [
      "You may be able to control certain information through your browser, including clearing cookies, cached files and local storage.",
      "You may also choose not to submit optional information where a feature does not require it.",
    ],
  },
  {
    title: "13. Changes to This Privacy Policy",
    content: [
      "This Privacy Policy may be updated periodically to reflect changes to the platform, technology, services or applicable requirements.",
      "Any updated version will be published on this page with a revised update date where appropriate.",
    ],
  },
  {
    title: "14. Contact",
    content: [
      "For privacy-related questions, requests or concerns, please use the support or contact method published on the Arcade Nexus website.",
    ],
  },
];

export default function PrivacyPage() {
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
            Privacy Policy
          </h1>

          <p className="mt-5 max-w-3xl text-base leading-8 text-slate-600">
            This Privacy Policy describes how information may be handled when
            you visit or use Arcade Nexus and its related features.
          </p>

          <div className="mt-6 rounded-2xl border border-slate-200 bg-white px-5 py-4 text-sm leading-6 text-slate-600 shadow-sm">
            <strong className="text-slate-950">Privacy principle:</strong>{" "}
            Arcade Nexus aims to limit information collection to what is
            reasonably necessary for website functionality, security and
            operational purposes.
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
            <strong className="text-slate-900">Important:</strong> Review this
            policy against your real hosting, analytics, authentication,
            database, advertising, cookies and logging setup. It should reflect
            what your website actually does.
          </p>
        </div>
      </section>

      <footer className="border-t border-slate-200">
        <div className="mx-auto flex max-w-5xl flex-wrap gap-5 px-6 py-8 text-sm text-slate-500 sm:px-8 lg:px-10">
          <Link href="/about" className="hover:text-slate-950">
            About
          </Link>
          <Link href="/terms" className="hover:text-slate-950">
            Terms & Conditions
          </Link>
          <Link href="/" className="hover:text-slate-950">
            Home
          </Link>
        </div>
      </footer>
    </main>
  );
}