const mongoose = require('mongoose');
const fs = require('fs');
const path = require('path');
const { v4: uuidv4 } = require('uuid');

let dbType = 'json';
const DATA_DIR = path.join(__dirname, '..', 'data');
const MEALS_FILE = path.join(DATA_DIR, 'meals.json');
const GOALS_FILE = path.join(DATA_DIR, 'goals.json');

// Ensure data folder and empty files exist for JSON fallback
if (!fs.existsSync(DATA_DIR)) {
  fs.mkdirSync(DATA_DIR, { recursive: true });
}
if (!fs.existsSync(MEALS_FILE)) {
  fs.writeFileSync(MEALS_FILE, JSON.stringify([]));
}
if (!fs.existsSync(GOALS_FILE)) {
  fs.writeFileSync(GOALS_FILE, JSON.stringify({
    targetCalories: 2000,
    proteinTarget: 130, // in grams
    carbsTarget: 220, // in grams
    fatsTarget: 65, // in grams
    weight: 70,
    height: 175,
    age: 25,
    gender: 'male',
    activityLevel: 'moderate',
    goalType: 'maintain'
  }));
}

// Function to connect database
async function connectDB() {
  const mongoUri = process.env.MONGO_URI;
  if (!mongoUri) {
    console.log('⚠️  No MONGO_URI provided in environment variables. Falling back to local file-based database.');
    dbType = 'json';
    return;
  }

  try {
    console.log('🔄 Attempting connection to MongoDB Atlas...');
    await mongoose.connect(mongoUri, {
      serverSelectionTimeoutMS: 5000, // Timeout after 5 seconds
    });
    dbType = 'mongodb';
    console.log('✅ MongoDB Connected successfully!');
  } catch (err) {
    console.error(`❌ MongoDB connection failed: ${err.message}`);
    console.log('⚠️  Defaulting to local file-based database for server resilience.');
    dbType = 'json';
  }
}

// JSON Database Helper Utilities
function readJSON(filePath) {
  try {
    const data = fs.readFileSync(filePath, 'utf-8');
    return JSON.parse(data);
  } catch (error) {
    return [];
  }
}

function writeJSON(filePath, data) {
  fs.writeFileSync(filePath, JSON.stringify(data, null, 2), 'utf-8');
}

// Mongoose Schemas for MongoDB mode
const MealSchema = new mongoose.Schema({
  title: { type: String, required: true },
  calories: { type: Number, required: true },
  protein: { type: Number, required: true },
  carbs: { type: Number, required: true },
  fats: { type: Number, required: true },
  mealType: { type: String, enum: ['breakfast', 'lunch', 'dinner', 'snack'], required: true },
  date: { type: String, required: true }, // Format YYYY-MM-DD
  aiAnalysis: { type: Boolean, default: false },
  time: { type: String } // HH:MM
}, { timestamps: true });

const GoalSchema = new mongoose.Schema({
  targetCalories: { type: Number, default: 2000 },
  proteinTarget: { type: Number, default: 130 },
  carbsTarget: { type: Number, default: 220 },
  fatsTarget: { type: Number, default: 65 },
  weight: { type: Number, default: 70 },
  height: { type: Number, default: 175 },
  age: { type: Number, default: 25 },
  gender: { type: String, default: 'male' },
  activityLevel: { type: String, default: 'moderate' },
  goalType: { type: String, default: 'maintain' }
}, { timestamps: true });

const MongoMeal = mongoose.model('Meal', MealSchema);
const MongoGoal = mongoose.model('Goal', GoalSchema);

// Unifying API Layer: Transparent database client wrapper
const dbService = {
  getDbType: () => dbType,

  // MEALS OPERATIONS
  meals: {
    find: async (query = {}) => {
      if (dbType === 'mongodb') {
        // filter by date or mealType
        return await MongoMeal.find(query).sort({ createdAt: -1 });
      } else {
        let list = readJSON(MEALS_FILE);
        if (query.date) {
          list = list.filter(m => m.date === query.date);
        }
        // Sort descending by simulated time
        return list.sort((a, b) => b.id.localeCompare(a.id));
      }
    },

    create: async (data) => {
      const now = new Date();
      const timeStr = data.time || now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: false });
      
      if (dbType === 'mongodb') {
        const meal = new MongoMeal({
          ...data,
          time: timeStr
        });
        return await meal.save();
      } else {
        const list = readJSON(MEALS_FILE);
        const newMeal = {
          id: uuidv4(),
          title: data.title,
          calories: Number(data.calories),
          protein: Number(data.protein),
          carbs: Number(data.carbs),
          fats: Number(data.fats),
          mealType: data.mealType,
          date: data.date,
          aiAnalysis: !!data.aiAnalysis,
          time: timeStr,
          createdAt: now.toISOString()
        };
        list.push(newMeal);
        writeJSON(MEALS_FILE, list);
        return newMeal;
      }
    },

    findByIdAndDelete: async (id) => {
      if (dbType === 'mongodb') {
        return await MongoMeal.findByIdAndDelete(id);
      } else {
        const list = readJSON(MEALS_FILE);
        const index = list.findIndex(m => m.id === id);
        if (index !== -1) {
          const removed = list.splice(index, 1)[0];
          writeJSON(MEALS_FILE, list);
          return removed;
        }
        return null;
      }
    }
  },

  // GOALS OPERATIONS
  goals: {
    findOne: async () => {
      if (dbType === 'mongodb') {
        let goal = await MongoGoal.findOne();
        if (!goal) {
          goal = new MongoGoal();
          await goal.save();
        }
        return goal;
      } else {
        return readJSON(GOALS_FILE);
      }
    },

    findOneAndUpdate: async (data) => {
      if (dbType === 'mongodb') {
        let goal = await MongoGoal.findOne();
        if (!goal) {
          goal = new MongoGoal(data);
        } else {
          Object.assign(goal, data);
        }
        return await goal.save();
      } else {
        const current = readJSON(GOALS_FILE);
        const updated = { ...current, ...data };
        writeJSON(GOALS_FILE, updated);
        return updated;
      }
    }
  }
};

module.exports = {
  connectDB,
  dbService
};
