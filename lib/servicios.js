const MS_DIA = 24 * 60 * 60 * 1000;
const ahoraISO = () => new Date().toISOString();
const haceDias = (n) => new Date(Date.now() - n * MS_DIA).toISOString();
const fechaEnDias = (n) => new Date(Date.now() + n * MS_DIA).toLocaleDateString("en-CA", { timeZone: "America/Mexico_City" });
const hoyMx = () => fechaEnDias(0);
const error = (mensaje) => new Error(mensaje);

const USUARIO_ACTUAL = 1;
const ONG_ACTUAL = 101;

const bd = {
  usuarios: [
    { id: 1, usuario: "ana", correo: "ana@correo.com", nombre: "Ana", apellidoPaterno: "López", apellidoMaterno: "Ruiz", edad: 34, rol: "USUARIO" },
    { id: 2, usuario: "beto", correo: "beto@correo.com", nombre: "Beto", apellidoPaterno: "Gómez", apellidoMaterno: "Díaz", edad: 40, rol: "USUARIO" },
    { id: 3, usuario: "carla", correo: "carla@correo.com", nombre: "Carla", apellidoPaterno: "Soto", apellidoMaterno: "Vega", edad: 29, rol: "USUARIO" },
    { id: 4, usuario: "diego", correo: "diego@correo.com", nombre: "Diego", apellidoPaterno: "Ramírez", apellidoMaterno: "Núñez", edad: 52, rol: "USUARIO" },
  ],
  ongs: [
    { id: 101, nombre: "Cruz Roja Centro" },
    { id: 102, nombre: "Hospital General" },
  ],
  medicamentos: [
    { id: 1, donanteId: 2, puntoEntregaId: 101, nombre: "Paracetamol 500 mg", numeroLote: "L-2041", fechaCaducidad: fechaEnDias(200), registroSanitario: "210M2004 SSA VI", fotoUrl: null, estado: "DISPONIBLE", creadoEn: haceDias(6) },
    { id: 2, donanteId: 3, puntoEntregaId: 102, nombre: "Ibuprofeno 400 mg", numeroLote: "L-3310", fechaCaducidad: fechaEnDias(150), registroSanitario: "154M2010 SSA", fotoUrl: null, estado: "DISPONIBLE", creadoEn: haceDias(5) },
    { id: 3, donanteId: 2, puntoEntregaId: 102, nombre: "Loratadina 10 mg", numeroLote: "L-0875", fechaCaducidad: fechaEnDias(300), registroSanitario: "087M2012 SSA IV", fotoUrl: null, estado: "RESERVADO", creadoEn: haceDias(9) },
    { id: 4, donanteId: 4, puntoEntregaId: 101, nombre: "Omeprazol 20 mg", numeroLote: "L-5522", fechaCaducidad: fechaEnDias(90), registroSanitario: "311M2015 SSA", fotoUrl: null, estado: "DISPONIBLE", creadoEn: haceDias(4) },
    { id: 5, donanteId: 1, puntoEntregaId: 101, nombre: "Metformina 850 mg", numeroLote: "L-7788", fechaCaducidad: fechaEnDias(240), registroSanitario: "402M2011 SSA", fotoUrl: null, estado: "DISPONIBLE", creadoEn: haceDias(3) },
    { id: 6, donanteId: 1, puntoEntregaId: 102, nombre: "Amoxicilina 500 mg", numeroLote: "L-1190", fechaCaducidad: fechaEnDias(120), registroSanitario: "266M2009 SSA", fotoUrl: null, estado: "RESERVADO", creadoEn: haceDias(8) },
    { id: 7, donanteId: 1, puntoEntregaId: 101, nombre: "Salbutamol inhalador", numeroLote: "L-9001", fechaCaducidad: fechaEnDias(365), registroSanitario: "128M2014 SSA", fotoUrl: null, estado: "DISPONIBLE", creadoEn: haceDias(1) },
    { id: 8, donanteId: 4, puntoEntregaId: 101, nombre: "Naproxeno 250 mg", numeroLote: "L-6404", fechaCaducidad: fechaEnDias(180), registroSanitario: "219M2013 SSA", fotoUrl: null, estado: "RESERVADO", creadoEn: haceDias(10) },
    { id: 9, donanteId: 3, puntoEntregaId: 101, nombre: "Captopril 25 mg", numeroLote: "L-2718", fechaCaducidad: fechaEnDias(100), registroSanitario: "175M2008 SSA", fotoUrl: null, estado: "ENTREGADO", creadoEn: haceDias(20) },
  ],
  donaciones: [
    { id: 1, medicamentoId: 5, receptorId: 2, estado: "SOLICITADA", entregado: false, recibido: false, solicitadaEn: haceDias(2), aceptadaEn: null, completadaEn: null },
    { id: 2, medicamentoId: 5, receptorId: 3, estado: "SOLICITADA", entregado: false, recibido: false, solicitadaEn: haceDias(1), aceptadaEn: null, completadaEn: null },
    { id: 3, medicamentoId: 6, receptorId: 3, estado: "ACEPTADA", entregado: false, recibido: false, solicitadaEn: haceDias(6), aceptadaEn: haceDias(5), completadaEn: null },
    { id: 4, medicamentoId: 4, receptorId: 1, estado: "SOLICITADA", entregado: false, recibido: false, solicitadaEn: haceDias(1), aceptadaEn: null, completadaEn: null },
    { id: 5, medicamentoId: 3, receptorId: 1, estado: "ACEPTADA", entregado: false, recibido: false, solicitadaEn: haceDias(7), aceptadaEn: haceDias(6), completadaEn: null },
    { id: 6, medicamentoId: 8, receptorId: 2, estado: "ACEPTADA", entregado: false, recibido: false, solicitadaEn: haceDias(9), aceptadaEn: haceDias(8), completadaEn: null },
    { id: 7, medicamentoId: 9, receptorId: 4, estado: "COMPLETADA", entregado: true, recibido: true, solicitadaEn: haceDias(19), aceptadaEn: haceDias(18), completadaEn: haceDias(15) },
  ],
  reportes: [
    { id: 1, donacionId: 6, reportanteId: 2, reportadoId: 4, motivo: "El lote es diferente al publicado", imagenUrl: null, creadoEn: haceDias(3) },
  ],
  ayudantes: {},
  siguiente: { medicamento: 10, donacion: 10, reporte: 10 },
};

