import { createFiberRoot } from './reconciler'

function render (element, container) {
  createFiberRoot(element, container)
}

export default render
