const tape = require('tape')
const crypto = require('./')

tape('randomBytes', async function (t) {
  const buffer = await crypto.randomBytes(100)
  t.ok(Buffer.isBuffer(buffer))
  t.notSame(await crypto.randomBytes(100), buffer)
  t.end()
})

tape('key pair', async function (t) {
  const keyPair = await crypto.keyPair()

  t.same(keyPair.publicKey.length, 32)
  t.same(keyPair.secretKey.length, 64)
  t.end()
})

tape('sign', async function (t) {
  const keyPair = await crypto.keyPair()
  const message = Buffer.from('hello world')

  const sig = await crypto.sign(message, keyPair.secretKey)

  t.same(sig.length, 64)
  t.ok(await crypto.verify(message, sig, keyPair.publicKey))
  t.notOk(await crypto.verify(message, Buffer.alloc(64), keyPair.publicKey))
  t.end()
})

tape('hash leaf', async function (t) {
  const data = Buffer.from('hello world')

  t.same(await crypto.data(data), Buffer.from('ccfa4259ee7c41e411e5770973a49c5ceffb5272d6a37f2c6f2dac2190f7e2b7', 'hex'))
  t.end()
})

tape('hash parent', async function (t) {
  const data = Buffer.from('hello world')

  const parent = await crypto.parent({
    index: 0,
    size: 11,
    hash: await crypto.data(data)
  }, {
    index: 2,
    size: 11,
    hash: await crypto.data(data)
  })

  t.same(parent, Buffer.from('43563406adba8b34b133fdca32d0a458c5be769615e01df30e6535ccd3c075f0', 'hex'))
  t.end()
})
