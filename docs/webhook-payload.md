# Contact Form Webhook Payload Structure

## Webhook URL
```
https://flow.zoho.eu/20111718033/flow/webhook/incoming?zapikey=1001.9a12e725a59a1e93a35316579605ec5c.faa42baf56fafa7b3801e6a83bb7506c&isdebug=false
```

## Payload Structure

The webhook receives a JSON payload with the following structure:

```json
{
  "name": "John Doe",
  "email": "john.doe@example.com",
  "phone": "+44 7700 900123",
  "service": "Car Detailing",
  "location": "Brighton",
  "vehicleMake": "BMW",
  "vehicleModel": "M3",
  "vehicleYear": "2023",
  "vehicleColour": "Black",
  "message": "I'm interested in a full detail for my BMW M3. Please contact me to discuss availability.",
  "source": "VRS Website Contact Form",
  "timestamp": "2026-01-13T16:31:00.479Z"
}
```

## Field Descriptions

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `name` | string | Yes | Customer's full name |
| `email` | string | Yes | Customer's email address |
| `phone` | string | Yes | Customer's phone number |
| `message` | string | Yes | Customer's message/enquiry |
| `service` | string | No | Service of interest (e.g., "Car Detailing", "Paint Correction", "Ceramic Coating", "PPF Protection") |
| `location` | string | No | Preferred location (e.g., "Brighton", "Studio", "Mobile") |
| `vehicleMake` | string | No | Vehicle manufacturer (e.g., "BMW", "Audi", "Porsche") |
| `vehicleModel` | string | No | Vehicle model (e.g., "M3", "A4", "911") |
| `vehicleYear` | string | No | Vehicle year (e.g., "2023", "2020") |
| `vehicleColour` | string | No | Vehicle colour (e.g., "Black", "Silver", "Red") |
| `source` | string | Yes | Always "VRS Website Contact Form" |
| `timestamp` | string | Yes | ISO 8601 timestamp of submission |

## HTTP Method
- **Method**: `POST`
- **Content-Type**: `application/json`

## Response
- **Success**: `{"status":"Success: test request received"}`
- **Status Code**: `200`

## Example Mapping for Lead Connector

When setting up field mapping in your lead connector system, you can map:

- **First Name**: Extract from `name` field (first word)
- **Last Name**: Extract from `name` field (remaining words)
- **Email**: `email`
- **Phone**: `phone`
- **Message/Notes**: `message`
- **Service Interest**: `service`
- **Location**: `location`
- **Vehicle Details**: Combine `vehicleMake`, `vehicleModel`, `vehicleYear`, `vehicleColour`
- **Source**: `source`
- **Submitted At**: `timestamp`

