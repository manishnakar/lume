import { ApolloClient, HttpLink, InMemoryCache } from 'apollo-boost'
import fetch from 'isomorphic-unfetch'
import Head from 'next/head'
import { getDataFromTree } from 'react-apollo'
import propTypes from 'prop-types'
import { withClientState } from 'apollo-link-state'
import defaults from './local/defaults'
import resolvers from './local/resolvers'
import typeDefs from './local/typeDefs'
import { setContext } from 'apollo-link-context'
import { ApolloLink } from 'apollo-link'

let apolloClient = null

// Polyfill fetch() on the server (used by apollo-client)
if (!process.browser) {
  global.fetch = fetch
}

function create(initialState) {
  const httpLink = new HttpLink({
    uri: process.env.API_URL
  })

  const cache = new InMemoryCache().restore(initialState || {})

  const stateLink = withClientState({
    resolvers,
    defaults,
    typeDefs,
    cache
  })

  const authLink = setContext((req, prevCtx) => {
    let authHeaders = {}
    if (process.browser) {
      let idToken = localStorage.getItem('idToken')
      let userId = localStorage.getItem('userId')
      if (idToken && userId) {
        Object.assign(authHeaders, {
          authorization: `Bearer ${idToken}`,
          userid: userId
        })
      }
    }

    return {
      headers: {
        ...prevCtx.headers,
        ...authHeaders
      }
    }
  })

  const link = ApolloLink.from([authLink, stateLink, httpLink])

  return new ApolloClient({
    connectToDevTools: process.browser,
    ssrMode: !process.browser, // Disables forceFetch on the server (so queries are only run once)
    link,
    cache
  })
}

function initApollo(initialState) {
  // Make sure to create a new client for every server-side request so that data
  // isn't shared between connections (which would be bad)
  if (!process.browser) {
    return create(initialState)
  }

  // Reuse client on the client-side
  if (!apolloClient) {
    apolloClient = create(initialState)
  }

  return apolloClient
}

export default App => {
  return class Apollo extends React.Component {
    static displayName = 'withApollo(App)'
    static async getInitialProps(ctx) {
      try {
        const { Component, router } = ctx

        // Run all GraphQL queries in the component tree
        // and extract the resulting data
        const apollo = initApollo()

        let appProps = {}
        if (App.getInitialProps) {
          appProps = await App.getInitialProps(ctx, apollo)
        }

        const apolloState = {}

        try {
          // Run all GraphQL queries
          await getDataFromTree(
            <App
              {...appProps}
              Component={Component}
              router={router}
              apolloState={apolloState}
              apolloClient={apollo}
            />
          )
        } catch (error) {
          // Prevent Apollo Client GraphQL errors from crashing SSR.
          // Handle them in components via the data.error prop:
          // http://dev.apollodata.com/react/api-queries.html#graphql-query-data-error
          console.error('Error while running `getDataFromTree`', error)
        }

        if (!process.browser) {
          // getDataFromTree does not call componentWillUnmount
          // head side effect therefore need to be cleared manually
          Head.rewind()
        }

        // Extract query data from the Apollo store
        apolloState.data = apollo.cache.extract()

        return {
          ...appProps,
          apolloState
        }
      } catch (ex) {
        console.error(ex)
      }
    }

    constructor(props) {
      super(props)
      // `getDataFromTree` renders the component first, the client is passed off as a property.
      // After that rendering is done using Next's normal rendering pipeline
      this.apolloClient =
        props.apolloClient || initApollo(props.apolloState.data)
    }

    render() {
      return <App {...this.props} apolloClient={this.apolloClient} />
    }
  }
}
