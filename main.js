const carCanvas = document.getElementById("carCanvas")
// we need canvas to mimic a road, like a lane
carCanvas.width = 200;
const carCtx = carCanvas.getContext("2d");

const networkCanvas = document.getElementById("networkCanvas")
// we need canvas to mimic a road, like a lane
networkCanvas.width = 300;
const networkContext = networkCanvas.getContext("2d");

// let's create our road
const road = new Road(carCanvas.width/2, carCanvas.width*0.9);
// car is just a square to plot in the screen
const car = new Car(road.getLaneCenter(1), 100, 30, 60, "AI", maxSpeed=3);
car.draw(carCtx);

// let's add a couple of cars here ... 
traffic = [
    new Car(road.getLaneCenter(0), 50, 30, 70, "DUMMY", maxSpeed=2),
    new Car(road.getLaneCenter(1), 30, 30, 70, "DUMMY", maxSpeed=2)
]

animate();

function animate(){
    for (let i=0; i<traffic.length; i++){
        traffic[i].update(road.borders, [])
    }
    car.update(road.borders, traffic);
    // should update canvas on any frame update
    carCanvas.height = window.innerHeight;
    networkCanvas.height=window.innerHeight;

    carCtx.save();
    carCtx.translate(0, -car.y+0.7*carCanvas.height);
    road.draw(carCtx);
    // should draw all traffic asw well
    for (let i=0; i<traffic.length; i++){
        traffic[i].draw(carCtx, "red");
    }

    car.draw(carCtx, "blue");

    carCtx.restore()
    
    requestAnimationFrame(animate)
}