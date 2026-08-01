# GHL Snapshot — WGL MAIN FORM Automation

This folder documents the one automation currently wired to the Watts Growth Labs website: tag + notify + pipeline on form submission. Paste each file into its corresponding GHL field, in the order below.

---

## What This Covers

The WGL homepage (`index1.html`) has a live GHL-native form embed — **WGL MAIN FORM** (ID `qfDgFA4IDM0vszRbIlob`) — with 5 fields: Name, Email, Phone, Business Name, Website or Primary Social Link. On submit:

1. Contact is tagged `wgl-new-lead`
2. An internal notification email goes to `hello@riteshwatts.com`
3. An acknowledgment email goes to the applicant (short "entry logged" confirmation)
4. A qualification/next-step email goes to the applicant asking for a reply on 4 alignment points
5. An opportunity is created in the **Watts Growth Labs - Client Acquisition** pipeline, stage **New Lead**

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
│   ├── ET-02-contact-form-ack-contact.md                  ← Sent to the applicant — short "entry logged" confirmation
│   └── ET-03-contact-form-qualification.md                ← Sent to the applicant — 4-point qualification, asks for a reply
│
└── Opportunities/
    └── wgl-client-acquisition-pipeline.md                 ← 2-stage pipeline: New Lead → Contacted
```

---

## GHL Setup Instructions

### Step 1 — Create the Custom Fields

**Settings → Custom Fields → Contacts**

| Field Label | Key | Type |
|---|---|---|
| Business Name (WGL) | `business_name_wgl` | Single Line Text |
| Website or Primary Social Link (WGL) | `website_or_primary_link_wgl` | Single Line Text |

> `{{contact.name}}`, `{{contact.email}}`, and `{{contact.phone}}` are GHL standard fields — no setup needed for those. See `Forms/wgl-main-form.md` for the full field mapping.
>
> Also create the Custom Value `growth_manager_name` under **Settings → Custom Values** — it's the signature name on the qualification email (`Email-Templates/ET-03-contact-form-qualification.md`).

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
| 4 | Send Email | To `{{contact.email}}`, HTML from `Email-Templates/ET-03-contact-form-qualification.md` |
| 5 | Create/Update Opportunity | Pipeline `Watts Growth Labs - Client Acquisition`, Stage `New Lead`, Name `{{contact.name}} — {{contact.business_name_wgl}}` |

---

## Key Rules Reference

| Rule | Detail |
|---|---|
| Business Name field | Custom field `business_name_wgl` — **not** the standard `company_name` field used on the Aifyze form. Do not mix these two up. |
| Website/Link field | Custom field `website_or_primary_link_wgl` |
| Admin recipient | `hello@riteshwatts.com` (not a shared inbox) |
| Applicant emails | Two separate emails, in order: ET-02 (short "entry logged" confirmation, no reply expected) then ET-03 (qualification email, expects a reply with the 4 alignment points) |
| Growth Manager signature | Custom Value `growth_manager_name` — set once under `Settings → Custom Values`, used as the sign-off on ET-03 |
| Pipeline / Opportunity | `Watts Growth Labs - Client Acquisition`, created as the last workflow action — kept to 2 stages (New Lead, Contacted) for now |
| Email brand tokens | Bronze `#a27e4b` accent, warm-ivory light background (`#FAF8F4`/`#FFFFFF`) — see Design Notes in each Email-Templates file for why the email isn't literally dark-themed like the live site |
