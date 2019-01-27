/**
 * Created by vmkde on 7/18/2018.
 */
module.exports = {
    "Redis":{
        "mode":"instance",//instance, cluster, sentinel
        "ip": "",
        "port": 6379,
        "user": "",
        "password": "",
        "db": 10,
        "sentinels":{
            "hosts": "",
            "port":16389,
            "name":"redis-cluster"
        }

    },
    "RabbitMQ": {
        "ip":'localhost',
        "port":"5672",
        "user": "guest",
        "password": "guest",
        "vhost":'/'
    },
    "ObjectSore" : {
        "ip":"",
        "port":"",
        "protocol" : ""
    }
};
