export default function VideoFondo() {
  return (
    <video className="videoFondo" autoPlay muted loop playsInline preload="auto">
      <source src="/img/medicamentos-fondo.mp4" type="video/mp4" />
    </video>
  );
}
