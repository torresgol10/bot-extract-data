
export function generateUrlProxyGoogle(url) {

    const urlParse = new URL(url)
    let host = urlParse.host.replaceAll(".", "-")
    let pathname = urlParse.pathname

    return `https://${host}.translate.goog${pathname}?_x_tr_sl=auto&_x_tr_tl=es&_x_tr_hl=es&_x_tr_pto=wapp`
}