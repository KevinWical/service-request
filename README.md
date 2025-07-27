# Vehicle Service Request Automation

An AI-powered vehicle service request automation system that demonstrates modern web automation, AI integration, and API design using Playwright, Google Gemini AI, and Express.js.

## 🚀 Quick Start

1. **Install dependencies:**
   ```bash
   npm install
   ```

2. **Set up environment variables:**
   ```bash
   # Create .env file with your Gemini API key
   GOOGLE_GENERATIVE_AI_API_KEY=your_api_key_here
   ```

3. **Start the application:**
   ```bash
   npm run dev
   ```

4. **Access the application:**
   - Web interface: http://localhost:3000
   - API endpoint: http://localhost:3000/run

## 🎯 Features

- 🤖 **AI-Powered Data Generation**: Uses Google's Gemini AI for realistic vehicle service requests
- 🌐 **Web Automation**: Playwright-based form filling with collapsible sections
- 📊 **RESTful API**: Express.js server with comprehensive Zod validation
- ⏰ **Scheduled Automation**: GitHub Actions for weekly service request generation
- 🎨 **Modern UI/UX**: Responsive design with smooth single-section interactions

## 📁 Project Structure

```
├── public/                 # Frontend assets
│   ├── index.html         # Vehicle service request form interface
│   ├── styles.css         # Modern responsive styling
│   └── script.js          # Form interaction logic
├── src/
│   ├── main.ts           # Core automation logic
│   ├── session.ts        # Playwright session management
│   ├── schema.ts         # Service request data schema
│   ├── types.ts          # TypeScript type definitions
│   └── _internal/
│       ├── run.ts        # Express server setup
│       └── setup.ts      # AI model configuration
├── scripts/
│   └── testRun.ts        # Manual test execution
├── .github/
│   └── workflows/        # GitHub Actions automation
├── README.md             # This file
├── demo.md               # Demo guide and presentation tips
└── package.json          # Node.js dependencies
```

## 📚 Documentation

- **[Demo Guide](demo.md)**: Presentation tips and demo scenarios
- **[API Documentation](#api-usage)**: Complete API reference below

## 🔧 Technology Stack

- **Backend**: Node.js, Express.js, TypeScript
- **AI**: Google Gemini AI, Vercel AI SDK
- **Automation**: Playwright
- **Frontend**: HTML5, CSS3, JavaScript
- **Validation**: Zod
- **DevOps**: GitHub Actions

## 📡 API Usage

### POST /run
Submit vehicle service request data for automated form filling.

**Request Body:**
```json
{
  "customerName": "John Smith",
  "phoneNumber": "555-123-4567",
  "email": "john.smith@email.com",
  "make": "Toyota",
  "model": "Camry",
  "year": 2020,
  "mileage": 45000,
  "serviceType": "Brake Service",
  "urgency": "Standard",
  "problemDescription": "Brake pedal feels soft and car takes longer to stop than usual",
  "confidential": true
}
```

**Response:**
```json
{
  "success": true,
  "serviceRequest": "John Smith"  // or full service request if confidential=false
}
```

### Parameters
- All ServiceRequest fields are optional and will be AI-generated if not provided
- `confidential`: Boolean (default: true) - Controls response privacy
  - `true`: Returns only the customer name (e.g., "John Smith")
  - `false`: Returns the complete service request object with all fields
- Date format must be YYYY-MM-DD
- VIN must be exactly 17 characters (if provided)
- Comprehensive validation for all fields

## 🤖 AI Integration

The system uses Google's Gemini AI to generate realistic vehicle service requests:

```typescript
// AI prompt engineering for vehicle service data
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
    - Generate realistic customer names and contact information`
}
```

## 🔒 Validation Features

- **Date Validation**: ISO format with leap year handling
- **VIN Validation**: 17 characters, excludes I/O/Q
- **Phone Validation**: Character restrictions and format checking
- **Email Validation**: RFC-compliant email format
- **Field Length Limits**: Reasonable limits for all text fields
- **Enum Validation**: Predefined values for dropdowns

## ⏰ Scheduled Automation

The GitHub Actions workflow runs weekly (Sundays at midnight UTC) to:
- Generate new service requests using AI
- Automatically fill out the form
- Log results to `serviceRequest.log`
- Commit changes to the repository

## 🎨 UI/UX Features

- **Collapsible Sections**: Only one section open at a time for better focus
- **Auto-expand**: Sections automatically open when fields are focused
- **Responsive Design**: Works on desktop and mobile devices
- **Modern Styling**: Clean, professional appearance
- **Form Validation**: Real-time validation with helpful error messages

## 🚀 Future Enhancements

- [ ] Multi-vehicle support for fleet management
- [ ] Integration with automotive service databases
- [ ] Real-time appointment scheduling
- [ ] Customer notification system
- [ ] Service history tracking
- [ ] Parts inventory integration
- [ ] Advanced reporting and analytics

## 📄 License

This project is licensed under the ISC License. 