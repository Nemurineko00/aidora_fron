import Image from "next/image";

/**
 * Tarjeta de medicamento.
 *  - imagen: URL de la foto subida (si no hay, se usa un icono por defecto).
 *  - detalles: líneas de texto extra bajo el nombre y el RS.
 *  - children: acciones (botones) que se muestran dentro de la tarjeta.
 */
export default function TarjetaMedicamento({ nombre, rs, imagen, detalles = [], children }) {
  return (
    <article className="tarjeta">
      <div className="tarjetaImagen">
        {imagen ? (
          // La foto viene del backend (otro origen), por eso <img> y no next/image
          <img src={imagen} alt={nombre} width={90} height={90} style={{ objectFit: "cover", borderRadius: 8 }} />
        ) : (
          <Image src="/img/medicamento.svg" alt={nombre} width={90} height={90} />
        )}
      </div>
      <div className="tarjetaInfo">
        <p>Nombre: {nombre}</p>
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
