
//scene en cours, avec la valeur de depart.
//var currentSceneId = 213;//
var currentSceneId = 214;
//preparation de jxServer
var jxServer = new JX.Server();

//initialisation des variables du jeu. 
jxServer.variables.init("latitude", 0);
jxServer.variables.init("longitude", 0);
jxServer.variables.init("approche", 0);
jxServer.variables.init("vue", 0);

//initialisation variable pour stockage fonction fullscreen
var fonctionFullscreen;

//tente de lire les valeurs du localstorage
jxServer.variables.readLocal();


if("geolocation" in navigator) {
    
    jxServer.handleLatitudeLongitude();
}
else {
    alert("Hmmm... pour entrer dans ma tête, tu dois accepter de me dire où tu es :- )");
}


//cette fonction sera appellee quand le JSON de la scene sera recu.
var handleScene = function(jsonData){

    console.log("handleScene receive JSON data : ");
    console.log(jsonData);

    currentSceneId = jsonData.id;
    

    //pointe vers les elements HTML
    //var containerElement = document.getElementById("container"); 
    var mainElement = document.getElementById("container"); 
    var imgHeaderElement = document.getElementById("headerImage");
    var titleHeaderElement = document.getElementById("headerTitle");
    var txtElement = document.getElementById("text");  
    var imageElement = document.getElementById("image");
    var slideshowContainerElement = document.getElementById("flexslider");
    var slideshowElement = document.getElementById("slideshow");
    var videoElement = document.getElementById("video");
    var audioElement = document.getElementById("audio");
    var dataElement = document.getElementById("data");	
    var patternElement = document.getElementById("patternForm");
    var patternInputElement = document.getElementById("patternInput");
    var qrElement = document.getElementById("qrForm");
    var qrInputElement = document.getElementById("qrInput");
    var connexionElement = document.getElementById("connexions");
    

    //reset elements
    titleHeaderElement.innerHTML = "";
    imgHeaderElement.innerHTML = "";
    txtElement.innerHTML = "";
    imageElement.innerHTML = "";
    slideshowElement.innerHTML = "";
    videoElement.innerHTML = "";
    audioElement.innerHTML = "";
    dataElement.innerHTML = "";
    patternElement.innerHTML = "";
    //patternInputElement.value="";//
    qrElement.innerHTML = "";
    //qrInputElement.value="";
    connexionElement.innerHTML = "";
    audioElement.innerHTML = "";
    slideshowContainerElement.style.display = "none";
    
    //supprime l'eventListener sur #main
    if (fonctionFullscreen) {

        mainElement.removeEventListener("click", fonctionFullscreen);
        //mainElement.removeClass("active");//
        fonctionFullscreen = undefined;

    }
    
    mainElement.style.backgroundImage = "none";

    //prise en compte des actions (mise a jour des variables de la scène, s'il y en a)
    jxServer.variables.update(jsonData.actions);
    
    // affichage variables utilisateur
    var currentLatitude = jxServer.variables.get("latitude");
    var currentLongitude = jxServer.variables.get("longitude");
    
    if (currentLatitude === 0 && currentLongitude === 0 ){
    
        dataElement.innerHTML = "Latitude : inconnue <br />Longitude : inconnue<br />";
    
    }
    else {
    
        dataElement.innerHTML = "Latitude : " + jxServer.variables.get("latitude");
        dataElement.innerHTML += "<br />Longitude : " + jxServer.variables.get("longitude");
    
    }
    
    dataElement.innerHTML += "<br />Tentatives d'approche : " + jxServer.variables.get("approche");
    
    // if(vue >= 1 ){} affichage progrès utilisateur à faire //

    
    jsonData.medias.forEach(function(item){
        
        
        //arrière-plan  de la scène
        
        if (item.format == "image-background") {
            var imageUrl = "url(" + item.content + ")";
            document.getElementById("container").style.backgroundImage = imageUrl;
            document.getElementById("container").style.backgroundPosition = "center";
            document.getElementById("container").style.backgroundSize = "cover";
        }

        //pictogramme de la scène
        if (item.format == "image-header") {
            var newImageElement = document.createElement("img");
            newImageElement.setAttribute("src", item.content);
            newImageElement.setAttribute("class", "img-color");
            imgHeaderElement.appendChild(newImageElement);
        }

        //titre de la scène
        if (item.format == "title") {      
            titleHeaderElement.innerHTML += "<h1>" + item.content + "</h1>";
        } 

        // textes de la scène
        if (item.format == "text") {
            txtElement.innerHTML += "<p>" + item.content + "</p>";	
        } 
        // images de la scène
        if (item.format == "image") {
            var newImageElement = document.createElement("img");
            newImageElement.setAttribute("src", item.content);
            newImageElement.setAttribute("class", "pure-img");
            imageElement.appendChild(newImageElement);
        }
        // images de la scène
        if (item.format == "slideshow") {
            document.getElementById("flexslider").style.display = "block";
            slideshowElement.innerHTML += "<li> <img src='" + item.content + "' /></li>";           
        }
         // videos de la scène
        if (item.format == "video") {
                var newVideoElement = document.createElement("iframe");
                newVideoElement.setAttribute("src", item.content);
                slideshowContainerElement.style.width = "600";
                slideshowContainerElement.style.height = "auto";
            
                videoElement.appendChild(newVideoElement);          
        }
        
        // audio de la scène
        if (item.format == "audio") {
                audioElement.innerHTML += "<source src='" + item.content + "' />";          
        }
    });

    jsonData.connections.forEach(function(item){
        if (! item.label) {
            return;
        }
        
        if (item.label == "fullscreen-link"){
            
            fonctionFullscreen = function(){

                if (fonctionFullscreen) {

                    mainElement.removeEventListener("click", fonctionFullscreen);
                    //mainElement.removeClass("active");//
                    fonctionFullscreen = undefined;

                }

                jxServer.requestScene(item.childSceneId, handleScene);

            };

            mainElement.addEventListener("click", fonctionFullscreen);
            mainElement.setAttribute("class","container active")
            //mainElement.addClass("active");//
            console.log(mainElement);
            

        } else {
            
            if(item.label == "skip"){
                
                var newConnexionElement = document.createElement("a");
                newConnexionElement.setAttribute("style", "text-decoration:underline;");
                newConnexionElement.innerHTML = item.label;

                newConnexionElement.addEventListener("click", function(){
                    jxServer.requestScene(item.childSceneId, handleScene);
                });

                connexionElement.appendChild(newConnexionElement);
                
            
            
            } else {
                
                if(item.position == "200"){
                    
                    var newConnexionElement = document.createElement("img");
                    newConnexionElement.setAttribute("src", item.label);  
                    newConnexionElement.setAttribute("width", "50"); 
                    newConnexionElement.setAttribute("height", "auto");
                    newConnexionElement.style.cursor = "pointer";
                    
                    if(localStorage.getItem(item.childSceneId)){
                    
                        newConnexionElement.setAttribute("class", "img"); 
                        
                    } else {
                    
                        newConnexionElement.setAttribute("class", "img-color"); 
                    
                    }                    
                    
                    newConnexionElement.addEventListener("click", function(e){
                        localStorage.setItem(item.childSceneId, 'vu');
                        jxServer.requestScene(item.childSceneId, handleScene);                        

                    });

                    connexionElement.appendChild(newConnexionElement);
                
                } else {
                    var newConnexionElement = document.createElement("button");
                    newConnexionElement.setAttribute("class", "btn btn-primary"); 
                    newConnexionElement.setAttribute("style", "margin-right:20px;");
                    newConnexionElement.innerHTML = item.label;

                    newConnexionElement.addEventListener("click", function(){
                        jxServer.requestScene(item.childSceneId, handleScene);
                    });

                    connexionElement.appendChild(newConnexionElement);
                    }

            }
            
        }
    });
    
    //Cette fonction met à jour le localstorage lorsqu'une connexion de type icône (position 200) est activée
    
    
    
    //Cette fonction initialise le slideshow Flexslider

    jQuery('.flexslider').flexslider({
        animation: "slide",
        controlNav: false,
        animationLoop: true,             
        smoothHeight: true,            
        startAt: 0,                    
        slideshow: true,                
        slideshowSpeed: 7000,          
        animationSpeed: 600,       
        initDelay: 600,
        start: function(){
            console.log("Flexslider done!");
        },
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

    var theInput = document.querySelector("#patternInput").value;
    console.log("Form submitted with value : " + theInput);

    //demande au serveur la scene correspondant a la saisie (en passant les fonctions "handlePatternResponse" et "handlePatternFailure")
    jxServer.checkPattern(currentSceneId, theInput, handlePatternResponse, handlePatternFailure);	
});

//******
//c'est ici que ca demarre : lance la requete pour la premiere scene.
//si une scene est trouvee, il appelera la fonction "handleScene"
//******
jxServer.requestScene(currentSceneId, handleScene);
//jxServer.listenImageCode(document.querySelector("#fileInput"), jxServer.redirectToUrl);

//gestion de la validation du formulaire
document.querySelector("#patternSubmit").addEventListener("click", function(){
    var res = confirm("Reset variables + reload ?");

    if (res) {
        jxServer.variables.resetLocal();
        window.location.reload();
    }

});


