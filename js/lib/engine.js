var engine={
    canvas: null,
    context: null
};

engine.camera={
    x:0,
    y:0,
    width:0,
    height:0
};

engine.world={
    seed: "overwriteme",
    numWorkers: 4,
    workers: [],
    chunk: {
        width:160,
        height:160,
        cache:{},
        draw:function(x,y){
            if(typeof engine.world.chunk.cache[x+','+y]!="undefined") {
                engine.context.drawImage(
                    engine.world.chunk.cache[x+','+y].image,
                    x*engine.world.chunk.width-engine.camera.x,
                    y*engine.world.chunk.height-engine.camera.y,
                    engine.world.chunk.width,
                    engine.world.chunk.height
                );
            } else {
                var cache=engine.world.chunk.cache[x+','+y]={};
                cache.image=new Image();
                cache.tile=new Uint8Array(
                    engine.world.chunk.width*engine.world.chunk.height/
                    Math.pow(engine.world.tiles.size,2)
                );
                engine.world.workers[engine.world.workers.current].postMessage({
                    x:x,
                    y:y,
                    tileSize:engine.world.tiles.size
                });
                engine.world.workers.current++;
                if(engine.world.workers.current>=engine.world.numWorkers) {
                    engine.world.workers.current=0;
                }
            }
        },
        store:function(event){
            if(event.data) {
                var image=new Image();
                var tmpCanvas=document.createElement('canvas');
                tmpCanvas.height=engine.world.chunk.height;
                tmpCanvas.width=engine.world.chunk.width;
                tmpCtx=tmpCanvas.getContext('2d');

                var cache=engine.world.chunk.cache[event.data.x+','+event.data.y];

                event.data.result.forEach(function(row,y){
                    row.forEach(function(tile,x){
                        tmpCtx.drawImage(
                            engine.world.tiles[tile],
                            x*engine.world.tiles.size,
                            y*engine.world.tiles.size,
                            engine.world.tiles.size,
                            engine.world.tiles.size
                        );
                        cache.tile[x+y*(engine.world.chunk.width/engine.world.tiles.size)]=engine.world.tiles[tile]._id;
                    });
                });
                image.src=tmpCanvas.toDataURL();
                cache.image=tmpCanvas;
            }
        }
    },
    draw: function(){
        var startX=Math.floor(engine.camera.x/engine.world.chunk.width);
        var startY=Math.floor(engine.camera.y/engine.world.chunk.height);
        var endX=Math.ceil(engine.camera.width/engine.world.chunk.width)+startX;
        var endY=Math.ceil(engine.camera.height/engine.world.chunk.height)+startY;
        var x,y;
        for(x=startX;x<=endX;x++) {
            for(y=startY;y<=endY;y++) {
                engine.world.chunk.draw(x,y);
            }
        }
    },
    init: function(opts){
        var i;
        engine.world.seed=opts.seed||engine.world.seed;
        engine.world.numWorkers=opts.numWorkers||engine.world.numWorkers;

        engine.canvas=document.getElementById('world');
        engine.context=engine.canvas.getContext('2d');

        for(i=0;i<engine.world.numWorkers;i++) {
            engine.world.workers[i]=new Worker('js/lib/worldRenderWorker.js');
            engine.world.workers[i].postMessage({
                seed:engine.world.seed,
                tileSize:engine.world.tiles.size,
                chunk:{
                    width:engine.world.chunk.width,
                    height:engine.world.chunk.height
                }
            });
            engine.world.workers[i].addEventListener('message',engine.world.chunk.store);
        }
        engine.world.workers.current=0;
    },
    tiles:(function(){
        var i;
        var tiles=['dirt','grass','ice','log','sand','snow','water'];
        var global={size:8};

        for(i=0;i<tiles.length;i++) {
            global[i]=tiles[i];
            global[tiles[i]]=new Image();
            global[tiles[i]].src='assets/'+tiles[i]+'.png';
            global[tiles[i]]._id=i;
        }

        return global;
    })(),
    getChunk:function(tilex,tiley){
        var cRef=engine.world.chunk,
            tileSize=engine.world.tiles.size;
        return Math.floor(tilex/(cRef.width/tileSize))+','+Math.floor(tiley/(cRef.height/tileSize));
    },
    getTile:function(x,y){
        var cRef = engine.world.chunk;
        var tileSize = engine.world.tiles.size;
        var tpc=[cRef.width/tileSize,cRef.height/tileSize];
        var chunk=engine.world.getChunk(x,y);
        if(cRef.cache[chunk]) {
            x%=tpc[0];
            y%=tpc[1];
            if(x<0) x+=tpc[0];
            if(y<0) y+=tpc[1];
            return engine.world.tiles[cRef.cache[chunk].tile[x+y*cRef.width/engine.world.tiles.size]];
        }
    }
};

engine.debug={
    frame:0,
    fps:function(){
        var fps=document.getElementById('fps');
        if(!fps) {
            fps=document.createElement('div');
            fps.id='fps';
            document.body.appendChild(fps);
            fps.style.position='absolute';
            fps.style.left='0';
            fps.style.top='0';
        }
        
        var lastFrame=engine.debug.frame;
        setInterval(function(){
            fps.innerHTML=engine.debug.frame-lastFrame;
            lastFrame=engine.debug.frame;
        },1000);
    }
};

engine.mainLoop=function(){
    function run(){
        engine.debug.frame++;
        engine.world.draw();
        window.requestAnimationFrame(run);
    }
    window.requestAnimationFrame(run);
};