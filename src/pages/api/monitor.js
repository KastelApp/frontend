export default async function handler(req, res) {

    if (req.method !== "POST") {
        res.status(500).send("Invalid request");

        return;
    }

    const envelope = req.body;
    const pieces = envelope.split("\n");
    const header = JSON.parse(pieces[0]);
    const { host, pathname, username } = new URL(header.dsn);
    const projectId = pathname.slice(1);
    const url = `https://${host}/api/${projectId}/envelope/?sentry_key=${username}`;

    try {
        const response = await fetch(url, {
            headers: {
                "Content-Type": "application/x-sentry-envelope"
            },
            body: envelope,
            method: "POST"
        });

        const text = await response.text();
        const data = JSON.parse(text);

        res.status(201).json({ message: "Success", data: data })
    } catch (e) {
        const error = e?.response || e?.message;
        res.status(400).json({ message: "invalid request", error: error });
    }
}