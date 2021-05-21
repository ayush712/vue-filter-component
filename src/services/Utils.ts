export const debounce = (fn: Function, delay: number) => {
  let inDebounce: any;
  return function () {
    //@ts-ignore
    const context = this;
    clearTimeout(inDebounce);
    inDebounce = setTimeout(() => {
      fn.apply(context, arguments);
    }, delay);
  };
};
