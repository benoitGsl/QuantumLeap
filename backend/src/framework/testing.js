const path = require('path');
const fs = require('fs');
const GestureSet = require('./gestures/gesture-set').GestureSet;
const GestureClass = require('./gestures/gesture-class').GestureClass;
const stringify = require("json-stringify-pretty-compact");
const pdollar = require('../implementation/recognizers/dynamic/pdollarplus');
// const recognizerModule = require("../implementation/recognizers/dynamic/pdollarplus");
// import '../implementation/recognizers/dynamic/pdollarplus/index';
//const frameproc = require('./frame-processor');

// Important values
const computeNextT = x => x * 2; // Function that computes the next number of training templates

class Testing {
  constructor(recognizerType, config) {
    this.recognizerType = recognizerType;
    // Get datasets and recognizers
    this.datasets = config.datasets[recognizerType];
    this.recognizers = config.recognizers[recognizerType];
    // Get testing parameters
    this.minT = config.general.testingParams.minT;
    this.maxT = config.general.testingParams.maxT;
    this.r = config.general.testingParams.r;
    // Get global parameters for the recognizers
    this.n = config.general.globalParams.samplingPoints;
    this.selectedPoints = config.general.globalParams.points;
    this.scoreThreshold = config.recognizers.dynamic.scoreThreshold;
  }

  recognizeDynamic(recognizer, segment) {
  let bestName = '';
  let bestScore = -1;
  // For each segment, attempt to recognize the gesture
  try {
    //console.log(recognizerModule)
    // Recognize the gesture
    // let recognizerModule = this.recognizers.recognizeDynamic();
    // let recognizer = new recognizerModule.module(recognizerModule.moduleSettings);
    let { name, score, time } = recognizer.recognize(segment);
    console.log("score:", score);
    // Keep the gesture with the highest score
    if (score && score > bestScore) {
      bestName = name;
      bestScore = score;
    }
  } catch (error) {
    console.error(`Dynamic gesture recognizer error: ${error.stack}`);
  }
  console.log("Best score:", bestScore);
    console.log("Best name:", bestName);
    console.log("scoreThreshold:", this.scoreThreshold);
  if (bestScore >= this.scoreThreshold) {
    return bestName;
  } else {
    return 'FAIL';
  }
}

