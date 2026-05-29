declare global {
  namespace NodeJS {
    interface ProcessEnv {
      NODE_ENV: string
      PORT?: string
      REDIS_PORT: string
      REDIS_AUTH_TOKEN: string
      APPLICATIONINSIGHTS_CONNECTION_STRING: string
      NO_HTTPS?: string
    }
  }
}

export {}
