import Image from "next/image";
import Link from "next/link";

export default function BotonVolver() {
  return (
    <header className="logo">
      <Link href="/">
        <Image src="/img/undo-redo-sign-png.webp" alt="Volver" width={60} height={60} style={{ height: 40, width: "auto" }} />
      </Link>
    </header>
  );
}
