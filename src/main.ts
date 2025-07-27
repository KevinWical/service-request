import { generateText } from "ai";
import { model } from "./_internal/setup";
import { serviceRequestSchema } from "./schema";
import { createSession } from "./session";
import { ServiceRequest } from "./types";

// AI prompt sample ServiceRequest as JSON
function getAiPrompt(): string {
  return `
    You are a car service request generator.
    Each time you respond, generate a *new, unique* service request with realistic vehicle and problem data.
    Pick a random car make/model combination and realistic service issues.
    Output only one JSON object (no markdown/fences), for the schema:
    ${JSON.stringify(serviceRequestSchema.shape, null, 2)}
    
    Guidelines:
    - Use realistic car makes/models (Toyota Camry, Honda Civic, Ford F-150, etc.)
    - Generate realistic service problems (engine noise, brake issues, electrical problems, etc.)
    - Use realistic mileage (10,000 to 200,000)
    - Generate realistic customer names and contact information
    
    Field Guidelines:
    - problemDescription: Detailed description of the main issue (e.g., "Brake pedal feels soft and car takes longer to stop than usual")
    - symptoms: Specific symptoms, sounds, or behaviors (e.g., "Squeaking noise when braking, dashboard warning light on")
    - previousRepairs: List of recent repairs or modifications
    - warrantyInfo: Warranty details or extended coverage information
    - specialInstructions: Special requests or instructions for the mechanic
    
    IMPORTANT: Use these EXACT values for the following fields:
    - make: Must be one of: "Toyota", "Honda", "Ford", "Chevrolet", "Nissan", "BMW", "Mercedes-Benz", "Audi", "Volkswagen", "Hyundai", "Kia", "Mazda", "Subaru", "Other"
    - serviceType: Must be one of: "Oil Change", "Brake Service", "Tire Rotation", "Engine Diagnostic", "Transmission Service", "Electrical System", "AC/Heating", "Suspension", "Exhaust System", "General Maintenance", "Emergency Repair", "Other"
    - urgency: Must be one of: "Routine", "Standard", "Urgent", "Emergency"
    - preferredContact: Must be one of: "Phone", "Email", "Text"
    - budget: Must be one of: "Under $100", "$100-$300", "$300-$500", "$500-$1000", "Over $1000", "No Limit"
    - howDidYouHear: Must be one of: "Google Search", "Social Media", "Friend/Family", "Online Review", "Drive By", "Other"
    - preferredDate: Must be in YYYY-MM-DD format (e.g., "2024-12-17", "2025-01-15")`
}

/**
 * @Param overrides the optional parameterized ServiceRequest fields
 */
export async function main(overrides: Partial<ServiceRequest> = {}) {
  const aiPrompt = getAiPrompt();
  // Even with these tweaks I was still getting similar ServiceRequests
  const response = await generateText({ 
    model, 
    prompt: aiPrompt, 
    temperature: 0.85,
    topP: 0.9
  });

  // Trim extra characters from generated JSON
  let text = response.text.trim();
  if (text.startsWith('```')) {
    const match = text.match(/\{[\s\S]*\}/);
    if (!match) throw new Error("Could not extract JSON");
    text = match[0];
  }

  let serviceRequest: ServiceRequest;
  try {
    serviceRequest = JSON.parse(text);
  } catch (err: any) {
    throw new Error(`Invalid JSON from AI: ${err.message}`);
  }

  // Override Gemini data with API params
  Object.assign(serviceRequest, overrides);
  
  const page = await createSession("http://localhost:3000");

  // Customer Information (already expanded by default)
  await page.fill('#customerName', serviceRequest.customerName);
  await page.fill('#phoneNumber', serviceRequest.phoneNumber);
  await page.fill('#email', serviceRequest.email);
  await page.selectOption('#preferredContact', serviceRequest.preferredContact);

  // Vehicle Information - expand section first
  await page.click('#vehicleInfo .section-header');
  await page.waitForSelector('#vehicleInfo .section-content', { state: 'visible' });
  await page.selectOption('#make', serviceRequest.make);
  await page.fill('#model', serviceRequest.model);
  await page.fill('#year', serviceRequest.year.toString());
  await page.fill('#mileage', serviceRequest.mileage.toString());
  if (serviceRequest.vin) await page.fill('#vin', serviceRequest.vin);
  if (serviceRequest.licensePlate) await page.fill('#licensePlate', serviceRequest.licensePlate);

  // Service Request - expand section first
  await page.click('#serviceRequest .section-header');
  await page.waitForSelector('#serviceRequest .section-content', { state: 'visible' });
  
  await page.selectOption('#serviceType', serviceRequest.serviceType);
  await page.selectOption('#urgency', serviceRequest.urgency);
  await page.fill('#problemDescription', serviceRequest.problemDescription);
  
  // Add optional fields if they exist
  if (serviceRequest.symptoms) {
    await page.fill('#symptoms', serviceRequest.symptoms);
  }
  if (serviceRequest.preferredDate) {
    await page.fill('#preferredDate', serviceRequest.preferredDate);
  }
  if (serviceRequest.budget) {
    await page.selectOption('#budget', serviceRequest.budget);
  }

  // Additional Information - expand section first
  await page.click('#additionalInfo .section-header');
  await page.waitForSelector('#additionalInfo .section-content', { state: 'visible' });
  if (serviceRequest.previousRepairs) await page.fill('#previousRepairs', serviceRequest.previousRepairs);
  if (serviceRequest.warrantyInfo) await page.fill('#warrantyInfo', serviceRequest.warrantyInfo);
  if (serviceRequest.specialInstructions) await page.fill('#specialInstructions', serviceRequest.specialInstructions);
  if (serviceRequest.howDidYouHear) await page.selectOption('#howDidYouHear', serviceRequest.howDidYouHear);

  // Submit
  await page.click('.submit-btn');

  return serviceRequest;
}