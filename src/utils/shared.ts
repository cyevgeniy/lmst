import type { Status } from '../types/shared'

/**
 * Generates the path for a hashtag
 * Tag may be with or without the hash symbol
 * ('#joy', '#sometag', 'sometag')
 * If a tag is an empty string or single hashtag symbol,
 * the link to the main page is returned.
 */
function genTagHref(tag: string) {
  let _t = tag[0] === '#' ? tag.substring(1) : tag

  return _t ? `/tags/${_t}` : '/'
}

/**
 * Parse a string with html content of a status, and
 * replaces all links to profiles with links to our own
 * url which performs accout lookup
 */
export function parseContent(s: Status) {
  // First thing to do is to check for usernames
  // in a string.
  // If we didn't found any, return original string
  // without wasting time on parsing
  if (s.content.search(/u-url|hashtag/g) === -1) return s.content

  let parser = new DOMParser(),
    d = parser.parseFromString(s.content, 'text/html'),
    links = d.querySelectorAll('a.u-url') as NodeListOf<HTMLAnchorElement>

  for (const l of links) {
    let acct = s.mentions.find((m) => m.url === l.href)?.acct

    acct && (l.href = `/profile/${acct}/`)
    l.target = '_self'
  }

  let tags = d.querySelectorAll('a.hashtag') as NodeListOf<HTMLAnchorElement>

  for (const h of tags) {
    h.target = '_self'
    h.href = genTagHref(h.textContent ?? '')
  }

  return d.body.innerHTML
}

export let noop = () => {}
