const { mergeWith } = require('docz-utils')
const fs = require('fs-extra')

let custom = {}
const hasGatsbyConfig = fs.existsSync('./gatsby-config.custom.js')

if (hasGatsbyConfig) {
  try {
    custom = require('./gatsby-config.custom')
  } catch (err) {
    console.error(
      `Failed to load your gatsby-config.js file : `,
      JSON.stringify(err),
    )
  }
}

const config = {
  pathPrefix: '/',

  siteMetadata: {
    title: 'Docs',
    description: 'My awesome app using docz',
  },
  plugins: [
    {
      resolve: 'gatsby-plugin-typescript',
      options: {
        isTSX: true,
        allExtensions: true,
      },
    },
    {
      resolve: 'gatsby-theme-docz',
      options: {
        themeConfig: {},
        src: './',
        gatsbyRoot: null,
        themesDir: 'src',
        mdxExtensions: ['.md', '.mdx'],
        docgenConfig: {},
        menu: [],
        mdPlugins: [],
        hastPlugins: [],
        ignore: [],
        typescript: true,
        ts: false,
        propsParser: true,
        'props-parser': true,
        debug: false,
        native: false,
        openBrowser: null,
        o: null,
        open: null,
        'open-browser': null,
        root: '/Users/marui/Desktop/svelte-guide-components/docs/.docz',
        base: '/',
        source: './',
        'gatsby-root': null,
        files: '**/*.{md,markdown,mdx}',
        public: '/public',
        dest: '.docz/dist',
        d: '.docz/dist',
        editBranch: 'master',
        eb: 'master',
        'edit-branch': 'master',
        config: '',
        title: 'Docs',
        description: 'My awesome app using docz',
        host: 'localhost',
        port: 3000,
        p: 3000,
        separator: '-',
        paths: {
          root: '/Users/marui/Desktop/svelte-guide-components/docs',
          templates:
            '/Users/marui/Desktop/svelte-guide-components/node_modules/.pnpm/docz-core@2.4.0_3c2f98211c0aea74b49304d765bdea1f/node_modules/docz-core/dist/templates',
          docz: '/Users/marui/Desktop/svelte-guide-components/docs/.docz',
          cache:
            '/Users/marui/Desktop/svelte-guide-components/docs/.docz/.cache',
          app: '/Users/marui/Desktop/svelte-guide-components/docs/.docz/app',
          appPackageJson:
            '/Users/marui/Desktop/svelte-guide-components/docs/package.json',
          appTsConfig:
            '/Users/marui/Desktop/svelte-guide-components/docs/tsconfig.json',
          gatsbyConfig:
            '/Users/marui/Desktop/svelte-guide-components/docs/gatsby-config.js',
          gatsbyBrowser:
            '/Users/marui/Desktop/svelte-guide-components/docs/gatsby-browser.js',
          gatsbyNode:
            '/Users/marui/Desktop/svelte-guide-components/docs/gatsby-node.js',
          gatsbySSR:
            '/Users/marui/Desktop/svelte-guide-components/docs/gatsby-ssr.js',
          importsJs:
            '/Users/marui/Desktop/svelte-guide-components/docs/.docz/app/imports.js',
          rootJs:
            '/Users/marui/Desktop/svelte-guide-components/docs/.docz/app/root.jsx',
          indexJs:
            '/Users/marui/Desktop/svelte-guide-components/docs/.docz/app/index.jsx',
          indexHtml:
            '/Users/marui/Desktop/svelte-guide-components/docs/.docz/app/index.html',
          db:
            '/Users/marui/Desktop/svelte-guide-components/docs/.docz/app/db.json',
        },
      },
    },
  ],
}

const merge = mergeWith((objValue, srcValue) => {
  if (Array.isArray(objValue)) {
    return objValue.concat(srcValue)
  }
})

module.exports = merge(config, custom)
