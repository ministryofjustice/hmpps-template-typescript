import express, { Router } from 'express'

import healthcheck from '../services/healthCheck'
import type { ApplicationInfo } from '../applicationInfo'

export default function setUpHealthChecks(applicationInfo: ApplicationInfo): Router {
  const router = express.Router()

  router.get('/health', (req, res, next) => {
    healthcheck(applicationInfo, result => {
      if (!result.healthy) {
        res.status(503)
      }
      res.json(result)
    })
  })

  router.get('/ping', (req, res) =>
    res.send({
      status: 'UP',
    }),
  )

  router.get('/info', (req, res) => {
    res.json({
      uptime: process.uptime(),
      build: {
        buildNumber: applicationInfo.buildNumber,
        gitRef: applicationInfo.gitRef,
      },
      version: applicationInfo.buildNumber,
      productId: applicationInfo.productId,
    })
  })

  return router
}
