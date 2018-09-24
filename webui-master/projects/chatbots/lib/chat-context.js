
const logger = require('morgan');

var Context = require('./context');

/**
 * A map to hold contexts for all users/keys
 */
class ChatContext extends Map {

    constructor(...args) {
        super(...args);
    }

    /**
     * Creates a new context entry in the ContextMap
     * 
     * @param {string} userId 
     */
    create(userId) {
        if(!userId) {
            return;
        }
        let context = new Context(userId);
        super.set(userId, context);
        return context;
    }

    /**
     * Get Or Creates a context given the key.
     */
    getOrCreate(userId) {
        if(this.has(userId)) {
            return this.get(userId);
        } else {
            return this.create(userId);
        }
    }

    removeContext(userId) {
        this.delete(userId);
    }
}

class ChatContextFactory extends Map {

    constructor(...args) {
        super(...args);
    }

    getOrCreate(type) {
        if(this.has(type)) {
            return this.get(type);
        } else {
            return this.create(type);
        }
    }

    create(type) {
        if(!type) {
            return;
        }
        let context = new ChatContext();
        super.set(type, context);
        return context;
    }
}

module.exports = new ChatContextFactory();