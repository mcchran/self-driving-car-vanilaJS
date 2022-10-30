// this is the linear interpolation function
// returns the starting point of the t-th segment
function lerp(A, B, t){
    return A+(B-A)*t
}

// return the intersection of line parts AB and CD
function getIntersection(A,B,C,D){
    const tTop = (D.x-C.x)*(A.y-C.y)-(D.y-C.y)*(A.x-C.x);
    const uTop = (C.y-A.y)*(A.x-B.x)-(C.x-A.x)*(A.y-B.y);
    const bottom = (D.y-C.y)*(B.x-A.x)-(D.x-C.x)*(B.y-A.y);
    if (bottom!=0){
        const t=tTop/bottom;
        const u=uTop/bottom;
        if (t>=0 && t<=1 && u>=0 && u<=1){
            const intersect =  {
                x: lerp(A.x, B.x, t),
                y: lerp(A.y, B.y, t),
                offset: t
            }
            return intersect
        }
    }
    return null
}

// some tests are following ... 
function getIntersection_tests(){
    A = {x: 100, y:-1}
    B = {x: 70, y:10}
    C = {x: 100, y:-100}
    D = {x:100, y:100}
}