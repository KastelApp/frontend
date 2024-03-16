export interface DefaultHeaders {
    specialProperties: string; // i.e eyJ2ZXJzaW9uIjoiMC4wLjY4IiwiY29tbWl0IjoiOWI2OWZmZiIsImJyYW5jaCI6Imluay93cmFwcGVyIiwicGFsdGZvcm0iOiJicm93c2VyIn0=
}

export interface ApiSettings {
    url: string;
    version: string;
    defaultHeaders: DefaultHeaders;
    token?: string;
    cdnUrl: string; // ? cdnUrl is the url for uploading media
    mediaUrl: string; // ? mediaUrl is the url for getting media (soon to be deprecated and combined into the api)
}
