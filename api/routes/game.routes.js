const express = require("express");
const router = express.Router();
const Game = require("../models/Game");
const User = require("../models/User");
const moment = require("moment");
const Venue = require("../models/venue");


router.post("/create", async (req, res) => {
  try {
    const {
      sport,
      area,
      date,
      time,
      admin,
      totalPlayers,
      activityAccess = "public",
    } = req.body;

    const newGame = new Game({
      sport,
      area,
      date,
      time,
      admin,
      totalPlayers,
      activityAccess,
      players: [admin],
    });

    const savedGame = await newGame.save();
    res.status(200).json(savedGame);
  } catch (err) {
    console.error("Error creating game:", err);
    res.status(500).json({ message: "Failed to create game" });
  }
});


router.get("/upcoming", async (req, res) => {
  try {
    const userId = req.query.userId;
    console.log("Requested userId:", userId);
    if (!userId) {
      return res.status(400).json({ message: "User ID is required" });
    }


    const games = await Game.find({
      $or: [
        { admin: userId },
        { players: userId },
        { requests: { $elemMatch: { userId, status: "pending" } } },
      ],
    });

    console.log("Raw games by userId:", games);

    const currentDateTime = moment();
    const formattedGames = await Promise.all(
      games.map(async (game) => {
        const adminUser = await User.findOne({ clerkId: game.admin });
        if (!adminUser) {
          console.warn(
            `Admin user with clerkId ${game.admin} not found, skipping game ${game._id}`
          );
          return null;
        }

        const playerUsers = await User.find({ clerkId: { $in: game.players } });
        const playerMap = playerUsers.reduce((map, user) => {
          map[user.clerkId] = user;
          return map;
        }, {});

        const [startTime, endTime] = game.time.split(" - ");
        const gameDate = moment(game.date, "Do MMMM", true);
        if (!gameDate.isValid()) {
          console.warn(
            `Invalid date format for game ${game._id}: ${game.date}`
          );
          return null;
        }
        const gameEndTime = moment(
          `${gameDate.format("YYYY-MM-DD")} ${endTime}`,
          "YYYY-MM-DD h:mm A"
        );

        if (gameEndTime.isAfter(currentDateTime)) {
          const userRequest = game.requests.find(
            (req) => req.userId === userId
          );
          return {
            _id: game._id,
            sport: game.sport,
            date: game.date,
            time: game.time,
            area: game.area,
            players: game.players
              .map((playerId) => {
                const player = playerMap[playerId];
                return player
                  ? {
                    _id: player.clerkId,
                    imageUrl: player.image || "https://i.pravatar.cc/100",
                    name: `${player.firstName} ${player.lastName || ""
                      }`.trim(),
                  }
                  : null;
              })
              .filter((player) => player !== null),
            totalPlayers: game.totalPlayers,
            queries: game.queries || [],
            requests: game.requests || [],
            isBooked: game.isBooked || false,
            courtNumber: game.courtNumber || null,
            adminName: `${adminUser.firstName} ${adminUser.lastName || ""
              }`.trim(),
            adminUrl: adminUser.image || "https://i.pravatar.cc/100",
            isUserAdmin: game.admin === userId,
            matchFull: game.matchFull || false,
            activityAccess: game.activityAccess,
            isInProgress:
              moment(
                `${gameDate.format("YYYY-MM-DD")} ${startTime}`,
                "YYYY-MM-DD h:mm A"
              ).isBefore(currentDateTime) &&
              gameEndTime.isAfter(currentDateTime),
            userRequestStatus: userRequest ? userRequest.status : null,
          };
        }
        return null;
      })
    );

    const validGames = formattedGames
      .filter((game) => game !== null)
      .sort((a, b) => {
        const aStart = moment(
          `${moment(a.date, "Do MMMM", true).format("YYYY-MM-DD")} ${a.time.split(" - ")[0]
          }`,
          "YYYY-MM-DD h:mm A"
        );
        const bStart = moment(
          `${moment(b.date, "Do MMMM", true).format("YYYY-MM-DD")} ${b.time.split(" - ")[0]
          }`,
          "YYYY-MM-DD h:mm A"
        );
        return aStart.isBefore(bStart) ? -1 : 1;
      });

    res.status(200).json(validGames);
  } catch (err) {
    console.error("Error fetching games:", err);
    res
      .status(500)
      .json({ message: "Failed to fetch upcoming games", error: err.message });
  }
});

