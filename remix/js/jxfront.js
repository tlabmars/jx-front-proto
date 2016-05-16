var JX = {};

JX.log = function(message, object){
	console.log("[JX] " + message);
	if (object) console.log(object);
};

JX.Server = function(){

	//prod conf
	this.baseUrl = "https://jx.tlabmars.org/sandbox/prototypes/jx-writer/web/";
	this.redirectMessage = "Etes vous sûr de vouloir aller sur ?";

	//personnal dev conf
	if (window.location.href.indexOf("localhost") != -1){
		this.baseUrl = "http://localhost/jx-writer/web/";
	}

	this.variables = new JX.Vars();
	this.variables.init("_jx", 1);

	//Request scene details.
	this.requestScene = function(sceneId, callbackSuccess, callbackError){
		this.makeJsonRequest("api/scene/" + sceneId, callbackSuccess, callbackError);
	};

	//Request pattern validity for the given scene and player input. 
	//Retrieve the target scene details if match.
	this.checkPattern = function(currentSceneId, playerInput, callbackSuccess, callbackError){
		var additionnalParameters = new JX.Vars();
		additionnalParameters.init("_input", playerInput);

		this.makeJsonRequest("api/connection/" + currentSceneId, callbackSuccess, callbackError, additionnalParameters);	
	}

	this.makeDefaultCallbackError = function(){
		return function(e, responseText){
			console.error(e);
			console.error(responseText);
		};
	}
	
	//Common JSON request
	this.makeJsonRequest = function(targetUrl, callbackSuccess, callbackError, additionnalParameters){
		
		var params = "?" + this.variables.toString();
		var additionnalParams = additionnalParameters ? "&" + additionnalParameters.toString() : "";

		var url = this.baseUrl + targetUrl + params + additionnalParams;
		JX.log("Sending : " + url);

		if (!callbackError) {
			callbackError=this.makeDefaultCallbackError();
		}

		var request = new XMLHttpRequest();
		
		request.open('GET', url, true);
		request.onload = function(e){
			var json;
			try {
				json = JSON.parse(this.responseText);
			} catch(exception) {
				callbackError(exception, this.responseText);
			}

			if (! json || json.status == "NOK") {
				callbackError("Empty or NOK data", json);	
				return;
			}

			if (json) {
				callbackSuccess(json);
			}
			
		}

		request.onerror = function(e){
			callbackError(e);
		}

		request.send();
	}
}

JX.Vars = function(){
	this.variables = {};

	this.init = function(name, value){
		
		if(value == undefined) {
			value = 0;
		}

		this.variables[name] = value;
	}

	this.update = function(actions){
		if (! actions || actions.length == 0) {
			return;
		}

		for(variable in actions) {
			this.add(variable, actions[variable]);
		}

		JX.log("updated variables : ", this.variables);
		this.saveLocal();
	}

	this.add = function(name, value) {
		if (! this.variables[name]){
			this.variables[name] = 0;
		}

		this.variables[name] += value;
	}

	this.get = function(name) {
		return this.variables[name];
	}

	this.set = function(name, value) {
		this.variables[name] = value;
		this.saveLocal();
	}

	this.exists = function(name) {
		if (this.variables[name] != undefined) {
			return true;
		}

		return false;
	}

	this.toString = function(){
		var temp = [];

		for (key in this.variables) {
			temp.push(key + "=" + this.variables[key]);
		};

		return temp.join("&");
	}

	this.saveLocal = function(){
		var ignore = ["latitude", "longitude"];

		for (key in this.variables) {
			
			if (ignore.indexOf(key) >= 0) {
				continue;
			}

			localStorage.setItem("JX_" + key, this.variables[key]);
		}

		JX.log("Saved variables.");
	}

	this.readLocal = function(){
		for (key in this.variables) {
			var value = localStorage.getItem("JX_" + key);

			if (value != undefined) {
				this.variables[key] = parseFloat(value);
			}
		}

		JX.log("Read variables from localStorage.");
		JX.log("values variables : ", this.variables);

	}

	this.resetLocal = function(){
		JX.log("Reset variables from localStorage.");

		for (key in this.variables) {
			localStorage.removeItem("JX_" + key);
		}
	}

}