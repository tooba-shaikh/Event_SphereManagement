const mongoose = require("./Models/connection");
const bcrypt = require("bcryptjs");
const User = require("./Models/User");
const Expo = require("./Models/Expos");
const Exhibitor = require("./Models/Exhibitor");
const Booth = require("./Models/Booth");
const Session = require("./Models/Session");

const seedDatabase = async () => {
  try {
    console.log("Seeding EventSphere database...");

    // 1. Seed Admin User
    const existingAdmin = await User.findOne({ email: "admin@eventsphere.com" });
    let adminUser = existingAdmin;

    if (!existingAdmin) {
      const hashedPassword = await bcrypt.hash("admin123", 10);
      adminUser = await User.create({
        name: "EventSphere Admin",
        email: "admin@eventsphere.com",
        password: hashedPassword,
        role: "admin",
        company: "EventSphere Management"
      });
      console.log("Admin user created: admin@eventsphere.com / admin123");
    }

    // 2. Seed Exhibitor User
    const existingExhibitor = await User.findOne({ email: "novatech@exhibitor.com" });
    let exhibitorUser = existingExhibitor;
    if (!existingExhibitor) {
      const hashedPassword = await bcrypt.hash("exhibitor123", 10);
      exhibitorUser = await User.create({
        name: "NovaTech Labs",
        email: "novatech@exhibitor.com",
        password: hashedPassword,
        role: "exhibitor",
        company: "NovaTech Labs Inc."
      });
    }

    // 3. Seed Expos
    const existingExposCount = await Expo.countDocuments();
    let sampleExpo;
    if (existingExposCount === 0) {
      sampleExpo = await Expo.create({
        title: "Tech Future Expo 2026",
        description: "Meet innovators, founders and technology leaders shaping tomorrow.",
        theme: "Artificial Intelligence & Cloud Innovations",
        category: "Technology",
        date: "2026-10-12",
        start_time: "09:00 AM",
        end_time: "05:00 PM",
        location: "Expo Centre Karachi",
        city: "Karachi",
        banner_image: "https://images.unsplash.com/photo-1540575467063-178a50c2df87?auto=format&fit=crop&w=1200&q=80",
        status: "upcoming",
        created_by: adminUser._id
      });

      await Expo.create({
        title: "Business Connect Pakistan",
        description: "A focused business networking experience for growing companies.",
        theme: "Enterprise Growth & Partnerships",
        category: "Business",
        date: "2026-10-22",
        start_time: "10:00 AM",
        end_time: "06:00 PM",
        location: "Pearl Continental",
        city: "Lahore",
        banner_image: "https://images.unsplash.com/photo-1505373877841-8d25f7d46678?auto=format&fit=crop&w=1200&q=80",
        status: "upcoming",
        created_by: adminUser._id
      });

      await Expo.create({
        title: "Creative & Design Summit",
        description: "Ideas, design, culture and creative technology under one roof.",
        theme: "UI/UX, Media & Brand Design",
        category: "Design",
        date: "2026-11-05",
        start_time: "09:30 AM",
        end_time: "05:30 PM",
        location: "Arts Council",
        city: "Karachi",
        banner_image: "https://images.unsplash.com/photo-1492684223066-81342ee5ff30?auto=format&fit=crop&w=1200&q=80",
        status: "upcoming",
        created_by: adminUser._id
      });

      console.log("Sample Expos seeded.");
    } else {
      sampleExpo = await Expo.findOne();
    }

    // 4. Seed Exhibitors
    const existingExhibitorsCount = await Exhibitor.countDocuments();
    if (existingExhibitorsCount === 0 && sampleExpo) {
      await Exhibitor.create({
        user_id: exhibitorUser._id,
        company_name: "NovaTech Labs",
        logo: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=200&q=80",
        description: "Intelligent tools and AI software for modern enterprise teams.",
        category: "AI & Software",
        contact_email: "contact@novatech.com",
        contact_phone: "+92 300 1234567",
        website: "https://novatech.example.com",
        booth: "A-12",
        expo_id: sampleExpo._id,
        products: [
          { name: "NovaAI Suite", description: "Automation agent platform", price: 499 }
        ]
      });

      await Exhibitor.create({
        company_name: "Vertex Studio",
        logo: "https://images.unsplash.com/photo-1572021335469-31706a17aaef?auto=format&fit=crop&w=200&q=80",
        description: "Brand, product, digital experience agency.",
        category: "Design & Media",
        contact_email: "hello@vertex.studio",
        contact_phone: "+92 300 7654321",
        website: "https://vertex.studio",
        booth: "B-07",
        expo_id: sampleExpo._id
      });

      console.log("Sample Exhibitors seeded.");
    }

    // 5. Seed Booths
    const existingBoothsCount = await Booth.countDocuments();
    if (existingBoothsCount === 0 && sampleExpo) {
      const boothNumbers = [
        "A01", "A02", "A03", "A04",
        "B01", "B02", "B03", "B04",
        "C01", "C02", "C03", "C04",
        "D01", "D02", "D03", "D04"
      ];

      for (let i = 0; i < boothNumbers.length; i++) {
        const num = boothNumbers[i];
        let status = "available";
        let exhibitor_name = "";

        if (num === "A01" || num === "A12" || num === "A02") {
          status = "occupied";
          exhibitor_name = "NovaTech Labs";
        } else if (num === "B01" || num === "B07") {
          status = "occupied";
          exhibitor_name = "Vertex Studio";
        }

        await Booth.create({
          expo_id: sampleExpo._id,
          booth_number: num,
          size: "Standard (10x10)",
          location: "Main Floor",
          status: status,
          exhibitor_name: exhibitor_name
        });
      }

      console.log("Sample Booths seeded.");
    }

    // 6. Seed Sessions
    const existingSessionsCount = await Session.countDocuments();
    if (existingSessionsCount === 0 && sampleExpo) {
      await Session.create([
        {
          expo_id: sampleExpo._id,
          time: "10:00 AM",
          title: "Opening Keynote: Ideas That Move Industries",
          speaker: "Dr. Aris Thorne",
          location: "Main Stage",
          tag: "Keynote",
          day: "Day 1"
        },
        {
          expo_id: sampleExpo._id,
          time: "11:30 AM",
          title: "Building Products People Actually Want",
          speaker: "Sarah Jenkins & Panel",
          location: "Innovation Hall",
          tag: "Panel",
          day: "Day 1"
        },
        {
          expo_id: sampleExpo._id,
          time: "01:00 PM",
          title: "Networking & Exhibition Floor Walk",
          speaker: "EventSphere Team",
          location: "Expo Floor",
          tag: "Networking",
          day: "Day 1"
        },
        {
          expo_id: sampleExpo._id,
          time: "02:30 PM",
          title: "AI, Creativity and the Future of Work",
          speaker: "Alex Rivera",
          location: "Main Stage",
          tag: "Talk",
          day: "Day 1"
        }
      ]);
      console.log("Sample Sessions seeded.");
    }

    console.log("EventSphere Database Seeding Complete!");
  } catch (error) {
    console.error("Seeding Error:", error);
  }
};

if (require.main === module) {
  seedDatabase().then(() => mongoose.connection.close());
}

module.exports = seedDatabase;
