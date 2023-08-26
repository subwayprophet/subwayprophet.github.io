class Balloon {

    geometry = new THREE.SphereGeometry(0.4, 32, 32);
    material = new THREE.MeshPhongMaterial({ color: 0x00ffff });
    balloon = new THREE.Mesh(this.geometry, this.material);

    tailGeometry = new THREE.CylinderGeometry(0.01, 0.01, 0.5, 32);
    tailMaterial = new THREE.MeshPhongMaterial({ color: 0x00ffff });
    tail = new THREE.Mesh(this.tailGeometry, this.tailMaterial);

    constructor() {
        this.tail.position.y = -1;
    }


    pop() {
        console.log('Bang!');
    }

    direction = 1;
    flipFlate() {
        this.direction = this.direction * -1;
    }
    doStuff() {
        if(this.direction === 1) {
            this.inflate()
        } else {
            this.deflate()
        }
        this.drift();
        this.rotateTail();
    }

    rotateTail() {
        this.tail.rotation.x += 0.01;
        this.tail.rotation.y += 0.01;
        this.tail.rotation.z += 0.01;
    }

    inflate() {
        this.balloon.scale.x += 0.01;
        this.balloon.scale.y += 0.01;
        this.balloon.scale.z += 0.01;
        this.tail.scale.x += 0.02;
        this.tail.scale.y += 0.02;
        this.tail.scale.z += 0.02;
    }
    deflate() {
        this.balloon.scale.x -= 0.05;
        this.balloon.scale.y -= 0.05;
        this.balloon.scale.z -= 0.05;
        this.tail.scale.x -= 0.05;
        this.tail.scale.y -= 0.05;
        this.tail.scale.z -= 0.05;
    }
    get driftRate() {
        return 0.01 * this.driftDirection;
    }
    driftDirection = 1;
    flipDrift() {
        this.driftDirection = this.driftDirection * -1;
    }
    drift() {
        this.balloon.position.x += this.driftRate;
        this.balloon.position.y += this.driftRate;
        this.balloon.position.z += this.driftRate;
        this.tail.position.x += this.driftRate;
        this.tail.position.y += this.driftRate;
        this.tail.position.z += this.driftRate;
    }

    scene;
}

class Explosion {

    init(origin,particleCount) {
        this.disappear(); //clear out previous explosions
        this.origin = origin;
        this.particleCount = particleCount;
        this.particles = [];
        for (let i = 0; i < particleCount; i++) {
            const particle = new THREE.Sprite(new THREE.SpriteMaterial({ color: pickRandomColor() }));
            //orient each particle a little differently
            particle.position.x = origin.x + (Math.random() - 0.5);
            particle.position.y = origin.y + (Math.random() - 0.5);
            particle.position.z = origin.z + (Math.random() - 0.5);
            //makes the particles really small
            particle.scale.x = particle.scale.y = 0.1;
            particle.position.normalize();
            this.particles.push(particle);
            scene.add(particle);
        }
        this.startingFrame = frameCount;
    }
    origin;
    particleCount = 200;
    particles = [];
    explosionSpeed = 0.03;
    explode() {
        for (let i = 0; i < this.particles.length; i++) {
            const particle = this.particles[i];
            //move outwards from the origin
            particle.position.x += particle.position.x * this.explosionSpeed;
            particle.position.y += particle.position.y * this.explosionSpeed;
            particle.position.z += particle.position.z * this.explosionSpeed;
        }
        this.maybeDisappear()
    }
    startingFrame;
    lifeFrames = 100;
    maybeDisappear() {
        if((this.startingFrame - frameCount) % this.lifeFrames === 0) {
            this.disappear();
        }
    }
    disappear() {
        //remove all particles from the scene
        for (let i = 0; i < this.particles.length; i++) {
            const particle = this.particles[i];
            scene.remove(particle);
        }

    }
}
