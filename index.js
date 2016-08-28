/*
 * Copyright (c) 2016, Bigsens, LLC
 * Muiltiple endpoints example
 * Author: Constantin Alexandrov
 */

'use strict';

var Message = require('./protocol').Message,
	net = require('net'),
	aguid = require('aguid');

var port = 13777;

function annce(name) {return {cmd:Message.SERVICE_ANNCE,data:{guid:aguid(name),name:name}};}
function send(sock, packet) {
	packet = JSON.stringify(packet);
	sock.write(packet);
}

function Receiver(name, reply) {
	var sock = net.connect(port, function() {
		sock.on('data', function(buf) {			
			var packet = JSON.parse(buf);
			packet.data = 'Hello from ' + name;
			if(reply) send(sock, packet);
		});
		send(sock, annce(name));
	});
}

function Sender(name, interval) {
	var sock = net.connect(port, function() {
		sock.on('data', function(buf) {
			var packet = JSON.parse(buf);
			console.log(name, 'handled', JSON.stringify(packet, null, 2));
		});
		send(sock, annce(name));
	});

	setInterval(function() {
		var packet = {cmd:Message.DEVICE_LIST}
		send(sock, packet);
	}, interval);
}

function main() {

	new Receiver('receiver.1', true);
	new Receiver('receiver.2', false);
	new Receiver('receiver.3', true);
	new Receiver('receiver.4', true);
	new Receiver('receiver.5', false);
	new Receiver('receiver.6', false);
	new Receiver('receiver.7', true);
	new Receiver('receiver.8', true);
	new Receiver('receiver.9', true);

	// All senders will be with no response
	new Sender('sender.1', 5000);
	new Sender('sender.2', 3000);
	new Sender('sender.3', 7000);
	//new Sender('sender.4', 1000);
	//new Sender('sender.5', 1000);

}

main();

