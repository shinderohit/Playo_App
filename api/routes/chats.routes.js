const express = require('express');
const router = express.Router();
const Message = require('../models/message');
const Game = require('../models/Game');
const User = require('../models/User');
const moment = require('moment');

router.post('/send', async (req, res) => {
  try {
    const { senderId, recipientId, gameId, content, isGroup } = req.body;

    if (!senderId || !content || (!recipientId && !gameId)) {
      return res.status(400).json({ message: 'Sender ID, content, and recipient ID or game ID are required' });
    }

    const sender = await User.findOne({ clerkId: senderId });
    if (!sender) return res.status(404).json({ message: 'Sender not found' });

    const newMessage = new Message({
      sender: sender._id,
      recipient: recipientId ? (await User.findOne({ clerkId: recipientId }))?._id : undefined,
      game: gameId ? (await Game.findById(gameId))?._id : undefined,
      content,
      isGroup: !!gameId,
    });

    await newMessage.save();
    res.status(200).json({ message: 'Message sent', messageId: newMessage._id });
  } catch (err) {
    console.error('Error sending message:', err);
    res.status(500).json({ message: 'Failed to send message', error: err.message });
  }
});

router.get('/messages', async (req, res) => {
  try {
    const { userId, recipientId, gameId } = req.query;

    if (!userId || (!recipientId && !gameId)) {
      return res.status(400).json({ message: 'User ID and recipient ID or game ID are required' });
    }

    const user = await User.findOne({ clerkId: userId });
    if (!user) return res.status(404).json({ message: 'User not found' });

    let messages;
    if (gameId) {
      messages = await Message.find({ game: gameId, isGroup: true })
        .populate('sender', 'firstName lastName image')
        .sort('timestamp');
    } else {
      const recipient = await User.findOne({ clerkId: recipientId });
      messages = await Message.find({
        $or: [
          { sender: user._id, recipient: recipient?._id },
          { sender: recipient?._id, recipient: user._id },
        ],
      }).populate('sender', 'firstName lastName image').sort('timestamp');
    }

    res.status(200).json(messages || []);
  } catch (err) {
    console.error('Error fetching messages:', err);
    res.status(500).json({ message: 'Failed to fetch messages', error: err.message });
  }
});

router.get('/chats', async (req, res) => {
  try {
    const { userId } = req.query;
    if (!userId) return res.status(400).json({ message: 'User ID is required' });

    const user = await User.findOne({ clerkId: userId }).populate('playpals', 'clerkId firstName lastName image');
    if (!user) return res.status(404).json({ message: 'User not found' });

    console.log('User found:', user._id, 'with playpals:', user.playpals.length);

    const playpalPromises = user.playpals.map(async (playpal) => {
      const lastMessageDoc = await Message.findOne({
        $or: [
          { sender: user._id, recipient: playpal._id },
          { sender: playpal._id, recipient: user._id },
        ],
      }).sort('-timestamp');
      return {
        type: 'private',
        userId: playpal.clerkId,
        name: `${playpal.firstName} ${playpal.lastName || ''}`.trim(),
        lastMessage: lastMessageDoc?.content || 'No messages yet',
        timestamp: lastMessageDoc?.timestamp || new Date(),
      };
    });
    const playpals = await Promise.all(playpalPromises);

    
    const currentDateTime = moment().toDate();
    console.log('Current date and time:', currentDateTime);
    const games = await Game.find({
      $or: [{ admin: userId }, { players: userId }],
    }).populate('players', 'clerkId firstName lastName image');
    console.log('All games found:', games.length);

    const groupChatPromises = games.map(async (game) => {
      const gameDateTime = moment(`${game.date} ${game.time}`, 'YYYY-MM-DD HH:mm').toDate();
      console.log(`Game ${game._id}: DateTime = ${gameDateTime}, Is Upcoming = ${gameDateTime >= currentDateTime}`);
      if (gameDateTime >= currentDateTime) {
        const adminUser = await User.findOne({ clerkId: game.admin });
        const adminName = adminUser ? `${adminUser.firstName} ${adminUser.lastName || ''}`.trim() : 'Unknown Admin';
        const lastMessageDoc = await Message.findOne({ game: game._id, isGroup: true }).sort('-timestamp');
        return {
          type: 'group',
          gameId: game._id,
          name: `${game.sport} Group Chat`,
          admin: adminName,
          area: game.area,
          date: game.date,
          time: game.time,
          totalPlayers: game.totalPlayers,
          activityAccess: game.activityAccess,
          courtNumber: game.courtNumber,
          lastMessage: lastMessageDoc?.content || 'No messages yet',
          timestamp: lastMessageDoc?.timestamp || game.updatedAt,
        };
      }
      return null;
    });
    const groupChatResults = await Promise.all(groupChatPromises);
    const groupChats = groupChatResults.filter(chat => chat !== null);

    const formattedChats = [
      ...playpals,
      ...groupChats,
    ];

    if (formattedChats.length === 0) {
      console.log('No chats or playpals found for user:', userId);
      return res.status(200).json({ message: 'No chats or playpals available', chats: [] });
    }
    console.log('Returning chats:', formattedChats);
    res.status(200).json(formattedChats);
  } catch (err) {
    console.error('Error fetching chats:', err);
    res.status(500).json({ message: 'Failed to fetch chats', error: err.message });
  }
});

module.exports = router;
