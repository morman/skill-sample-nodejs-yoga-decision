/**
 * This sample demonstrates a simple skill built with the Amazon Alexa Skills Kit.
 * The Intent Schema, Custom Slots, and Sample Utterances for this skill, as well as
 * testing instructions are located at http://amzn.to/1LzFrj6
 *
 * For additional samples, visit the Alexa Skills Kit Getting Started guide at
 * http://amzn.to/1LGWsLG
 */

var Alexa = require('alexa-sdk');

var states = {
    STARTMODE: '_STARTMODE',                // Prompt the user to start or restart the game.
    ASKMODE: '_ASKMODE',                    // Alexa is asking user the questions.
    DESCRIPTIONMODE: '_DESCRIPTIONMODE'     // Alexa is describing the final choice and prompting to start again or quit
};


// Questions
var nodes = [{ "node": 1, "message": "Want to move fast", "yes": 2, "no": 5 },
// Questions: fast
             { "node": 2, "message": "Are you a beginner", "yes": 31, "no": 3 },
             { "node": 3, "message": "Do you like routines", "yes": 32, "no": 4 },
             { "node": 4, "message": "Interested in philosophy", "yes": 33, "no": 34 },
// Questions: sweat
             { "node": 5, "message": "Love to sweat", "yes": 6, "no": 7 },
             { "node": 6, "message": "Do you like routines", "yes": 41, "no": 42 },
// Questions: athletic
             { "node": 7, "message": "Looking for an athletic yoga", "yes": 8, "no": 10 },
             { "node": 8, "message": "Want encouragement throughout class", "yes": 51, "no": 9 },
             { "node": 9, "message": "Want to use props", "yes": 52, "no": 53 },
// Questions: gentler
             { "node": 10, "message": "Or a gentler experience", "yes": 11, "no": 13 },
             { "node": 11, "message": "Would you hold a pose for 10 minutes", "yes": 61, "no": 12 },
             { "node": 12, "message": "Want to move around", "yes": 62, "no": 63 },
// Questions: benefits
             { "node": 13, "message": "Looking for specific benefits", "yes": 14, "no": 17 },
             { "node": 14, "message": "Striving for overall wellness", "yes": 71, "no": 15 },
             { "node": 15, "message": "Want to learn to completely relax", "yes": 72, "no": 16 },
             { "node": 16, "message": "Would you adjust your lifestyle", "yes": 73, "no": 74 },
// Questions: chant
             { "node": 17, "message": "Would you chant", "yes": 18, "no": 19 },
             { "node": 18, "message": "Consider being a vegan", "yes": 81, "no": 82 },
// Queastions specialty
            { "node": 19, "message": "Don't worry, there are also specialty classes. Fine with getting wet?", "yes": 91, "no": 20 },
            { "node": 20, "message": "Want to reach new heights", "yes": 92, "no": 21 },
            { "node": 21, "message": "Are you pregnant", "yes": 93, "no": 94 },

// Answers & descriptions - Flow or Vinyasa
             { "node": 31, "message": "Slow flow", "yes": 0, "no": 0, "description": "Flow classes move quickly and are not recommended or beginners. Taking a slow flow class is a safe way to be comfortable with the motions and poses of flow yoga before moving on to the advanced classes that pick up the pace." },
             { "node": 32, "message": "Ashtanga", "yes": 0, "no": 0, "description": "In this fast-moving class you follow a set series. The speed is set to the pace of your breath. You will definitely sweat and create the internal heat that this class is centered around." },
             { "node": 33, "message": "Baptiste", "yes": 0, "no": 0, "description": "While Baptiste is a physical practice, the themes of the classes are self-empowerment and living a meaningful life." },
             { "node": 34, "message": "Power", "yes": 0, "no": 0, "description": "This is a more commercial version of yoga. It's physical and based around a concept of fitness." },
// Answers & descriptions - Hot Yoga
             { "node": 41, "message": "Bikram", "yes": 0, "no": 0, "description": "Every class of Bikram consists of 26 poses practiced in a patented series." },
             { "node": 42, "message": "Hot Yoga", "yes": 0, "no": 0, "description": "Any kind of yoga can be practiced in a hot room. Many studios offer flow, Vinyasa, and alignment-focused classes in their hot studios." },
// Answers & descriptions - Alignment Focused
             { "node": 51, "message": "Anusara", "yes": 0, "no": 0, "description": "The phrase that accompanies Anusara yoga classes is to open your heart. These classes include a lot of love languages and affirmation." },
             { "node": 52, "message": "Iyengar", "yes": 0, "no": 0, "description": "Iyengar yoga focuses on traditional poses that get more advanced the longer you stick with the practice. Often in these classes you will use props like blocks, straps, and blankets." },
             { "node": 53, "message": "Eischens", "yes": 0, "no": 0, "description": "In Eischens, the challenge is to get out of habitual patterns of movement and thinking to align mind, body, and spirit." },
// Answers & descriptions - Gentle Yoga
             { "node": 61, "message": "Yin", "yes": 0, "no": 0, "description": "In Yin classes you hold poses for a long time in an effort to increase flexibility and balance energy, often with support from props." },
             { "node": 62, "message": "Kripalu", "yes": 0, "no": 0, "description": "This is a gentle style of yoga that is meant to be effortless and flow with what the body wants and needs." },
             { "node": 63, "message": "Restorative", "yes": 0, "no": 0, "description": "The movement is relaxing and poses are held up to about five minutes. Classes are typically accompanied by props." },
// Answers & descriptions - Theraputic
             { "node": 71, "message": "Integral", "yes": 0, "no": 0, "description": "These classes teach and foster overall wellness. This includes making improvements physically, mentally, and spiritually." },
             { "node": 72, "message": "Yoga Nidra", "yes": 0, "no": 0, "description": "You are supposed to find total relaxation. The class takes place in a physical and mental state that comes right before sleep." },
             { "node": 73, "message": "Phoenix Rising", "yes": 0, "no": 0, "description": "This targets physical and mental healing. The poses are meant to connect what is happening to the body with the mind and the spirit." },
             { "node": 74, "message": "Viniyoga", "yes": 0, "no": 0, "description": "Viniyoga is a form of therapy that targets specific healing benefits such as back healing, anxiety, shoulder therapy, mental health, and more." },
// Answers & descriptions - Philosophical
             { "node": 81, "message": "Jivamukti", "yes": 0, "no": 0, "description": "This spiritual practice follows strict lifestyle guidelines that revolve around bettering the community and avoiding harming others." },
             { "node": 82, "message": "Kundalini", "yes": 0, "no": 0, "description": "Kundalini has only been taught openly to the public for the last 45 years, so it is deeply rooted in tradition. Classes include singing and focusing on balancing energy." },
// Answers & descriptions - Specialty
             { "node": 91, "message": "Paddle Board", "yes": 0, "no": 0, "description": "That adaptation involves posing on a stand-up paddle board, and you can't be afraid to get wet. Using a paddle board intensifies the yoga experience and challenges your balance." },
             { "node": 92, "message": "Aerial", "yes": 0, "no": 0, "description": "Though you aren't too far off the ground, aerial yoga is almost a form of flying. The studios have silks that drape from the ceiling and are used to switch into different poses." },
             { "node": 93, "message": "Prenatal", "yes": 0, "no": 0, "description": "Prenatal yoga is a form of exercise that is easy on the joints. There are also benefits from practicing meaningful breathing." },
             { "node": 94, "message": "Every body", "yes": 0, "no": 0, "description": "Every body yoga is a class that uses chairs and other props to make it adaptable for all needs and body types." },

];

