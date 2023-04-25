const { Router } = require('express')
const { isObjectIdOrHexString } = require('mongoose')
const { User } = require('../models')

const router = Router()

/**
 * Wyszukiwanie użytkownika po id wyciągniętym z parametrów
 */
router.get('/:userId', async (req, res) => {
    try {
        const { userId } = req.params

        if (!userId) return res.status(400).json({ message: 'Brakuje wymaganych danych' })
        if (!isObjectIdOrHexString(userId))
            return res.status(400).json({ message: 'Podane id jest błędnej struktury' })

        const user = await User.findById(userId).exec()
        if (!user) return res.status(404).json({ message: 'Nie znaleziono użytkownika o podanych id' })

        res.status(200).json({ user })
    } catch (err) {
        res.status(500).json({ message: err })
    }
})

module.exports = router
