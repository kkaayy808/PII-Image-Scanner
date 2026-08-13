# PII Image Scanner

A mobile application that detects personally identifiable information (PII) within images and assigns a risk score based on the information found.

## Features

- Upload and preview images
- OCR text extraction using Tesseract
- Dual image preprocessing for digital and handwritten text
- Detection of emails, phone numbers, and Social Security numbers
- Risk scoring based on the highest-risk PII detected
- Displays detected PII and extracted text

## Technology Stack

### Frontend
- React Native
- Expo

### Backend
- Node.js
- Express
- Tesseract.js
- Sharp
- Multer
- Regex-based PII detection

## How It Works

1. User selects an image in the mobile app.
2. The image is sent to the Node.js backend.
3. The backend preprocesses the image in two different ways.
4. Tesseract extracts text from both versions.
5. The PII detector identifies sensitive information.
6. Results from both processing paths are merged.
7. A risk score from 0–10 is calculated and returned to the app.

## Risk Scoring

| PII Type | Risk |
|---|---:|
| Email | 3/10 |
| Phone Number | 5/10 |
| Social Security Number | 10/10 |

The final image risk score is the highest risk level detected.

## Setup

### Prerequisites

- Node.js 24+
- npm
- Expo Go installed on a mobile device
- An ngrok account and authentication token

### 1. Clone the Repository

```bash
git clone <repository-url>
cd <project-folder>
```

### 2. Set Up the Backend

Navigate to the backend folder:
```bash
cd "CYBR498 Completed Code/CybrCapstone"
```

Install the backend dependencies:
```bash
npm install
```

Start the backend server:
```bash
node mainServer.js
```
The backend runs on port 3000.

### 3. Start the ngrok Tunnel

Open a **separate terminal** and run:
```bash
npx ngrok http 3000
```
Copy the HTTPS forwarding URL provided by ngrok.

Open: CYBR498 Completed Code/cybr-capstone-mobile/app.js

Find the fetch() request:
```javascript
fetch('https://YOUR-NGROK-URL/upload', {
```
Replace YOUR-NGROK-URL with the current ngrok URL

### 4. Set Up the Mobile App

Open another terminal and navigate to the mobile app folder:
```bash
cd "CYBR498 Completed Code/cybr-capstone-mobile"
```

Install the dependencies:
```bash
npm install
```

Start Expo
```bash
npm expo start
```

Scan the QR code using the Expo Go app on your mobile device.

### 5. Test the Application

1. Select an image from your phone.
2. Press **Scan Image**.
3. The image is sent through ngrok tunnel to the backend.
4. The backend preprocesses and analyzes the image.
5. The app displays the extracted text, detected PII, and risk score.

Note: The backend server and ngrok tunnel must remain running while testing the application.


## Project Purpose

The goal of the project is to help users identify sensitive information hidden within everyday images and reduce accidental data exposure.
