const jwt = require('jsonwebtoken')
const { User } = require('../models')

/**
 * Middleware do sprawdzania czy użytkownik jest zalogowany aby skorzystać z route.
 * Więc jeśli użytkownik jest zalogowany to odbywa się funkcja danego routa, w
 * innym przypadku zwracany jest status 403 - czyli brak autoryzacji do zasobów.
 * @example router.get('/tylko-dla-zalogowanych', verifyTokens, async (req, res) => { ... }
 *
 */
module.exports = async function (req, res, next) {
    try {
        const header = req.headers.authorization
        if (!header) return res.status(403).send('Forbidden')

        const access_token = header.split(' ')[1]
        const { _id } = jwt.verify(access_token, process.env.ACCESS_TOKEN_SECRET)
        const user = await User.findById(_id).exec()

        if (!user) return res.status(403).send('Forbidden')
        req.user = user

        next()
    } catch (err) {
        res.status(403).send('Forbidden')
    }
}
