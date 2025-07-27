import "dotenv-defaults/config";
import express, { RequestHandler } from "express";
import path from "path";
import { z } from "zod";
import { main } from "../main";
import { serviceRequestSchema } from "../schema";
import { ServiceRequest } from "../types";

const app = express();

// JSON parsing middleware with error handling
app.use(express.json({
  limit: '1mb' // Limit payload size
}));

// Error handling middleware for JSON parsing errors
app.use((err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
  if (err instanceof SyntaxError && 'body' in err) {
    return res.status(400).json({
      success: false,
      error: 'Invalid JSON in request body'
    });
  }
  next(err);
});

app.use(express.static(path.join(__dirname, '../../public')));

// Request logging middleware
app.use((req, res, next) => {
  const start = Date.now();
  res.on('finish', () => {
    const duration = Date.now() - start;
    console.log(`${req.method} ${req.path} - ${res.statusCode} - ${duration}ms`);
  });
  next();
});

// Validation schema for the request body - allows unknown fields and empty requests
const requestSchema = z.object({
  confidential: z.boolean().optional().default(true),
  customerName: z.string()
    .min(1, "Customer name is required")
    .max(100, "Customer name is too long")
    .regex(/^[a-zA-Z\s\-'\.]+$/, "Customer name contains invalid characters")
    .optional(),
  phoneNumber: z.string()
    .min(10, "Valid phone number is required")
    .regex(/^[\d\s\-\+\(\)\.]+$/, "Phone number contains invalid characters")
    .optional(),
  email: z.string()
    .email("Valid email is required")
    .max(254, "Email address is too long")
    .optional(),
  preferredContact: z.enum(["Phone", "Email", "Text"]).optional(),
  make: z.enum(["Toyota", "Honda", "Ford", "Chevrolet", "Nissan", "BMW", "Mercedes-Benz", "Audi", "Volkswagen", "Hyundai", "Kia", "Mazda", "Subaru", "Other"]).optional(),
  model: z.string()
    .min(1, "Vehicle model is required")
    .max(50, "Vehicle model name is too long")
    .regex(/^[a-zA-Z0-9\s\-\.]+$/, "Vehicle model contains invalid characters")
    .optional(),
  year: z.number().min(1900, "Year must be at least 1900").max(2030, "Year cannot exceed 2030").optional(),
  mileage: z.number()
    .min(0, "Mileage must be non-negative")
    .max(999999, "Mileage seems unreasonably high")
    .optional(),
  vin: z.string()
    .length(17, "VIN must be exactly 17 characters")
    .regex(/^[A-HJ-NPR-Z0-9]{17}$/, "VIN contains invalid characters (no I, O, Q)")
    .optional(),
  licensePlate: z.string()
    .max(10, "License plate is too long")
    .regex(/^[A-Z0-9\s\-]+$/, "License plate contains invalid characters")
    .optional(),
  serviceType: z.enum(["Oil Change", "Brake Service", "Tire Rotation", "Engine Diagnostic", "Transmission Service", "Electrical System", "AC/Heating", "Suspension", "Exhaust System", "General Maintenance", "Emergency Repair", "Other"]).optional(),
  urgency: z.enum(["Routine", "Standard", "Urgent", "Emergency"]).optional(),
  problemDescription: z.string()
    .min(10, "Problem description must be at least 10 characters")
    .max(1000, "Problem description is too long")
    .optional(),
  symptoms: z.string()
    .max(500, "Symptoms description is too long")
    .optional(),
  preferredDate: z.string()
    .regex(/^\d{4}-\d{2}-\d{2}$/, "Preferred date must be in YYYY-MM-DD format")
    .refine((date) => {
      const parsed = new Date(date);
      return !isNaN(parsed.getTime()) && parsed.toISOString().slice(0, 10) === date;
    }, "Invalid date - date does not exist")
    .optional(),
  budget: z.enum(["Under $100", "$100-$300", "$300-$500", "$500-$1000", "Over $1000", "No Limit"]).optional(),
  previousRepairs: z.string()
    .max(500, "Previous repairs description is too long")
    .optional(),
  warrantyInfo: z.string()
    .max(300, "Warranty information is too long")
    .optional(),
  specialInstructions: z.string()
    .max(500, "Special instructions are too long")
    .optional(),
  howDidYouHear: z.enum(["Google Search", "Social Media", "Friend/Family", "Online Review", "Drive By", "Other"]).optional(),
}).passthrough(); // Allow unknown fields to pass through

// Allowed fields for backward compatibility
const allowedFields = new Set<keyof ServiceRequest>([
  'customerName', 'phoneNumber', 'email', 'preferredContact',
  'make', 'model', 'year', 'mileage', 'vin', 'licensePlate',
  'serviceType', 'urgency', 'problemDescription', 'symptoms',
  'preferredDate', 'budget', 'previousRepairs', 'warrantyInfo',
  'specialInstructions', 'howDidYouHear'
]);

const runHandler: RequestHandler = async (req, res) => {
  try {
    // Handle empty request body (allow Gemini to generate all fields)
    const requestBody = req.body && typeof req.body === "object" ? req.body : {};
    
    // Check for unknown fields first
    const incomingKeys = Object.keys(requestBody);
    if (incomingKeys.length > 0) {
      const unknownFields = incomingKeys.filter(k => !allowedFields.has(k as keyof ServiceRequest) && k !== 'confidential');
      if (unknownFields.length > 0) {
        return res.status(400).json({
          success: false,
          error: `Unknown ServiceRequest field${unknownFields.length > 1 ? 's' : ''}: ${unknownFields.join(', ')}`
        });
      }
    }

    // Validate the request body using Zod (only validates known fields)
    const validationResult = requestSchema.safeParse(requestBody);
    
    if (!validationResult.success) {
      const errors = validationResult.error.errors.map(err => 
        `${err.path.join('.')}: ${err.message}`
      ).join(', ');
      
      return res.status(400).json({
        success: false,
        error: `Validation failed: ${errors}`,
        details: validationResult.error.errors
      });
    }

    const { confidential, ...overrides } = validationResult.data;

    // After validation has passed, call main with the overrides.
    const serviceRequest = await main(overrides);
    
    if (confidential) {
      res.json({ success: true, serviceRequest: serviceRequest.customerName }); // Only customer name
    } else {
      res.json({ success: true, serviceRequest: serviceRequest }); // Full ServiceRequest
    }
  } catch (err: any) {
    console.error("Agent error:", err);
    res.status(500).json({ success: false, error: err.message });
  }
};

/**
 * GET /
 * Serves the medical form
 */
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, '../../public/index.html'));
});

/**
 * POST /run
 * @param {partial ServiceRequest & { confidential?: boolean }} req.body
 *    - customerName, phoneNumber, email, preferredContact, make, model, year, mileage,
 *      serviceType, urgency, problemDescription, symptoms, preferredDate, budget,
 *      previousRepairs, warrantyInfo, specialInstructions, howDidYouHear
 *    - confidential: boolean (default true) – if true, returns only customer name; false returns full record.
 *    - Empty body is allowed - Gemini will generate all required fields
 *    - Unknown fields will return a 400 error with field names listed
 * @returns {200} { success: true, serviceRequest: string | ServiceRequest }
 * @returns {400} { success: false, error: string, details?: array }
 * @returns {500} { success: false, error: string }
 */
app.post("/run", runHandler);

const port = process.env.PORT || 3000;

// General error handling middleware (should be last)
app.use((err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
  console.error('Unhandled error:', err);
  res.status(500).json({
    success: false,
    error: 'Internal server error'
  });
});

app.listen(port, () => {
  console.log(`Agent API listening on http://localhost:${port}`);
});