const module = (function() {
  return {
    handleAlert: function(msg) {
      this.setState({ alert: msg });
    },
    clearAlert: function() {
      this.setState({ alert: null });
    }
  };
})();

export default module;
