var sodium = require('sodium-universal')

var sodiumAsync = {}

Object.keys(sodium).forEach((key) => {
  sodiumAsync[key] = typeof sodium[key] === 'function'
    ? async (...args) => {
      const resolved = await Promise.all(args)
      return sodium[key](...resolved)
    }
    : sodium[key]
})

module.exports = sodiumAsync
