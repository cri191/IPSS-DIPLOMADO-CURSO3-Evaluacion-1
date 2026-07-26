# ⚽ Evaluación 1 · API del Mundial 2026

> **Diplomado IPS · Módulo 3** — Backend y APIs REST
> Instituto Profesional San Sebastián

---

## 🎯 Objetivo

### Objetivo general

Construir el backend de **"Mundial 2026"**: una API REST que administra las **selecciones** que participan en el torneo, organizadas por **grupos** y por **continentes**, y que permite registrar los **resultados de las semifinales y la final**; y **explicar tus propias decisiones técnicas** en un video demostrativo.

### Objetivos de aprendizaje

Al terminar esta evaluación, deberás ser capaz de:

1. **Diseñar y construir rutas con Express**, usando correctamente los parámetros de ruta (`:id`), los de consulta (`?continente=`) y el cuerpo de la petición.
2. **Resolver búsquedas y transformaciones sobre colecciones** con los métodos de array (`find`, `filter`, `map`, `flatMap`), incluyendo **búsquedas anidadas** entre entidades relacionadas.
3. **Modificar el estado de la aplicación** desde una ruta `POST`, registrando datos nuevos y validando lo que llega en el cuerpo de la petición.
4. **Responder con el código de estado HTTP correcto** según el resultado de cada operación, y manejar los casos de error sin que el servidor se caiga.
5. **Explicar y defender tus decisiones técnicas**: justificar por qué elegiste cada algoritmo, demostrar el funcionamiento en vivo, y **reconocer los límites de tu propia solución**.

> ### 📌 Sin base de datos
> Esta evaluación **no usa MongoDB**. Los datos se guardan en **arrays** declarados en tu código. Si reinicias el servidor, los cambios se pierden: **es lo esperado**. Lo que se evalúa aquí es tu manejo de **rutas** y de **algoritmos de búsqueda y transformación**.

**Algunos métodos propios de JavaScript que te permitirán resolver los algoritmos:**
`.find()` · `.filter()` · `.map()` · `.flatMap()` · `.push()` · `.some()` · `.sort()` · `.reduce()`

---

## 🚀 Cómo probar el backend evaluacion 1
Este repositorio contiene la solucion a la evaluacion 1
para ejecutar el proyecto sigue estos pasos
1. clónala el repositorio

```bash
git clone https://github.com/cri191/IPSS-DIPLOMADO-CURSO3-Evaluacion-1.git
cd IPSS-DIPLOMADO-CURSO3-Evaluacion-1
```
2. instalar de3pendencias
npm install
(el proyecto tiene en package.json las dependencias cors y express ya existen. Se instalaran cuando ejecutes npm install)


Y levanta tu servidor:
npm run dev

El servidor queda escuchando en del puerto 3000
http://localhost:3000



```bas
### Qué hay en el repositorio

| Archivo | Qué es |
|---|---|
| `datos-mundial.js` | **Tus datos, ya cargados.** No los tienes que inventar ni tipear. |
| `server.js` | El esqueleto: los datos importados y el mapa de rutas. **Aquí escribes tú.** |
| `package.json` | Con los scripts `dev` y `start` listos. Sin dependencias: las agregas tú. |
| `.gitignore` | Ya configurado (`node_modules`, `.env`). |

---

## 📋 Requerimientos técnicos

### 1. Los datos: te los damos hechos

> ### ✅ No tienes que inventar ni tipear los datos
> El archivo `datos-mundial.js` trae los tres arrays **ya cargados**: 16 selecciones repartidas en 4 grupos y 5 continentes, con sus copas reales. **Tu trabajo empieza en las rutas.**

Esta es la forma de los datos. Puedes agregar campos si los necesitas, pero **no quites los que están**:

```js
// Un continente agrupa selecciones
export const continentes = [
  { id: 1, nombre: 'Sudamérica', confederacion: 'CONMEBOL' },
  { id: 2, nombre: 'Europa',     confederacion: 'UEFA' },
  // ... (5 en total)
]

