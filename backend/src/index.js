const express = require("express");
const cors = require("cors");
const path = require("path");
const multer = require("multer");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const fs = require("fs");

require("./Models/connection");

const User = require("./Models/User");
const Expo = require("./Models/Expos");
const Exhibitor = require("./Models/Exhibitor");
const ExhibitorApplications = require("./Models/ExhibitorApplications");
const Booth = require("./Models/Booth");
const Session = require("./Models/Session");
const AttendeeRegistration = require("./Models/AttendeeRegistrations");
const SessionRegistration = require("./Models/SessionRegistrations");
const Feedback = require("./Models/Feedback");
const Message = require("./Models/Message");
const Notification = require("./Models/Notifications");
const Analytics = require("./Models/Analytics");

const app = express();
const PORT = process.env.PORT || 5000;
const JWT_SECRET = process.env.JWT_SECRET || "eventsphere_secret_key_2026";

// Ensure uploads folder exists
const uploadDir = path.join(__dirname, "../uploads");
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

// Multer Storage Configuration
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/");
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + "-" + file.originalname.replace(/\s+/g, "_"));
  }
});
const upload = multer({ storage: storage });

// Middlewares
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use("/uploads", express.static(path.join(__dirname, "../uploads")));

// JWT Auth Middleware
const verifyToken = (req, res, next) => {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];
  if (!token) return res.status(401).json({ message: "Access denied. Token missing." });

  try {
    const verified = jwt.verify(token, JWT_SECRET);
    req.user = verified;
    next();
  } catch (error) {
    res.status(400).json({ message: "Invalid Token" });
  }
};

