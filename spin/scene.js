//prevent the page from scrolling
document.body.style.overflow = 'hidden';

// Set up the scene, camera, and renderer
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
const renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

// Create a torus and add it to the scene with shading material
const geometry = new THREE.TorusGeometry(1, 0.1, 16, 100); // Using TorusGeometry
const material = new THREE.MeshPhongMaterial({ color: 0x0000cc }); // Using MeshStandardMaterial
const torus = new THREE.Mesh(geometry, material);
scene.add(torus);

//create a cube and add it to the scene with basic material
const geometry2 = new THREE.BoxGeometry(1, 1, 1); // Using BoxGeometry
const material2 = new THREE.MeshStandardMaterial({ color: 'darkgreen' }); // Using MeshBasicMaterial
const cube = new THREE.Mesh(geometry2, material2);
scene.add(cube);

//reference cube: don't move!
const geometry3 = new THREE.BoxGeometry(1, 1, 1); // Using BoxGeometry
const material3 = new THREE.MeshStandardMaterial({ color: 'red' }); // Using MeshBasicMaterial
const cube2 = new THREE.Mesh(geometry3, material3);
cube2.position.x = 3;
scene.add(cube2);

//add a balloon
const balloon = new Balloon();
scene.add(balloon.balloon);
scene.add(balloon.tail)

// Position the camera
camera.position.z = 5;

//basic explosion??
let explosion = new Explosion();

// Add a light to the scene
const light = new THREE.DirectionalLight(0xffffff, 1); // White light from a specific direction
light.position.set(10, 10, 10);
scene.add(light);

//add a red light to the scene
const pointLight = new THREE.PointLight(0xff0000, 2); // Red light
pointLight.position.set(-1, 0.5, 1);
scene.add(pointLight);
//and a yellow light
const pointLight2 = new THREE.PointLight(0xffff00, 2); // yellow light
pointLight2.position.set(1, -0.5, 1);
scene.add(pointLight2);
pointLight2.power = 100;

//add a spotlight
const spotLight = new THREE.SpotLight(0xffffff, 2); // white light
spotLight.position.set(0, 0, 10);
scene.add(spotLight);
spotLight.power = 200;

let cubeVelocity = 0.09;
let frameCount = 0;
let growthRate = 0.005;

// Create a game loop for rendering
const animate = () => {
    requestAnimationFrame(animate);
    torus.rotation.x += 0.008;
    torus.rotation.y += 0.008;
    cube.rotation.x += 0.04;
    cube.rotation.y += 0.02;

    if (Math.abs(cube.position.x) > Math.abs(window.innerWidth/200)) {
        cubeVelocity = cubeVelocity * -1
    }
    cube.position.x += cubeVelocity;

    // console.log('cube position x: ', cube.position.x);
    // console.log('window.innerWidth: ', window.innerWidth);

    //add a flash every 50 frames
    if (frameCount % 50 === 0) {
        pointLight2.power = pointLight2.power * -1;
    }
    frameCount++;

    /*
    //make the torus grow and shrink smoothly
    if (torus.scale.x > 2) {
        growthRate = growthRate * -1;
    } else if (torus.scale.x < 0.5) {
        growthRate = growthRate * -1;
    }
    torus.scale.x += growthRate;
    torus.scale.y += growthRate;
    torus.scale.z += growthRate;

    //make the balloon grow and shrink smoothly
    if (balloon.balloon.scale.x > 1.5 || balloon.balloon.scale.x < 0.5) {
        balloon.flipFlate();
    }
    if(balloon.balloon.position.x > 2 || balloon.balloon.position.x < -2) {
        balloon.flipDrift();
    }
    balloon.doStuff();
*/

    if(!!explosion) {
        explosion.explode();
    }

    renderer.render(scene, camera);
};
animate();
