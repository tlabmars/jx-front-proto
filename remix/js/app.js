
//scene en cours, avec la valeur de depart.
var currentSceneId = 213;//
//var currentSceneId = 208;//
//preparation de jxServer
var jxServer = new JX.Server();

//initialisation des variables du jeu. 
jxServer.variables.init("latitude", 0);
jxServer.variables.init("longitude", 0);
jxServer.variables.init("approche", 0);
jxServer.variables.init("vue", 0);
jxServer.variables.init("signe1", 0);
jxServer.variables.init("signe2", 0);
jxServer.variables.init("signe3", 0);


//initialisation variable pour stockage fonction fullscreen
var fonctionFullscreen;
var imageBackground = 0;
var colorBackground = 0;
var audioPlaying = 0;
var patternFormDisplayed = 0;
//var qrFormDisplayed = 0;//


document.getElementById("qrForm").style.display = "none";
document.getElementById("patternForm").style.display = "none";

console.log("Here we go again")

//tente de lire les valeurs du localstorage
jxServer.variables.readLocal();

//verifie si la géolocalisation est supportée / activée
if("geolocation" in navigator) {
    
    jxServer.handleLatitudeLongitude();
}
else {
    alert("Hmmm... pour entrer dans ma tête, tu dois accepter de me dire où tu es :- )");
}

// active détection QR COde
// jxServer.listenImageCode(document.getElementById("qrInput"), jxServer.redirectToUrl);

