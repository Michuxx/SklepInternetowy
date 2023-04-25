const express = require('express')
const cors = require('cors')
const loadDotEnv = require('./config/loadDotenv')
const connectDatabase = require('./config/connectDatabase')
const corsOptions = require('./config/corsOptions')
const rootRouter = require('./routes/rootRouter')

// ładowanie zminnych środowiskowych i łączenie z bazą danych
loadDotEnv()
connectDatabase()

// port serwera
const PORT = process.env.PORT || 3000

const app = express()

// middlewares
app.use(cors(corsOptions))
app.use(express.json({ limit: '50mb' }))
app.use(express.urlencoded({ extended: true, limit: '50mb' }))

// routes
app.use('/api', rootRouter)

// nasłuchiwanie na porcie
app.listen(PORT, () => {
    console.log(`Serwer działa na porcie ${PORT}`)
})
