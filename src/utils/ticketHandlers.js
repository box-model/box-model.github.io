import { APPLICATION_LOCK } from "./Constants";

const module = (function() {
  return {
    handleAddTicket: function(ticket) {
      if (this.state.lock !== APPLICATION_LOCK.NONE) {
        this.handleAlert("Please reset the samples");
        return;
      }
      const toAdd = [];
      for (let i = 0; i < ticket.amount; i++) {
        toAdd.push(ticket.value);
      }
      this.setState(prevState => {
        return { tickets: prevState.tickets.concat(toAdd) };
      });
    },
    handleResetTicket: function() {
      if (this.state.lock !== APPLICATION_LOCK.NONE) {
        this.handleAlert("Please reset the samples");
        return;
      }
      this.setState({ tickets: [] });
    },
    handleRemoveTicket: function(index) {
      if (this.state.lock !== APPLICATION_LOCK.NONE) {
        this.handleAlert("Please reset the samples");
        return;
      }
      this.setState(prevState => {
        return { tickets: prevState.tickets.filter((val, i) => i !== index) };
      });
    },
    handleEditTicket: function(e) {
      let edited_ticket = e.target.value.replace(/\n/g, ",").split(",");
      // limit the input len
      edited_ticket = edited_ticket.map(val => {
        return val.substring(0, 5);
      });

      this.setState({ tickets: edited_ticket });
    },
    handleSetTicket: function(e) {
      if (this.state.lock !== APPLICATION_LOCK.NONE) {
        this.handleAlert("Please reset the samples");
        return;
      }
      let template = e.target.value;
      if (template === "DICE") {
        this.setState({ tickets: [1, 2, 3, 4, 5, 6] });
      } else if (template === "COIN") {
        this.setState({ tickets: [1, 0] });
      }
    }
  };
})();

export default module;
