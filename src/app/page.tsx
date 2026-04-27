import { redirect } from "next/navigation";

// Root page redirects to login — middleware will redirect to the right dashboard
export default function HomePage() {
  redirect("/login");
}
