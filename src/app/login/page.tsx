import { AuthForm } from "@/components/auth-form";
import { Header } from "@/components/site-header";
import { Footer } from "@/components/site";
export default function Login() { return <><Header/><main className="auth-page"><div className="auth-orb"/><section className="auth-panel"><div className="eyebrow"><span className="eyebrow-dot"/> PICK UP WHERE YOU LEFT OFF</div><h1>Good to have you back.</h1><p className="auth-intro">Your place for meaningful media, thoughtful conversations, and a little perspective.</p><div className="form auth-form"><AuthForm mode="login"/></div><p className="auth-fineprint">A curated space for Jewish teen girls.</p></section></main><Footer/></>; }
