'use strict';


const agents = [];

const getBotAgent = (channelId) => {
    return agents.find((u) => u.channelId === channelId);
};

const addBotAgent = (channelId, venueNumber) => {
    let agent = new Agent(channelId, venueNumber);
    agents.push(agent);
};

class Agent {
    
    constructor(channelId, venueNumber) {
        this._channelId = channelId;
        this._venueNumber = venueNumber;
    }
    
    get channelId() {
        return this._channelId;
    }

    set channelId(channelId) {
        this._channelId = channelId;
    }

    get venueNumber() {
        return this._venueNumber;
    }

}

module.exports = {
    getBotAgent : getBotAgent,
    addBotAgent : addBotAgent
};