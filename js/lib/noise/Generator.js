var perlin = perlin || Object.create( null );

perlin.gen = function ( seed ) {
    this._table = this._makeTable( 255, seed );
    this.octaves = 4;
    this.frequency = 0.0075;
    this.persistence = 0.7;
};

perlin.gen.prototype = {
  _makeTable : function ( size, seed ) {
    Math.seedrandom(seed);
    var result = [ ];
    for ( var n = 0; n < size; ++ n ) {
      result[ n ] = Math.random();
    }
    return result;
  },
  _cosineInterpolate : function ( a, b, t ) {
    var c = ( 1 - Math.cos( t * Math.PI ) ) * 0.5;
    return ( 1 - c ) * a + c * b;
  },
  _randify : function ( n ) {
    return this._table[ Math.floor( Math.abs( n ) % this._table.length ) ];
  },
  _noise : function ( point ) {
    var value = 0;
    var dimensions = point.length;
    for (var dimension = 0; dimension < dimensions; ++ dimension ) {
      value = this._randify( Math.floor( value * 85000 ) + point[ dimension ] );
    }
    return value;
  },
  _smooth : function ( point, dimension ) {
    if ( dimension < 0 ) {
      return this._noise( point );
    }
    var value = point[ dimension ];
    var integer = Math.floor( value );
    var fractional = value - integer;
    point[ dimension ] = integer;
    var a = this._smooth( point, dimension - 1 );
    point[ dimension ] = integer + 1;
    var b = this._smooth( point, dimension - 1 );
    point[ dimension ] = value;
    return this._cosineInterpolate( a, b, fractional );
  },
  point : function ( point ) {
    var value = 0;
    var amplitude = 1;
    var octaves = this.octaves;
    var frequency = this.frequency;
    var persistence = this.persistence;
    var copy = point.slice( );
    var dimensions = copy.length;
    for ( var i = 0; i < octaves; ++ i ) {
      var t = i * 4096;
      for ( var dimension = 0; dimension < dimensions; ++ dimension ) {
        copy[ dimension ] = point[ dimension ] * frequency + t;
      }
      value += this._smooth( copy, dimensions - 1 ) * amplitude;
      amplitude *= persistence;
      frequency *= 2;
    }
    var limiter = ( 1 - persistence ) / ( 1 - amplitude );
    return value * limiter;
  },
};