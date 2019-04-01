const { graphql, buildSchema } = require('graphql');

const schema = buildSchema(`
	type Query {
		hello: String
	}
`);

var root = {
    hello: () => {
        return 'Hello!'
    }
};

graphql(schema, '{hello1}', root).then(response => console.log(response));