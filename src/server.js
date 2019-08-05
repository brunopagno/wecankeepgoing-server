const express = require('express');
const graphqlHTTP = require('express-graphql');
const { buildSchema } = require('graphql');
const cors = require('cors');

const schema = buildSchema(`
  type Query {
    stories: [Story!]!
    story(id: ID!): Story!
  }

  type Mutation {
    addStory(input: InputStory!): Story!
  }

  input InputStory {
    text: String!
  }

  type Story {
    id: ID!
    text: String!
  }
`);

const StoryService = require('./services/StoryService');

const root = {
  stories: StoryService.stories,
  story: StoryService.story,
  addStory: StoryService.addStory,
};

const app = express();
app.use('/graphql', cors({
  origin: process.env.UI_URL || 'http://localhost:4000',
}), graphqlHTTP({
  schema,
  rootValue: root,
  graphiql: process.env.NODE_ENV !== 'production',
}));

const port = process.env.PORT || 4000;

app.listen(port);
console.log(`Listening on port ${port}`);
