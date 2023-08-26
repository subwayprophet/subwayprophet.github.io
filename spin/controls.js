let movementSpeed = 0.1;

//listen for keyboard events
document.addEventListener("keydown", function (e) {
    switch(e.key) {
        case "ArrowUp":
            // balloon.balloon.position.y += movementSpeed;
            camera.position.z -= movementSpeed;
            break;
        case "ArrowDown":
            // balloon.balloon.position.y -= movementSpeed;
            camera.position.z += movementSpeed;
            break;
        case "ArrowLeft":
            // balloon.balloon.position.x -= movementSpeed;
            camera.position.x -= movementSpeed;

            break;
        case "ArrowRight":
            // balloon.balloon.position.x += movementSpeed;
            camera.position.x += movementSpeed;
            break;
        case " ":
            //make a light flash real bright
            spotLight.power = spotLight.power * -1;
            explosion.init(new THREE.Vector3(0.1,0.1,0.1),200);
            break;
    }
});

//listen for mouse events
let prevMouseX = 0;
let prevMouseY = 0;
document.addEventListener("mousemove", function (e) {
    const mouseX = e.clientX;
    const mouseY = e.clientY;

    // Do something with mouseX and mouseY
    // console.log(`Mouse position: x = ${mouseX}, y = ${mouseY}`);

    //rotate the camera based on mouse movement if the mouse is down
    if(e.buttons === 1) {
        camera.rotation.y += (mouseX - prevMouseX) * 0.001;
        camera.rotation.x += (mouseY - prevMouseY) * 0.001;
    }
    prevMouseX = mouseX;
    prevMouseY = mouseY;

});