// this is used for keep track of visted nodes when we test for loops in the tree
var visited;

// These are messages that Alexa says to the user during conversation

// This is the intial welcome message
var welcomeMessage = "Welcome to yoga decision, are you ready to play?";

// This is the message that is repeated if the response to the initial welcome message is not heard
var repeatWelcomeMessage = "Say yes to start the game or no to quit.";

// this is the message that is repeated if Alexa does not hear/understand the reponse to the welcome message
var promptToStartMessage = "Say yes to continue, or no to end the game.";

// This is the prompt during the game when Alexa doesnt hear or understand a yes / no reply
var promptToSayYesNo = "Say yes or no to answer the question.";

// This is the response to the user after the final question when Alex decides on what group choice the user should be given
var decisionMessage = "I think you would like";

// This is the prompt to ask the user if they would like to hear a short description of thier chosen profession or to play again
var playAgainMessage = "Say 'tell me more' to hear a short description for this practice, or do you want to play again?";

// this is the help message during the setup at the beginning of the game
var helpMessage = "I will ask you some questions that will identify what you would be best at. Want to start now?";

// This is the goodbye message when the user has asked to quit the game
var goodbyeMessage = "Ok, see you next time!";

var speechNotFoundMessage = "Could not find speech for node";

var nodeNotFoundMessage = "In nodes array could not find node";

var descriptionNotFoundMessage = "Could not find description for node";

var loopsDetectedMessage = "A repeated path was detected on the node tree, please fix before continuing";

var utteranceTellMeMore = "tell me more";

var utterancePlayAgain = "play again";

// the first node that we will use
var START_NODE = 1;

// --------------- Handlers -----------------------

