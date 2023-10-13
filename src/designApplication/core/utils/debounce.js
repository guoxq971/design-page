/**
 * 防抖
 * @param {Function} fn
 * @param {Number} wait
 * @returns {Function}
 * @example
 * const debounceFn = debounce(() => {
 *  console.log('debounce');
 *  }, 1000);
 *  window.addEventListener('scroll', debounceFn);
 *  window.addEventListener('scroll', () => {
 *    console.log('no debounce');
 *  });
 * */
export function debounce(fn, wait = 200) {
  let timer = null;
  return function () {
    if (timer) clearTimeout(timer);
    timer = setTimeout(() => {
      fn.apply(this, arguments);
    }, wait);
  };
}
