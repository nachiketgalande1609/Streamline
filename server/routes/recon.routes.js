const express = require("express");
const ReconciliationModel = require("../models/recon.models"); // Adjust the import as needed

const reconciliations = express.Router();

// Get reconciliations with pagination and filtering by recon_month and recon_year
reconciliations.get("/", async (req, res) => {
    const { page = 1, limit = 10, recon_month, recon_year } = req.query;

    try {
        const matchCriteria = {};

        // Add recon_month and recon_year to the filter criteria if provided
        if (recon_month) {
            matchCriteria.recon_month = parseInt(recon_month); // Ensure it's a number
        }
        if (recon_year) {
            matchCriteria.recon_year = parseInt(recon_year); // Ensure it's a number
        }

        const result = await ReconciliationModel.aggregate([
            { $match: matchCriteria }, // Filter by recon_month and recon_year
            {
                $facet: {
                    data: [
                        { $skip: (page - 1) * limit }, // Pagination: skip records
                        { $limit: parseInt(limit) }, // Limit the number of records returned
                    ],
                    totalCount: [
                        { $count: "count" }, // Count total matching reconciliations
                    ],
                },
            },
            {
                $unwind: "$totalCount", // Unwind the total count for easier access
            },
            {
                $project: {
                    data: 1, // Include all fields from the reconciliations collection
                    totalCount: "$totalCount.count", // Extract total count
                },
            },
        ]);

        res.json({
            success: true,
            data: result.length > 0 ? result[0].data : [], // If no data, return empty array
            totalCount: result.length > 0 ? result[0].totalCount : 0, // Total count of reconciliations
            error: false,
        });
    } catch (err) {
        console.error("Error fetching reconciliations:", err);
        res.status(500).json({
            success: false,
            data: null,
            error: err.message,
        });
    }
});

module.exports = reconciliations;
