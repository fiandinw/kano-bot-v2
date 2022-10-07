const fetch = require("node-fetch-commonjs");
module.exports = function anilist(q, type, page, callback) {
  // Here we define our query as a multi-line string
  // Storing it in a separate .graphql/.gql file is also possible
  const queries = {
    anime: `
    query ($var: String) { # Define which variables will be used in the query (id)
      Page (page: ${page || 1}, perPage: 10) {
        pageInfo{
          total
        }
        media(search: $var, type: ANIME) {
          id,
          title{
            native,
            romaji,
            english
          },
          coverImage {
            large
          },
          siteUrl
        }
      }
    }
  `,
    manga: `
    query ($var: String) { # Define which variables will be used in the query (id)
      Page (page: ${page || 1}, perPage: 10) {
        pageInfo{
          total
        }
        media(search: $var, type: MANGA) {
          id,
          title{
            native,
            romaji,
            english
          },
          coverImage {
            large
          },
          siteUrl
        }
      }
    }
  `,
    characters: `
  query ($var: String) {
    Page(page: ${page || 1}, perPage: 10) {
      pageInfo{
        total
      }
      characters(search: $var) {
        id
        name {
          full
          native
        }
        image {
          large
        }
        siteUrl
      }
    }
  }
  `,
    character: `query ($var: String) {
    Page(page: ${page || 1}, perPage: 10) {
      pageInfo{
        total
      }
      characters(search: $var) {
        id
        name {
          full
          native
        }
        image {
          large
        }
        gender
        dateOfBirth {
          year
          month
          day
        }
        age
        bloodType
        siteUrl
      }
    }
  }`,
    staff: `query ($var: String) {
    Page(page: ${page || 1}, perPage:10){
      pageInfo{
        total
      }
      staff(search: $var){
        name {
          full
          native
        }
        image {
          large
        }
        siteUrl
      }
    }
  }`,
  };

  // Define our query variables and values that will be used in the query request
  const variables = {
    var: q,
  };

  // Define the config we'll need for our Api request
  const url = "https://graphql.anilist.co",
    options = {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      body: JSON.stringify({
        query: queries[type],
        variables: variables,
      }),
    };

  fetch(url, options)
    .then((res) => res.json())
    .then((res) => {
      callback(res);
    })
    .catch(() => {
      return Promise.resolve(null);
    });
};
