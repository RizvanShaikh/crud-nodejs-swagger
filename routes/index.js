const express = require("express");
const router = express.Router();

const authRoutes = require("../controllers/auth/routes");
const universityRoutes = require("../controllers/university/routes");


router.use("/auth", authRoutes);
router.use("/university", universityRoutes);

    

router.use(function (req, res) {
    res.status(404).json({
        code: 404,
        status: false,
        message: 'API route not found',
        data: {}
    })
});
module.exports = router;
