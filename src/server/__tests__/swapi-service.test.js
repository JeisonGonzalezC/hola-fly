const services = require('../services/swapi-service');
const dbConfig = require('../../app/db');
const swapiFunctions = require('../../app/swapiFunctions');

const mockGenericRequest = jest.spyOn(swapiFunctions, 'genericRequest');

describe('Swapi services', () => {
  beforeEach(async () => {
    await dbConfig.initDB();
  });
  
  const mockResponse = {
    json: jest.fn(),
    status: jest.fn().mockReturnThis(),
  };

  test('When call getPeopleByID with de correct params then return status 200 and create people and planet', async () => {
    mockGenericRequest
      .mockReturnValueOnce({
        name: 'Luke Skywalker',
        height: '172',
        mass: '75',
        homeworld: 'http://swapi.dev/api/planets/1/',
      })
      .mockReturnValueOnce({
        name: 'Tatooine',
        gravity: '1 standard',
      });

    const mockApp = {
      swapiFunctions: {
        genericRequest: mockGenericRequest,
      },
    };
  
    await services.getPeopleByID({
      id: '1',
      isWookiee: false,
      res: mockResponse,
      app: mockApp,
    });

    expect(mockResponse.json).toHaveBeenCalledWith({
      name: 'Luke Skywalker',
      mass: 75,
      height: 172,
      homeworldName: 'Tatooine',
      homeworldId: 1,
    });
  });

  test('When call getPlanetByID with de correct params then return status 200 and create planet', async () => {
    mockGenericRequest
      .mockReturnValueOnce({
        name: 'Tatooine',
        gravity: '1 standard',
      });

    const mockApp = {
      swapiFunctions: {
        genericRequest: mockGenericRequest,
      },
    };
  
    await services.getPlanetByID({
      id: '1',
      isWookiee: false,
      res: mockResponse,
      app: mockApp,
    });

    expect(mockResponse.json).toHaveBeenCalledWith({
      name: 'Tatooine',
      gravity: 1,
    });
  });

  test('When call getWeightOnPlanetRandom with de correct params then return status 200 and create planet and people', async () => {
    mockGenericRequest
      .mockReturnValueOnce({
        name: 'Luke Skywalker',
        height: '172',
        mass: '75',
        homeworld: 'http://swapi.dev/api/planets/1/',
      })
      .mockReturnValueOnce({
        name: 'BRRRRR',
        gravity: '2 standard',
      })
      .mockReturnValueOnce({
        name: 'BRRRRR',
        gravity: '2 standard',
      });

    const mockApp = {
      swapiFunctions: {
        genericRequest: mockGenericRequest,
      },
    };
  
    await services.getWeightOnPlanetRandom({
      peopleId: '1',
      planetId: '2',
      isWookiee: false,
      res: mockResponse,
      app: mockApp,
    });

    expect(mockResponse.json).toHaveBeenCalledWith({
      peopleWeightOnPlanet: 150,
    });
  });

  test('When call getWeightOnPlanetRandom with de incorrect params then return error', async () => {
    mockGenericRequest
      .mockReturnValueOnce({
        name: 'Luke Skywalker',
        height: '172',
        mass: '75',
        homeworld: 'http://swapi.dev/api/planets/1/',
      })
      .mockReturnValueOnce({
        name: 'BRRRRR',
        gravity: '2 standard',
      })
      .mockReturnValueOnce({
        name: 'BRRRRR',
        gravity: '2 standard',
      });

    const mockApp = {
      swapiFunctions: {
        genericRequest: mockGenericRequest,
      },
    };
  
    await services.getWeightOnPlanetRandom({
      peopleId: '1',
      planetId: '1',
      isWookiee: false,
      res: mockResponse,
      app: mockApp,
    });

    expect(mockResponse.json).toHaveBeenCalledWith({
      error: "calculate mass with planet different from natal",
    });
  });
});
