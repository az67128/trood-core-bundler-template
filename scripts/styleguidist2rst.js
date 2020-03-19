'use strict';

const fs = require('fs-extra');

function generateRst() {
  const styleguidistHtml = fs.readFileSync('docs/components/index.html', 'utf8')
  const template = fs.readFileSync('docs/styleguidist/index.template.rst', 'utf8')

  const bundleNameRegexp = /build\/bundle.*\.js/
  const bundleName = styleguidistHtml.match(bundleNameRegexp).toString()

  const rstContent = template.replace(bundleNameRegexp, bundleName)

  fs.writeFileSync('docs/styleguidist/index.rst', rstContent, 'utf8')
}

generateRst()
