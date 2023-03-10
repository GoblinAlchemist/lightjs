import path from 'path'
import { nodeResolve } from '@rollup/plugin-node-resolve'
import { rollup } from 'rollup'
import commonjs from '@rollup/plugin-commonjs'
import esbuild, { minify as minifyPlugin } from 'rollup-plugin-esbuild'
import { parallel } from 'gulp'
import {
  PKG_BRAND_NAME,
  PKG_CAMELCASE_NAME,
} from '@lightjs/build-constants'
import { epOutput, epRoot } from '@lightjs/build-utils'
import { version } from '../../../../packages/lightjs/version'
import { LightAlias } from '../plugins/light-alias'
import preprocess from 'svelte-preprocess'
import sveltePlugin from "esbuild-svelte"
import svelte from 'rollup-plugin-svelte'
import {
  formatBundleFilename,
  generateExternal,
  withTaskName,
  writeBundles,
} from '../utils'
import { target } from '../build-info'
import type { Plugin } from 'rollup'
import { typescript } from 'svelte-preprocess-esbuild'

const banner = `/*! ${PKG_BRAND_NAME} v${version} */\n`

async function buildFullEntry(minify: boolean) {
  const plugins: Plugin[] = [
    LightAlias(),
    svelte({
      preprocess: [
        typescript({
          target,
          define: {
            'process.browser': 'true'
          }
        }),
        // avoid double compile
        preprocess({ typescript: false }),
      ],
    }),
    nodeResolve({
      extensions: ['.mjs', '.js', '.json', '.ts', '.svelte'],
      exportConditions: ['svelte'],
    }),
    commonjs(),
    esbuild({
      exclude: [],
      sourceMap: minify,
      target,
      loaders: {
        '.svelte': 'ts',
      },
      optimizeDeps: {
        include: ['svelte'],
        esbuildOptions: {
          plugins: [sveltePlugin()]
        }
      },
      define: {
        'process.env.NODE_ENV': JSON.stringify('production'),
      },
      treeShaking: true,
      legalComments: 'eof',
    }),
  ]
  if (minify) {
    plugins.push(
      minifyPlugin({
        target,
        sourceMap: true,
      })
    )
  }

  const bundle = await rollup({
    input: path.resolve(epRoot, 'index.ts'),
    plugins,
    external: await generateExternal({ full: true }),
    treeshake: true,
  })
  await writeBundles(bundle, [
    {
      format: 'umd',
      file: path.resolve(
        epOutput,
        'dist',
        formatBundleFilename('index.full', minify, 'js')
      ),
      exports: 'named',
      name: PKG_CAMELCASE_NAME,
      globals: {
        svelte: 'svelte',
      },
      sourcemap: minify,
      banner,
    },
    {
      format: 'esm',
      file: path.resolve(
        epOutput,
        'dist',
        formatBundleFilename('index.full', minify, 'mjs')
      ),
      sourcemap: minify,
      banner,
    },
  ])
}

// async function buildFullLocale(minify: boolean) {
//   const files = await glob(`**/*.ts`, {
//     cwd: path.resolve(localeRoot, 'lang'),
//     absolute: true,
//   })
//   return Promise.all(
//     files.map(async (file) => {
//       const filename = path.basename(file, '.ts')
//       const name = upperFirst(camelCase(filename))

//       const bundle = await rollup({
//         input: file,
//         plugins: [
//           esbuild({
//             minify,
//             sourceMap: minify,
//             target,
//           }),
//         ],
//       })
//       await writeBundles(bundle, [
//         {
//           format: 'umd',
//           file: path.resolve(
//             epOutput,
//             'dist/locale',
//             formatBundleFilename(filename, minify, 'js')
//           ),
//           exports: 'default',
//           name: `${PKG_CAMELCASE_LOCAL_NAME}${name}`,
//           sourcemap: minify,
//           banner,
//         },
//         {
//           format: 'esm',
//           file: path.resolve(
//             epOutput,
//             'dist/locale',
//             formatBundleFilename(filename, minify, 'mjs')
//           ),
//           sourcemap: minify,
//           banner,
//         },
//       ])
//     })
//   )
// }

export const buildFull = (minify: boolean) => async () =>
  Promise.all([buildFullEntry(minify)])

export const buildFullBundle = parallel(
  withTaskName('buildFullMinified', buildFull(true)),
  withTaskName('buildFull', buildFull(false))
)
