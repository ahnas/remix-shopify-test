import { json, redirect } from "@remix-run/node";
import { Form, useActionData } from "@remix-run/react";
import { useNavigation } from "@remix-run/react";
import { useEffect, useState } from "react";
import type { MetaFunction } from "@remix-run/node";

export const meta: MetaFunction = () => {
  return [
    { title: "Shopify Remix App - Login" },
    { name: "description", content: "Welcome to Shopify Remix App!" },
  ];
};

export const action = async ({ request }: { request: Request }) => {
  const formData = await request.formData();
  const email = formData.get("email");
  const password = formData.get("password");

  const response = await fetch("https://candidate-testing.api.royal-apps.io/api/v2/token", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "accept": "application/json",
    },
    body: JSON.stringify({ email, password }),
  });

  if (response.ok) {
    const data = await response.json();
    return json({ token: data.token_key });
  } else {
    return json({ error: "Invalid email or password" }, { status: response.status });
  }
};

export default function LoginPage() {
  const actionData = useActionData<any>();
  const transition = useNavigation();
  const [error, setError] = useState("");

  useEffect(() => {
    if (actionData?.token) {
      localStorage.setItem("auth_token", actionData.token);
      window.location.href = "/dashboard";
    }
    if (actionData ===403) {
        setError("Invalid email or password");
    }
  }, [actionData]);




  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-100">
      <div className="w-full max-w-md bg-white p-6 rounded-lg shadow-md">
        <h2 className="text-xl font-bold text-center mb-4">Login</h2>
        <Form method="post" className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">Email</label>
            <input
              type="email"
              name="email"
              className="w-full p-2 border rounded mt-1"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Password</label>
            <input
              type="password"
              name="password"
              className="w-full p-2 border rounded mt-1"
              required
            />
          </div>
          {actionData?.error && <p className="text-red-500 text-sm">{actionData.error}</p>}
          <button
            type="submit"
            className="w-full bg-blue-600 text-white p-2 rounded"
            disabled={transition.state === "submitting"}
          >
            {transition.state === "submitting" ? "Logging in..." : "Login"}
          </button>
        </Form>
      </div>
    </div>
  );
}
