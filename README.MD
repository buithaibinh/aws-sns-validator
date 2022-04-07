# Amazon SNS Message Validator for Node.js

The **Amazon SNS Message Validator for Node.js** library allows you to validate
that incoming HTTP(S) POST messages are valid Amazon SNS notifications. This
library is standalone and does not depend on the AWS SDK for JavaScript.

## Installation

The npm module's name is [`aws-sns-validator`](https://www.npmjs.com/package/aws-sns-validator). Install with npm or yarn:

```
npm i aws-sns-validator
```

or

```
yarn add aws-sns-validator
```

## Basic Usage

To validate a message, you can instantiate a `MessageValidator` object and pass
an SNS message. The message should be
the result of calling `JSON.parse` on the body of the HTTP(S) message sent by
SNS to your endpoint.

The message validator checks the `SigningCertURL`, `SignatureVersion`, and
`Signature` to make sure they are valid and consistent with the message data.

```javascript
import { MessageValidator } from 'aws-sns-validator';
const validator = new MessageValidator();
try {
    await validator.validate(message);
     // message has been validated and its signature checked.
} catch (error) {
     // Your message could not be validated.
}
```

## Notes

The SNS Message Validator relies on the Node crypto module and is only designed
to work on a server, not in a browser. The validation performed is only
necessary when subscribing HTTP(S)
