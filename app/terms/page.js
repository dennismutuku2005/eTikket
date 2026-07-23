import Link from "next/link";

// Terms of Service data in JSON format
const termsData = {
  title: "Terms of Service",
  brand: "eTikket",
  lastUpdated: "July 23, 2026",
  sections: [
    {
      id: "introduction",
      title: "Introduction",
      content: "These Terms of Service govern your use of the eTikket platform. By using our services, you agree to comply with these terms. Please read them carefully before using the platform."
    },
    {
      id: "account-registration",
      title: "Account Registration",
      content: "To use eTikket, you must create an account with accurate and complete information. You are responsible for maintaining the confidentiality of your login credentials and for all activities that occur under your account."
    },
    {
      id: "user-responsibilities",
      title: "User Responsibilities",
      content: "As a user of eTikket, you agree to use the platform lawfully and respectfully. You may not use the platform for any illegal activities, harassment, or to distribute harmful content. Violation may result in account termination."
    },
    {
      id: "organizer-responsibilities",
      title: "Organizer Responsibilities",
      content: "Organizers using eTikket are responsible for the events they create, including accurate descriptions, pricing, and communication with attendees. Organizers must ensure their events comply with all applicable laws and regulations."
    },
    {
      id: "payments-and-refunds",
      title: "Payments and Refunds",
      content: "All transactions on eTikket are processed securely. Refund policies are determined by event organizers and must be clearly communicated to attendees. eTikket facilitates payments but is not responsible for organizer refund decisions."
    },
    {
      id: "intellectual-property",
      title: "Intellectual Property",
      content: "All content on eTikket, including logos, designs, and software, is the property of eTikket or its licensors. You may not copy, modify, or distribute any content without explicit permission."
    },
    {
      id: "prohibited-activities",
      title: "Prohibited Activities",
      content: "You may not use eTikket for fraudulent activities, to impersonate others, to violate any laws, or to interfere with the platform's functionality. We reserve the right to suspend or terminate accounts that engage in prohibited activities."
    },
    {
      id: "limitation-of-liability",
      title: "Limitation of Liability",
      content: "eTikket is provided 'as is' and we make no warranties about the platform's availability or performance. We are not liable for any damages arising from your use of the platform, including but not limited to lost profits or data loss."
    },
    {
      id: "termination",
      title: "Termination",
      content: "Either party may terminate this agreement at any time. eTikket reserves the right to suspend or terminate accounts that violate these terms or pose a risk to the platform's integrity."
    },
    {
      id: "changes-to-terms",
      title: "Changes to These Terms",
      content: "We may update these terms periodically to reflect changes in our practices or legal requirements. Continued use of the platform after changes constitutes acceptance of the updated terms."
    },
    {
      id: "governing-law",
      title: "Governing Law",
      content: "These terms are governed by and construed in accordance with the laws of Kenya. Any disputes arising from these terms shall be subject to the exclusive jurisdiction of the courts in Kenya."
    },
    {
      id: "contact-us",
      title: "Contact Us",
      content: "If you have questions about these Terms of Service, please contact us at legal@etikket.com or through our support channels."
    }
  ]
};

export default function TermsPage() {
  return (
    <main className="min-h-screen bg-slate-100 px-4 py-10 sm:px-6 lg:px-8">
      <div className="mx-auto w-full max-w-4xl">
        <div className="rounded-3xl bg-white p-7 sm:p-10">
          {/* Brand - normal letter spacing, no uppercase */}
          <p className="text-sm font-semibold text-rose-500">
            {termsData.brand}
          </p>
          <h1 className="mt-3 text-4xl font-semibold text-slate-900 sm:text-5xl">
            {termsData.title}
          </h1>
          
          {/* Last Updated */}
          <p className="mt-2 text-sm text-slate-500">
            Last updated: {termsData.lastUpdated}
          </p>

          {/* Terms Content */}
          <div className="mt-6 space-y-6">
            {termsData.sections.map((section) => (
              <div key={section.id} className="border-b border-slate-100 pb-6 last:border-0 last:pb-0">
                <h2 className="text-xl font-semibold text-slate-900">
                  {section.title}
                </h2>
                <p className="mt-2 text-base leading-7 text-slate-600">
                  {section.content}
                </p>
              </div>
            ))}
          </div>

          {/* Back to Login Button */}
          <div className="mt-10 pt-6 border-t border-slate-200">
            <Link
              href="/login"
              className="inline-block w-full rounded-full bg-rose-500 px-5 py-4 text-center text-base font-semibold text-white transition hover:bg-rose-600"
            >
              Back to login
            </Link>
          </div>
        </div>
      </div>
    </main>
  );
}