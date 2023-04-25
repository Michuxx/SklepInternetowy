const { Router } = require('express')
const { User } = require('../models')
const verifyToken = require('../middlewares/verifyToken')
const createAccessToken = require('../utils/createAccessToken')
const bcrypt = require('bcrypt')

const router = Router()

/**
 * Tworzenie nowego konta za pomocą adresu email i hasła
 * Cały url to będzie: http://localhost:3000/api/auth/register), ponieważ
 * cały plik to authRouter, który jest używany w głównynm routerze (routes/index.js)
 * co oznacza, że url wygląda: /auth/register, następnie w pliku server.js używany jest
 * główny router, która łączy te wszystkie mniejsze więc url wygląda: /api/auth/register
 * i na przed tym wszystkim dodawny jesy url servera.
 */
router.post('/register', async (req, res) => {
    try {
        // destruk. i sprawdzanie czy wymagane dane zostały przekazane
        const { name, email, password, avatarUrl } = req.body
        if (!name || !email | !password) return res.status(400).json({ message: 'Brakuje wymaganych danych' })

        // sprawdzanie czy użytkownik o takim samym adresie email już istnieje
        const existingUser = await User.findOne({ email }).exec()
        if (existingUser)
            return res.status(409).json({ message: 'Użytkownik z takim adresem email już istnieje' })

        // hashowanie hasła i tworzenie nowego konta
        const hashedPassword = await bcrypt.hash(password, 10)
        const user = await User.create({ name, email, avatarUrl, password: hashedPassword })

        const access_token = createAccessToken(user._id)

        res.status(201).json({ user, access_token })
    } catch (err) {
        return res.status(500).json({ message: err })
    }
})

/**
 * Logowanie za pomocą adresu email i hasła
 */
router.post('/login', async (req, res) => {
    try {
        const { email, password } = req.body
        if (!email || !password) return res.status(400).json({ message: 'Brakuje wymaganych danych' })

        const user = await User.findOne({ email }).select('+password').exec()
        if (!user) return res.status(404).json({ message: 'Użytkownik z takim adresem email nie istnieje' })

        const isPasswordMatch = await bcrypt.compare(password, user.password)
        if (!isPasswordMatch) return res.status(400).json({ message: 'Błędne hasło lub adres email' })

        delete user.password

        const access_token = createAccessToken(user._id)

        res.status(201).json({ user, access_token })
    } catch (err) {
        return res.status(500).json({ message: err })
    }
})

/**
 * Sprawdzanie czy użytkownik jest zalogowany po przez middleware verifyTokens,
 * a następnie zwracanie użytkownika.
 */
router.get('/verify-and-get-user', verifyToken, async (req, res) => {
    try {
        const user = req.user
        const access_token = createAccessToken(user._id)
        res.status(200).json({ user, access_token })
    } catch (err) {
        return res.status(500).json({ message: err })
    }
})

module.exports = router
