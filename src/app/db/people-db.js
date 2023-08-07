'use strict';
const { db } = require("../../app");
const CommonPeople = require("../People/commonPeople");

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
    await peopleToSave.save();
    const people = new CommonPeople(peopleInfo.id);
    await people.init();
    return people;
}

dbPeople.createPeople = createPeople;

module.exports = dbPeople;