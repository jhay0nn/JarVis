const axios = require('axios');
const fs = require('fs');

let chatEnabled = {};

if (fs.existsSync('./chatbotStatus.json')) {
    const rawData = fs.readFileSync('./chatbotStatus.json');
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
    fs.writeFileSync('./chatbotStatus.json', JSON.stringify(chatEnabled, null, 2));
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
        const response = await axios.get(`https://jarvis-ai-cdlh.onrender.com/jar?ask=${content}&id=${id}`);
        const { response: reply } = response.data;  
        api.setMessageReaction("🧡", event.messageID, () => { }, true);
        api.sendMessage(reply, event.threadID, event.messageID);
    } catch (error) {
        console.error(error);
        api.sendMessage("Teka Gar my brain is not braining, kailangan ko ng mwa2 from Denise. shhh wag mo sabihin kay Jhay Baka i-shutdown ako", event.threadID);
        api.setMessageReaction("😭", event.messageID, () => { }, true);
    }
};

module.exports.handleEvent = async function ({ api, event }) {
    if (!chatEnabled[event.threadID] || !event.body || !event.isGroup) return;

    const content = encodeURIComponent(event.body);
    const id = event.senderID;  

    api.setMessageReaction("💭", event.messageID, () => { }, true);

    try {
        const response = await axios.get(`https://jarvis-ai-cdlh.onrender.com/jar?ask=${content}&id=${id}`);
        const { response: reply } = response.data;  
        api.setMessageReaction("🧡", event.messageID, () => { }, true);
        api.sendMessage(reply, event.threadID, event.messageID);
    } catch (error) {
        console.error(error);
        api.sendMessage("Nagkaroon ng Error Sa Main Server ng API Please Try Again Later or Contact the Developer Jhay On Thanks", event.threadID);
        api.setMessageReaction("😭", event.messageID, () => { }, true);
    }
};
