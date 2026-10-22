import { redirect } from "next/navigation";

export default async function Login({ searchParams }: { searchParams: Promise<{ next?: string }> }) {
  const params = await searchParams;
  const rawNext = params.next || "/app";
  const safeNext = rawNext.startsWith("/") && !rawNext.startsWith("//") ? rawNext : "/app";
  redirect(`https://media.teens2inspire.org/login?next=${encodeURIComponent(safeNext)}`);
}
