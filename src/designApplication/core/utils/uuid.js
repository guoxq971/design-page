export function uuid() {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'
    .replace(/[xy]/g, function (c) {
      // eslint-disable-next-line
      var r = (Math.random() * 16) | 0,
        // eslint-disable-next-line
        v = c == 'x' ? r : (r & 0x3) | 0x8;
      // eslint-disable-next-line
      return v.toString(16);
    })
    .toUpperCase();
}
