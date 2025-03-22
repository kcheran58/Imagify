import userModel from "../models/userModel.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import Razorpay from "razorpay";
import transactionModel from "../models/transactionModel.js";

const razorpayInstance = new Razorpay({
    key_id: process.env.RAZORPAY_ID_KEY,
    key_secret: process.env.RAZORPAY_SECRET_KEY
});

// Register User
const registerUser = async (req, res) => {
    try {
        const { name, email, password } = req.body;

        if (!name || !email || !password) {
            return res.status(400).json({ success: false, message: "Missing Details" });
        }

        // Check if user already exists
        const existingUser = await userModel.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ success: false, message: "User already exists" });
        }

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        const newUser = new userModel({
            name,
            email,
            password: hashedPassword
        });

        const user = await newUser.save();

        // Generate JWT Token
        const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: "1d" });

        res.status(201).json({
            success: true,
            token,
            user: { name: user.name }
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: error.message });
    }
};

// Login User
const loginUser = async (req, res) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({ success: false, message: "Missing credentials" });
        }

        const user = await userModel.findOne({ email });

        if (!user) {
            return res.status(404).json({ success: false, message: "User does not exist" });
        }

        const isMatch = await bcrypt.compare(password, user.password);

        if (!isMatch) {
            return res.status(401).json({ success: false, message: "Invalid credentials" });
        }

        // Generate JWT Token
        const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: "1d" });

        res.status(200).json({
            success: true,
            token,
            user: { name: user.name }
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: error.message });
    }
};

// Get User Credits
const userCredits = async (req, res) => {
    try {
        const { userId } = req.body;
        const user = await userModel.findById(userId);

        if (!user) {
            return res.status(404).json({ success: false, message: "User not found" });
        }

        res.json({ success: true, credits: user.creditBalance, user: { name: user.name } });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: error.message });
    }
};

// Process Razorpay Payment
const paymentRazorpay = async (req, res) => {
    try {
        const { userId, planId } = req.body;
        const userData = await userModel.findById(userId);

        if (!userId || !planId) {
            return res.status(400).json({ success: false, message: "Missing Details" });
        }

        if (!userData) {
            return res.status(404).json({ success: false, message: "User not found" });
        }

        let credits, plan, amount;

        switch (planId) {
            case "Basic":
                plan = "Basic";
                credits = 100;
                amount = 10;
                break;
            case "Advanced":
                plan = "Advanced";
                credits = 500;
                amount = 50;
                break;
            case "Business":
                plan = "Business";
                credits = 5000;
                amount = 250;
                break;
            default:
                return res.status(400).json({ success: false, message: "Plan not found" });
        }

        const date = Date.now();

        // Save Transaction Data
        const transactionData = {
            userId,
            plan,
            amount,
            credits,
            date
        };
        const newTransaction = await transactionModel.create(transactionData);

        // Razorpay Order Creation
        const options = {
            amount: amount * 100, // Convert to paise (cents)
            currency: process.env.CURRENCY || "INR",
            receipt: newTransaction._id.toString()
        };
        console.log(razorpayInstance)
        const order = await razorpayInstance.orders.create(options);
        
        res.json({ success: true, order });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: error.message });
    }
};


const verifyRazorpay = async (req, res) => {
    try {
        const { razorpay_order_id } = req.body;

        if (!razorpay_order_id) {
            return res.status(400).json({ success: false, message: "Order ID is required" });
        }

        const orderInfo = await razorpayInstance.orders.fetch(razorpay_order_id);

        if (!orderInfo) {
            return res.status(404).json({ success: false, message: "Order not found" });
        }

        if (orderInfo.status !== "paid") {
            return res.json({ success: false, message: "Payment failed" });
        }

        const transactionData = await transactionModel.findById(orderInfo.receipt);
        if (!transactionData) {
            return res.status(404).json({ success: false, message: "Transaction not found" });
        }

        if (transactionData.payment) {
            return res.json({ success: false, message: "Payment already processed" });
        }

        const userData = await userModel.findById(transactionData.userId);
        if (!userData) {
            return res.status(404).json({ success: false, message: "User not found" });
        }

        const creditBalance = userData.creditBalance + transactionData.credits;

        await userModel.findByIdAndUpdate(userData._id, { creditBalance });
        await transactionModel.findByIdAndUpdate(transactionData._id, { payment: true });

        return res.json({ success: true, message: "Credits added successfully" });
    } catch (error) {
        console.error("Error in verifyRazorpay:", error);
        return res.status(500).json({ success: false, message: error.message });
    }
};

export { registerUser, loginUser, userCredits, paymentRazorpay , verifyRazorpay};
