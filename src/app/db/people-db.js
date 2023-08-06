'use strict';
const { db } = require("../../app");

const dbPeople = {};

/**
 * Create new people
 * @param {*} peopleInfo People model info
 * @returns Entity People
 */
const createPeople = async(peopleInfo) => {
    const peopleToSave = db.swPeople.build({
        ...peopleInfo,
        homeworld_name: peopleInfo.homeworld,
        homeworld_id: peopleInfo.homeworldId
    });
    return peopleToSave.save();
}

dbPeople.createPeople = createPeople;

module.exports = dbPeople;