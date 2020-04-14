// Copyright 2019-2020 Amazon.com, Inc. or its affiliates. All Rights Reserved.
// Licensed under the Amazon Software License
// http://aws.amazon.com/asl/

/**
 * This file defines the different Handlers & Interceptors 
 * used to handle Requests sent by the Alexa Service
 */

/////////////////////////////////
// Modules Definition
/////////////////////////////////

// ASK SDK
const Alexa = require('ask-sdk-core');
// i18n library dependency, we use it below in a localisation interceptor
const i18n = require('i18next');
const languageStrings = require('./localisation');
// APL Utilities
const aplUtils = require('./aplUtils');
// AplLayout Utilities
const aplLayoutUtils = require('./aplLayoutUtils');

/////////////////////////////////
// Handlers Definition
/////////////////////////////////

/**
 * Handles LaunchRequest requests sent by Alexa
 * Note : this type of request is send when the user invokes your skill without providing a specific intent.
 */
const LaunchRequestHandler = {
  canHandle(handlerInput) {
    return Alexa.getRequestType(handlerInput.requestEnvelope) === 'LaunchRequest';
  },
  handle(handlerInput) {
    // Get prompt & reprompt speech
    const speakOutput = handlerInput.t('WELCOME_MESSAGE');
    const repromptOutput = handlerInput.t('WELCOME_REPROMPT');
    // add APL template if device is compatible
    aplUtils.launchScreen(handlerInput);
    // Generate the JSON Response
    return handlerInput.responseBuilder
      .speak(speakOutput)
      .reprompt(repromptOutput)
      .getResponse();
  },
};

/**
 * Handles TutorialTypeHandler or APL Touch Event (Alexa.Presentation.APL.UserEvent - aplTutorialType) requests sent by Alexa
 */
const TutorialTypeHandler = {
  canHandle(handlerInput) {
    return ((Alexa.getRequestType(handlerInput.requestEnvelope) === 'IntentRequest'
      && Alexa.getIntentName(handlerInput.requestEnvelope) === 'TutorialTypeIntent')
      || (Alexa.getRequestType(handlerInput.requestEnvelope) === 'Alexa.Presentation.APL.UserEvent'
        && handlerInput.requestEnvelope.request.arguments.length > 0
        && handlerInput.requestEnvelope.request.arguments[0] === 'aplTutorialType'));
  },
  handle(handlerInput) {
    // Get slot Item
    const aplTutorialType = aplLayoutUtils.getAplTutorialType(handlerInput.requestEnvelope.request);
    
    // Get prompt & reprompt speech
    let speakOutput = handlerInput.t('WELCOME_MESSAGE');
    let repromptOutput = handlerInput.t('WELCOME_REPROMPT');
    
    // Generate the JSON Response
    if (aplTutorialType.id == "AplResponsiveLayouts") {
      aplUtils.aplLayoutsListScreen(handlerInput, "ResponsiveLayouts");
      speakOutput = handlerInput.t("WELCOME_MESSAGE_LAYOUT");
      repromptOutput = speakOutput;
    } else { // Recipes
      aplUtils.aplLayoutsListScreen(handlerInput, "Recipes");
      speakOutput = handlerInput.t("WELCOME_MESSAGE_RECIPE");
      repromptOutput = speakOutput;
    }
    
    // Generate the JSON Response
    return handlerInput.responseBuilder
      .speak(speakOutput)
      .reprompt(repromptOutput)
      .getResponse();
  }
};

/**
 * Handles AplLayoutIntent or APL Touch Event (Alexa.Presentation.APL.UserEvent - aplDocInstructions) requests sent by Alexa
 */
