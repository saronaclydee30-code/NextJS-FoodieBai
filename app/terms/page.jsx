import Link from "next/link";
import FoodieBaiBrand from "../components/shared/FoodieBaiBrand";

// TODO before launch: fill in the [bracketed] placeholders below and have a
// lawyer review these terms for your country and business.
const APP_NAME = "FoodieBai";
const COMPANY_NAME = "[Your company or business name]";
const CONTACT_EMAIL = "[your-email@example.com]";
const GOVERNING_LAW = "[your country or state]";
const REPORT_WINDOW = "24 hours";
const LAST_UPDATED = "October 30, 2026";

export const metadata = {
  title: `Terms of Use | ${APP_NAME}`,
  description: `The terms that apply when you use ${APP_NAME} to browse restaurants and order food.`,
};

const sections = [
  {
    title: "1. Accepting these terms",
    body: [
      `${APP_NAME} is operated by FoodieBai Corporation. By creating an account, placing an order, or otherwise using ${APP_NAME}, you agree to these Terms of Use. If you do not agree, please do not use the Service.`,
    ],
  },
  {
    title: "2. What we do",
    body: [
      `${APP_NAME} is an online platform that lets you browse local restaurants and order food for delivery or pickup. Unless we say otherwise, your food is prepared by the restaurant, not by ${APP_NAME}. Restaurants are responsible for their menus, ingredients, food quality and food safety.`,
    ],
  },
  {
    title: "3. Your account",
    body: [
      "You must be at least 18 years old, or the age of legal majority where you live, to create an account.",
    ],
    list: [
      "Give us accurate and up-to-date information, and keep it current.",
      "Keep your password confidential and tell us right away if you suspect someone else is using your account.",
      "You are responsible for everything that happens under your account.",
      "Do not share, sell or transfer your account to anyone else.",
    ],
  },
  {
    title: "4. Orders, menus and prices",
    list: [
      "Menu items, prices, photos and availability are provided by restaurants and can change at any time.",
      "An order is confirmed only when you receive an order confirmation from us.",
      "A restaurant may refuse or cancel an order, for example if an item is unavailable or the restaurant is closed. If that happens we will let you know and refund anything you were charged.",
      "The total shown at checkout includes item prices, taxes, delivery and service fees, and any tip you add.",
    ],
  },
  {
    title: "5. Payments",
    list: [
      "Payments are handled by third-party payment providers.",
      "By placing an order you authorize us and our payment provider to charge the total amount to your chosen payment method.",
      "If a payment fails or is reversed, we may cancel the order, ask you to pay again, or suspend your account.",
    ],
  },
  {
    title: "6. Delivery and pickup",
    list: [
      "Delivery and pickup times are estimates, not guarantees. Preparation time, traffic, weather and other factors can cause delays.",
      "Give us a complete and accurate address and a phone number where you can be reached, and be available to receive your order.",
      "If we cannot deliver because the address is wrong or you cannot be reached, the order may be cancelled and you may still be charged.",
      "Please check your order when it arrives and report any problem right away.",
    ],
  },
  {
    title: "7. Cancellations, refunds and problems with your order",
    list: [
      "Once a restaurant has started preparing your order, it usually cannot be cancelled.",
      `If items are missing, wrong, or arrive in poor condition, contact us within ${REPORT_WINDOW} of delivery. We will review your request and may offer a refund, credit or replacement.`,
      "Approved refunds go back to your original payment method where possible.",
    ],
  },
  {
    title: "8. Allergies and dietary needs",
    body: [
      "Menu descriptions come from restaurants, and we cannot guarantee that any dish is free from allergens or suits a particular diet. If you have an allergy or a medical dietary requirement, tell the restaurant before ordering and contact it directly if your allergy is severe.",
    ],
  },
  {
    title: "9. Acceptable use",
    body: ["When using the Service, you agree not to:"],
    list: [
      "break the law or use the Service for fraud, including false orders, stolen payment methods or abuse of refunds and chargebacks;",
      "harass, threaten or abuse restaurant staff, delivery partners or our support team;",
      "abuse promotions, vouchers or referral programs, or create multiple accounts to do so;",
      "try to break, bypass or probe our security, or scrape, copy or reverse-engineer the Service;",
      "upload anything harmful, unlawful, misleading, or that infringes someone else's rights.",
    ],
  },
  {
    title: "10. Promotions and vouchers",
    body: [
      "Promo codes, vouchers and credits have their own conditions. They have no cash value, cannot be combined unless we say so, and may expire or be withdrawn. We may cancel any promotion that is misused.",
    ],
  },
  {
    title: "11. Reviews and content you submit",
    body: [
      "If you post reviews, ratings, photos or other content, you are responsible for it and it must be honest and lawful. You give us a non-exclusive, royalty-free license to display and use it on the Service. We may remove content that breaks these terms.",
    ],
  },
  {
    title: "12. Privacy",
    body: [
      <>
        How we collect and use your personal information is explained in our{" "}
        <Link href="/privacy">Privacy Policy</Link>.
      </>,
    ],
  },
  {
    title: "13. Our intellectual property",
    body: [
      `The Service, including the ${APP_NAME} name, logo, design and software, belongs to us or our licensors. We give you a limited, personal, non-transferable license to use the Service as these terms allow. Restaurant names, logos and menus belong to their owners.`,
    ],
  },
  {
    title: "14. Third-party services",
    body: [
      "The Service may rely on or link to services run by others, such as payment providers, maps and delivery partners. We are not responsible for those services or their terms.",
    ],
  },
  {
    title: "15. Availability of the Service",
    body: [
      "We work to keep the Service running, but we do not promise it will always be available or error-free. We may change, pause or discontinue any part of it.",
    ],
  },
  {
    title: "16. Disclaimers and limits on liability",
    body: [
      `To the fullest extent the law allows, the Service is provided "as is" and "as available". We are not responsible for the food that restaurants prepare, including its quality, safety or how it is described, beyond what the law requires.`,
      "To the fullest extent the law allows, our total liability to you for any claim related to the Service is limited to the amount you paid for the order that the claim relates to.",
      "Nothing in these terms limits any right or liability that cannot be limited by law, including liability for fraud or for death or personal injury caused by negligence, or your legal rights as a consumer.",
    ],
  },
  {
    title: "17. Suspension and ending your account",
    body: [
      "We may suspend or close your account if you break these terms, misuse the Service or put others at risk. You can stop using the Service at any time and ask us to delete your account by contacting us.",
    ],
  },
  {
    title: "18. Changes to these terms",
    body: [
      'We may update these terms from time to time. When we do, we will change the "Last updated" date above and, for important changes, let you know in the app or by email. If you keep using the Service after a change, you accept the new terms.',
    ],
  },
  {
    title: "19. Governing law",
    body: [
      `These terms are governed by the laws of ${GOVERNING_LAW}. Any dispute will be handled by the courts there, without affecting any mandatory consumer rights you have where you live.`,
    ],
  },
  {
    title: "20. Contact us",
    body: [`Questions about these terms? Email us at FoodieBai@gmail.com.`],
  },
];

export default function TermsPage() {
  return (
    <main className="policy-screen">
      <article className="policy-card legal-document">
        <FoodieBaiBrand />
        <span className="auth-kicker">FOODIEBAI</span>
        <h1>Terms of use</h1>
        <p>Last updated: {LAST_UPDATED}</p>
        <p>
          Please read these terms carefully. They explain the rules for using{" "}
          {APP_NAME} to browse restaurants and order food.
        </p>

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
