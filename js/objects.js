var floor;

function createStars() {
  var particleCount = 100,
      particleGeometry = new THREE.Geometry(),
      particleMaterial = new THREE.ParticleBasicMaterial({
        color: 0xFFFFFF,
        size: 20,
        map: THREE.ImageUtils.loadTexture(
            "/images/blue_particle.jpg"
        ),
        blending: THREE.AdditiveBlending,
        transparent: true
      });

  // Particles
  for ( i = 0; i < particleCount; i ++ ) {
    var vertex = new THREE.Vector3();
    vertex.x = Math.random() * 1000 - 500;
    vertex.y = -500 + Math.random() * 1000 - 500;
    vertex.z = Math.random() * 1000 - 500;
    particleGeometry.vertices.push( vertex );
  }

  particles = new THREE.ParticleSystem( particleGeometry, particleMaterial );
  WORLD.add(particles);
}

function createFloor() {
  var floorMaterial = new THREE.MeshPhongMaterial({
    color:0xffffff,
    transparent: true,
    opacity: 0.3
  });
  var floorGeometry = new THREE.PlaneGeometry(SCREEN_WIDTH, SCREEN_HEIGHT);
  floor = new THREE.Mesh(floorGeometry, floorMaterial);
  // floor.position.y = -0.5;
  floor.rotation.x = -Math.PI / 2;
  floor.receiveShadow = true;
  WORLD.add(floor);
}

function createSky() {
  var skyBoxGeometry = new THREE.CubeGeometry( 10000, 10000, 10000 );
  var skyBoxMaterial = new THREE.MeshLambertMaterial( { color: colors['sky'], side: THREE.BackSide } );
  var skyBox = new THREE.Mesh( skyBoxGeometry, skyBoxMaterial );
  WORLD.add(skyBox);
}

function createWalls() {
  var material = new THREE.MeshLambertMaterial( { color: colors['wall'] } ),
      height = 40,
      w = [
        new THREE.PlaneGeometry(floor.geometry.height, height),
        new THREE.PlaneGeometry(floor.geometry.width, height),
        new THREE.PlaneGeometry(floor.geometry.height, height),
        new THREE.PlaneGeometry(floor.geometry.width, height)
      ];

  for (i = 0; i < w.length; i += 1) {
    WALLS[i] = new THREE.Mesh(w[i], material);
    WALLS[i].position.y = height / 2;
    WORLD.add(WALLS[i]);
    WALL_INDEX[WALLS[i].id] = i;
  }

  WALLS[0].rotation.y = -Math.PI / 2;
  WALLS[0].position.x = floor.geometry.width / 2;
  WALLS[1].rotation.y = Math.PI;
  WALLS[1].position.z = floor.geometry.height / 2;
  WALLS[2].rotation.y = Math.PI / 2;
  WALLS[2].position.x = -floor.geometry.width / 2;
  WALLS[3].position.z = -floor.geometry.height / 2;
}

function lighting() {
  var spotLight;
  // Spot light
  spotLight = new THREE.SpotLight(colors['light'], 1.5);
  spotLight.position.set(0, -200, 0);
  spotLight.castShadow = true;
  spotLight.shadowDarkness = 0.6;
  // spotLight.shadowCameraVisible = true;
  spotLight.shadowCameraNear = 500;
  spotLight.shadowCameraFar = 4000;
  camera.add(spotLight);

  // Hemisphere light
  var light2 = new THREE.HemisphereLight(colors['light'], colors['sky'], 0.6);
  WORLD.add(light2);

  // Point
  // var light3 = new THREE.PointLight(0xffe849, 20, 300);
  // light3.position.set(0, 100, 200);
  // WORLD.add(light3);

  // // Point
  // var light4 = new THREE.PointLight(0xffe849, 20, 300);
  // light4.position.set(50, -100, -100);
  // WORLD.add(light4);
}

function createCars() {
  var i;
  for (i = 0; i < 2; i++) {
    var carMaterial = new THREE.MeshPhongMaterial({
      color: i ? colors['car2'] : colors['car'],
      transparent: true,
      opacity: 1.0
    });
    var car = new THREE.Mesh(
      new THREE.CubeGeometry(CAR_SIZE + 20, CAR_SIZE, CAR_SIZE, 1, 1, 1),
      carMaterial );
    var half_screen = SCREEN_WIDTH / 2;
    car.position.set((half_screen * i) - (half_screen/2), 25, 0);

    if (i == 1) {
      car.rotation.y += Math.PI / 2 * 2;
    }

    car.index = i;
    car.castShadow = true;
    car.receiveShadow = true;
    car.shadowDarkness = 0.5;
    WORLD.add(car);
    CARS.push(car);
  }
}

function loadObjects() {
  // var loader = new THREE.ObjectLoader;
  // loader.load( "models/car.json", function ( geometry, materials ) {
  //   var mesh = new THREE.Mesh( geometry, new THREE.MeshPhongMaterial( { color: 0xff0000, ambient: 0xff0000 } ) );
  //   scene.add( mesh );
  // });

  // var loader = new THREE.ColladaLoader();
  // loader.load('models/civic-red.dae', function (result) {
  //   result.scene.dynamic = true;
  //   result.scene.verticesNeedUpdate = true;
  //   result.scene.normalsNeedUpdate = true;
  //   scene.add(result.scene);
  // });
}