const AplLayoutHandler = {
  canHandle(handlerInput) {
    return ((Alexa.getRequestType(handlerInput.requestEnvelope) === 'IntentRequest'
      && Alexa.getIntentName(handlerInput.requestEnvelope) === 'AplLayoutIntent')
      || (Alexa.getRequestType(handlerInput.requestEnvelope) === 'Alexa.Presentation.APL.UserEvent'
        && handlerInput.requestEnvelope.request.arguments.length > 0
        && handlerInput.requestEnvelope.request.arguments[0] === 'aplDocInstructions'));
  },
  handle(handlerInput) {
    // Get slot Item
    const aplDocItem = aplLayoutUtils.getAplDocItem(handlerInput.requestEnvelope.request);
    
    // Generate output to include a aplLayout with or without APL
    return AplLayoutHandler.generateAplLayoutOutput(handlerInput, aplDocItem);
  },
  generateAplLayoutOutput(handlerInput, aplDocItem) {
    const { responseBuilder } = handlerInput;
    // AplDoc exists
    if (aplDocItem.id) {
      // Add l10n strings
      const aplLayouts = handlerInput.t('APLLAYOUTS');
      const selectedAplLayout = aplLayouts[aplDocItem.id];
      Object.assign(aplDocItem, selectedAplLayout);
      // Add a Card (displayed in the Alexa App)
      const cardTitle = handlerInput.t('DISPLAY_CARD_TITLE', { skillName: handlerInput.t('SKILL_NAME'), aplDoc: aplDocItem.name });
      responseBuilder.withStandardCard(cardTitle, aplDocItem.instructions, aplDocItem.image, aplDocItem.image);
      // add APL template if device is compatible
      aplUtils.aplLayoutScreen(handlerInput, aplDocItem);
      // add APL template instructions
      responseBuilder.speak(aplDocItem.instructions);
    } else {
      // Spoken AplDoc does not exists
      // Add prompt : Is the Item slot is filled with a value ? 
      if (aplDocItem.spoken) {
        // Use spoken value to let the user knows no aplLayout exists for this value
        responseBuilder.speak(handlerInput.t('APLLAYOUT_NOT_FOUND_WITH_ITEM_NAME', { aplDoc: aplDocItem.spoken }));
      } else {
        // No spoken value
        responseBuilder.speak(handlerInput.t('APLLAYOUT_NOT_FOUND_WITHOUT_ITEM_NAME'));
      }
      // Add reprompt
      responseBuilder.reprompt(handlerInput.t('APLLAYOUT_NOT_FOUND_REPROMPT'));
    }
    // Generate the JSON Response]
    return responseBuilder.getResponse();
  }
};

/**
 * Handles VIDEOENDED Event (Alexa.Presentation.APL.UserEvent - aplDocInstructions) sent when Video is ended from APL layout
 */
const VideoEndedHandler = {
  canHandle(handlerInput) {
      return Alexa.getRequestType(handlerInput.requestEnvelope) === 'Alexa.Presentation.APL.UserEvent'
      && handlerInput.requestEnvelope.request.arguments[0] === 'VIDEOENDED';
  },
  async handle(handlerInput) {
      console.log(handlerInput.requestEnvelope.request.arguments[0]);

      const videoEndSpeech = "This speech is triggered in the Video Ended Handler. You can say go back to go to the previous screen.";

      return handlerInput.responseBuilder
          .speak(videoEndSpeech)
          .reprompt(videoEndSpeech)
          .getResponse();
  }
};

/**
 * Handles AMAZON.HelpIntent requests sent by Alexa
 */
const HelpHandler = {
  canHandle(handlerInput) {
    return Alexa.getRequestType(handlerInput.requestEnvelope) === 'IntentRequest' &&
      Alexa.getIntentName(handlerInput.requestEnvelope) === 'AMAZON.HelpIntent';
  },
  handle(handlerInput) {
    // Get a random aplDoc for speechText
    const randomAplLayout = aplLayoutUtils.getRandomAplLayout(handlerInput);
    // Get prompt & reprompt speech
    const speakOutput = handlerInput.t('HELP_MESSAGE', { aplDoc: randomAplLayout.name });
    const repromptOutput = handlerInput.t('HELP_REPROMPT', { aplDoc: randomAplLayout.name });
    // add APL template if device is compatible
    aplUtils.helpScreen(handlerInput);
    // Generate the JSON Response
    return handlerInput.responseBuilder
      .speak(speakOutput)
      .reprompt(repromptOutput)
      .getResponse();
  },
};

