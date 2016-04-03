

JX.Server.prototype.handleLatitudeLongitude = function(callbackReady, callbackNotReady){

	JX.log("Handle latitude and longitude...");

	if (! this.variables.exists("latitude") || ! this.variables.exists("longitude")){
		JX.log("Abort : no variables 'latitude' or 'longitude'");
		return;
	}

	if (! callbackReady) {
		callbackReady = function(){};
	}

	if (! callbackNotReady) {
		callbackNotReady = function(){};
	}

	var self = this;

	var watchPosition = function(event) {
		JX.log("GEOLOC OK, updating variables : ", event);
		
		self.variables.set("latitude", event.coords.latitude);
		self.variables.set("longitude", event.coords.longitude);

		callbackReady();
	};

	var errorPosition = function(error) {
		JX.log("GEOLOC ERROR : ", error);
		callbackNotReady();
	};

	var options = {
		"enableHighAccuracy": true, 
		"maximumAge" : 5000, 
		"timeout" : 5000
	};

	this.watchPositionId = navigator.geolocation.watchPosition(watchPosition, errorPosition, options);
}

JX.Server.prototype.disableLatitudeLongitude = function(){
	if (this.watchPositionId == undefined) {
		return;
	}

	navigator.geolocation.clearWatch(this.watchPositionId);
}