const viewGenerator = require('./plop-10.168.1.245lates/view/prompt')
const componentGenerator = require('./plop-templates/component/prompt')

module.exports = function(plop) {
  plop.setGenerator('view', viewGenerator)
  plop.setGenerator('component', componentGenerator)
}
