import { redirect } from "@remix-run/node";

export const loader = async () => {
  return redirect("/login", {
    headers: {
      "Set-Cookie": "token=; HttpOnly; Secure; Path=/; Max-Age=0",
    },
  });
};
