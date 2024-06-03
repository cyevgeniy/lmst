/**
   * Generates a webfinger from a link to an account
   *
   * For example, if a link to the account is 'https://mstdn.social/@username',
   * the webfinger is a string 'username@mstdn.social
   */
export function genWebFinger(l: string): string {
    const reg = /https:\/\/(?<server>.*)\/\@(?<user>\w+)/g

    const arr = Array.from(l.matchAll(reg))

    const { user = '', server = '' } = arr[0].groups ?? {}

    return user && server ? `${user}@${server}` : ''
}

/**
   * Generates the path for a hashtag
   * Tag may be with or without the hash symbol
   * ('#joy', '#sometag', 'sometag')
   * If a tag is an empty string or single hashtag symbol,
   * the link to the main page is returned.
   */
function genTagHref(tag: string) {
    const _t = tag[0] === '#' ? tag.substring(1) : tag

    const href = _t ? `/tags/${_t}` : '/'

    return href
}

/**
 * Parse a string with html content of a status, and
 * replaces all links to profiles with links to our own
 * url which performs accout lookup
 */
export function parseContent(s: string) {

    // First thing to do is to check for usernames
    // in a string.
    // If we didn't found any, return original string
    // without wasting time on parsing
    if (s.search(/u-url|hashtag/g) === -1)
        return s

    const parser = new DOMParser()

    const d = parser.parseFromString(s, 'text/html')

    const links = d.querySelectorAll('a.u-url') as NodeListOf<HTMLAnchorElement>

    for (const l of links) {
        const wf = genWebFinger(l.href)
        const profileLink = !wf ? '' : `/profile/${wf}/`
        const href = profileLink ?? l.href
        l.href = href
        l.target = '_self'
    }

    const tags = d.querySelectorAll('a.hashtag') as NodeListOf<HTMLAnchorElement>

    for (const h of tags) {
        h.target = '_self'
        const href = genTagHref(h.textContent ?? '')
        h.href = href
    }

    return d.body.innerHTML
}