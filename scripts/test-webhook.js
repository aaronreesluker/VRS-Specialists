// Test script to send a sample payload to the webhook for mapping
const webhookUrl = "https://flow.zoho.eu/20111718033/flow/webhook/incoming?zapikey=1001.9a12e725a59a1e93a35316579605ec5c.faa42baf56fafa7b3801e6a83bb7506c&isdebug=false";

const samplePayload = {
  name: "John Doe",
  email: "john.doe@example.com",
  phone: "+44 7700 900123",
  service: "Car Detailing",
  location: "Brighton",
  vehicleMake: "BMW",
  vehicleModel: "M3",
  vehicleYear: "2023",
  vehicleColour: "Black",
  message: "I'm interested in a full detail for my BMW M3. Please contact me to discuss availability.",
  source: "VRS Website Contact Form",
  timestamp: new Date().toISOString(),
};

async function testWebhook() {
  try {
    console.log("Sending test payload to webhook...");
    console.log("Payload:", JSON.stringify(samplePayload, null, 2));
    
    const response = await fetch(webhookUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(samplePayload),
    });

    const responseText = await response.text();
    
    console.log("\nResponse Status:", response.status);
    console.log("Response Headers:", Object.fromEntries(response.headers.entries()));
    console.log("Response Body:", responseText);

    if (response.ok) {
      console.log("\n✓ Webhook test successful!");
    } else {
      console.log("\n✗ Webhook test failed");
    }
  } catch (error) {
    console.error("Error testing webhook:", error);
  }
}

testWebhook();

