
JX.Server.prototype.redirectToUrl = function(url) {
	confirm("Redirect to " + url + " ?");
	document.location.href = url;
};

JX.Server.prototype.handlePattern = function(data) {
	
};

JX.Server.prototype.listenImageCode = function(inputElement, callbackSuccess, callbackFailure){

	if (! callbackSuccess) {
		callbackSuccess = function(){};
	}

	if (! callbackFailure) {
		callbackFailure = function(){};
	}

	qrcode.callback = function(data){
		JX.log("Decoded data : ", data);

		if (data) {
			callbackSuccess(data);
		} else {
			callbackFailure();
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



