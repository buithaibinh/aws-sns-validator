/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
/* eslint-disable @typescript-eslint/no-explicit-any */
import crypto from "crypto";
import request from "requestretry";
import LRU from "lru-cache";

// must start with https:// and we only want to download certificates from AWS
const CERT_URL_PATTERN =
  /^https:\/\/sns\.[a-zA-Z0-9-]{3,}\.amazonaws\.com(\.cn)?\/SimpleNotificationService-[a-zA-Z0-9]{32}\.pem$/;

// maximum of 5000 certificates and the certificates expire after 1 minute from the cache.
const CERT_CACHE = new LRU({ max: 5000, ttl: 1000 * 60 });

/**
 *  We have to download the certificate before we can verify the signature.
 * Downloading things can fail for many reasons. Therefore, we retry failed download requests.
 * To optimize for performance, we also want to cache downloaded certificates.
 * @param certUrl the url to download the certificate from
 * @returns the certificate
 */
const fetchCert = (certUrl: string) => {
  return new Promise((resolve, reject) => {
    const cachedCertificate = CERT_CACHE.get(certUrl);
    if (cachedCertificate) {
      return resolve(cachedCertificate);
    }

    request(
      {
        method: "GET",
        url: certUrl,
        maxAttempts: 3,
        retryDelay: 100,
        timeout: 3000,
      },
      (err, response, certificate) => {
        if (err) {
          return reject(err);
        }
        if (response.statusCode !== 200) {
          reject(
            new Error(
              `expected 200 status code, received: ${response.statusCode}`
            )
          );
        }

        CERT_CACHE.set(certUrl, certificate);
        return resolve(certificate);
      }
    );
  });
};

/**
 * According to the SNS documentation. (https://docs.aws.amazon.com/sns/latest/dg/sns-verify-signature-of-message.html)
 * we have to use different fields of the message based on the Type of the message delivered by SNS.
 * @param type the type of the message
 * @returns the field to use for the signature verification
 */
const fieldsForSignature = (type: string) => {
  if (
    type === "SubscriptionConfirmation" ||
    type === "UnsubscribeConfirmation"
  ) {
    return [
      "Message",
      "MessageId",
      "SubscribeURL",
      "Timestamp",
      "Token",
      "TopicArn",
      "Type",
    ];
  } else if (type === "Notification") {
    return ["Message", "MessageId", "Subject", "Timestamp", "TopicArn", "Type"];
  } else {
    return [];
  }
};

export class MessageValidator {
  /**
   * Verifies the signature of the message.
   * @param message sns incoming message
   * @returns true if the signature is valid
   */
  async validate(message: any): Promise<any> {
    // we do some input validation:
    // 1. the fields SignatureVersion, SigningCertURL, Type, and Signature must be available
    if (
      !(
        "SignatureVersion" in message &&
        "SigningCertURL" in message &&
        "Type" in message &&
        "Signature" in message
      )
    ) {
      throw new Error("missing field");
    }

    // 2. SignatureVersion must be 1
    if (message.SignatureVersion !== "1") {
      throw new Error("invalid SignatureVersion");
    }

    // 3. The SigningCertURL must start with https:// and we only want to download certificates from AWS
    if (!CERT_URL_PATTERN.test(message.SigningCertURL)) {
      throw new Error("invalid certificate URL");
    }

    // 4. Validate the signature by downloading the certificate and verifying the signature
    const certificate: any = await fetchCert(message.SigningCertURL);
    const verify = crypto.createVerify("sha1WithRSAEncryption");
    fieldsForSignature(message.Type).forEach((key) => {
      if (key in message) {
        verify.write(`${key}\n${message[key]}\n`);
      }
    });
    verify.end();
    const result = verify.verify(certificate, message.Signature, "base64");

    if (!result) {
      throw new Error("The message signature is invalid.");
    }
    return message;
  }
}
