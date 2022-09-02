const createCookie = (name, value, time) => {
  const date = new Date();
  const ONEDAY = 24 * 60 * 60 * 1000;
  date.setTime(date.getTime() + time * ONEDAY);
  document.cookie = `${name} = ${value} ;expires ${date.toUTCString()} ;path=/`;
};
