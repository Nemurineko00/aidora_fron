import { api, guardarToken, borrarToken, leerRol } from "./api";

const error = (mensaje) => new Error(mensaje);

const ESTADO_SOLICITUD = { Pendiente: "SOLICITADA", Aceptada: "ACEPTADA", Rechazada: "RECHAZADA", Completada: "COMPLETADA" };
const ESTADO_PUBLICACION = { Disponible: "DISPONIBLE", Reservado: "RESERVADO", Entregado: "ENTREGADO", Cancelado: "CANCELADO" };
const estadoSolicitud = (e) => ESTADO_SOLICITUD[e] || e;
const estadoPublicacion = (e) => ESTADO_PUBLICACION[e] || e;

const hoyMx = () => new Date().toLocaleDateString("en-CA", { timeZone: "America/Mexico_City" });
const usuarioCorto = (email) => String(email || "").split("@")[0];
const nombreCompleto = (nombre, apellido) => [nombre, apellido].filter(Boolean).join(" ").trim();
const fechaTexto = (valor) => (valor ? String(valor).slice(0, 10) : null);

function usuarioDelBack(u) {
  const [apellidoPaterno = "", ...resto] = (u.apellido || "").split(" ");
  return {
    id: u.id_usuario,
    usuario: usuarioCorto(u.email),
    correo: u.email,
    nombre: u.nombre,
    apellidoPaterno,
    apellidoMaterno: resto.join(" "),
    edad: null,
    rol: "USUARIO",
  };
}

function medicamentoDelBack(p) {
  return {
    id: p.id_pub,
    nombre: p.nombre_generico || p.nombre_comercial || "Sin nombre",
    numeroLote: p.lote,
    fechaCaducidad: fechaTexto(p.fecha_caducidad),
    registroSanitario: p.codigo_rs || "",
    fotoUrl: p.imagen_empaque || null,
  };
}

function publicacionDelBack(p) {
  return {
    ...medicamentoDelBack(p),
    estado: estadoPublicacion(p.estado),
    cantidad: p.cantidad,
    donanteId: p.id_usuario,
    puntoEntrega: { id: p.id_punto, nombre: p.nombre_punto, direccion: p.direccion },
    creadoEn: p.fecha_creacion,
  };
}

function donacionDelBack(d) {
  const esDonante = d.mi_rol === "DONANTE";
  return {
    id: d.id_solicitud,
    estado: estadoSolicitud(d.estado),
    entregado: d.entregado,
    recibido: d.recibido,
    miRol: esDonante ? "DONANTE" : "RECEPTOR",
    contraparte: usuarioCorto(esDonante ? d.receptor_email : d.donante_email),
    solicitadaEn: d.fecha_solicitud,
    aceptadaEn: d.fecha_aceptada,
    completadaEn: d.fecha_completada,
    medicamento: medicamentoDelBack(d),
    puntoEntrega: { id: d.id_punto, nombre: d.nombre_punto, direccion: d.direccion },
  };
}

function donacionOngDelBack(d) {
  return {
    id: d.id_solicitud,
    estado: estadoSolicitud(d.estado),
    entregado: d.entregado,
    recibido: d.recibido,
    aceptadaEn: d.fecha_aceptada,
    completadaEn: d.fecha_completada,
    medicamento: medicamentoDelBack(d),
    donante: { usuario: usuarioCorto(d.donante_email), nombre: nombreCompleto(d.donante_nombre, d.donante_apellido) },
    receptor: { usuario: usuarioCorto(d.receptor_email), nombre: nombreCompleto(d.receptor_nombre, d.receptor_apellido) },
  };
}

function cuerpoPublicacion(datos) {
  const cantidad = Number(datos.cantidad);
  if (!Number.isInteger(cantidad) || cantidad <= 0) throw error("La cantidad debe ser un número entero mayor a 0");
  if (!datos.puntoEntregaId) throw error("Selecciona un punto de entrega");
  if (!datos.fechaCaducidad || datos.fechaCaducidad <= hoyMx()) {
    throw error("El medicamento debe tener una fecha de caducidad posterior a hoy");
  }
  return {
    nombre_generico: (datos.nombre ?? "").trim(),
    lote: (datos.numeroLote ?? "").trim(),
    fecha_caducidad: datos.fechaCaducidad,
    codigo_rs: (datos.registroSanitario ?? "").trim(),
    id_punto: Number(datos.puntoEntregaId),
    cantidad,
  };
}

export async function iniciarSesion(correo, password) {
  const { token, usuario } = await api("/usuarios/login", { metodo: "POST", cuerpo: { correo, contrasena: password } });
  guardarToken(token);
  return usuarioDelBack(usuario);
}

export async function registrar(datos) {
  await api("/usuarios/registro", {
    metodo: "POST",
    cuerpo: {
      nombre: datos.nombre,
      apellidoP: datos.apellidoPaterno,
      apellidoM: datos.apellidoMaterno,
      correo: datos.correo,
      contrasena: datos.password,
    },
  });
  return iniciarSesion(datos.correo, datos.password);
}

