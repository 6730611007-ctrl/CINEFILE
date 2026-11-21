import { defineBoot } from '#q-app'
import { pinia } from '@/stores/pinia.js'

export default defineBoot(({ app }) => {
  app.use(pinia)
})
