const jwt = require('jsonwebtoken')
const config = require('../utils/config')

class UserHandle {
  static login(ctx, next) {
    console.log(ctx.request.body);
    const {username, password} = ctx.request.body;
    const mockedUsername = 'admin';
    const mockedPassword = 'admin';

    if(username && password) {
      if(username === mockedUsername && password === mockedPassword) {
        const token = jwt.sign({username}, config.secret, {expiresIn: '24h'});
        ctx.body = {
          success: true,
          message: 'Authentication successful!',
          token
        };
      } else {
        ctx.body = {
          success: false,
          message: 'Incorrect username or password'
        };
      }
    } else {
      ctx.body = {
        successful: false,
        message: 'Authentication failed!'
      }
    }
  }
}

module.exports = UserHandle;