// Los grupos del torneo
export const grupos = [
  { id: 1, nombre: 'A' },
  // ... (4 en total)
]

// Cada selección pertenece a UN grupo y a UN continente (por su id).
// `copas` = los años de los mundiales que ganó.
export const selecciones = [
  { id: 1, nombre: 'Brasil', grupoId: 1, continenteId: 1, fifaRanking: 5,  copas: [1958, 1962, 1970, 1994, 2002] },
  { id: 2, nombre: 'Chile',  grupoId: 1, continenteId: 1, fifaRanking: 45, copas: [] },
  // ... (16 en total)
]

// Aquí se guardan los resultados que registres. Empiezan vacíos:
// los llenan tus rutas POST.
export const partidos = {
  semifinales: [],  // { numero: 1..4, local: {...}, visita: {...} }
  final: null,
}
```

> ### 📌 Fíjate en cómo se relacionan
> La selección **no guarda** el nombre de su continente ni el de su grupo: guarda su **`id`**. Para responder "las selecciones de Europa" tienes que **resolver esa referencia**. Ese salto entre arrays es una **búsqueda anidada**, y es justo lo que se está evaluando.

### 2. Las rutas base (rápidas)

Sin estas no hay API que probar. Son directas: te sirven para levantar Express y verificar que todo responde.

| Ruta | Qué debe hacer |
|---|---|
| `GET /api/selecciones` | Devuelve **todas** las selecciones. |
| `GET /api/selecciones/:id` | Devuelve **una** selección por su id. Si no existe → `404`. |

### 3. Las rutas con lógica ⭐ (el corazón de la evaluación)

Aquí está lo que de verdad se evalúa. Cada una te obliga a resolver un problema distinto.

| Ruta | Qué debe hacer |
|---|---|
| `GET /api/selecciones?continente=Europa` | **🔍 Búsqueda anidada.** La selección solo tiene `continenteId`, no el nombre. Tienes que **buscar primero** el continente por su nombre y **después** filtrar las selecciones por su id. |
| `GET /api/selecciones?campeon=true` | **🔍 Filtro.** Solo las selecciones que **ganaron al menos una copa**. Piensa: ¿cómo distingues una que ganó de una que no, si el dato es un array? |
| `GET /api/copas` | **🔍 Aplanar.** El listado plano de **todas** las copas de todas las selecciones. Cada selección tiene su propio array de copas: hay que unirlos todos en una sola lista. _Pista: `flatMap()`._ |
| `GET /api/copas/:seleccion` | **🔍 Buscar por nombre.** Las copas de **una** selección, buscándola por su **nombre** (ej. `/api/copas/argentina` → `[1978, 1986, 2022]`). Devuelve **el arreglo de años**. Si la selección no existe → `404`. |
| `GET /api/estadisticas` **(2%)** | **📊 Resumir · el más exigente.** Un resumen del torneo en un solo objeto: total de selecciones, total de copas repartidas, cuántas selecciones hay **por continente**, y el **ranking FIFA promedio**. _Pista: `reduce()`._ <br>**Vale solo 2% de la nota: si no te sale, casi no te afecta. Está para quien quiera ir más allá.** |

> ### ⚠️ Ojo: "no existe" y "no tiene" son cosas distintas
> `/api/copas/chile` → Chile **existe**, solo que no ha ganado ninguna copa: responde **`200` con `[]`**.
> `/api/copas/narnia` → esa selección **no existe**: responde **`404`**.
> Un arreglo vacío **no es un error**. El `404` significa "el recurso no existe", no "está vacío".

> ### 📌 Buscar por nombre, no por id
> El usuario escribe `/api/copas/argentina`, no `/api/copas/5`. Piensa cómo comparar: ¿qué pasa si escriben `Argentina`, `argentina` o `ARGENTINA`? Tu API debería responder igual en los tres casos.

### 4. Semifinales y final ⭐

El torneo tiene **cuatro semifinales** y **una final**. Cada una registra el resultado con los goles de las dos selecciones que se enfrentan.

> ### ✅ No son cuatro rutas: es una sola
> `/semifinals/1`, `/semifinals/2`, `/semifinals/3` y `/semifinals/4` se resuelven con **una única ruta parametrizada**: `/semifinals/:n`. El número llega como parámetro. Si escribiste cuatro rutas casi idénticas, vuelve a mirarla.

| Ruta | Qué debe hacer |
|---|---|
| `POST /api/worldcup/2026/semifinals/:n` | Registra el resultado de la semifinal `n` (de **1 a 4**). Recibe las dos selecciones y sus goles. Si `n` no está entre 1 y 4 → `400`. |
| `GET /api/worldcup/2026/semifinals/:n` | Devuelve el resultado de esa semifinal. Si aún no se jugó → `404`. |
| `GET /api/worldcup/2026/semifinals` | Las cuatro semifinales, con su resultado (o vacías si no se jugaron). |
| `POST /api/worldcup/2026/final` | Registra el resultado de la final, igual que una semifinal. |
| `GET /api/worldcup/2026/final` | Devuelve la final: quién jugó, los goles, y **quién ganó**. |

**Forma del cuerpo (POST de un partido):**

```json
{
  "local":  { "seleccionId": 1, "goles": 2 },
  "visita": { "seleccionId": 7, "goles": 1 }
}
```

**Forma de la respuesta (GET de un partido):**

```json
{
  "partido": "semifinal 1",
  "local":   { "seleccion": "Chile",    "goles": 2 },
  "visita":  { "seleccion": "Alemania", "goles": 1 },
  "ganador": "Chile"
}
```

> ### 📌 Fíjate en la respuesta
> El `POST` recibe **ids**, pero el `GET` responde con **nombres**. Tienes que resolver cada id a su selección: otra búsqueda anidada. Y `ganador` se **calcula** comparando los goles — no se guarda.

### 5. Manejo de errores y códigos de estado

- Usa el **código correcto** en cada caso: `200` al leer bien, `201` al crear, `400` si los datos que llegan están mal o faltan, `404` si el recurso no existe.
- Nunca respondas `200` con un error adentro del cuerpo.
- Los errores deben devolver un mensaje claro, ej: `{ "error": "No existe la selección 99" }`.
- Una ruta que no existe debe responder `404`, no reventar el servidor.

### 🌟 Desafíos extra (opcionales)

- **Tabla de posiciones:** `GET /api/grupos/:nombre/tabla` — las selecciones del grupo ordenadas por su ranking FIFA (usa `sort()`).
- **Camino al título:** `GET /api/worldcup/2026/camino/:seleccionId` — todos los partidos que jugó una selección (semifinal y final), con su resultado en cada uno.
- **Al campeón, su copa:** que al registrar la final, el ganador reciba automáticamente la copa `2026` en su array de `copas`.

---

## 🧰 Repaso rápido de las herramientas

Ya los viste en unidades anteriores. Aquí van refrescados, **con otros datos**.

> ### 📌 Estos ejemplos NO son del mundial
> Son de una biblioteca, a propósito: te muestran **cómo funciona cada método**, no cómo resolver tu evaluación. La traducción al problema de las selecciones es parte de tu trabajo.

```js
const libros = [
  { titulo: 'Rayuela',   autorId: 1, generos: ['novela', 'experimental'], paginas: 736 },
  { titulo: 'Ficciones', autorId: 2, generos: ['cuento', 'fantástico'],   paginas: 174 },
  { titulo: 'El Aleph',  autorId: 2, generos: ['cuento'],                 paginas: 146 },
]
const autores = [
  { id: 1, nombre: 'Cortázar', pais: 'Argentina' },
  { id: 2, nombre: 'Borges',   pais: 'Argentina' },
]
```

### 🔎 `find` — encontrar UNO

Devuelve **el primero** que cumpla, o `undefined`.

```js
libros.find(l => l.titulo === 'El Aleph')   // { titulo: 'El Aleph', autorId: 2, ... }
libros.find(l => l.titulo === 'Nada')       // undefined  ← por eso valida antes de usarlo
```

### 🧹 `filter` — quedarte con VARIOS

Devuelve un **array** con todos los que cumplan. Si ninguno cumple, devuelve `[]` (no `undefined`).

```js
libros.filter(l => l.paginas < 200)         // [ { Ficciones... }, { El Aleph... } ]