router.get("/games", async (req, res) => {
  try {
    const games = await Game.find({});
    const currentDateTime = moment();

    const filteredGames = games.filter((game) => {
      const gameDate = moment(game.date, "Do MMMM", true);
      if (!gameDate.isValid()) {
        console.warn(`Invalid date format for game ${game._id}: ${game.date}`);
        return false;
      }
      const [startTime, endTime] = game.time.split(" - ");
      const gameStartTime = moment(
        `${gameDate.format("YYYY-MM-DD")} ${startTime}`,
        "YYYY-MM-DD h:mm A"
      );
      const gameEndTime = moment(
        `${gameDate.format("YYYY-MM-DD")} ${endTime}`,
        "YYYY-MM-DD h:mm A"
      );
      return (
        gameEndTime.isAfter(currentDateTime) ||
        (gameStartTime.isBefore(currentDateTime) &&
          gameEndTime.isAfter(currentDateTime))
      );
    });

    const formattedGames = await Promise.all(
      filteredGames.map(async (game) => {
        const adminUser = await User.findOne({ clerkId: game.admin });
        if (!adminUser) {
          console.warn(
            `Admin user with clerkId ${game.admin} not found, skipping game ${game._id}`
          );
          return null;
        }

        const playerUsers = await User.find({ clerkId: { $in: game.players } });
        const playerMap = playerUsers.reduce((map, user) => {
          map[user.clerkId] = user;
          return map;
        }, {});

        return {
          _id: game._id,
          sport: game.sport,
          date: game.date,
          time: game.time,
          area: game.area,
          players: game.players
            .map((playerId) => {
              const player = playerMap[playerId];
              return player
                ? {
                  _id: player.clerkId,
                  imageUrl: player.image || "https://i.pravatar.cc/100",
                  name: `${player.firstName} ${player.lastName || ""}`.trim(),
                }
                : null;
            })
            .filter((player) => player !== null),
          totalPlayers: game.totalPlayers,
          queries: game.queries || [],
          requests: game.requests || [],
          isBooked: game.isBooked || false,
          courtNumber: game.courtNumber || null,
          adminName: `${adminUser.firstName} ${adminUser.lastName || ""
            }`.trim(),
          adminUrl: adminUser.image || "https://i.pravatar.cc/100",
          matchFull: game.matchFull || false,
          activityAccess: game.activityAccess,
          createdAt: game.createdAt,
        };
      })
    );

    const validGames = formattedGames
      .filter((game) => game !== null)
      .sort((a, b) => b.createdAt - a.createdAt);
    res.status(200).json(validGames);
  } catch (err) {
    console.error("Error fetching games:", err);
    res
      .status(500)
      .json({ message: "Failed to fetch games", error: err.message });
  }
});

router.get("/game/:gameId/players", async (req, res) => {
  try {
    const { gameId } = req.params;
    console.log("Fetching players for gameId:", gameId);
    const game = await Game.findById(gameId);
    console.log("Found game:", JSON.stringify(game, null, 2));
    if (!game) {
      console.log("Game not found for ID:", gameId);
      return res.status(404).json({ message: "Game not found" });
    }

    const playerUsers = await User.find({ clerkId: { $in: game.players } });
    console.log("Found players:", JSON.stringify(playerUsers, null, 2));
    const players = playerUsers.map((user) => ({
      _id: user.clerkId,
      imageUrl: user.image || "https://i.pravatar.cc/100",
      name: `${user.firstName} ${user.lastName || ""}`.trim(),
    }));

    res.status(200).json(players);
  } catch (err) {
    console.error("Error fetching players:", err);
    res
      .status(500)
      .json({ message: "Failed to fetch players", error: err.message });
  }
});


