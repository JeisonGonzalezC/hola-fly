'use strict';
const { db } = require("../../app");

const dbPlanet = {};

/**
 * Create planet
 * @param {*} planetInfo 
 * @returns Planet entity
 */
const createPlanet = async(planetInfo) => {
    const peopleToSave = db.swPlanet.build(planetInfo);
    return peopleToSave.save();
}

dbPlanet.createPlanet = createPlanet;

module.exports = dbPlanet;