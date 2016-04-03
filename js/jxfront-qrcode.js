
JX.Server.prototype.redirectToUrl = function(url, jx) {
	var res = true;

	if (jx.redirectMessage) {		
		res = confirm( jx.redirectMessage.replace("%url%", url) );	
	}

	if (res) {
		document.location.href = url;	
	}
	
};

JX.Server.prototype.handlePattern = function(data, jx) {
	
};

JX.Server.prototype.listenImageCode = function(inputElement, callbackSuccess, callbackFailure){

	var jx = this;

	if (! callbackSuccess) {
		callbackSuccess = function(){};
	}

	if (! callbackFailure) {
		callbackFailure = function(){};
	}

	qrcode.callback = function(data){
		JX.log("Decoded data : ", data);

		if (data) {
			callbackSuccess(data, jx);
		} else {
			callbackFailure(jx);
		}
	};

	inputElement.addEventListener("change", function() {
		JX.log("Add listener to input...");

		if (! inputElement.files || ! inputElement.files[0]) {
			return;
		}
	    	
		var reader = new FileReader();
		
		reader.onload = function (e) {
			JX.log("Will decode");
			qrcode.decode(e.target.result);
		};

		reader.readAsDataURL(inputElement.files[0]);
	});





}



