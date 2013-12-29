function $(a) {
  return document.getElementById(a);
}

domready(function(){

  engine.setContext('overlay', 'world');

  engine.loadTile({
    grass: 'assets/grass.png',
    dirt: 'assets/dirt.png',
    snow: 'assets/snow.png',
    water: 'assets/water.png',
    sand: 'assets/sand.png',
    log: 'assets/log.png',
    ice: 'assets/ice.png',
  });

  engine.seed = 'sexpot';
  engine.offsetX = 0;
  engine.offsetY = 0;
  engine.noise = {
    season: new perlin.gen(engine.seed),
    mass: new perlin.gen(engine.seed),
    foliage: new perlin.gen(engine.seed)
  }

  engine.noise.foliage.frequency = 0.5
  engine.noise.season.frequency = 0.005
  engine.noise.season.octaves = 1




  engine.blockAt = function(height, value) {
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
  }

  engine.hasTree = function(height) {
    if (height >= 0.8) {
      return true;
    }
  }

  engine.colorAt = function(height) {
    if (height <= 0.4) {
      return '#192c48';
    }
    else if (height <= 0.45) {
      return '#d9aa6c';
    }
    else {
      return '#2b3e24';
    }
  }

  engine.mapDraw = function() {
    var w = Math.floor($('overlay').width/engine.tileSize);
    var h = Math.floor($('overlay').height/engine.tileSize);
    for (var x = 0; x <= w; x++) {
      for (var y = 0; y <= h; y++) {
        var height = engine.noise.mass.point([x+engine.offsetX, y+engine.offsetY] );
        var season = engine.noise.season.point([x+engine.offsetX, y+engine.offsetY] );
        engine.paintTile(x, y, engine.blockAt(height, season));

        var tree = engine.noise.foliage.point([x+engine.offsetX, y+engine.offsetY] );
        if (engine.hasTree(tree)){

          if (engine.blockAt(height) == 'grass') {
            engine.paintTile(x, y, 'log');
          }
        }
      }
    }
  }

  setTimeout(function(){
    engine.worldContext.clearRect(0, 0, engine.worldCanvas.width, engine.worldCanvas.height);
    engine.mapDraw();
  }, 500);

  document.onkeydown = handleKeys;
  function handleKeys(e) {
      e = e || window.event;
      if (e.keyCode == 87) {
        engine.offsetY -= 1;
        engine.mapDraw();
      }
      else if (e.keyCode == 83) {
        engine.offsetY += 1;
        engine.mapDraw();
      }
      else if (e.keyCode == 65) {
        engine.offsetX -= 1;
        engine.mapDraw();
      }
      else if (e.keyCode == 68) {
        engine.offsetX += 1;
        engine.mapDraw();
      }
  }

  var dragging = false;
  var dragOffsets = [];
  engine.selecting = false;
  var selectingOffsets = [];
  engine.selection = false;

  /*$('canvas').onwheel = function(e) {
    if (e.wheelDelta > 0) {
      if (engine.tileSize <= 32) {
        engine.tileSize += 1;
      }
    }
    else {
      if (engine.tileSize >= 16) {
        engine.tileSize -= 1;
      }
    }
    engine.tileW = engine.tileSize;
    engine.tileH = engine.tileSize;
    engine.mapDraw();
  }*/

  $('overlay').addEventListener('mousedown', function (e){
      if(e.button === 0){
        selectingOffsets = [ Math.floor(e.x), Math.floor(e.y) ];
        engine.selecting = true;
        engine.selection = false;
        engine.clearHighlight()
      }
      else if(e.button === 2){
        dragOffsets = [ e.x, e.y, engine.offsetX, engine.offsetY ];
        dragging = true;
      }
  }, false);


  $('overlay').oncontextmenu = function() {
    return false;
  }

  $('overlay').onmouseup   = function() {
    engine.selecting = false;
    dragging = false;
  };
  $('overlay').onmousemove = function(e) {
    if(dragging) {
      engine.offsetX = dragOffsets[2] - Math.floor((e.x - dragOffsets[0]) / engine.tileSize);
      engine.offsetY = dragOffsets[3] - Math.floor((e.y - dragOffsets[1]) / engine.tileSize);
      if (engine.offsetX != dragOffsets[2]|| engine.offsetY != dragOffsets[3]) {
        engine.mapDraw();
        engine.selection = false;
        engine.clearHighlight()
      }
    }

    if (engine.selecting) {
      var selectX = Math.floor(e.x/engine.tileSize)
      var selectY = Math.floor(e.y/engine.tileSize)
      var origX = Math.floor(selectingOffsets[0]/engine.tileSize)
      var origY = Math.floor(selectingOffsets[1]/engine.tileSize)
      engine.selection = [origX, origY, selectX, selectY]
      engine.highlightSelection(engine.selection[0],engine.selection[1],engine.selection[2],engine.selection[3])
    }

    var x = Math.floor(e.x / engine.tileSize);
    var y = Math.floor(e.y / engine.tileSize);
    engine.highlightTile(x, y);
    return;
  };

  // resize the canvas to fill browser window dynamically
  window.addEventListener('resize', resizeCanvas, false);
  function resizeCanvas() {
    $('world').width = window.innerWidth;
    $('world').height = window.innerHeight;
    $('overlay').width = window.innerWidth;
    $('overlay').height = window.innerHeight;
    engine.mapDraw();
  }
  resizeCanvas();

})