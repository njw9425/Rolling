import Link from "next/link";
import type { Route } from "next";
import { AuthForm } from "@/components/auth-form";

export default function LoginPage() {
  return (
    <div className="page-shell">
      <AuthForm mode="login" />
      <p className="text-center text-sm text-slate-500">
        Need a new account?{" "}
        <Link href={"/signup" as Route} className="font-semibold text-slate-900 underline underline-offset-4">
          Sign up here
        </Link>
      </p>
    </div>
  );
}
