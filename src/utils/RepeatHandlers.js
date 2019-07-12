import {
  QUICK_MODE_LIMIT,
  APPLICATION_LOCK,
  MODE,
  APPLICATION_STEP,
  AGGREGATION_MODE
} from './Constants';

const module = (function() {
  return {
    /// <summary>
    /// Do the sampling and aggregation with animation up to QUICK_MODE_LIMIT
    /// then do the rest of the operation in quick mode
    /// </summary>
    handleRepeat: function(quickMode, times) {
      if (times <= 0) {
        this.handleAlert('Please enter positive value');
        return;
      }
      if (this.state.tickets.length === 0) {
        this.handleAlert('The Box is Empty');
        return;
      }

      if (
        this.state.mode === MODE.WITHOUT &&
        parseInt(this.state.amount) > this.state.tickets.length
      ) {
        this.handleAlert('We cannot draw more than the tickets in the box');
        return;
      }
      let valid = true;
      this.state.tickets.forEach(val => {
        if (!(!isNaN(parseFloat(val)) && isFinite(val))) valid = false;
      });
      if (!valid) {
        this.handleAlert('Invalid value(s) in the box');
        return;
      }

      if (this.state.step < APPLICATION_STEP.ANALYZE)
        this.setState({ step: APPLICATION_STEP.ANALYZE, isLooping: true });
      else this.setState({ isLooping: true });

      if (quickMode) {
        this.quickMode(times);
        return;
      } else {
        const animationTimes = Math.min(QUICK_MODE_LIMIT, times);
        let promise1 = new Promise((res, rej) => res());
        for (let i = 0; i < animationTimes; i++) {
          promise1 = promise1
            .then(() => {
              return new Promise((res, rej) => {
                this.handleSampleTicket(
                  this.state.mode,
                  this.state.amount,
                  res
                );
              });
            })
            .then(() => {
              return new Promise((res, rej) => {
                this.handleAggregate(this.state.aggregate,res);
              });
            });
        }
        promise1
          .then(() => {
            if (times - QUICK_MODE_LIMIT > 0)
              this.quickMode(times - QUICK_MODE_LIMIT);
          })
          .then(() => this.setState({ isLooping: false }));
      } 
    },
    /// <summary>
    /// Do aggregation without any animation
    /// </summary>
    quickMode: function(amount) {
      // loop by amount
      let stats = [];
      for (let j = 0; j < amount; j++) {
        // quick sampling
        // with replacement
        let sampled = this.state.tickets.map(val => parseFloat(val));
        let sample = [];
        if (this.state.mode === MODE.WITH) {
          for (let i = 0; i < this.state.amount; i++) {
            const sampleIndex = Math.floor(Math.random() * sampled.length);
            sample.push(sampled[sampleIndex]);
          }
        }
        // without
        else if (this.state.mode === MODE.WITHOUT) {
          for (let i = 0; i < this.state.amount; i++) {
            const sampleIndex = Math.floor(Math.random() * sampled.length);
            sample.push(sampled[sampleIndex]);
            sampled.splice(sampled, 1);
          }
        }
        // quick agree
        if (this.state.aggregate === 'sum')
          stats.push(sample.reduce((a, b) => a + b, 0));
        else if (this.state.aggregate === 'mean')
          stats.push(
            (sample.reduce((a, b) => a + b, 0) / sample.length).toFixed(3)
          );
      }
      this.setState(prevState => {
        return { stats: prevState.stats.concat(stats), isLooping: false };
      });
    }
  };
})();

export default module;
