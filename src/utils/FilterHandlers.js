import {APPLICATION_STEP} from './Constants';

const module = (function() {
  return {
    setFilterOperator: function(op) {
      this.setState({ filterOperator: op }, () => {
        if (this.state.step == APPLICATION_STEP.DONE)
          this.handleCount(this.state.filterValue, this.state.filterOperator);
      });
    },
    setFilterValue: function(val) {
      this.setState({ filterValue: val }, () => {
        if (this.state.step == APPLICATION_STEP.DONE)
          this.handleCount(this.state.filterValue, this.state.filterOperator);
      });
    },
    calculateMean: function(array) {
      let sum = array.reduce((prev, cur) => {
        let num = parseFloat(cur);
        if (isNaN(num)) return prev;
        return prev + num;
      }, 0);
      return (sum / array.length).toFixed(2);
    },
    calculateSD: function(array) {
      let avg = this.calculateMean(array);

      var squareDiffs = array.map(value => {
        let num = parseFloat(value);
        if (isNaN(num)) return num;
        let diff = num - avg;
        let diffSquare = diff * diff;
        return diffSquare;
      });

      let variance = this.calculateMean(squareDiffs);
      var stdDev = Math.sqrt(variance).toFixed(2);
      return stdDev;
    }
  };
})();

export default module;
