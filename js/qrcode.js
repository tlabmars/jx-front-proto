

qrcode.callback = function(data){
	console.log("Decoded QRCODE");
	console.log(data);

	document.getElementById("fileFormLabel").innerHTML = data;
};

//gestion de la validation du formulaire
document.querySelector("#fileForm").addEventListener("submit", function(){
	
	var theInput = document.querySelector("#fileInput");
	
	if (theInput.files && theInput.files[0]) {
    	var reader = new FileReader();
    	
    	reader.onload = function (e) {
    		qrcode.decode(e.target.result);
    	};

    	reader.readAsDataURL(theInput.files[0]);
  }

});
