const { buildSchema } = require('graphql');

module.exports = buildSchema(`
    type Song {
        _id: ID!
        title: String!
        album: String!
        author: String!
        imageUrl: String!
        createdAt: String!
        updatedAt: String!
    }

    type RootQuery {
        getSong(id: ID!): Song!
        searchSongs(searchTerm: String): [Song!]!
    }

    schema {
        query: RootQuery
    }
`);