const koa = require('koa');
const bodyParser = require('koa-bodyparser');
const Router = require('koa-router');
const graphqlHTTP = require('koa-graphql');
const mongoose = require('mongoose');
const cors = require('koa-cors');

const graphqlSchema = require('./graphql/schema');
const graphqlResolvers = require('./graphql/resolvers');
const { accessLogger } = require('./utils/log');
const UserHandle = require('./middleware/userHandle');
const { checkToken } = require('./middleware/auth');
function main() {
  const app = new koa();
  const router = new Router();

  app.use(accessLogger());
  app.use(cors());
  app.use(bodyParser());
  router.all(
    '/graphql',
    graphqlHTTP({
      schema: graphqlSchema,
      rootValue: graphqlResolvers,
      graphiql: true,
    })
  );
  console.log(UserHandle.login);
  router.post('/login', UserHandle.login);
  router.get('/query', checkToken, (ctx, next) => {
    ctx.body = {
      message: 'successful',
      status: true,
      decoded: ctx.decoded
    }
  });
  app.use(router.routes()).use(router.allowedMethods());

  mongoose
    .connect(
      `mongodb+srv://dudulu:${
        process.env.MONGO_PASSWORD
      }@cluster0-1ojix.mongodb.net/${process.env.MONGO_DB}?retryWrites=true`
    )
    .then(() => {
      app.listen(9001);
    })
    .catch(err => {
      console.log(err);
    });
}

main();
