import express, { text } from 'express';
import mongoose from 'mongoose';
import cors from "cors";
import User from "./models/User.js";
import Entry from './models/Entry.js';
import ObjectModel from './models/Object.js';
import bcrypt from 'bcrypt';
import dotenv from 'dotenv';
import jwt from 'jsonwebtoken';
import puppeteer from 'puppeteer';




dotenv.config();

const app = express();
app.use(cors());

app.use(express.json());


const MONGO_URI = 'mongodb://localhost:27017/monkeys1';

mongoose.connect(MONGO_URI, {
  useNewUrlParser: true,
    useUnifiedTopology: true,
}).then(() => {
  console.log('Connected to MongoDB');
}).catch(err => {
  console.error('MongoDB connection error:', err);
});

const saltRounds = 10;

function verifyToken(req, res, next) {
  const authHeader = req.headers["authorization"];

  if(!authHeader || !authHeader.startsWith("Bearer")) {
    return res.status(401).json({message: 'yetkilendirme gerekli'})
  }

  const token = authHeader.split(" ")[1];

  jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
    if (err) {
      return res.status(403).json({message: 'Geçersiz token'})
    }

    req.user = decoded;
    next();
  })
}


//scrapper
app.get('/dolar', async(req, res) => {
  try {
    const browser = await puppeteer.launch({ headless: true });
    const page = await browser.newPage();
    await page.goto("https://bigpara.hurriyet.com.tr/doviz/dolar/", {
      waitUntil: "networkidle2",
    });

    const dolar = await page.$eval(".value", el => el.innerHTML);
    console.log("Güncel dolar kuru:", dolar);
    await browser.close();
    res.json({ kur: dolar });
  } catch (error) {
    console.error("Dolar verisi alınamadı: ", error);
    res.status(500).json({ message: "Dolar kuru alınamadı"})
  }
});

// Bring all the entries
app.get('/entries', async (req, res) => {
  try {
    const entries = await Entry.find().sort({date:-1});
    res.status(200).json(entries);
  }catch{
    console.error('Error fetching entries: ', error);
    res.status(500).json({message: 'sunucu hatası'});
  }
})

// Public endpoint for QR code access (no authentication required)
app.get('/public/objects/:id', async (req, res) => {
    try {
        const { id } = req.params;
        
        // Validate ObjectId format
        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).json({ message: 'Geçersiz ID formatı' });
        }
        
        // Find the object by ID without requiring authentication
        const object = await ObjectModel.findById(id);
        
        if (!object) {
            return res.status(404).json({ message: 'Nesne bulunamadı' });
        }
        
        // Return the object data (excluding sensitive user info if any)
        res.json({
            _id: object._id,
            title: object.title,
            description: object.description,
            color: object.color,
            importance: object.importance,
            createdAt: object.createdAt
        });
    } catch (error) {
        console.error('Error fetching public object:', error);
        res.status(500).json({ message: 'Sunucu hatası' });
    }
});

//Get user data
app.get('/home', verifyToken, async (req, res) => {
  res.status(200).json({
    message: 'Hoş geldiniz',
    email: req.user.email,
  })
});

// Get user's objects
app.get('/objects', verifyToken, async (req, res) => {
  try {
    const objects = await ObjectModel.find({userId: req.user.id}).sort({createdAt: -1});
    res.status(200).json(objects)
  }catch (error) {
    console.error('Error fetching objects:', error);
    return res.status(500).json({ message: 'Sunucu hatası' });
  }
});

// edit the object
app.put('/objects/:id', verifyToken, async (req, res) => {
  const { id } = req.params;
  const { title, description, color, importance } =req.body;

  console.log("ID:", id);
  console.log("User ID:", req.user.id);

  if (!title || !description || !color || !importance) {
    return res.status(400).json({ message: 'Tüm alanlar gerekli' });
  }

  try {
    const object = await ObjectModel.findOne({_id: id, userId: req.user.id});
    if (!object) {
      return res.status(404).json({ message: 'Nesne bulunamadı veya yetkiniz yok'});
    }

    object.title = title;
    object.description = description;
    object.color = color;
    object.importance = importance;

    await object.save();
    return res.status(200).json({message: 'Object updated', object});
  } catch (error) {
    console.error('Error editing object:', error);
    return res.status(500).json({ message: 'Sunucu hatası' });
  }
});

