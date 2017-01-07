/* 
 * 
 * 
 * 
 */
//
"use strict";
/* global io */

var host = "localhost";
var port = 9092;
var nsp = "main";

var adresse = host + ':' + port + '/' + nsp;

var socket;

var nsp = {
	connexion: "connexion",
	general: "general",
	mmsalon: "mmsalon",
	salon: "salon",
	combat: "combat"
};

var allButEnvoi;

var createCofct = function () {
	return function () {
		$('#but').removeClass('deconnected');
		$('#but').addClass('connected');
		$('.cb').attr('checked', true);
	};
};
var createDecofct = function () {
	return function () {
		$('#but').removeClass('connected');
		$('#but').addClass('deconnected');
		$('.cb').attr('checked', false);
	};
};

function onload() {
	$('#adresse').html(adresse);
	socket = io.connect(adresse, {'forceNew': true});

	socket.on('connect', createCofct());
	socket.on('reconnect', createCofct());
	socket.on('connect_failed', createDecofct());
	socket.on('connect_error', createDecofct());
	socket.on('reconnect_error', createDecofct());
	socket.on('reconnect_failed', createDecofct());

	allButEnvoi = [

		//Connexion

		new ButEnvoi(nsp.connexion, 'version', {
			version: 'bb1d22a79c61fd5399ff3a587fdd9045bb2c0ba4'
		}, true),

		new ButEnvoi(nsp.connexion, 'connexion', {
			pseudo: 'toto',
			mdp: 'mdp'
		}, true),

		new ButEnvoi(nsp.connexion, 'deconnexion', {
		}, true),

		//General

		new ButEnvoi(nsp.general, 'getallpersos', {
		}, true),

		new ButEnvoi(nsp.general, 'getallclasses', {
		}, true),

		new ButEnvoi(nsp.general, 'creerperso', {
			nom: 'TestNomPerso',
			idclasseentite: 1
		}, true),
		
		//MMSalon

		new ButEnvoi(nsp.mmsalon, 'entrelistesalons', {
		}, true),

		new ButEnvoi(nsp.mmsalon, 'sortlistesalons', {
		}, true),

		new ButEnvoi(nsp.mmsalon, 'creersalon', {
		}, true),

		new ButEnvoi(nsp.mmsalon, 'rejoindresalon', {
			idsalon: 8
		}, true),

		//Salon

		new ButEnvoi(nsp.salon, 'setproprietes', {
			idmap: 1,
			visibilite: 1,
			typecombat: 1,
			nbr_equipe: 3,
			nbr_eq_persos_equipe: 4,
			nbr_persos_total: 26,
			nbr_eq_persos_joueur: 2,
			nbr_eq_persos_classe: 3
		}, true),

		new ButEnvoi(nsp.salon, 'quittersalon', {
		}, true),

		new ButEnvoi(nsp.salon, 'ajoutperso', {
			idperso: 362,
			equipe: 1
		}, true),

		new ButEnvoi(nsp.salon, 'retraitperso', {
			idperso: 362
		}, true),

//		new ButEnvoi(nsp.salon, 'equipeperso', {
//			idperso: 362,
//			equipe: 2
//		}, true),

		new ButEnvoi(nsp.salon, 'pret', {
			pret: true
		}, true),

		//Combat

		new ButEnvoi(nsp.combat, 'chargementfini', {
		}, true),

		new ButEnvoi(nsp.combat, 'placement', {
			idperso: 23,
			idtuile: 34
		}, true),

		new ButEnvoi(nsp.combat, 'pret', {
			pret: true
		}, true),

		new ButEnvoi(nsp.combat, 'lancerlistesort', {
			sorts: [
				{
					idclassesort: 34,
					idtuile: 34
				},
				{
					idclassesort: 12,
					idtuile: 10
				},
				{
					idclassesort: 16,
					idtuile: 23
				}
			]
		}, true),

		new ButEnvoi(nsp.combat, 'annulersort', {
		}, true),

		new ButEnvoi(nsp.combat, 'abandonner', {
		}, true)
	];
}






function start() {
	onload();
	var nspid, nsptxt;
	for (var b of allButEnvoi) {
		nsptxt = b.prefix;
		nspid = '#' + nsptxt;
		if (!$(nspid).length) {
			$('#but').append('<div id="' + nsptxt + '" class="butContent deconnected"><h2>' + nsptxt + '</h2></div>');
		}
		$(nspid).append(b.getHTML());
		b.preparer();
	}

	$('.cb').click(function () {
		if ($(this).is(':checked')) {
			socket.connect();
		} else {
			socket.disconnect();
		}
		if (socket.connected) {
			createCofct(socket)();
		} else {
			createDecofct(socket)();
		}
	});
	
	reduce('table');
}

function launch(event) {
	for (var b of allButEnvoi) {
		if (b.event === event) {
			b.lancer();
			return;
		}
	}
}

function clearr(table) {
	$(table).find('tbody').html('');
	$(table).find('caption .clear').hide();
}

function reduce(table) {
	if($(table).is('.reduced')) {
		$(table).removeClass('reduced');
		$(table).find('.reduce').html('-');
	} else {
		$(table).addClass('reduced');
		$(table).find('.reduce').html('+');
	}
}