/* 
 * 
 * 
 * 
 */

/* global socket, nsp */

"use strict";


class ButEnvoi {

	constructor(prefix, event, json, reponse_attendue, nohtml) {
		this.prefix = prefix;
		this.event = prefix + "_" + event;
		this.suffix = event;
		this.json = json;
		this.reponse_attendue = reponse_attendue;
		this.nsp = nsp;
		this.nohtml = nohtml;
	}

	getHTML() {
		if (this.nohtml) {
			return "";
		} else {
			return "<button class='" + this.prefix + "' title='" + this.event + "' onclick='launch(\"" + this.event + "\")'>" + this.suffix + "</button>";
		}
	}

	preparer() {
		if (this.reponse_attendue) {
			var parent = this;
			socket.on(this.event, function (data) {
				parent.outputReception(data);
			});
		}
	}

	lancer() {
		this.json['sendtime'] = Date.now();
		socket.emit(this.event, this.json);
		this.outputEnvoi();
	}

	outputEnvoi() {
		console.log('Envoi: ' + this.event + ' :');
		console.log(this.json);
		var json_str = JSON.stringify(this.json);
		$('#outputEnvoi tbody').append('<tr class="' + this.prefix + '"><td>' + this.prefix + '</td><td>' + this.suffix + '</td><td>' + json_str + '</td><td>' + json_str.length + '</td></tr>');
		$('#outputEnvoi caption .clear').show();
	}

	//Appelé depuis socket
	outputReception(data) {
		console.log('Reception: ' + this.event + ' :');
		console.log(data);
		var json_str = JSON.stringify(data);
		$('#outputReception tbody').append('<tr class="' + this.prefix + '"><td>' + this.prefix + '</td><td>' + this.suffix + '</td><td>' + JSON.stringify(data) + '</td><td>' + json_str.length + '</td><td>' + (Date.now() - this.json.sendtime) + '</td></tr>');
		$('#outputReception caption .clear').show();
	}

}