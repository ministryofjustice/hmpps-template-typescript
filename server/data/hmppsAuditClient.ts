import { SendMessageCommand, SQSClient } from '@aws-sdk/client-sqs'
import logger from '../../logger'

export interface AuditEvent {
  what: string
  who: string
  subjectId?: string
  subjectType?: string
  correlationId?: string
  details?: object
}

export interface SqsMessage {
  what: string
  who: string
  when: string
  service: string
  subjectId?: string
  subjectType?: string
  correlationId?: string
  details?: string
}

export interface AuditClientConfig {
  queueUrl: string
  region: string
  serviceName: string
  enabled: boolean
}

export default class HmppsAuditClient {
  private sqsClient: SQSClient

  private queueUrl: string

  private serviceName: string

  private enabled: boolean

  constructor(config: AuditClientConfig) {
    this.enabled = config.enabled
    this.queueUrl = config.queueUrl
    this.serviceName = config.serviceName
    this.sqsClient = new SQSClient({ region: config.region })
  }

  async sendMessage(event: AuditEvent, throwOnError: boolean = true) {
    if (!this.enabled) return null

    const sqsMessage: SqsMessage = {
      ...event,
      details: JSON.stringify(event.details),
      service: this.serviceName,
      when: new Date().toISOString(),
    }

    try {
      const messageResponse = await this.sqsClient.send(
        new SendMessageCommand({ MessageBody: JSON.stringify(sqsMessage), QueueUrl: this.queueUrl }),
      )

      logger.info(`HMPPS Audit SQS message sent (${messageResponse.MessageId})`)

      return messageResponse
    } catch (error) {
      logger.error('Error sending HMPPS Audit SQS message, ', error)
      if (throwOnError) throw error
    }
    return null
  }
}
