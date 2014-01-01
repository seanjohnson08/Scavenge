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
        tileSize:8,
        width:160,
        height:160,
        draw:function(x,y){
            if(typeof engine.world.chunk.cache[x+','+y]!="undefined") {
                engine.context.drawImage(
                    engine.world.chunk.cache[x+','+y],
                    x*engine.world.chunk.width-engine.camera.x,
                    y*engine.world.chunk.height-engine.camera.y,
                    engine.world.chunk.width,
                    engine.world.chunk.height
                );
            } else {
                engine.world.chunk.cache[x+','+y]=new Image();
                engine.world.workers[engine.world.workers.current].postMessage({
                    x:x,
                    y:y,
                    tileSize:engine.world.chunk.tileSize
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
                event.data.result.forEach(function(row,y){
                    row.forEach(function(tile,x){
                        tmpCtx.drawImage(
                            engine.world.tiles[tile],
                            x*engine.world.chunk.tileSize,
                            y*engine.world.chunk.tileSize,
                            engine.world.chunk.tileSize,
                            engine.world.chunk.tileSize
                        );
                    });
                });
                image.src=tmpCanvas.toDataURL();
                engine.world.chunk.cache[event.data.x+','+event.data.y]=tmpCanvas;
            }
        },
        cache:{}
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
                tileSize:engine.world.chunk.tileSize,
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
        var global={};

        for(i=0;i<tiles.length;i++) {
            global[tiles[i]]=new Image();
            global[tiles[i]].src='assets/'+tiles[i]+'.png';
        }

        return global;
    })()
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