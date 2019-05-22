
var data = {
    server: "localhost",
    port: "1883",
    topic: "",
    message: "",
    title: "",
    msgs: []
}

var client = null;

function connectMQTT() {

    if (client) {
        client.end();
    }

    client = mqtt.connect("mqtt://" + data.server + ":" + data.port);

    client.on('connect', function () {
        data.title = "  已连接";
    })

    client.on('message', function (topic, message) {
        data.msgs.unshift(topic.toString() + " " + message.toString());
        console.log(topic, message.toString());
    })

    client.on('close', function() {
        console.log('disconnected');
    })
}

function publishMQTT() {
    if (client) {
        client.publish(data.topic, data.message);
    }
}

function subscribeMQTT() {
    if (client) {
        client.subscribe(data.topic, function (err) {
            if (!err) {
                data.title = "  正在订阅" + data.topic;
            }
        })
    }
}


index = function() {
    var vm = new Vue({
        el: '#root',
        data: data,
        methods: {
            connect: connectMQTT,
            publish: publishMQTT,
            subscribe: subscribeMQTT
        },
    })
    

}