// Called when the session starts.
exports.handler = function (event, context, callback) {
    var alexa = Alexa.handler(event, context);
    alexa.registerHandlers(newSessionHandler, startGameHandlers, askQuestionHandlers, descriptionHandlers);
    alexa.execute();
};

// set state to start up and  welcome the user
var newSessionHandler = {
  'LaunchRequest': function () {
    this.handler.state = states.STARTMODE;
    this.emit(':ask', welcomeMessage, repeatWelcomeMessage);
  },'AMAZON.HelpIntent': function () {
    this.handler.state = states.STARTMODE;
    this.emit(':ask', helpMessage, helpMessage);
  },
  'Unhandled': function () {
    this.handler.state = states.STARTMODE;
    this.emit(':ask', promptToStartMessage, promptToStartMessage);
  }
};

// --------------- Functions that control the skill's behavior -----------------------

// Called at the start of the game, picks and asks first question for the user
var startGameHandlers = Alexa.CreateStateHandler(states.STARTMODE, {
    'AMAZON.YesIntent': function () {

        // ---------------------------------------------------------------
        // check to see if there are any loops in the node tree - this section can be removed in production code
        visited = [nodes.length];
        var loopFound = helper.debugFunction_walkNode(START_NODE);
        if( loopFound === true)
        {
            // comment out this line if you know that there are no loops in your decision tree
             this.emit(':tell', loopsDetectedMessage);
        }
        // ---------------------------------------------------------------

        // set state to asking questions
        this.handler.state = states.ASKMODE;

        // ask first question, the response will be handled in the askQuestionHandler
        var message = helper.getSpeechForNode(START_NODE);

        // record the node we are on
        this.attributes.currentNode = START_NODE;

        // ask the first question
        this.emit(':ask', message, message);
    },
    'AMAZON.NoIntent': function () {
        // Handle No intent.
        this.emit(':tell', goodbyeMessage);
    },
    'AMAZON.StopIntent': function () {
        this.emit(':tell', goodbyeMessage);
    },
    'AMAZON.CancelIntent': function () {
        this.emit(':tell', goodbyeMessage);
    },
    'AMAZON.StartOverIntent': function () {
         this.emit(':ask', promptToStartMessage, promptToStartMessage);
    },
    'AMAZON.HelpIntent': function () {
        this.emit(':ask', helpMessage, helpMessage);
    },
    'Unhandled': function () {
        this.emit(':ask', promptToStartMessage, promptToStartMessage);
    }
});


// user will have been asked a question when this intent is called. We want to look at their yes/no
// response and then ask another question. If we have asked more than the requested number of questions Alexa will
// make a choice, inform the user and then ask if they want to play again
var askQuestionHandlers = Alexa.CreateStateHandler(states.ASKMODE, {

    'AMAZON.YesIntent': function () {
        // Handle Yes intent.
        helper.yesOrNo(this,'yes');
    },
    'AMAZON.NoIntent': function () {
        // Handle No intent.
         helper.yesOrNo(this, 'no');
    },
    'AMAZON.HelpIntent': function () {
        this.emit(':ask', promptToSayYesNo, promptToSayYesNo);
    },
    'AMAZON.StopIntent': function () {
        this.emit(':tell', goodbyeMessage);
    },
    'AMAZON.CancelIntent': function () {
        this.emit(':tell', goodbyeMessage);
    },
    'AMAZON.StartOverIntent': function () {
        // reset the game state to start mode
        this.handler.state = states.STARTMODE;
        this.emit(':ask', welcomeMessage, repeatWelcomeMessage);
    },
    'Unhandled': function () {
        this.emit(':ask', promptToSayYesNo, promptToSayYesNo);
    }
});

// user has heard the final choice and has been asked if they want to hear the description or to play again
var descriptionHandlers = Alexa.CreateStateHandler(states.DESCRIPTIONMODE, {

 'AMAZON.YesIntent': function () {
        // Handle Yes intent.
        // reset the game state to start mode
        this.handler.state = states.STARTMODE;
        this.emit(':ask', welcomeMessage, repeatWelcomeMessage);
    },
    'AMAZON.NoIntent': function () {
        // Handle No intent.
        this.emit(':tell', goodbyeMessage);
    },
    'AMAZON.HelpIntent': function () {
        this.emit(':ask', promptToSayYesNo, promptToSayYesNo);
    },
    'AMAZON.StopIntent': function () {
        this.emit(':tell', goodbyeMessage);
    },
    'AMAZON.CancelIntent': function () {
        this.emit(':tell', goodbyeMessage);
    },
    'AMAZON.StartOverIntent': function () {
        // reset the game state to start mode
        this.handler.state = states.STARTMODE;
        this.emit(':ask', welcomeMessage, repeatWelcomeMessage);
    },
    'DescriptionIntent': function () {
        //var reply = this.event.request.intent.slots.Description.value;
        //console.log('HEARD: ' + reply);
        helper.giveDescription(this);
      },

    'Unhandled': function () {
        this.emit(':ask', promptToSayYesNo, promptToSayYesNo);
    }
});

