const rateLimitMap = new Map();

export const rateLimit = (options) => {
    const { windowMs, max, message } = options;

    return (req, res, next) => {
        const ip = req.ip;
        const now = Date.now();

        if (!rateLimitMap.has(ip)) {
            rateLimitMap.set(ip, []);
        }

        const timestampList = rateLimitMap.get(ip);

        // Remove timestamps outside the window
        while (timestampList.length > 0 && timestampList[0] < now - windowMs) {
            timestampList.shift();
        }

        if (timestampList.length >= max) {
            return res.status(429).json({ message: message || "Too many requests, please try again later." });
        }

        timestampList.push(now);
        next();

        // Cleanup map periodically to prevent memory leaks (optional, but good practice)
        // For simplicity in this scope, we rely on the shift() above, but we could add a cleanup if the map grows too large.
    };
};
