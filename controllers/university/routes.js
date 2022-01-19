// ==================== Load Internal Modules =========================================
const express = require("express");
const { validate } = require("express-validation");
const view = require("./view");
const schema = require("./schema");

const router = express.Router();
// ==================== Load Internal Modules =========================================

router
    .route("/getAll").get(view.listUniversity)

router
    .route("/add").post(
        validate(schema.universityValidate, {}, {}), view.addUniversity
    )

router
    .route("/update/:id")
    .put(validate(schema.universityValidate, {}, {}), view.editUniversity)

router
    .route("/getById/:id").get(view.getUniversityByID);

router
    .route("/delete/:id").delete(view.deleteUniversity)

module.exports = router;