export async function iniciarSesionAdmin(correo, contrasena) {
  const { token, administrador } = await api("/admin/login", { metodo: "POST", cuerpo: { correo, contrasena } });
  guardarToken(token, "admin");
  return administrador;
}

export async function iniciarSesionOng(clave, contrasena) {
  const { token, ong } = await api("/ong/login", { metodo: "POST", cuerpo: { clave, contrasena } });
  guardarToken(token, "ong");
  localStorage.setItem("ong", JSON.stringify({ id: ong.id_ong, nombre: ong.nombre }));
  return ong;
}

export async function entrar(identificador, contrasena) {
  borrarToken();
  const dato = identificador.trim();

  if (!dato.includes("@")) {
    await iniciarSesionOng(dato, contrasena);
    return "/ong";
  }

  try {
    await iniciarSesion(dato, contrasena);
    return "/home";
  } catch (e) {
    if (e.status !== 401) throw e;
  }

  try {
    await iniciarSesionAdmin(dato, contrasena);
    return "/admin";
  } catch (e) {
    if (e.status === 401) throw error("Correo o contraseña incorrectos");
    throw e;
  }
}

export async function cerrarSesion() {
  try {
    if (leerRol() === "usuario") await api("/usuarios/logout", { metodo: "POST" });
  } finally {
    borrarToken();
  }
}

export async function obtenerPerfil() {
  const [{ usuario }, ayudante] = await Promise.all([api("/usuarios/perfil"), obtenerAyudante().catch(() => null)]);
  return { usuario: usuarioDelBack(usuario), ayudante };
}

export async function obtenerAyudante() {
  const { ayudante } = await api("/usuarios/ayudante");
  return ayudante;
}

export async function guardarAyudante({ nombre, relacion }) {
  const limpio = (nombre ?? "").trim();
  if (!limpio) throw error("El nombre del ayudante es obligatorio");
  if (!["cuidador", "familiar", "conocido"].includes(relacion)) throw error("La relación debe ser cuidador, familiar o conocido");
  const { ayudante } = await api("/usuarios/ayudante", { metodo: "PUT", cuerpo: { nombre: limpio, relacion } });
  return ayudante;
}

export async function listarPuntosEntrega() {
  const { puntosEntrega } = await api("/puntos-entrega");
  return puntosEntrega.map((p) => ({ id: p.id_punto, nombre: p.nombre_punto }));
}

export async function listarMedicamentosDisponibles() {
  const [publicaciones, misSolicitudes] = await Promise.all([
    api("/publicaciones/disponibles"),
    api("/solicitudes/mias").catch(() => []),
  ]);
  const solicitadas = new Set(
    misSolicitudes.filter((s) => ["Pendiente", "Aceptada"].includes(s.estado)).map((s) => s.id_pub)
  );
  return publicaciones.map((p) => ({ ...publicacionDelBack(p), solicitado: solicitadas.has(p.id_pub) }));
}

export async function solicitarMedicamento(id_pub) {
  return api("/solicitudes", { metodo: "POST", cuerpo: { id_pub: Number(id_pub) } });
}

export async function listarMisSolicitudes() {
  return api("/solicitudes/mias");
}

export async function listarMisPublicaciones() {
  const publicaciones = await api("/publicaciones/mias");
  return publicaciones.map((p) => ({
    ...publicacionDelBack(p),
    solicitudes: p.solicitudes.map((s) => ({
      id: s.id_solicitud,
      estado: estadoSolicitud(s.estado),
      solicitadaEn: s.fecha_solicitud,
      receptor: { usuario: usuarioCorto(s.receptor_email), nombre: s.receptor_nombre },
    })),
  }));
}

export async function obtenerPublicacion(id) {
  const { publicacion, es_mia } = await api(`/publicaciones/${encodeURIComponent(id)}/detalle`);
  if (!es_mia) throw error("No encontramos esa publicación");
  return publicacionDelBack(publicacion);
}

export async function publicarMedicamento(datos) {
  const publicacion = await api("/publicaciones", { metodo: "POST", cuerpo: cuerpoPublicacion(datos) });
  return publicacionDelBack(publicacion);
}

export async function actualizarPublicacion(id, datos) {
  const publicacion = await api(`/publicaciones/${encodeURIComponent(id)}`, { metodo: "PUT", cuerpo: cuerpoPublicacion(datos) });
  return publicacionDelBack(publicacion);
}

