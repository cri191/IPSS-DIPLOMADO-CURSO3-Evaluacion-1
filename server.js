
// Evaluación 1 · API del Mundial 2026
// Diplomado IPS · Módulo 3 — Backend y APIs REST
//
// Este es tu punto de partida. Los DATOS ya están (datos-mundial.js): el resto
// lo escribes tú.
//
// ANTES DE EMPEZAR — instala lo que necesites. Por ejemplo:
//     npm install express
//     npm install cors
//
// Para levantar el servidor:
//     npm run dev        (se reinicia solo al guardar)
// ─────────────────────────────────────────────────────────────────────────────

import { continentes, grupos, selecciones, partidos } from './datos-mundial.js'

// TODO: importa express y crea tu app.
//
import express from 'express'
import cors from 'cors'

const app = express()
app.use(express.json()) // Middleware para leer el cuerpo de los POST


// y configura CORS (lo vas a necesitar para el video).
app.use(cors({methods: ['GET', 'POST', 'PUT', 'DELETE' ]}))    
app.get('/', (req, res) => {
    res.send('API del Mundial 2026')
})

// ─────────────────────────────────────────────────────────────────────────────
// TUS RUTAS
//
// Este es el mapa de lo que tienes que construir. El detalle completo de cada
// una (qué recibe, qué devuelve, qué status) está en el enunciado: léelo.
//
//   ── Base ──────────────────────────────────────────────────────────────────
//   GET  /api/selecciones                     todas
app.get('/api/selecciones', (req, res) => {
    res.json(selecciones)
})

// otro forma de hacerlo es con una ruta específica para las selecciones campeonas:
//   GET  /api/selecciones/copas               solo las que ganaron alguna copa
// la ruta específica debe ir antes de la ruta dinámica /api/selecciones/:id para que no se confunda con un id.
app.get('/api/selecciones/copas', (req, res) => {
  // 1. Filtramos solo las selecciones que tienen copas
  const seleccionesConCopas = selecciones.filter(s => s.copas && s.copas.length > 0);

  // 2. Mapeamos para devolver solo el nombre/país y el array de copas
  const resultado = seleccionesConCopas.map(s => ({
    pais: s.nombre,        
    copas: s.copas,
    
  }));

  res.json(resultado);
})


//   GET  /api/selecciones/:id                 una, o 404
app.get('/api/selecciones/:id', (req, res) => {
    const id = parseInt(req.params.id)
    const seleccion = selecciones.find(s => s.id === id)    

    if (!seleccion) {
        res.status(404).json({ error: 'Selección no encontrada' })
        return
    }
    res.json(seleccion)
})

//   ── Con lógica ⭐ ──────────────────────────────────────────────────────────
//   GET  /api/selecciones?continente=Europa   filtra por continente  (anidada)
// Función auxiliar para quitar acentos y pasar a minúsculas

const normalizarTexto = (texto) => {
  if (!texto) return "";
  return decodeURIComponent(texto)
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase();
};

app.get('/api/continente/:nombre', (req, res) => {
  const continenteParam = normalizarTexto(req.params.nombre);
aq
  // Compara quitando acentos a ambos lados
  const continenteObj = continentes.find(c => 
    normalizarTexto(c.nombre) === continenteParam
  );

  if (!continenteObj) {
    return res.status(404).json({ error: 'Continente no encontrado' });
  }

  // Filtra las selecciones
  const seleccionesFiltradas = selecciones.filter(
    s => s.continenteId === continenteObj.id
  );

  res.json(seleccionesFiltradas);
});
  
//   GET  /api/selecciones?campeon=true        solo las que ganaron alguna copa








//   GET  /api/copas                           todas las copas, en una lista plana
app.get('/api/copas', (req, res) => {
    const copas = selecciones.flatMap(s => s.copas)
    res.json(copas)
})



//   GET  /api/copas/:seleccion                las copas de una (por NOMBRE), o 404
app.get('/api/copas/:nombre', (req, res) => {
    const nombre = req.params.nombre
    const seleccion = selecciones.find(s => s.nombre.toLowerCase() === nombre.toLowerCase())    

    if (!seleccion) {
        res.status(404).json({ error: 'Selección no encontrada' })
        return
    }
    res.json(seleccion.copas)
})

//   GET  /api/estadisticas                    resumen del torneo         (vale 2%)
app.get('/api/estadisticas', (req, res) => {
    // Lógica para calcular y devolver las estadísticas del torneo
    //ordenar por ranking,
    const estadisticas = [...selecciones].sort((a, b) => a.fifaRanking - b.fifaRanking  )
    res.json ({mensaje : "selecciones ordenadas por ranking de la FiFa",
               selecciones : estadisticas
    })
               


})

