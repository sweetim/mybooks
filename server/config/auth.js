'use strict';

module.exports = {
	"jwt": {
		"secret": "hahhahahhaha",
		"exp": (60) 	//in minutes
	},
	"hashing": {
		"len": 128,
		"iteration": 12000
	},
	"google": {
		"clientId": "780583752170-0am63sn470uik9bojss4oop0nlk7nu32.apps.googleusercontent.com",
		"secret": "AmNP04LrAWkT1IxSQMr1H0XM",
		"redirectUrl": "postmessage",
		"apiKey": "AIzaSyA_iZBSB1x5BbXmrffpmGuw7saWx3j6MOo"
	},
	"facebook": {
		"production": {
			"clientId": "825297847502790",
			"adminId": "825297847502790|Kd4NB3NkgUBm_NJGCqbs37Xr63c",
			"secret": "4d4a828b0cfd02a36e719c62ad3a17e5",
			"graphVersion": "v2.1"
		},
		"development": {
			"clientId": "826122044087037",
			"adminId": "826122044087037|ZZw3Jdm08VS7Fw1BVZPpvb3kg08",
			"secret": "5330ce7836f708132bc41e269f98a322",
			"graphVersion": "v2.1"
		}
	}
};