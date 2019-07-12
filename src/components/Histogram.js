import React, { Component } from 'react';

export default class Histogram extends Component {
  constructor(props) {
    super(props);
  }

  // convert x-values to canvas coordinates
  x_to_canvas_coords(x) {
    return this.canvas.width * (x - this.xmin) / (this.xmax - this.xmin);
  }

  // convert y-values to canvas coordinates
  y_to_canvas_coords(y) {
    return 0.7 * (this.canvas.height * (1 - y / this.ymax));
  }

  // determine where the ticks should go
  getTicks() {
    // ticks will be separated by increments of 10^k
    // where k is determined by the range of the plot
    this.k = Math.floor(Math.log10((this.xmax - this.xmin) / 2));
    var sep = Math.pow(10, this.k);

    var ticks = [];
    var tick =
      Math.floor(Math.pow(10, -this.k) * this.xmin) / Math.pow(10, -this.k);
    while (tick <= this.xmax) {
      ticks.push(tick);
      tick += sep;
    }

    return ticks;
  }

  // make bin and count number of observations in bin
  makeBin(dataSorted, lower, upper) {
    // initialize new bin
    var bin = {
      lower: lower,
      upper: upper,
      amount: 0
    };
    // count number of observations in each bin
    for (let x of dataSorted) {
      if (x > upper) break;
      if (x > lower) bin.amount += 1;
    }

    return bin;
  }

  // determine the limits of the x-axis from data
  setXlim(dataXlim) {
    const dataXlimSorted = dataXlim
      .map(Number)
      .concat()
      .sort(function(a, b) {
        return a - b;
      });

    // get minimum and maximum values
    var min = dataXlimSorted[0];
    var max = dataXlimSorted[dataXlimSorted.length - 1];
    var range = max - min;

    // add a 5% buffer on either end
    if (range == 0) {
      this.xmin = min - 0.5;
      this.xmax = max + 0.5;
    } else {
      this.xmin = min - 0.05 * range;
      this.xmax = max + 0.05 * range;
    }

    // get the bin width
    this.binWidth = (this.xmax - this.xmin) / 50;
  }

  // get the bins and the number of observations in each bin
  getBins(dataSorted) {
    // initialize empty bins
    var bins = [];

    // get the midpoint of the range, which will be the center of the histogram
    var center = 0.5 * (this.xmin + this.xmax);

    // ymax will store the maximum bin amount
    this.ymax = 0;

    // start at the center and create bins of width binWidth to the RIGHT
    var lower = center - this.binWidth / 2;
    var upper = center - this.binWidth / 2;
    while (lower < this.xmax) {
      upper += this.binWidth;
      var bin = this.makeBin(dataSorted, lower, upper);
      if (bin.amount > this.ymax) {
        this.ymax = bin.amount;
      }
      bins.push(bin);
      lower += this.binWidth;
    }

    // start at the center and create bins of width binWidth to the LEFT
    var lower = center - this.binWidth / 2;
    var upper = center - this.binWidth / 2;
    while (upper >= this.xmin) {
      lower -= this.binWidth;
      var bin = this.makeBin(dataSorted, lower, upper);
      if (bin.amount > this.ymax) {
        this.ymax = bin.amount;
      }
      bins.push(bin);
      upper -= this.binWidth;
    }

    return bins;
  }

  drawBars(bins) {
    for (var bin of bins) {
      this.ctx.strokeStyle = '#e1530c';
      this.ctx.fillStyle = '#f99d1e';
      this.ctx.strokeRect(
        this.x_to_canvas_coords(bin.lower),
        this.y_to_canvas_coords(bin.amount),
        this.x_to_canvas_coords(bin.upper) - this.x_to_canvas_coords(bin.lower),
        this.y_to_canvas_coords(0) - this.y_to_canvas_coords(bin.amount)
      );
      this.ctx.fillRect(
        this.x_to_canvas_coords(bin.lower),
        this.y_to_canvas_coords(bin.amount),
        this.x_to_canvas_coords(bin.upper) - this.x_to_canvas_coords(bin.lower),
        this.y_to_canvas_coords(0) - this.y_to_canvas_coords(bin.amount)
      );
    }
  }

