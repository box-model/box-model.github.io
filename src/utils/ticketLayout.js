// Geometry shared by the box and the sample area: tickets sit in a grid of
// three rows that grows to the right, so the same index lands at the same
// spot in either area.
export const TICKET_WIDTH = 100;
const PADDING = 10;
const COLUMN_WIDTH = 110;
const ROW_HEIGHT = 60;
const ROWS = 3;

export function ticketPosition(index) {
  return {
    left: PADDING + Math.floor(index / ROWS) * COLUMN_WIDTH,
    top: PADDING + (index % ROWS) * ROW_HEIGHT
  };
}

// Is the ticket at `index` fully inside the visible part of the scrolling
// container?
export function isTicketVisible(container, index) {
  const left = ticketPosition(index).left;
  return (
    left >= container.scrollLeft &&
    left + TICKET_WIDTH <= container.scrollLeft + container.clientWidth
  );
}

// Scroll the container so the ticket at `index` is centred, easing over
// `duration` ms, then call done. A duration of 0 jumps immediately.
export function scrollToTicket(container, index, duration, done) {
  const left = ticketPosition(index).left;
  const maxScroll = Math.max(0, container.scrollWidth - container.clientWidth);
  const target = Math.min(
    maxScroll,
    Math.max(0, left - (container.clientWidth - TICKET_WIDTH) / 2)
  );
  const start = container.scrollLeft;
  if (duration <= 0 || Math.abs(target - start) < 1) {
    container.scrollLeft = target;
    done();
    return;
  }
  const startTime = performance.now();
  const step = now => {
    const t = Math.min(1, (now - startTime) / duration);
    // ease in and out
    const eased = t < 0.5 ? 2 * t * t : 1 - Math.pow(-2 * t + 2, 2) / 2;
    container.scrollLeft = start + (target - start) * eased;
    if (t < 1) window.requestAnimationFrame(step);
    else done();
  };
  window.requestAnimationFrame(step);
}
