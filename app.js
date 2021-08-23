const {Servers, Users} = require('./dbObjects');
const { google } = require('googleapis');
const discord = require('discord.js');
const credentials = require('./config/credentials.json')


const spreadsheetId = credentials.spreadsheetId;

//real server
const client = new discord.Client();
const categoryParentId =  '704421055258820738'; //'676283874455715840';
const guildId = '662776314515685385'; //'675894360612536340';


const MAX_MESSAGE_LENGTH = 1500;

const getGoogleAuth = async () => {
  const auth = new google.auth.GoogleAuth({
    keyFile: credentials.googleApiKeyFile,
    scopes: 'https://www.googleapis.com/auth/spreadsheets.readonly'
  });

  return auth;
}


const getGoogleSheet = async (auth) => {
  const authClient = auth.getClient();
  const googleSheet = google.sheets({ version: 'v4', auth: authClient });

  return googleSheet;
}

const getNewApplicants = async (columnCount, databaseCount) => {

  const rowStart = databaseCount + 1;
  const columnEnd = String.fromCharCode(columnCount + 64);
  const ranges = [`Sheet1!A1:${columnEnd}1`, `Sheet1!A${rowStart}:${columnEnd}`];
  
  const auth = await getGoogleAuth();
  const googleSheet = await getGoogleSheet(auth);
  const getSheetValues = await googleSheet.spreadsheets.values.batchGet({
    auth,
    spreadsheetId,
    ranges
  });
  const [{values: [questions] }, {values: respondants}]  = getSheetValues.data.valueRanges;

  return {questions, respondants}
}

const batchMessages = (applications) => {       
  const batch = {};
  applications.respondants.forEach( (responses, i) => {
    const messageQueue = [''];
    responses.forEach( (response, j) => {
        const message = `**${applications.questions[j]}** \n\`\`\`${response}\`\`\` 󠀀󠀀\n`;
        
        const lastQueueIndex = (messageQueue.length - 1) || 0;
        if ( (messageQueue[lastQueueIndex].length + message.length) > MAX_MESSAGE_LENGTH ) {
          messageQueue[messageQueue.length] = message;
        } else {
          messageQueue[lastQueueIndex] = (messageQueue[lastQueueIndex]||'') + message;
        }
    })

    const playerName = applications.respondants[i][1];
    const playerClass = applications.respondants[i][5];
    const playerServer = applications.respondants[i][3];
    batch[`${playerName}-${playerClass}-${playerServer}`] = messageQueue;
  })
  return batch
}

const sendMessageBatch = async (keyedMessageBatch) => {
  const guild = await client.guilds.cache.get(guildId);
  const sentMessages = []
  for(const channelName in keyedMessageBatch) {
    console.log('Creating channel: ' + channelName);
    const channel = await guild.channels.create(channelName, {parent: categoryParentId});

    for (const batch of keyedMessageBatch[channelName]) {
      const sent = await channel.send(batch);
      sentMessages.push(sent);
    }
  }
  return sentMessages
}

const suppressEmbeds = async (messages) => {

    for(const message of messages){
      await message.suppressEmbeds(true);
    }
}

const Main = async () => {

  const auth = await getGoogleAuth();
  const googleSheet = await getGoogleSheet(auth);
  const getSheetProperties = await googleSheet.spreadsheets.get({
    auth,
    spreadsheetId,
  });
  
  const { rowCount, columnCount } = getSheetProperties.data.sheets[0].properties.gridProperties;
  const databaseCount = await Servers.getRowCount(guildId);

  if ( rowCount > databaseCount) {
    
    const newApplications = await getNewApplicants(columnCount, databaseCount);
    const keyedMessageBatch = batchMessages(newApplications);
    const sentMessages = await sendMessageBatch(keyedMessageBatch);

    await suppressEmbeds(sentMessages);

    await Servers.updateRowCount(guildId, rowCount);
  }
}
  
client.once('ready', () => {
	console.log('sync');
	Users.sync();
  Main()
	setInterval(Main, 1200000);
});

console.log('Running...')
client.login(credentials.discordToken);