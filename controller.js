const User=require('./usermodel');
const Contact=require('./contactmodel');
const Booking = require('./bookingmodel');
const express = require('express');
const nodemailer = require('nodemailer');
const moment = require('moment');
const CarBrand = require('./carbrandmodel');
const CarType = require('./cartypemodel');
const transporter = nodemailer.createTransport({
  service: 'gmail', // Use your preferred email service
  auth: {
    user: 'gungunbansal001@gmail.com',
        pass: 'qlqb daos zhkj pxkk',// Replace with your email password or app password
  },
});
exports.signupUser = async (req, res) => {
  try {
    const { name, mobno, email, password, age } = req.body;
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(201).json({ message: 'Email already in use' });
    }
    const newUser = new User({ name, mobno, email, password, age });
    await newUser.save();

    return res.status(201).json({ message: 'User registered successfully' });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: 'Error signing up user', error });
  }
};
exports.updateUser = async (req, res) => {
  try {
    const { id, email, name, mobno, password, age } = req.body;

    // Use `id` (or any unique identifier) for the query
    const updatedUser = await User.findByIdAndUpdate(
      id, // Find user by `id`
      { email, name, mobno, password, age }, // Update fields
      { new: true } // Return the updated document
    );

    if (!updatedUser) {
      return res.status(404).json({ message: 'User not found' });
    }

    return res.status(200).json({
      message: 'User updated successfully',
      updatedUser,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      message: 'Error updating user',
      error,
    });
  }
};

exports.deleteUser = async (req, res) => {
  try {
    const { email } = req.body;

    // Find user by email and delete
    const deletedUser = await User.findOneAndDelete({ email });

    if (!deletedUser) {
      return res.status(404).json({ message: 'User not found' });
    }

    return res.status(200).json({
      message: 'User deleted successfully',
      deletedUser,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      message: 'Error deleting user',
      error,
    });
  }
};

exports.deleteQ = async (req, res) => {
  try {
    const { email } = req.body;

    // Find user by email and delete
    const deletedUser = await Booking.findOneAndDelete({ email });

    if (!deletedUser) {
      return res.status(404).json({ message: 'User not found' });
    }

    return res.status(200).json({
      message: 'User deleted successfully',
      deletedUser,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      message: 'Error deleting user',
      error,
    });
  }
};


const jwt = require('jsonwebtoken');
const JWT_SECRET = process.env.JWT_SECRET || 'yourSecretKey';

exports.loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: 'Invalid email or password' });
    }

    // Check if the password matches (you should hash and compare passwords in production)
    if (user.password !== password) {
      return res.status(400).json({ message: 'Invalid email or password' });
    }

    // Generate a JWT token
    const token = jwt.sign(
      { id: user._id, email: user.email }, // Payload data to include in the token
      JWT_SECRET, // Secret key
      { expiresIn: '1h' } // Token expiration (1 hour in this case)
    );

    // If valid credentials, send success response with the token
    return res.status(200).json({ message: 'Login successful', token });
  } catch (error) {
    return res.status(500).json({ message: 'Error logging in', error });
  }
};
exports.Contact = async (req, res) => {
  const { name, email, message } = req.body;

  if (!name || !email || !message) {
    return res.status(400).json({ error: 'All fields are required' });
  }

  try {
    // Save contact information to the database
    const newContact = new Contact({ name, email, message });
    await newContact.save();

    // Configure Nodemailer transport
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: 'gungunbansal001@gmail.com',
        pass: 'rzac szlf bhah fgrb',
      },
    });

    // Define email options
    const mailOptions = {
      from: 'simarnarula1477@gmail.com',
      to: email,
      subject: 'Thank you for contacting us!',
      text: `Hi ${name},\n\nThank you for reaching out! We have received your message and will get back to you shortly.\n\nYour message:\n${message}\n\nBest regards,\nThe Team`,
    };

    // Send the email
    transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        console.error('Error sending email:', error);
        return res.status(500).json({ error: 'Error sending email' });
      } else {
        res.status(200).json({ message: 'Contact information saved and email sent successfully!' });
      }
    });
  } catch (error) {
    console.error('Server error:', error); // Log detailed error
    res.status(500).json({ error: 'Server error' });
  }
};
exports.createBooking = async (req, res) => {
  try {
    const timing = moment(req.body.timing, "hh:mm A").toDate();

    // Extracting booking details
    const { name, email, carbrand, cartype, servicetype, notes } = req.body;

    // Check if email field is provided
    if (!email || email.trim() === "") {
      return res.status(400).json({ message: "Email field is required" });
    }

    const bookingData = {
      name,
      email,
      carbrand,
      cartype,
      servicetype,
      timing,
      notes,
    };

    // Save booking data
    const booking = new Booking(bookingData);
    const savedBooking = await booking.save();

    // Nodemailer setup
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: 'gungunbansal001@gmail.com',
        pass: 'rzac szlf bhah fgrb',
      },
    });

    // Email options for customer
    const mailOptionsUser = {
      from: 'gungunbansal001@gmail.com',
      to: email,
      subject: 'Booking Confirmation - Car Service',
      text: `Dear ${name},\n\nThank you for booking a service with us.\n\nDetails:\n- Car Brand: ${carbrand}\n- Car Type: ${cartype}\n- Service Type: ${servicetype}\n- Timing: ${req.body.timing}\n\nBest Regards,\nCar Service Team`,
    };

    // Email options for admin
    const mailOptionsAdmin = {
      from: 'gungunbansal001@gmail.com',
      to: 'tarunabansal7373@gmail.com',
      subject: 'New Booking Received',
      text: `New booking details:\n\nName: ${name}\nEmail: ${email}\nCar Brand: ${carbrand}\nCar Type: ${cartype}\nService Type: ${servicetype}\nTiming: ${req.body.timing}\nNotes: ${notes}`,
    };

    // Send emails in parallel
    await Promise.all([
      transporter.sendMail(mailOptionsUser),
      transporter.sendMail(mailOptionsAdmin),
    ]);

    res.status(201).json({ message: 'Booking created successfully', booking: savedBooking });
  } catch (error) {
    console.error('Error creating booking:', error);
    res.status(500).json({ message: 'Failed to create booking', error: error.message });
  }
};
exports.createCarBrand = async (req, res) => {
  try {
    const carBrandData = {
      name: req.body.name,
    };
    const carBrand = new CarBrand(carBrandData);
    const savedCarBrand = await carBrand.save();
    res.status(201).json({ message: 'Car brand added successfully', carBrand: savedCarBrand });
  } catch (error) {
    console.error('Error adding car brand:', error);
    res.status(500).json({ message: 'Failed to add car brand', error: error.message });
  }
};

