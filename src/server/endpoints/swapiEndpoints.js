const { getPeopleByID, getPlanetByID } = require("../services/swapi-service");
const joi = require('joi');

const _isWookieeFormat = (req) => {
    if(req.query.format && req.query.format == 'wookiee'){
        return true;
    }
    return false;
}

const applySwapiEndpoints = (server, app) => {
    const schemaIdRequired = joi.object({
        id: joi.number().integer().required(),
    });

    server.get('/hfswapi/getPeople/:id', async (req, res) => {
        const { error } = schemaIdRequired.validate({ id: req.params.id });
        if (error) {
            return res.status(400).json({ error: 'ID is required and must be an integer.' });
        }

        return getPeopleByID(req, res, app);
    });

    server.get('/hfswapi/getPlanet/:id', async (req, res) => {
        const { error } = schemaIdRequired.validate({ id: req.params.id });
        if (error) {
            return res.status(400).json({ error: 'ID is required and must be an integer.' });
        }

        return getPlanetByID(req, res, app);
    });

    server.get('/hfswapi/getWeightOnPlanetRandom', async (req, res) => {
        res.sendStatus(501);
    });

    server.get('/hfswapi/getLogs',async (req, res) => {
        const data = await app.db.logging.findAll();
        res.send(data);
    });

}

module.exports = applySwapiEndpoints;