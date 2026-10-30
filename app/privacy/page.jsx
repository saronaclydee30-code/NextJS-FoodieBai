import Link from "next/link";
import FoodieBaiBrand from "../components/shared/FoodieBaiBrand";

const APP_NAME = "FoodieBai";
const COMPANY_NAME = "[Your company or business name]";
const CONTACT_EMAIL = "[your-email@example.com]";
const LAST_UPDATED = "October 30, 2026";

export const metadata = {
  title: `Privacy Policy | ${APP_NAME}`,
  description: `How ${APP_NAME} collects, uses and protects your personal information.`,
};

const sections = [
  {
    title: "1. Who we are",
    body: [
      `${APP_NAME} is operated by FoodieBai Corporation. This policy explains what personal information we collect when you use ${APP_NAME} to browse restaurants and order food, how we use it, who we share it with, and the choices you have.`,
      <>
        By using the Service you agree to this policy. Our{" "}
        <Link href="/terms">Terms of Use</Link> also apply.
      </>,
    ],
  },
  {
    title: "2. Information we collect",
    body: ["Depending on how you use the Service, we may collect:"],
    list: [
      "Account details: your username, email address and password. Passwords are stored in protected form, never as plain text.",
      "Order details: the restaurants and items you order, your cart, saved favorites, order history, delivery preferences, delivery address, phone number and any delivery notes you give us.",
      "Payment details: payments are handled by our payment providers. We receive confirmation of payment and limited information such as the card type and last four digits, but not your full card number.",
      "Device and usage information: your IP address, browser and device type, pages you visit, and error logs.",
      "Location: your approximate or precise location, only if you allow it, to show restaurants near you.",
      "Messages and content: anything you send to our support team and any reviews or ratings you post.",
    ],
  },
  {
    title: "3. How we use your information",
    list: [
      "To create and manage your account and sign you in.",
      "To process your orders, take payment, arrange delivery and send order updates.",
      "To provide customer support and handle refunds and complaints.",
      "To remember your cart, favorites and preferences so ordering is faster.",
      "To keep the Service safe, prevent fraud and abuse, and fix bugs.",
      "To understand how the Service is used so we can improve it.",
      "To send you service messages, and promotions if you have chosen to receive them.",
      "To meet our legal obligations.",
    ],
  },
  {
    title: "4. Who we share it with",
    body: [
      "We do not sell your personal information. We share it only as needed with:",
    ],
    list: [
      "Restaurants, which receive your name, order, and for delivery orders, your address and phone number so they can prepare and hand over your food.",
      "Delivery partners, who receive what they need to deliver your order.",
      "Payment providers, who process your payments.",
      "Service providers that help us run the Service, such as hosting, email, analytics and customer support tools. They may only use your information to work for us.",
      "Authorities or other parties when the law requires it, or to protect people's safety or our rights.",
      "A buyer or successor, if we are involved in a merger, sale or similar business change.",
    ],
  },
  {
    title: "5. Cookies and similar technologies",
    body: [
      "We use cookies and browser storage to keep you signed in, remember your cart and preferences, and keep the Service secure. If we use analytics or advertising tools, they may also set cookies. You can clear or block cookies in your browser settings, but parts of the Service may stop working.",
    ],
  },
  {
    title: "6. How long we keep your information",
    body: [
      "We keep your information while your account is active and for as long as needed to provide the Service. After that we keep some records, such as orders and payments, for as long as we need them for legal, tax, security and dispute purposes, then delete or anonymize them.",
    ],
  },
  {
    title: "7. How we protect it",
    body: [
      "We use reasonable technical and organizational measures to protect your information, such as encrypted connections and limited access. No online service is completely secure, so we cannot guarantee absolute security. Please use a strong, unique password and keep it private.",
    ],
  },
  {
    title: "8. Your choices and rights",
    body: ["Depending on where you live, you may have the right to:"],
    list: [
      "access the personal information we hold about you;",
      "correct information that is wrong or out of date;",
      "ask us to delete your information or close your account;",
      "object to or limit certain uses of your information;",
      "take back your consent where we rely on it, and opt out of marketing at any time using the link in our messages or your settings.",
    ],
  },
  {
    title: "9. How to use your rights",
    body: [
      `To use any of these rights, email us at FoodieBai@gmail.com. We may need to confirm your identity first. If you are unhappy with how we handle your information, you may also contact your local data protection authority.`,
    ],
  },
  {
    title: "10. Children",
    body: [
      `${APP_NAME} is not meant for people under 18, and we do not knowingly collect personal information from children. If you believe a child has given us their information, contact us and we will delete it.`,
    ],
  },
  {
    title: "11. International transfers",
    body: [
      "Your information may be stored and processed in countries other than your own, including by our service providers. Where we do this, we take steps to protect it as required by law.",
    ],
  },
  {
    title: "12. Changes to this policy",
    body: [
      'We may update this policy from time to time. When we do, we will change the "Last updated" date above and, for important changes, let you know in the app or by email.',
    ],
  },
  {
    title: "13. Contact us",
    body: [
      `Questions about this policy or your information? Email us at FoodieBai@gmail.com.`,
    ],
  },
];

export default function PrivacyPage() {
  return (
    <main className="policy-screen">
      <article className="policy-card legal-document">
        <FoodieBaiBrand />
        <span className="auth-kicker">FOODIEBAI</span>
        <h1>Privacy policy</h1>
        <p>Last updated: {LAST_UPDATED}</p>

        {sections.map((section) => (
          <section key={section.title}>
            <h2>{section.title}</h2>
            {section.body?.map((paragraph, i) => (
              <p key={i}>{paragraph}</p>
            ))}
            {section.list && (
              <ul>
                {section.list.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            )}
          </section>
        ))}

        <Link href="/auth/signup">Back to sign up</Link>
      </article>
    </main>
  );
}
