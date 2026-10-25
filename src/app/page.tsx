import Image from "next/image";

export const metadata = {
  title: "Teens2Inspire — Launching Soon",
  description: "Teens2Inspire is a media and inspiration platform created for Jewish teen girls. Our next chapter is coming soon.",
};

export default function LandingPage() {
  return (
    <main className="launch-page">
      <div className="launch-glow launch-glow-one" aria-hidden="true" />
      <div className="launch-glow launch-glow-two" aria-hidden="true" />
      <header className="launch-header">
        <a href="https://teens2inspire.org" aria-label="Teens2Inspire home" className="launch-logo">
          <Image src="/teens2inspire-logo.png" alt="Teens2Inspire — Inspiring Jewish teen girls" width={360} height={120} priority />
        </a>
        <span className="launch-status"><span /> A NEW CHAPTER IS COMING</span>
      </header>
      <section className="launch-content">
        <p className="launch-eyebrow">INSPIRING JEWISH TEEN GIRLS</p>
        <h1>A little inspiration.<br /><em>A lot to look forward to.</em></h1>
        <p className="launch-bio">Teens2Inspire is a space for Jewish teen girls to connect and grow through meaningful conversations, uplifting podcasts, thoughtful media, and experiences that bring us closer to who we want to be.</p>
        <div className="launch-countdown-card">
          <p className="launch-card-label">COUNTING DOWN TO LAUNCH</p>
          <iframe width="300" height="154" src="https://w2.countingdownto.com/7396542" title="Teens2Inspire Media App Launch countdown" frameBorder="0" loading="lazy" />
        </div>
        <p className="launch-note">We’re getting everything ready. Check back soon.</p>
        <nav className="launch-links" aria-label="Teens2Inspire links">
          <a href="https://www.instagram.com/teens2inspire/" target="_blank" rel="noreferrer">Instagram <span aria-hidden="true">↗</span></a>
          <a href="https://open.spotify.com/show/4rpRDVE1wGkP8trMxKfxZo" target="_blank" rel="noreferrer">Listen to the podcast <span aria-hidden="true">↗</span></a>
        </nav>
      </section>
      <footer className="launch-footer">© {new Date().getFullYear()} Teens2Inspire · Inspiring Jewish teen girls</footer>
    </main>
  );
}