// Initial MongoDB Database Population (runs only if database collections are empty)
const initializeDatabase = async () => {
  try {
    const expoCount = await Expo.countDocuments();
    if (expoCount > 0) return;

    console.log("Initializing MongoDB with default initial expos and demo accounts...");

    const hashedPassword = await bcrypt.hash("admin123", 10);
    const hashedUserPassword = await bcrypt.hash("user123", 10);

    const adminUser = await User.create({
      name: "EventSphere Admin",
      email: "admin@eventsphere.com",
      password: hashedPassword,
      role: "admin",
      company: "EventSphere Management",
      phone: "+92 300 1112233"
    });

    const exhibitorUser1 = await User.create({
      name: "NovaTech Labs",
      email: "contact@novatech.io",
      password: hashedUserPassword,
      role: "exhibitor",
      company: "NovaTech Labs",
      phone: "+92 300 4445566"
    });

    const exhibitorUser2 = await User.create({
      name: "Vertex Studio",
      email: "info@vertexstudio.com",
      password: hashedUserPassword,
      role: "exhibitor",
      company: "Vertex Studio",
      phone: "+92 300 7778899"
    });

    const attendeeUser = await User.create({
      name: "Sarah Ahmed",
      email: "sarah.ahmed@example.com",
      password: hashedUserPassword,
      role: "attendee",
      company: "Tech Innovators Inc",
      phone: "+92 321 9988776"
    });

    const expo1 = await Expo.create({
      title: "Tech Future Expo 2026",
      description: "The largest technology conference showcasing AI, cloud computing, and next-gen software innovations.",
      theme: "Pioneering the Next Era of Artificial Intelligence & Smart Systems",
      category: "Technology",
      date: "2026-10-15",
      start_time: "09:00 AM",
      end_time: "05:00 PM",
      location: "Expo Centre Karachi, Hall 1 & 2",
      city: "Karachi",
      banner_image: "https://images.unsplash.com/photo-1540575467063-178a50c2df87?auto=format&fit=crop&w=1200&q=80",
      status: "upcoming",
      created_by: adminUser._id
    });

    const expo2 = await Expo.create({
      title: "Global Health & MedTech Summit",
      description: "Bringing together medical researchers, health startups, and hospital equipment leaders under one roof.",
      theme: "Transforming Healthcare with Digital Medical Devices & Biotech",
      category: "Healthcare",
      date: "2026-11-20",
      start_time: "10:00 AM",
      end_time: "06:00 PM",
      location: "Pak-China Friendship Centre",
      city: "Islamabad",
      banner_image: "https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?auto=format&fit=crop&w=1200&q=80",
      status: "upcoming",
      created_by: adminUser._id
    });

    const expo3 = await Expo.create({
      title: "Design & Media Creative Fair",
      description: "A gathering for UI/UX designers, digital artists, game developers, and creative marketing agencies.",
      theme: "Unleashing Creativity in the Age of Immersive Digital Experiences",
      category: "Design",
      date: "2026-12-05",
      start_time: "09:30 AM",
      end_time: "05:30 PM",
      location: "Lahore Expo Centre, Hall 3",
      city: "Lahore",
      banner_image: "https://images.unsplash.com/photo-1505373877841-8d25f7d46678?auto=format&fit=crop&w=1200&q=80",
      status: "upcoming",
      created_by: adminUser._id
    });

    const expo4 = await Expo.create({
      title: "Next-Gen Cloud & Cyber Summit",
      description: "Premier gathering for cybersecurity architects, DevOps engineers, and cloud infrastructure specialists.",
      theme: "Securing Cloud Workloads & Zero-Trust Infrastructure",
      category: "Technology",
      date: "2026-12-18",
      start_time: "09:00 AM",
      end_time: "05:00 PM",
      location: "Marriott Convention Centre",
      city: "Islamabad",
      banner_image: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=1200&q=80",
      status: "upcoming",
      created_by: adminUser._id
    });

    const expo5 = await Expo.create({
      title: "FinTech Revolution Summit 2026",
      description: "Connecting digital banking leaders, blockchain developers, and payment gateway innovators.",
      theme: "The Future of Open Banking, Crypto, and Global Payment Rails",
      category: "Business",
      date: "2027-01-10",
      start_time: "10:00 AM",
      end_time: "06:00 PM",
      location: "PC Hotel Grand Ballroom",
      city: "Karachi",
      banner_image: "https://images.unsplash.com/photo-1559526324-4b87b5e36e44?auto=format&fit=crop&w=1200&q=80",
      status: "upcoming",
      created_by: adminUser._id
    });

    const exhibitor1 = await Exhibitor.create({
      user_id: exhibitorUser1._id,
      company_name: "NovaTech Labs",
      logo: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=300&q=80",
      description: "Cutting-edge AI automation software and neural network development frameworks.",
      category: "AI & Software",
      contact_email: "contact@novatech.io",
      contact_phone: "+92 300 4445566",
      website: "https://novatech.io",
      booth: "A01",
      expo_id: expo1._id,
      products: [
        {
          name: "NovaBrain Enterprise AI",
          description: "Autonomous LLM assistant engine for enterprise workflows.",
          price: 4999,
          image: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=400&q=80"
        }
      ]
    });

    const exhibitor2 = await Exhibitor.create({
      user_id: exhibitorUser2._id,
      company_name: "Vertex Studio",
      logo: "https://images.unsplash.com/photo-1561070791-2526d30994b5?auto=format&fit=crop&w=300&q=80",
      description: "Next-gen 3D visual design, AR/VR simulation tools, and digital UI design systems.",
      category: "Design & Media",
      contact_email: "info@vertexstudio.com",
      contact_phone: "+92 300 7778899",
      website: "https://vertexstudio.com",
      booth: "A02",
      expo_id: expo1._id,
      products: [
        {
          name: "Vertex 3D Render Engine",
          description: "Photorealistic rendering toolkit for digital creators.",
          price: 2499,
          image: "https://images.unsplash.com/photo-1561070791-2526d30994b5?auto=format&fit=crop&w=400&q=80"
        }
      ]
    });

    await ExhibitorApplications.create({
      exhibitor_id: exhibitorUser1._id,
      expo_id: expo1._id,
      company_name: "NovaTech Labs",
      category: "AI & Software",
      description: "Exhibiting AI software platforms.",
      products: "NovaBrain Enterprise AI",
      contact_email: "contact@novatech.io",
      contact_phone: "+92 300 4445566",
      preferred_booth: "A01",
      assigned_booth: "A01",
      status: "approved"
    });

    await ExhibitorApplications.create({
      exhibitor_id: exhibitorUser2._id,
      expo_id: expo1._id,
      company_name: "Vertex Studio",
      category: "Design & Media",
      description: "Showcasing AR/VR interactive workstations.",
      products: "Vertex 3D Render Engine",
      contact_email: "info@vertexstudio.com",
      contact_phone: "+92 300 7778899",
      preferred_booth: "A02",
      assigned_booth: "A02",
      status: "approved"
    });

    const boothList = [
      { booth_number: "A01", size: "Large (20x20)", location: "Main Entrance", status: "occupied", exhibitor_id: exhibitor1._id, exhibitor_name: "NovaTech Labs", expo_id: expo1._id },
      { booth_number: "A02", size: "Standard (10x10)", location: "Tech Hall A", status: "occupied", exhibitor_id: exhibitor2._id, exhibitor_name: "Vertex Studio", expo_id: expo1._id },
      { booth_number: "A03", size: "Standard (10x10)", location: "Tech Hall A", status: "available", expo_id: expo1._id },
      { booth_number: "A04", size: "Standard (10x10)", location: "Tech Hall A", status: "available", expo_id: expo1._id },
      { booth_number: "B01", size: "Premium (15x15)", location: "Center Aisle", status: "available", expo_id: expo1._id },
      { booth_number: "STAGE", size: "Stage Area", location: "Main Stage", status: "reserved", exhibitor_name: "Main Keynote Stage", expo_id: expo1._id },
      { booth_number: "B03", size: "Standard (10x10)", location: "Center Aisle", status: "available", expo_id: expo1._id },
      { booth_number: "B04", size: "Standard (10x10)", location: "Center Aisle", status: "available", expo_id: expo1._id },
      { booth_number: "C01", size: "Corner Suite (15x20)", location: "West Wing", status: "available", expo_id: expo1._id },
      { booth_number: "C02", size: "Standard (10x10)", location: "West Wing", status: "available", expo_id: expo1._id },
      { booth_number: "LOUNGE", size: "Lounge Area", location: "VIP Lounge", status: "reserved", exhibitor_name: "Networking Lounge", expo_id: expo1._id },
      { booth_number: "C04", size: "Standard (10x10)", location: "West Wing", status: "available", expo_id: expo1._id },
      { booth_number: "D01", size: "Standard (10x10)", location: "East Hall", status: "available", expo_id: expo1._id },
      { booth_number: "D02", size: "Standard (10x10)", location: "East Hall", status: "available", expo_id: expo1._id },
      { booth_number: "D03", size: "Standard (10x10)", location: "East Hall", status: "available", expo_id: expo1._id },
      { booth_number: "D04", size: "Standard (10x10)", location: "East Hall", status: "available", expo_id: expo1._id }
    ];

    for (let b of boothList) {
      await Booth.create(b);
    }

    await AttendeeRegistration.create({
      attendee_id: attendeeUser._id,
      expo_id: expo1._id,
      status: "registered"
    });

    const sess1 = await Session.create({
      expo_id: expo1._id,
      time: "10:00 AM",
      title: "Keynote: The Future of AI in Enterprise",
      speaker: "Dr. Aris Thorne (Chief AI Scientist)",
      location: "Main Stage",
      tag: "Keynote",
      topic: "Artificial Intelligence",
      day: "Day 1"
    });

    await SessionRegistration.create({
      attendee_id: attendeeUser._id,
      session_id: sess1._id,
      status: "bookmarked"
    });

    await Notification.create({
      user_id: attendeeUser._id,
      title: "Welcome to EventSphere!",
      message: "Your registration for Tech Future Expo 2026 is confirmed.",
      type: "system"
    });

    await Feedback.create({
      user_id: attendeeUser._id,
      expo_id: expo1._id,
      name: "Sarah Ahmed",
      email: "sarah.ahmed@example.com",
      subject: "Event Experience",
      message: "The platform is smooth and intuitive!",
      rating: 5
    });

    console.log("Database initialized successfully with 5 default Expos!");
  } catch (err) {
    console.error("Database init error:", err.message);
  }
};

