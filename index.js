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
    CreateRulesForTenant : function (namespace, obj, expiry = null){

        ratingManager.CreateRulesForTenant(namespace, obj, expiry).then(function(value) {
            return ({IsSuccess : true, message :`Success`, value :value });
        }).catch(function(err) {
            return({IsSuccess : false, message :`Date-${Date.now()}-Failed for-${namespace}`, exception :err })
        });
    },
    CreateRulesForUser : function (namespace, userid, obj, expiry = null){

        ratingManager.CreateRulesForUser(namespace, userid, obj, userid, expiry).then(function(value) {
            return ({IsSuccess : true, message :`Success`, value :value });
        }).catch(function(err) {
            return({IsSuccess : false, message :`Date-${Date.now()}-Failed for-${namespace}`, exception :err })
        });
    },
    Rate : function (namespace, route, size, criteria, headers=null, username = "anonymous") {

        ratingManager.Rate(namespace, route, size, criteria, headers, username).then(function(value) {
            return ({IsSuccess : true, message :`Success`, value :value });
        }).catch(function(err) {
            return({IsSuccess : false, message :`Date-${Date.now()}-Failed for-${namespace}`, exception :err })
        });
    },
    validateWithRedis : function (key,size) {
        ratingManager.validateWithRedis(key, size).then(function(value) {
            return ({IsSuccess : true, message :`Success`, value :value });
        }).catch(function(err) {
            return({IsSuccess : false, message :`Date-${Date.now()}-Failed for-${key}`, exception :err })
        });
    },
    validate : function (namespace, type, size, criteria, username = "anonymous") {

        ratingManager.validate(namespace, type, size, criteria, username ).then(function(value) {
            return ({IsSuccess : true, message :`Success`, value :value });
        }).catch(function(err) {
            return({IsSuccess : false, message :`Date-${Date.now()}-Failed for-${namespace}`, exception :err })
        });
    }


};
/*SendToQueue().then(function(exp){
 console.log(exp);
 }).catch(function (err) {
 console.log(JSON.stringify(err));
 });
 async function SendToQueue (){
 try {
 let value =  await  queueManager.publish('sdsdsdsd', 'this is a test');
 console.log(value)
 return ({IsSuccess : true, message :`Success`, value :value });
 } catch(err) {
 throw Error ({IsSuccess : false, message :`Failed`, exception :err });
 }

 }*/



