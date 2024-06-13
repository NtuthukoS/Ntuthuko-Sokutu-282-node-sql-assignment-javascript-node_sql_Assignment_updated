const createResolvedPromise = (value) => {
  return Promise.resolve(value);
};

module.exports = {
  createResolvedPromise,
};