// ==========================================
// 1. COLLECTION: Users
// ==========================================

app.post("/api/register", async (req, res) => {
  try {
    const { name, email, password, role, company, phone } = req.body;
    if (!name || !email || !password) {
      return res.status(400).json({ message: "Name, email, and password are required." });
    }

    const existingUser = await User.findOne({ email: email.toLowerCase().trim() });
    if (existingUser) {
      return res.status(400).json({ message: "User with this email already exists." });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = await User.create({
      name,
      email: email.toLowerCase().trim(),
      password: hashedPassword,
      role: role || "attendee",
      company: company || "",
      phone: phone || ""
    });

    if (newUser.role === "exhibitor") {
      await Exhibitor.create({
        user_id: newUser._id,
        company_name: company || name,
        contact_email: email,
        contact_phone: phone || ""
      });
    }

    await Notification.create({
      user_id: newUser._id,
      title: "Welcome to EventSphere!",
      message: `Hi ${name}, welcome to EventSphere platform as an ${newUser.role}.`,
      type: "system"
    });

    const token = jwt.sign({ id: newUser._id, role: newUser.role, email: newUser.email }, JWT_SECRET, { expiresIn: "7d" });

    res.status(201).json({
      message: "Registration successful!",
      token,
      user: { id: newUser._id, name: newUser.name, email: newUser.email, role: newUser.role, company: newUser.company, phone: newUser.phone }
    });
  } catch (error) {
    res.status(5000).json({ message: "Registration failed.", error: error.message });
  }
});

app.post("/api/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ message: "Email and password are required." });
    }

    const user = await User.findOne({ email: email.toLowerCase().trim() });
    if (!user) {
      return res.status(400).json({ message: "Invalid email or password." });
    }

    let isMatch = false;
    if (user.password.startsWith("$2a$") || user.password.startsWith("$2b$")) {
      isMatch = await bcrypt.compare(password, user.password);
    } else {
      isMatch = user.password === password;
    }

    if (!isMatch) {
      return res.status(400).json({ message: "Invalid email or password." });
    }

    const token = jwt.sign({ id: user._id, role: user.role, email: user.email }, JWT_SECRET, { expiresIn: "7d" });

    res.json({
      message: "Login successful!",
      token,
      user: { id: user._id, name: user.name, email: user.email, role: user.role, company: user.company, phone: user.phone }
    });
  } catch (error) {
    res.status(5000).json({ message: "Login failed.", error: error.message });
  }
});

