(function() {

debugger;
    
//preparation de jxServer
var jxServer = window.jxServer = new JX.Server();

//scene en cours, avec la valeur de depart.
var currentSceneId = parseInt(sessionStorage.getItem('JX_lastSeenScene'), 10) || 79;


//initialisation des variables du jeu. 
jxServer.variables.init("geoloc", "off");
jxServer.variables.init("beenthere", 0);
jxServer.variables.init("vue", 0);
jxServer.variables.init("indiceVue", 0);
jxServer.variables.init("lastSeenScene", 9);


//cette fonction sera appellee quand le JSON de la scene sera recu.
var handleScene = function(jsonData){

    console.log("handleScene receive JSON data : ");
    console.log(jsonData);

    currentSceneId = jsonData.id;
    debugger;
    jxServer.variables.update("lastSeenScene", jsonData.id);

    //pointe vers les elements HTML
    var mediaElement = document.getElementById("medias");
    var connectionElement = document.getElementById("connections");
    var inputElement = document.getElementById("playerInput");

    //reset elements
    mediaElement.innerHTML = "";
    connectionElement.innerHTML = "";
    inputElement.value="";

    //prise en compte des actions (mise a jour des variables de la scène, s'il y en a)
    jxServer.variables.update(jsonData.actions);

    jsonData.medias.forEach(function(item){
        if (item.format == "text") {
            if (item.position == "1") {
                mediaElement.innerHTML += "<h1>" + item.content + "</h1>";
            }
            else{
                mediaElement.innerHTML += "<p class='text'>" + item.content + "</p>";
            }
            	
        } 

        if (item.format == "img-round") {
            var newImageElement = document.createElement("img");
            newImageElement.setAttribute("src", item.content);
            newImageElement.setAttribute("class", "img-round");
            newImageElement.setAttribute("width", "200");
            mediaElement.appendChild(newImageElement);
        }
    });

    jsonData.connections.forEach(function(item){
        if (! item.label) {
            return;
        }
                
            if (item.position == "105") {

                var newConnectionElement = document.createElement("i");
                newConnectionElement.setAttribute("class", "fa fa-chevron fa-4x");
                newConnectionElement.addEventListener("click", function(){
                    jxServer.requestScene(item.childSceneId, handleScene);
                });

                connectionElement.appendChild(newConnectionElement);
            }
            else {
            var newConnectionElement = document.createElement("button");
            newConnectionElement.innerHTML = item.label;
            newConnectionElement.setAttribute("class", "pure-button pure-button-primary");
            newConnectionElement.setAttribute("style", "margin-right:20px;");
            newConnectionElement.addEventListener("click", function(){
                jxServer.requestScene(item.childSceneId, handleScene);
                if (item.childSceneId == 10) {
                    var geoloc = "on";
                
                }
            });

            connectionElement.appendChild(newConnectionElement);
            }
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
document.querySelector("form").addEventListener("submit", function(){

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
})();