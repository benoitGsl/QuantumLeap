const AbstractStaticRecognizer = require('../../../../framework/modules/recognizers/static/abstract-static-recognizer').AbstractStaticRecognizer;
const P3DollarPlusRecognizer = require('./p3dollarplus/recognizer').Recognizer;
const Point = require('./p3dollarplus/recognizer').Point;
const { parsePointsNames } = require('../../../../framework/utils');

class Recognizer extends AbstractStaticRecognizer {

    static name = "P3DollarPlusRecognizer";

    constructor(options, dataset) {
        super(options);
        this.selectedPoints = parsePointsNames(options.points);
        this.staticRecognizer = new P3DollarPlusRecognizer(this.selectedPoints.length);
        // Load gestures from the dataset
        if (dataset !== undefined) {
			dataset.getGestureClasses().forEach((gesture) => {
				gesture.getSamples().forEach(sample => {
                    this.addGesture(gesture.name, sample);
				});
            });
        }
    }

    addGesture(name, sample) {
        let frame = sample.frame;
        let points = []
        for (const articulation of this.selectedPoints) {
            points.push(frame.getArticulation(articulation).point);
        }
        this.staticRecognizer.addGesture(name, points);
    }

    removeGesture(name) {
        this.staticRecognizer.removeGesture(name);
    }

    recognize(frame) {
        let points = []
        for (const articulation of this.selectedPoints) {
            let point = frame.getArticulation(articulation).point;
            points.push(new Point(point.x, point.y, point.z, 0));
        }
        try {
            let { name, score, time } = this.staticRecognizer.recognize(points);
            return score > 0.0 ? { name: name, score: score, time: time } : { name: '', score: 0.0, time: time };
        } catch(err) {
            return { name: '', score: 0.0, time: 0.0 }
        }
    }

    toString() {
        return `${Recognizer.name}`;
    }
}

module.exports = Recognizer;