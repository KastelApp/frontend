const hash = async (str: string, algorithm: "SHA-1" | "SHA-256" | "SHA-384" | "SHA-512" = "SHA-512") => {
    const encoder = new TextEncoder();
    const data = encoder.encode(str);
    const digested = await crypto.subtle.digest(algorithm, data);
    const view = new DataView(digested);

    let hex = "";

    for (let i = 0; i < view.byteLength; i++) {
        hex += view.getUint8(i).toString(16).padStart(2, "0");
    }

    return hex;
}

export default hash;