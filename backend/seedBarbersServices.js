import dotenv from "dotenv";
import mongoose from "mongoose";
import Barber from "./models/barber.model.js";
import Service from "./models/service.model.js";
import Shop from "./models/shop.model.js";
import User from "./models/user.model.js";

dotenv.config();

const seedBarbersAndServices = async () => {
  try {
    // Connect to MongoDB
    await mongoose.connect("mongodb://localhost:27017/barberslotbooking");
    console.log("MongoDB connected");

    // Get all shops
    const shops = await Shop.find();
    
    if (shops.length === 0) {
      console.log("No shops found. Please seed shops first.");
      return;
    }

    // Get the first user (owner) to create barber users
    const owner = await User.findOne();
    
    if (!owner) {
      console.log("No users found. Please create users first.");
      return;
    }

    // Clear existing barbers and services
    await Barber.deleteMany({});
    await Service.deleteMany({});
    console.log("Cleared existing barbers and services");

    // Generate time slots for today and next 7 days
    const generateSlots = () => {
      const slots = [];
      const times = [
        "09:00 AM", "10:00 AM", "11:00 AM", "12:00 PM",
        "01:00 PM", "02:00 PM", "03:00 PM", "04:00 PM",
        "05:00 PM", "06:00 PM", "07:00 PM", "08:00 PM"
      ];
      
      for (let i = 0; i < 7; i++) {
        const date = new Date();
        date.setDate(date.getDate() + i);
        date.setHours(0, 0, 0, 0);
        
        slots.push({
          date: date,
          slots: times.map(time => ({
            time: time,
            isBooked: Math.random() > 0.7 // 30% chance of being booked
          }))
        });
      }
      
      return slots;
    };

    // Create barber users for each shop
    const barberUsers = [];
    
    for (let i = 0; i < shops.length * 3; i++) {
      const barberUser = new User({
        FirstName: ["John", "Mike", "David", "Alex", "Chris", "Ryan", "Mark", "Tom", "James", "Robert", "Daniel", "Steve"][i % 12],
        LastName: ["Smith", "Johnson", "Williams", "Brown", "Davis", "Miller", "Wilson", "Moore", "Taylor", "Anderson", "Thomas", "Jackson"][i % 12],
        email: `barber${i + 1}@barbershop.com`,
        phone: `555010${1000 + i}`,
        passwordHash: "$2a$10$abcdefghijklmnopqrstuvwxyz1234567890ABCDEF", // dummy hash
        isVerified: true,
        profileImage: `https://i.pravatar.cc/150?img=${i + 10}`
      });
      
      await barberUser.save();
      barberUsers.push(barberUser);
    }
    
    console.log(`Created ${barberUsers.length} barber users`);

    // Create barbers for each shop (3 barbers per shop)
    const barbers = [];
    const specializations = [
      ["Haircut", "Beard Trim", "Hair Styling"],
      ["Fade", "Shave", "Hair Coloring"],
      ["Haircut", "Beard Design", "Hair Treatment"],
      ["Classic Cut", "Modern Styles", "Grooming"],
      ["Beard Sculpting", "Hair Styling", "Fade"],
      ["Haircut", "Shave", "Hair Design"],
      ["Hair Coloring", "Styling", "Treatment"],
      ["Fade", "Beard Trim", "Grooming"],
      ["Haircut", "Modern Styles", "Hair Art"],
      ["Shave", "Beard Design", "Styling"],
      ["Classic Cut", "Fade", "Treatment"],
      ["Haircut", "Grooming", "Hair Coloring"]
    ];

    let barberUserIndex = 0;
    
    for (const shop of shops) {
      for (let i = 0; i < 3; i++) {
        const barber = new Barber({
          user_id: barberUsers[barberUserIndex]._id,
          shop_id: shop._id,
          experience: Math.floor(Math.random() * 10) + 1,
          specialization: specializations[barberUserIndex % specializations.length],
          profile_image: barberUsers[barberUserIndex].profileImage,
          availability: generateSlots()
        });
        
        await barber.save();
        barbers.push(barber);
        barberUserIndex++;
      }
    }
    
    console.log(`Created ${barbers.length} barbers`);

    // Create services for each shop
    const serviceTemplates = [
      {
        name: "Classic Haircut",
        description: "Traditional haircut with precision styling",
        price: 25,
        duration: 30,
        category: "Men's Cut",
        tags: ["haircut", "classic", "styling"]
      },
      {
        name: "Fade Haircut",
        description: "Modern fade with clean lines",
        price: 30,
        duration: 40,
        category: "Men's Cut",
        tags: ["fade", "modern", "haircut"]
      },
      {
        name: "Beard Trim",
        description: "Professional beard trimming and shaping",
        price: 15,
        duration: 20,
        category: "Beard Trim",
        tags: ["beard", "trim", "grooming"]
      },
      {
        name: "Beard & Haircut Combo",
        description: "Complete grooming package",
        price: 40,
        duration: 50,
        category: "Combo",
        tags: ["combo", "beard", "haircut"]
      },
      {
        name: "Hot Towel Shave",
        description: "Luxurious hot towel shave experience",
        price: 35,
        duration: 45,
        category: "Shaving",
        tags: ["shave", "luxury", "grooming"]
      },
      {
        name: "Hair Styling",
        description: "Professional hair styling for special occasions",
        price: 20,
        duration: 25,
        category: "Hair Styling",
        tags: ["styling", "special", "occasions"]
      },
      {
        name: "Hair Coloring",
        description: "Professional hair coloring service",
        price: 50,
        duration: 90,
        category: "Hair Styling",
        tags: ["coloring", "dye", "styling"]
      },
      {
        name: "Kids Haircut",
        description: "Gentle haircut for children",
        price: 18,
        duration: 25,
        category: "Men's Cut",
        tags: ["kids", "children", "haircut"]
      }
    ];

    const services = [];
    
    for (const shop of shops) {
      for (const template of serviceTemplates) {
        const service = new Service({
          shop_id: shop._id,
          name: template.name,
          description: template.description,
          price: template.price + Math.floor(Math.random() * 10) - 5, // Vary price slightly
          duration: template.duration,
          category: template.category,
          tags: template.tags,
          isActive: true,
          image: `https://picsum.photos/seed/${shop._id}${template.name}/400/300`
        });
        
        await service.save();
        services.push(service);
      }
    }
    
    console.log(`Created ${services.length} services`);

    console.log("\n✅ Database seeded successfully!");
    console.log(`- ${barberUsers.length} barber users`);
    console.log(`- ${barbers.length} barbers (3 per shop)`);
    console.log(`- ${services.length} services (8 per shop)`);
    
    mongoose.connection.close();
  } catch (error) {
    console.error("Error seeding database:", error);
    mongoose.connection.close();
  }
};

seedBarbersAndServices();
