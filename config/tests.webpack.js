import Enzyme from 'enzyme'
import Adapter from 'enzyme-adapter-react-16'

Enzyme.configure({ adapter: new Adapter() })

require('babel-polyfill')
require('jasmine-ajax')
require('../src/index.js')

const testsContext = require.context('../src/', true, /\.test\.js/)
testsContext.keys().forEach(testsContext)

const sourcesContext = require.context('../src/', true, /\.js$/)
sourcesContext.keys().forEach(sourcesContext)