app.post("/api/forgot-password", async (req, res) => {
  try {
    const { email } = req.body;
    const user = await User.findOne({ email: email.toLowerCase().trim() });
    if (!user) return res.status(404).json({ message: "No user found with this email address." });

    const resetToken = Math.random().toString(36).substring(2, 15);
    user.resetToken = resetToken;
    user.resetTokenExpiry = Date.now() + 3600000;
    await user.save();

    res.json({ message: "Password reset token generated successfully!", resetToken });
  } catch (error) {
    res.status(5000).json({ message: "Forgot password request failed." });
  }
});

app.post("/api/reset-password", async (req, res) => {
  try {
    const { email, resetToken, newPassword } = req.body;
    const user = await User.findOne({ email: email.toLowerCase().trim(), resetToken, resetTokenExpiry: { $gt: Date.now() } });
    if (!user) return res.status(400).json({ message: "Invalid or expired reset token." });

    user.password = await bcrypt.hash(newPassword, 10);
    user.resetToken = null;
    user.resetTokenExpiry = null;
    await user.save();

    res.json({ message: "Password reset successful! You can now login." });
  } catch (error) {
    res.status(5000).json({ message: "Reset password failed." });
  }
});

app.put("/api/users/profile", async (req, res) => {
  try {
    const { user_id, name, phone, company } = req.body;
    const user = await User.findByIdAndUpdate(user_id, { name, phone, company }, { new: true }).select("-password");
    res.json({ message: "Profile updated successfully!", user });
  } catch (error) {
    res.status(5000).json({ message: "Failed to update profile." });
  }
});

app.get("/api/users", async (req, res) => {
  try {
    const users = await User.find().select("-password").sort({ createdAt: -1 });
    res.json(users);
  } catch (error) {
    res.status(5000).json({ message: "Failed to fetch users." });
  }
});

app.delete("/api/users/:id", async (req, res) => {
  try {
    await User.findByIdAndDelete(req.params.id);
    res.json({ message: "User removed successfully!" });
  } catch (error) {
    res.status(5000).json({ message: "Failed to delete user." });
  }
});

// ==========================================
// 2. COLLECTION: Expos
// ==========================================

app.get("/api/expos", async (req, res) => {
  try {
    const { search, category, status } = req.query;
    let query = {};
    if (category && category !== "All") query.category = category;
    if (status) query.status = status;
    if (search) {
      query.$or = [
        { title: { $regex: search, $options: "i" } },
        { location: { $regex: search, $options: "i" } },
        { city: { $regex: search, $options: "i" } },
        { theme: { $regex: search, $options: "i" } }
      ];
    }
    const expos = await Expo.find(query).populate("created_by", "name email").sort({ createdAt: -1 });
    res.json(expos);
  } catch (error) {
    res.status(5000).json({ message: "Failed to fetch expos from database." });
  }
});

app.get("/api/expos/:id", async (req, res) => {
  try {
    const expo = await Expo.findById(req.params.id).populate("created_by", "name email");
    if (!expo) return res.status(404).json({ message: "Expo not found" });

    const sessions = await Session.find({ expo_id: expo._id });
    const exhibitors = await Exhibitor.find({ expo_id: expo._id });
    const booths = await Booth.find({ expo_id: expo._id });

    res.json({ expo, sessions, exhibitors, booths });
  } catch (error) {
    res.status(5000).json({ message: "Failed to fetch expo detail." });
  }
});

app.post("/api/expos", upload.single("banner_image"), async (req, res) => {
  try {
    const { title, description, theme, category, date, start_time, end_time, location, city, status, created_by, banner_url } = req.body;
    const bannerPath = req.file ? `/uploads/${req.file.filename}` : banner_url || "https://images.unsplash.com/photo-1540575467063-178a50c2df87?auto=format&fit=crop&w=1200&q=80";

    const newExpo = await Expo.create({
      title,
      description,
      theme,
      category: category || "Technology",
      date,
      start_time: start_time || "09:00 AM",
      end_time: end_time || "05:00 PM",
      location,
      city: city || "Karachi",
      banner_image: bannerPath,
      status: status || "upcoming",
      created_by: created_by || null
    });

    res.status(201).json({ message: "Expo created successfully in database!", expo: newExpo });
  } catch (error) {
    res.status(5000).json({ message: "Failed to create expo.", error: error.message });
  }
});

app.put("/api/expos/:id", upload.single("banner_image"), async (req, res) => {
  try {
    const updateData = { ...req.body };
    if (req.file) updateData.banner_image = `/uploads/${req.file.filename}`;
    else if (req.body.banner_url) updateData.banner_image = req.body.banner_url;

    const updatedExpo = await Expo.findByIdAndUpdate(req.params.id, updateData, { new: true });
    res.json({ message: "Expo updated successfully in database!", expo: updatedExpo });
  } catch (error) {
    res.status(5000).json({ message: "Failed to update expo." });
  }
});

