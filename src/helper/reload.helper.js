// After login, logout, and panel switching the app deliberately forces a
// full page reload so RouterComponent rebuilds its route tree from fresh
// localStorage / navigation-API state. This helper does that safely under
// HashRouter, on any host or protocol — the previous implementation
// hardcoded `http://` + window.location.host, which silently breaks once
// the app is served over HTTPS (e.g. GitHub Pages).
export const reloadToHashPath = (path = '/') => {
    window.location.hash = path;
    window.location.reload();
};

export default reloadToHashPath;
