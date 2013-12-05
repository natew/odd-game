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
    vertex.y = Math.random() * 1000 - 500;
    vertex.z = Math.random() * 1000 - 500;
    particleGeometry.vertices.push( vertex );
  }

  particles = new THREE.ParticleSystem( particleGeometry, particleMaterial );
  WORLD.add(particles);
}

function createFloor() {
  var floorMaterial = new THREE.MeshPhongMaterial({ color:0xffffff, transparent:true, opacity:0.5 });
  var floorGeometry = new THREE.PlaneGeometry(SCREEN_WIDTH, SCREEN_HEIGHT, 10, 10);
  var floor = new THREE.Mesh(floorGeometry, floorMaterial);
  floor.position.y = -0.5;
  floor.rotation.x = Math.PI / 2;
  WORLD.add(floor);
}

function createSky() {
  var skyBoxGeometry = new THREE.CubeGeometry( 10000, 10000, 10000 );
  var skyBoxMaterial = new THREE.MeshLambertMaterial( { color: colors['sky'], side: THREE.BackSide } );
  var skyBox = new THREE.Mesh( skyBoxGeometry, skyBoxMaterial );
  WORLD.add(skyBox);
}

function createWalls() {
  var i;
  var wallLengthH = SCREEN_WIDTH,
      wallLengthV = SCREEN_HEIGHT,
      wallPosH = wallLengthH / 2,
      wallPosV = wallLengthV / 2,
      wallWidth = 20,
      wallHeight = 40;

  var wallWidths = [wallLengthH, wallLengthH, wallWidth, wallWidth];
  var wallLengths = [wallWidth, wallWidth, wallLengthV, wallLengthV];
  var wallX = [0, 0, wallPosH, -wallPosH];
  var wallZ = [wallPosV, -wallPosV, 0, 0];
  var wall;

  for (i = 0; i < 4; i++) {
    wall = new THREE.Mesh(
        new THREE.CubeGeometry(wallWidths[i], wallHeight, wallLengths[i], 1, 1, 1),
        new THREE.MeshPhongMaterial( { color: colors['wall'] } )
      );
    wall.position.set(wallX[i], wallHeight / 2, wallZ[i]);
    wall.castShadow = true;
    wall.receiveShadow = true;
    WALLS.push(wall);
    WORLD.add(wall);
  }

  // Swap walls into nice order this is CRAP
  var b = WALLS[3];
  WALLS[3] = WALLS[0];
  WALLS[0] = b;
}

function lighting() {
  var spotLight;
  // Point light
  spotLight = new THREE.SpotLight(colors['light'], 5.0);
  spotLight.position.set(0, 1500, 0);
  spotLight.castShadow = true;
  // spotLight.shadowCameraVisible = true;
  spotLight.shadowMapWidth = 1024 * 2;
  spotLight.shadowMapHeight = 1024 * 2;
  spotLight.shadowCameraNear = 500;
  spotLight.shadowCameraFar = 4000;
  spotLight.shadowCameraFov = 30;
  WORLD.add(spotLight);
}

function createCars() {
  var i;
  for (i = 0; i < 2; i++) {
    var carMaterial = new THREE.MeshPhongMaterial( { color: colors['car'] } );
    var car = new THREE.Mesh(
      new THREE.CubeGeometry(80, 50, 50, 1, 1, 1),
      carMaterial );
    var half_screen = SCREEN_WIDTH / 2;
    car.position.set((half_screen * i) - (half_screen/2), 25, 0);
    car.index = i;
    car.castShadow = true;
    car.receiveShadow = true;
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
