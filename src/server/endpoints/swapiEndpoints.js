const { getPeopleByID, getPlanetByID, getWeightOnPlanetRandom } = require("../services/swapi-service");
const joi = require('joi');

/**
 * Get wookiee format and parse to correct world
 * @param {*} req 
 * @returns if response should be to english world
 */
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

        const isWookiee = _isWookieeFormat(req);

        return getPeopleByID({
            id: req.params.id, 
            isWookiee,
            res, 
            app
        });
    });

    server.get('/hfswapi/getPlanet/:id', async (req, res) => {
        const { error } = schemaIdRequired.validate({ id: req.params.id });
        if (error) {
            return res.status(400).json({ error: 'ID is required and must be an integer.' });
        }

        const isWookiee = _isWookieeFormat(req);

        return getPlanetByID({
            id: req.params.id,
            isWookiee,
            res, 
            app
        });
    });

    server.get('/hfswapi/getWeightOnPlanetRandom', async (req, res) => {
        const schemaWeightOfPlanet = joi.object({
            peopleId: joi.number().integer().required(),
            planetId: joi.number().integer().required(),
            format: joi.string().optional(),
        });
        const { error } = schemaWeightOfPlanet.validate(req.query);
        if (error) {
            return res.status(400).json({ error: error.details[0].message });
        }
        const isWookiee = _isWookieeFormat(req);

        return getWeightOnPlanetRandom({
            peopleId: req.query.peopleId,
            planetId: req.query.planetId,
            isWookiee,
            res, 
            app
        });
    });

    server.get('/hfswapi/getLogs',async (req, res) => {
        const data = await app.db.logging.findAll();
        res.send(data);
    });
}

module.exports = applySwapiEndpoints;