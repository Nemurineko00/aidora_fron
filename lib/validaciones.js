export const LIMITES = {
  nombrePersona: { min: 2, max: 50 },
  usuario: { min: 3, max: 30 },
  correo: { max: 254 },
  contrasena: { min: 8, max: 64 },
  medicamento: { min: 2, max: 100 },
  lote: { min: 1, max: 30 },
  rs: { min: 3, max: 40 },
  cantidad: { min: 1, max: 999 },
  aniosCaducidad: 10,
  ayudante: { min: 2, max: 100 },
  claveOng: { min: 3, max: 30 },
  motivoOtro: { min: 5, max: 300 },
  edad: { min: 18, max: 120 },
};

const PATRON_NOMBRE = /^[\p{L}][\p{L}' .-]*$/u;
const PATRON_USUARIO = /^[A-Za-z0-9_.]+$/;
const PATRON_CORREO = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
const PATRON_LOTE = /^[A-Za-z0-9][A-Za-z0-9 ./-]*$/;
const PATRON_RS = /^[A-Za-z0-9][A-Za-z0-9 ./-]*$/;
const PATRON_MEDICAMENTO = /^[\p{L}\p{N}][\p{L}\p{N} .,%()/+-]*$/u;
const PATRON_CLAVE_ONG = /^[A-Za-z0-9_-]+$/;

export const limpiar = (valor) => String(valor ?? "").trim().replace(/\s+/g, " ");
export const hoyMx = () => new Date().toLocaleDateString("en-CA", { timeZone: "America/Mexico_City" });

function texto(valor, etiqueta, { min, max }, patron, mensajePatron) {
  const v = limpiar(valor);
  if (!v) return `${etiqueta} es obligatorio`;
  if (v.length < min) return `${etiqueta} debe tener al menos ${min} caracteres`;
  if (v.length > max) return `${etiqueta} no puede pasar de ${max} caracteres`;
  if (patron && !patron.test(v)) return mensajePatron || `${etiqueta} tiene caracteres no permitidos`;
  return null;
}

export const validar = {
  nombrePersona: (v, etiqueta = "El nombre") =>
    texto(v, etiqueta, LIMITES.nombrePersona, PATRON_NOMBRE, `${etiqueta} solo puede llevar letras, espacios, apóstrofo o guion`),

  usuario: (v) =>
    texto(v, "El nombre de usuario", LIMITES.usuario, PATRON_USUARIO, "El nombre de usuario solo lleva letras sin acentos, números, punto o guion bajo"),

  correo(v) {
    const c = limpiar(v).toLowerCase();
    if (!c) return "El correo es obligatorio";
    if (c.length > LIMITES.correo.max) return `El correo no puede pasar de ${LIMITES.correo.max} caracteres`;
    if (!PATRON_CORREO.test(c)) return "El correo no es válido";
    return null;
  },

  contrasenaNueva(v) {
    const c = String(v ?? "");
    if (!c) return "La contraseña es obligatoria";
    if (c.length < LIMITES.contrasena.min) return `La contraseña debe tener al menos ${LIMITES.contrasena.min} caracteres`;
    if (c.length > LIMITES.contrasena.max) return `La contraseña no puede pasar de ${LIMITES.contrasena.max} caracteres`;
    if (new TextEncoder().encode(c).length > 72) return "La contraseña es demasiado larga";
    if (/\s/.test(c)) return "La contraseña no puede llevar espacios";
    if (!/[a-z]/.test(c)) return "La contraseña debe tener al menos una letra minúscula";
    if (!/[A-Z]/.test(c)) return "La contraseña debe tener al menos una letra mayúscula";
    if (!/[0-9]/.test(c)) return "La contraseña debe tener al menos un número";
    if (!/[^A-Za-z0-9]/.test(c)) return "La contraseña debe tener al menos un símbolo (por ejemplo ! # $ % & *)";
    return null;
  },

  contrasenaLogin(v) {
    const c = String(v ?? "");
    if (!c) return "Escribe tu contraseña";
    if (c.length > 128) return "Correo o contraseña incorrectos";
    return null;
  },

  claveOng: (v) => texto(v, "La clave", LIMITES.claveOng, PATRON_CLAVE_ONG, "La clave solo lleva letras, números, guion o guion bajo"),

  edad(v) {
    const n = Number(v);
    const { min, max } = LIMITES.edad;
    if (!Number.isInteger(n)) return "La edad debe ser un número entero";
    if (n < min) return `Debes tener al menos ${min} años para usar Aidora`;
    if (n > max) return "La edad no es válida";
    return null;
  },

  nombreMedicamento: (v, etiqueta = "El nombre del medicamento") =>
    texto(v, etiqueta, LIMITES.medicamento, PATRON_MEDICAMENTO, `${etiqueta} tiene caracteres no permitidos`),

  lote: (v) => texto(v, "El número de lote", LIMITES.lote, PATRON_LOTE, "El lote solo lleva letras, números, espacios, punto, diagonal o guion"),

  registroSanitario: (v) =>
    texto(v, "El registro sanitario (RS)", LIMITES.rs, PATRON_RS, "El RS solo lleva letras, números, espacios, punto, diagonal o guion"),

  fechaCaducidad(v) {
    const f = limpiar(v);
    if (!f) return "La fecha de caducidad es obligatoria";
    if (!/^\d{4}-\d{2}-\d{2}$/.test(f)) return "La fecha de caducidad no es válida";
    const fecha = new Date(`${f}T00:00:00Z`);
    if (Number.isNaN(fecha.getTime()) || fecha.toISOString().slice(0, 10) !== f) return "La fecha de caducidad no existe";
    if (f <= hoyMx()) return "El medicamento debe caducar después de hoy";
    if (f > fechaMaximaCaducidad()) return `La fecha de caducidad no puede ser de más de ${LIMITES.aniosCaducidad} años`;
    return null;
  },

  cantidad(v) {
    const n = Number(v);
    const { min, max } = LIMITES.cantidad;
    if (!Number.isInteger(n) || n < min || n > max) return `La cantidad debe ser un número entero entre ${min} y ${max}`;
    return null;
  },

  nombreAyudante: (v) =>
    texto(v, "El nombre del ayudante", LIMITES.ayudante, PATRON_NOMBRE, "El nombre del ayudante solo puede llevar letras, espacios, apóstrofo o guion"),

  motivoOtro: (v) => texto(v, "La descripción del motivo", LIMITES.motivoOtro),
};

export function fechaMaximaCaducidad() {
  const limite = new Date(`${hoyMx()}T00:00:00Z`);
  limite.setUTCFullYear(limite.getUTCFullYear() + LIMITES.aniosCaducidad);
  return limite.toISOString().slice(0, 10);
}

export const primerError = (...errores) => errores.find(Boolean) || null;
