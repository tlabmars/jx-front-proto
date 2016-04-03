
//scene en cours, avec la valeur de depart.
var currentSceneId = 1;

//preparation de jxServer
var jxServer = new JX.Server();

//initialisation des variables du jeu. 
jxServer.variables.init("inspiration", 0);
//jxServer.variables.init("latitude", 0);
//jxServer.variables.init("longitude", 0);
//tente de lire les valeurs du localstorage
jxServer.variables.readLocal();

//jxServer.handleLatitudeLongitude();

//cette fonction sera appellee quand le JSON de la scene sera recu.
var handleScene = function(jsonData){
	
	console.log("handleScene receive JSON data : ");
	console.log(jsonData);
	
	currentSceneId = jsonData.id;

	//pointe vers les elements HTML
	var titleElement = document.getElementById("mainTitle");
	var mediaElement = document.getElementById("medias");
	var connectionElement = document.getElementById("connections");
	var playerElement = document.getElementById("player");
	var inputElement = document.getElementById("playerInput");
	
	//reset elements
	titleElement.innerHTML = "";
	mediaElement.innerHTML = "";
	connectionElement.innerHTML = "";
	playerElement.innerHTML = "";
	inputElement.value="";
	
	//prise en compte des actions (mise a jour des variables de la scène, s'il y en a)
	jxServer.variables.update(jsonData.actions);

	//affichage
	playerElement.innerHTML = "Votre score d'inspiration : " + jxServer.variables.get("inspiration");

	//titre de la page
	titleElement.innerHTML = "Scène #" + jsonData.id ;
	titleElement.innerHTML += " : " + jsonData.title ;
	titleElement.innerHTML += " (" + jsonData.project.title + ")";
	
	jsonData.medias.forEach(function(item){
		if (item.format == "text") {
			mediaElement.innerHTML += "<p>" + item.content + "</p>";	
		} 

		if (item.format == "image") {
			var newImageElement = document.createElement("img");
			newImageElement.setAttribute("src", item.content);
			mediaElement.appendChild(newImageElement);
		}
	});

	jsonData.connections.forEach(function(item){
		if (! item.label) {
			return;
		}
		
		var newConnectionElement = document.createElement("li");
		newConnectionElement.innerHTML = item.label;
		newConnectionElement.innerHTML += " (vers la scène #" + item.childSceneId + ")";

		newConnectionElement.addEventListener("click", function(){
			jxServer.requestScene(item.childSceneId, handleScene);
		});

		connectionElement.appendChild(newConnectionElement);
	});

}

//cette fonction sera appelle si la saisie du joueur correspond a une connection.
var handlePatternResponse = function(jsonData){
	console.log("Check pattern : scene found !");
	handleScene(jsonData);
}

//cette fonction sera appelle si la saisie du joueur NE correspond PAS a une connection.
var handlePatternFailure = function(message, data){
	console.log("Check pattern : no scene found.");
	//alert("Invalid pattern");
}

//gestion de la validation du formulaire
document.querySelector("#patternForm").addEventListener("submit", function(){

	var theInput = document.querySelector("#playerInput").value;
	console.log("Form submitted with value : " + theInput);
	
	//demande au serveur la scene correspondant a la saisie (en passant les fonctions "handlePatternResponse" et "handlePatternFailure")
	jxServer.checkPattern(currentSceneId, theInput, handlePatternResponse, handlePatternFailure);	
});

//******
//c'est ici que ca demarre : lance la requete pour la premiere scene.
//si une scene est trouvee, il appelera la fonction "handleScene"
//******
jxServer.requestScene(currentSceneId, handleScene);
jxServer.listenImageCode(document.querySelector("#fileInput"), jxServer.redirectToUrl);

//gestion de la validation du formulaire
document.querySelector("#player").addEventListener("click", function(){
	var res = confirm("Reset variables + reload ?");
	
	if (res) {
		jxServer.variables.resetLocal();
		window.location.reload();
	}
	
});

