import Link from "next/link";
import type { Route } from "next";
import { AuthForm } from "@/components/auth-form";

export default function SignupPage() {
  return (
    <div className="page-shell">
      <AuthForm mode="signup" />
      <p className="text-center text-sm text-slate-500">
        Already have an account?{" "}
        <Link href={"/login" as Route} className="font-semibold text-slate-900 underline underline-offset-4">
          Sign in
        </Link>
      </p>
    </div>
  );
}
