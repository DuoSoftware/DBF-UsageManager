/**
 * Created by vmkde on 7/18/2018.
 */

const amqplib = require('amqplib');
const config = require('config');

let open = require('amqplib').connect(`amqp://${config.RabbitMQ.user}:${config.RabbitMQ.password}@${config.RabbitMQ.ip}`);
//let open = require('amqplib').connect(`amqp://guest:guest@localhost`);


module.exports = (queue, message) =>{

    return new Promise(function(resolve, reject) {
        open.then(function(conn) {
            return conn.createChannel();
        }).then(function(ch) {
            return ch.assertQueue(queue, {durable: true}).then(function(ok) {
                ch.sendToQueue(queue, new Buffer(message));
                resolve("DONE");

            });
        }).catch(function (exp) {
            reject(exp);

        });
    });

};


