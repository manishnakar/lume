import gql from 'graphql-tag'

const fragment = gql`
  fragment StoriesFragment on story {
    id
    title
    description
    previewImage{
      id
      localId
    }
    updatedAt
    template
  }
`

export default fragment
