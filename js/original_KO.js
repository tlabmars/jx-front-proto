//scene en cours, avec la valeur de depart.
var currentSceneId = 79;

//preparation de jxServer
var jxServer = new JX.Server();
var fonctionFullscreen;

//initialisation des variables du jeu. 
jxServer.variables.init("beenthere", 0);
jxServer.variables.init("vue", 0);
jxServer.variables.init("indiceVue", 0);

var mainContainer=document.getElementById("container");





//cette fonction sera appellee quand le JSON de la scene sera recu.
var handleScene = function(jsonData){
    
    
    if (fonctionFullscreen) {
        
        mainContainer.removeEventListener("click", fonctionFullscreen);
        fonctionFullscreen = undefined;
    
    }

    console.log("handleScene receive JSON data : ");
    console.log(jsonData);

    currentSceneId = jsonData.id;

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
            if (item.position == "0") {
                mediaElement.innerHTML += "<h1>" + item.content + "</h1>";
            }
            else{
                mediaElement.innerHTML += "<p>" + item.content + "</p>";
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
        
        if (item.position == "100")

        {
            
            fonctionFullscreen = function(){
                jxServer.requestScene(item.childSceneId, handleScene);
            };
            
            mainContainer.addEventListener("click", fonctionFullscreen);

        }
              
            else {
                
                if (item.position == "105") {

                    var newConnectionElement = document.createElement("i");
                    newConnectionElement.setAttribute("class", "fa fa-circle fa-4x");
                    newConnectionElement.addEventListener("click", function(){
                        newConnectionElement.setAttribute("class", "active");
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
                });

                connectionElement.appendChild(newConnectionElement);
                }
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
