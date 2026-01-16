# Zoho Flow Email Setup Instructions

## Email Template for New Lead Notifications

This email template will be sent to Kamil whenever a new lead is submitted through the VRS Specialists contact form.

## Setup Steps in Zoho Flow

1. **Add Email Action** to your flow after the webhook trigger
2. **Configure Email Settings:**
   - **To:** Kamil's email address
   - **Subject:** `New Lead: ${webhookTrigger.payload.firstName} ${webhookTrigger.payload.lastName} - ${webhookTrigger.payload.service}`
   - **Email Type:** HTML
   - **Body:** Copy the content from `new-lead-email-template-zoho.html`

## Variable Mapping

The email template uses the following Zoho Flow variables:

- `${webhookTrigger.payload.firstName}` - Lead's first name
- `${webhookTrigger.payload.lastName}` - Lead's last name
- `${webhookTrigger.payload.email}` - Lead's email address
- `${webhookTrigger.payload.phone}` - Lead's phone number
- `${webhookTrigger.payload.service}` - Service interest
- `${webhookTrigger.payload.location}` - Preferred location
- `${webhookTrigger.payload.vehicleMake}` - Vehicle make
- `${webhookTrigger.payload.vehicleModel}` - Vehicle model
- `${webhookTrigger.payload.vehicleYear}` - Vehicle year
- `${webhookTrigger.payload.vehicleColour}` - Vehicle colour
- `${webhookTrigger.payload.message}` - Lead's message
- `${webhookTrigger.payload.source}` - Lead source (always "VRS Website Contact Form")
- `${webhookTrigger.payload.timestamp}` - Submission timestamp

## Email Features

- **Professional Design:** Clean, modern layout with dark header
- **Clickable Links:** Email and phone are clickable for easy contact
- **Reply Button:** Direct "Reply to Lead" button that opens email client
- **Organized Sections:** Contact info, vehicle details, and message clearly separated
- **Responsive:** Works well on desktop and mobile email clients

## Testing

After setting up the email action in Zoho Flow, test it by submitting a form on the website or using the test webhook script.

