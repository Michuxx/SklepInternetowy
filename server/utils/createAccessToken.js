const jwt = require('jsonwebtoken')

/**
 *
 * @param {string} userId id użytkownika dla którego tworzony jest access token
 * @returns Zwraca access token jako `string`. Token dodany do headera zapytania po stronie
 * klienta jako `"Bearer <access_token>"` umożliwia użytkownikowi dostęp do zasobów chronionych
 * czyli tylko dla zalogowanych.
 */
module.exports = function (userId) {
    return jwt.sign({ _id: userId }, process.env.ACCESS_TOKEN_SECRET, {
        expiresIn: +process.env.ACCESS_TOKEN_EXPIRES_IN,
    })
}
