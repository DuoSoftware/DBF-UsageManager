/**
 * Created by vmkde on 7/19/2018.
 */

const queueMan = require('./queueManager');
const ratingMan = require('./ratingManager');
const obStore = require('./ObjectStore');
const redisMan = require('./redisManager');

let redis = new redisMan();

module.exports ={

    CreateRulesForTenant : async function (namespace,obj, expiry = null){

        return await createRules(namespace, namespace, obj, namespace, expiry);
    },
    CreateRulesForUser : async function (namespace, userid, obj, expiry = null){

        return await createRules(namespace, userid, obj, userid, expiry);
    },
    Rate : async function(namespace, route, size, criteria, headers=null, username){
        let rateObj = {};
        rateObj.body = {};
        rateObj.headers = {};

        rateObj.headers.namespace = namespace;
        rateObj.headers.securityToken = "123";
        rateObj.headers.username = username;

        rateObj.body.size = size;
        rateObj.body.criteria = criteria;

        rateObj.route = route;

        return await queueMan(route, JSON.stringify(rateObj));


    },
    validateWithRedis: async function (key, size){

        let value = await redis.GetSession(key);

        let isValid = true;
        if (value !== null || value !== 'null'){
            let limitVal = await redis.GetSession(`${key}_limit`);

            if (value)
                value = parseInt(value);
            if (size)
                size = parseInt(size);
            if (limitVal)
                limitVal = parseInt(limitVal);

            let newVal = value + size;
            if (newVal > limitVal)
                isValid = false;
        }


        return isValid;

    },
    validate : async function (namespace, type, size, criteria, username ){


        let key = (criteria === "tenant") ? `deny:${namespace}.${type}`: `deny:${namespace}.${type}:${username}`;
        let isValid = await module.exports.validateWithRedis(key,size);
        if (!isValid){
            return ({"success": false, "message": "Your quota has been exceed"});
        }
        return isValid;
    }



};


function createRules(namespace, userid, obj, id, expiry) {
    return new Promise(function(resolve, reject) {

        let ruleObj = {};
        ruleObj.id=id;
        ruleObj.username=userid;
        ruleObj.expiry=expiry;
        ruleObj.data=obj;


        obStore.insertSingle("ratingenginerules", namespace, "id", ruleObj, function (response){

            if(JSON.parse(response).IsSuccess === true){

                sendRuleToQueue(ruleObj).then(function (result) {
                    if(result === "DONE"){
                        resolve({IsSuccess: true});
                    }
                    else{
                        reject({IsSuccess: false});
                    }

                }).catch();


            }
            else{
                reject({IsSuccess: false});
            }


        })

    })
}

async function  sendRuleToQueue(rules) {
    let rateObj = {};
    rateObj.body = {};
    rateObj.body.rules = rules;
    rateObj.body.criteria = "rule";
    rateObj.route = "rule";
    let result = await queueMan("rule", JSON.stringify(rateObj)).catch(function (err) {
    });
    if(result === "DONE"){
        return(result);
    }
    else{
        return("ERROR");
    }
}