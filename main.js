const carCanvas = document.getElementById("carCanvas")
// we need canvas to mimic a road, like a lane
carCanvas.width = 200;
const carCtx = carCanvas.getContext("2d");

const networkCanvas = document.getElementById("networkCanvas")
// we need canvas to mimic a road, like a lane
networkCanvas.width = 300;
const networkCtx = networkCanvas.getContext("2d");

// let's create our road
const road = new Road(carCanvas.width/2, carCanvas.width*0.9);
// car is just a square to plot in the screen
const N = 100
const cars = generateCars(N);
let bestCar=cars[0]; // the car performed the best to the experiment of N cars
// load the bestBrain from local storage if it exists
if (localStorage.getItem("bestBrain")){
    bestCar.brain=JSON.parse(
        localStorage.getItem("bestBrain")
    )
}

// let's add a couple of cars here ... 
traffic = [
    // new Car(road.getLaneCenter(0), 50, 30, 70, "DUMMY", maxSpeed=2),
    new Car(road.getLaneCenter(1), -100, 30, 70, "DUMMY", maxSpeed=2),
    new Car(road.getLaneCenter(0), -300, 30, 70, "DUMMY", maxSpeed=2),
    new Car(road.getLaneCenter(2), -300, 30, 70, "DUMMY", maxSpeed=2)
]

animate();

function save(){
    localStorage.setItem(
        "bestBrain",
        JSON.stringify(bestCar.brain)
    )
}
function discard(){
    localStorage.removeItem("bestBrain")
}

// let's create a car factory for AI cars
function generateCars(N){
    const cars=[]
    for (let i=0; i<N; i++){
        cars.push(new Car(road.getLaneCenter(1), 100, 30, 60, "AI", maxSpeed=3))
    }
    return cars;
}

function animate(time){
    for (let i=0; i<traffic.length; i++){
        traffic[i].update(road.borders, [])
    }
    for (let i=0; i<N; i++){
        cars[i].update(road.borders, traffic);
    }
    // let's get a reference to the car that made it longer 
    // to the correct direction
    bestCar = cars.find(
        c=>c.y==Math.min(
            ...cars.map(c=>c.y)
        )
    )
    // should update canvas on any frame update
    carCanvas.height = window.innerHeight;
    networkCanvas.height=window.innerHeight;

    carCtx.save();
    // translate canvas for just one random car so as to be animated...
    carCtx.translate(0, -bestCar.y+0.7*carCanvas.height);
    road.draw(carCtx);
    // should draw all traffic asw well
    for (let i=0; i<traffic.length; i++){
        traffic[i].draw(carCtx, "red");
    }
    carCtx.globalAlpha=0.1;
    for (let i=0; i<N; i++){
        cars[i].draw(carCtx, "blue");
    }
    carCtx.globalAlpha=1;
    bestCar.draw(carCtx, "blue", true)
    carCtx.restore()
    networkCtx.lineDashOffset=-time/50;
    Visualizer.drawNetwork(networkCtx, cars[0].brain);
    // this is going to call animate with time optional param
    requestAnimationFrame(animate) 
}