'use strict';

const chatContextFactory = require( '../lib/chat-context');
const chatContext = chatContextFactory.getOrCreate("chatContext");

const users = new Map();

const getUser = (userId) => {
    let user = users.get(userId);
    
    if (!user || user.expired()) {
        user =  new User(userId);
        users.set(userId, user);
    } else {
        user.state.get("?"); // just update last used timestamp.
    }

    return user;

  };

class User {
     constructor(id) {
         this._id = id;
         this._state = new Map();
         this._lastUsed = new Date();
         this.conversationContext = null;
     }
    get id() {
        return this._id;
    }
    set id(_id) {
        this._id = _id;
    }
    get state() {
        this._lastUsed = new Date();
        return this._state;
    }
    isNotEmpty(obj) {
        if (obj && Array.isArray(obj)) {
            return true;
        }
        return !(!obj || 0 === obj.length);
    }
    hasParameter(parameterName) {
        return this.isNotEmpty(this._state.get(parameterName));
    }
    expired() {
        return Math.abs(new Date().getTime()  - this._lastUsed.getTime()) > 300000;// 5 minutes
    }
    isInConversation() {
        return this.conversationContext !== null && this.conversationContext.isSet();
    }
    ignoreTextProcessing() {
        return this.conversationContext !== null  && this.conversationContext.ignoreTextProcessing(); 
    }
    
    setConversationContext(type, ignoreTextProcessing, fxCallback, callbackResponse) {
        this.conversationContext = chatContext.getOrCreate(this._id);
        this.conversationContext.setCallbackResponse(callbackResponse);
        this.conversationContext.set(/.*/, ignoreTextProcessing, (channel, userId, match, response) => fxCallback(channel, userId, match, type, response));
    }
    
    dispatch(response, channel) {
        var type = response.queryText;
        var senderId = this._id;
        if (this.conversationContext !== null && this.conversationContext.isSet()) {
            var callbackResponse = this.conversationContext.callbackResponse;
            this.conversationContext.match(type, function (err, match, contextCb) {
                if (!err) {
                    if (!callbackResponse) {
                        contextCb(channel, senderId, match, response);
                    } else {
                        contextCb(channel, senderId, match, callbackResponse);
                    }
                } 
              });
        }
        
    }
    
    clear() {
        this._state = new Map();
        this.conversationContext = null;
        chatContext.removeContext(this._id);
    }
}

module.exports = {
    getUser : getUser
};