  run() {
    let recognizerModule = this.recognizers.modules[0];
    // for (let i = 0; i < this.datasets.modules.length; i++) {
    //   let dataset = loadDataset(this.recognizerType, this.datasets);
    //   let datasetResults = {
    //     r: this.r,
    //     dataset: dataset.name,
    //     gestures: Array.from(dataset.getGestureClasses().keys()),
    //     data: []
    //   };
    //   for (let j = 0; j < this.recognizers.modules.length; j++) {
    //     recognizerModule = this.recognizers.modules[j];
    //     let res = this.testRecognizer(dataset, recognizerModule);
    //     console.log(recognizerModule.module.name);
    //     datasetResults.data.push({
    //       name: recognizerModule.module.name,
    //       options: recognizerModule.moduleSettings,
    //       data: res
    //     });
    //   }
    //   console.log(datasetResults)
    //   results.push(datasetResults);
    // }
    //console.log('end')
    //fs.writeFileSync(`results-${this.recognizerType}.json`, stringify(results, {maxLength: 150, indend: 2}));
    console.log('Start')
    let dataset = loadDataset(this.recognizerType, this.datasets);
    let recognizer = new pdollar(recognizerModule.moduleSettings, dataset);
    console.log(this.recognizeDynamic(recognizer, {"name":"a","subjet":"1","paths":{"point_lmc":{"label":"point_lmc","strokes":[{"id":0,"points":[{"x":527,"y":424,"t":1636972338048},{"x":528,"y":424,"t":1636972338057},{"x":529,"y":424,"t":1636972338063},{"x":531,"y":424,"t":1636972338084},{"x":533,"y":423,"t":1636972338092},{"x":538,"y":421,"t":1636972338098},{"x":541,"y":419,"t":1636972338105},{"x":550,"y":411,"t":1636972338117},{"x":584,"y":376,"t":1636972338127},{"x":600,"y":358,"t":1636972338135},{"x":618,"y":340,"t":1636972338143},{"x":652,"y":296,"t":1636972338151},{"x":668,"y":274,"t":1636972338159},{"x":698,"y":230,"t":1636972338167},{"x":712,"y":210,"t":1636972338175},{"x":724,"y":190,"t":1636972338183},{"x":748,"y":158,"t":1636972338191},{"x":759,"y":144,"t":1636972338199},{"x":779,"y":124,"t":1636972338207},{"x":786,"y":117,"t":1636972338215},{"x":790,"y":113,"t":1636972338223},{"x":794,"y":111,"t":1636972338231},{"x":798,"y":112,"t":1636972338239},{"x":798,"y":113,"t":1636972338247},{"x":801,"y":117,"t":1636972338255},{"x":803,"y":122,"t":1636972338263},{"x":810,"y":140,"t":1636972338272},{"x":816,"y":156,"t":1636972338279},{"x":821,"y":172,"t":1636972338287},{"x":835,"y":215,"t":1636972338295},{"x":845,"y":237,"t":1636972338303},{"x":863,"y":277,"t":1636972338311},{"x":871,"y":299,"t":1636972338318},{"x":879,"y":323,"t":1636972338327},{"x":899,"y":365,"t":1636972338335},{"x":907,"y":385,"t":1636972338342},{"x":923,"y":427,"t":1636972338351},{"x":929,"y":447,"t":1636972338359},{"x":935,"y":465,"t":1636972338367},{"x":943,"y":498,"t":1636972338375},{"x":945,"y":512,"t":1636972338383},{"x":948,"y":534,"t":1636972338391},{"x":950,"y":540,"t":1636972338399},{"x":950,"y":544,"t":1636972338407},{"x":950,"y":543,"t":1636972338456},{"x":942,"y":533,"t":1636972338463}]},{"id":1,"points":[{"x":562,"y":285,"t":1636972338816},{"x":563,"y":285,"t":1636972338848},{"x":566,"y":285,"t":1636972338855},{"x":577,"y":285,"t":1636972338863},{"x":584,"y":285,"t":1636972338871},{"x":607,"y":283,"t":1636972338880},{"x":620,"y":283,"t":1636972338887},{"x":633,"y":283,"t":1636972338895},{"x":669,"y":285,"t":1636972338903},{"x":703,"y":285,"t":1636972338911},{"x":727,"y":285,"t":1636972338919},{"x":783,"y":285,"t":1636972338927},{"x":815,"y":285,"t":1636972338935},{"x":847,"y":285,"t":1636972338943},{"x":913,"y":285,"t":1636972338952},{"x":943,"y":285,"t":1636972338959},{"x":993,"y":285,"t":1636972338967},{"x":1013,"y":285,"t":1636972338975},{"x":1030,"y":285,"t":1636972338983},{"x":1049,"y":285,"t":1636972338991},{"x":1050,"y":286,"t":1636972339008},{"x":1049,"y":286,"t":1636972339040},{"x":1046,"y":287,"t":1636972339047},{"x":1044,"y":288,"t":1636972339057},{"x":1042,"y":289,"t":1636972339064},{"x":1041,"y":289,"t":1636972339071}]}]}}}));
  }

  testRecognizer(dataset, recognizerModule) {
    throw new Error('You have to implement this function');
  }
}

class UserIndependentTesting extends Testing {
  constructor(recognizerType, config) {
    super(recognizerType, config);
  }

