import { z } from "zod";

export const serviceRequestSchema = z.object({
  // Customer Information
  customerName: z.string().min(1, "Customer name is required"),
  phoneNumber: z.string().min(10, "Valid phone number is required"),
  email: z.string().email("Valid email is required"),
  preferredContact: z.string().optional(),

  // Vehicle Information
  make: z.string().min(1, "Vehicle make is required"),
  model: z.string().min(1, "Vehicle model is required"),
  year: z.number().min(1900).max(2030),
  mileage: z.number().min(0),
  vin: z.string().optional(),
  licensePlate: z.string().optional(),

  // Service Request
  serviceType: z.string().min(1, "Service type is required"),
  urgency: z.string().min(1, "Urgency level is required"),
  problemDescription: z.string().min(10, "Problem description must be at least 10 characters"),
  symptoms: z.string().optional(),
  preferredDate: z.string().optional(),
  budget: z.string().optional(),

  // Additional Information
  previousRepairs: z.string().optional(),
  warrantyInfo: z.string().optional(),
  specialInstructions: z.string().optional(),
  howDidYouHear: z.string().optional(),
});
