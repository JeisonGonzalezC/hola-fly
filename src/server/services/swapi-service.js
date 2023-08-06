'use strict';

const { db } = require("../../app");
const { createPeople } = require("../../app/db/people-db");
const { createPlanet } = require("../../app/db/planet-db");

const services = {};

/**
 * Get info to swapi by id people
 * @param {*} id people id
 * @param {*} app access to swapi utils
 * @returns Info swapi people
 */
const getInfoPeopleSwapiById = async (id, app) => {
    let planet;
    let homeworldId;

    const { name, height, mass, homeworld  } = await app.swapiFunctions.genericRequest(`${process.env.URL_SWAPI}/people/${id}`, 'GET', null, true);

    if(homeworld){
        planet = await app.swapiFunctions.genericRequest(homeworld, 'GET', null, true);
        homeworldId = homeworld.match(/\/(\d+)\/$/)[1];
    }

    return { 
        name,
        height: Number(height),
        mass: Number(mass),
        homeworld: planet?.name,
        homeworldId
    };
}

/**
 * People is created with info swapi response
 * @param {*} id people id
 * @param {*} app access to swapi utils
 * @returns new people instance
 */
const createPeopleIfNotExist = async(id, res, app) => {
    const peopleInfo = await getInfoPeopleSwapiById(id, app);
    if(peopleInfo?.name){
        return createPeople({
            ...peopleInfo,
            homeworld_name: peopleInfo.homeworld,
            homeworld_id: peopleInfo.homeworldId
        });
    }

    res.status(404).json({ error: `People not found` });
}

/**
 * Get people info by id, if id not exist in bd, then new people is created
 * @param {*} req request ep
 * @param {*} res response ep
 * @param {*} app access to swapi utils
 */
const getPeopleByID = async (req, res, app) => {
    const { id } = req.params;
    let person = await db.swPeople.findByPk(id);
    if(!person) person = await createPeopleIfNotExist(id, res, app);

    res.json({
        name: person?.name,
        mass: person?.mass,
        height: person?.height,
        homeworldName: person?.homeworld_name,
        homeworldId: person?.homeworld_id
    });
}

/**
 * Get planet info swapi response
 * @param {*} id planet id
 * @param {*} app app swapi utils
 * @returns 
 */
const getInfoPlanetSwapiById = async (id, app) => {
    const { name, gravity } = await app.swapiFunctions.genericRequest(`${process.env.URL_SWAPI}/planets/${id}`, 'GET', null, true);
    const numericGravity = parseFloat(gravity);
    let parseGravity = 0.0;

    // If number then get gravity
    if (!isNaN(numericGravity)) parseGravity = numericGravity;

    return { name, gravity: parseGravity };
}

/**
 * Create planet with swapi info
 * @param {*} id planet id
 * @param {*} res response http
 * @param {*} app app swapi util
 * @returns 
 */
const createPlanetIfNotExist = async(id, res, app) => {
    const planetInfo = await getInfoPlanetSwapiById(id, app);
    if(planetInfo?.name) return createPlanet(planetInfo);

    res.status(404).json({ error: `Planet not found` });
}

/**
 * Get planet by id, if planet no exist then search info to swapi
 * @param {*} req request
 * @param {*} res response
 * @param {*} app app swapi utils
 */
const getPlanetByID = async (req, res, app) => {
    const { id } = req.params;
    let planet = await db.swPlanet.findByPk(id);
    if(!planet) planet = await createPlanetIfNotExist(id, res, app);

    res.json({
        name: planet?.name,
        gravity: planet?.gravity,
    });
}

services.getPeopleByID = getPeopleByID;
services.getPlanetByID = getPlanetByID;

module.exports = services;