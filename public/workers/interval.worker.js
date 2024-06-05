const codes = {
  interval: 1, // Client -> Worker
  stop: 2, // Client -> Worker
  heartbeat: 3, // Worker -> Client
  heartbeated: 4, // Client -> Worker
};

/**
 * @type {Map<string, { interval: NodeJS.Timeout, lastHeartbeat: number, lastHeartbeated: number }> }
 */
let intervals = new Map();

onmessage = (event) => {
  if (!event?.data?.op) return console.warn("No op code provided");

  const { op, data } = event.data;

  switch (op) {
    case codes.interval: {
      const { interval, session } = data;

      intervals.set(session, {
        interval: setInterval(() => {
          const intervalOfSession = intervals.get(session);

          if (!intervalOfSession) {
            clearInterval(intervalOfSession.interval);
            return;
          }

          if (
            intervalOfSession.lastHeartbeated -
              intervalOfSession.lastHeartbeat >
            10000
          ) {
            clearInterval(intervalOfSession.interval);
            return;
          }

          postMessage({ op: codes.heartbeat, session });

          intervalOfSession.lastHeartbeat = Date.now();
        }, interval),
        lastHeartbeat: Date.now(),
        lastHeartbeated: Date.now(),
      });

      break;
    }
    case codes.heartbeated: {
      const { session } = data;

      const intervalOfSession = intervals.get(session);

      if (!intervalOfSession) return;

      intervalOfSession.lastHeartbeated = Date.now();

      break;
    }
    case codes.stop: {
      const { session } = data;

      const intervalOfSession = intervals.get(session);

      if (!intervalOfSession) return;

      clearInterval(intervalOfSession.interval);

      break;
    }
  }
};
