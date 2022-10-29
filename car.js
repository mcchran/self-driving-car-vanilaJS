class Car{
    constructor(x, y, width, height){
        this.x=x;
        this.y=y;
        this.width=width;
        this.height=height;
        this.angle=0;
        this.speed=0;
        this.acceleration=0.2;
        // we need to add some friction
        // because car in not able to be controlled
        this.maxSpeed=3;
        this.friction=0.05;
 
        this.controls=new Controls();
    }

    draw(ctx){
        ctx.save();
        // so instead of drawing the rectangle to the 
        // original coordinates we do just update the 
        //overall coordinate system to
        // start from x, y -- the care coords
        ctx.translate(this.x, this.y)
        // to be rotated by the car angle
        ctx.rotate(-this.angle);
        ctx.beginPath();
        ctx.rect(
            // so we should drawing the car "outside"
            // the newly translated coord system 
            -this.width/2,
            -this.height/2,
            this.width,
            this.height
        );
        ctx.fill();
        // after drawing this one let's restore to the previous state
        // no context translation or rotation anymore
        ctx.restore();
    }

    update(){
        this.#move()
    }

    #move(){
        if (this.controls.forward){
            this.speed-=this.acceleration
        }
        if (this.controls.reverse){
            this.speed+=this.acceleration
        }
        // limit the speed before apply the update
        if (this.speed>this.maxSpeed/2){
            this.speed=this.maxSpeed/2
        }
        if (this.speed<-this.maxSpeed){
            this.speed=-this.maxSpeed
        }
        // now let's decrease the speed by friction
        if (this.speed>0){
            this.speed -=this.friction
        }
        if (this.speed<0){
            this.speed += this.friction
        }
        if (Math.abs(this.speed)<this.friction){
            this.speed=0
        }

        // to got proper behavior while reversing
        // we need to flip controls 
        if (this.speed!=0){
            const flip=this.speed<0?1:-1;
            if (this.controls.left){
                this.angle+=0.03*flip;
            }
            if (this.controls.right){
                this.angle-=0.03*flip;
            }
        }

        // let's define how this is going to move... 
        this.x+=Math.sin(this.angle)*this.speed;
        this.y+=Math.cos(this.angle)*this.speed;
    }
}