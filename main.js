const canvas = document.getElementById("myCanvas")
// we need canvas to mimic a road, like a lane
canvas.width = 200;

const ctx = canvas.getContext("2d");
// car is just a square to plot in the screen
const car = new Car(100, 100, 30, 60);
car.draw(ctx);

animate();

function animate(){
    car.update();
    // should update canvas on any frame update
    canvas.height = window.innerHeight;
    car.draw(ctx);
    requestAnimationFrame(animate)
}