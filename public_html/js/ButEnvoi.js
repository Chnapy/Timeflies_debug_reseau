/* 
 * 
 * 
 * 
 */

/* global socket, nsp */

"use strict";


class ButEnvoi {

	constructor(prefix, event, json, reponse_attendue) {
		this.prefix = prefix;
		this.event = prefix + "_" + event;
		this.suffix = event;
		this.json = json;
		this.reponse_attendue = reponse_attendue;
		this.nsp = nsp;
	}

	getHTML() {
		return "<button class='" + this.prefix + "' title='" + this.event + "' onclick='launch(\"" + this.event + "\")'>" + this.suffix + "</button>";
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
		$('#outputEnvoi').append('<tr class="' + this.prefix + '"><td>' + this.prefix + '</td><td>' + this.suffix + '</td><td>' + JSON.stringify(this.json) + '</td></tr>');
	}

	//Appelé depuis socket
	outputReception(data) {
		console.log('Reception: ' + this.event + ' :');
		console.log(data);
		$('#outputReception').append('<tr class="' + this.prefix + '"><td>' + this.prefix + '</td><td>' + this.suffix + '</td><td>' + JSON.stringify(data) + '</td><td>' + (Date.now() - this.json.sendtime) + '</td></tr>');
	}

}