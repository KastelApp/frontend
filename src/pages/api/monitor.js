export default async function handler(request) {
  const { method, body } = request;

  if (method !== "POST") {
    return new Response("Invalid request", { status: 500 });
  }

  try {
    const blob = await new Blob([await readRequestBody(body)]); // Create a blob from the request body
    const envelope = await blob.text(); // Read the blob as text
    const pieces = envelope.split("\n");
    const header = JSON.parse(pieces[0]);
    const { host, pathname, username } = new URL(header.dsn);
    const projectId = pathname.slice(1);
    const url = `https://${host}/api/${projectId}/envelope/?sentry_key=${username}`;

    const response = await fetch(url, {
      headers: {
        "Content-Type": "application/x-sentry-envelope",
      },
      body: envelope,
      method: "POST",
    });

    const text = await response.text();
    const data = JSON.parse(text);

    return new Response(JSON.stringify({ message: "Success", data }), {
      status: 201,
      headers: { "Content-Type": "application/json" },
    });
  } catch (e) {
    const error = e?.response || e?.message;
    return new Response(JSON.stringify({ message: "Invalid request", error }), {
      status: 400,
      headers: { "Content-Type": "application/json" },
    });
  }
}

async function readRequestBody(body) {
  const reader = body.getReader();
  let decodedData = "";

  // eslint-disable-next-line no-constant-condition
  while (true) {
    const { done, value } = await reader.read();

    if (done) {
      break;
    }

    const chunk = new TextDecoder().decode(value);
    decodedData += chunk;
  }

  return decodedData;
}

export const runtime = "edge";
