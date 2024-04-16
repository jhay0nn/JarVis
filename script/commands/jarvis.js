const axios = require('axios');
const fs = require('fs');

let chatEnabled = {};

if (fs.existsSync('./chatbotStatusjar.json')) {
    const rawData = fs.readFileSync('./chatbotStatusjar.json');
    chatEnabled = JSON.parse(rawData);
}

module.exports.config = {
    name: "jarvis",
    version: "1.0.0",
    hasPermssion: 0,
    credits: "Jonell Magallanes",
    description: "Chating With Harold Hutchins",
    usePrefix: false,
    commandCategory: "Chatbot",
    usages: "[on/off]",
    cooldowns: 3
};

function saveStatus() {
    fs.writeFileSync('./chatbotStatusjar.json', JSON.stringify(chatEnabled, null, 2));
}

module.exports.run = async function ({ api, event, args }) {
    const command = args[0];

    if (command === 'on') {
        chatEnabled[event.threadID] = true;
        saveStatus();
        return api.sendMessage("Jarvis is now ON", event.threadID, event.messageID);
    }

    if (command === 'off') {
        chatEnabled[event.threadID] = false;
        saveStatus();
        return api.sendMessage("Jarvis is now OFF", event.threadID, event.messageID);
    }

    if (!chatEnabled[event.threadID]) return;

    const content = encodeURIComponent(args.join(" "));
    const id = event.senderID;

    if (!content) return api.sendMessage("YEAHhh Gar I'm JarVis Chatbot made by JhaY ON", event.threadID, event.messageID);
    api.setMessageReaction("💭", event.messageID, () => { }, true);

    try {
        const apiUrl = `https://jarvis-ai-cdlh.onrender.com/jar?ask=${content}&id=${id}`;
        const response = await axios.get(apiUrl);
        const { response: reply } = response.data;
        api.setMessageReaction("💚", event.messageID, () => { }, true);
        api.sendMessage(reply, event.threadID, event.messageID);
    } catch (error) {
        console.error(error);
        api.sendMessage("Nagkaroon ng Error Sa Main Server ng API Please Try Again Later or Contact the Developer JhaY ON", event.threadID);
        api.setMessageReaction("😭", event.messageID, () => { }, true);
    }
};