export async function obtenerDetalleMedicamento(id, donacionId) {
  const consulta = donacionId ? `?solicitud=${encodeURIComponent(donacionId)}` : "";
  const { publicacion, es_mia, donacion } = await api(`/publicaciones/${encodeURIComponent(id)}/detalle${consulta}`);

  const d = donacion ? donacionDelBack(donacion) : null;
  return {
    ...publicacionDelBack(publicacion),
    esMia: es_mia,
    solicitado: Boolean(d && d.miRol === "RECEPTOR" && ["SOLICITADA", "ACEPTADA"].includes(d.estado)),
    donacion: d && { id: d.id, estado: d.estado, miRol: d.miRol, contraparte: d.contraparte, aceptadaEn: d.aceptadaEn },
  };
}

export async function aceptarSolicitud(id) {
  return api(`/solicitudes/${id}/estado`, { metodo: "PATCH", cuerpo: { estado: "Aceptada" } });
}

export async function rechazarSolicitud(id) {
  return api(`/solicitudes/${id}/estado`, { metodo: "PATCH", cuerpo: { estado: "Rechazada" } });
}

export async function listarMisDonaciones() {
  const { donaciones } = await api("/donaciones/mias");
  return donaciones.map(donacionDelBack);
}

export async function crearReporte({ publicacionId, motivo, imagen }) {
  const texto = (motivo ?? "").trim();
  if (!texto) throw error("El motivo del reporte es obligatorio");
  if (texto.length < 5) throw error("Describe el motivo con al menos 5 caracteres");
  if (texto.length > 300) throw error("El motivo no puede pasar de 300 caracteres");

  const datos = new FormData();
  datos.append("id_pub", String(publicacionId));
  datos.append("motivos", JSON.stringify([`Otro: ${texto}`]));
  if (imagen) datos.append("foto", imagen);

  const { reporte } = await api("/reportes", { metodo: "POST", formData: datos });
  return { id: reporte.id_reporte };
}

export async function obtenerOng() {
  const ong = JSON.parse(localStorage.getItem("ong") || "null");
  if (!ong) throw error("Inicia sesión como ONG para ver esta pantalla");
  return ong;
}

export async function listarDonacionesOng() {
  const { donaciones } = await api("/ong/donaciones");
  return donaciones.map(donacionOngDelBack);
}

export async function obtenerDonacionOng(id) {
  const { donacion } = await api(`/ong/donaciones/${encodeURIComponent(id)}`);
  return { ...donacionOngDelBack(donacion), receptorAyudante: donacion.receptor_ayudante };
}

export async function actualizarEstadoOng(id, cambios) {
  const cuerpo = {};
  if (cambios.entregado !== undefined) cuerpo.entregado = Boolean(cambios.entregado);
  if (cambios.recibido !== undefined) cuerpo.recibido = Boolean(cambios.recibido);
  const { donacion } = await api(`/ong/donaciones/${encodeURIComponent(id)}`, { metodo: "PATCH", cuerpo });
  return { id: donacion.id_solicitud, estado: estadoSolicitud(donacion.estado), entregado: donacion.entregado, recibido: donacion.recibido };
}

export async function terminarCiclo(id) {
  const { donacion } = await api(`/ong/donaciones/${encodeURIComponent(id)}/terminar`, { metodo: "POST" });
  return { id: donacion.id_solicitud, estado: estadoSolicitud(donacion.estado) };
}

async function reportesVigentes() {
  const { reportes } = await api("/admin/reportes");
  return reportes.filter((r) => r.estatus !== "Rechazado");
}

export async function listarUsuariosAdmin() {
  const [{ usuarios }, reportes] = await Promise.all([api("/admin/usuarios"), reportesVigentes()]);
  return usuarios
    .filter((u) => u.activo)
    .map((u) => ({
      id: u.id_usuario,
      usuario: usuarioCorto(u.email),
      correo: u.email,
      nombre: `${u.nombre} ${u.apellido}`.trim(),
      reportes: reportes.filter((r) => r.id_reportado === u.id_usuario).length,
    }));
}

export async function obtenerUsuarioAdmin(id) {
  const [historial, reportes] = await Promise.all([api(`/admin/usuarios/${encodeURIComponent(id)}/historial`), reportesVigentes()]);
  const u = historial.usuario;
  return {
    usuario: usuarioDelBack(u),
    publicaciones: historial.publicaciones.map(publicacionDelBack),
    solicitudes: historial.solicitudes.map((s) => ({
      id: s.id_solicitud,
      estado: estadoSolicitud(s.estado),
      solicitadaEn: s.fecha_solicitud,
      medicamento: medicamentoDelBack(s),
    })),
    reportes: reportes
      .filter((r) => r.id_reportado === u.id_usuario)
      .map((r) => ({
        id: r.id_reporte,
        motivo: r.motivos.map((m) => m.motivo).join(", "),
        imagenUrl: r.motivos[0]?.evidencia ?? null,
        creadoEn: r.fecha_reporte,
        reportante: usuarioCorto(r.email_reportante),
      })),
  };
}

export async function eliminarUsuarioAdmin(id) {
  await api(`/admin/usuarios/${id}`, { metodo: "DELETE" });
  return { eliminado: true };
}
