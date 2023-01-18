import { rollup } from 'rollup'
import { nodeResolve } from '@rollup/plugin-node-resolve'
import commonjs from '@rollup/plugin-commonjs'
import esbuild from 'rollup-plugin-esbuild'
import sveltePlugin from "esbuild-svelte"
import svelte from 'rollup-plugin-svelte'
import { typescript } from 'svelte-preprocess-esbuild';
import preprocess from 'svelte-preprocess';
import glob from 'fast-glob'
import { epRoot, excludeFiles, pkgRoot } from '@lightjs/build-utils'
import { generateExternal, writeBundles } from '../utils'
import { ElementPlusAlias } from '../plugins/light-alias'
import { buildConfigEntries, target } from '../build-info'

import type { OutputOptions } from 'rollup'

export const buildModules = async () => {
  const input = excludeFiles(
    await glob('**/*.{js,ts}', {
      cwd: pkgRoot,
      absolute: true,
      onlyFiles: true,
    })
  )
  const bundle = await rollup({
    input,
    plugins: [
      ElementPlusAlias(),
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
        sourceMap: true,
        target,
        loaders: {
          '.svelte': 'ts',
        },
        optimizeDeps: {
          include: ['svelte'],
          esbuildOptions: {
            plugins: [sveltePlugin()]
          }
        }
      }),
    ],
    external: await generateExternal({ full: false }),
    treeshake: false,
  })
  await writeBundles(
    bundle,
    buildConfigEntries.map(([module, config]): OutputOptions => {
      return {
        format: config.format,
        dir: config.output.path,
        exports: module === 'cjs' ? 'named' : undefined,
        preserveModules: true,
        preserveModulesRoot: epRoot,
        sourcemap: true,
        entryFileNames: `[name].${config.ext}`,
      }
    })
  )
}
