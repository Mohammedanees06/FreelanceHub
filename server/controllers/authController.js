import User from "../models/User.js";
import jwt from "jsonwebtoken";
import generateToken from "../utils/generateToken.js";

export const registerUser = async (req, res) => {
  try {
    const { name, email, password, role } = req.body;

    if (!name || !email || !password || !role) {
      return res.status(400).json({ message: "Please fill all fields" });
    }

    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(400).json({ message: "User already exists" });
    }

    const user = await User.create({
      name,
      email,
      password,
      role,
    });

    if (user) {
      res.status(201).json({
        token: generateToken(user.id),
        user: {
          _id: user.id,
          name: user.name,
          email: user.email,
          role: user.role,
        }
      });
    } else {
      res.status(400).json({ message: "Invalid user data" });
    }
  } catch (error) {
    console.error(" Register Error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

export const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;
    console.log("=== LOGIN DEBUG START ===");
    console.log("req.body:", req.body);


    const user = await User.findOne({ email }).select('+password');
    console.log("Found user:", user ? "Yes" : "No");
    
    if (!user) {
      return res.status(401).json({ message: "Invalid email or password" });
    }


    const bcrypt = await import('bcrypt');
    
    console.log("Testing direct bcrypt.compare...");
    const directCompare = await bcrypt.default.compare(password, user.password);
   

 
    console.log("Testing matchPassword method...");
    const isMatch = await user.matchPassword(password);
  

    if (!isMatch) {
      return res.status(401).json({ message: "Invalid email or password" });
    }

    res.json({
      token: generateToken(user.id),
      user: {
        _id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
        bio: user.bio,
        skills: user.skills,
        location: user.location,
        phone: user.phone,
        website: user.website,
        company: user.company,
        jobTitle: user.jobTitle,
        experience: user.experience,
        hourlyRate: user.hourlyRate,
        socialLinks: user.socialLinks,
        profileImage: user.profileImage,
      }
    });
  } catch (error) {
    console.error("❌ Login Error:", error);
    console.error("Error stack:", error.stack);
    res.status(500).json({ message: "Server error" });
  }
};

export const getMe = async (req, res) => {
  try {
    if (!req.user) {
      return res.status(401).json({ message: "Not authorized" });
    }

    const user = await User.findById(req.user.id);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.status(200).json({
      _id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
      bio: user.bio,
      skills: user.skills,
      location: user.location,
      phone: user.phone,
      website: user.website,
      company: user.company,
      jobTitle: user.jobTitle,
      experience: user.experience,
      hourlyRate: user.hourlyRate,
      socialLinks: user.socialLinks,
      profileImage: user.profileImage,
      isVerified: user.isVerified,
      createdAt: user.createdAt,
    });
  } catch (error) {
    console.error("❌ GetMe Error:", error);
    res.status(500).json({ message: "Server error" });
  }
};



export const googleLogin = async (req, res) => {
  try {
    const { email, name, googleId, picture } = req.body;

    // Check if user exists
    let user = await User.findOne({ email });

    if (!user) {
      // Create new user if doesn't exist - automatically assign freelancer role
      user = new User({
        email,
        name,
        googleId,
        picture,
        authProvider: 'google',
        role: 'freelancer', // Add this line - automatically assign freelancer role
      });
      await user.save();
    } else {
      // Update existing user with Google info if needed
      if (!user.googleId) {
        user.googleId = googleId;
        user.picture = picture;
        await user.save();
      }
      // If user exists but doesn't have a role, assign freelancer
      if (!user.role) {
        user.role = 'freelancer';
        await user.save();
      }
    }
  
    // Generate JWT token
    const token = jwt.sign(
      { id: user._id, email: user.email, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    );
    
    res.json({
      success: true,
      token,
      user: {
        id: user._id,
        email: user.email,
        name: user.name,
        picture: user.picture,
        role: user.role, // Add role to the response
      },
    });
  } catch (error) {
    console.error('Google login error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error during Google login',
    });
  }
};


