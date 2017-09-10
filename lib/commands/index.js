module.exports = (config, DOHelper) => {
  return {
    keys: (require('./keys')(config, DOHelper)),
    list_images: (require('./list_images')(config))
  }
};