import { APPLICATION_LOCK, MODE } from "./Constants";
const module = (function() {
  return {
    handleResetSample: function(cb) {
      this.setState(
        { samples: [], sampled: null, lock: APPLICATION_LOCK.NONE },
        () => {
          // Let the tickets finish flying down before the next step.
          if (typeof cb === "function") this.waitForAnimation(cb);
        }
      );
    },
    // Draw a sample of `amount` tickets; cb runs once the last ticket's
    // animation has finished.
    handleSampleTicket: function(option, amount, cb) {
      if (this.state.lock !== APPLICATION_LOCK.NONE) {
        this.handleAlert("Please reset the samples!");
        return;
      }

      if (amount <= 0) {
        this.handleAlert("Please enter positive value");
        return;
      }
      if (this.state.tickets.length === 0) {
        this.handleAlert("The Box is Empty");
        return;
      }

      if (
        option === MODE.WITHOUT &&
        parseInt(amount) > this.state.tickets.length
      ) {
        this.handleAlert("We cannot draw more than the tickets in the box");
        return;
      }
      let valid = true;
      this.state.tickets.forEach(val => {
        if (!(!isNaN(parseFloat(val)) && isFinite(val))) valid = false;
      });
      if (!valid) {
        this.handleAlert("Invalid value(s) in the box");
        return;
      }
      if (this.state.step === 1) {
        this.setState({ step: 2 });
      }

      // Lock the box, keep a copy of the tickets to draw from, then start drawing.
      this.setState(
        prevState => {
          const tickets = prevState.tickets.map(val => parseFloat(val));
          return {
            tickets: tickets,
            sampled: tickets.concat(),
            samples: [],
            lock: APPLICATION_LOCK.PROCESSING
          };
        },
        () => this.drawTickets(option, parseInt(amount), cb)
      );
    },
    /// <summary>
    /// Draw the remaining tickets of the current sample. At the "instant" end
    /// of the speed slider all remaining tickets are drawn in one update;
    /// otherwise one ticket is drawn now and the next after animationTime.
    /// Because the speed is re-read before every draw, moving the slider
    /// while a sample is in progress takes effect right away.
    /// </summary>
    drawTickets: function(option, remaining, cb) {
      const howMany = this.state.animationTime === 0 ? remaining : 1;
      this.setState(
        prevState => {
          const sampled = prevState.sampled.concat();
          const samples = prevState.samples.concat();
          for (let i = 0; i < howMany; i++) {
            const sampleIndex = Math.floor(Math.random() * sampled.length);
            samples.push(sampled[sampleIndex]);
            if (option === MODE.WITHOUT) sampled.splice(sampleIndex, 1);
          }
          return { samples: samples, sampled: sampled };
        },
        () => {
          const left = remaining - howMany;
          // Wait for the ticket's animation before the next draw, or before
          // handing the finished sample over (e.g. to be aggregated).
          this.waitForAnimation(() => {
            if (left > 0) {
              this.drawTickets(option, left, cb);
            } else {
              this.setState({ lock: APPLICATION_LOCK.SAMPLING }, () => {
                if (typeof cb === "function") cb();
              });
            }
          });
        }
      );
    }
  };
})();

export default module;
