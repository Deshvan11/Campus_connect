const express = require("express");
const Service = require("../models/Service");
const Subscription = require("../models/Subscription");
const User = require("../models/user"); // Assuming you have a User model

const router = express.Router();

router.get("/services", async (req, res) => {
    try {
        const services = await Service.find();
        res.json(services);
    } catch (err) {
        res.status(500).json({ error: "Server Error" });
    }
});

router.post("/subscribe", async (req, res) => {
    try {
        const { userId, serviceId, planName } = req.body;
        console.log(req.body)
        const user = await User.findOne({ userId });
        if (!user) return res.status(404).json({ error: "User not found" });

        const service = await Service.findById(serviceId);

        if (!service) return res.status(404).json({ error: "Service not found" });

        const selectedPlan = service.plans.find((plan) => plan.name === planName);
        if (!selectedPlan) return res.status(400).json({ error: "Invalid plan" });

        const startDate = new Date();
        const renewalDate = new Date(startDate);
        renewalDate.setDate(startDate.getDate() + selectedPlan.duration);

        const subscription = new Subscription({
            user: user._id,
            service: serviceId,
            planName,
            amount: selectedPlan.price,
            startDate,
            renewalDate,
        });

        await subscription.save();

        const newSubscription = await Subscription.findById(subscription._id).populate("service");

        // let finalSubscription = { ...subscription._doc, service: service };
        res.json({ message: "Subscription successful", subscription: newSubscription });
    } catch (err) {
        res.status(500).json({ error: "Server Error" });
    }
});

router.get("/subscriptions/:userId", async (req, res) => {
    try {
        const { userId } = req.params;
        
        const user = await User.findOne({ userId });
        if (!user) return res.status(404).json({ error: "User not found" });

        const subscriptions = await Subscription.find({ user: user._id, status: "active" }).populate("service");
        // if (!subscriptions.length) return res.status(404).json({ error: "No active subscriptions found" });
        res.json(subscriptions);
    } catch (err) {
        res.status(500).json({ error: "Server Error" });
    }
});


router.get("/upcoming-renewals/:userId", async (req, res) => {
    try {
        const { userId } = req.params;

        const user = await User.findOne({ userId });
        if (!user) return res.status(404).json({ error: "User not found" });

        const today = new Date();
        const nextWeek = new Date();
        nextWeek.setDate(today.getDate() + 7);

        const renewals = await Subscription.find({
            user: user._id,
            renewalDate: { $gte: today, $lte: nextWeek },
        }).populate("service");

        // if (!renewals.length) return res.status(404).json({ error: "No upcoming renewals found" });
        res.json(renewals);
    } catch (err) {
        res.status(500).json({ error: "Server Error" });
    }
});

module.exports = router;