// --------------- Helper Functions  -----------------------

var helper = {

    // gives the user more information on their final choice
    giveDescription: function (context) {

        // get the speech for the child node
        var description = helper.getDescriptionForNode(context.attributes.currentNode);
        var message = description + ', ' + repeatWelcomeMessage;

        context.emit(':ask', message, message);
    },

    // logic to provide the responses to the yes or no responses to the main questions
    yesOrNo: function (context, reply) {

        // this is a question node so we need to see if the user picked yes or no
        var nextNodeId = helper.getNextNode(context.attributes.currentNode, reply);

        // error in node data
        if (nextNodeId == -1)
        {
            context.handler.state = states.STARTMODE;

            // the current node was not found in the nodes array
            // this is due to the current node in the nodes array having a yes / no node id for a node that does not exist
            context.emit(':tell', nodeNotFoundMessage, nodeNotFoundMessage);
        }

        // get the speech for the child node
        var message = helper.getSpeechForNode(nextNodeId);

        // have we made a decision
        if (helper.isAnswerNode(nextNodeId) === true) {

            // set the game state to description mode
            context.handler.state = states.DESCRIPTIONMODE;

            // append the play again prompt to the decision and speak it
            message = decisionMessage + ' ' + message + ' ,' + playAgainMessage;
        }

        // set the current node to next node we want to go to
        context.attributes.currentNode = nextNodeId;

        context.emit(':ask', message, message);
    },

    // gets the description for the given node id
    getDescriptionForNode: function (nodeId) {

        for (var i = 0; i < nodes.length; i++) {
            if (nodes[i].node == nodeId) {
                return nodes[i].description;
            }
        }
        return descriptionNotFoundMessage + nodeId;
    },

    // returns the speech for the provided node id
    getSpeechForNode: function (nodeId) {

        for (var i = 0; i < nodes.length; i++) {
            if (nodes[i].node == nodeId) {
                return nodes[i].message;
            }
        }
        return speechNotFoundMessage + nodeId;
    },

    // checks to see if this node is an choice node or a decision node
    isAnswerNode: function (nodeId) {

        for (var i = 0; i < nodes.length; i++) {
            if (nodes[i].node == nodeId) {
                if (nodes[i].yes === 0 && nodes[i].no === 0) {
                    return true;
                }
            }
        }
        return false;
    },

    // gets the next node to traverse to based on the yes no response
    getNextNode: function (nodeId, yesNo) {
        for (var i = 0; i < nodes.length; i++) {
            if (nodes[i].node == nodeId) {
                if (yesNo == "yes") {
                    return nodes[i].yes;
                }
                return nodes[i].no;
            }
        }
        // error condition, didnt find a matching node id. Cause will be a yes / no entry in the array but with no corrosponding array entry
        return -1;
    },

    // Recursively walks the node tree looking for nodes already visited
    // This method could be changed if you want to implement another type of checking mechanism
    // This should be run on debug builds only not production
    // returns false if node tree path does not contain any previously visited nodes, true if it finds one
    debugFunction_walkNode: function (nodeId) {

        // console.log("Walking node: " + nodeId);

        if( helper.isAnswerNode(nodeId) === true) {
            // found an answer node - this path to this node does not contain a previously visted node
            // so we will return without recursing further

            // console.log("Answer node found");
             return false;
        }

        // mark this question node as visited
        if( helper.debugFunction_AddToVisited(nodeId) === false)
        {
            // node was not added to the visited list as it already exists, this indicates a duplicate path in the tree
            return true;
        }

        // console.log("Recursing yes path");
        var yesNode = helper.getNextNode(nodeId, "yes");
        var duplicatePathHit = helper.debugFunction_walkNode(yesNode);

        if( duplicatePathHit === true){
            return true;
        }

        // console.log("Recursing no");
        var noNode = helper.getNextNode(nodeId, "no");
        duplicatePathHit = helper.debugFunction_walkNode(noNode);

        if( duplicatePathHit === true){
            return true;
        }

        // the paths below this node returned no duplicates
        return false;
    },

    // checks to see if this node has previously been visited
    // if it has it will be set to 1 in the array and we return false (exists)
    // if it hasnt we set it to 1 and return true (added)
    debugFunction_AddToVisited: function (nodeId) {

        if (visited[nodeId] === 1) {
            // node previously added - duplicate exists
            // console.log("Node was previously visited - duplicate detected");
            return false;
        }

        // was not found so add it as a visited node
        visited[nodeId] = 1;
        return true;
    }
};