// Create a new object
app.post('/objects', verifyToken, async (req, res) => {
  const { title, description, color, importance } = req.body;

  if (!title || !description || !color || !importance) {
    return res.status(400).json({ message: 'Tüm alanlar gerekli' });
  }

  try {
    const newObject = new ObjectModel({
      title,
      description,
      color,
      importance,
      userId: req.user.id // Associate the object with the user
    });

    await newObject.save();
    return res.status(201).json({
      message: 'Nesne başarıyla oluşturuldu', 
      object: newObject 
    });
  } catch (error) {
    console.error('Error creating object:', error);
    return res.status(500).json({ message: 'Sunucu hatası' });
  }
});

//Register endpoint
app.post('/register',async (req, res ) => {
    const { FirstName, LastName, email, password } = req.body;

    if(!FirstName || ! LastName || !email || !password) 
        return res.status(400).json({ message: 'Tüm alanlar gerekli'});

    try {
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ message: 'Bu e-posta zaten kayıtlı' });
        }

        const hashedPassword = await bcrypt.hash(password, saltRounds);

        const newUser = new User({
            FirstName,
            LastName,
            email,
            password: hashedPassword
        });

        await newUser.save();
        return res.status(201).json({ message: 'Kullanıcı başarıyla kaydedildi', user: { id: newUser._id, email: newUser.email } });
    } catch (error) {
        console.error('Register error:', error);
        return res.status(500).json({ message: 'Sunucu hatası' });
    }
}
);

// LOgin endpoint
app.post('/login', async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ message: 'Email ve şifre gerekli' });
  }

  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({ message: 'Kullanıcı bulunamadı' });
    }

    // Ban control
    const now = new Date();
    const tenMinutesAgo = new Date(now.getTime() - 10 * 60 * 1000);
    const fiveMinutesAgo = new Date(now.getTime() - 5 * 60 * 1000);

    // SControl if it banned in 10 min
    const lastEntries = await Entry.find({ email }).sort({ createdAt: -1 }).limit(5);

    // is there 3 false attempt in 5 min
    const recentFails = await Entry.find({
      email,
      isCorrect: false,
      createdAt: { $gte: fiveMinutesAgo }
    });

    if (recentFails.length >= 3) {
      // 10 min ban
      const lastFailTime = recentFails[recentFails.length - 1].createdAt;
      const banExpireTime = new Date(lastFailTime.getTime() + 10 * 60 * 1000);

      if (now < banExpireTime) {
        return res.status(403).json({ message: "Çok fazla hatalı giriş yapıldı. Lütfen 10 dakika sonra tekrar deneyin." });
      }
    }

    // password control
    const isPasswordValid = await bcrypt.compare(password, user.password);
    const newEntry = new Entry({ email, isCorrect: isPasswordValid });
    await newEntry.save();

    if (!isPasswordValid) {
      return res.status(401).json({ message: 'Geçersiz şifre' });
    }

    // create token if password correct
    const token = jwt.sign(
      { id: user._id, email: user.email },
      process.env.JWT_SECRET,
      { expiresIn: '1m' }
    );

    return res.json({
      message: 'Giriş başarılı',
      token,
      user: { id: user._id, email: user.email }
    });

  } catch (error) {
    console.error('Login error:', error);
    return res.status(500).json({ message: 'Sunucu hatası' });
  }
});

//Objects Delete endpoint
app.delete('/objects/:id', verifyToken, async(req,res) => {
  const {id} = req.params;

  try {
    const deleted = await ObjectModel.findOneAndDelete({_id: id, userId:req.user.id});
    if (!deleted) {
      return res.status(404).json({ message: 'Nesne bulunamadı veya silme yetkiniz yok' });
    }

    return res.status(200).json({ message: 'Nesne başarıyla silindi' });
  } catch (error) {
    console.error('Error deleting object:', error);
    return res.status(500).json({ message: 'Sunucu hatası' });
  }
});

const  PORT = 5000;
app.listen(PORT, '0.0.0.0',() => {
  console.log(`Server is running on http://localhost:${PORT}`);
});