import { isNil } from 'lodash-unified'

export const objectToString = Object.prototype.toString
export const toTypeString = (value: unknown): string =>
  objectToString.call(value)

export const isString = (val: unknown): val is string => typeof val === 'string'

export const isObject = (val: unknown): val is Record<any, any> =>
  val !== null && typeof val === 'object'

export const isArray: (arg: unknown) => arg is any[] = Array.isArray

export const isFunction = (val: unknown): val is Function =>
  typeof val === 'function'

export const isDate = (val: unknown): val is Date =>
  toTypeString(val) === '[object Date]'

export const isPromise = <T = any>(val: unknown): val is Promise<T> => {
  return isObject(val) && isFunction(val.then) && isFunction(val.catch)
}

export const isSymbol = (val: unknown): val is symbol => typeof val === 'symbol'

export const isBoolean = (val: unknown): val is boolean =>
  typeof val === 'boolean'

export const isNumber = (val: unknown): val is number => typeof val === 'number'

export const isUndefined = (val: any): val is undefined => val === undefined

export const isEmpty = (val: unknown) =>
  (!val && val !== 0) ||
  (isArray(val) && val.length === 0) ||
  (isObject(val) && !Object.keys(val).length)

export const isElement = (e: unknown): e is Element => {
  if (typeof Element === 'undefined') return false
  return e instanceof Element
}

export const isPropAbsent = (prop: unknown): prop is null | undefined => {
  return isNil(prop)
}

export const isStringNumber = (val: string): boolean => {
  if (!isString(val)) {
    return false
  }
  return !Number.isNaN(Number(val))
}
