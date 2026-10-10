import Link from "next/link";
import { Button } from "../components/ui/Button";

export default function Home() {
  return (
    <main className="h-dvh flex flex-col gap-4 items-center justify-center">
      <div className="">
        <h1 className="font-bold text-5xl">Welcome to Delivery System App</h1>
        <div className="mt-6 flex flex-col gap-2 items-start">
          <p className="text-2xl font-medium">Get Started</p>
          <Link href="/register">
            <Button>Create Account</Button>
          </Link>
          <div className="flex items-center gap-2">
            <p>Already have an account?</p>
            <Link className="text-gray-900 hover:underline" href="/login">
              Login
            </Link>
          </div>
        </div>
      </div>
    </main>
  );
}
