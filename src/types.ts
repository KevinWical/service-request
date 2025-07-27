export interface ServiceRequest {
  // Customer Information
  customerName: string;
  phoneNumber: string;
  email: string;
  preferredContact: string;

  // Vehicle Information
  make: string;
  model: string;
  year: number;
  mileage: number;
  vin?: string;
  licensePlate?: string;

  // Service Request
  serviceType: string;
  urgency: string;
  problemDescription: string;
  symptoms?: string;
  preferredDate?: string;
  budget?: string;

  // Additional Information
  previousRepairs?: string;
  warrantyInfo?: string;
  specialInstructions?: string;
  howDidYouHear?: string;
}
