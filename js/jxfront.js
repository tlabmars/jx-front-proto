var JX = {};

JX.log = function(message, object){
	console.log("[JX] " + message);
	if (object) console.log(object);
};

JX.Server = function(){

	//prod conf
	this.baseUrl = "http://jx.tlabmars.org/sandbox/prototypes/jx-writer/web/";

	//personnal dev conf
	if (window.location.href.indexOf("jxwriter.local") != -1){
		this.baseUrl = "http://jxwriter.local/app_dev.php/";
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

	this.toString = function(){
		var temp = [];

		for (key in this.variables) {
			temp.push(key + "=" + this.variables[key]);
		};

		return temp.join("&");
	}
}