importScripts('worldGen.js');

var seed="sexpot";
var noise={};
var tileSize=32;
var chunk={width:320,height:320};
var worldGen = worldGen;

self.addEventListener('message',function(event){
    if(event.data.seed) worldGen.init(event.data.seed);
    if(event.data.tileSize) tileSize=event.data.tileSize;
    if(event.data.chunk) chunk=event.data.chunk;
    if(typeof event.data.x != "undefined" ||typeof event.data.y != "undefined") {
      //render
      var x,y,result=[];
      for(y=0;y<chunk.width/tileSize;y++) {
          var row=[];
          for(x=0;x<chunk.height/tileSize;x++) {

              var runX = (event.data.x*chunk.width/tileSize+x);
              var runY = (event.data.y*chunk.height/tileSize+y);
              row.push(worldGen.point(runX, runY));
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