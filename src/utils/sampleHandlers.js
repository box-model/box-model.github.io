import { APPLICATION_LOCK, MODE } from "./Constants";
const module = (function() {
  return {
    handleResetSample: function(cb) {
      typeof cb === "function"
        ? this.setState(
            prevState => {
              return {
                samples: [],
                sampled: null,
                lock: APPLICATION_LOCK.NONE
              };
            },
            () => setTimeout(cb, this.state.animationTime)
          )
        : this.setState(prevState => {
            return { samples: [], sampled: null, lock: APPLICATION_LOCK.NONE };
          });
    },
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

      this.setState(
        prevState => {
          return { tickets: prevState.tickets.map(val => parseFloat(val)) };
        },
        () => {
          this.setState(
            prevState => {
              return {
                lock: APPLICATION_LOCK.PROCESSING,
                sampled: JSON.parse(JSON.stringify(prevState.tickets))
              };
            },
            () => {
              let promise1 = new Promise((res, rej) => res());
              for (let i = 0; i < amount; i++) {
                promise1 = promise1.then(() => {
                  return new Promise((res, rej) => {
                    var counter = i;
                    this.setState(prevState => {
                      const sampleIndex = Math.floor(
                        Math.random() * prevState.sampled.length
                      );
                      let newState = {};
                      // add the new ticket to the sample
                      newState.samples = prevState.samples.concat(
                        prevState.sampled[sampleIndex]
                      );

                      if (option === "") {
                        newState.sampled = prevState.sampled.map(
                          (ticket, i) => (i !== sampleIndex ? ticket : "x")
                        );
                      } else if (option === MODE.WITHOUT) {
                        newState.sampled = prevState.sampled.filter(
                          (ticket, i) => i !== sampleIndex
                        );
                      }

                      return newState;
                    }, res);
                  }).then(() => {
                    return new Promise((res, rej) => {
                      if (option === MODE.WITH) {
                        setTimeout(() => {
                          this.setState(prevState => {
                            return { sampled: prevState.tickets.concat() };
                          });
                        }, this.state.animationTime);
                      }
                      setTimeout(() => {
                        if (i === amount - 1) {
                          this.setState({ lock: APPLICATION_LOCK.SAMPLING });
                        }
                        if (i === amount - 1 && typeof cb === "function") {
                          cb();
                        }
                        res();
                      }, Math.max(50, this.state.animationTime));
                    });
                  });
                });
              }
            }
          );
        }
      );
    }
  };
})();

export default module;
