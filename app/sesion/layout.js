import RequiereSesion from "@/components/RequiereSesion";

export default function Layout({ children }) {
  return <RequiereSesion rol="usuario">{children}</RequiereSesion>;
}