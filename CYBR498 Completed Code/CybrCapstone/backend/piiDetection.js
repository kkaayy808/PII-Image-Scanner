function detectPII(text) {
    const results = {
        emails: [],
        phoneNumbers: [],
        ssns: []
    };

    // Email regex
    const emailRegex = /\b[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}\b/gi;

    // Phone number regex (handles formats like 123-456-7890, (123) 456-7890, 1234567890)
    //const phoneRegex = /\b(\+?1[-.\s]?)?\(?\d{3}\)?[-.\s]?\d{3}[-.\s]?\d{4}\b/g;
    const phoneRegex = /\b(\+1[-.\s]?)?\(\d{3}\)\s?\d{3}[-.\s]?\d{4}|\b\d{3}[-.\s]\d{3}[-.\s]\d{4}\b/g;

    // SSN regex (XXX-XX-XXXX)
    //const ssnRegex = /\b\d{3}-\d{2}-\d{4}\b/g;
    const ssnRegex = /\b(?!000|666|9\d{2})\d{3}-(?!00)\d{2}-(?!0000)\d{4}\b/g;

    // Find matches
    results.ssns = text.match(ssnRegex) || [];

    // Remove SSNs from text BEFORE phone detection
    const cleanedText = text.replace(ssnRegex, " ");


    results.emails = cleanedText.match(emailRegex) || [];
    results.phoneNumbers = cleanedText.match(phoneRegex) || [];


    // add date of birth and addresses next...address would be more complex


    const piiSummary = [];

    if (results.emails.length > 0) piiSummary.push("Email Address");
    if (results.phoneNumbers.length > 0) piiSummary.push("Phone Number");
    if (results.ssns.length > 0) piiSummary.push("Social Security Number");


    //returns a list of emails, phone nums, and ssns potentially present
    //return results;
    //return {
    //    ...results,
    //    piiSummary
    //};

    return {
        emails: results.emails,
        phoneNumbers: results.phoneNumbers,
        ssns: results.ssns,
        pii: piiSummary,
        raw: results
    };
}

module.exports = detectPII;