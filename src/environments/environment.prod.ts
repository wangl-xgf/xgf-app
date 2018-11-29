export function getHttpUrl(uri) {
    return `//${environment.host}/${uri}`;
}
export const environment = {
    production: true,
    host: '39.105.93.57:8099',
    getHttpUrl
};