  drawAxis() {
    // customization
    this.ctx.strokeStyle = '#000000';
    this.ctx.fillStyle = '#000000';
    this.ctx.font = '16px Arial';
    this.ctx.textAlign = 'center';
    this.ctx.textBaseline = 'top';

    var baseline_y = this.y_to_canvas_coords(0);

    // redraw axis
    this.ctx.beginPath();
    this.ctx.moveTo(0, baseline_y);
    this.ctx.lineTo(this.x_to_canvas_coords(this.xmax), baseline_y);
    this.ctx.stroke();

    // add ticks with labels
    var ticks = this.getTicks();
    for (let tick of ticks) {
      // add tick
      this.ctx.beginPath();
      this.ctx.moveTo(this.x_to_canvas_coords(tick), baseline_y);
      this.ctx.lineTo(this.x_to_canvas_coords(tick), baseline_y + 5);
      this.ctx.stroke();

      // add label
      this.ctx.save();
      this.ctx.translate(this.x_to_canvas_coords(tick), baseline_y + 5);
      this.ctx.rotate(-Math.PI / 4);
      this.ctx.textAlign = 'right';
      this.ctx.fillText(tick.toFixed(Math.max(0, -this.k)), 0, 0);
      this.ctx.restore();
    }
  }

  moveBarsToValue(startTime, bins, val) {
    var that = this;

    // clear canvas
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

    // determine how much to move bar towards value
    var time = new Date();
    var frac = (time.getTime() - startTime) / (this.props.animationTime / 2);
    if (frac > 1) {
      this.shrinkBarsToZero(time.getTime(), [
        {
          lower: val,
          upper: val,
          amount: this.ymax
        }
      ]);
      return;
    }

    // determine new bins
    var newBins = [];
    for (let bin of bins) {
      newBins.push({
        lower: bin.lower + frac * (val - bin.lower),
        upper: bin.upper + frac * (val - bin.upper),
        amount: bin.amount
      });
    }

    // draw bars and axis
    this.drawBars(newBins);
    this.drawAxis();

    window.requestAnimationFrame(function() {
      that.moveBarsToValue(startTime, bins, val);
    });
  }

  shrinkBarsToZero(startTime, bins) {
    var that = this;

    // clear canvas
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

    // draw bars and axis
    this.drawBars(bins);
    this.drawAxis();

    // determine how much to move bar towards value
    var time = new Date();
    var frac =
      1 - (time.getTime() - startTime) / (this.props.animationTime / 2);
    if (frac < 0) {
      return;
    }

    // determine new bins
    var newBins = [];
    for (let bin of bins) {
      newBins.push({
        lower: bin.lower,
        upper: bin.upper,
        amount: frac * bin.amount
      });
    }

    window.requestAnimationFrame(function() {
      that.shrinkBarsToZero(startTime, newBins);
    });
  }

  componentDidUpdate(prevProps) {
    // clear canvas
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

    // if no data for the x-axis, return
    if (this.props.dataXlim.length == 0) {
      return;
    }
    // set xmin and xmax
    this.setXlim(this.props.dataXlim);

    // If there are any observations, draw bins.
    if (this.props.data.length > 0) {
      // sort a copy of the data
      var dataSorted = this.props.data
        .map(Number)
        .concat()
        .sort(function(a, b) {
          return a - b;
        });

      // get bins
      var bins = this.getBins(dataSorted);

      // draw bars of the histogram
      this.drawBars(bins);
    }
    // If there are no observations, but there were previously,
    // animate the bins disappearing.
    else if (prevProps !== undefined && prevProps.data.length > 0) {
      // get bins from data from prevProps
      var dataSorted = prevProps.data
        .map(Number)
        .concat()
        .sort(function(a, b) {
          return a - b;
        });
      var bins = this.getBins(dataSorted);

      // calculate average
      var sum = dataSorted.reduce(function(a, b) {
        return a + b;
      });
      var avg = sum / dataSorted.length;

      // move bars to average and shrink towards 0
      var time = new Date();
      this.moveBarsToValue(time.getTime(), bins, avg);
    }

    this.drawAxis();
  }

  componentDidMount() {
    this.canvas = this.refs.canvas;
    this.ctx = this.canvas.getContext('2d');
    this.componentDidUpdate();
  }

  render() {
    return (
      <div className="histogram">
        <canvas ref="canvas" height="200" />
      </div>
    );
  }
}
