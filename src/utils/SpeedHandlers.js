import {
  SPEED_MIN,
  SPEED_MAX,
  SLOWEST_DRAW_TIME,
  FASTEST_DRAW_TIME
} from './Constants';

/// <summary>
/// Convert a slider position (0..SPEED_MAX) into milliseconds per ticket drawn.
/// The scale is logarithmic so each step feels like a similar relative change.
/// Position 0 is one ticket per second; SPEED_MAX means no animation at all.
/// </summary>
export function speedToAnimationTime(speed) {
  if (speed >= SPEED_MAX) return 0;
  const frac = speed / SPEED_MAX;
  return (
    SLOWEST_DRAW_TIME * Math.pow(FASTEST_DRAW_TIME / SLOWEST_DRAW_TIME, frac)
  );
}

const module = (function() {
  return {
    setSpeed: function(speed) {
      this.setState(
        { speed: speed, animationTime: speedToAnimationTime(speed) },
        // If an animation is mid-way, make its pending wait match the new speed.
        () => this.rescheduleWait()
      );
    },
    onSpeedChange: function(event) {
      this.setSpeed(parseInt(event.target.value));
    },
    // Back to the slow end: used once a sample drawn by hand has finished.
    resetSpeed: function() {
      // While the thumb is held down the browser keeps it under the pointer
      // and overrides any value we set, so wait for the release.
      if (this.sliderActive) {
        this.pendingReset = true;
        return;
      }
      this.setSpeed(SPEED_MIN);
    },
    // Called by the slider when the pointer is pressed on it and released.
    setSliderActive: function(active) {
      this.sliderActive = active;
      if (!active && this.pendingReset) {
        this.pendingReset = false;
        // Let the slider's own change event from the release settle first.
        setTimeout(() => this.resetSpeed(), 0);
      }
    },
    /// <summary>
    /// Run fn once the current animation interval has passed. Only one wait is
    /// ever pending (sampling is sequential), and it is remembered so that a
    /// speed change can shorten it or, at the "instant" setting, skip it.
    /// </summary>
    waitForAnimation: function(fn) {
      if (this.state.animationTime === 0) {
        fn();
        return;
      }
      const wait = { fn: fn, start: Date.now(), id: null };
      wait.id = setTimeout(() => {
        this.pendingWait = null;
        fn();
      }, this.state.animationTime);
      this.pendingWait = wait;
    },
    rescheduleWait: function() {
      const wait = this.pendingWait;
      if (!wait) return;
      clearTimeout(wait.id);
      const elapsed = Date.now() - wait.start;
      const remaining = Math.max(0, this.state.animationTime - elapsed);
      wait.id = setTimeout(() => {
        this.pendingWait = null;
        wait.fn();
      }, remaining);
    }
  };
})();

export default module;
