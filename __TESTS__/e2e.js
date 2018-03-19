/* eslint-env node */
/* eslint-env mocha */
/* eslint-disable func-names */

const {
  By,
  Builder,
} = require('selenium-webdriver')

const {
  expect,
} = require('chai')

describe('a test thing', function () {
  
  it('clicks on the things', async () => {
    const driver = await new Builder().forBrowser('chrome').build()
    driver.get('http://localhost:1234')
    const els = await driver.findElements(
      By.css('div')
    )

    els.forEach(async el => {
      await el.click()
      const txt = await el.getText()
      expect(txt).to.equal('X')

      const classNames = await el.getAttribute('class')
      expect(classNames).to.equal('poop-storm')
    })
  })
})
