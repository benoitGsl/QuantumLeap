const { parsePointsNames } = require('../../utils');
const StrokeData = require('../../gestures/stroke-data').StrokeData;
const Stroke = require('../../gestures/stroke-data').Stroke;
const Path = require('../../gestures/stroke-data').Path;

class AbstractSegmenter {
  constructor(options, dataset) {
    this.motionThreshold = options.additionalSettings.motionThreshold;
    this.motionArticulations = parsePointsNames(options.additionalSettings.motionArticulations);
  }

  /**
   * Add a dynamic gesture  to the training set of this segmenter.
   * @param {Object} name - The name of the dynamic gesture  to add.
   * @param {Object} sample - The dynamic gesture  to add.
   */
  addGesture(name, sample) {
    throw new Error('You have to implement this function');
  }

  /**
   * Remove a dynamic gesture  from the training set of this segmenter.
   * @param {Object} name - The name of the dynamic gesture  to remove.
   */
  removeGesture(name) {
    throw new Error('You have to implement this function');
  }

  /**
   * Process a frame and return a StrokeData object if the frame marks the end of a dynamic gesture .
   * @param {Object} frame - A frame from the sensor. 
   * @returns null if the frame and the current set of frames do not correspond to a dynamic gesture , a StrokeData object otherwise.
   */
  segment(frame) {

    // Get raw segments
    let rawSegments = this.computeSegments(frame);
    // Convert segments
    let segments = [];
    rawSegments.forEach(frames => {
      // Group all points by articulation
      let articulationsPoints = {}

      frames.forEach(frame => {
      
        frame.articulations.forEach(articulation => {

              if (articulationsPoints[articulation.label]) {
                articulationsPoints[articulation.label].push(articulation.point);
              } else {
                articulationsPoints[articulation.label] = [articulation.point];
              }

        });

      })

      for(let w = 0; w < this.motionArticulations.length; w++){
        let no_loop = false
        let articulationsPointsFromSelectedPoints = {}
        for(const articulationLabel of this.motionArticulations[w]){
          if(articulationsPoints[articulationLabel] === undefined){
            no_loop = true
          }
          else{
          articulationsPointsFromSelectedPoints[articulationLabel] = articulationsPoints[articulationLabel]
          }
        }

        let strokeData = new StrokeData();


        if(!no_loop){
          if (isMotion(articulationsPointsFromSelectedPoints, this.motionThreshold, this.motionArticulations[w])) {
            for (const articulationLabel of this.motionArticulations[w]) {
              let path = new Path(articulationLabel);
              strokeData.addPath(articulationLabel, path);
              let stroke = new Stroke();
              path.addStroke(stroke);
              stroke.points = articulationsPointsFromSelectedPoints[articulationLabel];
            }
            segments.push(strokeData);
          }
        }
      }
      
    });
    return segments;
  }


  computeSegments(frame) {
    throw new Error('You have to implement this function');
  }

  /**
   * Indicate to the segmenter that a dynamic gesture  has been recognized.
   */
  notifyRecognition() {
    throw new Error('You have to implement this function');
  }
}

function isMotion(articulationsPoints, threshold, articulations) {
  if (articulations.length === 0) {
    return true;
  }
  for (const articulation of articulations) {
    // Compute motion related to first point
    let refPoint = articulationsPoints[articulation][0];
      
    for (let i = articulationsPoints[articulation].length - 1; i > 0; i--) {
      let motion = distance(refPoint, articulationsPoints[articulation][i]);
      if (motion >= threshold) {
        return true;
      }
    }
  }
  return false;
}

function distance(p1, p2) {
  var dx = p2.x - p1.x;
  var dy = p2.y - p1.y;
  var dz = p2.z - p1.z;
  return Math.sqrt(dx * dx + dy * dy + dz * dz);
}

module.exports = {
  AbstractSegmenter
};