/**
 * Handles AMAZON.PreviousIntent & Touch Interaction (Alexa.Presentation.APL.UserEvent - goBack) requests sent by Alexa
 * to replay the previous actionnable request (voice and/or display)
 * Actionnable Requests are:
 * - IntentRequest - AplLayoutIntent
 * - IntentRequest - HelpIntent
 * - LaunchRequest
 * - Alexa.Presentation.APL.UserEvent - aplDocInstructions
 */
const PreviousHandler = {
  canHandle(handlerInput) {
    return ((Alexa.getRequestType(handlerInput.requestEnvelope) === 'IntentRequest'
      && Alexa.getIntentName(handlerInput.requestEnvelope) === 'AMAZON.PreviousIntent')
      || (Alexa.getRequestType(handlerInput.requestEnvelope) === 'Alexa.Presentation.APL.UserEvent'
        && handlerInput.requestEnvelope.request.arguments.length > 0
        && handlerInput.requestEnvelope.request.arguments[0] === 'goBack'));
  },
  handle(handlerInput) {
    const { attributesManager } = handlerInput;
    // Get History from Session Attributes for replay
    const sessionAttributes = attributesManager.getSessionAttributes();
    const actionnableHistory = sessionAttributes.actionnableHistory || [];
    // First actionable request is the one that is currently displayed or heard
    // So need to track when that is found so we can go back to the previous one
    let foundActionableRequestInHistory = false;
    let replayRequest;
    while (actionnableHistory.length > 0) {
      // Get previous action
      replayRequest = actionnableHistory.pop();
      // Check if action can be replayed
      if (replayRequest
        && replayRequest.actionable
        && foundActionableRequestInHistory) {
        // Route request to the correct Handler
        if ((replayRequest.type === 'IntentRequest'
          && replayRequest.intent.name === 'AplLayoutIntent')
          || (replayRequest.type === 'Alexa.Presentation.APL.UserEvent')) {
          // Re-Add the actionnable request in history 
          // to remember the latest displayed or heard
          actionnableHistory.push(replayRequest);
          // Get aplDoc item from request history not current Request
          const aplDocItem = aplLayoutUtils.getAplDocItem(replayRequest);
          // Return JSON Output for AplLayout
          return AplLayoutHandler.generateAplLayoutOutput(handlerInput, aplDocItem);
        }
        if (replayRequest.type === 'IntentRequest'
          && replayRequest.intent.name === 'AMAZON.HelpIntent') {
          // Re-Add the actionnable request in history 
          // to remember the latest displayed or heard
          actionnableHistory.push(replayRequest);
          // Call AMAZON.Help Handler
          return HelpHandler.handle(handlerInput);
        }
        // Note: we don't manage LaunchRequest here as it will be the default actionnable request
        // We can break the iteration
        break;
      }
      // Update Flag when an actionnable request is found
      // Next actionnable request in history (if any) will be replayed
      foundActionableRequestInHistory = replayRequest.actionable;
    }
    // No actionable history ? so just go to launch
    return LaunchRequestHandler.handle(handlerInput);
  },
};

/**
 * Handles AMAZON.RepeatIntent requests sent by Alexa
 * Prompt & reprompt will be taken from Session Attributes
 */
const RepeatHandler = {
  canHandle(handlerInput) {
    return Alexa.getRequestType(handlerInput.requestEnvelope) === 'IntentRequest' &&
      Alexa.getIntentName(handlerInput.requestEnvelope) === 'AMAZON.RepeatIntent';
  },
  handle(handlerInput) {
    const sessionAttributes = handlerInput.attributesManager.getSessionAttributes();
    // Generate the JSON Response
    return handlerInput.responseBuilder
      .speak(sessionAttributes.speakOutput)
      .reprompt(sessionAttributes.repromptSpeech)
      .getResponse();
  },
};

/**
 * Handles AMAZON.CancelIntent & AMAZON.StopIntent requests sent by Alexa 
 * Note : this request is sent when the user makes a request that corresponds to AMAZON.CancelIntent & AMAZON.StopIntent intents defined in your intent schema.
 */
