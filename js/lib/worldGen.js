importScripts('noise/seedrandom.js', 'noise/perlin.js');

var worldGen = { }

worldGen.init = function(seed) {

  worldGen.noise = {
      season: new perlin.gen(seed),
      mass: new perlin.gen(seed),
      foliage: new perlin.gen(seed)
  };

  worldGen.noise.mass.octaves = 4;
  worldGen.noise.mass.frequency = 0.02;
  worldGen.noise.mass.persistence = 0.5;

  worldGen.noise.foliage.frequency = 0.5;
  worldGen.noise.foliage.persistence = 0.5;

  worldGen.noise.season.frequency = 0.005;
  worldGen.noise.season.octaves = 1;
}

worldGen.blockAt = function(height) {
    if (height <= 0.4) {
      return 'water';
    }
    else if (height <= 0.45) {
      return 'sand';
    }
    else {
      return 'grass';
    }
};

worldGen.point = function(x, y) {
  var mass = worldGen.noise.mass.point([x, y]);
  var foliage = worldGen.noise.foliage.point([x, y]);
  if (mass >= 0.8) {
    if (foliage >= 0.5) {
      return 'log';
    }
  }
  else if (mass >= 0.7) {
    if (foliage >= 0.6) {
      return 'log';
    }
  }
  else if (mass >= 0.6) {
    if (foliage >= 0.7) {
      return 'log';
    }
  }
  else if (mass >= 0.5) {
    if (foliage >= 0.8) {
      return 'log';
    }
  }

  return worldGen.blockAt(mass);
}
