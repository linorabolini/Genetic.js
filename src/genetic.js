(function () {

	var defaults = {
		mutationRate: 0.3,
		crossOverRate: 0.7,
		maxPerturbation: 0.3,
		numElite: 4,
		numCopiesElite: 2
	}

	/* class def */
	var Genome = function (params) {
		params = params || {};
		this.weights = params.weights || [];
		this.fitness = params.fitness || 0;
	};

	/* class def */
	var GenAlg = function(params, config) {

		// private:

		// default params
		params = params || {};

		// default configs
		config = config || defaults;

		// population size
		var popultionSize = params.popSize;
		// weights per genome
		var chromoLength = params.chromoLength;
		// population array
		var population = params.population || [];
		// total fitness counter
		var totalFitness = 0;
		// best fitness track
		var bestFitness = 0;
		// avg fitness track
		var averageFitness = 0;
		// worst fitness track
		var worstFitness = 99999999;
		// best genome track
		var bestGenomeIndex = 0;
		// mutation rate 
		var mutationRate = params.mutationRate || config.mutationRate;
		// probability of crossing over information
		var crossOverRate = params.crossOverRate || config.crossOverRate;
		// current generation track
		var currentGeneration = 0;
	
		// mutates a chromosome
		function mutate(chromos) {
			for(var i=0; i<chromos.length; ++i) {
				if(Meth.random() < mutationRate) {
					// add perturbation
					chromos[i] += (RandomClamped() * config.maxPerturbation);
				}
			}
		};

		// gets a "random" chromosome
	 	function getChromoRoulette() {
	 		var slice = RandomFloat() * totalFitness;
	 		var chosenOne;
	 		var fitnessCount = 0;

	 		for(var chromo in population) {
	 			fitnessCount += chromo.fitness;

	 			if(fitnessCount > slice) {
	 				chosenOne = chromo;
	 				break;
	 			}
	 		}

	 		return chromo;
	 	};

	 	// crossovers 2 chromosomes
		// returns 2 childs
		function crossover(mum, dad, baby1, baby2) {

			//just return parents as offspring dependent on the rate
			//or if parents are the same
			if ( (RandomFloat() > crossOverRate) || (mum == dad)) {
				baby1 = mum;
				baby2 = dad;
				return;
			}

			//determine a crossover point
			var cp = RandomInt(0, chromoLength - 1);

			//create the offspring
			for (var i=0; i<cp; ++i) {
				baby1.push(mum[i]);
				baby2.push(dad[i]);
			}

			for (i=cp; i<mum.length(); ++i)	{
				baby1.push(dad[i]);
				baby2.push(mum[i]);
			}
		};

	 	// calculates stats
	 	function calculateBestWorstAvTot() {

	 	};

		// returns an array with c copies of n elite chroms
 		function grabNBest(n, c, pop) {
		 	// add the required amount of copies of the n most fittest 
			while(n--)	{
				for (var i=0; i<c; ++i) {
					pop.push(population[(popultionSize - 1) - n]);
			  	}
			}
 		};

 		// resets the alg
 		function reset() {
 			totalFitness = 0;
 			bestFitness = 0;
 			worstFitness = 99999999;
 			averageFitness = 0;
 		};

 		function RandomClamped() {
 			return RandomFloat() - RandomFloat();
 		};

 		function RandomFloat() {
 			return Math.random();
 		};

 		function RandomInt(a, b) {
 			return Math.floor(RandomFloat()*(b-a+1)+a);
 		};

 		// public:

 		this.epoch = function(oldPop) {
 			population = oldPop || population;

 			reset();

 			// sort the population
 			population.sort(function(a, b) {
 				return a.fitness < b.fitness;
 			});

 			// recalculate best avg and worst
 			calculateBestWorstAvTot();

 			// create a new population
 			newPop = [];

 			// add an elite num of copies
 			if (!(config.numElite * config.numCopiesElite % 2))	{
				grabNBest(config.numElite, config.numCopiesElite, newPop);
			}

 			// generate the population crossing and mutating the elite
			while (newPop.length < popultionSize)
			{
				//grab two chromosones
				var mum = getChromoRoulette();
				var dad = getChromoRoulette();

				//create some offspring via crossover
				var baby1 = new Genome();
				var baby2 = new Genome();

				crossover(mum.weights,
						  dad.weights,
						  baby1.weights,
						  baby2.weights);

				//now we mutate
				mutate(baby1.weights);
				mutate(baby2.weights);

				//now copy into vecNewPop population
				newPop.push(baby1);
				newPop.push(baby2);
			}

 			population = newPop;

 			return population;
 		};

 		// inits the algorithm
 		this.init = function() {
 			for(var i=0; i<popultionSize; ++i) {
 				var genome = new Genome();
 				population.push(genome);

 				for(var j=0; j<chromoLength; ++j) {
 					genome.weights.push(RandomClamped());
 				}
 			}

 			return this;
 		};

 		// returns the population
 		this.getPopulation = function() {
 			return population;
 		};

 		this.getAverageFitness = function() {
 			return averageFitness;
 		};

 		this.getBestFitness = function() {
 			return bestFitness;
 		};

 		this.getWorstFitness = function() {
 			return worstFitness;
 		}
	};

	// export module for requireJS
	define(function(){ return GenAlg; });
}());

	



