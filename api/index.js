const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();
const http = require('http');
const { Server } = require('socket.io');

const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors());
app.use(express.json());

const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: 'http://192.168.0.100:19006',
    methods: ['GET', 'POST'],
  },
});

mongoose
  .connect("mongodb+srv://rohit:fdariruV6G6TZYXO@cluster0.p1zzkut.mongodb.net/")
  .then(() => console.log('✅ MongoDB connected'))
  .catch((err) => console.error('❌ MongoDB connection error:', err));


const userRoutes = require('./routes/user.routes');
app.use('/api/users', userRoutes);


const gameRoutes = require('./routes/game.routes');
app.use('/api/games', gameRoutes);

const venueRoutes = require("./routes/venue.routes");
app.use('/api/venues', venueRoutes);

const chatRoutes = require('./routes/chats.routes');
app.use('/api/chat', chatRoutes);

const Venue = require("./models/venue")
const Message = require('./models/message');
const Game = require('./models/Game');
const User = require('./models/User');

const venues = [
  {
    name: '147 One Four Seven Snooker, Billiards and Pool Sports Academy',
    rating: 4,
    deferLink: 'https://playo.page.link/ry8TT',
    fullLink:
      'https://playo.co/venue/?venueId=4ec5b58f-d58f-4ce1-8c84-2caa63007ecc',
    avgRating: 4,
    ratingCount: 3,
    lat: 12.9341796,
    lng: 77.6101537,
    icon: 'https://maps.google.com/mapfiles/kml/paddle/4-lv.png',
    filter_by: ['Pool', 'Snooker'],
    sportsAvailable: [
      {
        id: '10',
        name: 'Badminton',
        icon: 'badminton',
        price: 500,
        courts: [
          {
            id: '10',
            name: 'Standard synthetic court 1',
            number: 1,
          },
          {
            id: '11',
            name: 'Standard synthetic court 2',
            number: 2,
          },
          {
            id: '12',
            name: 'Standard synthetic court 3',
            number: 3,
          },
        ],
      },

      {
        id: '11',
        name: 'Cricket',
        icon: 'cricket',
        price: 1100,
        courts: [
          {
            id: '10',
            name: 'Full Pitch 1',
            number: 1,
          },
          {
            id: '11',
            name: 'Full Pitch 2',
            number: 2,
          },
        ],
      },
      {
        id: '12',
        name: 'Tennis',
        icon: 'tennis',
        price: 900,
        courts: [
          {
            id: '10',
            name: 'Court 1',
            number: 1,
          },
          {
            id: '11',
            name: 'Court 2',
            number: 2,
          },
        ],
      },
    ],
    image: "https://playo.gumlet.io/FIGURINEFITNESSINDIRANAGAR/SnookerRoom1652349575145.jpeg?mode=crop&crop=smart&h=200&width=450&q=75",
    location:
      'No. 27, Museum Rd, Shanthala Nagar, Ashok Nagar, Bengaluru, Karnataka',
    address: "AVS Compound, 1st Floor, 1st Cross",
    bookings: [],
  },
  {
    name: 'OvalNet Badminton Academy - Sahakar Nagar',
    rating: 4,

    avgRating: 4,
    ratingCount: 3,
    "lat": 13.059883,
    "lng": 77.582389,
    icon: 'https://maps.google.com/mapfiles/kml/paddle/4-lv.png',
    filter_by: ['Pool', 'Snooker'],
    sportsAvailable: [
      {
        id: '10',
        name: 'Badminton',
        icon: 'badminton',
        price: 500,
        courts: [
          {
            id: '10',
            name: 'Standard synthetic court 1',
            number: 1,
          },
          {
            id: '11',
            name: 'Standard synthetic court 2',
            number: 2,
          },
          {
            id: '12',
            name: 'Standard synthetic court 3',
            number: 3,
          },
        ],
      },

      {
        id: '11',
        name: 'Cricket',
        icon: 'cricket',
        price: 1100,
        courts: [
          {
            id: '10',
            name: 'Full Pitch 1',
            number: 1,
          },
          {
            id: '11',
            name: 'Full Pitch 2',
            number: 2,
          },
        ],
      },
      {
        id: '12',
        name: 'Tennis',
        icon: 'tennis',
        price: 900,
        courts: [
          {
            id: '10',
            name: 'Court 1',
            number: 1,
          },
          {
            id: '11',
            name: 'Court 2',
            number: 2,
          },
        ],
      },
    ],
    image: "https://playo.gumlet.io/OVALNETBADMINTONACADEMY/OvalNetBadmintonAcademy6.jpg?mode=crop&crop=smart&h=200&width=450&q=75",
    location:
      'No. 27, Museum Rd, Shanthala Nagar, Ashok Nagar, Bengaluru, Karnataka',
    address: "No. 3/1, Kodigehalli Main Road, Adjacent to Cauvery College",
    bookings: [],
  },
  {
    name: 'OvalNet Badminton Academy - Sahakar Nagar',
    rating: 4,

    avgRating: 4,
    ratingCount: 3,
    "lat": 13.059883,
    "lng": 77.582389,
    icon: 'https://maps.google.com/mapfiles/kml/paddle/4-lv.png',
    filter_by: ['Pool', 'Snooker'],
    sportsAvailable: [
      {
        id: '10',
        name: 'Badminton',
        icon: 'badminton',
        price: 500,
        courts: [
          {
            id: '10',
            name: 'Standard synthetic court 1',
            number: 1,
          },
          {
            id: '11',
            name: 'Standard synthetic court 2',
            number: 2,
          },
          {
            id: '12',
            name: 'Standard synthetic court 3',
            number: 3,
          },
        ],
      },

      {
        id: '11',
        name: 'Cricket',
        icon: 'cricket',
        price: 1100,
        courts: [
          {
            id: '10',
            name: 'Full Pitch 1',
            number: 1,
          },
          {
            id: '11',
            name: 'Full Pitch 2',
            number: 2,
          },
        ],
      },
      {
        id: '12',
        name: 'Tennis',
        icon: 'tennis',
        price: 900,
        courts: [
          {
            id: '10',
            name: 'Court 1',
            number: 1,
          },
          {
            id: '11',
            name: 'Court 2',
            number: 2,
          },
        ],
      },
    ],
    image: "https://playo.gumlet.io/OVALNETBADMINTONACADEMY/OvalNetBadmintonAcademy6.jpg?mode=crop&crop=smart&h=200&width=450&q=75",
    location:
      'No. 27, Museum Rd, Shanthala Nagar, Ashok Nagar, Bengaluru, Karnataka',
    address: "No. 3/1, Kodigehalli Main Road, Adjacent to Cauvery College",
    bookings: [],
  },
  {
    name: 'Play Zone - Sahakarnagar (Shree Vayu Badminton Arena)',
    rating: 4,

    avgRating: 4,
    ratingCount: 3,
    lat: 13.053750730700056,
    lng: 77.57626923775621,
    icon: 'https://maps.google.com/mapfiles/kml/paddle/4-lv.png',
    filter_by: ['Pool', 'Snooker'],
    sportsAvailable: [
      {
        id: '10',
        name: 'Badminton',
        icon: 'badminton',
        price: 500,
        courts: [
          {
            id: '10',
            name: 'Standard synthetic court 1',
            number: 1,
          },
          {
            id: '11',
            name: 'Standard synthetic court 2',
            number: 2,
          },
          {
            id: '12',
            name: 'Standard synthetic court 3',
            number: 3,
          },
        ],
      },

      {
        id: '11',
        name: 'Cricket',
        icon: 'cricket',
        price: 1100,
        courts: [
          {
            id: '10',
            name: 'Full Pitch 1',
            number: 1,
          },
          {
            id: '11',
            name: 'Full Pitch 2',
            number: 2,
          },
        ],
      },
      {
        id: '12',
        name: 'Tennis',
        icon: 'tennis',
        price: 900,
        courts: [
          {
            id: '10',
            name: 'Court 1',
            number: 1,
          },
          {
            id: '11',
            name: 'Court 2',
            number: 2,
          },
        ],
      },
    ],
    image: "https://playo.gumlet.io/PLAYZONESAHAKARNAGARSHREEVAYUBADMINTONARENA20231206074712995440/PlayZoneSahakarnagarShreeVayuBadmintonArena1701880566748.jpeg?mode=crop&crop=smart&h=200&width=450&q=75",
    location:
      'No. 27, Museum Rd, Shanthala Nagar, Ashok Nagar, Bengaluru, Karnataka',
    address: "Sahakar Nagar road, Adjacent to AMCO layout and Tata Nagar, Hebbal",
    bookings: [],
  },
  {
    name: 'VIN Badminton',
    rating: 4,

    avgRating: 4,
    ratingCount: 3,
    lat: 13.071497063988476,
    lng: 77.58706385591489,
    icon: 'https://maps.google.com/mapfiles/kml/paddle/4-lv.png',
    filter_by: ['Pool', 'Snooker'],
    sportsAvailable: [
      {
        id: '10',
        name: 'Badminton',
        icon: 'badminton',
        price: 500,
        courts: [
          {
            id: '10',
            name: 'Standard synthetic court 1',
            number: 1,
          },
          {
            id: '11',
            name: 'Standard synthetic court 2',
            number: 2,
          },
          {
            id: '12',
            name: 'Standard synthetic court 3',
            number: 3,
          },
        ],
      },

      {
        id: '11',
        name: 'Cricket',
        icon: 'cricket',
        price: 1100,
        courts: [
          {
            id: '10',
            name: 'Full Pitch 1',
            number: 1,
          },
          {
            id: '11',
            name: 'Full Pitch 2',
            number: 2,
          },
        ],
      },
      {
        id: '12',
        name: 'Tennis',
        icon: 'tennis',
        price: 900,
        courts: [
          {
            id: '10',
            name: 'Court 1',
            number: 1,
          },
          {
            id: '11',
            name: 'Court 2',
            number: 2,
          },
        ],
      },
    ],
    image: "https://playo.gumlet.io/VINI5BADMINTONARENA20240226042742110513/Vini5BadmintonArena1709376498394.jpg?mode=crop&crop=smart&h=200&width=450&q=75",
    location:
      'No. 27, Museum Rd, Shanthala Nagar, Ashok Nagar, Bengaluru, Karnataka',
    address: "Vini5 badminton arena, 5th main road, Canara bank layout",
    bookings: [],
  },
  {
    name: 'Serve & Smash Badminton Academy',
    rating: 4,

    avgRating: 4,
    ratingCount: 3,
    lat: 13.045735,
    lng: 77.572929,
    icon: 'https://maps.google.com/mapfiles/kml/paddle/4-lv.png',
    filter_by: ['Pool', 'Snooker'],
    sportsAvailable: [
      {
        id: '10',
        name: 'Badminton',
        icon: 'badminton',
        price: 500,
        courts: [
          {
            id: '10',
            name: 'Standard synthetic court 1',
            number: 1,
          },
          {
            id: '11',
            name: 'Standard synthetic court 2',
            number: 2,
          },
          {
            id: '12',
            name: 'Standard synthetic court 3',
            number: 3,
          },
        ],
      },

      {
        id: '11',
        name: 'Cricket',
        icon: 'cricket',
        price: 1100,
        courts: [
          {
            id: '10',
            name: 'Full Pitch 1',
            number: 1,
          },
          {
            id: '11',
            name: 'Full Pitch 2',
            number: 2,
          },
        ],
      },
      {
        id: '12',
        name: 'Tennis',
        icon: 'tennis',
        price: 900,
        courts: [
          {
            id: '10',
            name: 'Court 1',
            number: 1,
          },
          {
            id: '11',
            name: 'Court 2',
            number: 2,
          },
        ],
      },
    ],
    image: "https://playo.gumlet.io/SERVESMASH20191003055000886885/ServeSmash0.jpeg?mode=crop&crop=smart&h=200&width=450&q=75",
    location:
      'No. 27, Museum Rd, Shanthala Nagar, Ashok Nagar, Bengaluru, Karnataka',
    address: "1st Cross, RMV 2nd Stage, Nagashettihalli bangalore",
    bookings: [],
  },
  {
    name: 'Golden Fins Sports Club',
    rating: 3,

    avgRating: 5,
    ratingCount: 3,
    lat: 13.045735,
    lng: 77.572929,
    icon: 'https://maps.google.com/mapfiles/kml/paddle/4-lv.png',
    filter_by: ['Pool', 'Snooker'],
    sportsAvailable: [
      {
        id: '10',
        name: 'Badminton',
        icon: 'badminton',
        price: 500,
        courts: [
          {
            id: '10',
            name: 'Standard synthetic court 1',
            number: 1,
          },
          {
            id: '11',
            name: 'Standard synthetic court 2',
            number: 2,
          },
          {
            id: '12',
            name: 'Standard synthetic court 3',
            number: 3,
          },
        ],
      },

      {
        id: '11',
        name: 'Cricket',
        icon: 'cricket',
        price: 1100,
        courts: [
          {
            id: '10',
            name: 'Full Pitch 1',
            number: 1,
          },
          {
            id: '11',
            name: 'Full Pitch 2',
            number: 2,
          },
        ],
      },
      {
        id: '12',
        name: 'Tennis',
        icon: 'tennis',
        price: 900,
        courts: [
          {
            id: '10',
            name: 'Court 1',
            number: 1,
          },
          {
            id: '11',
            name: 'Court 2',
            number: 2,
          },
        ],
      },
    ],
    image: "https://playo.gumlet.io/GOLDENFINSSPORTSCLUBAMRUTAHALLI20241109004307679942/GoldenFinsSportsClubAmrutahalli1731130518011.jpeg?w=700&format=webp&q=30&overlay=https://playo-website.gumlet.io/playo-website-v2/logos-icons/playo-logo.png&overlay_width_pct=0.2&overlay_height_pct=1&overlay_position=bottomright",
    location:
      'No. 34, Hosur Rd, Shanthala Nagar, Ashok Nagar, Bengaluru, Karnataka',
    address: "opposite to sapthagiri party hall, water tank road, Tata Nagar, Shakarnagar,",
    bookings: [],
  },

];

