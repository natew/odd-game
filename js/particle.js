var particleGroup = [],
    particleAttributes = [],
    particleTexture = THREE.ImageUtils.loadTexture( 'images/spark.png' ),
    numActive = 0;

function createParticles(carIndex) {
  var totalParticles = 20;
  var radiusRange = CAR_SIZE;

  particleAttributes[carIndex] = { startSize: [], startPosition: [], randomness: [] };
  particleGroup[carIndex] = new THREE.Object3D();

  for (var i = 0; i < totalParticles; i++) {
    var spriteMaterial = new THREE.SpriteMaterial({
      map: particleTexture,
      useScreenCoordinates: false,
      color: 0xffffff
    });

    var sprite = new THREE.Sprite( spriteMaterial );
    sprite.scale.set( 32, 32, 1.0 ); // imageWidth, imageHeight
    sprite.position.set( Math.random() - 0.5, Math.random() - 0.5, Math.random() - 0.5 );
    sprite.position.setLength( radiusRange * (Math.random() * 0.1 + 0.9) );

    // sprite.color.setRGB( Math.random(),  Math.random(),  Math.random() );
    sprite.material.color.setHSL( Math.random(), 0.9, 0.7 );

    // sprite.opacity = 0.80; // translucent particles
    sprite.material.blending = THREE.AdditiveBlending; // "glowing" particles

    particleGroup[carIndex].add( sprite );
    // add variable qualities to arrays, if they need to be accessed later
    particleAttributes[carIndex].startPosition.push( sprite.position.clone() );
    particleAttributes[carIndex].randomness.push( Math.random() );
  }

  CARS[carIndex].add( particleGroup[carIndex] );
  CAR_PARTICLES[carIndex] = true;
  numActive++;
}

function particleAnimate(time) {
  if (!numActive) return;

  _.each(particleGroup, function(pGroup, carIndex) {
    if (!pGroup) return;

    for ( var c = 0; c < pGroup.children.length; c ++ )
    {
      var sprite = pGroup.children[ c ];

      // particle wiggle
      var wiggleScale = 2;
      sprite.position.x += wiggleScale * (Math.random() - 0.5);
      sprite.position.y += wiggleScale * (Math.random() - 0.5);
      sprite.position.z += wiggleScale * (Math.random() - 0.5);

      // pulse away/towards center
      // individual rates of movement
      var a = particleAttributes[carIndex].randomness[c] + 1;
      var pulseFactor = Math.sin(a * time) * 0.1 + 0.9;
      sprite.position.x = particleAttributes[carIndex].startPosition[c].x * pulseFactor;
      sprite.position.y = particleAttributes[carIndex].startPosition[c].y * pulseFactor;
      sprite.position.z = particleAttributes[carIndex].startPosition[c].z * pulseFactor;
    }

    // rotate the entire group
    // pGroup.rotation.x = time * 0.5;
    // pGroup.rotation.y = time * 0.75;
    pGroup.rotation.z = time * 1.0;
  });
}

function removeParticles(pIndex) {
  CARS[pIndex].remove(particleGroup[pIndex]);
}