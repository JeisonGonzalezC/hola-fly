const db = require("../db");
const HttpError = require("../httpError");
const AbstractPeople = require("./abstractPeople");

class CommonPeople extends AbstractPeople {
    constructor(id){
        super();
        this.id = id;
    }
  
    async init() {
        try {
            const person = await db.swPeople.findByPk(Number(this.id));
            if (!person) return;

            this.name = person.name;
            this.mass = person.mass;
            this.height = person.height;
            this.homeworldName = person.homeworld_name;
            this.homeworldId = person.homeworld_id;
        } catch (error) {
            throw new Error(`Error init CommonPeople: ${error.message}`);
        }
    }

    /**
     * Get people weight on any planet
     * @param {*} peopleMass people number mass
     * @param {*} gravity planet number gravity
     * @returns people weight on planet
     */
    async getWeightOnPlanet(peopleMass, gravity) {
        try {
            if(!gravity) throw new HttpError('Gravity is required or is 0', 400);
            if(!peopleMass) throw new HttpError('Mass is required or is 0', 400);
            return gravity * peopleMass;
        } catch (error) {
            throw new Error(`Error calculate mass: ${error.message}`);
        }
    }
}

module.exports = CommonPeople;