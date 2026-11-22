import RequiereSesion from "@/components/RequiereSesion";

export default function Layout({ children }) {
  return <RequiereSesion rol="admin">{children}</RequiereSesion>;
}