const usuarioPorId = (id) => bd.usuarios.find((u) => u.id === id);
const ongPorId = (id) => bd.ongs.find((o) => o.id === id);
const medicamentoPorId = (id) => bd.medicamentos.find((m) => m.id === id);
const nombreCompleto = (u) => [u.nombre, u.apellidoPaterno, u.apellidoMaterno].filter(Boolean).join(" ");
const idNumero = (valor) => Number(valor);

function medicamentoJson(m) {
  const punto = ongPorId(m.puntoEntregaId);
  return {
    id: m.id,
    nombre: m.nombre,
    numeroLote: m.numeroLote,
    fechaCaducidad: m.fechaCaducidad,
    registroSanitario: m.registroSanitario,
    estado: m.estado,
    fotoUrl: m.fotoUrl,
    puntoEntrega: { id: punto.id, nombre: punto.nombre },
    creadoEn: m.creadoEn,
  };
}

function donacionOngJson(d) {
  const m = medicamentoPorId(d.medicamentoId);
  const donante = usuarioPorId(m.donanteId);
  const receptor = usuarioPorId(d.receptorId);
  return {
    id: d.id,
    estado: d.estado,
    entregado: d.entregado,
    recibido: d.recibido,
    aceptadaEn: d.aceptadaEn,
    completadaEn: d.completadaEn,
    medicamento: { id: m.id, nombre: m.nombre, numeroLote: m.numeroLote, registroSanitario: m.registroSanitario, fechaCaducidad: m.fechaCaducidad },
    donante: { usuario: donante.usuario, nombre: nombreCompleto(donante) },
    receptor: { usuario: receptor.usuario, nombre: nombreCompleto(receptor) },
  };
}

const urlDeArchivo = (archivo) => (archivo && typeof URL !== "undefined" && URL.createObjectURL ? URL.createObjectURL(archivo) : null);

function validarMedicamento(d) {
  const nombre = (d.nombre ?? "").trim();
  const numeroLote = (d.numeroLote ?? "").trim();
  const registroSanitario = (d.registroSanitario ?? "").trim();
  if (!nombre) throw error("El nombre del medicamento es obligatorio");
  if (!numeroLote) throw error("El número de lote es obligatorio");
  if (!d.fechaCaducidad) throw error("La fecha de caducidad es obligatoria");
  if (d.fechaCaducidad <= hoyMx()) throw error("El medicamento debe tener una fecha de caducidad posterior a hoy");
  if (!registroSanitario) throw error("El registro sanitario (RS) es obligatorio");
  const punto = ongPorId(idNumero(d.puntoEntregaId));
  if (!punto) throw error("Selecciona un punto de entrega");
  return { nombre, numeroLote, fechaCaducidad: d.fechaCaducidad, registroSanitario, puntoEntregaId: punto.id };
}

