importScripts('noise/Generator.js','noise/perlin.js','noise/seedrandom.js');
var seed="overwriteme";
var noise={};
var tileSize=32;
var chunk={width:320,height:320};

var blockAt = function(height, value) {
    if (height <= 0.4) {
      if (value <= 0.5) {
        return 'water';
      }
      else {
        return 'ice';
      }
    }
    else if (height <= 0.45) {
      if (value <= 0.5) {
        return 'dirt';
      }
      else {
        return 'dirt';
      }
    }
    else {
      if (value <= 0.5) {
        return 'grass';
      }
      else {
        return 'snow';
      }
    }
};

var setSeed = function(seed){
    noise = {
        season: new perlin.gen(seed),
        mass: new perlin.gen(seed),
        foliage: new perlin.gen(seed)
    };
    noise.foliage.frequency = 0.5;
    noise.season.frequency = 0.005;
    noise.season.octaves = 1;
};

self.addEventListener('message',function(event){
    if(event.data.seed) setSeed(event.data.seed);
    if(event.data.tileSize) tileSize=event.data.tileSize;
    if(event.data.chunk) chunk=event.data.chunk;

    if(typeof event.data.x != "undefined" ||typeof event.data.y != "undefined") {
      //render
      var x,y,result=[];
      for(y=0;y<chunk.width/tileSize;y++) {
          var row=[];
          for(x=0;x<chunk.height/tileSize;x++) {
              row.push(blockAt(
                  noise.mass.point([(event.data.x*chunk.width/tileSize+x), (event.data.y*chunk.height/tileSize+y)]),
                  noise.season.point([(event.data.x*chunk.width/tileSize+x), (event.data.y*chunk.height/tileSize+y)])
              ));
          }
          result.push(row);
      }
      self.postMessage({
          x:event.data.x,
          y:event.data.y,
          result:result
      });
    }
});