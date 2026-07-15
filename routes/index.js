const express = require('express');
const router = express.Router();


router.get('/', (req, res) => {
    res.render('index', { title: 'Home Collecting' });
});
  
router.get('/models', (req, res) => {
    res.render('models', { title: 'Models', message: 'Welcome to the Models page!' });
});
  
router.get('/rims', (req, res) => {
    res.render('rims', { title: 'Rims', message: 'Welcome to the Rims page!' });
});

router.get('/discover', (req, res) =>{
    res.render('discover',{title: 'Discover', message: 'Welcome to the discover page'})
})

router.route("/contact")
    .get((req, res) => {
        res.render('contact', { title: 'Contact', message: 'Welcome to the Contact page!' });
});
    // .post((req, res) => {
    //     console.log(req.body);
    //     res.send("Form submitted successfully!");
    // });

router.post('/contacts', (req, res) => {  

    // Validate that all required fields are present
    let {name, email, phone, subject, message} = req.body;

    if (!name || !email || !phone || !subject || !message) {
        console.log("")
        req.session.status = "error";
        req.session.message = "All fields are required. Please fill out the form completely.";
        return res.status(400).redirect("/contact");

    } 


    // Ensure the email is in a valid format and the phone number is exactly 10 digits
    if(email) {
        const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
        if (!emailRegex.test(email)) {
            console.log("email")
            req.session.status = "error";
            req.session.message = "Please enter a valid email address.";
            return res.status(400).redirect("/contact");
        }
    }

    if(phone) {
        const phoneRegex = /^[0-9]{10,15}$/;
        if (!phoneRegex.test(phone)) {
            console.log("phone")
            req.session.status = "error";
            req.session.message = "Please enter a valid 10-15 digit phone number.";
            return res.status(400).redirect("/contact");
        }
    }
    // Ensure the subject is between 5 and 100 characters long and procect against XSS attacks by escaping special characters

    if(message) {
        message = message.trim();
        
        if(message.length >100) {
            console.log("message")
            req.session.status = "error";
            req.session.message = "Message must be between 100 characters long.";
            return res.status(400).redirect("/contact");
        }

        // Escape special characters in the message to prevent XSS attacks
        const xssRegex = /<script[^>]*>.*?<\/script>/gi;
        if (xssRegex.test(message)) {
            console.log("xss")
            req.session.status = "error";
            req.session.message = "For security reasons, your message can not be sent!";
            return res.status(400).redirect("/contact");
        }

        //  strip message of html
        message = message.replace(/<\/?[^>]+(>|$)/g, "");

        // Protect against sql database injection by sanitizing user input
        message = message.replace(/'/g, "''");


    }

    req.session.status = "success";
    req.session.message = "Thank you for contacting us, we will get back to you shortly.";

    res.redirect('/')
});

module.exports = router;