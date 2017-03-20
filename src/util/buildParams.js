import isPlainObject from 'lodash-es/isPlainObject'

const SPECIALS = ['&', '|', '!', '>', '<', '=', '~', '(', ')', ',']
const SPECIALS_REGEXP = new RegExp(`[${SPECIALS.join('\\')}]`, 'g')
const SPECIALS_ESCAPE = '\\$&'

/**
 * Build url safe parameter string if an object provided.
 *
 * @export
 * @param {(Object | string)} [params] key-value object or final query string
 * @param {boolean} [useEncoding] wether to skip encoding
 * @returns {string}
 */
export default function buildParams (params = {}, useEncoding = true) {
  return isPlainObject(params)
    ? Object.keys(params).reduce(buildParam(params, useEncoding), []).join('&')
    : params
}

/**
 * Returns reducer function that adds the encoded key-value params to
 * accumulator.
 *
 * @param {Object} params
 * @param {boolean} useEncoding
 * @returns {Function}
 */
function buildParam (params, useEncoding) {
  const encode = uriEncoder(useEncoding)
  return (accumulator, key) => {
    const value = params[key]
    const v = isPlainObject(value) ? buildParams(value) : value
    accumulator.push(`${encode(key)}=${encode(v)}`)
    return accumulator
  }
}

/**
 * Returns function that encodes values using encodeURIComponent.
 *
 * @param {boolean} useEncoding
 * @returns {Function}
 */
function uriEncoder (useEncoding) {
  return (value) => useEncoding
    ? encodeURIComponent(value)
    : escapeSpecials(value)
}

/**
 * Escape special characters in value with the backslash (\) character.
 *
 * @param {string} value
 * @returns {string}
 */
function escapeSpecials (value) {
  return value.replace(SPECIALS_REGEXP, SPECIALS_ESCAPE)
}
