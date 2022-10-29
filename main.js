const canvas = document.getElementById("myCanvas")
// we need canvas to mimic a road, like a lane
canvas.width = 200;

const ctx = canvas.getContext("2d");
// let's create our road
const road = new Road(canvas.width/2, canvas.width*0.9);
// car is just a square to plot in the screen
console.log(road.getLaneCenter(2));
const car = new Car(road.getLaneCenter(1), 100, 30, 60);
car.draw(ctx);

animate();

function animate(){
    car.update();
    // should update canvas on any frame update
    canvas.height = window.innerHeight;
    road.draw(ctx);
    car.draw(ctx);
    requestAnimationFrame(animate)
}