export async function iniciarSesion(correo, password) {
  return { ...usuarioPorId(USUARIO_ACTUAL) };
}

export async function registrar(datos) {
  return { ...usuarioPorId(USUARIO_ACTUAL) };
}

export async function obtenerPerfil() {
  return { usuario: { ...usuarioPorId(USUARIO_ACTUAL) }, ayudante: bd.ayudantes[USUARIO_ACTUAL] ? { ...bd.ayudantes[USUARIO_ACTUAL] } : null };
}

export async function obtenerAyudante() {
  return bd.ayudantes[USUARIO_ACTUAL] ? { ...bd.ayudantes[USUARIO_ACTUAL] } : null;
}

export async function guardarAyudante({ nombre, relacion }) {
  const limpio = (nombre ?? "").trim();
  if (!limpio) throw error("El nombre del ayudante es obligatorio");
  if (!["cuidador", "familiar", "conocido"].includes(relacion)) throw error("La relación debe ser cuidador, familiar o conocido");
  bd.ayudantes[USUARIO_ACTUAL] = { nombre: limpio, relacion };
  return { ...bd.ayudantes[USUARIO_ACTUAL] };
}

export async function listarPuntosEntrega() {
  return bd.ongs.map((o) => ({ ...o }));
}

export async function listarMedicamentosDisponibles() {
  return bd.medicamentos
    .filter((m) => m.estado === "DISPONIBLE" && m.donanteId !== USUARIO_ACTUAL && m.fechaCaducidad > hoyMx())
    .sort((a, b) => b.creadoEn.localeCompare(a.creadoEn))
    .map((m) => ({
      ...medicamentoJson(m),
      solicitado: bd.donaciones.some(
        (d) => d.medicamentoId === m.id && d.receptorId === USUARIO_ACTUAL && ["SOLICITADA", "ACEPTADA"].includes(d.estado)
      ),
    }));
}

export async function solicitarMedicamento(medicamentoId) {
  const m = medicamentoPorId(idNumero(medicamentoId));
  if (!m) throw error("No encontramos ese medicamento");
  if (m.donanteId === USUARIO_ACTUAL) throw error("No puedes solicitar tu propio medicamento");
  if (m.estado !== "DISPONIBLE") throw error("Este medicamento ya no está disponible");
  if (m.fechaCaducidad <= hoyMx()) throw error("Este medicamento ya caducó");
  const repetida = bd.donaciones.some(
    (d) => d.medicamentoId === m.id && d.receptorId === USUARIO_ACTUAL && ["SOLICITADA", "ACEPTADA"].includes(d.estado)
  );
  if (repetida) throw error("Ya solicitaste este medicamento");

  const d = {
    id: bd.siguiente.donacion++,
    medicamentoId: m.id,
    receptorId: USUARIO_ACTUAL,
    estado: "SOLICITADA",
    entregado: false,
    recibido: false,
    solicitadaEn: ahoraISO(),
    aceptadaEn: null,
    completadaEn: null,
  };
  bd.donaciones.push(d);
  return { id: d.id, estado: d.estado, solicitadaEn: d.solicitadaEn };
}

export async function listarMisPublicaciones() {
  return bd.medicamentos
    .filter((m) => m.donanteId === USUARIO_ACTUAL)
    .sort((a, b) => b.creadoEn.localeCompare(a.creadoEn))
    .map((m) => ({
      ...medicamentoJson(m),
      solicitudes: bd.donaciones
        .filter((d) => d.medicamentoId === m.id && ["SOLICITADA", "ACEPTADA", "COMPLETADA"].includes(d.estado))
        .map((d) => {
          const receptor = usuarioPorId(d.receptorId);
          return { id: d.id, estado: d.estado, solicitadaEn: d.solicitadaEn, receptor: { usuario: receptor.usuario, nombre: receptor.nombre } };
        }),
    }));
}

function publicacionPropia(id) {
  const m = medicamentoPorId(idNumero(id));
  if (!m || m.donanteId !== USUARIO_ACTUAL) throw error("No encontramos esa publicación");
  return m;
}

export async function obtenerPublicacion(id) {
  return medicamentoJson(publicacionPropia(id));
}

export async function publicarMedicamento(datos) {
  const d = validarMedicamento(datos);
  const m = {
    id: bd.siguiente.medicamento++,
    donanteId: USUARIO_ACTUAL,
    ...d,
    fotoUrl: urlDeArchivo(datos.foto),
    estado: "DISPONIBLE",
    creadoEn: ahoraISO(),
  };
  bd.medicamentos.push(m);
  return medicamentoJson(m);
}

