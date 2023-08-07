const db = require("../db");

class Planet {
    constructor(id){
        this.id = id;
    }

    async init() {
        try {
            const planet = await db.swPlanet.findByPk(this.id);
            if (!planet) return;

            this.name = planet.name;
            this.gravity = planet.gravity;
        } catch (error) {
            throw new Error(`Error init Planet: ${error.message}`);
        }
    }

    getName() {
        return this.name;
    }

    getGravity() {
        return this.gravity;
    }
}

module.exports = Planet;