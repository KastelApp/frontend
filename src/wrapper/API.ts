class API {

    public API_URL: string = process.env.API_URL || "http://localhost:62250";

    public VERSION: string = process.env.API_VERSION || "1";

    public constructor() {}

    public async get() {}
    
    public async del() {}
    
    public async patch() {}
    
    public async post() {}
    
    public async put() {}
}

export default API;