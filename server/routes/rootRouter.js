const { Router } = require('express')

const router = Router()

/**
 * Główny router łączący mniejsze routery
 * Używany jest w pliku server.js
 */

const authRouter = require('./auth')
const userRouter = require('./user')

router.use('/auth', authRouter)
router.use('/user', userRouter)

module.exports = router
