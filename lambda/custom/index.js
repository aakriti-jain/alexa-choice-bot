/* eslint-disable  func-names */
/* eslint-disable  no-console */

const Alexa = require('ask-sdk-core');

const LaunchRequestHandler = {
  canHandle(handlerInput) {
    return handlerInput.requestEnvelope.request.type === 'LaunchRequest';
  },
  handle(handlerInput) {
    const speechText = 'Hello I am Choice Bot! You may ask me to give my take on tough choices.';

    return handlerInput.responseBuilder
      .speak(speechText)
      .reprompt(speechText)
      .withSimpleCard('Choice Bot', speechText)
      .getResponse();
  },
};

const ChoiceIntentHandler = {
  canHandle(handlerInput) {
    return handlerInput.requestEnvelope.request.type === 'IntentRequest'
      && handlerInput.requestEnvelope.request.intent.name === 'ChoiceIntent';
  },
  handle(handlerInput) {
    slots = handlerInput.requestEnvelope.request.intent.slots;
    phrase = slots['opts'].value;
    pos = phrase.search(" or ")
    if(pos != -1) {
      a = phrase.substr(0, pos);
      b = phrase.substr(pos + 4)
    }
    else {
      pos = phrase.search(" versus ");
      if (pos == -1) {
        speechText = "Sorry. Either there was nothing to choose from or you gave me only one option."
        return handlerInput.responseBuilder
          .speak(speechText)
          .withSimpleCard('Choice Bot - No Choice', speechText)
          .getResponse();
      }
      a = phrase.substr(0, pos);
      b = phrase.substr(pos + 8)
    }
    r = Math.floor(Math.random() + 0.5);
    choice = ""
    if(r == 0) {
      choice = a;
    }
    else {
      choice = b;
    }
    speechText = randomAnswer(choice)
    return handlerInput.responseBuilder
      .speak(speechText)
      .withSimpleCard('Choice Bot - ' + a + ' or ' + b, speechText)
      .getResponse();
  },
};

function randomAnswer(choice) {
  x = Math.floor(Math.random()*5);
  if (x == 0) {
    return "I think you should go for " + choice;
  }
  switch(x) {
    case 0: return "I think you should go for " + choice;
    case 1: return "If I were you, I would have chosen " + choice;
    case 2: return "I think " + choice + " is the right choice";
    case 3: return "Well both of them are not bad, but I would have preferred " + choice;
    case 4: return "Take my word - Go for " + choice;
  }
}
const HelpIntentHandler = {
  canHandle(handlerInput) {
    return handlerInput.requestEnvelope.request.type === 'IntentRequest'
      && handlerInput.requestEnvelope.request.intent.name === 'AMAZON.HelpIntent';
  },
  handle(handlerInput) {
    const speechText = 'I am Choice Bot. You may ask me questions like - left or right, Pasta vs. Sushi etc.';

    return handlerInput.responseBuilder
      .speak(speechText)
      .reprompt(speechText)
      .withSimpleCard('Choice Bot', speechText)
      .getResponse();
  },
};

const CancelAndStopIntentHandler = {
  canHandle(handlerInput) {
    return handlerInput.requestEnvelope.request.type === 'IntentRequest'
      && (handlerInput.requestEnvelope.request.intent.name === 'AMAZON.CancelIntent'
        || handlerInput.requestEnvelope.request.intent.name === 'AMAZON.StopIntent');
  },
  handle(handlerInput) {
    const speechText = 'Goodbye!';

    return handlerInput.responseBuilder
      .speak(speechText)
      .getResponse();
  },
};

const SessionEndedRequestHandler = {
  canHandle(handlerInput) {
    return handlerInput.requestEnvelope.request.type === 'SessionEndedRequest';
  },
  handle(handlerInput) {
    console.log(`Session ended with reason: ${handlerInput.requestEnvelope.request.reason}`);

    return handlerInput.responseBuilder.getResponse();
  },
};

const ErrorHandler = {
  canHandle() {
    return true;
  },
  handle(handlerInput, error) {
    console.log(`Error handled: ${error.message}`);

    return handlerInput.responseBuilder
      .speak('Sorry, I can\'t understand the command. Please say again.')
      .reprompt('Sorry, I can\'t understand the command. Please say again.')
      .getResponse();
  },
};

const skillBuilder = Alexa.SkillBuilders.custom();

exports.handler = skillBuilder
  .addRequestHandlers(
    LaunchRequestHandler,
    ChoiceIntentHandler,
    HelpIntentHandler,
    CancelAndStopIntentHandler,
    SessionEndedRequestHandler
  )
  .addErrorHandlers(ErrorHandler)
  .lambda();