export async function actualizarPublicacion(id, datos) {
  const m = publicacionPropia(id);
  if (m.estado !== "DISPONIBLE") throw error("Solo puedes editar publicaciones que sigan disponibles");
  const d = validarMedicamento(datos);
  Object.assign(m, d);
  if (datos.foto) m.fotoUrl = urlDeArchivo(datos.foto);
  return medicamentoJson(m);
}

function solicitudDeMiPublicacion(id) {
  const d = bd.donaciones.find((x) => x.id === idNumero(id));
  const m = d && medicamentoPorId(d.medicamentoId);
  if (!d || m.donanteId !== USUARIO_ACTUAL) throw error("No encontramos esa solicitud");
  if (d.estado !== "SOLICITADA") throw error("Esta solicitud ya fue atendida");
  return { d, m };
}

export async function aceptarSolicitud(id) {
  const { d, m } = solicitudDeMiPublicacion(id);
  if (m.estado !== "DISPONIBLE") throw error("Este medicamento ya está reservado");
  if (m.fechaCaducidad <= hoyMx()) throw error("Este medicamento ya caducó");
  d.estado = "ACEPTADA";
  d.aceptadaEn = ahoraISO();
  bd.donaciones.filter((x) => x.medicamentoId === m.id && x.id !== d.id && x.estado === "SOLICITADA").forEach((x) => (x.estado = "RECHAZADA"));
  m.estado = "RESERVADO";
  return { id: d.id, estado: d.estado };
}

export async function rechazarSolicitud(id) {
  const { d } = solicitudDeMiPublicacion(id);
  d.estado = "RECHAZADA";
  return { id: d.id, estado: d.estado };
}

export async function listarMisDonaciones() {
  return bd.donaciones
    .filter((d) => {
      const m = medicamentoPorId(d.medicamentoId);
      return d.receptorId === USUARIO_ACTUAL || (m.donanteId === USUARIO_ACTUAL && ["ACEPTADA", "COMPLETADA"].includes(d.estado));
    })
    .sort((a, b) => (b.completadaEn ?? b.aceptadaEn ?? b.solicitadaEn).localeCompare(a.completadaEn ?? a.aceptadaEn ?? a.solicitadaEn))
    .map((d) => {
      const m = medicamentoPorId(d.medicamentoId);
      const esDonante = m.donanteId === USUARIO_ACTUAL;
      const contraparte = esDonante ? usuarioPorId(d.receptorId) : usuarioPorId(m.donanteId);
      const punto = ongPorId(m.puntoEntregaId);
      return {
        id: d.id,
        estado: d.estado,
        entregado: d.entregado,
        recibido: d.recibido,
        miRol: esDonante ? "DONANTE" : "RECEPTOR",
        contraparte: contraparte.usuario,
        solicitadaEn: d.solicitadaEn,
        aceptadaEn: d.aceptadaEn,
        completadaEn: d.completadaEn,
        medicamento: {
          id: m.id,
          nombre: m.nombre,
          registroSanitario: m.registroSanitario,
          numeroLote: m.numeroLote,
          fechaCaducidad: m.fechaCaducidad,
          fotoUrl: m.fotoUrl,
        },
        puntoEntrega: { id: punto.id, nombre: punto.nombre },
      };
    });
}

export async function crearReporte({ donacionId, motivo, imagen }) {
  const d = bd.donaciones.find((x) => x.id === idNumero(donacionId));
  const m = d && medicamentoPorId(d.medicamentoId);
  if (!d || (m.donanteId !== USUARIO_ACTUAL && d.receptorId !== USUARIO_ACTUAL)) throw error("No encontramos esa donación");
  if (!["ACEPTADA", "COMPLETADA"].includes(d.estado)) throw error("Solo puedes reportar donaciones aceptadas o completadas");
  const texto = (motivo ?? "").trim();
  if (!texto) throw error("El motivo del reporte es obligatorio");
  if (texto.length < 5) throw error("Describe el motivo con al menos 5 caracteres");
  if (bd.reportes.some((r) => r.donacionId === d.id && r.reportanteId === USUARIO_ACTUAL)) throw error("Ya reportaste esta donación");

  const reportadoId = m.donanteId === USUARIO_ACTUAL ? d.receptorId : m.donanteId;
  const r = { id: bd.siguiente.reporte++, donacionId: d.id, reportanteId: USUARIO_ACTUAL, reportadoId, motivo: texto, imagenUrl: urlDeArchivo(imagen), creadoEn: ahoraISO() };
  bd.reportes.push(r);
  return { id: r.id };
}

export async function obtenerOng() {
  return { ...ongPorId(ONG_ACTUAL) };
}

