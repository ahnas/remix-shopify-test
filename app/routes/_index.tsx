import { redirect } from "@remix-run/node";

export const loader = async ({ request }: { request: Request }) => {
  const cookieHeader = request.headers.get("Cookie");
  const token = cookieHeader?.match(/token=([^;]+)/)?.[1];

  if (!token) {
    return redirect("/login");
  }

  return redirect("/dashboard");
};

export default function Index() {
  return null; 
}
