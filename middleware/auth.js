const jwt = require('jsonwebtoken')
const config = require('../utils/config')

const checkToken = (ctx, next) => {
  let token = ctx.request.headers['authorization'];
  if(token.startsWith('Bearer ')) {
    token = token.slice(7, token.length);
  }

  if(token) {
    jwt.verify(token, config.secret, (err, decoded) => {
      if(err) {
        return ctx.body = {
          success: false,
          message: 'Token is not valid'
        }
      } else {
        console.log('decoded', decoded)
        ctx.decoded = decoded
        next();
      }
    });
  } else {
    return ctx.body = {
      success: false,
      message: 'Auth token is not supplied'
    };
  }
}

module.exports = {
  checkToken
}