async function addVenues() {
  try {
    for (const venueData of venues) {
      const existingVenue = await Venue.findOne({ name: venueData.name });
      if (existingVenue) {
        console.log(`Venue "${venueData.name}" already exists. Skipping.`);
      } else {
        const newVenue = new Venue(venueData);
        await newVenue.save();
        console.log(`Venue "${venueData.name}" added successfully.`);
      }
    }
  } catch (err) {
    console.error('Error adding venues:', err);
  }
}

addVenues();


app.get('/', (req, res) => {
  res.send('Playo Backend API is running...');
});




io.on('connection', (socket) => {
  console.log('New client connected:', socket.id);

  socket.on('joinRoom', async ({ userId, gameId }) => {
    if (gameId) {
      const game = await Game.findById(gameId);
      if (game && (game.admin === (await User.findOne({ clerkId: userId }))?._id || game.players.includes((await User.findOne({ clerkId: userId }))?._id))) {
        socket.join(gameId);
        console.log(`User ${userId} joined group chat for game ${gameId}`);
      }
    } else if (userId) {
      socket.join(`private_${userId}`);
      console.log(`User ${userId} joined private chat room`);
    }
  });

  socket.on('sendMessage', async ({ senderId, recipientId, gameId, content, isGroup }) => {
    const sender = await User.findOne({ clerkId: senderId });
    if (!sender) return;

    const newMessage = new Message({
      sender: sender._id,
      recipient: recipientId ? (await User.findOne({ clerkId: recipientId }))?._id : undefined,
      game: gameId ? (await Game.findById(gameId))?._id : undefined,
      content,
      isGroup: !!gameId,
    });
    await newMessage.save();

    const messageData = await Message.findById(newMessage._id).populate('sender', 'firstName lastName image');
    if (gameId) {
      io.to(gameId).emit('message', messageData);
    } else if (recipientId) {
      io.to(`private_${senderId}`).emit('message', messageData);
      io.to(`private_${recipientId}`).emit('message', messageData);
    }
  });

  socket.on('disconnect', () => {
    console.log('Client disconnected:', socket.id);
  });
});

// app.listen(PORT, () => console.log(`🚀 Server running on http://192.168.0.100:${PORT}`));
server.listen(PORT, () => console.log(`🚀 Server running on http://192.168.0.100:${PORT}`));