// ¿tiene al menos un género? el dato es un ARRAY:
libros.filter(l => l.generos.length > 0)
```

### 🪺 Búsqueda anidada — cuando el dato está en OTRO array

El libro no guarda el nombre del autor: guarda su `autorId`. Para buscar "los libros de Borges" hay que dar **dos saltos**.

```js
// ❌ No funciona: el libro no tiene la propiedad "autor"
libros.filter(l => l.autor === 'Borges')

// ✅ Dos pasos: primero el autor, después sus libros
const autor = autores.find(a => a.nombre === 'Borges')    // 1) resolver la referencia
if (!autor) return []                                      // 2) ¿y si no existe?
const suyos = libros.filter(l => l.autorId === autor.id)   // 3) ahora sí, filtrar
// [ { Ficciones... }, { El Aleph... } ]
```

### 🫓 `flatMap` — aplanar arrays que viven dentro de objetos

Cada libro tiene **su propio array** de géneros. Si usas `map`, te quedan **arrays dentro de un array**. `flatMap` hace el `map` **y** los aplana en una sola lista.

```js
libros.map(l => l.generos)
// [ ['novela','experimental'], ['cuento','fantástico'], ['cuento'] ]   ← anidado 😖

libros.flatMap(l => l.generos)
// [ 'novela', 'experimental', 'cuento', 'fantástico', 'cuento' ]       ← plano 🎉
```

### 📊 `reduce` — resumir una lista en UN solo valor _(solo para `/estadisticas` · 2%)_

Recorre el array acumulando. Ese acumulador puede ser un número… o un **objeto**, que es lo que sirve para _contar por categoría_.

```js
// Acumulador NÚMERO: total de páginas
const total = libros.reduce((acc, l) => acc + l.paginas, 0)
// 1056        ↑ acumulador        ↑ valor inicial

