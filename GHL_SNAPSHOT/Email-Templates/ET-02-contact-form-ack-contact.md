# ET-02 (HTML) — Watts Growth Labs Application — Acknowledgment to Applicant

**Template Name in GHL:** `ET-02 — Watts Growth Labs Application Acknowledgment`
**Used In:** `Workflows/wgl-contact-form-lead-workflow.md` (Action 3 — Send Email)
**Sent To:** The applicant who submitted the WGL MAIN FORM
**Trigger:** Same as the rest of the workflow — WGL MAIN FORM submitted

**Subject:**
```
We've received your application, {{contact.name}}
```

> Copy everything inside the code block below and paste it into GHL's HTML editor (Send Email action → switch to HTML/code view).

---
```html
<!DOCTYPE html><html lang="en" xmlns="http://www.w3.org/1999/xhtml" xmlns:v="urn:schemas-microsoft-com:vml" xmlns:o="urn:schemas-microsoft-com:office:office"><head>
  <meta charset="UTF-8">
  <meta http-equiv="X-UA-Compatible" content="IE=edge">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <meta name="format-detection" content="telephone=no,address=no,email=no,date=no,url=no">
  <title>We've Received Your Application</title>
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
    }
  </style>
</head>
<body style="margin:0;padding:0;background-color:#FAF8F4;width:100%;"><div style="display:none;font-size:1px;color:#FAF8F4;line-height:1px;max-height:0px;max-width:0px;opacity:0;overflow:hidden;">We've received your application — thank you for reaching out.&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;</div>

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
            <td class="email-body" style="padding:40px 46px 8px;">

              <!-- Eyebrow -->
              <p style="margin:0 0 14px;font-family:Arial,Helvetica,sans-serif;font-size:11px;letter-spacing:2.5px;text-transform:uppercase;color:#A27E4B;font-weight:700;text-align:center;">Watts Growth Labs &nbsp;&middot;&nbsp; Request Access</p>

              <!-- Headline -->
              <h1 class="hero-title" style="margin:0 0 20px;font-family:Georgia,'Times New Roman',serif;font-size:30px;line-height:1.25;color:#1A1712;font-weight:700;text-align:center;">Application Received</h1>

              <!-- Accent underline (centered) -->
              <table role="presentation" cellspacing="0" cellpadding="0" border="0" align="center" style="margin:0 auto 32px;"><tbody><tr>
                <td width="44" style="background-color:#A27E4B;height:3px;line-height:3px;font-size:0;">&nbsp;</td>
              </tr></tbody></table>

              <p style="margin:0 0 20px;font-family:Arial,Helvetica,sans-serif;font-size:16px;line-height:1.8;color:#4A453D;">Hi {{contact.name}},</p>
              <p style="margin:0 0 32px;font-family:Arial,Helvetica,sans-serif;font-size:16px;line-height:1.8;color:#4A453D;">Thank you for your application. We've received your details and our team will review it within <strong style="color:#1A1712;">2 business days</strong>.</p>

              <!-- Divider -->
              <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%"><tbody><tr><td style="border-top:1px solid #E5DFD4;height:1px;font-size:0;line-height:0;">&nbsp;</td></tr></tbody></table>
              <div style="height:28px;line-height:28px;font-size:0;">&nbsp;</div>

              <p style="margin:0 0 6px;font-family:Arial,Helvetica,sans-serif;font-size:16px;line-height:1.8;color:#4A453D;">Talk soon,</p>
              <p style="margin:0 0 4px;font-family:Georgia,'Times New Roman',serif;font-size:20px;line-height:1.2;color:#1A1712;font-weight:700;">The Watts Growth Labs Team</p>
              <p style="margin:0 0 28px;font-family:Arial,Helvetica,sans-serif;font-size:13px;line-height:1.7;color:#8A8478;">Invitation-Led Growth Partnerships<br><a href="mailto:partners@wattsgrowthlabs.com" style="color:#A27E4B;text-decoration:none;">partners@wattsgrowthlabs.com</a></p>

            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td style="padding:24px 46px;background-color:#FAF8F4;border-top:1px solid #E5DFD4;text-align:center;">
              <p style="margin:0 0 6px;font-family:Arial,Helvetica,sans-serif;font-size:12px;color:#8A8478;letter-spacing:0.5px;">Watts Growth Labs</p>
              <p style="margin:0;font-family:Arial,Helvetica,sans-serif;font-size:12px;color:#8A8478;letter-spacing:0.3px;">1925 18 Ave NE, Suite 115, Calgary, AB T2E 7T8 &nbsp;&middot;&nbsp; +1 (579) 569 9999</p>
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
| Layout | 600px table-based card, MSO-safe, hidden preheader | Same structure as ET-01, centered/applicant-facing variant |
| Accent bar | `--bronze` `#a27e4b` | Single-tone bar, top and under-headline |
| Card / page background | Not on dark site theme — chosen as light, email-safe equivalent | `#FFFFFF` card / `#FAF8F4` page |
| Headline font | `--serif` `'Instrument Serif'` (not email-safe) | Georgia serif fallback |
| Body font | `--sans` `'Inter'` (not email-safe) | Arial/Helvetica fallback |
| Sign-off | Matches Aifyze author-block convention, adapted | "The Watts Growth Labs Team" / "Invitation-Led Growth Partnerships" |
| Footer | Calgary address from `business_overview.md` footer block, "a Watts Group company" line removed per request | Watts Growth Labs / 1925 18 Ave NE, Suite 115, Calgary, AB T2E 7T8 &middot; +1 (579) 569 9999 |

> No logo — removed per request. The email opens straight into the accent bar and centered headline.
>
> Message simplified per request — no "public enrollment" / application-review framing, no 3-step "what happens next" teaser. Just a greeting, thanks, and a 2-business-day review promise.

## Outstanding Before Use

- [ ] Wire this HTML into a new **Send Email** action in `Workflows/wgl-contact-form-lead-workflow.md` (Action 3)
- [ ] Send a live test to confirm the bronze accent bar renders correctly in Gmail/Outlook
