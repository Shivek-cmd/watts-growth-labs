# Watts Growth Labs — Client Acquisition Pipeline

> Set this up under CRM → Pipelines in GHL. Kept intentionally minimal for now — two stages only.

---

## Pipeline Name

**Watts Growth Labs - Client Acquisition**

---

## Stages

| # | Stage | Fires From |
|---|---|---|
| 1 | New Lead | WGL MAIN FORM submitted |
| 2 | Contacted | Manual — team makes first outreach |

---

## Stage 1 — New Lead

**When it fires:** `Workflows/wgl-contact-form-lead-workflow.md` creates the opportunity here automatically when the WGL MAIN FORM is submitted.

**Opportunity Name:** `{{contact.name}} — {{contact.business_name_wgl}}`

**Opportunity Source:** `Watts Growth Labs - Invite Form (Website)`

---

## Stage 2 — Contacted

**When it fires:** Manually moved once the team makes first outreach (call, email, or DM) to the applicant.

---

## GHL Setup Notes

- Go to CRM → Pipelines → Add Pipeline → name it **Watts Growth Labs - Client Acquisition**
- Two stages in order: **New Lead → Contacted**
- More stages (Under Review, Call Scheduled, Partner, Not a Fit) can be added later once volume justifies it — kept to two for now per request
