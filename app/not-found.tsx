import Link from "next/link";
export default function NotFound() {
  return <main className="simple-page"><div className="simple-card">
    <span className="section-kicker">TEENS2INSPIRE / 404</span>
    <h1>This page took a little <em>detour.</em></h1>
    <p>The link may have changed. Head back to the home page or open the member library.</p>
    <div className="hero-actions"><Link className="btn btn-dark" href="/">Back home <span>→</span></Link><a className="text-link" href="https://media.teens2inspire.org">Open the library →</a></div>
  </div></main>;
}