// Function to get all car brands
exports.getAllCarBrands = async (req, res) => {
  try {
    const carBrands = await CarBrand.find();
    res.status(200).json(carBrands);
  } catch (error) {
    console.error('Error fetching car brands:', error);
    res.status(500).json({ message: 'Failed to fetch car brands', error: error.message });
  }
};


exports.createCarType = async (req, res) => {
  try {
    const carTypeData = {
      typename: req.body.typename,
    };
    const carType = new CarType(carTypeData);
    const savedCarType = await carType.save();
    res.status(201).json({ message: 'Car type added successfully', carType: savedCarType });
  } catch (error) {
    console.error('Error adding car type:', error);
    res.status(500).json({ message: 'Failed to add car type', error: error.message });
  }
};
exports.getAllCarTypes = async (req, res) => {
  try {
    const carTypes = await CarType.find();
    res.status(200).json(carTypes);
  } catch (error) {
    console.error('Error fetching car brands:', error);
    res.status(500).json({ message: 'Failed to fetch car brands', error: error.message });
  }
};
exports.getAllUsers = async (req, res) => {
  try {
    const user = await User.find();
    res.status(200).json(user);
  } catch (error) {
    console.error('Error fetching users:', error);
    res.status(500).json({ message: 'Failed to fetch users', error: error.message });
  }
};
exports.getAllBooking = async (req, res) => {
  try {
    const user = await Booking.find();
    res.status(200).json(user);
  } catch (error) {
    console.error('Error fetching users:', error);
    res.status(500).json({ message: 'Failed to fetch users', error: error.message });
  }
};
exports.getAllQueries = async (req, res) => {
  try {
    const user = await Contact.find();
    res.status(200).json(user);
  } catch (error) {
    console.error('Error fetching users:', error);
    res.status(500).json({ message: 'Failed to fetch users', error: error.message });
  }
};
exports.getBookingsByEmail = async (req, res) => {
  try {
    const { email } = req.query;

    // Check if email is provided
    if (!email || email.trim() === "") {
      return res.status(400).json({ message: "Email parameter is required" });
    }

    // Fetch bookings from the database based on email
    const bookings = await Booking.find({ email: email.trim() });

    // Check if any bookings are found
    if (bookings.length === 0) {
      return res.status(200).json({ message: "No bookings found for the provided email" });
    }

    res.status(200).json(bookings);
  } catch (error) {
    console.error("Error fetching bookings:", error);
    res.status(500).json({ message: "Failed to fetch bookings", error: error.message });
  }
};
exports.getUserByEmail = async (req, res) => {
  try {
    const { email } = req.query;

    // Check if email is provided
    if (!email || email.trim() === "") {
      return res.status(400).json({ message: "Email parameter is required" });
    }

    // Fetch bookings from the database based on email
    const bookings = await User.findOne({ email: email.trim() });

    // Check if any bookings are found
    if (bookings.length === 0) {
      return res.status(404).json({ message: "No User found for the provided email" });
    }

    res.status(200).json(bookings);
  } catch (error) {
    console.error("Error fetching User:", error);
    res.status(500).json({ message: "Failed to fetch User", error: error.message });
  }
};