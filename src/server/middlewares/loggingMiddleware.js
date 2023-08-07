const loggingMiddleware = (db) =>
    async (req, res, next) => {
        const ip = (req.headers['x-forwarded-for'] || req.connection.remoteAddress || '').split(',')[0].trim();
        const headers = JSON.stringify(req.headers);
        const originalUrl = req.originalUrl;

        const logToSave = db.logging.build({
            ip,
            header: headers,
            action: originalUrl
        });
        await logToSave.save();
        next();
    }

module.exports = loggingMiddleware;