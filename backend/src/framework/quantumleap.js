const WSServer = require('ws').Server;
const FrameProcessor = require('./frame-processor').FrameProcessor;
const SensorGroup = require('./modules/sensors/sensor-group');
const pdollar = require("../implementation/recognizers/dynamic/pdollarplus");
const path = require("path");
const {GestureSet} = require("./gestures/gesture-set");
const {GestureClass} = require("./gestures/gesture-class");
const Testing = require("./testing").Testing

class QuantumLeap {
  constructor(httpServer) {
    this.server = httpServer;
  }

  start(config) {
    if (this.wss) {
      console.log('WebSocket server already running!');
    } else {
      console.log('WebSocket server starting...');
      this.wss = setupWSS(config.main.settings, this.server);
    }
  }

  stop(callback=()=>{}) {
    console.log('WebSocket server stopping...');
    if (this.wss) {
      this.wss.close(() => {
        callback();
      });
      this.wss = '';
    } else {
      callback();
    }
  }

  isRunning() {
    return this.wss ? true : false;
  }
}

function setupWSS(config, server) {
  // Initialize sensor and frame processor
  var sensor = new SensorGroup(config.sensors)
  var frameProcessor = new FrameProcessor(config);
  // Initialize WebSocket server
  let wss = new WSServer({
    server: server,
    perMessageDeflate: false,
    clientTracking: true,
  });
  wss.on('connection', async function connection(ws, request) {
    console.log('Connected!')
    // Handle messages from the client
    ws.on('message', function (message) {
      if (config.general.general.debug) {
        console.log(message);
      }
      var msg = JSON.parse(message);
      if (msg.type === 'operation') {
        for (const operation of msg.data) {
          if (operation.type === 'addPose') {
            frameProcessor.enableGesture('static', operation.name);
          } else if (operation.type === 'addGesture') {
            frameProcessor.enableGesture('dynamic', operation.name);
          } else if (operation.type === 'removePose') {
            frameProcessor.disableGesture('static', operation.name);
          } else if (operation.type === 'removeGesture') {
            frameProcessor.disableGesture('dynamic', operation.name);
          }
        }
      }
      if (msg.type === 'recognize2d') {
        let recognizers = config.recognizers["dynamic"];
        let datasets = config.datasets["dynamic"];
        let recognizerModule = recognizers.modules[0];
        let dataset = loadDataset("dynamic", datasets);
        let recognizer = new pdollar(recognizerModule.moduleSettings, dataset);
        let name_recognize = frameProcessor.recognizeDynamic2(recognizer, msg.data)
        console.log(name_recognize);
        var ret = { type: 'dynamic', name: name_recognize, data: {} };
        let message = getMessage('data');
        if (ret) {
          // If there is gesture data to send to the application
          message.data.push(ret);
          if (config.general.general.debug) {
            console.log(JSON.stringify(message));
          }
        }
        if (message.data.length > 0) {
          ws.send(JSON.stringify(message));
        }
      }
    });
    // Stop previous sensor loop (if any) TODO In the future, find a better solution
    sensor.stop();
    frameProcessor.resetContext();
    // Process sensor frames
    sensor.loop((frame, appData) => {
      let message = getMessage('data');
      if (appData && config.general.general.sendContinuousData) {
        // If there is continuous data to send to the application
        message.data.push({
          'type': 'frame',
          'data': appData
        });
      }
      // Gesture recognition
      var ret = frameProcessor.processFrame(frame);
      if (ret) {
        // If there is gesture data to send to the application
        message.data.push(ret);
        if (config.general.general.debug) {
          console.log(JSON.stringify(message));
        }
      }
      if (message.data.length > 0) {
        ws.send(JSON.stringify(message));
      }
    });
    // Stop processing frames after disconnection
    ws.on('close', function (event) {
      if (wss.clients.size === 0) {
        sensor.stop();
        frameProcessor.resetContext();
      }
      console.log("Disconnected!");
    });
    // Connection error
    ws.on('error', function (error) {
      console.log(JSON.stringify(error));
    });
  });
  return wss;
}

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

function getMessage(type) {
  return {
    'type': type,
    'data': []
  };
}


module.exports = QuantumLeap;
