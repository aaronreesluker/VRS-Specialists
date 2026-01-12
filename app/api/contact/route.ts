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
    const { name, email, phone, service, location, message, honeypot } = body;

    // Honeypot check
    if (honeypot) {
      // Silent fail for bots
      return NextResponse.json({ success: true });
    }

    if (!name || !email || !phone || !message) {
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
      name: sanitize(name),
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

    // In production, send email using a service like:
    // - Resend (recommended)
    // - SendGrid
    // - AWS SES
    // - Nodemailer with SMTP

    // For now, log the submission (replace with actual email service)
    console.log("Contact form submission:", sanitizedData);

    // TODO: Replace with actual email service
    // Example with Resend:
    // const resend = new Resend(process.env.RESEND_API_KEY);
    // await resend.emails.send({
    //   from: "contact@vrsspecialists.com",
    //   to: "info@vrsspecialists.com",
    //   subject: `New enquiry from ${sanitizedData.name}`,
    //   html: formatEmailTemplate(sanitizedData),
    // });

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

