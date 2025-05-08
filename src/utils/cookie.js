export const checkCookiesValue = (prefix)  => {
    return document.cookie.split(';').some((cookie) => cookie.trim().startsWith(prefix));
}