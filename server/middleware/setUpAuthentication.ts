import type { Router } from 'express'
import express from 'express'
import passport from 'passport'
import flash from 'connect-flash'
import config from '../config'
import auth from '../authentication/auth'

const router = express.Router()

export default function setUpAuth(): Router {
  auth.init()

  router.use(passport.initialize())
  router.use(passport.session())
  router.use(flash())

  router.get('/autherror', (req, res) => {
    res.status(401)
    return res.render('autherror')
  })

  router.get('/login', passport.authenticate('oauth2'))

  router.get('/login/callback', (req, res, next) =>
    passport.authenticate('oauth2', {
      successReturnToOrRedirect: req.session.returnTo || '/',
      failureRedirect: '/autherror',
    })(req, res, next)
  )

  const authLogoutUrl = `${config.apis.hmppsAuth.externalUrl}/logout?client_id=${config.apis.hmppsAuth.apiClientId}&redirect_uri=${config.domain}`

  router.use('/logout', (req, res) => {
    if (req.user) {
      req.logout()
      req.session.destroy(() => res.redirect(authLogoutUrl))
      return
    }
    res.redirect(authLogoutUrl)
  })

  router.use((req, res, next) => {
    res.locals.user = req.user
    next()
  })

  return router
}
