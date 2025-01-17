import { useThrelte, watch, type CurrentWritable } from '@threlte/core'
import type { ComputeFunction } from './context'

export const getDefaultComputeFunction = (
  target: CurrentWritable<HTMLElement>
): ComputeFunction => {
  const { camera } = useThrelte()

  let width = 0
  let height = 0

  const resizeObserver = new ResizeObserver((entries) => {
    for (const entry of entries) {
      width = entry.contentRect.width
      height = entry.contentRect.height
    }
  })

  watch(target, (target) => {
    if (target) resizeObserver.observe(target)
    return () => {
      if (target) resizeObserver.unobserve(target)
    }
  })

  return (event, state) => {
    state.pointer.update((pointer) => {
      pointer.set((event.offsetX / width) * 2 - 1, -(event.offsetY / height) * 2 + 1)
      return pointer
    })
    state.raycaster.setFromCamera(state.pointer.current, camera.current)
  }
}
