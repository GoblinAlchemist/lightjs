import { isClient } from '.'

export const isFirefox = (): boolean =>
  isClient && /firefox/i.test(window.navigator.userAgent)
