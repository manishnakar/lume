
let apiUrl
let auth0ID
let auth0Domain
let url
let s3Url
let googleApiKey
let googleClientId
let gdriveSearchUrl
let domain
let prefix = "https://"

switch (process.env.API_CONFIG) {
  case "dev": {
    apiUrl = "https://api.test.storytellin.gg"

    break
  }
  case "beta": {
    apiUrl = "https://api.beta.storytellin.gg"

    break
  }
  case "test": {
    apiUrl= "http://localhost:5000"
    break
  }
  default:
  case "local": {
    apiUrl= "http://localhost:5000"
    break
  }
}

switch (process.env.NODE_ENV) {
  case "production": {
    auth0ID = "j8pjiCmNfc74AYnuP8MR0PZAbk68syv6"
    auth0Domain = "artsmia.auth0.com"
    url = "https://beta.storytellin.gg"
    s3Url = "https://s3.amazonaws.com"
    break
  }
  case "test": {
    auth0ID = "j8pjiCmNfc74AYnuP8MR0PZAbk68syv6"
    auth0Domain = "artsmia.auth0.com"
    url = "http://localhost:3000"
    s3Url = "https://s3.amazonaws.com"
    break
  }
  default:
  case "dev": {
    auth0ID = "j8pjiCmNfc74AYnuP8MR0PZAbk68syv6"
    auth0Domain = "artsmia.auth0.com"
    url = "http://localhost:3000"
    s3Url = "https://s3.amazonaws.com"
    break
  }
}


export {
  apiUrl,
  auth0ID,
  auth0Domain,
  url,
  s3Url,
  googleApiKey,
  googleClientId,
  gdriveSearchUrl
}