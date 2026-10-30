import Link from "next/link";
import FoodieBaiBrand from "../components/shared/FoodieBaiBrand";
import AppIcon from "../components/shared/AppIcon";
import WelcomeFoodDeck from "./WelcomeFoodDeck";

export default function WelcomePageView() {
  return (
    <main className="welcome-screen">
      <div className="welcome-layout">
        <div className="welcome-copy">
          <FoodieBaiBrand />
          <div className="welcome-eyebrow">
            <span className="eyebrow-dot" />
            LOCAL FAVORITES, DELIVERED
          </div>
          <h1>
            Good food,
            <br />
            <span>right to your door.</span>
          </h1>
          <p className="welcome-description">
            Browse restaurants and menus first. Sign in or create an account
            only when you&apos;re ready to check out.
          </p>
          <div className="welcome-points">
            <div>
              <span>Fresh</span>
              <small>made to order</small>
            </div>
            <div>
              <span>Local</span>
              <small>nearby favorites</small>
            </div>
            <div>
              <span>Easy</span>
              <small>simple checkout</small>
            </div>
          </div>
          <div className="welcome-actions">
            <Link className="primary-button" href="/menu">
              Browse restaurants <AppIcon name="arrowRight" size={18} />
            </Link>
            <Link className="primary-button" href="/auth/signup">
              Create account
            </Link>
            <Link className="secondary-button" href="/auth/signin">
              I already have an account
            </Link>
          </div>
        </div>

        <div className="welcome-art">
          <WelcomeFoodDeck />
        </div>
      </div>
    </main>
  );
}