const ExitHandler = {
  canHandle(handlerInput) {
    return Alexa.getRequestType(handlerInput.requestEnvelope) === 'IntentRequest'
      && (Alexa.getIntentName(handlerInput.requestEnvelope) === 'AMAZON.CancelIntent'
        || Alexa.getIntentName(handlerInput.requestEnvelope) === 'AMAZON.StopIntent');
  },
  handle(handlerInput) {
    const speakOutput = handlerInput.t('STOP_MESSAGE');
    // Generate the JSON Response
    return handlerInput.responseBuilder
      .speak(speakOutput)
      .getResponse();
  },
};

/* *
 * The intent reflector is used for interaction model testing and debugging.
 * It will simply repeat the intent the user said. You can create custom handlers for your intents 
 * by defining them above, then also adding them to the request handler chain below 
 * */
const IntentReflectorHandler = {
  canHandle(handlerInput) {
    return Alexa.getRequestType(handlerInput.requestEnvelope) === 'IntentRequest';
  },
  handle(handlerInput) {
    const intentName = Alexa.getIntentName(handlerInput.requestEnvelope);
    const speakOutput = handlerInput.t('REFLECTOR_MESSAGE', { intentName: intentName });
    // Generate the JSON Response
    return handlerInput.responseBuilder
      .speak(speakOutput)
      //.reprompt('add a reprompt if you want to keep the session open for the user to respond')
      .getResponse();
  }
};

/* *
 * SessionEndedRequest notifies that a session was ended. This handler will be triggered when a currently open 
 * session is closed for one of the following reasons: 1) The user says "exit" or "quit". 2) The user does not 
 * respond or says something that does not match an intent defined in your voice model. 3) An error occurs 
 * */
const SessionEndedRequestHandler = {
  canHandle(handlerInput) {
    return Alexa.getRequestType(handlerInput.requestEnvelope) === 'SessionEndedRequest';
  },
  handle(handlerInput) {
    console.log(`~~~~ Session ended: ${JSON.stringify(handlerInput.requestEnvelope)}`);
    // Any cleanup logic goes here.
    // Generate the JSON Response
    return handlerInput.responseBuilder.getResponse(); // notice we send an empty response
  },
};

/**
 * Generic error handling to capture any syntax or routing errors. If you receive an error
 * stating the request handler chain is not found, you have not implemented a handler for
 * the intent being invoked or included it in the skill builder below 
 * */
const ErrorHandler = {
  canHandle() {
    return true;
  },
  handle(handlerInput, error) {
    const speakOutput = handlerInput.t('ERROR_MESSAGE');
    console.log(`~~~~ Error handled: ${error.stack}`);
    // Generate the JSON Response
    return handlerInput.responseBuilder
      .speak(speakOutput)
      .reprompt(speakOutput)
      .getResponse();
  },
};

/////////////////////////////////
// Interceptors Definition
/////////////////////////////////

/**
 * This request interceptor will bind a translation function 't' to the handlerInput
 */
const LocalizationInterceptor = {
  process(handlerInput) {
    const localisationClient = i18n.init({
      lng: Alexa.getLocale(handlerInput.requestEnvelope),
      resources: languageStrings,
      returnObjects: true
    });
    localisationClient.localise = function localise() {
      const args = arguments;
      const value = i18n.t(...args);
      if (Array.isArray(value)) {
        return value[Math.floor(Math.random() * value.length)];
      }
      return value;
    };
    handlerInput.t = function translate(...args) {
      return localisationClient.localise(...args);
    }
  }
};

/**
 * This request interceptor will log all incoming requests in the associated Logs (CloudWatch) of the AWS Lambda functions
 */
const LoggingRequestInterceptor = {
  process(handlerInput) {
    console.log(`Incoming request: ${JSON.stringify(handlerInput.requestEnvelope)}`);
  }
};

/**
* This response interceptor will log all outgoing responses in the associated Logs (CloudWatch) of the AWS Lambda functions
*/
const LoggingResponseInterceptor = {
  process(handlerInput, response) {
    console.log(`Outgoing response: ${JSON.stringify(response)}`);
  }
};

/**
 * Response Interceptor to put prompt & reprompt texts into the session attributes
 * Objective : being able to repeat latest spoken elements from the Skill in case a user asks a repeat
 */
