'use strict';
const { db } = require("../../app");
const Planet = require("../Planet/Planet");

const dbPlanet = {};

/**
 * Create planet
 * @param {*} planetInfo 
 * @returns Planet entity
 */
const createPlanet = async(planetInfo) => {
    const planetToSave = db.swPlanet.build(planetInfo);
    await planetToSave.save();

    const planet = new Planet(planetInfo.id);
    await planet.init();
    return planet;
}

dbPlanet.createPlanet = createPlanet;

module.exports = dbPlanet;