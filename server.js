
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

// Recuerda el middleware que hace falta para leer el cuerpo de los POST,
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
    const seleccionesConCopas = selecciones.filter(s => s.copas.length > 0)
    console.log(seleccionesConCopas)
    return res.json(seleccionesConCopas)
})
//


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
app.get('/api/continente/:nombre', (req, res) => {
    const continente = req.params.nombre
    const continenteObj = continentes.find(c => c.nombre.toLowerCase() === continente.toLowerCase())

    if (!continenteObj) {
        res.status(404).json({ error: 'Continente no encontrado' })
        return
    }
    // Filtra las selecciones por el continente encontrado
    const seleccionesFiltradas = selecciones.filter(s => s.continenteId === continenteObj.id)
    res.json(seleccionesFiltradas)
})   
  
//   GET  /api/selecciones?campeon=true        solo las que ganaron alguna copa
// no funciona porque la ruta /api/selecciones/:id se ejecuta primero, por eso se hace con query param

app.get('/api/selecciones', (req, res) => {
    console.log("requerimiento:", req.query)
    const campeon = req.query.campeon === 'true'
    if (campeon) {
        const seleccionesCampeonas = selecciones.filter(s => s.copas.length > 0)
        console.log(seleccionesCampeonas)
        return res.json(seleccionesCampeonas)
        
    }  else {
        const seleccionesNoCampeonas = selecciones.filter(s => s.copas.length === 0)
        console.log(seleccionesNoCampeonas)
        return res.json(seleccionesNoCampeonas)
    }
    
})

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
    const estadisticas = [...selecciones].sort((a, b) => b.fifaRanking - a.fifaRanking  )
    return res.json(estadisticas)


})

//   ── Semifinales y final ⭐ ─────────────────────────────────────────────────
//   POST /api/worldcup/2026/semifinals/:n     registra la semifinal n (1 a 4)

app.post('/api/worldcup/2026/semifinals/:n', (req, res) => {
    const n = parseInt(req.params.n)
    
    partidos.semifinales[n - 1] = req.body
    res.status(201).json({ message: `Semifinal ${n} registrada` })
    
})

//   GET  /api/worldcup/2026/semifinals/:n     el resultado de la semifinal n
app.get('/api/worldcup/2026/semifinals/:n', (req, res) => {
    const n = parseInt(req.params.n)
    const semifinal = partidos.semifinales[n - 1]
    if (!semifinal) {
        res.status(404).json({ error: `Semifinal ${n} no registrada` })
        return
    }if (semifinal.local.goles>semifinal.visita.goles) {
        semifinal.ganador = semifinal.local.nombre
    } else if (semifinal.local.goles<semifinal.visita.goles) {
        semifinal.ganador = semifinal.visita.nombre
    }
    res.json(semifinal)
})

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
    if (!partidos.final) {
        res.status(404).json({ error: 'Final no registrada' })
        return
    }if (partidos.final.local.goles>partidos.final.visita.goles) {
        partidos.final.ganador = partidos.final.local.nombre
    } else if (partidos.final.local.goles<partidos.final.visita.goles) {
        partidos.final.ganador = partidos.final.visita.nombre
    }
    res.json(partidos.final)
})       



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