export async function listarDonacionesOng() {
  return bd.donaciones
    .filter((d) => medicamentoPorId(d.medicamentoId).puntoEntregaId === ONG_ACTUAL && ["ACEPTADA", "COMPLETADA"].includes(d.estado))
    .sort((a, b) => b.aceptadaEn.localeCompare(a.aceptadaEn))
    .map(donacionOngJson);
}

function donacionDeMiOng(id) {
  const d = bd.donaciones.find((x) => x.id === idNumero(id));
  if (!d || medicamentoPorId(d.medicamentoId).puntoEntregaId !== ONG_ACTUAL || !["ACEPTADA", "COMPLETADA"].includes(d.estado)) {
    throw error("No encontramos esa donación");
  }
  return d;
}

export async function obtenerDonacionOng(id) {
  const d = donacionDeMiOng(id);
  const ayudante = bd.ayudantes[d.receptorId];
  return { ...donacionOngJson(d), receptorAyudante: ayudante ? { ...ayudante } : null };
}

export async function actualizarEstadoOng(id, cambios) {
  const d = donacionDeMiOng(id);
  if (d.estado !== "ACEPTADA") throw error("Esta donación ya no se puede modificar");
  if (cambios.entregado !== undefined) d.entregado = Boolean(cambios.entregado);
  if (cambios.recibido !== undefined) d.recibido = Boolean(cambios.recibido);
  return { id: d.id, estado: d.estado, entregado: d.entregado, recibido: d.recibido };
}

export async function terminarCiclo(id) {
  const d = donacionDeMiOng(id);
  if (d.estado !== "ACEPTADA") throw error("Esta donación ya no está en curso");
  if (!d.entregado || !d.recibido) throw error("Confirma la entrega y la recepción antes de terminar el ciclo");
  d.estado = "COMPLETADA";
  d.completadaEn = ahoraISO();
  medicamentoPorId(d.medicamentoId).estado = "ENTREGADO";
  return { id: d.id, estado: d.estado };
}

export async function listarUsuariosAdmin() {
  return bd.usuarios
    .filter((u) => u.rol === "USUARIO")
    .map((u) => ({
      id: u.id,
      usuario: u.usuario,
      correo: u.correo,
      nombre: nombreCompleto(u),
      reportes: bd.reportes.filter((r) => r.reportadoId === u.id).length,
    }));
}

export async function obtenerUsuarioAdmin(id) {
  const u = bd.usuarios.find((x) => x.id === idNumero(id) && x.rol === "USUARIO");
  if (!u) throw error("No encontramos a ese usuario");
  return {
    usuario: { id: u.id, usuario: u.usuario, correo: u.correo, nombre: u.nombre, apellidoPaterno: u.apellidoPaterno, apellidoMaterno: u.apellidoMaterno, edad: u.edad },
    publicaciones: bd.medicamentos
      .filter((m) => m.donanteId === u.id)
      .map((m) => ({ id: m.id, nombre: m.nombre, registroSanitario: m.registroSanitario, estado: m.estado, creadoEn: m.creadoEn })),
    solicitudes: bd.donaciones
      .filter((d) => d.receptorId === u.id)
      .map((d) => {
        const m = medicamentoPorId(d.medicamentoId);
        return { id: d.id, estado: d.estado, solicitadaEn: d.solicitadaEn, medicamento: { nombre: m.nombre, registroSanitario: m.registroSanitario } };
      }),
    reportes: bd.reportes
      .filter((r) => r.reportadoId === u.id)
      .map((r) => ({ id: r.id, motivo: r.motivo, imagenUrl: r.imagenUrl, creadoEn: r.creadoEn, reportante: usuarioPorId(r.reportanteId).usuario })),
  };
}

export async function eliminarUsuarioAdmin(id) {
  const u = bd.usuarios.find((x) => x.id === idNumero(id) && x.rol === "USUARIO");
  if (!u) throw error("No encontramos a ese usuario");
  const medicamentos = bd.medicamentos.filter((m) => m.donanteId === u.id).map((m) => m.id);
  const donaciones = bd.donaciones.filter((d) => d.receptorId === u.id || medicamentos.includes(d.medicamentoId)).map((d) => d.id);
  bd.reportes = bd.reportes.filter((r) => !donaciones.includes(r.donacionId) && r.reportanteId !== u.id && r.reportadoId !== u.id);
  bd.donaciones = bd.donaciones.filter((d) => !donaciones.includes(d.id));
  bd.medicamentos = bd.medicamentos.filter((m) => !medicamentos.includes(m.id));
  bd.usuarios = bd.usuarios.filter((x) => x.id !== u.id);
  return { eliminado: true };
}
