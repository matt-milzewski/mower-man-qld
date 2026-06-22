# Backend Setup Notes

## Static Site

Repository: `matt-milzewski/mower-man-qld`

The site uses the same low-cost static architecture pattern as the other Anchor-managed sites:

- S3 private origin bucket
- CloudFront distribution with clean URL rewriting
- CloudFormation template in `infra/cloudfront-site.yml`
- GitHub Actions deployment workflow in `.github/workflows/deploy.yml`
- Regional AWS resources default to `ap-southeast-2`

CloudFront itself is global. If `mowermanqld.com.au` is attached directly to the distribution, the ACM certificate ARN must still come from `us-east-1` because that is a CloudFront requirement.

## Anchor Forms

The frontend posts to:

```text
https://jp5by1qc4d.execute-api.ap-southeast-2.amazonaws.com/api/forms/mower-man-qld
```

The shared forms backend needs this site route:

```json
{
  "siteId": "mower-man-qld",
  "name": "Mower Man QLD",
  "recipientEmail": "info@anchorwebco.com.au",
  "allowedOrigins": [
    "https://mowermanqld.com.au",
    "https://www.mowermanqld.com.au"
  ],
  "requiredFields": ["name", "email", "phone", "address", "regular_service", "services"],
  "honeypotFields": ["company", "_gotcha", "website"],
  "replyToField": "email",
  "subjectPrefix": "[Mower Man QLD]",
  "spamThreshold": 2,
  "maxLinks": 3,
  "minimumSubmitMs": 3000
}
```

I added a workflow in `AnchorWebCo` named `Configure Mower Man QLD form` to apply this live without exposing the existing hidden GitHub secret value locally.
