import { Router } from 'express'
import populateCurrentUser from './populateCurrentUser'

export default function setUpCurrentUser(): Router {
  const router = Router({ mergeParams: true })
  router.use(populateCurrentUser())
  return router
}