const ResponseRepeatInterceptor = {
  process(handlerInput, response) {
    const sessionAttributes = handlerInput.attributesManager.getSessionAttributes();
    if (response) {
      // Save the response and reprompt for repeat
      // Be sure to strip <speak> tags
      if (response.outputSpeech && response.outputSpeech.ssml) {
        let speakOutput = response.outputSpeech.ssml;
        speakOutput = speakOutput.replace('<speak>', '').replace('</speak>', '');
        sessionAttributes.speakOutput = speakOutput;
      }
      if (response.reprompt && response.reprompt.outputSpeech
        && response.reprompt.outputSpeech.ssml) {
        let repromptOutput = response.reprompt.outputSpeech.ssml;
        repromptOutput = repromptOutput.replace('<speak>', '').replace('</speak>', '');
        sessionAttributes.repromptOutput = repromptOutput;
      }
    }
  }
};

/**
 * This Response Interceptor is responsible to record Requests for potential replay
 * from a user through AMAZON.RepeatIntent or a Touch Interaction (Alexa.Presentation.APL.UserEvent)
 * The following requests will be flag as actionnable (to be replayed):
 * - IntentRequest - AplLayoutIntent
 * - IntentRequest - HelpIntent
 * - LaunchRequest
 * - Alexa.Presentation.APL.UserEvent - aplDocInstructions
 */
const ResponseActionnableHistoryInterceptor = {
  process(handlerInput, response) {
    // Define the number of entries for actionnable request in Session
    const maxHistorySize = 5;
    // Get Session Atributes
    const sessionAttributes = handlerInput.attributesManager.getSessionAttributes();
    const actionnableHistory = sessionAttributes.actionnableHistory || [];
    // Init request record
    const currentRequest = handlerInput.requestEnvelope.request;
    const recordRequest = {
      type: currentRequest.type,
      intent: {
        name: '',
        slots: {}
      },
      arguments: [],
      actionable: false
    };
    // Update request record with information needed for replay
    switch (currentRequest.type) {
      case 'IntentRequest':
        recordRequest.intent.name = currentRequest.intent.name;
        recordRequest.intent.slots = currentRequest.intent.slots;
        recordRequest.actionable = (["AplLayoutIntent", "AMAZON.HelpIntent"].includes(recordRequest.intent.name));
        break;
      case 'Alexa.Presentation.APL.UserEvent':
        recordRequest.arguments = currentRequest.arguments;
        recordRequest.actionable = (recordRequest.arguments[0] === 'aplDocInstructions');
        break;
      case 'LaunchRequest':
        recordRequest.actionable = true;
        break;
      default:
        //do nothing
        break;
    }
    // Remove the first actionnable item if history limit is reached
    if (actionnableHistory.length >= maxHistorySize) {
      actionnableHistory.shift();
    }
    // Only record request which will be replayed
    if (recordRequest.actionable){
      actionnableHistory.push(recordRequest);
    }
    // Update session attributes
    sessionAttributes.actionnableHistory = actionnableHistory;
  },
};

/////////////////////////////////
// SkillBuilder Definition
/////////////////////////////////

/**
 * The SkillBuilder acts as the entry point for your skill, routing all request and response
 * payloads to the handlers above. Make sure any new handlers or interceptors you've
 * defined are included below. The order matters - they're processed top to bottom.
 */
exports.handler = Alexa.SkillBuilders.custom()
  .addRequestHandlers(
    LaunchRequestHandler,
    TutorialTypeHandler,
    AplLayoutHandler,
    VideoEndedHandler,
    HelpHandler,
    RepeatHandler,
    PreviousHandler,
    ExitHandler,
    SessionEndedRequestHandler,
    IntentReflectorHandler // make sure IntentReflectorHandler is last so it doesn't override your custom intent handlers
  )
  .addRequestInterceptors(
    LoggingRequestInterceptor,
    LocalizationInterceptor
  )
  .addResponseInterceptors(
    LoggingResponseInterceptor,
    ResponseRepeatInterceptor,
    ResponseActionnableHistoryInterceptor
  )
  .addErrorHandlers(ErrorHandler)
  .withCustomUserAgent('aplDoc-tutorial/v2')
  .lambda();
