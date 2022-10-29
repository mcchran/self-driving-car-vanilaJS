class Road{
    // x should be the "center" of the road!
    constructor(x,width,laneCount=3){
        this.x=x;
        this.width=width;
        this.laneCount=laneCount;

        this.left=x-width/2;
        this.right=x+width/2;
        
        const infinity=1000000;
        // keep in mind that y spread downwards 
        // to the screen
        this.top=-infinity;
        this.bottom=infinity;
    }

    // getLaneCenter returns the center of the laneIndex lane
    getLaneCenter(laneIndex){
        laneIndex = Math.min(laneIndex, this.laneCount-1)
        const laneWidth=this.width/this.laneCount;
        return this.left+laneWidth/2+ laneIndex * laneWidth;
    }

    draw(ctx){
        ctx.lineWidth=5;
        ctx.strokeStye="white";
        
        for(let i=0;i<=this.laneCount;i++){
            const x = lerp(
                this.left,
                this.right,
                i/this.laneCount
            )
            // so what we need here is the intermediate lanes to be
            // formatted into a dashed fashion
            if (i>0 && i<this.laneCount){
                ctx.setLineDash([20, 20]);
            }else{ 
                // no dashes 
                ctx.setLineDash([]);
            }
            // let's plot the left line
            ctx.beginPath();
            ctx.moveTo(x,this.top);
            ctx.lineTo(x,this.bottom);
            ctx.stroke();
        }
    }
}
