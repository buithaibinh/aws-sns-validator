/* eslint-disable @typescript-eslint/no-explicit-any */
import { MessageValidator } from '../src/index';
import chai from 'chai';
const expect = chai.expect;

describe('test validate', () => {
  it('should throw 404', async () => {
    const validator = new MessageValidator();
    const message = {
      Type: 'SubscriptionConfirmation',
      MessageId: 'f99d8b74-656a-46a8-a194-545b31229e26',
      Token:
        '2336412f37fb687f5d51e6e2425dacbbab295b8a534f477ee003773c6e75c0d88a6c9815b86decae2b9971ea081e4ee21ae55607e07f98967730fb0eefbd1dec7fa7974f226c2b2b9f4adbce689a2ce4ed3bfb0f84af3e44141f5287f0f377dcb873584bc3004c9214b4572d38d6a1e7a9e7a7d154e4fff7a0d582aabc12d19f',
      TopicArn: 'arn:aws:sns:us-east-1:820710015775:MyTestingTopic',
      Message:
        'You have chosen to subscribe to the topic arn:aws:sns:us-east-1:820710015775:MyTestingTopic.\nTo confirm the subscription, visit the SubscribeURL included in this message.',
      SubscribeURL:
        'https://sns.us-east-1.amazonaws.com/?Action=ConfirmSubscription&TopicArn=arn:aws:sns:us-east-1:820710015775:MyTestingTopic&Token=2336412f37fb687f5d51e6e2425dacbbab295b8a534f477ee003773c6e75c0d88a6c9815b86decae2b9971ea081e4ee21ae55607e07f98967730fb0eefbd1dec7fa7974f226c2b2b9f4adbce689a2ce4ed3bfb0f84af3e44141f5287f0f377dcb873584bc3004c9214b4572d38d6a1e7a9e7a7d154e4fff7a0d582aabc12d19f',
      Timestamp: '2022-04-07T11:50:06.563Z',
      SignatureVersion: '1',
      Signature:
        'k7WqvIKR/CBk9iEwED5vvLYHv+8QBlOfYaRi9Fa7A8Rn+pqBSyAeNuKX+ozc45BbUCuRr8B1svOJYhJ6lT5/Jh+MypOZtiT10G2H4Rnuj0Dx3xQg+gf+lFDTNQ2JIBgHeE2XeHr2XfH9oUg0bnWCuueS4Gb27+3Az1u4TZmxqVcgKO7/C/GsuAUcI6z0pTo5t605MbkgmuJ0gz/jVbsAkg6uqoZzIb/Xd+S7P64lGTxSRsAaiIJ7WxFWUt4MMuMOQZcxauQb2lNkmCn19xEI0R/hBNVOioJwU7D62ZbFVmSWQQpe4JW1L7mSDwZ9ydv/uXlCoKn6u/GrAGcE39udqw==',
      SigningCertURL:
        'https://sns.us-east-1.amazonaws.com/SimpleNotificationService-7ff5318490ec183fbaddaa2a969abfda.pem',
    };
      const res = await validator.validate(message);
      expect(!!res).to.be.true;
  });
});