//   ── Semifinales y final ⭐ ─────────────────────────────────────────────────
//   POST /api/worldcup/2026/semifinals/:n     registra la semifinal n (1 a 4)

app.post('/api/worldcup/2026/semifinals/:n', (req, res) => {
    const n = parseInt(req.params.n)
    
    //si n es mayor a igual a  1 y menor igual a 
    if (isNaN(n)||n<1 || n>4){return res.status(400).json({error:"el parametro debe ser 1,2,3,4"})}
    
    partidos.semifinales[n - 1] = req.body
    res.status(201).json({ message: `Semifinal ${n} registrada` })
    
})

//   GET  /api/worldcup/2026/semifinals/:n     el resultado de la semifinal n
app.get('/api/worldcup/2026/semifinals/:n', (req, res) => {
  const n = parseInt(req.params.n);

  // 1. Obtener la semifinal guardada
  const semifinal = partidos.semifinales[n - 1];

  if (!semifinal) {
    return res.status(404).json({ error: "Semifinal ${n} no registrada" });
  }

  // 2. Buscar las selecciones por su ID en el arreglo de datos
  const localObj = selecciones.find(s => s.id === semifinal.local.seleccionId);
  const visitaObj = selecciones.find(s => s.id === semifinal.visita.seleccionId);

  const nombreLocal = localObj ? localObj.nombre : 'Desconocido';
  const nombreVisita = visitaObj ? visitaObj.nombre : 'Desconocido';

  // 3. Determinar el ganador
  let ganador = 'Empate';
  if (semifinal.local.goles > semifinal.visita.goles) {
    ganador = nombreLocal;
  } else if (semifinal.visita.goles > semifinal.local.goles) {
    ganador = nombreVisita;
  }

  // 4. Retornar con el formato exacto requerido
  res.json({
    partido: "semifinal ${n}",
    local: {
      seleccion: nombreLocal,
      goles: semifinal.local.goles
    },
    visita: {
      seleccion: nombreVisita,
      goles: semifinal.visita.goles
    },
    ganador: ganador
  });
});



//muestra todas las semifinales registradas
//   GET  /api/worldcup/2026/semifinals        las cuatro
app.get('/api/worldcup/2026/semifinals', (req, res) => {
    res.json(partidos.semifinales)
})


//   POST /api/worldcup/2026/final             registra la final
app.post('/api/worldcup/2026/final', (req, res) => {
    partidos.final = req.body
    res.status(201).json({ message: 'Final registrada' })
})


//   GET  /api/worldcup/2026/campeon             la final, con su ganador
app.get('/api/worldcup/2026/campeon', (req, res) => {

  // 1. Obtener la final guardada
  const final = partidos.final;

  if (!final) {
    return res.status(404).json({ error: "final no registrada" });
  }
// 2. Buscar las selecciones por su ID en el arreglo de datos
  const localObj = selecciones.find(s => s.id === final.local.seleccionId);
  const visitaObj = selecciones.find(s => s.id === final.visita.seleccionId);

  const nombreLocal = localObj ? localObj.nombre : 'Desconocido';
  const nombreVisita = visitaObj ? visitaObj.nombre : 'Desconocido';

  // 3. Determinar el campeon
  let campeon = 'Empate';
  if (final.local.goles > final.visita.goles) {
    campeon = nombreLocal;
  } else if (final.visita.goles > final.local.goles) {
    campeon= nombreVisita;
  }
 // 4. Retornar con el formato exacto requerido
  res.json({
    partido: "final ",
    local: {
      seleccion: nombreLocal,
      goles: final.local.goles
    },
    visita: {
      seleccion: nombreVisita,
      goles: final.visita.goles
    },
    campeon: campeon
  });
});


    // Ojo: /semifinals/:n es UNA ruta, no cuatro.
// ─────────────────────────────────────────────────────────────────────────────

// Ejemplo para que veas el formato. Bórralo o quédatelo, como prefieras:
//
//   app.get('/api/selecciones', (req, res) => {
//     res.json(selecciones)
//   })
//
// A partir de aquí, es tuyo. 🚀

// TODO: levanta el servidor.
const PORT = 3000
  app.listen(PORT, () => {
    console.log(`⚽ API del Mundial escuchando en http://localhost:${PORT}`)
  })
