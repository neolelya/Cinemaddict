const DEBOUNCE_INTERVAL = 300;

export const debounce = (cb) => {
  let lastTimeout = null;

  return function () {
    if (lastTimeout) {
      window.clearTimeout(lastTimeout);
    }

    lastTimeout = window.setTimeout(function () {
      cb();
    }, DEBOUNCE_INTERVAL);
  };
};
