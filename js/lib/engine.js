/*
  Phelps does JS LOL!?!?!
*/

var engine = { };

engine.overlayContext = false;
engine.worldContext = false;

engine.tileSize = 8;
engine.tileW = engine.tileSize;
engine.tileH = engine.tileSize;
engine.tiles = { };
engine.pixels = { };
engine.scene = [];
engine.highlightedTile = [0, 0];


engine.setContext = function(overlayID, worldID) {
  engine.overlayCanvas = document.getElementById(overlayID);
  engine.overlayContext = engine.overlayCanvas.getContext('2d');
  engine.worldCanvas = document.getElementById(worldID);
  engine.worldContext = engine.worldCanvas.getContext('2d');
};

engine.loadTile = function(resource) {
  for(var source in resource) {
    if (source) {
      engine.tiles[source] = new Image();
      engine.tiles[source].src = resource[source];
    }
  }
};

engine.paintTile = function(x, y, tile) {
  var posX = (x-1) * engine.tileW;
  var posY = (y-1) * engine.tileH;
  engine.worldContext.drawImage(engine.tiles[tile], posX, posY, engine.tileW, engine.tileH);
};

engine.clearHighlight = function() {
  engine.overlayContext.clearRect(0, 0, engine.overlayCanvas.width, engine.overlayCanvas.height);
}

engine.highlightTile = function(x, y) {
  engine.clearHighlight();
  if (!engine.selecting) {
    var posX = (x-1) * engine.tileW;
    var posY = (y-1) * engine.tileH;

    engine.overlayContext.beginPath();
    engine.overlayContext.rect(posX, posY, engine.tileW, engine.tileH);
    engine.overlayContext.lineWidth = 1;
    engine.overlayContext.strokeStyle = 'white';
    engine.overlayContext.stroke();
  }

  if (engine.selection) {
    engine.highlightSelection(engine.selection[0],engine.selection[1],engine.selection[2],engine.selection[3])
  }
}

engine.highlightSelectionPoint = function(x, y) {
  var posX = (x-1) * engine.tileW;
  var posY = (y-1) * engine.tileH;
  engine.overlayContext.beginPath();
  engine.overlayContext.rect(posX, posY, engine.tileW, engine.tileH);
  engine.overlayContext.fillStyle = 'rgba(255, 255, 255, 0.4)';
  engine.overlayContext.fill();
}

engine.highlightSelection = function(xFrom, yFrom, xTo, yTo) {
  var startX = (xFrom-1) * engine.tileSize;
  var startY = (yFrom-1) * engine.tileSize;
  var endX = (xTo-xFrom+1) * engine.tileSize;
  var endY = (yTo-yFrom+1) * engine.tileSize;
  engine.overlayContext.beginPath();
  engine.overlayContext.rect(startX, startY, endX, endY);
  engine.overlayContext.fillStyle = 'rgba(0, 0, 0, 0.4)';
  engine.overlayContext.fill();
  engine.overlayContext.lineWidth = 2;
  engine.overlayContext.strokeStyle = 'rgba(255, 255, 255, 0.4)';
  engine.overlayContext.stroke();
}

engine.paintPixel = function(x, y, color) {
  /* slow
  if (!engine.pixels[color]) {
    engine.pixels[color] = engine.worldContext.createImageData(1,1);
    engine.pixels[color].data[0] = hexToR(color);
    engine.pixels[color].data[1] = hexToG(color);
    engine.pixels[color].data[2] = hexToB(color);
    engine.pixels[color].data[3] = 255;
  }
  engine.worldContext.putImageData(engine.pixels[color], x, y );*/
  /* also slow
  engine.worldContext.fillStyle = 'rgba(' + hexToR(color) + ',' + hexToG(color) + ',' + hexToB(color) + ', 1)';
  engine.worldContext.fillRect(x, y, 1, 1);*/
}