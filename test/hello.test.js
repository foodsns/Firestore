// eslint-disable-next-line no-unused-vars
const assert = require('assert')
require('dotenv').config()

// eslint-disable-next-line no-undef

describe("Test hello world", () => {
    it("3 * 4 == 12", async () => {
        assert.equal(3 * 4, 12)
    })
})