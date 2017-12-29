import * as main from './main'

document.body.appendChild(main.renderer.domElement)

if (module.hot) {
  let currentRenderer = main.renderer
  module.hot.accept('./main', () => {
    const { renderer: newRenderer } = require('./main')
    document.body.removeChild(currentRenderer.domElement)
    document.body.appendChild(newRenderer.domElement)
    currentRenderer = newRenderer
  })
}
