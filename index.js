/**
 * Created by vmkde on 7/18/2018.
 */


const Redis  = require('./lib/redisManager');
const queueManager  = require('./lib/queueManager');
const ratingManager  = require('./lib/ratingManager');

let redis = new Redis();



exports.default = {

    setToRedis : async function (key, value) {
        try {
            let value = await redis.SetSessionNonExpire(key, value);
            return ({IsSuccess : true, message :`Success`, value :value });
        } catch(err) {
            return({IsSuccess : false, message :`Date-${Date.now()}-redis set failed key-${key}`, exception :err });
        }
    },

    getFromRedis : async function (key) {

        try {
            let value = await  redis.GetSession(key);
            return ({IsSuccess : true, message :`Success`, value :value });
        } catch(err) {
            return({IsSuccess : false, message :`Date-${Date.now()}-redis get failed key-${key}`, exception :err });
        }

    },
    deleteFromRedis : async function (key) {
        try {
            let value =  await  redis.RemoveSession(key);
            return ({IsSuccess : true, message :`Success`, value :value });
        } catch(err) {
            return({IsSuccess : false, message :`Date-${Date.now()}-redis delete failed key-${key}`, exception :err });
        }
    },
    SessionExistsRedis : async function(key){
        try {
            let value =  await  redis.SessionExists(key);
            return ({IsSuccess : true, message :`Success`, value :value });
        } catch(err) {
            return({IsSuccess : false, message :`Date-${Date.now()}-redis SessionExistsRedis failed key-${key}`, exception :err });
        }
    },
    SendToQueue : async function (queue, message){
        try {
            let value =  await  queueManager(queue, message);
            return ({IsSuccess : true, message :`Success`, value :value });
        } catch(err) {
            return({IsSuccess : false, message :`Date-${Date.now()}-redis SessionExistsRedis failed key-${key}`, exception :err });
        }
    },
    CreateRulesForTenant : async function (namespace, obj, expiry = null){

        try {
            let value =  await ratingManager.CreateRulesForTenant(namespace, obj, expiry);
            return ({IsSuccess : true, message :`Success`, value :value });
        } catch(err) {
            return({IsSuccess : false, message :`Date-${Date.now()}-Request Failed-${namespace}`, exception :err });
        }

    },
    CreateRulesForUser : async function (namespace, userid, obj, expiry = null){

        try {
            let value =  await ratingManager.CreateRulesForUser(namespace, userid, obj, userid, expiry);
            return ({IsSuccess : true, message :`Success`, value :value });
        } catch(err) {
            return({IsSuccess : false, message :`Date-${Date.now()}-Request Failed-${namespace}`, exception :err });
        }

    },
    Rate : async function (namespace, route, size, criteria, headers=null, username = "anonymous") {
        try {
            let value =  await ratingManager.Rate(namespace, route, size, criteria, headers, username);
            return ({IsSuccess : true, message :`Success`, value :value });
        } catch(err) {
            return({IsSuccess : false, message :`Date-${Date.now()}-Request Failed-${namespace}`, exception :err });
        }

    },
    validateWithRedis : async function (key,size) {
        try {
            let value =  await ratingManager.validateWithRedis(key, size);
            return ({IsSuccess : true, message :`Success`, value :value });
        } catch(err) {
            return({IsSuccess : false, message :`Date-${Date.now()}-Request Failed-${namespace}`, exception :err });
        }

    },
    validate : async function (namespace, type, size, criteria, username = "anonymous") {
        try {
            let value =  await ratingManager.validate(namespace, type, size, criteria, username);
            if(value == true){
                return ({IsSuccess : true, message :`Success`, value :value });
            }
            else{
                return value
            }
        } catch(err) {
            return({IsSuccess : false, message :`Date-${Date.now()}-Request Failed-${namespace}`, exception :err });
        }

    }


};