app.delete("/api/expos/:id", async (req, res) => {
  try {
    await Expo.findByIdAndDelete(req.params.id);
    res.json({ message: "Expo deleted successfully from database!" });
  } catch (error) {
    res.status(5000).json({ message: "Failed to delete expo." });
  }
});

// ==========================================
// 3. COLLECTION: Exhibitors & Products
// ==========================================

app.get("/api/exhibitors", async (req, res) => {
  try {
    const { category, search, user_id } = req.query;
    let query = {};
    if (user_id) query.user_id = user_id;
    if (category && category !== "All") query.category = category;
    if (search) {
      query.$or = [
        { company_name: { $regex: search, $options: "i" } },
        { category: { $regex: search, $options: "i" } },
        { description: { $regex: search, $options: "i" } }
      ];
    }
    const exhibitors = await Exhibitor.find(query).populate("expo_id", "title date location");
    res.json(exhibitors);
  } catch (error) {
    res.status(5000).json({ message: "Failed to fetch exhibitors." });
  }
});

app.get("/api/exhibitors/:id", async (req, res) => {
  try {
    const exhibitor = await Exhibitor.findById(req.params.id).populate("expo_id");
    if (!exhibitor) return res.status(404).json({ message: "Exhibitor not found" });
    res.json(exhibitor);
  } catch (error) {
    res.status(5000).json({ message: "Failed to fetch exhibitor profile." });
  }
});

app.post("/api/exhibitors/profile", upload.single("logo"), async (req, res) => {
  try {
    const { user_id, company_name, description, category, contact_email, contact_phone, website, booth, expo_id, logo_url } = req.body;
    let logoPath = req.file ? `/uploads/${req.file.filename}` : logo_url || "";

    let exhibitor = await Exhibitor.findOne({ user_id });
    if (exhibitor) {
      exhibitor.company_name = company_name || exhibitor.company_name;
      exhibitor.description = description || exhibitor.description;
      exhibitor.category = category || exhibitor.category;
      exhibitor.contact_email = contact_email || exhibitor.contact_email;
      exhibitor.contact_phone = contact_phone || exhibitor.contact_phone;
      exhibitor.website = website || exhibitor.website;
      if (booth) exhibitor.booth = booth;
      if (expo_id) exhibitor.expo_id = expo_id;
      if (logoPath) exhibitor.logo = logoPath;
      await exhibitor.save();
    } else {
      exhibitor = await Exhibitor.create({
        user_id, company_name, logo: logoPath, description, category, contact_email, contact_phone, website, booth: booth || "", expo_id: expo_id || null
      });
    }
    res.json({ message: "Exhibitor profile updated in database!", exhibitor });
  } catch (error) {
    res.status(5000).json({ message: "Failed to update exhibitor profile." });
  }
});

app.post("/api/exhibitors/products", upload.single("image"), async (req, res) => {
  try {
    const { user_id, name, description, price, image_url } = req.body;
    let imagePath = req.file ? `/uploads/${req.file.filename}` : image_url || "";

    let exhibitor = await Exhibitor.findOne({ user_id });
    if (!exhibitor) return res.status(404).json({ message: "Exhibitor profile not found" });

    exhibitor.products.push({ name, description, price: Number(price) || 0, image: imagePath });
    await exhibitor.save();
    res.json({ message: "Product saved to database!", exhibitor });
  } catch (error) {
    res.status(5000).json({ message: "Failed to add product." });
  }
});

app.delete("/api/exhibitors/products/:index", async (req, res) => {
  try {
    const { user_id } = req.query;
    let exhibitor = await Exhibitor.findOne({ user_id });
    if (!exhibitor) return res.status(404).json({ message: "Exhibitor profile not found" });

    const idx = parseInt(req.params.index, 10);
    if (idx >= 0 && idx < exhibitor.products.length) {
      exhibitor.products.splice(idx, 1);
      await exhibitor.save();
      return res.json({ message: "Product removed from database!", exhibitor });
    }
    res.status(400).json({ message: "Invalid product index" });
  } catch (error) {
    res.status(5000).json({ message: "Failed to delete product." });
  }
});

// ==========================================
// 4. COLLECTION: Exhibitor Applications
// ==========================================

