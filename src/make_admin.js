const mongoose = require('mongoose');
const User = require('./models/User');
require('dotenv').config();

async function makeAdmin(email) {
  if (!email) {
    console.error('Please provide an email address.');
    process.exit(1);
  }

  try {
    await mongoose.connect(process.env.MONGODB_URI);
    const user = await User.findOneAndUpdate({ email: email }, { isAdmin: true }, { new: true });
    
    if (user) {
      console.log(`✅ Success: ${email} is now an Admin.`);
    } else {
      console.log(`❌ Error: User with email ${email} not found.`);
    }
    process.exit(0);
  } catch (err) {
    console.error('❌ Connection error:', err);
    process.exit(1);
  }
}

const email = process.argv[2];
makeAdmin(email);
