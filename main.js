const canvas = document.getElementById("myCanvas")
// we need canvas to mimic a road, like a lane
canvas.width = 200;

const ctx = canvas.getContext("2d");
// let's create our road
const road = new Road(canvas.width/2, canvas.width*0.9);
// car is just a square to plot in the screen
const car = new Car(road.getLaneCenter(1), 100, 30, 60);
car.draw(ctx);

animate();

function animate(){
    car.update(road.borders );
    // should update canvas on any frame update
    canvas.height = window.innerHeight;

    ctx.save();
    ctx.translate(0, -car.y+0.7*canvas.height);
    road.draw(ctx);
    car.draw(ctx);

    ctx.restore()
    requestAnimationFrame(animate)
}