app.post("/api/applications", upload.array("documents", 5), async (req, res) => {
  try {
    const { exhibitor_id, expo_id, company_name, category, description, products, contact_email, contact_phone, preferred_booth } = req.body;
    const documentPaths = req.files ? req.files.map(f => `/uploads/${f.filename}`) : [];

    const application = await ExhibitorApplications.create({
      exhibitor_id,
      expo_id: expo_id || null,
      company_name,
      category,
      description,
      products,
      contact_email,
      contact_phone,
      preferred_booth: preferred_booth || "",
      documents: documentPaths,
      status: "pending"
    });

    await Notification.create({
      user_id: exhibitor_id,
      title: "Application Submitted",
      message: `Your application for ${company_name} was submitted to organizers.`,
      type: "application_status"
    });

    res.status(201).json({ message: "Application submitted to database!", application });
  } catch (error) {
    res.status(5000).json({ message: "Failed to submit application." });
  }
});

app.get("/api/applications", async (req, res) => {
  try {
    const { exhibitor_id } = req.query;
    let query = {};
    if (exhibitor_id) query.exhibitor_id = exhibitor_id;

    const applications = await ExhibitorApplications.find(query)
      .populate("exhibitor_id", "name email phone")
      .populate("expo_id", "title date location")
      .sort({ createdAt: -1 });

    res.json(applications);
  } catch (error) {
    res.status(5000).json({ message: "Failed to fetch applications." });
  }
});

app.put("/api/applications/:id/status", async (req, res) => {
  try {
    const { status, assigned_booth, rejection_reason } = req.body;
    const application = await ExhibitorApplications.findById(req.params.id);
    if (!application) return res.status(404).json({ message: "Application not found" });

    application.status = status;
    if (assigned_booth) application.assigned_booth = assigned_booth;
    if (rejection_reason) application.rejection_reason = rejection_reason;
    await application.save();

    if (status === "approved" && (assigned_booth || application.preferred_booth)) {
      const boothNum = assigned_booth || application.preferred_booth;
      let booth = await Booth.findOne({ booth_number: boothNum });
      if (booth) {
        booth.status = "occupied";
        booth.exhibitor_name = application.company_name;
        if (application.expo_id) booth.expo_id = application.expo_id;
        await booth.save();
      } else {
        await Booth.create({
          booth_number: boothNum,
          status: "occupied",
          exhibitor_name: application.company_name,
          expo_id: application.expo_id || null
        });
      }

      await Exhibitor.findOneAndUpdate(
        { user_id: application.exhibitor_id },
        { booth: boothNum, expo_id: application.expo_id }
      );
    }

    await Notification.create({
      user_id: application.exhibitor_id,
      title: `Application ${status.toUpperCase()}`,
      message: `Your application for ${application.company_name} has been ${status}. Assigned Booth: ${assigned_booth || application.preferred_booth || "N/A"}.`,
      type: "application_status"
    });

    res.json({ message: `Application ${status} in database!`, application });
  } catch (error) {
    res.status(5000).json({ message: "Failed to update application status." });
  }
});

app.delete("/api/applications/:id", async (req, res) => {
  try {
    await ExhibitorApplications.findByIdAndDelete(req.params.id);
    res.json({ message: "Application deleted from database!" });
  } catch (error) {
    res.status(5000).json({ message: "Failed to delete application." });
  }
});

// ==========================================
// . COLLECTION: Booths
// ==========================================

app.get("/api/booths", async (req, res) => {
  try {
    const { expo_id } = req.query;
    let query = {};
    if (expo_id) query.expo_id = expo_id;

    const booths = await Booth.find(query).sort({ booth_number: 1 });
    res.json(booths);
  } catch (error) {
    res.status(5000).json({ message: "Failed to fetch booths." });
  }
});

app.post("/api/booths/allocate", async (req, res) => {
  try {
    const { expo_id, booth_number, size, location, status, exhibitor_name, exhibitor_id } = req.body;
    let booth = await Booth.findOne({ booth_number });
    if (booth) {
      booth.status = status || booth.status;
      if (exhibitor_name !== undefined) booth.exhibitor_name = exhibitor_name;
      if (exhibitor_id) booth.exhibitor_id = exhibitor_id;
      if (size) booth.size = size;
      if (location) booth.location = location;
      if (expo_id) booth.expo_id = expo_id;
      await booth.save();
    } else {
      booth = await Booth.create({
        expo_id: expo_id || null,
        booth_number,
        size: size || "Standard (10x10)",
        location: location || "Main Hall",
        status: status || "available",
        exhibitor_name: exhibitor_name || "",
        exhibitor_id: exhibitor_id || null
      });
    }
    res.json({ message: "Booth saved to database!", booth });
  } catch (error) {
    res.status(5000).json({ message: "Failed to allocate booth." });
  }
});

app.delete("/api/booths/:id", async (req, res) => {
  try {
    await Booth.findByIdAndDelete(req.params.id);
    res.json({ message: "Booth deleted from database!" });
  } catch (error) {
    res.status(5000).json({ message: "Failed to delete booth." });
  }
});

// ==========================================
// 6. COLLECTION: Attendee Registrations
// ==========================================

