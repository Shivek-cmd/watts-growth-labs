# GHL Snapshot — WGL MAIN FORM Automation

This folder documents the one automation currently wired to the Watts Growth Labs website: tag + notify + pipeline on form submission. Paste each file into its corresponding GHL field, in the order below.

---

## What This Covers

The WGL homepage (`index1.html`) has a live GHL-native form embed — **WGL MAIN FORM** (ID `qfDgFA4IDM0vszRbIlob`) — with 4 fields: Name, Email, Phone, Business Name. On submit:

1. Contact is tagged `wgl-new-lead`
2. An internal notification email goes to `hello@riteshwatts.com`
3. An acknowledgment email goes to the applicant
4. An opportunity is created in the **Watts Growth Labs - Client Acquisition** pipeline, stage **New Lead**

This is a lighter setup than the Aifyze snapshot (no chatbot, no knowledge bases, no scoring assessment) and the pipeline itself is intentionally minimal — two stages for now. Scope may grow later.

---

## Full File Map

```
GHL_SNAPSHOT/
├── README.md                                              ← This file
│
├── Forms/
│   └── wgl-main-form.md                                   ← Form fields + custom field mapping
│
├── Workflows/
│   └── wgl-contact-form-lead-workflow.md                  ← Trigger + 4 actions (tag, 2 emails, opportunity)
│
├── Email-Templates/                                       ← Premium HTML email templates (paste into GHL Send Email actions)
│   ├── ET-01-contact-form-internal-notification.md        ← Sent to hello@riteshwatts.com when the form is submitted
│   └── ET-02-contact-form-ack-contact.md                  ← Sent to the applicant who submitted the form
│
└── Opportunities/
    └── wgl-client-acquisition-pipeline.md                 ← 2-stage pipeline: New Lead → Contacted
```

---

## GHL Setup Instructions

### Step 1 — Create the Custom Field

**Settings → Custom Fields → Contacts**

| Field Label | Key | Type |
|---|---|---|
| Business Name (WGL) | `business_name_wgl` | Single Line Text |

> `{{contact.name}}`, `{{contact.email}}`, and `{{contact.phone}}` are GHL standard fields — no setup needed for those. See `Forms/wgl-main-form.md` for the full field mapping.

---

### Step 2 — Create the Tag

**Settings → Tags → Add**

`wgl-new-lead`

---

### Step 3 — Create the Pipeline

**CRM → Pipelines → Add Pipeline**

Name: `Watts Growth Labs - Client Acquisition`. Two stages: **New Lead → Contacted**. Full spec in `Opportunities/wgl-client-acquisition-pipeline.md`.

---

### Step 4 — Build the Workflow

**Automation → Workflows → Add Workflow**

Name it **WGL — Contact Form Lead & Notify**. Full spec in `Workflows/wgl-contact-form-lead-workflow.md`:

| Action | Type | Detail |
|---|---|---|
| Trigger | Form Submitted | `WGL MAIN FORM` |
| 1 | Add Tag | `wgl-new-lead` |
| 2 | Send Email | To `hello@riteshwatts.com`, HTML from `Email-Templates/ET-01-contact-form-internal-notification.md` |
| 3 | Send Email | To `{{contact.email}}`, HTML from `Email-Templates/ET-02-contact-form-ack-contact.md` |
| 4 | Create/Update Opportunity | Pipeline `Watts Growth Labs - Client Acquisition`, Stage `New Lead`, Name `{{contact.name}} — {{contact.business_name_wgl}}` |

---

## Key Rules Reference

| Rule | Detail |
|---|---|
| Business Name field | Custom field `business_name_wgl` — **not** the standard `company_name` field used on the Aifyze form. Do not mix these two up. |
| Admin recipient | `hello@riteshwatts.com` (not a shared inbox) |
| Pipeline / Opportunity | `Watts Growth Labs - Client Acquisition`, created as the last workflow action — kept to 2 stages (New Lead, Contacted) for now |
| Email brand tokens | Bronze `#a27e4b` accent, warm-ivory light background (`#FAF8F4`/`#FFFFFF`) — see Design Notes in each Email-Templates file for why the email isn't literally dark-themed like the live site |
