"use strict";
var koa = require('koa');
var bodyParser = require('koa-bodyparser');
var Router = require('koa-router');
var graphqlHTTP = require('koa-graphql');
var mongoose = require('mongoose');
var cors = require('koa-cors');
var graphqlSchema = require('./graphql/schema');
var graphqlResolvers = require('./graphql/resolvers');
var accessLogger = require('./utils/log').accessLogger;
var app = new koa();
var router = new Router();
app.use(accessLogger());
app.use(cors());
app.use(bodyParser());
router.all('/graphql', graphqlHTTP({
    schema: graphqlSchema,
    rootValue: graphqlResolvers,
    graphiql: true,
}));
function add(num1) {
    return num1 + 1;
}
console.log(add(100));
app.use(router.routes()).use(router.allowedMethods());
mongoose
    .connect("mongodb+srv://dudulu:" + process.env.MONGO_PASSWORD + "@cluster0-1ojix.mongodb.net/" + process.env.MONGO_DB + "?retryWrites=true")
    .then(function () {
    app.listen(9001);
})
    .catch(function (err) {
    console.log(err);
});
