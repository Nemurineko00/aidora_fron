const ZONA = "America/Mexico_City";

export function formatoFecha(valor) {
  if (!valor) return "";
  if (/^\d{4}-\d{2}-\d{2}$/.test(valor)) {
    const [anio, mes, dia] = valor.split("-");
    return `${dia}/${mes}/${anio}`;
  }
  return new Date(valor).toLocaleDateString("es-MX", { timeZone: ZONA, day: "2-digit", month: "2-digit", year: "numeric" });
}

export function formatoHora(valor) {
  if (!valor) return "";
  return new Date(valor).toLocaleTimeString("es-MX", { timeZone: ZONA, hour: "2-digit", minute: "2-digit", hour12: false });
}

export const ETIQUETA_ESTADO = {
  DISPONIBLE: "Disponible",
  RESERVADO: "Reservado",
  ENTREGADO: "Entregado",
  CANCELADO: "Cancelado",
  SOLICITADA: "Solicitada",
  ACEPTADA: "Aceptada",
  RECHAZADA: "Rechazada",
  COMPLETADA: "Completada",
};

export const ETIQUETA_RELACION = { cuidador: "Cuidador", familiar: "Familiar", conocido: "Conocido" };