app.post("/api/attendee-registrations", async (req, res) => {
  try {
    const { attendee_id, expo_id } = req.body;
    let reg = await AttendeeRegistration.findOne({ attendee_id, expo_id });
    if (reg) return res.json({ message: "Already registered for this expo!", registration: reg });

    reg = await AttendeeRegistration.create({ attendee_id, expo_id, status: "registered" });

    const expo = await Expo.findById(expo_id);
    await Notification.create({
      user_id: attendee_id,
      title: "Expo Registration Confirmed",
      message: `You are registered for ${expo ? expo.title : "the expo"}. Your event pass is active!`,
      type: "info"
    });

    res.status(201).json({ message: "Registered for expo in database!", registration: reg });
  } catch (error) {
    res.status(5000).json({ message: "Expo registration failed." });
  }
});

app.get("/api/attendee-registrations", async (req, res) => {
  try {
    const { attendee_id, expo_id } = req.query;
    let query = {};
    if (attendee_id) query.attendee_id = attendee_id;
    if (expo_id) query.expo_id = expo_id;

    const list = await AttendeeRegistration.find(query)
      .populate("attendee_id", "name email phone company")
      .populate("expo_id")
      .sort({ createdAt: -1 });

    res.json(list);
  } catch (error) {
    res.status(5000).json({ message: "Failed to fetch registrations." });
  }
});

app.delete("/api/attendee-registrations/:id", async (req, res) => {
  try {
    await AttendeeRegistration.findByIdAndDelete(req.params.id);
    res.json({ message: "Expo registration cancelled." });
  } catch (error) {
    res.status(5000).json({ message: "Failed to cancel registration." });
  }
});

// ==========================================
// 7. COLLECTION: Sessions
// ==========================================

app.get("/api/sessions", async (req, res) => {
  try {
    const { expo_id, day } = req.query;
    let query = {};
    if (expo_id) query.expo_id = expo_id;
    if (day) query.day = day;

    const sessions = await Session.find(query).sort({ time: 1 });
    res.json(sessions);
  } catch (error) {
    res.status(5000).json({ message: "Failed to fetch sessions." });
  }
});

app.post("/api/sessions", async (req, res) => {
  try {
    const { expo_id, time, title, speaker, location, tag, topic, day } = req.body;
    const newSession = await Session.create({
      expo_id: expo_id || null,
      time: time || "10:00 AM",
      title,
      speaker,
      location: location || "Main Stage",
      tag: tag || "Keynote",
      topic: topic || "",
      day: day || "Day 1"
    });
    res.status(201).json({ message: "Session saved to database!", session: newSession });
  } catch (error) {
    res.status(5000).json({ message: "Failed to create session." });
  }
});

app.put("/api/sessions/:id", async (req, res) => {
  try {
    const updated = await Session.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json({ message: "Session updated in database!", session: updated });
  } catch (error) {
    res.status(5000).json({ message: "Failed to update session." });
  }
});

app.delete("/api/sessions/:id", async (req, res) => {
  try {
    await Session.findByIdAndDelete(req.params.id);
    res.json({ message: "Session deleted from database!" });
  } catch (error) {
    res.status(5000).json({ message: "Failed to delete session." });
  }
});

// ==========================================
// 8. COLLECTION: Session Registrations
// ==========================================

app.post("/api/session-registrations", async (req, res) => {
  try {
    const { attendee_id, session_id } = req.body;
    let reg = await SessionRegistration.findOne({ attendee_id, session_id });
    if (reg) return res.json({ message: "Session already bookmarked!", registration: reg });

    reg = await SessionRegistration.create({ attendee_id, session_id, status: "bookmarked" });
    res.status(201).json({ message: "Session bookmarked in database!", registration: reg });
  } catch (error) {
    res.status(5000).json({ message: "Session registration failed." });
  }
});

app.get("/api/session-registrations", async (req, res) => {
  try {
    const { attendee_id } = req.query;
    let query = {};
    if (attendee_id) query.attendee_id = attendee_id;

    const list = await SessionRegistration.find(query).populate("session_id").sort({ createdAt: -1 });
    res.json(list);
  } catch (error) {
    res.status(5000).json({ message: "Failed to fetch session registrations." });
  }
});

app.delete("/api/session-registrations/:id", async (req, res) => {
  try {
    await SessionRegistration.findByIdAndDelete(req.params.id);
    res.json({ message: "Bookmark removed." });
  } catch (error) {
    res.status(5000).json({ message: "Failed to remove bookmark." });
  }
});

// ==========================================
// 9. COLLECTION: Messages
// ==========================================

app.post("/api/messages", async (req, res) => {
  try {
    const { sender_id, receiver_id, expo_id, sender_name, sender_email, subject, message } = req.body;
    const msg = await Message.create({
      sender_id: sender_id || null,
      receiver_id: receiver_id || null,
      expo_id: expo_id || null,
      sender_name,
      sender_email,
      subject,
      message
    });
    res.status(201).json({ message: "Message saved to database!", data: msg });
  } catch (error) {
    res.status(5000).json({ message: "Failed to send message." });
  }
});

