(function(root, factory) {
    if (typeof define === 'function' && define.amd) {
        // AMD. Register as an anonymous module.
        define(['genetic'], factory);
    } else {
        // Browser globals
        root.Genetic = factory();
    }
}(this, function() {
    var defaults = {
        mutationRate: 0.01,
        crossOverRate: 0.8,
        maxPerturbation: 0.3,
        numElite: 8,
        numCopiesElite: 2
    }

    /* class def */
    var Genome = function(params) {
        params = params || {};
        this.weights = params.weights || [];
        this.fitness = params.fitness || 0;
    };

    /* class def */
    var Genetic = function(params, config) {

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
            for (var i = 0; i < chromos.length; ++i) {
                if (Math.random() < mutationRate) {
                    // add perturbation
                    chromos[i] += RandomClamped() * config.maxPerturbation;
                    chromos[i] = Math.max(0, chromos[i]);
                    chromos[i] = Math.min(1, chromos[i]);
                }
            }
        };

        // gets a "random" chromosome
        function getChromoRoulette() {
            var slice = RandomFloat() * totalFitness;
            var chosenOne, chromo;
            var fitnessCount = 0;

            for (var i = population.length - 1; i >= 0; i--) {
                chromo = population[i];

                fitnessCount += chromo.fitness;

                if (fitnessCount > slice) {
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
            if ((RandomFloat() > crossOverRate) || (mum == dad)) {
                baby1.weights = mum.weights;
                baby2.weights = dad.weights;
                return;
            }

            //determine a crossover point
            var cp = RandomInt(0, chromoLength - 1);

            //create the offspring
            for (var i = 0; i < cp; ++i) {
                baby1.weights.push(mum.weights[i]);
                baby2.weights.push(dad.weights[i]);
            }

            for (i = cp; i < mum.weights.length; ++i) {
                baby1.weights.push(dad.weights[i]);
                baby2.weights.push(mum.weights[i]);
            }
        };

        // calculates stats
        function calculateBestWorstAvTot() {
            for (var i = population.length - 1; i >= 0; i--) {
                totalFitness += population[i].fitness;
            }

            worstFitness = population[0].fitness;
            bestFitness = population[population.length - 1].fitness;
            averageFitness = totalFitness / population.length;
        };

        // returns an array with c copies of n elite chroms
        function grabNBest(n, c, pop) {
            // add the required amount of copies of the n most fittest 
            while (n--) {
                for (var i = 0; i < c; ++i) {
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
            return Math.floor(RandomFloat() * (b - a + 1) + a);
        };

        // public:

        this.epoch = function(oldPop) {
            population = oldPop || population;

            reset();

            // sort the population
            population.sort(function(a, b) {
                return a.fitness > b.fitness;
            });

            // recalculate best avg and worst
            calculateBestWorstAvTot();

            // create a new population
            newPop = [];

            // add an elite num of copies
            if (!(config.numElite * config.numCopiesElite % 2)) {
                grabNBest(config.numElite, config.numCopiesElite, newPop);
            }

            // generate the population crossing and mutating the elite
            while (newPop.length < popultionSize) {
                //grab two chromosones
                var mum = getChromoRoulette();
                var dad = getChromoRoulette();

                //create some offspring via crossover
                var baby1 = new Genome();
                var baby2 = new Genome();

                crossover(mum,
                    dad,
                    baby1,
                    baby2);

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
            for (var i = 0; i < popultionSize; ++i) {
                var genome = new Genome();
                population.push(genome);

                for (var j = 0; j < chromoLength; ++j) {
                    genome.weights.push(RandomFloat());
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

    return Genetic;
}));