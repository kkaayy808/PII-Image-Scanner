function calculateRiskScore(piiResults) {
    const { emails, phoneNumbers, ssns } = piiResults;

    let riskScore = 0;

    // Assign weights
    //score += (ssns.length * 7);
    //score += (phoneNumbers.length * 2);
    //score += (emails.length * 1);


    // Cap score at 10
    //if (score > 10) score = 10;

    //new risk scoring metrics
    if (emails && emails.length > 0) {
        riskScore = Math.max(riskScore, 3);
    }

    if (phoneNumbers && phoneNumbers.length > 0) {
        riskScore = Math.max(riskScore, 5);
    }

    if (ssns && ssns.length > 0) {
        riskScore = Math.max(riskScore, 10);
    }


    return riskScore;
}

module.exports = calculateRiskScore;