app.get("/api/messages", async (req, res) => {
  try {
    const { user_id } = req.query;
    let query = {};
    if (user_id) {
      query.$or = [{ sender_id: user_id }, { receiver_id: user_id }];
    }
    const messages = await Message.find(query).sort({ createdAt: -1 });
    res.json(messages);
  } catch (error) {
    res.status(5000).json({ message: "Failed to fetch messages." });
  }
});

app.put("/api/messages/:id/read", async (req, res) => {
  try {
    await Message.findByIdAndUpdate(req.params.id, { status: "read" });
    res.json({ message: "Message marked as read." });
  } catch (error) {
    res.status(5000).json({ message: "Failed to update message status." });
  }
});

app.delete("/api/messages/:id", async (req, res) => {
  try {
    await Message.findByIdAndDelete(req.params.id);
    res.json({ message: "Message deleted from database." });
  } catch (error) {
    res.status(5000).json({ message: "Failed to delete message." });
  }
});

// ==========================================
// 10. COLLECTION: Notifications
// ==========================================

app.get("/api/notifications", async (req, res) => {
  try {
    const { user_id } = req.query;
    let query = {};
    if (user_id) query.user_id = user_id;

    const notifications = await Notification.find(query).sort({ createdAt: -1 });
    res.json(notifications);
  } catch (error) {
    res.status(5000).json({ message: "Failed to fetch notifications." });
  }
});

app.post("/api/notifications", async (req, res) => {
  try {
    const { user_id, title, message, type } = req.body;
    const notif = await Notification.create({ user_id, title, message, type: type || "info" });
    res.status(201).json({ message: "Notification saved to database!", notif });
  } catch (error) {
    res.status(5000).json({ message: "Failed to send notification." });
  }
});

app.put("/api/notifications/:id/read", async (req, res) => {
  try {
    await Notification.findByIdAndUpdate(req.params.id, { is_read: true });
    res.json({ message: "Notification marked as read." });
  } catch (error) {
    res.status(5000).json({ message: "Failed to update notification." });
  }
});

// ==========================================
// 11. COLLECTION: Feedback
// ==========================================

app.post("/api/feedback", async (req, res) => {
  try {
    const { user_id, expo_id, name, email, subject, message, rating } = req.body;
    const fb = await Feedback.create({
      user_id: user_id || null,
      expo_id: expo_id || null,
      name,
      email,
      subject: subject || "Feedback",
      message,
      rating: rating || 5
    });
    res.status(201).json({ message: "Feedback submitted to database!", feedback: fb });
  } catch (error) {
    res.status(5000).json({ message: "Failed to submit feedback." });
  }
});

app.get("/api/feedback", async (req, res) => {
  try {
    const list = await Feedback.find().sort({ createdAt: -1 });
    res.json(list);
  } catch (error) {
    res.status(5000).json({ message: "Failed to fetch feedback." });
  }
});

app.delete("/api/feedback/:id", async (req, res) => {
  try {
    await Feedback.findByIdAndDelete(req.params.id);
    res.json({ message: "Feedback deleted from database!" });
  } catch (error) {
    res.status(5000).json({ message: "Failed to delete feedback." });
  }
});

// ==========================================
// 12. COLLECTION: Analytics
// ==========================================

app.get("/api/analytics", async (req, res) => {
  try {
    const totalExpos = await Expo.countDocuments();
    const totalExhibitors = await Exhibitor.countDocuments();
    const totalUsers = await User.countDocuments();
    const totalAttendees = await User.countDocuments({ role: "attendee" });
    const pendingApplications = await ExhibitorApplications.countDocuments({ status: "pending" });
    const totalBooths = await Booth.countDocuments();
    const occupiedBooths = await Booth.countDocuments({ status: "occupied" });
    const sessionRegistrationsCount = await SessionRegistration.countDocuments();

    res.json({
      totalExpos,
      totalExhibitors,
      totalUsers,
      totalAttendees,
      pendingApplications,
      totalBooths: totalBooths || 16,
      occupiedBooths: occupiedBooths || 2,
      session_registrations: sessionRegistrationsCount || 1,
      boothTrafficRate: totalBooths ? Math.round((occupiedBooths / totalBooths) * 100) : 25,
      attendeeEngagementScore: 95
    });
  } catch (error) {
    res.status(5000).json({ message: "Failed to load analytics data." });
  }
});

// Start Express Server
app.listen(PORT, async () => {
  console.log(`====================================================`);
  console.log(`🚀 EventSphere 12-Collection MERN REST API running on port ${PORT}`);
  console.log(`====================================================`);
  try {
    await initializeDatabase();
  } catch (err) {
    console.error("Init database error:", err.message);
  }
});