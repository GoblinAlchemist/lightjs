import { cacheStringFunction, toCapitalize } from '.'

const hyphenateRE = /\B([A-Z])/g;
const camelizeRE = /-(\w)/g;

/**
 * @private
 */
export const camelize = cacheStringFunction((str) => {
    return str.replace(camelizeRE, (_, c) => (c ? c.toUpperCase() : ''));
});

export const hyphenate = cacheStringFunction((str) => str.replace(hyphenateRE, '-$1').toLowerCase())

export const kebabCase = hyphenate; // alias

/**
 * fork from {@link https://github.com/sindresorhus/escape-string-regexp}
 */
export const escapeStringRegexp = (string = '') =>
  string.replace(/[|\\{}()[\]^$+*?.]/g, '\\$&').replace(/-/g, '\\x2d')

// NOTE: improve capitalize types. Restore previous code after the [PR](https://github.com/vuejs/core/pull/6212) merge
export const capitalize = <T extends string>(str: T) =>
  toCapitalize(str) as Capitalize<T>