router.post("/:gameId/request", async (req, res) => {
  try {
    const { gameId } = req.params;
    const { userId, comment } = req.body;

    console.log("user", userId);

    if (!userId || !comment) {
      return res
        .status(400)
        .json({ message: "userId and comment are required" });
    }

    const game = await Game.findById(gameId);
    if (!game) {
      return res.status(404).json({ message: "Game not found" });
    }

    const user = await User.findOne({ clerkId: userId });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    if (game.players.includes(userId)) {
      return res.status(400).json({ message: "User already in game" });
    }

    if (game.requests.some((req) => req.userId === userId)) {
      return res.status(400).json({ message: "Request already sent" });
    }

    game.requests.push({ userId, comment, status: "pending" });
    await game.save();

    res.status(200).json({ message: "Request sent successfully" });
  } catch (err) {
    console.error("Error sending join request:", err);
    res
      .status(500)
      .json({ message: "Failed to send request", error: err.message });
  }
});

router.post("/:gameId/cancel-request", async (req, res) => {
  try {
    const { gameId } = req.params;
    const { userId } = req.body;

    if (!userId) {
      return res.status(400).json({ message: "userId is required" });
    }

    const game = await Game.findById(gameId);
    if (!game) {
      return res.status(404).json({ message: "Game not found" });
    }

    const requestIndex = game.requests.findIndex(
      (req) => req.userId === userId
    );
    if (requestIndex === -1) {
      return res
        .status(400)
        .json({ message: "No request found for this user" });
    }

    game.requests.splice(requestIndex, 1);
    await game.save();

    res.status(200).json({ message: "Request cancelled successfully" });
  } catch (err) {
    console.error("Error cancelling join request:", err);
    res
      .status(500)
      .json({ message: "Failed to cancel request", error: err.message });
  }
});


router.post("/accept", async (req, res) => {
  try {
    const { gameId, userId, adminId } = req.body;
    if (!gameId || !userId || !adminId) {
      return res
        .status(400)
        .json({ message: "gameId, userId, and adminId are required" });
    }

    const game = await Game.findById(gameId);
    if (!game) {
      return res.status(404).json({ message: "Game not found" });
    }

    if (game.admin !== adminId) {
      return res
        .status(403)
        .json({ message: "Only the game admin can accept requests" });
    }

    const requestIndex = game.requests.findIndex(
      (req) => req.userId === userId
    );
    if (requestIndex === -1) {
      return res
        .status(400)
        .json({ message: "No request found for this user" });
    }

    game.requests.splice(requestIndex, 1);
    if (!game.players.includes(userId)) {
      game.players.push(userId);
    }
    await game.save();

    res.status(200).json({ message: "Request accepted successfully" });
  } catch (err) {
    console.error("Error accepting request:", err);
    res
      .status(500)
      .json({ message: "Failed to accept request", error: err.message });
  }
});


router.post("/:gameId/queries", async (req, res) => {
  try {
    const { gameId } = req.params;
    const { userId, query } = req.body;

    if (!userId || !query) {
      return res.status(400).json({ message: "userId and query are required" });
    }

    const game = await Game.findById(gameId);
    if (!game) {
      return res.status(404).json({ message: "Game not found" });
    }

    const user = await User.findOne({ clerkId: userId });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    game.queries.push({ userId, query, timestamp: new Date() });
    await game.save();

    res.status(200).json({ message: "Query sent successfully" });
  } catch (err) {
    console.error("Error sending query:", err);
    res
      .status(500)
      .json({ message: "Failed to send query", error: err.message });
  }
});

router.get("/:gameId/requests", async (req, res) => {
  try {
    const { gameId } = req.params;
    const game = await Game.findById(gameId);
    if (!game) {
      return res.status(404).json({ message: "Game not found" });
    }

    const requests = await Promise.all(
      game.requests.map(async (req) => {
        const user = await User.findOne({ clerkId: req.userId });
        return {
          userId: req.userId,
          comment: req.comment,
          status: req.status,
          name: user
            ? `${user.firstName} ${user.lastName || ""}`.trim()
            : "Unknown",
          imageUrl: user?.image || "https://i.pravatar.cc/100",
        };
      })
    );

    res.status(200).json(requests);
  } catch (err) {
    console.error("Error fetching requests:", err);
    res
      .status(500)
      .json({ message: "Failed to fetch requests", error: err.message });
  }
});

