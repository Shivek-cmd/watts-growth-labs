# ET-01 (HTML) — Watts Growth Labs Application — Internal Notification to Ritesh

**Template Name in GHL:** `ET-01 — Watts Growth Labs Application Internal Notification`
**Used In:** `Workflows/wgl-contact-form-lead-workflow.md` (Action 2 — Send Email)
**Sent To:** `hello@riteshwatts.com`
**Trigger:** Same as the rest of the workflow — WGL MAIN FORM submitted

**Subject:**
```
New Watts Growth Labs Application — {{contact.name}}
```

> Copy everything inside the code block below and paste it into GHL's HTML editor (Send Email action → switch to HTML/code view).

---
```html
<!DOCTYPE html><html lang="en" xmlns="http://www.w3.org/1999/xhtml" xmlns:v="urn:schemas-microsoft-com:vml" xmlns:o="urn:schemas-microsoft-com:office:office"><head>
  <meta charset="UTF-8">
  <meta http-equiv="X-UA-Compatible" content="IE=edge">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <meta name="format-detection" content="telephone=no,address=no,email=no,date=no,url=no">
  <title>New Watts Growth Labs Application</title>
  <!--[if mso]>
  <noscript><xml><o:OfficeDocumentSettings><o:PixelsPerInch>96</o:PixelsPerInch></o:OfficeDocumentSettings></xml></noscript>
  <![endif]-->
  <style>
    body, table, td, a { -webkit-text-size-adjust: 100%; -ms-text-size-adjust: 100%; }
    table, td { mso-table-lspace: 0pt; mso-table-rspace: 0pt; }
    img { border: 0; height: auto; line-height: 100%; outline: none; text-decoration: none; -ms-interpolation-mode: bicubic; }
    body { margin: 0 !important; padding: 0 !important; background-color: #FAF8F4; width: 100% !important; }
    a { color: #A27E4B; }

    @media only screen and (max-width: 620px) {
      .email-container { width: 100% !important; }
      .email-body { padding: 32px 24px !important; }
      .hero-title { font-size: 22px !important; }
      .field-label { font-size: 11px !important; }
    }
  </style>
</head>
<body style="margin:0;padding:0;background-color:#FAF8F4;width:100%;"><div style="display:none;font-size:1px;color:#FAF8F4;line-height:1px;max-height:0px;max-width:0px;opacity:0;overflow:hidden;">{{contact.name}} from {{contact.business_name_wgl}} just applied through the Watts Growth Labs invite form.&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;</div>

  <!-- Outer wrapper -->
  <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%" style="background-color:#FAF8F4;">
    <tbody><tr>
      <td align="center" style="padding:32px 12px;">

        <!-- Email card -->
        <table class="email-container" role="presentation" cellspacing="0" cellpadding="0" border="0" width="600" style="background-color:#FFFFFF;border:1px solid #E5DFD4;border-radius:10px;overflow:hidden;">

          <!-- Top accent bar -->
          <tbody><tr>
            <td style="padding:0;font-size:0;line-height:0;background-color:#A27E4B;height:4px;line-height:4px;">&nbsp;</td>
          </tr>

          <!-- Body -->
          <tr>
            <td class="email-body" style="padding:40px 46px 40px;">

              <!-- Eyebrow -->
              <p style="margin:0 0 14px;font-family:Arial,Helvetica,sans-serif;font-size:11px;letter-spacing:2.5px;text-transform:uppercase;color:#A27E4B;font-weight:700;">Watts Growth Labs CRM &nbsp;&middot;&nbsp; New Application</p>

              <!-- Headline -->
              <h1 class="hero-title" style="margin:0 0 20px;font-family:Georgia,'Times New Roman',serif;font-size:28px;line-height:1.25;color:#1A1712;font-weight:700;">New Invite Application</h1>

              <!-- Accent underline -->
              <table role="presentation" cellspacing="0" cellpadding="0" border="0" style="margin-bottom:28px;"><tbody><tr>
                <td width="44" style="background-color:#A27E4B;height:3px;line-height:3px;font-size:0;">&nbsp;</td>
              </tr></tbody></table>

              <p style="margin:0 0 26px;font-family:Arial,Helvetica,sans-serif;font-size:16px;line-height:1.8;color:#4A453D;">A new application just came in through the Watts Growth Labs invite form.</p>

              <!-- Contact details -->
              <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%" style="margin-bottom:24px;background-color:#FAF8F4;border:1px solid #E5DFD4;border-radius:8px;">
                <tbody>
                  <tr>
                    <td style="padding:20px 22px 6px;">
                      <p style="margin:0 0 12px;font-family:Arial,Helvetica,sans-serif;font-size:15px;line-height:1.6;color:#1A1712;"><span class="field-label" style="display:inline-block;width:110px;color:#8A8478;font-size:12px;text-transform:uppercase;letter-spacing:1px;">Name</span> {{contact.name}}</p>
                      <p style="margin:0 0 12px;font-family:Arial,Helvetica,sans-serif;font-size:15px;line-height:1.6;color:#1A1712;"><span class="field-label" style="display:inline-block;width:110px;color:#8A8478;font-size:12px;text-transform:uppercase;letter-spacing:1px;">Email</span> {{contact.email}}</p>
                      <p style="margin:0 0 12px;font-family:Arial,Helvetica,sans-serif;font-size:15px;line-height:1.6;color:#1A1712;"><span class="field-label" style="display:inline-block;width:110px;color:#8A8478;font-size:12px;text-transform:uppercase;letter-spacing:1px;">Phone</span> {{contact.phone}}</p>
                      <p style="margin:0 0 20px;font-family:Arial,Helvetica,sans-serif;font-size:15px;line-height:1.6;color:#1A1712;"><span class="field-label" style="display:inline-block;width:110px;color:#8A8478;font-size:12px;text-transform:uppercase;letter-spacing:1px;">Business</span> {{contact.business_name_wgl}}</p>
                    </td>
                  </tr>
                </tbody>
              </table>

              <!-- Divider -->
              <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%"><tbody><tr><td style="border-top:1px solid #E5DFD4;height:1px;font-size:0;line-height:0;">&nbsp;</td></tr></tbody></table>
              <div style="height:28px;line-height:28px;font-size:0;">&nbsp;</div>

              <p style="margin:0;font-family:Arial,Helvetica,sans-serif;font-size:15px;line-height:1.7;color:#4A453D;">This lead has been tagged <strong style="color:#1A1712;">wgl-new-lead</strong> in the CRM.</p>

            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td style="padding:22px 46px;background-color:#FAF8F4;border-top:1px solid #E5DFD4;text-align:center;">
              <p style="margin:0;font-family:Arial,Helvetica,sans-serif;font-size:12px;color:#8A8478;letter-spacing:0.5px;">Watts Growth Labs &nbsp;&middot;&nbsp; Automated Notification</p>
            </td>
          </tr>

        </tbody></table>
        <!-- End email card -->

      </td>
    </tr>
  </tbody></table>

</body></html>
```
---

