const API_URL = process.env.TEMP_API_ENDPOINT;
const Version = process.env.API_VERSION;
const login = async function (Token, body) {
    return await fetch(`/api/login`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(body),
    }).then(res => res.json());
};

const register = async function (Token, body) {
    return await fetch(`/api/register`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(body),
    }).then(res => res.json());
};