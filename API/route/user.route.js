import express from "express";

const router = express.Router();

router.get("/test", (req, res) => {
    res.send("send user informations");
});

export default router;
