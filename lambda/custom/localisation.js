// Copyright 2019-2020 Amazon.com, Inc. or its affiliates. All Rights Reserved.
// Licensed under the Amazon Software License
// http://aws.amazon.com/asl/

/**
 * This file defines the prompts, reprompts, APL content for each supported locale
 */

// List of localized aplLayouts (all locales)
const aplLayouts = require("./aplLayouts");

// List of localized strings (all locales)
module.exports = {
    en: {
        translation: {
            APLLAYOUTS: aplLayouts.en,
            SKILL_NAME: `APL tutorial`,
            HEADER_TITLE: `{{skillName}}`,
            HEADER_TITLE_LAYOUT: `APL Responsives Layout`,
            HEADER_TITLE_RECIPE: `APL Recipes`,
            APLLAYOUT_HEADER_TITLE: `HOW TO CREATE {{aplDoc}}`,
            HELP_HEADER_TITLE: `HELP`,
            HELP_HEADER_SUBTITLE: `Select a layout`,
            WELCOME_MESSAGE: `Select a tutorial.`,
            WELCOME_REPROMPT: `For instructions on what you can say, please say help me.  Which Alexa Responsive APL would you like to create?`,
            WELCOME_MESSAGE_LAYOUT: `Select a layout`,
            WELCOME_MESSAGE_RECIPE: `Select a recipe`,
            DISPLAY_CARD_TITLE: `{{skillName}}  - Example for {{aplDoc}}`,
            HELP_MESSAGE: `You can ask questions such as, How to create {{aplDoc}}, or, you can say exit ... Now, which Alexa Responsive APL would you like to create?`,
            HELP_REPROMPT: `You can say things like, How to create for {{aplDoc}}, or you can say exit ... Now, which Alexa Responsive APL would you like to create?`,
            STOP_MESSAGE: `Goodbye!`,
            APLLAYOUT_REPEAT_MESSAGE: `Try saying repeat.`,
            APLLAYOUT_NOT_FOUND_WITH_ITEM_NAME: `I'm sorry, I currently do not have an example for {{aplDoc}}. Which Alexa Responsive APL would you like to create?`,
            APLLAYOUT_NOT_FOUND_WITHOUT_ITEM_NAME: `I'm sorry, I currently do not have an example for that. Which Alexa Responsive APL would you like to create?`,
            APLLAYOUT_NOT_FOUND_REPROMPT: `Which Alexa Responsive APL would you like to create?`,
            ERROR_MESSAGE: `I'm sorry I didn't catch that. Can you repeat that please?`,
            HINT_TEMPLATE: `How do I create {{aplDoc}}?`,
            REFLECTOR_MESSAGE: `You just triggered {{intentName}}`
        }
    }
};