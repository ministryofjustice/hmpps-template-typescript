import { mockClient } from 'aws-sdk-client-mock'
import { SendMessageCommand, SendMessageCommandInput, SQSClient } from '@aws-sdk/client-sqs'

import HmppsAuditClient, { SqsMessage } from './hmppsAuditClient'

describe('hmppsAuditClient', () => {
  const sqsMock = mockClient(SQSClient)
  let hmppsAuditClient: HmppsAuditClient

  const auditClientConfig = {
    queueUrl: 'http://localhost:4566/000000000000/mainQueue',
    region: 'eu-west-2',
    serviceName: 'hmpps-service',
    enabled: true,
  }

  afterEach(() => {
    sqsMock.reset()
    jest.resetAllMocks()
  })

  describe('sendMessage', () => {
    it('should send sqs message to audit queue', async () => {
      sqsMock.on(SendMessageCommand).resolves({ MessageId: '123' })
      hmppsAuditClient = new HmppsAuditClient({
        ...auditClientConfig,
        queueUrl: 'http://localhost:4566/000000000000/mainQueue',
      })

      const actualResponse = await hmppsAuditClient.sendMessage({
        what: 'EXAMPLE_EVENT',
        who: 'user1',
        subjectId: 'subject123',
        subjectType: 'exampleType',
        correlationId: 'request123',
        details: { extraDetails: 'example' },
      })

      const expectedSqsMessageBody: SqsMessage = {
        what: 'EXAMPLE_EVENT',
        who: 'user1',
        when: expect.any(String),
        service: 'hmpps-service',
        subjectId: 'subject123',
        subjectType: 'exampleType',
        correlationId: 'request123',
        details: JSON.stringify({ extraDetails: 'example' }),
      }

      expect(actualResponse).toEqual({ MessageId: '123' })

      const actualMessageInput = sqsMock.call(0).args[0].input as SendMessageCommandInput

      expect(actualMessageInput.QueueUrl).toEqual('http://localhost:4566/000000000000/mainQueue')

      const actualMessageBody = JSON.parse(actualMessageInput.MessageBody)
      expect(actualMessageBody).toEqual(expectedSqsMessageBody)

      const eventTime = Date.parse(actualMessageBody.when)
      expect(eventTime).not.toBeNaN()
      expect(eventTime).toBeGreaterThan(-1)
      expect(Date.now() - eventTime).toBeLessThan(1000)

      expect(sqsMock.calls().length).toEqual(1)
    })

    it("shouldn't send sqs message to audit queue if client disabled", async () => {
      sqsMock.on(SendMessageCommand).resolves({ MessageId: '123' })
      hmppsAuditClient = new HmppsAuditClient({ ...auditClientConfig, enabled: false })

      await hmppsAuditClient.sendMessage({
        what: 'EXAMPLE_EVENT',
        who: 'user1',
      })

      expect(sqsMock.calls().length).toEqual(0)
    })

    it("shouldn't throw an error if sqs message cannot be sent", async () => {
      sqsMock.on(SendMessageCommand).rejects(new Error('Error sending sqs message'))
      hmppsAuditClient = new HmppsAuditClient({ ...auditClientConfig })

      const trySendMessage = async () => {
        await hmppsAuditClient.sendMessage(
          {
            what: 'EXAMPLE_EVENT',
            who: 'user1',
          },
          false,
        )
      }

      expect(trySendMessage()).resolves.not.toThrow()
      expect(sqsMock.calls().length).toEqual(1)
    })

    it('should throw an error if sqs message cannot be sent', async () => {
      sqsMock.on(SendMessageCommand).rejects(new Error('Error sending sqs message'))
      hmppsAuditClient = new HmppsAuditClient({ ...auditClientConfig })

      const trySendMessage = async () => {
        await hmppsAuditClient.sendMessage({
          what: 'EXAMPLE_EVENT',
          who: 'user1',
        })
      }

      expect(trySendMessage()).rejects.toThrow('Error sending sqs message')
      expect(sqsMock.calls().length).toEqual(1)
    })
  })
})
