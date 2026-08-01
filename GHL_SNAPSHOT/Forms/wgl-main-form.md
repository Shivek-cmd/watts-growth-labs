# Watts Growth Labs — WGL MAIN FORM

> Lives on the WGL homepage (`index1.html`), invite section — GHL native form embed. Submission triggers `Workflows/wgl-contact-form-lead-workflow.md`.

**GHL Form Name:** `WGL MAIN FORM`
**GHL Form ID:** `qfDgFA4IDM0vszRbIlob`
**Embed:** `https://api.leadconnectorhq.com/widget/form/qfDgFA4IDM0vszRbIlob`

---

## Form Fields

| Field Label | Required | Maps To |
|---|---|---|
| Name | Yes | `{{contact.name}}` |
| Email | Yes | `{{contact.email}}` |
| Phone | Yes | `{{contact.phone}}` |
| Business Name | Yes | `{{contact.business_name_wgl}}` |
| Website or Primary Social Link | Yes | `{{contact.website_or_primary_link_wgl}}` |

> `{{contact.name}}`, `{{contact.email}}`, and `{{contact.phone}}` are GHL **standard** fields — no setup needed.
>
> Business Name and Website/Primary Link are **custom** fields on this form: `business_name_wgl` and `website_or_primary_link_wgl`. Unlike the Aifyze contact form (which maps Business Name to the standard `company_name` field), WGL's Business Name question writes to this custom field instead — confirm both against `Settings → Custom Fields → Contacts` before wiring the workflow, and create them first if they don't exist yet (see below).

---

## Custom Field Setup

**Settings → Custom Fields → Contacts**

| Field Label | Key | Type |
|---|---|---|
| Business Name (WGL) | `business_name_wgl` | Single Line Text |
| Website or Primary Social Link (WGL) | `website_or_primary_link_wgl` | Single Line Text |

---

## What Happens on Submit

1. Form submission creates/updates the contact with the fields above.
2. `WGL — Contact Form Lead & Notify` fires (Form Submitted trigger) — see `Workflows/wgl-contact-form-lead-workflow.md`:
   - Adds tag `wgl-new-lead`
   - Sends internal notification email to `hello@riteshwatts.com` (`Email-Templates/ET-01-contact-form-internal-notification.md`)
   - Sends acknowledgment email to the applicant (`Email-Templates/ET-02-contact-form-ack-contact.md`)
   - Sends the qualification/next-step email to the applicant (`Email-Templates/ET-03-contact-form-qualification.md`)
   - Creates an opportunity in the **Watts Growth Labs - Client Acquisition** pipeline, stage **New Lead** (`Opportunities/wgl-client-acquisition-pipeline.md`)
