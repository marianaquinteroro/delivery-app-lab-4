import { Header } from "@/src/components/user/Header";
import { RequireAuth } from "@/src/components/auth/RequireAuth";

export default function UserLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <RequireAuth>
      <Header />
      {children}
    </RequireAuth>
  );
}
