function BallCollision(canvas, noOfBalls = NOOFBALLS, width, height){
    this.canvas = canvas;
    this.noOfBalls= noOfBalls;
    this.ctx = this.canvas.getContext('2d');
    this.canvas.width = width;
    this.canvas.height = height;
    this.ballCollection = [];

    this.init = () => {
        this.generateRandomBalls();
        this.refreshScreen();
    };

    this.generateRandomBalls = () => {
        for(let i = 0; i < this.noOfBalls; i++){
            let radius = getRandom(3,10);
            let x = getRandom(radius,parseInt(this.canvas.width));
            let y = getRandom(radius,parseInt(this.canvas.height));
            let skip;
            this.ballCollection.forEach(elem=>{
                let dist = getDistance({'x':x, 'y':y},elem)
                let rad = radius + elem.radius;
                if (dist< rad){
                    skip = true;
                    i--;
                }
            });
            if(skip){continue;};
            let dx = getRandomPositiveOrNegative() * getRandom(0.5,4);
            let dy = getRandomPositiveOrNegative() * getRandom(0.5,4);
            let color = COLORS[Math.floor(getRandom(0,COLORS.length-1))];
            console.log(color);
            let id = i;
            const ball = new Ball(this.ctx,radius, x, y, dx, dy, color, id);
            this.ballCollection[i] = ball;
        }
    }

    this.refreshScreen = () => {
        this.ctx.clearRect(0,0,this.canvas.width,this.canvas.height);
        for(let i = 0; i< this.ballCollection.length; i++){
           this.ballCollection[i].update();
            this.ballCollection[i].checkBallCollision(this.ballCollection);
        }
        window.requestAnimationFrame(this.refreshScreen);
    };

    this.init();
};

function Ball(ctx,radius, x, y, dx, dy, color, id){
    this.ctx = ctx;
    this.x = x;
    this.y = y;
    this.radius = radius;
    this.dx = dx;
    this.dy = dy;
    this.color = color;
    this.id = id;

    this.drawBall = () => {
        this.ctx.fillStyle = this.color;
        this.ctx.beginPath();
        this.ctx.arc(this.x, this.y, this.radius, 0, 2 * Math.PI);
        this.ctx.fill();
        this.ctx.closePath();
    };

    this.moveBall = () => {
        this.x += this.dx;
        this.y += this.dy;
    };

    this.checkWallCollision = () => {
        if(this.x - this.radius < 0){
            this.dx *= -1;
            this.x = this.radius;
        }else if(this.x + this.radius > this.ctx.canvas.width){
             this.dx *= -1;
             this.x = this.ctx.canvas.width - this.radius;
        }
        else if(this.y - this.radius < 0){
            this.dy *= -1;
            this.y = this.radius;
        }else if(this.y + this.radius > this.ctx.canvas.height){
            this.dy *= -1;
            this.y = this.ctx.canvas.height - this.radius;
        };
    };

    this.checkBallCollision = (ballCollection) => {
        for(let ball in ballCollection){
            ball
            if(ballCollection[ball].id !== this.id){
                
                let dist = getDistance(this,ballCollection[ball])
                let rad = this.radius + ballCollection[ball].radius;
                if(rad > dist){
                    let tempdx = this.dx;
                    let tempdy = this.dy;
                    this.dx = ballCollection[ball].dx;
                    this.dy = ballCollection[ball].dy;
                    ballCollection[ball].dx = tempdx;
                    ballCollection[ball].dy = tempdy;

                    if(this.x < ballCollection[ball].x){
                        this.x -= 1;
                    }else{
                        this.x += 1;
                    }
                    if(this.y < ballCollection[ball].y){
                        this.y -= 1;
                    }else{
                        this.y += 1;
                    }
                    
                };
            };
        };
    };

    this.update = () => {
        this.drawBall();
        this.moveBall();
        this.checkWallCollision();
    };

};