## Design Notes

| Element | Watts Growth Labs design token used (from `index1.html` `:root`) | Applied here |
|---|---|---|
| Layout | 600px table-based card, MSO-safe, hidden preheader | Same table-based structure as the Aifyze email standard |
| Accent bar | `--bronze` `#a27e4b` | Single-tone bar (site's dark theme has no secondary accent color to pair, unlike Aifyze's two-tone gradient stand-in) |
| Card background | Not on dark site theme — chosen as a light, email-safe equivalent | `#FFFFFF` |
| Page background | Not on dark site theme — chosen as a light, email-safe equivalent | `#FAF8F4` (warm ivory, evokes the bronze/luxury feel without a literal dark-mode-coded email) |
| Field card background | Same warm-ivory family as page bg | `#FAF8F4` |
| Border | Derived warm-neutral to match ivory palette | `#E5DFD4` |
| Headline font | `--serif` `'Instrument Serif'` (not email-safe) | Georgia serif fallback |
| Body font | `--sans` `'Inter'` (not email-safe) | Arial/Helvetica fallback |
| Primary accent | `--bronze` `#a27e4b` | Eyebrow text, field-label accent, accent bar/underline |
| Text colors | Derived dark warm-charcoal (`#1A1712`) / muted warm-gray (`#4A453D`, `#8A8478`) — light-theme equivalents of the site's dark-theme `--ink`/`--ink-dim` | Headline / body / labels respectively |
| Footer | Automated-notification line, "a Watts Group company" removed per request | Watts Growth Labs &middot; Automated Notification |

> No logo and no CTA button — removed per request. The email opens straight into the accent bar and headline, and closes with the tag confirmation line instead of a "Reply to" button.

## Outstanding Before Use

- [ ] Wire this HTML into a new **Send Email** action in `Workflows/wgl-contact-form-lead-workflow.md` (Action 2)
- [ ] Confirm `business_name_wgl` is the live custom field key for Business Name (see `Forms/wgl-main-form.md`) — create it first if it doesn't exist yet
- [ ] Send a live test to confirm the bronze accent bar and warm-ivory palette render correctly in Gmail/Outlook
