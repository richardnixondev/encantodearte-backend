const mongoose = require ('mongoose');
const { Schema, model } = mongoose;

const BRAZILIAN_STATES = [
  'AC', 'AL', 'AP', 'AM', 'BA', 'CE', 'DF', 'ES', 'GO',
  'MA', 'MT', 'MS', 'MG', 'PA', 'PB', 'PR', 'PE', 'PI',
  'RJ', 'RN', 'RS', 'RO', 'RR', 'SC', 'SP', 'SE', 'TO'
];

const addressSchema = new mongoose.Schema({
  fullName: {type: String, required: true},
  street: {type: String, required: true},
  number: {type: String, required: true},
  complement: String,
  city: {type: String, required: true},
  state: {
    type: String,
    enum: BRAZILIAN_STATES,
    required: true
  },
  zipcode: {type: String, required: true},
  country: {
    type: String,
    default: 'Brasil',
    enum: ['Brasil'],
    required: true
  },
  phone: { type: String, required: true},
  isDefault: { type: Boolean, default: false}

});

const userSchema = new mongoose.Schema ({
  surname: {type: String, required: true},
  lastname: {type: String, required: true},
  //will be used on the middleware for private routes.
  isAdmin: {
      type: Boolean,
      default:false
    },
  email: {
    type: String, 
    required: [true, "Email is required."],
    unique: true,
    lowercase: true,
    trim: true,
  },
  password: {
      type: String,
      required: [true, "Password is required."],
    },
  addresses: [addressSchema] 
}, { timestamps: true });


const User = model("User", userSchema);

module.exports = User;