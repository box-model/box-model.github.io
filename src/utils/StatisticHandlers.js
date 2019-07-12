import { APPLICATION_STEP, AGGREGATION_MODE } from './Constants';

const module = (function() {
  return {
    handleAggregate: function(mode, cb) {
      if (this.state.step === APPLICATION_STEP.AGGREGATE) {
        this.setState({ step: APPLICATION_STEP.REPEAT });
      }
      const sum = this.state.samples.reduce((prev, cur) => {
        return prev + cur;
      }, 0);
      this.setState(
        prevState => {
          if (mode === AGGREGATION_MODE.MEAN) {
            return {
              stats: prevState.stats.concat(
                (sum / prevState.samples.length).toFixed(3)
              )
            };
          } else if (mode === AGGREGATION_MODE.SUM) {
            return { stats: prevState.stats.concat(sum) };
          }
        },
        () => this.handleResetSample(cb)
      );
    },
    handleClearStats: function() {
      this.setState({ stats: [] });
    },
    handleCount: function(value, operator) {
      this.setState({ step: APPLICATION_STEP.DONE });
      let total_count = this.state.stats.reduce((prev, cur) => {
        cur = parseFloat(cur);
        value = parseFloat(value);

        switch (operator) {
          case 'EQ':
            return cur == value ? prev + 1 : prev;
          case 'LE':
            return cur <= value ? prev + 1 : prev;
          case 'GT':
            return cur > value ? prev + 1 : prev;
          case 'GE':
            return cur >= value ? prev + 1 : prev;
          case 'LT':
            return cur < value ? prev + 1 : prev;
          case 'NE':
            return cur != value ? prev + 1 : prev;
          default:
            console.log('handleCount - something gone wrong');
        }
      }, 0);
      this.setState({ count: total_count });
    }
  };
})();

export default module;
