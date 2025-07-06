import { RequestHandler } from "express"
import logger from "../../logger"
import { Services } from "../services"
import { Component } from "../@types/component"
import config from "../config"

export default function getFrontendComponents({ componentService }: Services): RequestHandler {
  return async (req, res, next) => {
    try {
      const { header, footer } = await componentService.getComponents(['header', 'footer'], res.locals.user.token) as any
      res.locals.feComponents = getFormattedFeComponents(header, footer)
      next()
    } catch (error) {
      logger.error(error, 'Failed to retrieve front end components')
      next()
    }
  }
}

function getFormattedFeComponents(header: Component, footer: Component) {
  const isLocal = header.css[0].indexOf("localhost") != -1;
  return {
        header: isLocal ? replaceLocalhostUrls(header.html): header.html,
        footer: isLocal ? replaceLocalhostUrls(footer.html): footer.html,
        cssIncludes: [...header.css, ...footer.css].map(replaceLocalhostUrls),
        jsIncludes: [...header.javascript, ...footer.javascript].map(replaceLocalhostUrls),
      }
}

function replaceLocalhostUrls(content: string) {
  return content.replace(/http:\/\/localhost:\d+/g, config.apis.frontendComponents.testUrl);
}