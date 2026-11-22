const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000/api";

export function guardarToken(token,rol="usuario") {
  localStorage.setItem("token", token);
  localStorage.setItem("rol", rol);
}

export function leerRol() {
  return typeof window !== "undefined" ? localStorage.getItem("rol") : null;
}

export function borrarToken() {
  localStorage.removeItem("token");
  localStorage.removeItem("rol");
  localStorage.removeItem("ong");
}

export async function api(ruta, { metodo = "GET", cuerpo, formData } = {}) {
  const token = typeof window !== "undefined" ? localStorage.getItem("token") : null;
  const headers = {};
  if (cuerpo !== undefined) headers["Content-Type"] = "application/json";
  if (token) headers.Authorization = `Bearer ${token}`;

  let respuesta;
  try {
    respuesta = await fetch(`${API_URL}${ruta}`, {
      method: metodo,
      headers,
      body: formData ?? (cuerpo !== undefined ? JSON.stringify(cuerpo) : undefined),
    });
  } catch {
    throw new Error("No se pudo conectar con el servidor. Intenta de nuevo en un momento.");
  }
  const datos = await respuesta.json().catch(() => ({}));

  if (respuesta.status === 401 && token) {
    borrarToken();
    window.location.href = "/login";
  }
  if (!respuesta.ok) throw new Error(datos.error || `Error ${respuesta.status}`);
  return datos;
}
