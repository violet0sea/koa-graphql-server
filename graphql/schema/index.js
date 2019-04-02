const { buildSchema } = require('graphql');

module.exports = buildSchema(`
type Article {
    _id: ID!
    title: String!
    content: String!
    createdAt: Float!
    updatedAt: Float!
}
type Booking {
    _id: ID!
    event: Event!
    user: User!
    createdAt: Int!
    updatedAt: Int!
}

type Event {
    _id: ID!
    title: String!
    description: String!
    price: Float!
    date: String!
    creator: User!
}

type User {
    _id: ID!,
    email: String!
    password: String
    createEvents: [Event!]
}

input ArticleInput {
    title: String!
    content: String!
}

input EventInput {
    title: String!
    description: String!
    price: Float!
    date: String!
}

input UserInput {
    email: String!,
    password: String!
}

type Query {
    hello: String,
    homeList: [Article!]!
    article(id: String!): Article
    events: [Event!]!
    bookings: [Booking!]!
}

type Mutation {
    createArticle(articleInput: ArticleInput): Article
    createEvent(eventInput: EventInput): Event
    createUser(userInput: UserInput): User
    bookEvent(eventId: ID!): Booking!
    cancelBooking(bookingId: ID!): Event!
}

schema {
    query: Query,
    mutation: Mutation
}
`);
