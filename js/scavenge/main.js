function resize(){
    var cvs=document.getElementById('world');
    world.width=engine.camera.width=document.documentElement.clientWidth;
    world.height=engine.camera.height=document.documentElement.clientHeight;
}
window.addEventListener('resize',resize);
resize();

window.requestAnimationFrame=window.requestAnimationFrame||window.mozRequestAnimationFrame;


window.addEventListener('load',function(){
    engine.world.init({
        seed:"sexpot"
    });
    engine.mainLoop();
    engine.debug.fps();
});

(function(){
    var dragStart={x:0,y:0};
    var dragging=false;
    var cameraStart={};
    var cameraX = document.getElementById('cameraX');
    var cameraY = document.getElementById('cameraY');
    var worldX = document.getElementById('worldX');
    var worldY = document.getElementById('worldY');
    window.oncontextmenu=function(event){
        event.preventDefault();
        return false;
    };
    window.onmousedown=function(event){
        if(event.which==3) {
            dragStart={x:event.clientX,y:event.clientY};
            cameraStart={x:engine.camera.x,y:engine.camera.y};
            dragging=true;
        }
    };
    window.onmousemove=function(event){
        if(dragging){
            engine.camera.x=-event.clientX+dragStart.x+cameraStart.x;
            engine.camera.y=-event.clientY+dragStart.y+cameraStart.y;
            cameraX.innerHTML=engine.camera.x;
            cameraY.innerHTML=engine.camera.y;
        }
        var tileX = Math.ceil((engine.camera.x+event.clientX)/engine.world.tiles.size);
        var tileY = Math.ceil((engine.camera.y+event.clientY)/engine.world.tiles.size);
        worldX.innerHTML=tileX;
        worldY.innerHTML=tileY;
    };
    window.onmouseup=function(event){
        dragging=false;
    };
})();