// Acumulador OBJETO: cuántos libros por autor
const porAutor = libros.reduce((acc, l) => {
  const nombre = autores.find(a => a.id === l.autorId).nombre  // ← anidada adentro
  acc[nombre] = (acc[nombre] || 0) + 1   // si no existe la clave, empieza en 0
  return acc                             // ← SIEMPRE devolver el acumulador
}, {})                                   // ← ahora el inicial es un objeto vacío
// { 'Cortázar': 1, 'Borges': 2 }
```

**El error más común:** olvidar el `return acc`. Sin él, el acumulador se pierde en la vuelta siguiente. Si tu `reduce` devuelve `undefined`, empieza por ahí.

> ### ✅ Un array vacío no es un error
> `filter` devuelve `[]` cuando nada cumple; `find` devuelve `undefined` cuando no encuentra. **No es lo mismo**, y tu API debe tratarlos distinto: una lista vacía suele ser un `200`; algo que no existe, un `404`.

---

## 📦 Entregables

### 1. Este repositorio, con tu código

Ya trae el `.gitignore` configurado. **Nunca subas `node_modules`**: si tu repositorio pesa cientos de megas, es que lo subiste. Esa carpeta se regenera con `npm install`.

### 2. Un `README.md` que explique cómo levantar tu proyecto

Breve. Qué instalar, qué comando corre el servidor, y en qué puerto queda escuchando. **Incluye también el enlace de YouTube a tu video** (ver punto 4).

> Puedes reemplazar este README por el tuyo.

### 3. Una colección de Postman exportada (`.json`)

Dentro del repositorio. No hace falta que incluya todas las variantes: con **una petición por cada ruta** alcanza, y las de `POST` con su cuerpo de ejemplo ya cargado, listas para ejecutar.

> ### ✅ Cómo se va a probar
> El profesor va a clonar tu repo, correr `npm install`, levantar tu servidor y ejecutar tu colección de Postman. **Si eso no funciona, no se puede evaluar tu trabajo.** Pruébalo tú antes de entregar: clona tu propio repositorio en otra carpeta y verifica que arranca desde cero.

### 4. Un video demostrativo **(15% de la nota)**

**Duración: mínimo 7 minutos, máximo 15.**

**Súbelo a YouTube** y **deja el enlace en tu `README.md`**. Puedes publicarlo como **"no listado"**: así solo lo ve quien tenga el enlace, no aparece en búsquedas ni en tu canal. Verifica que el enlace **se abra sin pedir permisos** — pruébalo en una ventana de incógnito antes de entregar.

> ### 📌 Qué se evalúa aquí
> No es narrar tu código línea por línea. Es **demostrar que entiendes lo que construiste**: por qué elegiste cada algoritmo, qué pasa cuando algo se rompe, y hasta dónde aguanta tu solución. Se te va a ver **trabajando en vivo**, no leyendo un guion.

#### Contenido obligatorio del video

**1. Tu API funcionando (Postman).** Muestra las rutas principales respondiendo de verdad: una consulta, un filtro por continente, las copas de una selección y el registro de una semifinal. Que se vean los **códigos de estado** en pantalla.

**2. Tus algoritmos, explicados por ti.** Abre tu código y explica **con tus palabras** las decisiones que tomaste. No describas la sintaxis: justifica el _por qué_.

- ¿Por qué `flatMap` y no un `map` seguido de otra cosa?
- ¿Cómo resolviste la **búsqueda anidada** del continente?
- ¿Cómo decides si una selección es campeona, si el dato es un _array_ de copas?
- Si resolviste `/estadisticas`: ¿qué hace tu `reduce`, paso a paso?

**3. Modificación del código en vivo — CORS.** Esta parte es obligatoria. Se hace **sobre tu código**, en tu editor: no necesitas navegador ni Postman aquí.

1. **Muestra dónde configuraste CORS** en tu proyecto y explica, con tus palabras, **qué hace esa configuración**.
2. **Modifícala en vivo**: restringe los verbos permitidos para que `DELETE` quede fuera.
3. **Explica qué pasaría** con esa configuración: quién bloquearía la petición, en qué momento, y por qué el servidor igual la recibió. _Puedes mostrarlo si quieres, pero no es obligatorio: lo que se evalúa es tu explicación._
4. **Deja tu código como estaba.**

> ### 📌 Aquí se evalúa que expliques, no que ejecutes
> Lo importante no es ver el error en pantalla: es que puedas **razonar sobre tu propia configuración** y anticipar qué provoca cambiarla. Tómate tu tiempo en esta parte — es donde mejor se nota que entiendes lo que escribiste.

**4. Los límites de tu solución (escalabilidad).** Cierra explicando, con tus palabras, **qué problemas tiene este diseño si el proyecto creciera**. Piensa en:

- Los datos viven **en memoria**: ¿qué pasa cuando el servidor se reinicia? ¿y si hubiera dos servidores atendiendo?
- Las búsquedas recorren el array **entero** cada vez: ¿qué pasa con 16 selecciones? ¿y con 100.000 registros?
- Las relaciones se resuelven **a mano** (buscar el continente, después filtrar): ¿qué se complica al agregar más entidades?
- ¿Qué cambiarías tú si tuvieras que llevar esto a producción?

> ### ✅ Aquí no hay respuesta única
> Esta última parte **no tiene una solución correcta**: se evalúa que **identifiques límites reales** de tu propio trabajo y los argumentes. Reconocer lo que tu código todavía no resuelve es una habilidad profesional, no una debilidad.

#### Requisitos técnicos del video

- **Duración:** entre **7 y 15 minutos**. Menos de 7 no alcanza a cubrir lo pedido; más de 15 no se revisa completo.
- Tu **voz** explicando. El código y Postman deben **leerse** en pantalla (sube el tamaño de la fuente del editor).
- Cámara opcional. Lo que importa es la pantalla y tu explicación.
- No hace falta editarlo ni que sea perfecto: **una toma continua está bien**. Si te equivocas y lo resuelves en vivo, mejor todavía.

---

## 📊 Ponderación

| % | Criterio |
|---:|---|
| **35%** | **Funcionalidad de las rutas** — Todos los endpoints existen y hacen lo que prometen. Las semifinales y la final registran y devuelven sus resultados correctamente. |
| **28%** | **Manejo de datos y algoritmos** — Uso correcto y pertinente de `find`, `filter` y `flatMap`. Las búsquedas anidadas resuelven bien las referencias entre selecciones, grupos y continentes. |
| **12%** | **Códigos de estado y errores** — Cada respuesta usa el status correcto (200 / 201 / 400 / 404). Los errores traen un mensaje claro y el servidor no se cae ante datos inválidos. |
| **8%** | **Entrega y orden** — El repositorio levanta siguiendo el README. La colección de Postman está completa. El código está ordenado y el `.gitignore` es correcto. |
| **2%** | **`GET /api/estadisticas`** — el `reduce`. Vale poco a propósito: es la ruta más exigente y está para quien quiera ir más allá. |
| **15%** | **🎥 Video demostrativo** — Demostración en vivo, explicación de tus algoritmos, la demo de CORS, y el análisis de escalabilidad. |

> **Sobre los desafíos extra:** son **opcionales** y no restan si no los haces. Se consideran para subir la nota cuando el resto está bien resuelto.

---

## 📐 Rúbrica A · La API (85%)

| Criterio | % | 4 · Destacado | 3 · Logrado | 2 · En desarrollo | 1 · Insuficiente |
|---|:--:|---|---|---|---|
| **Funcionalidad de las rutas** | 35 | Todas las rutas funcionan, incluidas las 4 semifinales y la final. Los filtros por query responden bien. Resuelve al menos un desafío extra. | Todas las rutas obligatorias funcionan. Puede haber fallas menores en algún filtro o caso borde. | Las rutas básicas funcionan, pero faltan algunas (semifinales incompletas, o los filtros por query no operan). | Faltan rutas centrales o el servidor no responde correctamente. |
| **Manejo de datos y algoritmos** | 28 | Usa el método **adecuado a cada problema** y lo justifica. El `flatMap` de copas está bien resuelto. Las búsquedas anidadas son limpias, sin recorridos innecesarios. | Usa correctamente los métodos pedidos. Las búsquedas anidadas funcionan, aunque alguna sea más larga de lo necesario. | Resuelve con métodos de array, pero elige mal alguno o las búsquedas anidadas fallan en algún caso. | Usa ciclos `for` en vez de los métodos pedidos, o las búsquedas anidadas no funcionan. |
| **Códigos de estado y errores** | 12 | Cada respuesta usa el status exacto. Valida la entrada, responde mensajes de error claros y útiles, y el servidor nunca se cae. | Usa los status correctos en los casos principales. Los errores traen mensaje. | Usa algunos status correctos, pero confunde otros (ej. `200` al crear, o `500` donde va `404`). | Responde siempre `200`, o el servidor se cae con datos inválidos. |
| **Entrega y orden** | 8 | El repo levanta siguiendo el README, sin fricción. La colección de Postman está completa y con ejemplos. Código ordenado y `.gitignore` correcto. | El repo levanta. README y colección de Postman presentes y utilizables. | El repo levanta con dificultad (falta un paso en el README, o la colección está incompleta). | No levanta, falta el README o la colección de Postman, o subió `node_modules`. |
| **📊 `/estadisticas`** _(el reduce)_ | 2 | El resumen está completo y correcto (totales, agrupación por continente y promedio), con `reduce` bien usado. | La ruta responde con el resumen, aunque falte algún dato o use un camino más largo. | La ruta existe pero el resumen está incompleto o mal calculado. | No la implementó. **Es lo esperado si no llegó: vale 2%.** |

---

## 🎥 Rúbrica B · El video (15%)

Duración: 7 a 15 minutos. Se evalúa que demuestres dominio, no que narres tu código.

| Criterio | % | 4 · Destacado | 3 · Logrado | 2 · En desarrollo | 1 · Insuficiente |
|---|:--:|---|---|---|---|
| **Demostración funcional** | 3 | Recorre las rutas con fluidez, mostrando los status. Elige buenos casos, incluidos errores (404 / 400) para demostrar que los maneja. | Muestra las rutas principales funcionando y se leen los status. | Muestra algunas rutas, pero salta partes pedidas o no se alcanza a leer la pantalla. | No demuestra la API funcionando, o no se ve lo que ocurre. |
| **Explicación de tus algoritmos** | 4 | **Justifica** cada elección: por qué `flatMap` y no otra cosa, cómo resolvió la búsqueda anidada, cómo distingue a las campeonas. Se nota que el código es suyo y que entiende cada decisión. | Explica sus algoritmos con sus palabras y se entiende. Justifica las decisiones principales. | Describe el código ("aquí hago un filter…") pero sin justificar por qué. Suena a lectura. | No explica sus algoritmos, o la explicación no corresponde con el código entregado. |
| **Modificación en vivo · CORS** | 5 | Ubica su configuración de CORS y explica qué hace. La modifica en vivo dejando `DELETE` fuera y **anticipa con precisión qué ocurriría**: quién bloquea, en qué momento, y por qué el servidor igual recibió la petición. Restaura su código. | Modifica la configuración y explica correctamente qué provocaría el cambio, aunque de forma breve. Restaura su código. | Modifica el código, pero la explicación de qué pasaría es vaga o imprecisa, o no lo deja como estaba. | No modifica su configuración en vivo, o no logra explicar qué hace ni qué provocaría cambiarla. |
| **Análisis de escalabilidad** | 3 | Identifica límites **reales y concretos** (datos en memoria que se pierden, búsquedas O(n) que no escalan, relaciones resueltas a mano) y **propone con criterio** qué cambiaría para producción. | Identifica al menos dos límites reales del diseño y los argumenta. | Menciona limitaciones de forma vaga o genérica ("habría que usar una base de datos"), sin conectarlas con su código. | No aborda la escalabilidad. |
| **Formato y duración** | — | **Requisito, no puntaje.** Un video de **menos de 7 minutos** o de **más de 15** se evalúa **solo hasta donde cumple**. Si el código no se lee en pantalla, ese criterio no se puede evaluar. **Sube el video a YouTube** (puede ser _no listado_) y **deja el enlace en tu `README.md`**. El enlace debe abrirse sin pedir permisos. | | | |

> **El video no reemplaza al código: lo demuestra.** Un video excelente sobre una API que no funciona no compensa la Rúbrica A.

> ### 📌 El video es individual y es tuyo
> Se evalúa **tu** comprensión de **tu** código: por eso lo que más suma es que **justifiques tus propias decisiones**, no que la solución sea perfecta. Explicar por qué elegiste un camino —y qué no te terminó de convencer— vale más que recitar lo que hace cada línea.

---

**Instituto Profesional San Sebastián** · Diplomado · Módulo 3 — Backend y APIs REST
