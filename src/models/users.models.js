import mongoose, { Schema, model } from 'mongoose';
import mongooseAggregatePaginate from 'mongoose-aggregate-paginate-v2';

const userSchema = new Schema({
    countryCode: { type: String, default: '+91' },
    phone: {
        type: String,
        required: true,
        unique: true,
        validate: {
            validator: function (v) {
                // Check if the number is exactly 10 digits (before adding +91)
                return /^\d{10}$/.test(v);
            },
            message: props => `${props.value} is not a valid 10-digit phone number!`
        },
        index: true
    },
    // otpVerified: {
    //     type: Boolean,
    //     default: false
    // },
    userType: {
        type: String,
        enum: ['vehicle_owner', 'regular_user'],
        required: function() {
            // Make required only after OTP is verified
            // return this.otpVerified;
            return true;
        }
    },
    name: {
        type: String,
        required: function() {
            // Make required only after OTP is verified
            // return this.otpVerified;
            return true;
        }
    },
    panOrAadhar: {
        type: String,
        required: function() {
            // Make required only after OTP is verified
            // return this.otpVerified;
            return true;
        }
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
    vehicleDetails: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Vehicle',
        required: function() {
          return this.userType === 'vehicle_owner';
        }
    }]
}, {
    timestamps: true
});

userSchema.plugin(mongooseAggregatePaginate);

const User = model('User', userSchema, 'users');
export default User;
