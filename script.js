var snake;
var apple;
var snakeGame;

window.onload = function() 
{
    snakeGame = new SnakeGame(900, 600, 30, 100);
    var snake = new Snake([[6,4], [5,4], [4,4], [3,4], [2,4]], "right");
    var apple = new Apple([10,10]);
    
    snakeGame.init(snake, apple);
}

document.onkeydown = function handleKeyDown(e) 
{
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
        case 37 + 38: return;
            break;
        case 38 + 39: return;
            break;
        case 39 + 40: return;
            break;
        case 40 + 37: return;
            break;
        case 39 + 37: return;
            break;
        case 40 + 38: return;
            break;
        case 32: var snake = new Snake([[6,4], [5,4], [4,4], [3,4], [2,4]], "right");
                 var apple = new Apple([10,10]);
                 snakeGame.init(snake, apple);
            return;
            break;
        default: return;
    }
    snakeGame.snake.setDirection(newDirection);
}
    
/* PROTOTYPES */
function SnakeGame(canvasWidth, canvasHeight, blockSize, delay)
{
    // Prototypage du jeu
    /* PROPRIETES DE L'OBJET PROTOTYPE */
    this.canvas = document.createElement("canvas");
    this.canvas.width = canvasWidth;
    this.canvas.height = canvasHeight;
    this.canvas.style.border = "30px solid grey";
    this.canvas.style.margin = "50px auto";
    this.canvas.style.display = "block";
    this.canvas.style.background = "#ddd";
    document.body.appendChild(this.canvas);
    this.ctx = this.canvas.getContext("2d"); 
    this.blockSize = blockSize;
    this.delay = delay; 
    this.snake; 
    this.apple; 
    this.widthInBlocks = canvasWidth/blockSize;
    this.heightInBlocks = canvasHeight/blockSize;
    this.score;
    
    /* METHODES DE L'OBJET PROTOTYPE */
    this.init = function(snake, apple) // Initialisation en fonction du snake et du apple
    {
        this.snake = snake;
        this.apple = apple;
        this.score = 0;
        clearTimeout(timeout); // On réinitialise le timeout, variable globale
        refreshCanvas();
    }
    
    this.checkCollision = function() // Le serpent est-il en collision?
    {
            var wallCollision = false;
            var snakeCollision = false;
            
            var head = this.snake.body[0];
            var rest = this.snake.body.slice(1);
            var snakeX = head[0];
            var snakeY = head[1];
            
            var minX = 0;
            var minY = 0;
            var maxX = this.widthInBlocks - 1; 
            var maxY = this.heightInBlocks - 1; 
            
            var isNotBetweenHorizontalWalls = snakeX < minX || snakeX > maxX; 
            var isNotBetweenVerticalWalls = snakeY < minY || snakeY > maxY;
            if(isNotBetweenHorizontalWalls || isNotBetweenVerticalWalls)
            {
                wallCollision = true;
            }
            
            for(var i = 0; i < rest.length; i++) 
            {
                if(snakeX === rest[i][0] && snakeY === rest[i][1]) 
                {
                    snakeCollision = true;
                }
            }
            return wallCollision || snakeCollision;
    };
    
    this.gameOver = function()
    {
        this.ctx.save();
        this.ctx.font = "bold 70px sans-serif";
        this.ctx.fillStyle = "#000";
        this.ctx.textAlign = "center";
        this.ctx.textBaseline = "middle";
        this.ctx.strokeStyle = "white"; // Style du contour du texte
        this.ctx.lineWidth = "5px";
        var centerX = this.canvas.width / 2;
        var centerY = this.canvas.height / 2;
        this.ctx.strokeText("Game Over", centerX, centerY - 180);
        this.ctx.fillText("Game Over", centerX, centerY - 180);
        
        this.ctx.font = "bold 30px sans-serif";
        this.ctx.fillStyle = "#000";
        this.ctx.textAlign = "center";
        this.ctx.textBaseline = "middle";
        this.ctx.strokeStyle = "white"; // Style du contour du texte
        this.ctx.lineWidth = "5px";
        var centerX = this.canvas.width / 2;
        var centerY = this.canvas.height / 2;
        this.ctx.strokeText("Appuyez sur la touche Espace pour rejouer", centerX, centerY + 180);
        this.ctx.fillText("Appuyez sur la touche Espace pour rejouer", centerX, centerY + 180);
        this.ctx.restore();
    };
    
    this.drawScore = function()
    {
        this.ctx.save();
        this.ctx.font = "bold 200px sans-serif";
        this.ctx.fillStyle = "grey";
        this.ctx.textAlign = "center";
        this.ctx.textBaseline = "middle";
        var centerX = this.canvas.width / 2;
        var centerY = this.canvas.height / 2;
        this.ctx.fillText(this.score.toString(), centerX, this.canvas.height - centerY); 
        this.ctx.restore();
    }
    
    /* VARIABLES DE L'OBJET PROTOTYPE */
    var instance = this; // On définit une variable nommée instance qui représente this: l'instance du jeu que l'on crée.
    var timeout;
    
    var refreshCanvas = function() // On la met en var et non en methode car elle utilise la fonction setTimeOut qui est une fonction applicable uniquement dans window. Donc si on avait voulu l'appeler avec this.refreshCanvas() elle n'aurait pas fonctionné car le this aurait fait référence à window et non à snake 
    {
        instance.snake.advance(); // On utilise ici instance pour être certain qu'on soit dans le this de SnakeGame car la variable y a été déclarée 
        
        if(instance.checkCollision())
        {
             instance.gameOver(); 
        } 
        else
        {
            if(instance.snake.isEatingApple(instance.apple))
            {
                instance.score++;
                instance.snake.ateApple = true;
                do 
                {
                    instance.apple.setNewPostion(instance.widthInBlocks, instance.heightInBlocks);
                }
                while(instance.apple.isOnSnake(instance.snake))
            }
            instance.ctx.clearRect(0, 0, instance.canvas.width, instance.canvas.height);
            instance.drawScore();
            instance.snake.draw(instance.ctx, instance.blockSize);
            instance.apple.draw(instance.ctx, instance.blockSize);
            timeout = setTimeout(refreshCanvas, delay);
        }
    }    
};
    
