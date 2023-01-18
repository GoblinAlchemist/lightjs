export const cacheStringFunction = (fn: (str: string) => string) => {
  const cache = Object.create(null)
  return (str: string) => {
    const hit = cache[str]
    return hit || (cache[str] = fn(str))
  }
}

export const toCapitalize: (str: string) => string = cacheStringFunction(
  (str: string) => str.charAt(0).toUpperCase() + str.slice(1)
)

export const isClient: boolean = typeof window !== 'undefined'
