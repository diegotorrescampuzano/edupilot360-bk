/* eslint-disable */
// Mongoose model for user_roles collection

const mongoose = require('mongoose');
const { Schema } = mongoose;

const userRoleSchema = new Schema({
  userId: { type: Schema.Types.ObjectId, required: true, ref: 'User' },
  roleId: { type: Schema.Types.ObjectId, required: true, ref: 'Role' },
  campusId: { type: Schema.Types.ObjectId, required: true, ref: 'Campus' },
  createdAt: { type: Date, default: Date.now }
});

// Prevent duplicate user-role-campus relations
userRoleSchema.index({ userId: 1, roleId: 1, campusId: 1 }, { unique: true });

module.exports = mongoose.model('UserRole', userRoleSchema);
