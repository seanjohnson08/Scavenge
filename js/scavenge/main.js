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
});

(function(){
    var dragStart={x:0,y:0};
    var dragging=false;
    var cameraStart={};
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
        }
    };
    window.onmouseup=function(event){
        dragging=false;
    };
})();