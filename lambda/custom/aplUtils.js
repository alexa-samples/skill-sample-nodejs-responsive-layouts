// Copyright 2019-2020 Amazon.com, Inc. or its affiliates. All Rights Reserved.
// Licensed under the Amazon Software License
// http://aws.amazon.com/asl/

/**
 * This file defines the different utililies to manage APL displays.
 */

// ASK SDK
const Alexa = require('ask-sdk-core');
// General Utilities
const aplLayoutUtils = require('./aplLayoutUtils');
// APL Templates
const APLDocs = {
    launch: require('./documents/display/launchRequest/template.json'),
    aplLayoutsList: require('./documents/display/aplLayoutsList/template.json'),
    help: require('./documents/display/helpRequest/template.json'),
    aplDemo: {
        "AlexaHeadline": require('./documents/display/alexaHeadline/template.json'),
        "AlexaTextList": require('./documents/display/alexaTextList/template.json'),
        "AlexaBackground": require('./documents/display/alexaBackground/template.json'),
        "AlexaButton": require('./documents/display/alexaButton/template.json'),
        "AlexaHeader": require('./documents/display/alexaHeader/template.json'),
        "AlexaFooter": require('./documents/display/alexaFooter/template.json'),
        "AlexaImage": require('./documents/display/alexaImage/template.json'),
        "AlexaPageCounter": require('./documents/display/alexaPageCounter/template.json'),
        "AnalogClock": require('./documents/display/analogClock/template.json'),
        "GridList": require('./documents/display/gridList/template.json'),
        "VideoOnEnd": require('./documents/display/videoOnEnd/template.json'),
        "DancingEqualizerBars": require('./documents/display/dancingEqualizerBars/template.json'),
        "Parallax": require('./documents/display/parallax/template.json'),
        "AvgAnimation": require('./documents/display/avgAnimation/template.json'),
        "SpeakList": require('./documents/display/speakList/template.json'),
        "SpeakListHorizontal": require('./documents/display/speakListHorizontal/template.json'),
        "SpeakItem": require('./documents/display/speakItem/template.json'),
        "Video": require('./documents/display/video/template.json'),
        "TvFocusedState": require('./documents/display/tvFocusedState/template.json')
    },
    aplDatasource: {
        "AlexaTextList": require('./documents/display/alexaTextList/sample/datasources.json'),
        "SpeakList": require('./documents/display/speakList/sample/datasources.json'),
        "SpeakListHorizontal": require('./documents/display/speakListHorizontal/sample/datasources.json'),
        "SpeakItem": require('./documents/display/speakItem/sample/datasources.json'),
        "Video": require('./documents/display/video/sample/datasources.json'),
        "TvFocusedState": require('./documents/display/tvFocusedState/sample/datasources.json'),
        "GridList": require('./documents/display/gridList/sample/datasources.json')
    }
};

/**
 * Checks whether APL is supported by the User's device
 */
function supportsAPL(handlerInput) {
    const supportedInterfaces = Alexa.getSupportedInterfaces(handlerInput.requestEnvelope);
    const aplInterface = supportedInterfaces['Alexa.Presentation.APL'];
    return aplInterface !== null && aplInterface !== undefined;
}

/**
 * Adds Launch Screen (APL Template) to Response
 */
function launchScreen(handlerInput) {
    // Only add APL directive if User's device supports APL
    if (supportsAPL(handlerInput)) {
        handlerInput.responseBuilder.addDirective({
            type: 'Alexa.Presentation.APL.RenderDocument',
            version: '1.1',
            document: APLDocs.launch,
            datasources: generateLaunchScreenDatasource(handlerInput)
        });
    }
}

/**
 * Adds APL Layouts List Screen (APL Template) to Response
 */
function aplLayoutsListScreen(handlerInput, tutorialType) {
    // Only add APL directive if User's device supports APL
    if (supportsAPL(handlerInput)) {
        handlerInput.responseBuilder.addDirective({
            type: 'Alexa.Presentation.APL.RenderDocument',
            version: '1.1',
            document: APLDocs.aplLayoutsList,
            datasources: generateAplLayoutsListScreenDatasource(handlerInput, tutorialType)
        });
    }
}