//cette fonction sera appellee quand le JSON de la scene sera recu.
var handleScene = function(jsonData){

    console.log("handleScene receive JSON data : ");
    console.log(jsonData);

    currentSceneId = jsonData.id;
    

    //pointe vers les elements HTML
    var mainElement = document.getElementById("container"); 
    var openbtnElement = document.getElementById("openBtn"); 
    var imgHeaderElement = document.getElementById("headerImage");
    var titleHeaderElement = document.getElementById("headerTitle");
    var contentElement = document.getElementById("content");
    var txtElement = document.getElementById("text");  
    var imageElement = document.getElementById("image");
    var slideshowContainerElement = document.getElementById("flexslider");
    var slideshowElement = document.getElementById("slideshow");
    var videoElement = document.getElementById("video");
    var audioElement = document.getElementById("audio");
    /* var dataElement = document.getElementById("data"); */	
    var patternElement = document.getElementById("patternForm");
    var patternInputElement = document.getElementById("patternInput");
    var patternSubmitElement = document.getElementById("patternSubmit");
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
    /* dataElement.innerHTML = ""; */
    patternInputElement.value="";
    //qrInputElement.value="";//
    connexionElement.innerHTML = "";
    slideshowContainerElement.style.display = "none";
    
    //supprime l'eventListener sur #main
    if (fonctionFullscreen) {

        mainElement.removeEventListener("click", fonctionFullscreen);
        //mainElement.removeClass("active");//
        fonctionFullscreen = undefined;

    }
    
    //pause audio
    if(audioPlaying >= 1){
            audioElement.pause();
            console.log("Audio paused")
        }
           
    //rétablit l'image de fond sur #main 
    if (imageBackground >= 1) {
        console.log("Image background rétablie");
        mainElement.style.backgroundImage = "url(img/wave.png)";
        mainElement.style.backgroundRepeat = "no-repeat";
        mainElement.style.backgroundPosition = "35% 10";
        mainElement.style.backgroundSize = "";

    }
    
    //rétablit la couleur de fond sur #main 
    if (colorBackground >= 1) {
        mainElement.style.backgroundColor = "white";
        openbtnElement.style.color = "blue";
        mainElement.style.color = "blue";
        console.log("Couleur background rétablie");
    }
    
    
     //masque le formulaire de saisie texte
    if (patternFormDisplayed >= 1) {
            patternForm.style.display = "none";
    }
    
    // affiche ou masque le formulaire pour envoi photo QRcode
    
   // if (jsonData.data == "qrcode"){
    //    document.getElementById("qrcode-form").style.display = "block";
    //    qrFormDisplayed += 1;

    // }
    // if (qrFormDisplayed >= 1) {
    //    patternForm.style.display = "none";
    // }  

    //prise en compte des actions (mise a jour des variables de la scène, s'il y en a)
    jxServer.variables.update(jsonData.actions);

    // affichage medias associés à la scène
    jsonData.medias.forEach(function(item){
        
        
        //arrière-plan  de la scène
        
         if (item.format == "image-cover") {
            var imageUrl = "url(" + item.content + ")";
            mainElement.style.backgroundImage = imageUrl;
            mainElement.style.backgroundPosition = "center";
            mainElement.style.backgroundSize = "cover"; 
            imageBackground += 1;
             console.log("Image background changée : imageBackground =" + imageBackground)
        }
        
        if (item.format == "image-background") {
            var imageUrl = "url(" + item.content + ")";
            mainElement.style.backgroundImage = imageUrl;
            mainElement.style.backgroundRepeat = "no-repeat";
            mainElement.style.backgroundSize = "";
            
            if(currentSceneId == 214 || currentSceneId == 215){
                
                mainElement.style.backgroundPosition = "40% 30%";
            
            } else {
                
                mainElement.style.backgroundPosition = "80% 70%";
            }
            imageBackground += 1;
            console.log("Image background changée : imageBackground =" + imageBackground)

        } 
        
        if (item.format == "color-background") {
            mainElement.style.backgroundColor = item.content;
            mainElement.style.backgroundImage = "none";
            openbtnElement.style.color = "white";
            mainElement.style.color = "white";
            
            colorBackground += 1;
             console.log("Couleur background changée : imageBackground =" + colorBackground)
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
        
        if (item.format == "title-fullscreen") {      
            titleHeaderElement.innerHTML += "<h1 style='text-transform: none; font-size:200%; font-weight:700; position:absolute; top:20%; right:20%;'>" + item.content + "</h1>";

        }

        // textes de la scène
        if (item.format == "text") {
            txtElement.innerHTML += "<p>" + item.content + "</p>";	
        }
        if (item.format == "text-fullscreen") {
            txtElement.innerHTML += "<p style='font-size:120%; font-weight:700; position:absolute; bottom:10%; left:10%;width:60%;text-align:left;'>" + item.content + "</p>";
        } 
        
        // images de la scène
        if (item.format == "image") {
            var newImageElement = document.createElement("img");
            newImageElement.setAttribute("src", item.content);
            newImageElement.setAttribute("class", "pure-img");
            imageElement.appendChild(newImageElement);
        }
        // slideshow de la scène
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
                audioPlaying = 1;
                console.log("Audio playing : audioPlaying =" + audioPlaying)
            
        }
    });

    // Connexions
    jsonData.connections.forEach(function(item){
        // Conditionnées par mot(s) clé(s) : pattern
        if (! item.label) {
            patternForm.style.display = "inline";
            patternFormDisplayed += 1;
            return;
        }
        
        // lien sur tout l'écran (container), compatible avec connexions standard
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
            mainElement.setAttribute("class","container active");
            

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
                
                // lien sur image avec détection liens visités
                
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
                    
                    newConnexionElement.addEventListener("click", function(){
                        localStorage.setItem(item.childSceneId, 'vu');
                        jxServer.requestScene(item.childSceneId, handleScene);                        

                    });

                    connexionElement.appendChild(newConnexionElement);
                
                } else {
                    
                    if(item.label == "back"){
                        
                        var newConnexionElement = document.createElement("a");
                        newConnexionElement.setAttribute("style", "font-family:'Karla', sans-serif; color:darkgrey; font-size:90%;text-decoration:none;");
                        newConnexionElement.innerHTML = "< Revenir sur mes pas";

                        newConnexionElement.addEventListener("click", function(){
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
            /* mainElement.resize(); */
            
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


