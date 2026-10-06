import Link from "next/link";

export default function Home() {
  return (
    <div>
      <h1>Hello to delivery system app</h1>
      <div>
        <Link href="/login">Login</Link>
        <Link href="/register">Create Accout</Link>
      </div>
    </div>
  );
}