  testRecognizer(dataset, recognizerModule) {
    let results = [];
    // Perform the test for each size of training set
    for (let trainingSetSize = this.minT; trainingSetSize <= Math.min(dataset.getMinTemplate(), this.maxT); trainingSetSize = computeNextT(trainingSetSize)) {
      let res = {
        n: trainingSetSize,
        accuracy: 0.0,
        time: 0.0,
        confusionMatrix: []
      };
      res.confusionMatrix = new Array(dataset.G).fill(0).map(() => new Array(dataset.G).fill(0));

      // Repeat the test this.r times
      for (let r = 0; r < this.r; r++) {
        // Initialize the recognizer and select the candidates
        let recognizer = new recognizerModule.module(recognizerModule.moduleSettings);
        let candidates = selectCandidates(dataset);
        // For each gesture class, mark the templates that cannot be reused
        let markedTemplates = [];
        candidates.forEach(candidate => {
          markedTemplates.push([candidate]);
        });
        // Train the recognizer
        for (let t = 0; t < trainingSetSize; t++) { // Add trainingSetSize strokeData per gestureClass
          // Add one sample for each gesture class
          let index = 0;
          dataset.getGestureClasses().forEach((gestureClass) => {
            // Select a valid training template
            let training = -1;
            //while (training == -1 || markedTemplates[index].includes(training) || gestureClass.getSamples()[training].user == gestureClass.getSamples()[markedTemplates[index][0]].user) {
              while (training == -1 || markedTemplates[index].includes(training)) {
              training = getRandomNumber(0, gestureClass.getSamples().length);
            }
            // Mark the training template
            markedTemplates[index].push(training);
            // Train the recognizer
            //console.log(gestureClass.name)
            recognizer.addGesture(gestureClass.name, gestureClass.getSamples()[training]);
            index++;
          });
        }
        // Test the recognizer
        let index = 0;
        dataset.getGestureClasses().forEach((gestureClass) => {
          // Retrieve the testing sample
          let toBeTested = gestureClass.getSamples()[candidates[index]];
          // Attempt recognition
          //console.log(gestureClass.name, toBeTested.id)
          if (this.recognizerType === 'dynamic') {
            var result = recognizer.recognize(toBeTested);
          } else {
            var result = recognizer.recognize(toBeTested.frame);
          }
          //console.log(result.name)
          // Update the confusion matrix
          if (dataset.getGestureClasses().has(result.name)) {
            let resultIndex = dataset.getGestureClasses().get(result.name).index;
            res.confusionMatrix[gestureClass.index][resultIndex] += 1;
          }
          // Update execution time and accuracy
          res.accuracy += (result.name === gestureClass.name) ? 1 : 0;
          res.time += result.time;
          index++;
        });
      }
      res.accuracy = res.accuracy / (this.r * dataset.G);
      res.time = res.time / (this.r * dataset.G);
      results.push(res);
    }
    return results;
  }
}

class UserDependentTesting extends Testing {
  constructor(recognizerType, config) {
    super(recognizerType, config);
  }

  testRecognizer(dataset, recognizerModule) {
    super.testRecognizer(dataset, recognizerModule);
  }
}


// HELPER FUNCTIONS

/**
 * Return a random list of candidate gestures, 1 candidate per gesture class.
 */
function selectCandidates(dataset) {
  let candidates = [];
  dataset.getGestureClasses().forEach((value) => {
    candidates.push(getRandomNumber(0, value.getSamples().length));
  });
  return candidates;
};

/**
 * Return a random number between min and max.
 */
function getRandomNumber(min, max) {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min)) + min;
};

/**
 * Load a gesture dataset
 */
function loadDataset(type, datasetsConfig) {
  // Load the dataset
  let datasetLoaderModule = datasetsConfig.modules[0];
  let datasetLoader = datasetLoaderModule.module;
  let identifier = datasetLoaderModule.additionalSettings.id;
  let datasetName = datasetLoaderModule.additionalSettings.datasets[0];
  let datasetPath = path.resolve(__dirname, '../datasets', type, datasetName); // TODO improve
  let dataset = datasetLoader.loadDataset(datasetName, datasetPath, identifier, [])
  // Select/aggregate/rename classes of the dataset if required
  if (datasetsConfig.aggregateClasses && datasetsConfig.aggregateClasses.length != 0) {
    let newDataset = new GestureSet(dataset.name);
    datasetsConfig.aggregateClasses.forEach((aggregate, index) => {
      // Aggregate gesture class
      let newClass = new GestureClass(aggregate.name, index);
      let templates = [];
      // Fuse the classes into a new aggregate class
      for (const className of aggregate.gestureClasses) {
        let oldClass = dataset.getGestureClasses().get(className);
        templates = templates.concat(templates, oldClass.getSamples());
      }
      // Add the templates to the new gesture class
      for (template of templates) {
        newClass.addSample(template);
      }
      // Add the aggregate class to the new dataset
      newDataset.addGestureClass(newClass);
    });
    return newDataset
  } else {
    return dataset;
  }
}

module.exports = {
  Testing,
  UserDependentTesting,
  UserIndependentTesting
}