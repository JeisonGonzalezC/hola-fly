const fetch = require('node-fetch');

const getWeightOnPlanet = (mass, gravity) => {
    return mass * gravity;
}

const genericRequest = async (url, method, body, isWookiee = false) => {
    let options = {
        method: method
    }
    if(body){
        options.body = body;
    }
    const response = await fetch(url, options);
    const data = await response.json();

    if(isWookiee){
        data.name = data.whrascwo;
        data.height = data.acwoahrracao;
        data.mass = data.scracc;
        data.homeworld = data.acooscwoohoorcanwa;
        data.gravity = data.rrrcrahoahaoro;
    }
    return data;
}

module.exports = {
    getWeightOnPlanet,
    genericRequest
}