# Workflow: WGL — Contact Form Lead &amp; Notify

> Fires whenever the WGL MAIN FORM (`Forms/wgl-main-form.md`) is submitted.
> Tags the contact, sends three notification emails, and creates the opportunity in the **Watts Growth Labs - Client Acquisition** pipeline (`Opportunities/wgl-client-acquisition-pipeline.md`).

---

## Trigger

**Trigger Type:** Form Submitted

**Filter:** Form is `WGL MAIN FORM` (Name, Email, Phone, Business Name, Website or Primary Social Link)

---

## Action 1 — Add Tag

**Action Type:** Add Tag

**Tag to apply:** `wgl-new-lead`

> Applied to every contact who submits the WGL MAIN FORM.

---

## Action 2 — Send Email (Internal Notification)

**Action Type:** Send Email

**To:** `hello@riteshwatts.com`

**Template:** `Email-Templates/ET-01-contact-form-internal-notification.md`

**Subject:** `New WGL Application — {{contact.name}}`

---

## Action 3 — Send Email (Applicant Acknowledgment)

**Action Type:** Send Email

**To:** `{{contact.email}}`

**Template:** `Email-Templates/ET-02-contact-form-ack-contact.md`

**Subject:** `Your entry has been logged, {{contact.name}}`

---

## Action 4 — Send Email (Qualification / Next Step)

**Action Type:** Send Email

**To:** `{{contact.email}}`

**Template:** `Email-Templates/ET-03-contact-form-qualification.md`

**Subject:** `Your Watts Growth Labs request — next step`

> Sent right after the acknowledgment email — ET-02 tells the applicant this email is on its way. This is the one that actually asks for a reply (the 4-point qualitative alignment check), so it needs `Settings → Custom Values → growth_manager_name` set before it goes live (see `Email-Templates/ET-03-contact-form-qualification.md`).

---

## Action 5 — Create/Update Opportunity

**Action Type:** Create and Update Opportunity

**Pipeline:** Watts Growth Labs - Client Acquisition

**Pipeline Stage:** New Lead

**Opportunity Name:** `{{contact.name}} — {{contact.business_name_wgl}}`

**Opportunity Source:** `Watts Growth Labs - Invite Form (Website)`

> Last action in the workflow — runs after all three notification emails. See `Opportunities/wgl-client-acquisition-pipeline.md` for the full pipeline spec.

---

## GHL Setup Notes

- Automation → Workflows → Add Workflow → name it **WGL — Contact Form Lead &amp; Notify**
- Trigger: **Form Submitted** → select `WGL MAIN FORM`
- Action 1: **Add Tag** → `wgl-new-lead`
- Action 2: **Send Email** → To: `hello@riteshwatts.com` → paste HTML from `Email-Templates/ET-01-contact-form-internal-notification.md`
- Action 3: **Send Email** → To: `{{contact.email}}` → paste HTML from `Email-Templates/ET-02-contact-form-ack-contact.md`
- Action 4: **Send Email** → To: `{{contact.email}}` → paste HTML from `Email-Templates/ET-03-contact-form-qualification.md`
- Action 5: **Create/Update Opportunity** → Pipeline: `Watts Growth Labs - Client Acquisition`, Stage: `New Lead`, Name: `{{contact.name}} — {{contact.business_name_wgl}}`, Source: `Watts Growth Labs - Invite Form (Website)`
- Confirm `business_name_wgl` and `website_or_primary_link_wgl` custom fields exist before activating (see `Forms/wgl-main-form.md`)
- Confirm the Custom Value `growth_manager_name` is set before activating (see `Email-Templates/ET-03-contact-form-qualification.md`)
- Confirm the **Watts Growth Labs - Client Acquisition** pipeline exists before activating (see `Opportunities/wgl-client-acquisition-pipeline.md`)