function Snake(body, direction) 
{ // Prototypage d'un serpent
    this.body = body;
        
    this.direction = direction;
        
    this.ateApple = false;
        
    this.draw = function(ctx, blockSize) 
    {
        ctx.save();
        ctx.fillStyle = "#ff0000";
        for(var i = 0; i < this.body.length; i++) 
        {
            // Permet de dessiner les i blocs composant le body 
            var x = this.body[i][0] * blockSize;
            var y = this.body[i][1] * blockSize;
            ctx.fillRect(x, y, blockSize, blockSize); // rempli un rectangle de x = x, y = y, width = blockSize et height = blockSize       
        };
        ctx.restore();
    };
    
    this.advance = function() 
    { // Faire avancer le serpent
        var nextPosition = this.body[0].slice(); 
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
            default: throw("invalid direction");
        }
        this.body.unshift(nextPosition);
        if(!this.ateApple)
        {
            this.body.pop();
        }
        else
        {
            this.ateApple = false;
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
    }
    
    this.isEatingApple = function(appleToEat)
    {
        var head = this.body[0];  
        if(head[0] == appleToEat.position[0] && head[1] == appleToEat.position[1])
        {
            return true;
        }
        else
        {
            return false;
        }
    }    
};
    
function Apple(position)
{
    this.position = position;
        
    this.draw = function(ctx, blockSize)
    {
        ctx.save();
        ctx.fillStyle = "#33cc33";
        ctx.beginPath();
            
        var radius = blockSize / 2; 
        var x = this.position[0] * blockSize + radius; 
        var y = this.position[1] * blockSize + radius;
            
        ctx.arc(x, y, radius, 0, Math.PI * 2, true); 
        ctx.fill();
            
        ctx.restore();
    };
        
    this.setNewPostion = function(widthInBlocks, heightInBlocks)
    {
        var newX = Math.round(Math.random() * (widthInBlocks - 1));
        var newY = Math.round(Math.random() * (heightInBlocks - 1));
        this.position = [newX,newY];
    };
        
    this.isOnSnake = function(snakeToCheck)
    {
        var isOnSnake = false;
        for(var i = 0; i < snakeToCheck.body.length; i++)
        {
            if(this.position[0] == snakeToCheck.body[i][0] && this.position[1] == snakeToCheck.body[i][1])
            {
                isOnSnake = true;
            }
        }
        return isOnSnake;
    };
}