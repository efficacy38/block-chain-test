// enums
const START_MENU_ITEMS = Object.freeze({ START: 'start game', QUIT: 'quit' })
const OPERATIONS = Object.freeze({ STAND: 'STAND', HIT: 'HIT', DOUBLE_DOWN: 'DOUBLE' })
const GAME_STATUS = Object.freeze({ WIN: "win", LOSE: "lose", UNDETERMINED: "undeterminted" })

// settings
const SETTLE_TIME = 2000;

// global variables
let menuGameStart, settings, roundStatus;
let cnt = 0;

const sleep = (ms = 200) => new Promise((r) => setTimeout(r, ms));

async function checkNewOrNextGame() {
  start()
}

async function setupConfigs() {
  if (!!settings)
    return;

  settings = await inquirer.prompt([
    {
      type: 'list',
      name: 'provider',
      message: `Which provider you want's to use?`,
      choices: ["metamask"],
      default: "metamask"
    }
  ])
}

function getCard(card) {
  const suitRepr = { 'C': '♣', 'S': '♠', 'D': '♦', 'H': '♥' }
  const valueRepr = { 1: "A", 11: "J", 12: "Q", 13: "K" }
  if (card.isHidden) {
    return chalk.bgCyanBright("**")
  }
  if (card.suit === 'C' || card.suit === 'S') {
    return chalk.bgBlackBright(suitRepr[card.suit] + (valueRepr.hasOwnProperty(card.value) ? valueRepr[card.value] : card.value))
  } else {
    return chalk.bgRedBright(suitRepr[card.suit] + (valueRepr.hasOwnProperty(card.value) ? valueRepr[card.value] : card.value))
  }
}

// web3 section
async function startNewGame() {
  cnt = 0;
  roundStatus = GAME_STATUS.UNDETERMINED;
  await sleep()
  return;
}

async function getRoundStatus() {

  if (cnt === 0) return GAME_STATUS.UNDETERMINED;
  const randN = Math.ceil(Math.random() * 3) - 1;
  return Object.values(GAME_STATUS)[randN];

}

async function getPlayerCards() {
  await sleep()
  return [
    { "suit": "S", value: 2, isHidden: false },
    { "suit": "D", value: 2, isHidden: false },
  ]
}

async function getDealerCards() {
  await sleep()
  return [
    { "suit": "C", value: 3, isHidden: true },
    { "suit": "H", value: 3, isHidden: false },
  ]
}

async function start() {
  return;
}


async function UpdateScreenAfterEvent(title = 'Updating the Game...') {
  const spinner = createSpinner(title).start();
  let roundStatus = await getRoundStatus()
  let [dealerCards, playerCards] = await Promise.all([getDealerCards(), getPlayerCards()])
  spinner.stop()
  console.log('Current Game Status: ')
  console.log('Dealer Card:\t', ...dealerCards.map(card => getCard(card)))
  console.log('Your Card:\t', ...playerCards.map(card => getCard(card)))
  console.log('\n----------------------------------')
  return roundStatus
}

async function play() {
  // wait for event and get new card info
  roundStatus = await getRoundStatus();
  if (roundStatus !== GAME_STATUS.UNDETERMINED) {
    startNewGame()
    console.clear()
    roundStatus = await getRoundStatus();
  }
  console.log(cnt, roundStatus)

  // game loop
  while (roundStatus === GAME_STATUS.UNDETERMINED) {
    roundStatus = await UpdateScreenAfterEvent()
    let operation = await inquirer.prompt([
      {
        type: 'list',
        name: 'choice',
        message: `Which operation you want's to do?\n`,
        choices: Object.values(OPERATIONS),
        default: OPERATIONS.HIT
      }
    ]).then(operation => {
      switch (operation) {
        case OPERATIONS.HIT:
          break;
        case OPERATIONS.STAND:
          break;
        case OPERATIONS.DOUBLE_DOWN:
          break;
      }
    })
    cnt++
    roundStatus = await getRoundStatus();
  }

  return roundStatus
}

// setup game config the game
menuGameStart = await checkNewOrNextGame()
await setupConfigs()

while (menuGameStart) {
  // play game
  await play()

  // refreash game screen after lose or win
  await UpdateScreenAfterEvent(`Update the final resault(${roundStatus})!!`)

  if (roundStatus === GAME_STATUS.WIN) {
    winner()
  } else {
    loser()
  }
  await sleep(SETTLE_TIME)
  menuGameStart = await checkNewOrNextGame()
}

function winner() {
  // console.clear();
  const rainbow = chalkAnimation.karaoke('YOU WIN THIS GAME'); // Animation starts

  setTimeout(() => {
    rainbow.stop(); // Animation stops
  }, SETTLE_TIME);

}

function loser() {
  // console.clear();
  const rainbow = chalkAnimation.karaoke('YOU LOSE THIS GAME'); // Animation starts

  setTimeout(() => {
    rainbow.stop(); // Animation stops
  }, SETTLE_TIME);
}
