import { NextRequest, NextResponse } from "next/server";

// Rate limiting - simple in-memory store (use Redis in production)
const rateLimitMap = new Map<string, { count: number; resetTime: number }>();
const RATE_LIMIT_WINDOW = 60 * 1000; // 1 minute
const RATE_LIMIT_MAX = 5; // 5 requests per minute

function checkRateLimit(ip: string): boolean {
  const now = Date.now();
  const record = rateLimitMap.get(ip);

  if (!record || now > record.resetTime) {
    rateLimitMap.set(ip, { count: 1, resetTime: now + RATE_LIMIT_WINDOW });
    return true;
  }

  if (record.count >= RATE_LIMIT_MAX) {
    return false;
  }

  record.count++;
  return true;
}

export async function POST(request: NextRequest) {
  try {
    // Get client IP for rate limiting
    const ip = request.headers.get("x-forwarded-for") || 
               request.headers.get("x-real-ip") || 
               "unknown";

    // Check rate limit
    if (!checkRateLimit(ip)) {
      return NextResponse.json(
        { error: "Too many requests. Please try again later." },
        { status: 429 }
      );
    }

    const body = await request.json();

    // Validate required fields
    const { firstName, lastName, email, phone, service, location, message, honeypot } = body;

    // Honeypot check
    if (honeypot) {
      // Silent fail for bots
      return NextResponse.json({ success: true });
    }

    if (!firstName || !lastName || !email || !phone || !message) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    // Basic email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { error: "Invalid email address" },
        { status: 400 }
      );
    }

    // Sanitize inputs (basic - use a library like DOMPurify for production)
    const sanitize = (str: string) => str.trim().replace(/[<>]/g, "");

    const sanitizedData = {
      firstName: sanitize(firstName),
      lastName: sanitize(lastName),
      email: sanitize(email),
      phone: sanitize(phone),
      service: service ? sanitize(service) : "",
      location: location ? sanitize(location) : "",
      vehicleMake: body.vehicleMake ? sanitize(body.vehicleMake) : "",
      vehicleModel: body.vehicleModel ? sanitize(body.vehicleModel) : "",
      vehicleYear: body.vehicleYear ? sanitize(body.vehicleYear) : "",
      vehicleColour: body.vehicleColour ? sanitize(body.vehicleColour) : "",
      message: sanitize(message),
    };

    // Send to webhook
    const webhookUrl = process.env.CONTACT_WEBHOOK_URL || 
      "https://flow.zoho.eu/20111718033/flow/webhook/incoming?zapikey=1001.9a12e725a59a1e93a35316579605ec5c.faa42baf56fafa7b3801e6a83bb7506c&isdebug=false";

    try {
      const webhookResponse = await fetch(webhookUrl, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          firstName: sanitizedData.firstName,
          lastName: sanitizedData.lastName,
          email: sanitizedData.email,
          phone: sanitizedData.phone,
          service: sanitizedData.service,
          location: sanitizedData.location,
          vehicleMake: sanitizedData.vehicleMake,
          vehicleModel: sanitizedData.vehicleModel,
          vehicleYear: sanitizedData.vehicleYear,
          vehicleColour: sanitizedData.vehicleColour,
          message: sanitizedData.message,
          source: "VRS Website Contact Form",
          timestamp: new Date().toISOString(),
        }),
      });

      if (!webhookResponse.ok) {
        console.error("Webhook error:", await webhookResponse.text());
        // Still return success to user even if webhook fails
        // Log error for monitoring
      }
    } catch (webhookError) {
      console.error("Webhook request failed:", webhookError);
      // Still return success to user even if webhook fails
      // Log error for monitoring
    }

    return NextResponse.json(
      { 
        success: true, 
        message: "Thank you for your enquiry. We'll get back to you soon." 
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Contact form error:", error);
    return NextResponse.json(
      { error: "Something went wrong. Please try again later." },
      { status: 500 }
    );
  }
}

