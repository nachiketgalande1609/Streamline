const mongoose = require("mongoose");

const reconciliationSchema = new mongoose.Schema(
    {
        reconciliationId: {
            type: mongoose.Schema.Types.ObjectId,
            auto: true,
        },
        recon_month: {
            type: Number,
            required: true,
            min: 1,
            max: 12,
        },
        recon_year: {
            type: Number,
            required: true,
        },
        totalIncome: {
            type: Number,
            required: true,
        },
        totalExpenses: {
            type: Number,
            required: true,
        },
        totalReconciled: {
            type: Number,
            required: true,
        },
        createdBy: {
            type: String,
            required: true,
        },
        updatedBy: {
            type: String,
            required: true,
        },
    },
    { collection: "reconciliations", timestamps: true }
);

const ReconciliationModel = mongoose.model("Reconciliation", reconciliationSchema);

module.exports = ReconciliationModel;
