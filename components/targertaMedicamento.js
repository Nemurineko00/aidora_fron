import Image from "next/image";
import Link from "next/link";

export default function TarjetaMedicamento({ nombre, rs, imagen, href, detalles = [], children }) {
  return (
    <article className={href ? "tarjeta tarjetaClicable" : "tarjeta"}>
      <div className="tarjetaImagen">
        {imagen ? (
          <img src={imagen} alt={nombre} width={90} height={90} style={{ objectFit: "cover", borderRadius: 8 }} />
        ) : (
          <Image src="/img/medicamento.svg" alt={nombre} width={90} height={90} />
        )}
      </div>
      <div className="tarjetaInfo">
        <p>
          Nombre:{" "}
          {href ? (
            <Link href={href} className="tarjetaEnlace">
              {nombre}
            </Link>
          ) : (
            nombre
          )}
        </p>
        <p>RS: {rs}</p>
        {detalles.map((texto, i) => (
          <p key={i} className="tarjetaDetalle">
            {texto}
          </p>
        ))}
        {children}
      </div>
    </article>
  );
}