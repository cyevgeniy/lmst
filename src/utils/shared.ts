/**
 * Returns the username and a server from a link to an account
 *
 * For example, if a link to the account is 'https://mstdn.social/@username',
 * the result is `{user: 'username', server: 'mstdn.social'
 */
export function getWebfingerParts(l: string): { user: string, server: string} {
    const reg = /https:\/\/(?<server>.*)\/\@(?<user>\w+)/g

    const arr = Array.from(l.matchAll(reg))

    const { user = '', server = '' } = arr[0].groups ?? {}

    return {
        user,
        server,
    }
}
/**
   * Generates a webfinger from a link to an account
   *
   * For example, if a link to the account is 'https://mstdn.social/@username',
   * the webfinger is a string 'username@mstdn.social
   */
export function genWebFinger(l: string): string {
    try {
        const {user, server } = getWebfingerParts(l)
        return user && server ? `${user}@${server}` : ''
    }
    catch(e: any) {
        // xxx: need to research further, probably it's not the best
        // solution, because we use this function to generate a new url for
        // the status, but at least it saves us from unhandled errors and
        // broken interface
        return l
    }
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

    let parser = new DOMParser(),

    d = parser.parseFromString(s, 'text/html'),

    links = d.querySelectorAll('a.u-url') as NodeListOf<HTMLAnchorElement>

    for (const l of links) {
        let wf = genWebFinger(l.href),
        profileLink = !wf ? '' : `/profile/${wf}/`,
        href = profileLink ?? l.href

        l.href = href
        l.target = '_self'
    }

    let tags = d.querySelectorAll('a.hashtag') as NodeListOf<HTMLAnchorElement>

    for (const h of tags) {
        h.target = '_self'
        h.href = genTagHref(h.textContent ?? '')
    }

    return d.body.innerHTML
}
