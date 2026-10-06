import { Header } from "@/src/components/user/Header";

export default function UserLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <Header/>
      {children}
    </>
  );
}
