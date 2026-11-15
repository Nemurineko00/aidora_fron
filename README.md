# Aidora · Frontend

Interfaz de Aidora hecha con **Next.js 15 (App Router)**. Es **solo frontend**: no hace ninguna petición a un servidor ni maneja sesiones. Los datos son de ejemplo y viven en `lib/servicios.js`, para que más adelante se conecte con `aidora-backend` cambiando únicamente ese archivo.

## Puesta en marcha

```bash
npm install
npm run dev                   # http://localhost:3000
```

Producción: `npm run build && npm start`. Se puede publicar en Vercel tal cual, sin variables de entorno.

## Cómo probarlo (datos de ejemplo)

- Mientras no haya sesión, la pantalla de usuario siempre es **Ana** y la de ONG es **Cruz Roja Centro**. Hay otros usuarios (beto, carla, diego) con medicamentos y donaciones de ejemplo en todos los estados.
- Los cambios que hagas (solicitar, aceptar, publicar, reportar...) funcionan mientras navegas, pero **se pierden al recargar la página**.
- El login y el registro solo llevan a `/home`. Para ver los paneles de administración y de ONG escribe su dirección: `/admin` y `/recepcionONG`.

| Rol | Pantallas |
|---|---|
| Usuario | `/home` (buscar y solicitar), `/detalles` (publicar), `/misPublicaciones` (aceptar/rechazar, editar), `/reNamePubli?id=` (editar), `/misDonaciones` (ver estado y reportar), `/sesion` (perfil), `/ayudante` |
| Administrador | `/admin`, `/historialAdmin?id=`, `/menuAdmin?id=` |
| ONG/hospital | `/recepcionONG`, `/recepcionONG/:id` (también `/ong`) |

## Cómo está organizado

- `lib/servicios.js`: **único lugar con datos**. Cada función devuelve datos de ejemplo guardados en memoria; si algo sale mal lanza un `Error` con un mensaje que la pantalla muestra.
- `components/vistas/`: pantallas que necesitan datos; sus `page.js` conservan el `metadata` de cada ruta.
- `components/FormularioMedicamento.js`: formulario compartido por "Nuevo medicamento" y "Detalle publicación".
- `components/ModalReporte.js`: ventana para reportar.
- `lib/formato.js`: fechas y etiquetas.

## Para conectarlo con aidora-backend

1. Crea una variable `NEXT_PUBLIC_API_URL` con la dirección del backend y, en `lib/servicios.js`, una función que haga `fetch` a esa dirección (con el token de sesión cuando lo agregues).
2. Reemplaza el cuerpo de cada función por su llamada. Las pantallas no cambian porque los datos tienen la misma forma que responde el backend. La tabla dice qué ruta usar y qué parte de la respuesta devolver:

| Función de `servicios.js` | Ruta del backend | Devuelve |
|---|---|---|
| `iniciarSesion(correo, password)` | `POST /api/auth/login` | guarda `token` y devuelve `usuario` (su `rol` decide si ir a `/home`, `/admin` o `/recepcionONG`) |
| `registrar(datos)` | `POST /api/auth/registro` | igual que el login |
| `obtenerPerfil()` | `GET /api/auth/me` | la respuesta completa (`usuario` y `ayudante`) |
| `obtenerAyudante()` / `guardarAyudante(datos)` | `GET` / `PUT /api/ayudante` | `ayudante` |
| `listarPuntosEntrega()` | `GET /api/puntos-entrega` | `puntos` |
| `listarMedicamentosDisponibles()` | `GET /api/medicamentos` | `medicamentos` |
| `solicitarMedicamento(id)` | `POST /api/donaciones` con `{ medicamentoId }` | `donacion` |
| `listarMisPublicaciones()` | `GET /api/medicamentos/mios` | `medicamentos` |
| `obtenerPublicacion(id)` | `GET /api/medicamentos/:id` | `medicamento` |
| `publicarMedicamento(datos)` | `POST /api/medicamentos` (multipart, `foto` como archivo) | `medicamento` |
| `actualizarPublicacion(id, datos)` | `PUT /api/medicamentos/:id` (multipart) | `medicamento` |
| `aceptarSolicitud(id)` / `rechazarSolicitud(id)` | `POST /api/donaciones/:id/aceptar` o `/rechazar` | `donacion` |
| `listarMisDonaciones()` | `GET /api/donaciones/mias` | `donaciones` |
| `crearReporte(datos)` | `POST /api/reportes` (multipart: `donacionId`, `motivo`, `imagen`) | `reporte` |
| `obtenerOng()` | no existe: usa `usuario.nombre` de la sesión | `{ nombre }` |
| `listarDonacionesOng()` | `GET /api/ong/donaciones` | `donaciones` |
| `obtenerDonacionOng(id)` | `GET /api/ong/donaciones/:id` | `donacion` |
| `actualizarEstadoOng(id, cambios)` | `PATCH /api/ong/donaciones/:id` | `donacion` |
| `terminarCiclo(id)` | `POST /api/ong/donaciones/:id/terminar` | `donacion` |
| `listarUsuariosAdmin()` | `GET /api/admin/usuarios` | `usuarios` |
| `obtenerUsuarioAdmin(id)` | `GET /api/admin/usuarios/:id` | la respuesta completa |
| `eliminarUsuarioAdmin(id)` | `DELETE /api/admin/usuarios/:id` | `{ eliminado }` |

Los errores del backend llegan como `{ "error": "mensaje" }`: lánzalos como `new Error(mensaje)` y la pantalla los muestra sola.

## Qué se quitó respecto a la versión anterior

- Todas las llamadas al servidor y `lib/api.js`, junto con la variable `NEXT_PUBLIC_API_URL` y su `.env.example`.
- La protección de sesiones: `components/Protegida.js`, `lib/AuthContext.js`, el token guardado en el navegador y las redirecciones por rol. Cualquier pantalla se puede abrir directamente.
- El botón "Cerrar sesión" sigue ahí, pero solo lleva a `/login`.
- No cambió nada de la interfaz ni del CSS.

## Pendiente / sin tocar

- Cuando agregues la sesión, hará falta guardar el token, proteger las rutas por rol y hacer que "Cerrar sesión" lo borre.
- En la página de inicio (`/`), los botones de arriba dicen "Acceder" (lleva a login) e "Iniciar sesión" (lleva a registro): parecen intercambiados. No lo cambié por ser texto de diseño.