/**
 * Adds Help Screen (APL Template) to Response
 */
function helpScreen(handlerInput) {
        // Only add APL directive if User's device supports APL
    if (supportsAPL(handlerInput)) {
        handlerInput.responseBuilder.addDirective({
            type: 'Alexa.Presentation.APL.RenderDocument',
            version: '1.1',
            document: APLDocs.help,
            datasources: generateHelpScreenDatasource(handlerInput)
        });
    }
}

/**
 * Adds AplLayout Screen (APL Template) to Response
 */
function aplLayoutScreen(handlerInput, aplDocItem) {
    // Get prompt & reprompt speech
    const speakOutput = aplDocItem.instructions;
    const repromptOutput = handlerInput.t('APLLAYOUT_REPEAT_MESSAGE');
    // Only add APL directive if User's device supports APL
    if (supportsAPL(handlerInput)) {
        // add APL Template
        const aplDoc = APLDocs.aplDemo[aplDocItem.id];
        const aplDatasource = APLDocs.aplDatasource[aplDocItem.id];
        
        handlerInput.responseBuilder.addDirective({
            type: 'Alexa.Presentation.APL.RenderDocument',
            token: 'aplDoc-tutorial',
            version: '1.1',
            document: aplDoc,
            datasources: aplDatasource
            //datasources: generateAplLayoutScreenDatasource(handlerInput, aplDocItem)
        })
        // As speech will be done by APL Command (SpeakItem) Voice/Text sync
        // Save prompt & reprompt for repeat
        const sessionAttributes = handlerInput.attributesManager.getSessionAttributes();
        sessionAttributes.speakOutput = speakOutput;
        sessionAttributes.repromptOutput = repromptOutput;
    } else {
        // As APL is not supported by device
        // Provide prompt & reprompt instead of APL Karaoke
        handlerInput.responseBuilder
            .speak(speakOutput)
            .reprompt(repromptOutput);
    }
}

/**
 * Compute the JSON Datasource associated to APL Launch Screen
 */
function generateLaunchScreenDatasource(handlerInput) {
    // Get a random aplDoc name for hint
    const randomAplLayout = aplLayoutUtils.getRandomAplLayout(handlerInput);
    // Define Header Title & Hint 
    const headerTitle = handlerInput.t('HEADER_TITLE', { skillName: handlerInput.t('SKILL_NAME') });
    const hintText = handlerInput.t('HINT_TEMPLATE', { aplDoc: randomAplLayout.name });
   
    // Generate JSON Datasource
    return {
        aplTutorialTypeData: {
            type: 'object',
            properties: {
                headerTitle: headerTitle,
                hintText: hintText
            },
            transformers: [
                {
                    inputPath: 'hintText',
                    transformer: 'textToHint',
                }
            ]
        }
    };
}

/**
 * Compute the JSON Datasource associated to APL Layouts List Screen
 */
