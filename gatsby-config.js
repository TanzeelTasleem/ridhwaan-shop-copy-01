const siteMetadata = require('./site-metadata.json')

module.exports = {
    pathPrefix: '/',
    siteMetadata: siteMetadata,
    plugins: [
        `gatsby-plugin-react-helmet`,
        `gatsby-source-data`,
        `gatsby-transformer-remark`,
        `gatsby-plugin-offline`,
        {
            resolve: `gatsby-plugin-material-ui`,
            options: {
              stylesProvider: {
                injectFirst: true,
              },
            },
          },
        {
            resolve: `gatsby-source-filesystem`,
            options: {
                name: `pages`,
                path: `${__dirname}/src/pages`
            }
        },
        {
            resolve: `gatsby-plugin-sass`,
            options: {}
        },
        {
            resolve: `gatsby-remark-page-creator`,
            options: {}
        },
        {
            resolve: "gatsby-plugin-google-tagmanager",
            options: {
              id: 'GTM-NNL5L5H',
              includeInDevelopment: true,
              routeChangeEventName: 'Gatsby-route-change_Trigger',
            },
          },
        {
            resolve: `@stackbit/gatsby-plugin-menus`,
            options: {
                sourceUrlPath: `fields.url`,
                pageContextProperty: `menus`,
            }
        }
   
    ]
};
