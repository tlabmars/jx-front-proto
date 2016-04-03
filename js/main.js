
//scene en cours, avec la valeur de depart.
var currentSceneId = 111;//26;

//preparation de jxServer
var jxServer = new JX.Server();

var basePictoUrl = "http://jolietteconnexions.com/2/mediasgraphique/";

//initialisation des variables du jeu. 
jxServer.variables.init("finA", 0);
jxServer.variables.init("finB", 0);
jxServer.variables.init("finC", 0);

jxServer.variables.readLocal();


//cette fonction sera appellee quand le JSON de la scene sera recu.
var handleScene = function(jsonData){
	
	if (jsonData.data) {
		document.body.setAttribute("class", jsonData.data);
	} else {
		document.body.setAttribute("class", "");
	}
	

	console.log("handleScene receive JSON data : ");
	console.log(jsonData);
	
	currentSceneId = jsonData.id;

	//pointe vers les elements HTML
	var titleElement = document.getElementById("mainTitle");
	var mediaElement = document.getElementById("medias");
	var connectionElement = document.getElementById("connections");
	
	//reset elements
	titleElement.innerHTML = "";
	mediaElement.innerHTML = "";
	connectionElement.innerHTML = "";
	
	//prise en compte des actions (mise a jour des variables de la scène, s'il y en a)
	jxServer.variables.update(jsonData.actions);

	
	//titre de la page
	/*titleElement.innerHTML = "Scène #" + jsonData.id ;
	titleElement.innerHTML += " : " + jsonData.title ;
	titleElement.innerHTML += " (" + jsonData.project.title + ")";*/
	
	jsonData.medias.forEach(function(item){
		if (item.format == "text") {
			mediaElement.innerHTML += "<p>" + item.content + "</p>";	
		} 

		if (item.format == "png") {
			var newImageElement = document.createElement("img");
			newImageElement.setAttribute("src", item.content);
			mediaElement.appendChild(newImageElement);
		}

		if (item.format == "mp3") {
			var audioElement = document.createElement("audio");
			//audioElement.setAttribute("controls", "controls");
			audioElement.setAttribute("autoplay", "autoplay");
			
			var sourceElement = document.createElement("source");
			sourceElement.setAttribute("type", "audio/mpeg");
			sourceElement.setAttribute("src", item.content);

			audioElement.appendChild(sourceElement);
			mediaElement.appendChild(audioElement);
		}
	});
	var totalConnexion = 0;
	jsonData.connections.forEach(function(item){
		if (! item.label) {
			return;
		}
		//total des connexions trouvées suaf pattern portrait, qcm,...
		totalConnexion ++;
		var newConnectionElement = document.createElement("li");
		

		if (item.label.substr(-4) == ".png") {
			var src = basePictoUrl + item.label;
			var img = document.createElement("img");
			img.setAttribute("src", src);

			newConnectionElement.appendChild(img);

		} else {
			newConnectionElement.innerHTML = item.label;
		}


		newConnectionElement.addEventListener("click", function(){
			jxServer.requestScene(item.childSceneId, handleScene);
		});

		connectionElement.appendChild(newConnectionElement);
	});

	//cretaion class css nb2
	var classConnexion = "nb_" + totalConnexion;
	connectionElement.setAttribute("class", classConnexion);

}

//******
//c'est ici que ca demarre : lance la requete pour la premiere scene.
//si une scene est trouvee, il appelera la fonction "handleScene"
//******
jxServer.requestScene(currentSceneId, handleScene);
