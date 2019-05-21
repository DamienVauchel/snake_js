window.onload /* permet de lancer une fenêtre à l'ouverture de la page */= function() 
{
    /* DECLARATION DES VARIABLES ET FONCTIONS */
    var canvas;
    var canvasWidth = 900;
    var canvasHeight = 600;
    var blockSize = 30;
    var ctx; // context
    var delay = 100; // en ms
    var snakee; // le serpent
    var applee; // pomme
    var widthInBlock = canvasWidth/blockSize; // On convertit la largeur en bloc et plus en px
    var heightInBlocks = canvasHeight/blockSize;
    var score;
    
    function init() // Initialisation
    {
        canvas = document.createElement("canvas"); // Canvas permet de dessiner en JavaScript
        canvas.width = canvasWidth;
        canvas.height = canvasHeight;
        canvas.style.border = "1px solid black";
        document.body.appendChild(canvas);

        ctx = canvas.getContext("2d"); 
        
        snakee = new Snake([[6,4], [5,4], [4,4], [3,4], [2,4]], "right"); // On crée un nouvel objet de prototype Snake ayant un body composés de blocks de coordonnées [x,y]
        applee = new Apple([10,10]);
        score = 0;
        refreshCanvas();
    }
    
    function refreshCanvas() 
    {
        snakee.advance();
        
        if(snakee.checkCollision())
        {
             gameOver();   
        } 
        else
        {
            if(snakee.isEatingApple(applee))
            {
                score++;
                snakee.ateApple = true;
                do 
                {
                    applee.setNewPostion();
                }
                while(applee.isOnSnake(snakee))
            }
            ctx.clearRect(0, 0, canvasWidth, canvasHeight); // Efface le rectangle avant de le redessine
            snakee.draw();
            applee.draw();
            drawScore();
            setTimeout(refreshCanvas, delay); // Relance la fonction toutes les "delay" ms    
        }
    }   
        
    function gameOver()
    {
        ctx.save();
        ctx.fillText("Game Over", 5, 15); // Permet d'écrire du texte: texte, x, y
        ctx.fillText("Appuyez sur la touche Espace pour rejouer", 5, 30);
        ctx.restore();
    }
        
    function restart()
    {
        snakee = new Snake([[6,4], [5,4], [4,4], [3,4], [2,4]], "right"); // On crée un nouvel objet de prototype Snake ayant un body composés de blocks de coordonnées [x,y]
        applee = new Apple([10,10]);
        score = 0;
        refreshCanvas();
    }
        
    function drawScore()
    {
        ctx.save();
        ctx.font = "40px serif";
        ctx.fillText(score.toString(), 5, canvasHeight - 5); // Permet d'écrire du texte: texte, x, y
        ctx.restore();
    }
    
    function Snake(body, direction) 
    { // Prototypage d'un serpent
        this.body = body;
        
        this.direction = direction;
        
        this.ateApple = false;
        
        this.draw = function(ctx, blockSize) 
        {
            ctx.save(); // sauvegarde le ctx avant de rentrer dans la fonction
            ctx.fillStyle = "#ff0000";
            for(var i = 0; i < this.body.length; i++) 
            {
                // Permet de dessiner les i blocs composant le body 
                var x = this.body[i][0] * blockSize;
                var y = this.body[i][1] * blockSize;
                ctx.fillRect(x, y, blockSize, blockSize); // rempli un rectangle de x = x, y = y, width = blockSize et height = blockSize       
            };
            ctx.restore(); // restaure le contexte avant les changements (revient avant étape ctx.save())
        };
        
        this.advance = function() 
        { // Faire avancer le serpent
            var nextPosition /* nouvelle position de la tete */ = this.body[0].slice(); // slice copie l'élément
            switch(this.direction) 
            {
                case "left": nextPosition[0] -= 1;
                    break;
                case "right": nextPosition[0] += 1;
                    break;
                case "down": nextPosition[1] += 1;
                    break;
                case "up": nextPosition[1] -= 1; 
                    break;
                default: throw("invalid direction"); // Throw envoie un message d'erreur
            }
            this.body.unshift(nextPosition); // ajoute un élément
            if(!this.ateApple)
            {
                this.body.pop(); // supprime un block
            }
            else
            {
                this.ateApple = false; // pour réinitialiser la fonction
            }
        };
        
        this.setDirection = function(newDirection) 
        {
            var allowedDirections;
            switch(this.direction) 
            {
                case "left":
                case "right": allowedDirections = ["up", "down"];
                    break;
                case "down":
                case "up": allowedDirections = ["left", "right"]; 
                    break;
                default: throw("invalid direction");
            }
            if(allowedDirections.indexOf(newDirection) > -1) 
            {
                this.direction = newDirection;
            }
        };
        
        this.checkCollision = function() // Le serpent est-il en collision?
        {
            var wallCollision = false;
            var snakeCollision = false;
            
            var head = this.body[0]; // On définit la tête du serpent car c'est le premier à se prendre les obstacles
            var rest = this.body.slice(1); // Le reste du corps du serpent
            var snakeX = head[0]; // x de head
            var snakeY = head[1];
            
            var minX = 0; // x minimum sinon mur
            var minY = 0;
            var maxX = widthInBlock - 1; // x maximum sinon mur
            var maxY = heightInBlocks - 1; 
            
            var isNotBetweenHorizontalWalls = snakeX < minX || snakeX > maxX; // Si true = problem
            var isNotBetweenVerticalWalls = snakeY < minY || snakeY > maxY;
            if(isNotBetweenHorizontalWalls || isNotBetweenVerticalWalls)
                {
                    wallCollision = true;
                }
            
            for(var i = 0; i < rest.length; i++) 
            {
                if(snakeX == rest[i][0] && snakeY == rest[i][1]) 
                {
                    snakeCollision = true;
                }
            }
            
            return wallCollision || snakeCollision;
        };
    
    document.onkeydown /* qd user tape une touche du clavier */ = function handleKeyDown(e) {
        var key = e.keyCode;
        var newDirection;
        switch(key) 
        {
            case 37: newDirection = "left";
                break;
            case 38: newDirection = "up";
                break;
            case 39: newDirection = "right";
                break;
            case 40: newDirection = "down";
                break;
            case 32: restart();
                return;
                break;
            default: return; // Ne continue pas la fonction
        };
        snakee.setDirection(newDirection);
    }
    
    /* LANCEMENT DU JEU */
    init(); // on execute init
}