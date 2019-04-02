const koa = require('koa');
const bodyParser = require('koa-bodyparser');
const Router = require('koa-router');
const graphqlHTTP = require('koa-graphql');
const mongoose = require('mongoose');
var cors = require('koa-cors');

const graphqlSchema = require('./graphql/schema');
const graphqlResolvers = require('./graphql/resolvers');

const app = new koa();
const router = new Router();

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
