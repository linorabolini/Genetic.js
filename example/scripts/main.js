require.config({
	paths: {
		'jquery':'jquery-2.1.0.min',
		'underscore':'underscore-min',
		'backbone':'backbone-min',
		'two':'two',
		'datgui':'dat.gui',
		'genetic':'genetic'
	}
});

require(['genetic'], 
	function(Gen) {

	//======================
	// start point
	var g = new Gen({ 
		popSize: 5,
	 	chromoLength: 3
	});
	console.log(g);
	g.init();
	console.log(g.getPopulation());
	g.epoch();
	console.log(g.getPopulation());

});