function generateAplLayoutsListScreenDatasource(handlerInput, tutorialType) {
    // Get aplLayouts
    const aplLayouts = handlerInput.t('APLLAYOUTS');
    // Get a random aplDoc name for hint
    const randomAplLayout = aplLayoutUtils.getRandomAplLayout(handlerInput);
    // Define Header Title & Hint 
    let headerTitle = handlerInput.t('HEADER_TITLE', { skillName: handlerInput.t('SKILL_NAME') });
    const hintText = handlerInput.t('HINT_TEMPLATE', { aplDoc: randomAplLayout.name });
    // Define AplDocs to be displayed
    let aplDocsIdsToDisplay = [];
    if (tutorialType == "ResponsiveLayouts") {
        aplDocsIdsToDisplay = ["AlexaHeadline", "AlexaTextList", "AlexaBackground", "AlexaButton", "AlexaHeader", "AlexaFooter", "AlexaImage", "AlexaPageCounter"];
        headerTitle = handlerInput.t('HEADER_TITLE_LAYOUT');
    } else {
        aplDocsIdsToDisplay = ["AnalogClock", "GridList", "VideoOnEnd", "DancingEqualizerBars", "Parallax", "AvgAnimation", "SpeakList", "SpeakListHorizontal", "SpeakItem", "Video", "TvFocusedState"];
        headerTitle = handlerInput.t('HEADER_TITLE_RECIPE');
    }
    const aplDocs = [];
    Object.keys(aplLayouts).forEach((item) => {
        if (aplDocsIdsToDisplay.includes(item)) {
            let aplDocItem = {
                id: item,
                image: aplLayouts[item].image,
                text: aplLayouts[item].name,
            };
            aplDocs.push(aplDocItem);
        }
    });
    // Generate JSON Datasource
    return {
        aplDocData: {
            type: 'object',
            properties: {
                headerTitle: headerTitle,
                hintText: hintText,
                items: aplDocs
            },
            transformers: [
                {
                    inputPath: 'hintText',
                    transformer: 'textToHint',
                }
            ]
        }
    };
}

/**
 * Compute the JSON Datasource associated to APL AplLayout Screen
 */
function generateAplLayoutScreenDatasource(handlerInput, aplDocItem) {
    // Get a random aplDoc name for hint
    const randomAplDoc = aplLayoutUtils.getRandomAplLayout(handlerInput);
    // Define Header Title & Hint 
    const headerTitle = handlerInput.t('APLLAYOUT_HEADER_TITLE', { aplDoc: aplDocItem.name });
    const hintText = handlerInput.t('HINT_TEMPLATE', { aplDoc: randomAplDoc.name });
    // Generate JSON Datasource
    return {
        aplDocData: {
            type: 'object',
            properties: {
                headerTitle: headerTitle,
                headerBackButton: !Alexa.isNewSession(handlerInput.requestEnvelope),
                hintText: hintText,
                aplDocImg: aplDocItem.image,
                aplDocText: aplDocItem.instructions,
                aplDocSsml: `<speak>${aplDocItem.instructions}</speak>`
            },
            transformers: [
                {
                    inputPath: 'aplDocSsml',
                    transformer: 'ssmlToSpeech',
                    outputName: 'aplDocSpeech'
                },
                {
                    inputPath: 'hintText',
                    transformer: 'textToHint',
                }
            ]
        }
    };
}

/**
 * Compute the JSON Datasource associated to APL Help Screen
 */
function generateHelpScreenDatasource(handlerInput) {
    // Get aplLayouts
    const aplLayouts = handlerInput.t('APLLAYOUTS');
    // Define Header & Sub Titles 
    const headerTitle = handlerInput.t('HELP_HEADER_TITLE');
    const headerSubTitle = handlerInput.t('HELP_HEADER_SUBTITLE');
    // Define AplDocs to be displayed
    const aplDocsIdsToDisplay = ["AlexaHeadline", "AlexaTextList", "AlexaBackground", "AlexaButton", "AlexaHeader", "AlexaFooter", "AlexaImage"];
    const aplDocs = [];
    Object.keys(aplLayouts).forEach((item) => {
        if (aplDocsIdsToDisplay.includes(item)) {
            let aplDocItem = {
                id: item,
                primaryText: handlerInput.t('HINT_TEMPLATE', { aplDoc: aplLayouts[item].name }),
            };
            aplDocs.push(aplDocItem);
        }
    });
    // Generate JSON Datasource
    return {
        aplDocData: {
            headerTitle: headerTitle,
            headerSubtitle: headerSubTitle,
            headerBackButton: !Alexa.isNewSession(handlerInput.requestEnvelope),
            items: aplDocs
        }
    };
}

module.exports = {
    launchScreen,
    aplLayoutsListScreen,
    helpScreen,
    aplLayoutScreen
} 