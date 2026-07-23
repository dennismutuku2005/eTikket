import Link from "next/link";

// Privacy policy data in JSON format
const privacyPolicyData = {
  title: "Privacy Policy",
  brand: "eTikket",
  lastUpdated: "July 23, 2026",
  sections: [
    {
      id: "introduction",
      title: "Introduction",
      content: "This privacy policy explains how eTikket collects, uses, and protects your personal information when you use our platform. We are committed to safeguarding your privacy and ensuring the security of your data."
    },
    {
      id: "information-we-collect",
      title: "Information We Collect",
      content: "We collect information you provide directly, including your name, email address, phone number, and payment details. We also collect usage data, device information, and cookies to improve your experience."
    },
    {
      id: "how-we-use-information",
      title: "How We Use Your Information",
      content: "Your information is used to process transactions, send notifications, improve our services, and comply with legal obligations. We do not sell your personal data to third parties."
    },
    {
      id: "data-security",
      title: "Data Security",
      content: "We implement industry-standard security measures to protect your data, including encryption, secure servers, and regular security audits. However, no method of transmission over the internet is 100% secure."
    },
    {
      id: "your-rights",
      title: "Your Rights",
      content: "You have the right to access, modify, or delete your personal information at any time. You can also opt-out of marketing communications by updating your preferences in your account settings."
    },
    {
      id: "cookies",
      title: "Cookies",
      content: "We use cookies to enhance your browsing experience, remember your preferences, and analyze site traffic. You can manage cookie preferences through your browser settings."
    },
    {
      id: "third-party-services",
      title: "Third-Party Services",
      content: "Our platform may integrate with third-party services for payment processing and analytics. These services have their own privacy policies, and we encourage you to review them."
    },
    {
      id: "changes-to-policy",
      title: "Changes to This Policy",
      content: "We may update this policy periodically to reflect changes in our practices or legal requirements. We will notify you of significant changes via email or through our platform."
    },
    {
      id: "contact-us",
      title: "Contact Us",
      content: "If you have questions about this privacy policy or how we handle your data, please contact us at privacy@etikket.com or through our support channels."
    }
  ]
};

export default function PrivacyPolicyPage() {
  return (
    <main className="min-h-screen bg-slate-100 px-4 py-10 sm:px-6 lg:px-8">
      <div className="mx-auto w-full max-w-4xl">
        <div className="rounded-3xl bg-white p-7 sm:p-10">
          {/* Brand - normal letter spacing, no tracking */}
          <p className="text-sm font-semibold text-rose-500">
            {privacyPolicyData.brand}
          </p>
          <h1 className="mt-3 text-4xl font-semibold text-slate-900 sm:text-5xl">
            {privacyPolicyData.title}
          </h1>
          
          {/* Last Updated */}
          <p className="mt-2 text-sm text-slate-500">
            Last updated: {privacyPolicyData.lastUpdated}
          </p>

          {/* Policy Content */}
          <div className="mt-6 space-y-6">
            {privacyPolicyData.sections.map((section) => (
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