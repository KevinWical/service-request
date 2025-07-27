# Demo Guide

This guide helps you demonstrate the Vehicle Service Request Automation project effectively.

## Quick Demo Setup

### 1. Start the Application
```bash
npm run dev
```

### 2. Open the Form
Navigate to: http://localhost:3000

### 3. Show the Form Interface
- Demonstrate the collapsible sections (only one open at a time)
- Show form validation
- Fill out a sample entry manually

### 4. Demonstrate Automation
```bash
npm run testRun
```

## Demo Scenarios

### Scenario 1: Manual Form Filling
1. Open http://localhost:3000
2. Show the four sections:
   - Customer Information (expanded by default)
   - Vehicle Information (collapsed)
   - Service Request (collapsed)
   - Additional Information (collapsed)
3. Fill out the form manually
4. Show validation errors
5. Submit successfully

### Scenario 2: API Automation
1. Use curl or Postman to call the API:
```bash
curl -X POST http://localhost:3000/run \
  -H "Content-Type: application/json" \
  -d '{
    "customerName": "John Smith",
    "make": "Toyota",
    "model": "Camry",
    "year": 2020,
    "serviceType": "Brake Service",
    "confidential": false
  }'
```

2. Show the response with AI-generated data
3. Demonstrate how the automation fills the form

### Scenario 2b: Confidential Mode Demonstration
Show the difference between confidential and non-confidential responses:

**Confidential Response (confidential: true):**
```json
{
  "success": true,
  "serviceRequest": "John Smith"
}
```

**Full Response (confidential: false):**
```json
{
  "success": true,
  "serviceRequest": {
    "customerName": "John Smith",
    "phoneNumber": "555-123-4567",
    "email": "john.smith@email.com",
    "make": "Toyota",
    "model": "Camry",
    "year": 2020,
    "mileage": 45000,
    "serviceType": "Brake Service",
    "urgency": "Standard",
    "problemDescription": "Brake pedal feels soft...",
    // ... all other fields
  }
}
```

### Scenario 3: Full AI Generation
1. Call the API with minimal data:
```bash
curl -X POST http://localhost:3000/run \
  -H "Content-Type: application/json" \
  -d '{}'
```

2. Show how AI generates all required fields
3. Demonstrate the automation process

## Key Features to Highlight

### 🤖 AI-Powered Data Generation
- **Point**: The system generates realistic vehicle service requests using Google's Gemini AI
- **Demo**: Show different API calls producing unique service requests
- **Code**: Explain the prompt engineering in `main.ts`

### 🌐 Web Automation
- **Point**: Playwright handles complex form interactions
- **Demo**: Show the browser automation in action (set `HEADLESS=false`)
- **Code**: Explain the selectors and form filling logic

### 📊 RESTful API
- **Point**: Clean API design with validation and error handling
- **Demo**: Show API responses and error cases
- **Code**: Explain the Express.js setup and validation

**Confidential Parameter:**
- `confidential: true` (default) - Returns only customer name for privacy
- `confidential: false` - Returns complete service request object
- Useful for debugging vs. production use cases

### ⏰ Scheduled Automation
- **Point**: GitHub Actions runs automation weekly (Sundays at midnight UTC)
- **Demo**: Show the workflow file and logs
- **Code**: Explain the cron job configuration

## Technical Deep Dive

### AI Integration
```typescript
// Show the AI prompt engineering
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

### Browser Automation
```typescript
// Show the form filling logic
await page.fill('#customerName', serviceRequest.customerName);
await page.click('#vehicleInfo .section-header');
await page.selectOption('#make', serviceRequest.make);
await page.click('.submit-btn');
```

### API Design
```typescript
// Show the validation and response handling
const validation = validateForm();
if (!validation.isValid) {
  showMessage(validation.errors.join(', '), 'error');
  return;
}

// Show the confidential response handling
if (confidential) {
  res.json({ success: true, serviceRequest: serviceRequest.customerName });
} else {
  res.json({ success: true, serviceRequest: serviceRequest });
}
```

## Portfolio Presentation

### Project Overview
"This project demonstrates a complete automation solution that combines AI data generation with web automation for vehicle service requests. It showcases my skills in:

- **AI Integration**: Using Google's Gemini AI for realistic automotive data generation
- **Web Automation**: Playwright for complex form interactions with collapsible sections
- **API Design**: RESTful endpoints with comprehensive Zod validation
- **DevOps**: GitHub Actions for scheduled automation
- **Full-Stack Development**: Express.js backend with modern frontend"

### Technical Stack
- **Backend**: Node.js, Express.js, TypeScript
- **AI**: Google Gemini AI, Vercel AI SDK
- **Automation**: Playwright
- **Frontend**: HTML5, CSS3, JavaScript
- **DevOps**: GitHub Actions, Docker
- **Testing**: Automated testing with Playwright

### Key Achievements
1. **AI-Powered Automation**: Successfully integrated AI for automotive service data generation
2. **Complex Form Handling**: Automated multi-section forms with collapsible sections and validation
3. **Production-Ready API**: Comprehensive Zod validation with detailed error messages
4. **Scheduled Automation**: Reliable weekly cron-based execution
5. **Modern UI/UX**: Responsive design with smooth single-section interactions

## Live Demo Tips

### Preparation
1. Set up the environment beforehand
2. Have sample API calls ready
3. Prepare backup data in case AI is slow
4. Test all scenarios before the demo

### During Demo
1. Start with the visual form interface
2. Show manual interaction with collapsible sections
3. Demonstrate API automation with vehicle data
4. Explain the technical implementation
5. Show the GitHub Actions workflow

### Troubleshooting
- If AI is slow, use pre-generated data
- If browser automation fails, show the code
- If API errors occur, explain the validation
- Have screenshots ready as backup

## Code Walkthrough

### 1. Project Structure
```
├── public/          # Frontend assets
├── src/             # Backend logic
├── scripts/         # Automation scripts
└── .github/         # CI/CD workflows
```

### 2. Key Files
- `src/main.ts`: Core automation logic
- `src/_internal/run.ts`: Express server
- `public/index.html`: Form interface
- `scripts/testRun.ts`: Manual testing

### 3. Configuration
- Environment variables for API keys
- Playwright configuration for browsers
- GitHub Actions for automation

## Questions to Prepare For

### Technical Questions
- "How does the AI generate unique vehicle service data?"
- "What happens if the form structure changes?"
- "How do you handle automation failures?"
- "What's the performance impact of browser automation?"

### Architecture Questions
- "Why did you choose Playwright over Selenium?"
- "How would you scale this for multiple forms?"
- "What security considerations did you implement?"
- "How would you add authentication?"

### Business Questions
- "What are the cost implications of AI usage for automotive services?"
- "How would you monitor the automation success rate?"
- "What's the ROI of this automation for service centers?"
- "How would you handle automotive industry compliance?"

## Conclusion

This project demonstrates:
- **Technical Excellence**: Modern stack with best practices
- **Problem Solving**: Complex automation challenges for automotive services
- **Full-Stack Skills**: Frontend, backend, and DevOps
- **AI Integration**: Practical use of AI for automotive data generation
- **Production Readiness**: Error handling, validation, and monitoring

The combination of AI-powered vehicle service request generation, web automation, and scheduled execution creates a powerful and scalable automation solution for automotive service management. 