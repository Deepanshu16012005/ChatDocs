const TOKEN_KEY = 'chatdocs_token';

export const saveToken = (token) => {
    localStorage.setItem(TOKEN_KEY, token);
};
export const getToken = () => {
    return localStorage.getItem(TOKEN_KEY);
};

export const removeToken = () => {
    localStorage.removeItem(TOKEN_KEY);
};
//logged  in oe not
export const isAuthenticated = () => {
    const token = getToken();
    if (!token) return false;

    try {
        const payload = JSON.parse(atob(token.split('.')[1]));
        
        
        const currentTime = Date.now() / 1000;
        if (payload.exp < currentTime) {
            removeToken();
            return false;
        }
        return true;
    } catch (error) {
        removeToken();
        return false;
    }
};


export const getUserId = () => {
    const token = getToken();
    if (!token) return null;

    try {
        const payload = JSON.parse(atob(token.split('.')[1]));
        return payload.userId;
    } catch (error) {
        return null;
    }
};