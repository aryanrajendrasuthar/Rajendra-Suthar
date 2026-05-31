import { redirect } from "next/navigation";

// /admin/dashboard → /admin (the actual dashboard route)
export default function AdminDashboardRedirect() {
  redirect("/admin");
}
