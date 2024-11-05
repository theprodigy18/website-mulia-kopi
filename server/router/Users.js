const express = require("express");
const router = express.Router();
const { Users } = require("../models");
const bcrypt = require("bcrypt");
const nodemailer = require("nodemailer");
const crypto = require("crypto");
const jwt = require("jsonwebtoken")

router.get("/verify/:email/:token", async (req, res) => 
{
    const email = req.params.email;
    const token = req.params.token;

    // Check if both parameters are provided
    if (!email || !token) {
        return res.json({ error: "email or token not valid" });
    }

    const user = await Users.findOne(
    { 
        where: 
        { 
            email: email, 
        } 
    });

    if (!user) {
        return res.json({ error: "email or token not valid" });
    }
    if (user.status === true)
    {
        return res.json({ error: "email already registered" });
    }

    // Compare the token with the hashed token in the database
    const isTokenValid = await bcrypt.compare(token, user.recoveryToken);

    if (isTokenValid) {
        // Update the recoveryToken to null after successful verification
        await Users.update(
            { 
                recoveryToken: null,
                status: true
            }, // Set token to null
            { where: { email: email } }
        );

        res.json({ message: "Account verified successfully." });
    } else 
    {
        res.json({ error: "email or token not valid" });
    }
});
router.get("/verify-token", async (req, res) => 
{
    const token = req.headers["authorization"];
    if (!token) 
    {
        return res.json({ valid: false });
    }

    try {
        // Verifikasi token
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        
        // Cek apakah username ada di database
        const user = await Users.findOne({ where: { email: decoded.email } });
        if (!user) 
        {
            return res.json({ valid: false }); // Username tidak valid
        }

        return res.json({ valid: true, namaPelanggan: decoded.username, email: decoded.email }); // Token valid dan username ada
    } catch (error) {
        console.error("Token verification error:", error);
        return res.json({ valid: false }); // Token tidak valid
    }
});

router.post("/", async (req, res) => 
{
    const { namaPelanggan, email, password } = req.body;

    // Check if the email is already in use
    const existingUser = await Users.findOne({ where: { email } });

    if (existingUser)
    {
        if (existingUser.status === true) 
        {
            return res.json({ error: "Email already in use" });
        }
        else if (existingUser.status === false)
        {
            return res.json({ error: "Email already used, but not verified" });
        }
    }

    // Generate a random hex token
    const recoveryToken = crypto.randomBytes(20).toString("hex");

    // Hash the token and password before storing
    const hashedRecoveryToken = await bcrypt.hash(recoveryToken, 10);
    const hashedPassword = await bcrypt.hash(password, 10);

    // Construct the verification link
    const verificationLink = `http://localhost:3000/verify/${encodeURIComponent(email)}/${recoveryToken}`;

    // Set up email transporter
    const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: 'muliakopistm@gmail.com', // Replace with your email
            pass: 'dpwi iwek kuuh tbqh'    // Replace with your email password or app-specific password
        }
    });

    const mailOptions = {
        from: 'muliakopistm@gmail.com',
        to: email,
        subject: 'Account Verification',
        text: `Click the link to verify your account: ${verificationLink}`
    };

    try {
        // Send verification email
        await transporter.sendMail(mailOptions);

        // Only create the user if email sending was successful
        await Users.create({
            email: email,
            namaPelanggan: namaPelanggan,
            password: hashedPassword,
            recoveryToken: hashedRecoveryToken
        });

        res.json({ message: "Account created successfully. Please check your email to verify your account." });
    } catch (error) {
        res.json({ error: "Failed to send verification email. Account creation canceled." });
    }
});
router.post("/login", async (req, res) =>
{
    const { email, password } = req.body;

    const existingUser = await Users.findOne({ where: { email } });

    try 
    {
        if (!existingUser)
        {
            return res.json({error: "Email atau password salah"});
        }
        const isPasswordValid = await bcrypt.compare(password, existingUser.password);
    
        if (!isPasswordValid)
        {
            return res.json({error: "Email atau password salah"});
        }
    
        // Buat token JWT
        const token = jwt.sign({ id: existingUser.id, email: existingUser.email, username: existingUser.namaPelanggan, role: 'user' }, process.env.JWT_SECRET, 
        {
            expiresIn: '1h',
        });
    
        return res.json({ token });
    }
    catch (error)
    {
        return res.json({error: "Gagal login"});
    }
});




module.exports = router;
