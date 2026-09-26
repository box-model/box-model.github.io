import { APPLICATION_LOCK, MODE } from "./Constants";
import { isTicketVisible, scrollToTicket } from "./ticketLayout";

// Pick a random ticket index from the display copy of the box, skipping the
// gaps left by earlier draws without replacement.
function pickTicket(sampled) {
  const available = [];
  sampled.forEach((val, i) => {
    if (val !== null) available.push(i);
  });
  return available[Math.floor(Math.random() * available.length)];
}

const module = (function() {
  return {
    handleResetSample: function(cb) {
      this.setState(
        {
          samples: [],
          sampleOrigins: [],
          sampled: null,
          lastDraw: null,
          lock: APPLICATION_LOCK.NONE
        },
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
            sampleOrigins: [],
            lastDraw: null,
            lock: APPLICATION_LOCK.PROCESSING
          };
        },
        () => this.drawTickets(option, parseInt(amount), cb)
      );
    },
    /// <summary>
    /// Draw the remaining tickets of the current sample. At the "instant" end
    /// of the speed slider all remaining tickets are drawn in one update.
    /// Otherwise one ticket is chosen, scrolled into view in the box if
    /// necessary, drawn (it flies from its place in the box to the sample),
    /// and the next draw follows after animationTime. Because the speed is
    /// re-read before every draw, moving the slider mid-sample takes effect
    /// right away.
    ///
    /// `sampled` is the display copy of the box: drawing without replacement
    /// leaves a null gap so the remaining tickets keep their places.
    /// `sampleOrigins` records which box index each sample ticket came from.
    /// </summary>
    drawTickets: function(option, remaining, cb) {
      const afterDraw = left => {
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
      };

      if (this.state.animationTime === 0) {
        this.setState(
          prevState => {
            const sampled = prevState.sampled.concat();
            const samples = prevState.samples.concat();
            const origins = prevState.sampleOrigins.concat();
            for (let i = 0; i < remaining; i++) {
              const index = pickTicket(sampled);
              samples.push(sampled[index]);
              origins.push(index);
              if (option === MODE.WITHOUT) sampled[index] = null;
            }
            return {
              samples: samples,
              sampleOrigins: origins,
              sampled: sampled,
              lastDraw: null
            };
          },
          () => afterDraw(0)
        );
        return;
      }

      // Choose the ticket first so the box can scroll it into view.
      const index = pickTicket(this.state.sampled);
      this.revealBoxTicket(index, () => {
        this.setState(
          prevState => {
            const sampled = prevState.sampled.concat();
            const value = sampled[index];
            if (option === MODE.WITHOUT) sampled[index] = null;
            const serial = prevState.lastDraw ? prevState.lastDraw.serial : 0;
            return {
              samples: prevState.samples.concat(value),
              sampleOrigins: prevState.sampleOrigins.concat(index),
              sampled: sampled,
              lastDraw: { index: index, serial: serial + 1 }
            };
          },
          () => afterDraw(remaining - 1)
        );
      });
    },
    // Scroll the box so the ticket about to be drawn is on screen, taking at
    // most half a draw interval. If it is already visible, done runs at once.
    revealBoxTicket: function(index, done) {
      const container = document.getElementById("box-content");
      if (!container || isTicketVisible(container, index)) {
        done();
        return;
      }
      scrollToTicket(
        container,
        index,
        Math.min(400, this.state.animationTime / 2),
        done
      );
    }
  };
})();

export default module;
