# Pruebas unitarias con Vitest

Este documento explica **qué se probó, por qué, cómo ejecutar las pruebas y cómo interpretar sus resultados** (incluyendo los errores que Vitest puede mostrar). Está pensado para que cualquier persona del equipo, sin conocimiento previo del setup, pueda entenderlo y mantenerlo.

## Índice

1. [Instalación y piezas del setup](#instalación-y-piezas-del-setup)
2. [Cómo ejecutar las pruebas](#cómo-ejecutar-las-pruebas)
3. [Estructura de archivos de test](#estructura-de-archivos-de-test)
4. [Qué se prueba y por qué](#qué-se-prueba-y-por-qué)
   - [Validadores del formulario de contacto](#1-validadores-del-formulario-de-contacto-contact-formvalidatorsspects)
   - [Navbar: idioma y modo oscuro](#2-navbar-idioma-y-modo-oscuro-navbarcomponentspects)
   - [Formulario de contacto (ContactComponent)](#3-formulario-de-contacto-contactcomponentspects)
5. [Cómo leer el output de Vitest](#cómo-leer-el-output-de-vitest)
6. [Errores conocidos y cómo resolverlos](#errores-conocidos-y-cómo-resolverlos)
7. [Cobertura de código](#cobertura-de-código)
8. [Cómo añadir una nueva prueba](#cómo-añadir-una-nueva-prueba)

---

## Instalación y piezas del setup

| Paquete | Rol |
|---|---|
| `vitest` | Motor de pruebas (test runner + assertions `expect`, `describe`, `it`, etc.) |
| `@analogjs/vite-plugin-angular` | Plugin de Vite que compila los componentes/plantillas Angular (`.ts` + `.html` + decoradores) para que Vitest los pueda ejecutar, igual que hace el compilador de Angular en un build real. |
| `@analogjs/vitest-angular` | Utilidades complementarias para integrar `TestBed` de Angular con Vitest. |
| `jsdom` | Simula el DOM y `window`/`document` dentro de Node, ya que Vitest no abre un navegador real. |
| `@vitest/coverage-v8` | Genera el reporte de cobertura de código (basado en el motor V8 de Node). |

Archivos de configuración creados:

- **`vitest.config.mts`** (raíz del proyecto): configura Vitest — entorno `jsdom`, el plugin de Angular, dónde están los archivos `*.spec.ts` y la configuración de cobertura.
  > Se usa la extensión `.mts` (no `.ts`) porque el `package.json` del proyecto es CommonJS por defecto y Vitest/Vite necesitan cargar el archivo de configuración como módulo ES. Si el archivo se llamara `vitest.config.ts`, Node lanza `ERR_REQUIRE_ESM` al intentar cargarlo.
- **`src/test-setup.ts`**: se ejecuta una vez antes de todas las pruebas. Carga `zone.js` (Angular todavía usa Zone.js para detección de cambios en este proyecto) e inicializa el entorno de testing de Angular (`TestBed.initTestEnvironment(...)`).
- **`tsconfig.spec.json`**: configuración de TypeScript específica para los archivos `*.spec.ts` (usa los tipos globales de `vitest/globals` — así no hay que importar `describe`/`it`/`expect` en cada archivo).

## Cómo ejecutar las pruebas

```bash
# Ejecuta todas las pruebas una vez y termina (ideal para CI)
npm test

# Modo watch: vuelve a ejecutar las pruebas afectadas cada vez que guardas un archivo
npm run test:watch

# Ejecuta las pruebas y genera un reporte de cobertura
npm run test:coverage
```

También se puede apuntar a un archivo concreto:

```bash
npx vitest run src/app/features/contact/contact.component.spec.ts
```

## Estructura de archivos de test

Cada archivo de prueba vive **junto al archivo que prueba**, con el sufijo `.spec.ts` (convención estándar de Angular):

```
src/app/
├── core/components/navbar/
│   ├── navbar.component.ts
│   └── navbar.component.spec.ts        ← nuevo
└── features/contact/
    ├── contact.component.ts
    ├── contact.component.spec.ts       ← nuevo
    ├── contact-form.validators.ts
    └── contact-form.validators.spec.ts ← nuevo
```

## Qué se prueba y por qué

### 1. Validadores del formulario de contacto (`contact-form.validators.spec.ts`)

Archivo probado: `src/app/features/contact/contact-form.validators.ts`. Son **funciones puras** (no dependen de Angular ni del DOM), por eso son las pruebas más simples y rápidas de todas.

| Validador | Qué hace en la app | Qué prueba el test |
|---|---|---|
| `emailFormatValidator` | Verifica que el email tenga forma `algo@dominio.tld` | Email válido → sin error. Email mal formado → `{ emailInvalid: true }`. Vacío → sin error (el `required` lo controla otro validador aparte). |
| `minLengthTrimmedValidator(10)` | El mensaje debe tener al menos 10 caracteres **sin contar espacios al inicio/final** | Texto corto (aun con espacios) → `{ minLength: true }`. Texto suficientemente largo → sin error. `null`/`undefined` → tratado como cadena vacía → error. |
| `noWhitespaceValidator` | Rechaza mensajes que son solo espacios en blanco | Solo espacios → `{ whitespace: true }`. Texto con contenido real → sin error. `null` → error. |
| `NO_SQL_INJECTION_REGEX` | Expresión regular anti inyección SQL/XSS básica usada como `Validators.pattern(...)` | Mensaje normal → coincide (permitido). Mensajes con `select`, `drop table`, `<script>`, `;`, etc. → no coinciden (rechazados). |

**Por qué importa**: estas son las reglas de negocio que protegen el formulario de contacto de spam, mensajes vacíos/inválidos e intentos básicos de inyección. Si alguien las modifica sin querer, estas pruebas fallan inmediatamente.

### 2. Navbar: idioma y modo oscuro (`navbar.component.spec.ts`)

Archivo probado: `src/app/core/components/navbar/navbar.component.ts`.

El `NavbarComponent` guarda sus preferencias en `localStorage` (`idioma`, `modoOscuro`) y modifica la clase `dark` en `document.documentElement` (usada por Tailwind para el modo oscuro). Se prueban:

- **Estado inicial**: sin nada guardado en `localStorage`, el idioma por defecto es `es` y el modo oscuro está **activado** por defecto.
- **Persistencia**: si `localStorage` ya tiene `idioma=en` o `modoOscuro=false`, el componente respeta ese valor al iniciar.
- **`cambiarIdioma()`**: alterna entre `es`/`en`, actualiza el signal `idioma()` y lo guarda en `localStorage`.
- **`toggleModoOscuro()`**: alterna el signal `esModoOscuro()`, lo persiste y añade/quita la clase `dark` del `<html>`.
- **Interacción real con el DOM**: se simula un click en el botón de idioma y un evento `change` en el checkbox de modo oscuro, verificando que efectivamente disparan `cambiarIdioma()`/`toggleModoOscuro()` (no solo se prueba el método aislado, sino que el botón/checkbox del HTML está correctamente enlazado).
- **`toggleMenu()` / `cerrarMenu()`**: abrir/cerrar el menú móvil, y que el menú solo se cierra si el click viene de un enlace (`<a>`), no de cualquier parte del panel.
- **`isActive()`**: determina si un link del menú corresponde a la ruta actual.

**Por qué importa**: es la única parte de la UI con estado persistente (localStorage) que afecta a toda la aplicación (dark mode e idioma). Un bug aquí se nota en cada página, no solo en el navbar.

**Nota sobre `localStorage`/clase `dark`**: cada prueba limpia `localStorage` y quita la clase `dark` del `<html>` antes y después (`beforeEach`/`afterEach`), para que el estado de una prueba no "contamine" a la siguiente.

### 3. Formulario de contacto (`contact.component.spec.ts`)

Archivo probado: `src/app/features/contact/contact.component.ts`. Es el componente más complejo de la app porque combina: un `FormGroup` reactivo con validadores, una llamada HTTP real (`ContactService`), un widget externo de terceros (**Cloudflare Turnstile**, cargado dinámicamente vía `<script>`) y notificaciones (`ngx-toastr`).

Como Turnstile es un servicio externo (no se puede cargar de verdad en un test), se **simula (`mock`)** con un objeto `window.turnstile` falso que se comporta igual: al llamar a `render(...)` guarda el `callback` que la app usaría para recibir el token de verificación, y ese callback se invoca manualmente en el test para simular "el usuario resolvió el captcha".

Grupos de pruebas:

- **Validez del formulario**: reutiliza indirectamente los validadores ya probados en el punto 1, pero ahora verificando que estén **correctamente conectados** a los campos `nombre`, `email` y `mensaje` del formulario real (por ejemplo: que el campo `mensaje` sí dispare `minLength`, `whitespace` y el patrón anti-inyección; que el formulario completo sea `valid`/`invalid` según corresponda).
- **`onSubmit()`**:
  - Si el formulario es inválido, no hace nada (no activa el estado de verificación).
  - Con datos válidos, activa `isVerifying()` y llama a `window.turnstile.render(...)` (se comprueba capturando el `callback` pasado al widget).
  - Cuando Turnstile "resuelve" (se invoca el callback simulado con un token falso), el componente **hace la petición HTTP real** a `https://send-email.willian-moralesch.workers.dev/` con el body esperado (`nombre`, `email`, `mensaje`, `turnstileToken`). Esa petición se intercepta con `HttpClientTestingModule` (nunca sale a internet) y se le da una respuesta simulada:
    - **Éxito (200)** → se llama a `toastr.success(...)`, se marca `isSubmitted()` y el formulario vuelve a su estado `pristine` (se resetea).
    - **429 (rate limit)** → se llama a `toastr.warning(...)` (no a `error`).
    - **Cualquier otro error (ej. 500)** → se llama a `toastr.error(...)`.

**Por qué importa**: es el único punto de contacto real entre el visitante y el propietario del portafolio. Un bug silencioso aquí (ej. que no se envíe el token, o que un error 429 se trate como error genérico) afecta directamente la funcionalidad de negocio más importante del sitio.

**Detalle técnico**: en el test se inserta manualmente en el DOM un `<div id="turnstile-container">` (el mismo `id` que usa la plantilla real) *antes* de llamar a `onSubmit()`. Esto evita depender del `setTimeout` de reintento que tiene el componente (`initTurnstileWithRetry`, pensado para esperar a que el script externo de Cloudflare cargue en producción) y hace que la prueba sea **determinista** (no depende de temporizadores).

## Cómo leer el output de Vitest

Ejemplo de salida cuando **todo pasa**:

```
✓ src/app/features/contact/contact-form.validators.spec.ts (14 tests) 19ms
✓ src/app/features/contact/contact.component.spec.ts (14 tests) 540ms
✓ src/app/core/components/navbar/navbar.component.spec.ts (13 tests) 606ms

 Test Files  3 passed (3)
      Tests  41 passed (41)
```

- **`✓`** en verde = archivo (o prueba individual) exitoso.
- El número entre paréntesis = cantidad de `it(...)` dentro de ese archivo.
- **`Test Files`** = archivos `.spec.ts` ejecutados. **`Tests`** = número total de `it(...)` individuales.

Ejemplo cuando **una prueba falla**:

```
❯ src/app/features/contact/contact.component.spec.ts (14 tests | 1 failed)
    ✓ debe crearse correctamente
    × debe enviar el mensaje al backend y mostrar éxito cuando Turnstile resuelve el token

 FAIL  src/app/features/contact/contact.component.spec.ts > ContactComponent > onSubmit > debe enviar el mensaje...
 AssertionError: expected false to be true
  ❯ src/app/features/contact/contact.component.spec.ts:166:33
    164|
    165|       expect(fixture.componentInstance.isSubmitted()).toBe(true);
    166|       expect(toastrSuccessSpy).toHaveBeenCalledTimes(1);
```

Cómo interpretarlo:

1. **`❯` (flecha roja) / `× ` (cruz roja)**: indica el archivo y la prueba concreta que falló. El texto tras la última `>` es el nombre exacto del `it(...)`.
2. **`AssertionError: expected X to be Y`**: es la afirmación (`expect(...)`) que no se cumplió. `X` es lo que realmente ocurrió, `Y` lo que la prueba esperaba.
3. **Ruta `archivo.spec.ts:línea:columna`**: te lleva exactamente a la línea del `expect(...)` que falló — abre ese archivo en esa línea para ver qué se estaba comprobando.
4. Si el error es un `TypeError` o algo lanzado por el propio componente (no un `AssertionError`), normalmente significa que **el código de producción cambió** de forma incompatible con lo que la prueba asume (por ejemplo, se renombró un método, cambió la firma de una función, o se eliminó un elemento del HTML que la prueba buscaba con `querySelector`).

En resumen: **el mensaje de error siempre te dice qué se esperaba vs. qué pasó realmente**, y el stack trace apunta a la línea del test. A partir de ahí, hay que decidir si:
   - el **código de producción** tiene un bug (arreglarlo), o
   - el **test** quedó desactualizado porque el comportamiento cambió intencionalmente (actualizar el test).

## Errores conocidos y cómo resolverlos

| Error | Causa | Solución |
|---|---|---|
| `Error [ERR_REQUIRE_ESM]: require() of ES Module ... not supported` al arrancar Vitest | El archivo de configuración se llamaba `vitest.config.ts` y el proyecto es CommonJS (`package.json` sin `"type": "module"`). | Ya solucionado: el archivo se llama `vitest.config.mts`. No renombrarlo a `.ts`. |
| `Cannot find native binding` / `Cannot find module '@oxc-parser/binding-win32-x64-msvc'` al ejecutar Vitest en **Windows** | `npm install` no siempre descarga el binario nativo opcional de `oxc-parser` (dependencia interna de `@analogjs/vite-plugin-angular`) en Windows, por un problema conocido de npm con dependencias opcionales. | Ejecutar una vez: `npm install @oxc-parser/binding-win32-x64-msvc@0.121.0 --no-save`. Si cambia la versión de `oxc-parser` en el futuro, ajustar la versión del binding para que coincida (`npm ls oxc-parser`). |
| `Missing: Zone (zone.js)` | `src/test-setup.ts` no se cargó (falta en `setupFiles` de `vitest.config.mts`, o se borró el import de `@analogjs/vite-plugin-angular/setup-vitest`). | Verificar que `vitest.config.mts` tenga `setupFiles: ['src/test-setup.ts']` y que ese archivo importe `@analogjs/vite-plugin-angular/setup-vitest`. |
| `NG0200` / errores de inyección de dependencias en un `*.spec.ts` | Falta registrar un provider en `TestBed.configureTestingModule({ providers: [...] })` (por ejemplo, `TranslateService`, `HttpClient`, `ToastrService`). | Revisar qué servicios usa el componente (`inject(...)`) y añadir el provider real, uno de prueba (`TranslateModule.forRoot()`), o un mock (`useValue`). |
| Test que involucra `setTimeout`/temporizadores queda "colgado" o es intermitente | El componente usa reintentos con `setTimeout` (p. ej. `ContactComponent.initTurnstileWithRetry`) y el test no controla el tiempo. | Preferir, cuando sea posible, dejar las condiciones ya cumplidas *antes* de disparar la acción (como se hizo en `contact.component.spec.ts`, insertando el contenedor de Turnstile en el DOM antes de llamar a `onSubmit()`), en vez de depender de temporizadores reales. |

## Cobertura de código

```bash
npm run test:coverage
```

Genera un resumen en consola y, además, reportes en `coverage/` (ignorado por git) en formato `text`, `html` y `lcov`. Para ver el detalle interactivo, abrir `coverage/index.html` en el navegador tras ejecutar el comando.

Estado actual (referencia, puede cambiar con el tiempo):

| Archivo | % Statements | % Branch | % Functions | % Lines |
|---|---|---|---|---|
| `contact-form.validators.ts` | 100% | 100% | 100% | 100% |
| `contact.service.ts` | 100% | 100% | 100% | 100% |
| `navbar.component.ts` | 94.1% | 100% | 81.8% | 93.5% |
| `contact.component.ts` | 86.8% | 70.8% | 86.7% | 89.2% |

Las líneas no cubiertas en `contact.component.ts` corresponden principalmente al mecanismo de reintento por `setTimeout` (rama de "Cloudflare Turnstile no cargó todavía") y al manejo del caso límite de "máximo de reintentos alcanzado", que son más costosos de simular de forma determinista y se dejaron fuera de este primer set de pruebas.

## Cómo añadir una nueva prueba

1. Crea un archivo `nombre-del-archivo.spec.ts` junto al archivo que quieras probar.
2. No necesitas importar `describe`, `it`, `expect` ni `vi`: están disponibles como globales gracias a `globals: true` en `vitest.config.mts` y a los tipos `vitest/globals` en `tsconfig.spec.json`.
3. Si el archivo prueba un **componente Angular**, usa `TestBed.configureTestingModule({ imports: [TuComponente, ...], providers: [...] })` (mira `navbar.component.spec.ts` o `contact.component.spec.ts` como referencia) y registra ahí cualquier servicio que el componente inyecte.
4. Si el archivo prueba **funciones puras** (sin Angular), simplemente impórtalas y pruébalas directamente (mira `contact-form.validators.spec.ts`).
5. Ejecuta `npx vitest run ruta/al/archivo.spec.ts` mientras lo desarrollas, y `npm test` antes de subir el cambio para asegurarte de que no rompiste nada más.
