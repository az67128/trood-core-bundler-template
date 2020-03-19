'use strict';

const fs = require('fs-extra');

function generateRst() {
  const styleguidistHtml = fs.readFileSync('docs/components/index.html', 'utf8')
  const template = fs.readFileSync('docs/styleguidist/components.template.rst', 'utf8')

  const componentNameRegexp = /\$\{ComponentName\}/g
  const bundleNameRegexp = /build\/bundle.*\.js/g
  const bundleName = styleguidistHtml.match(bundleNameRegexp).toString()

  fs.readdirSync('src/components', { withFileTypes: true, encoding: 'utf8' })
    .forEach(componentDirent => {
      if (componentDirent.isDirectory()) {
        const componentName = componentDirent.name
        const componentDirContent = fs.readdirSync('src/components/' + componentName)
        if (componentDirContent.includes('index.js')) {
          const rstContent = template
            .replace(componentNameRegexp, componentName)
            .replace(bundleNameRegexp, bundleName)

          fs.writeFileSync('docs/styleguidist/components/' + componentName + '.rst', rstContent, 'utf8')
        }
      }
    })
}

generateRst()
