# Mower Man QLD

Static website for Mower Man QLD, built from the Maryborough Mower Man site architecture.

## Local Development

```powershell
npm install
npm test
python -m http.server 4177
```

Open `http://localhost:4177`.

## Contact Form

The contact form posts to the shared Anchor Forms backend:

```text
https://jp5by1qc4d.execute-api.ap-southeast-2.amazonaws.com/api/forms/mower-man-qld
```

The backend still needs a `mower-man-qld` entry in `FORM_SITE_CONFIGS_JSON` before live submissions will be accepted.

## Deployment

The GitHub workflow provisions/syncs a static CloudFront + private S3 site in `ap-southeast-2`.

Required GitHub secrets:

- `AWS_ACCESS_KEY_ID`
- `AWS_SECRET_ACCESS_KEY`
- `AWS_REGION` set to `ap-southeast-2`

Recommended GitHub variables:

- `PRIMARY_DOMAIN_NAME`: `mowermanqld.com.au`
- `ACM_CERTIFICATE_ARN`: CloudFront certificate ARN from `us-east-1`
- `ANCHOR_FORMS_API_BASE`: `https://jp5by1qc4d.execute-api.ap-southeast-2.amazonaws.com`
