// jest-mongodb-config.js
module.exports = {
  mongodbMemoryServerOptions: {
    instance: {
      dbName: 'jest'
    },
    binary: {
      version: '6.0.5', // version stable, à adapter
      skipMD5: true
    },
    autoStart: false
  }
};