export const googleSignup = async (req, res) => {
  try {
    const { email, name, googleId, picture, role } = req.body;

    // Validate required fields
    if (!email || !name || !googleId) {
      return res.status(400).json({ message: 'Missing required fields' });
    }

    // Check if user already exists
    let user = await User.findOne({ email });

    if (user) {
      // User exists
      if (user.googleId) {
        return res.status(400).json({ 
          message: 'User already exists. Please login instead.' 
        });
      } else {
        // Link Google account to existing user
        user.googleId = googleId;
        user.picture = picture;
        await user.save();
      }
    } else {
      // Create new user
      user = await User.create({
        name,
        email,
        googleId,
        picture,
        role: role || 'freelancer',
      });
    }

    // Generate token
    const token = generateToken(user._id);

    res.status(201).json({
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        picture: user.picture,
      },
    });
  } catch (error) {
    console.error('Google signup error:', error);
    res.status(500).json({ 
      message: 'Server error during Google signup',
      error: error.message 
    });
  }
};

export const updateProfile = async (req, res) => {
  try {
    const {
      name,
      email,
      bio,
      skills,
      location,
      phone,
      website,
      company,
      jobTitle,
      experience,
      hourlyRate,
      socialLinks,
      profileImage
    } = req.body;

    const user = await User.findById(req.user.id);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Check if email is being changed and if it's already taken
    if (email && email !== user.email) {
      const emailExists = await User.findOne({ email });
      if (emailExists) {
        return res.status(400).json({ message: "Email already in use" });
      }
    }

    // Update fields if provided
    user.name = name || user.name;
    user.email = email || user.email;
    user.bio = bio !== undefined ? bio : user.bio;
    user.skills = skills !== undefined ? skills : user.skills;
    user.location = location !== undefined ? location : user.location;
    user.phone = phone !== undefined ? phone : user.phone;
    user.website = website !== undefined ? website : user.website;
    user.company = company !== undefined ? company : user.company;
    user.jobTitle = jobTitle !== undefined ? jobTitle : user.jobTitle;
    user.experience = experience !== undefined ? experience : user.experience;
    user.hourlyRate = hourlyRate !== undefined ? hourlyRate : user.hourlyRate;
    user.socialLinks = socialLinks !== undefined ? socialLinks : user.socialLinks;
    user.profileImage = profileImage !== undefined ? profileImage : user.profileImage;

    const updatedUser = await user.save();

    res.json({
      _id: updatedUser.id,
      name: updatedUser.name,
      email: updatedUser.email,
      role: updatedUser.role,
      bio: updatedUser.bio,
      skills: updatedUser.skills,
      location: updatedUser.location,
      phone: updatedUser.phone,
      website: updatedUser.website,
      company: updatedUser.company,
      jobTitle: updatedUser.jobTitle,
      experience: updatedUser.experience,
      hourlyRate: updatedUser.hourlyRate,
      socialLinks: updatedUser.socialLinks,
      profileImage: updatedUser.profileImage,
    });
  } catch (error) {
    console.error("❌ Update Profile Error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

export const uploadResume = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: "Please upload a file" });
    }

    const user = await User.findById(req.user.id);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    user.resume = `/uploads/resumes/${req.file.filename}`;
    await user.save();

    res.json({
      message: "Resume uploaded successfully",
      resume: user.resume,
    });
  } catch (error) {
    console.error("❌ Upload Resume Error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

export const changePassword = async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;

    if (!currentPassword || !newPassword) {
      return res.status(400).json({ message: "Please provide both passwords" });
    }

    if (newPassword.length < 6) {
      return res.status(400).json({ message: "Password must be at least 6 characters" });
    }

    const user = await User.findById(req.user.id).select('+password');

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const isMatch = await user.matchPassword(currentPassword);
    if (!isMatch) {
      return res.status(401).json({ message: "Current password is incorrect" });
    }

    user.password = newPassword;
    await user.save();

    res.json({ message: "Password updated successfully" });
  } catch (error) {
    console.error("❌ Change Password Error:", error);
    res.status(500).json({ message: "Server error" });
  }
};