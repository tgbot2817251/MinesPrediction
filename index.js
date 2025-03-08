const TelegramBot = require("node-telegram-bot-api");

// 🔥 Bot Token (BotFather se liya hua)
const token = "7926331437:AAEYjgk2jQbJc3Fry9W6O_m62dFx5RS_bBg"; // Yaha apna bot token daalo
const bot = new TelegramBot(token, { polling: true });

// 🔥 Private ya Public Channels ke IDs
let channels = ["-1002212177790"]; // Apna channel ID daalo

// 🔥 Time Slots (Prediction Start & Stop Times)
const timeSlots = [
    { start: "08:30", end: "09:00" },
    { start: "10:30", end: "11:00" },
    { start: "12:30", end: "13:00" },
    { start: "14:30", end: "15:00" },
    { start: "16:30", end: "17:00" },
    { start: "18:30", end: "19:00" },
    { start: "20:30", end: "21:00" },
    { start: "13:20", end: "13:25" },
    { start: "22:30", end: "23:00" }
];

// 🔥 5x5 Grid Prediction Function
function generatePrediction() {
    let grid = Array(5).fill(null).map(() => Array(5).fill("🟦"));
    let starPositions = new Set();

    while (starPositions.size < 5) {
        let row = Math.floor(Math.random() * 5);
        let col = Math.floor(Math.random() * 5);
        starPositions.add(`${row},${col}`);
    }

    starPositions.forEach(pos => {
        let [row, col] = pos.split(',').map(Number);
        grid[row][col] = "⭐";
    });

    let gridText = grid.map(row => row.join("")).join("\n");

    return `ᴍɪɴᴇꜱ ᴘʀᴇᴅɪᴄᴛɪᴏɴ 💣⭐️\nɢᴀᴍᴇ ɴᴀᴍᴇ : 51 ɢᴀᴍᴇ\n\nᴍɪɴᴇꜱ ꜱᴇᴛ : 3💣\nꜱᴛᴀʀ ᴏᴘᴇɴ : 5⭐\n\n${gridText}\n\nɪꜰ ʏᴏᴜ ʟᴏꜱꜱ :\n              ᴛʀʏ ᴜᴘ ᴛᴏ 4 ᴛɪᴍᴇ`;
}

// 🔥 Check if current time is in any prediction time slot
function isPredictionTime() {
    const now = new Date();
    const currentTime = now.getHours().toString().padStart(2, "0") + ":" + now.getMinutes().toString().padStart(2, "0");
    return timeSlots.find(slot => slot.start <= currentTime && currentTime < slot.end);
}

// 🔥 Check if it's time to send the pre-start message (3 min before)
function isPreStartTime() {
    const now = new Date();
    const currentTime = now.getHours().toString().padStart(2, "0") + ":" + now.getMinutes().toString().padStart(2, "0");
    return timeSlots.find(slot => {
        let [hours, minutes] = slot.start.split(":").map(Number);
        let preStartMinutes = minutes - 3;
        if (preStartMinutes < 0) {
            hours -= 1;
            preStartMinutes += 60;
        }
        let preStartTime = hours.toString().padStart(2, "0") + ":" + preStartMinutes.toString().padStart(2, "0");
        return currentTime === preStartTime;
    });
}

// 🔥 Check if it's time to send the closing message
function isEndTime() {
    const now = new Date();
    const currentTime = now.getHours().toString().padStart(2, "0") + ":" + now.getMinutes().toString().padStart(2, "0");
    return timeSlots.find(slot => slot.end === currentTime);
}

// 🔥 Prediction Sending Interval
setInterval(() => {
    const predictionSlot = isPredictionTime();
    const preStartSlot = isPreStartTime();
    const endSlot = isEndTime();

    // 🔥 Agar 3 min pehle ka time hai to alert bhejna
    if (preStartSlot) {
        console.log("⚡ Sending Pre-Start Message...");
        channels.forEach(channel => {
            bot.copyMessage(channel, "@Only_4_photos", 10)
                .catch(error => console.log(`Error copying pre-start message to ${channel}:`, error.message));
        });
    }

    // 🔥 Agar prediction time hai to prediction bhejna
    if (predictionSlot) {
        console.log("🔥 Sending Mines Prediction...");
        let predictionMessage = generatePrediction();

        const options = {
            reply_markup: {
                inline_keyboard: [
                    [{ text: "🎮 51 ɢᴀᴍᴇ ʀᴇɢɪꜱᴛᴇʀ", url: "https://51game5.com/#/register?invitationCode=75516113971" }],
                    [{ text: "🤝ᴘʀᴇᴅɪᴄᴛɪᴏɴ ꜰᴏʟʟᴏᴡ ᴘʀᴏᴄᴇꜱꜱ", url: "https://t.me/Mines_Prediction/2796" }]
                ]
            }
        };

        // ✅ Sabhi channels me prediction send karega
        channels.forEach(channel => {
            bot.sendMessage(channel, predictionMessage, options)
                .then(() => {
                    // ⏳ 45 second ke baad extra message copy karega
                    setTimeout(() => {
                        bot.copyMessage(channel, "@Only_4_photos", 9)
                            .catch(error => console.log(`Error copying extra message to ${channel}:`, error.message));
                    }, 45000);
                })
                .catch(error => console.log(`Error sending prediction to ${channel}:`, error.message));
        });
    }

    // 🔥 Agar prediction ka end time hai to closing message bhejna
    if (endSlot) {
        console.log("🛑 Sending Closing Message...");
        channels.forEach(channel => {
            bot.copyMessage(channel, "@Only_4_photos", 11)
                .catch(error => console.log(`Error copying closing message to ${channel}:`, error.message));
        });
    }

}, 60000); // ⏳ Har 1 minute me check karega

console.log("🔥 Mines Prediction Bot is Running... 🚀");
