const Tesseract = require('tesseract.js');

Tesseract.recognize(
    'images/textbook_page_test_1.jpg',
    'eng',
    { logger: m => console.log(m) }
).then(({ data: { text } }) => {
    console.log("Extracted Text:");
    console.log(text);
});