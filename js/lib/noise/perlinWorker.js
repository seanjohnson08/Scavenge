importScripts('perlin.js');

var generators = { };
addEventListener('message', function(e) {
  var data = e.data;
  console.log(e)
  switch (data.cmd) {
    case 'point':
      //postMessage({ x: data.x, y: data.y, value: generators[data.name].point([data.x, data.y]) });
    break;
    case 'assign':
      generators[data.name] = new perlin.gen(data.seed);
    break;
    case 'configure':
      generators[data.name].frequency   = data.frequency;
      generators[data.name].octaves     = data.octaves;
      generators[data.name].persistence = data.persistence;
    break;
  }
});