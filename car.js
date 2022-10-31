class Car{
    constructor(x, y, width, height, controlType, maxSpeed=3){
        this.x=x;
        this.y=y;
        this.width=width;
        this.height=height;
        this.angle=0;
        this.speed=0;
        this.acceleration=0.2;
        // we need to add some friction
        // because car in not able to be controlled
        this.maxSpeed=maxSpeed;
        this.friction=0.05;
        // this gonna generate the mess of points to represent the car
        this.polygon=this.#createPolygon()
        if (controlType!="DUMMY"){
            this.sensor= new Sensor(this);
            this.brain = new NeuralNetwork([[this.sensor.rayCount], 6, 4])
        }
        this.controls=new Controls(controlType);

        // stores the state of car -- damaged or not
        this.damaged = false;
    }

    draw(ctx, color){
        ctx.beginPath();
        // now we draw the polygon instead of a static rectangular
        // previously we used to plot a static rectangular and translate
        // the road ... 
        ctx.moveTo(this.polygon[0].x, this.polygon[0].y);
        for (let i=1; i < this.polygon.length; i++){
            ctx.lineTo(this.polygon[i].x, this.polygon[i].y);
        }
        // check if the car is damaged to update the fill style
        if (this.damaged){
            ctx.fillStyle="gray"
        }else{
            ctx.fillStyle=color
        }
        ctx.fill()
        if (this.sensor){
            this.sensor.draw(ctx);
        }
    }

    update(roadBorders, traffic){
        if (!this.damaged){
            this.#move()
            this.polygon = this.#createPolygon()
            this.damaged = this.#assessDamage(roadBorders, traffic);
        }
        if (this.sensor){
            this.sensor.update(roadBorders, traffic)
            const offsets=[]
            // TODO: this one should work as an one-liner but when it returns undefined ... 
            for (let i; i < this.sensor.readings; i++){
                if (this.sensor.readings[i] !== "undefined" || this.height.readings){
                    offsets.push(1-this.sensor.readings[i])
                }else{
                    offsets.push(0)
                }
            }
            const outputs = NeuralNetwork.feedForward(offsets, this.brain)
            console.log(outputs)
        }
        
    }

    #assessDamage(roadBoarders, traffic){
        for (let i=0; i<roadBoarders.length; i++){
            if (polysIntersect(this.polygon, roadBoarders[i])){
                return true;
        }
        }

        for (let i=0; i<traffic.length; i++){
            if (polysIntersect(this.polygon, traffic[i].polygon)){
                return true;
            }
        }

        return false;
    }

    // determines the exact position of the four corners of the
    // car. We need that method to get the four corners relatively
    // to the center of the car and the rotation angle. This is 
    // because we are not aware of what is the rotation angle every time,
    // since we do update, store and restore context... but even we did not
    // do something like that, this is the way to go.
    #createPolygon(){
        const points = [];
        const rad = Math.hypot(this.width, this.height)/2;
        const alpha=Math.atan2(this.width, this.height);
        points.push({
            x: this.x-Math.sin(this.angle-alpha)*rad,
            y: this.y-Math.cos(this.angle-alpha)*rad
        });
        points.push({
            x: this.x-Math.sin(this.angle+alpha)*rad,
            y: this.y-Math.cos(this.angle+alpha)*rad
        });
        points.push({
            x: this.x-Math.sin(Math.PI+this.angle-alpha)*rad,
            y: this.y-Math.cos(Math.PI+this.angle-alpha)*rad
        });
        points.push({
            x: this.x-Math.sin(Math.PI+this.angle+alpha)*rad,
            y: this.y-Math.cos(Math.PI+this.angle+alpha)*rad
        });
        return points;
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