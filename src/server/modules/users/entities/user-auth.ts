import mongoose, { Schema } from 'mongoose'

const userSchema = new Schema({
    id: String,
    name: String,
    email: String,
    image: String,
    emailVerified: Boolean,
})
const sessionSchema = new Schema({
    id: String,
    sessionToken: String,
    userId: String,
    expires: Date,
})
const accounts = new Schema({
    id: String,
    provider: String,
    type: String,
    providerAccountId: String,
    access_token: String,
    token_type: String,
    expires_at: Number,
    userId: String,
})

export const sessionsModel = mongoose.models.sessions || mongoose.model("sessions", sessionSchema)
export const accountsModel = mongoose.models.accounts || mongoose.model("accounts", accounts)
export const usersModel = mongoose.models.users || mongoose.model("users", userSchema)
