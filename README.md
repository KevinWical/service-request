# Vehicle Service Request Automation Project

A comprehensive automation solution that demonstrates AI-powered vehicle service request form filling using Playwright, Gemini AI, and Express.js. This project showcases automated testing, AI data generation, and web automation capabilities for automotive service management.

## Features

### 🤖 AI-Powered Data Generation
- Uses Google's Gemini AI to generate realistic vehicle service requests
- Configurable temperature and top-p parameters for data diversity
- Automatic JSON parsing and validation
- Support for partial data overrides via API

### 🌐 Web Automation
- Playwright-based browser automation
- Handles complex form interactions including collapsible sections
- Robust element selection and form filling
- Cross-browser compatibility

### 📊 RESTful API
- Express.js server with comprehensive endpoints
- Zod-based validation with detailed error messages
- Configurable response privacy (confidential mode)
- Comprehensive date, VIN, and field validation

### ⏰ Scheduled Automation
- GitHub Actions cron job for automated service request generation
- Weekly execution schedule (configurable)
- Automated logging and result tracking
- Production-ready deployment setup

## Project Structure

```
├── public/                 # Static web assets
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
└── .github/
    └── workflows/        # GitHub Actions automation
```

## Quick Start

### Prerequisites
- Node.js 20+
- Google Gemini API key

### Installation

1. Clone the repository
```bash
git clone <repository-url>
cd medical-form-automation
```

2. Install dependencies
```bash
npm install
```

3. Install Playwright browsers
```bash
npx playwright install
```

4. Create environment file
```bash
# Create .env file with your API key
GOOGLE_GENERATIVE_AI_API_KEY=your_gemini_api_key
HEADLESS=false  # Set to true for production
```

### Running the Application

1. Start the development server
```bash
npm run dev
```

2. Access the vehicle service request form
- Web interface: http://localhost:3000
- API endpoint: http://localhost:3000/run

3. Run a test execution
```bash
npm run testRun
```

## API Usage

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

## Automation Features

### AI Data Generation
- Generates unique vehicle service requests for each execution
- Configurable data diversity through temperature and top-p parameters
- Handles edge cases and validation errors gracefully

### Form Automation
- Automatically expands collapsible sections as needed
- Fills all form fields with generated data
- Handles dropdown selections and text inputs
- Submits form and validates completion

### Scheduled Execution
- GitHub Actions workflow runs weekly (Sundays at midnight UTC)
- Automated logging to `serviceRequest.log`
- Configurable execution limits for testing
- Production-ready deployment configuration

## Technical Implementation

### AI Integration
- Uses Vercel AI SDK for Gemini integration
- Configurable prompt engineering for data generation
- Robust JSON parsing with error handling
- Temperature and top-p tuning for data diversity

### Browser Automation
- Playwright for cross-browser compatibility
- Robust element selection strategies
- Error handling and retry mechanisms
- Headless mode support for production

### API Design
- RESTful endpoint design
- Zod-based comprehensive input validation
- Configurable response formats
- Error handling with detailed validation messages

## Development Notes

### Data Validation
- ISO date format enforcement (YYYY-MM-DD) with leap year validation
- Phone number format validation with character restrictions
- VIN validation (17 characters, excludes I/O/Q)
- Comprehensive field validation with length limits
- Schema-based type checking with Zod

### Error Handling
- Graceful AI response parsing
- Network error recovery
- Form interaction error handling
- Comprehensive logging

### Performance Considerations
- Efficient element selection strategies
- Minimal DOM manipulation
- Optimized AI prompt design
- Resource cleanup and memory management

## Future Enhancements

- [ ] Multi-vehicle support for fleet management
- [ ] Integration with automotive service databases
- [ ] Real-time appointment scheduling
- [ ] Customer notification system
- [ ] Service history tracking
- [ ] Parts inventory integration
- [ ] Advanced reporting and analytics

## License

This project is licensed under the ISC License.