router.post("/toggle-match-full", async (req, res) => {
  try {
    const { gameId, adminId } = req.body;
    if (!gameId || !adminId) {
      return res
        .status(400)
        .json({ message: "gameId and adminId are required" });
    }

    const game = await Game.findById(gameId);
    if (!game) {
      return res.status(404).json({ message: "Game not found" });
    }

    if (game.admin !== adminId) {
      return res
        .status(403)
        .json({ message: "Only the game admin can toggle match full status" });
    }

    game.matchFull = !game.matchFull;
    await game.save();

    res
      .status(200)
      .json({
        message: "Match full status updated",
        matchFull: game.matchFull,
      });
  } catch (err) {
    console.error("Error toggling match full status:", err);
    res
      .status(500)
      .json({
        message: "Failed to toggle match full status",
        error: err.message,
      });
  }
});

router.post("/:gameId/cancel-request", async (req, res) => {
  try {
    const { gameId } = req.params;
    const { userId } = req.body;

    if (!userId) {
      return res.status(400).json({ message: "userId is required" });
    }

    const game = await Game.findById(gameId);
    if (!game) {
      return res.status(404).json({ message: "Game not found" });
    }

    const requestIndex = game.requests.findIndex(
      (req) => req.userId === userId
    );
    if (requestIndex === -1) {
      return res
        .status(400)
        .json({ message: "No request found for this user" });
    }

    game.requests.splice(requestIndex, 1);
    await game.save();

    res.status(200).json({ message: "Request cancelled successfully" });
  } catch (err) {
    console.error("Error cancelling join request:", err);
    res
      .status(500)
      .json({ message: "Failed to cancel request", error: err.message });
  }
});

router.post("/:gameId/book", async (req, res) => {
  try {
    const { gameId } = req.params;
    const { userId, venueName, courtNumber, date, time, sport } = req.body;

    if (!userId || !venueName || !courtNumber || !date || !time || !sport) {
      return res
        .status(400)
        .json({
          message:
            "userId, venueName, courtNumber, date, time, and sport are required",
        });
    }

    const game = await Game.findById(gameId);
    if (!game) {
      return res.status(404).json({ message: "Game not found" });
    }

    if (game.admin !== userId) {
      return res
        .status(403)
        .json({ message: "Only the game admin can book slots" });
    }

    if (game.isBooked) {
      return res.status(400).json({ message: "Game slot already booked" });
    }

    const venue = await Venue.findOne({ name: venueName });
    if (!venue) {
      return res.status(404).json({ message: "Venue not found" });
    }

    const user = await User.findOne({ clerkId: userId });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const sportData = venue.sportsAvailable.find(
      (s) =>
        s.name === sport &&
        s.courts.some((c) => c.number.toString() === courtNumber)
    );
    if (!sportData) {
      return res
        .status(400)
        .json({ message: "Court not found for the selected sport" });
    }

    const court = sportData.courts.find(
      (c) => c.number.toString() === courtNumber
    );
    if (!court) {
      return res.status(400).json({ message: "Court not found" });
    }

    const conflictingBooking = venue.bookings.find(
      (booking) =>
        booking.date === date &&
        booking.time === time &&
        booking.courtNumber === courtNumber &&
        booking.sport === sport
    );

    if (conflictingBooking) {
      return res
        .status(400)
        .json({ message: "Slot already booked for this sport" });
    }

    venue.bookings = venue.bookings.map((booking) => ({
      ...booking,
      sport: booking.sport || sport,
    }));

    venue.bookings.push({
      courtNumber,
      date,
      time,
      sport,
      user: user._id,
      game: gameId,
    });
    await venue.save();

    game.isBooked = true;
    game.courtNumber = courtNumber;
    await game.save();

    res
      .status(200)
      .json({
        message: "Slot booked successfully",
        courtNumber,
        price: sportData.price,
      });
  } catch (err) {
    console.error("Error booking slot:", err);
    res
      .status(500)
      .json({ message: "Failed to book slot", error: err.message });
  }
});

module.exports = router;
