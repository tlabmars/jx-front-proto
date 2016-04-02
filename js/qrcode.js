

var inputFile = document.getElementById("fileInput");

qrcode.callback = function(data){
	console.log("Decoded QRCODE");
	console.log(data);

	document.getElementById("fileFormLabel").innerHTML += data;
};

// gestion de la validation du formulaire
inputFile.addEventListener("change", function(){
	
	inputFile.innerHTML += "submit,";
	var theInput = inputFile;
	
	if (theInput.files && theInput.files[0]) {
    	var reader = new FileReader();
    	document.getElementById("fileFormLabel").innerHTML += "read,";
    	
    	reader.onload = function (e) {
    		qrcode.decode(e.target.result);
    		document.getElementById("fileFormLabel").innerHTML += "decode,";
    	};

    	reader.readAsDataURL(theInput.files[0]);
  }

});
