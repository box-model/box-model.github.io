const module = (function() {
  return {
    OnAmountChange: function(event) {
      this.setState({ amount: event.target.value });
    },
    onQuickChange: function(event) {
      this.setState({ quickMode: event.target.checked });
    },
    OnModeChange: function(event) {
      this.setState({ mode: event.target.value });
    },
    handleChangeAggregate: function(e) {
      this.setState({ aggregate: e });
    }
  };
})();

export default module;
