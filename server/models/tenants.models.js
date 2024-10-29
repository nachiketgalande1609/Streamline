const mongoose = require("mongoose");

const TenantSchema = new mongoose.Schema(
    {
        tenant_id: { type: Number, required: true, unique: true },
        name: { type: String, required: true },
    },
    { collection: "tenants" }
);

const TenantModel = mongoose.model("Tenant", TenantSchema);

module.exports = TenantModel;
