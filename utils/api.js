const API_URL = process.env.API_ENDPOINT;
const Version = process.env.API_VERSION;

async function fetcher(url, options) {
    const response = await fetch(`${API_URL}/${Version}/` + url, options);
    return await response.json();
}

const API = API_URL + "/" + Version;

const healthCheck = async function () {
    return await fetcher(`health-check`, {
        method: "GET",
    }).then(res => res.json());
};

const login = async function (Token, body) {
    return await fetcher(`login`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(body),
    }).then(res => res.json());
};

const register = async function (Token, body) {
    return await fetcher(`register`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(body),
    }).then(res => res.json());
};

export {
    API,
    fetcher,
    healthCheck,
    login,
    register,
}