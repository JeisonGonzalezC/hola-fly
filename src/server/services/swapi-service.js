'use strict';
const CommonPeople = require("../../app/People/commonPeople");
const Planet = require("../../app/Planet/Planet");
const { createPeople } = require("../../app/db/people-db");
const { createPlanet } = require("../../app/db/planet-db");
const HttpError = require("../../app/httpError");

const services = {};

/**
 * Get info to swapi by id people
 * @param {*} id people id
 * @param {*} app access to swapi utils
 * @returns Info swapi people
 */
const getInfoPeopleSwapiById = async (id, isWookiee, app) => {
    const idWithFormat = isWookiee ? `${id}?format=wookiee`: id ;
    const { name, height, mass, homeworld } = await app.swapiFunctions.genericRequest(
        `${process.env.URL_SWAPI}/people/${idWithFormat}`, 'GET', null, isWookiee
    );
    if(!name) throw new HttpError('People not found', 404);

    const homeworldId = homeworld.match(/\/(\d+)\/$/)[1];

    const planet = await app.swapiFunctions.genericRequest(
        `${process.env.URL_SWAPI}/planets/${homeworldId}`, 'GET', null
    );

    return { 
        id: Number(id),
        name,
        height: Number(height),
        mass: Number(mass),
        homeworld: planet?.name,
        homeworldId: Number(homeworldId)
    };
}

/**
 * People is created with info swapi response
 * @param {*} id people id
 * @param {*} app access to swapi utils
 * @returns new people instance
 */
const createPeopleIfNotExist = async(id, isWookiee, app) => {
    const peopleInfo = await getInfoPeopleSwapiById(id, isWookiee, app);
    return createPeople(peopleInfo);
}

/**
 * Get people info by id, if id not exist in bd, then new people is created
 * @param {*} id people id
 * @param {*} res response ep
 * @param {*} app access to swapi utils
 */
const getPeopleByID = async (params) => {
    const {
        id,
        isWookiee,
        res, 
        app
    } = params;

    try {
        let people = new CommonPeople(id);
        await people.init();

        if(!people.name) people = await createPeopleIfNotExist(id, isWookiee, app);
    
        res.json({
            name: people.name,
            mass: people.mass,
            height: people.height,
            homeworldName: people.homeworldName,
            homeworldId: people.homeworldId
        });
    } catch (error) {
        res.status(error?.statusCode ?? 500).json({ error: error.message });
    }
}

/**
 * Get planet info swapi response
 * @param {*} id planet id
 * @param {*} app app swapi utils
 * @returns 
 */
const getInfoPlanetSwapiById = async (id, isWookiee, app) => {
    const idWithFormat = isWookiee ? `${id}?format=wookiee`: id ;
    const { name, gravity } = await app.swapiFunctions.genericRequest(
        `${process.env.URL_SWAPI}/planets/${idWithFormat}`, 'GET', null, isWookiee
    );
    if(!name) throw new HttpError('Planet not found', 404);

    const numericGravity = parseFloat(gravity);
    let parseGravity = 0.0;

    // If number then get gravity
    if (!isNaN(numericGravity)) parseGravity = numericGravity;

    return { id: Number(id), name, gravity: parseGravity };
}

/**
 * Create planet with swapi info
 * @param {*} id planet id
 * @param {*} app app swapi util
 * @returns 
 */
const createPlanetIfNotExist = async(id, isWookiee, app) => {
    const planetInfo = await getInfoPlanetSwapiById(id, isWookiee, app);
    return createPlanet(planetInfo);
}

/**
 * Get planet by id, if planet no exist then search info to swapi
 * @param {*} id planet id
 * @param {*} res response
 * @param {*} app app swapi utils
 */
const getPlanetByID = async (params) => {
    const {
        id, 
        isWookiee,
        res, 
        app
    } = params;
    try {
        let planet = new Planet(id);
        await planet.init();

        if(!planet.name) planet = await createPlanetIfNotExist(id, isWookiee, app);

        res.json({
            name: planet.name,
            gravity: planet.gravity,
        });
    } catch (error) {
        res.status(error?.statusCode ?? 500).json({ error: error.message });
    }
}

/**
 * res 
 * @param {*} params 
 * @param {*} params.peopleId people id
 * @param {*} params.planetId planet id
 * @param {*} params.res http res
 * @param {*} params.app utils app services
 * @returns people weight on any planet
 */
const getWeightOnPlanetRandom = async (params) => {
    const {
        peopleId,
        planetId,
        isWookiee,
        res, 
        app
    } = params;

    try {
        let people = new CommonPeople(peopleId);
        await people.init();
        if(!people.name) people = await createPeopleIfNotExist(peopleId, isWookiee, app);

        let planet = new Planet(planetId);
        await planet.init();
        if(!planet.name) planet = await createPlanetIfNotExist(planetId, isWookiee, app);

        if(people.homeworldId ===  planet.id ) {
            throw new HttpError('calculate mass with planet different from natal', 400);
        }
        const peopleWeightOnPlanet = await people.getWeightOnPlanet(people.mass, planet.gravity);
        res.json({
            peopleWeightOnPlanet
        });
    } catch (error) {
        res.status(error?.statusCode ?? 500).json({ error: error.message });
    }
}

services.getPeopleByID = getPeopleByID;
services.getPlanetByID = getPlanetByID;
services.getWeightOnPlanetRandom = getWeightOnPlanetRandom;

module.exports = services;