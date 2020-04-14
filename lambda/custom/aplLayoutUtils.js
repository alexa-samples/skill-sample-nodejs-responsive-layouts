// Copyright 2019-2020 Amazon.com, Inc. or its affiliates. All Rights Reserved.
// Licensed under the Amazon Software License
// http://aws.amazon.com/asl/

/**
 * This file defines utilities to manage aplLayouts
 */

module.exports = {

    /**
     * Returns an object containing the AplTutorialType ID & spoken value by the User from the JSON request
     * Values are computing from slot "TutorialType" or from Alexa.Presentation.APL.UserEvent arguments
     */
    getAplTutorialType(request){
        let aplTutorialType = {};
        // Touch Event Request ?
        if (request.type === 'Alexa.Presentation.APL.UserEvent') {
            aplTutorialType.id = request.arguments[1];
        } else {
            // Voice Intent Request
            const itemSlot = request.intent.slots["TutorialType"];
            // Capture spoken value by the User
            if (itemSlot && itemSlot.value) {
                aplTutorialType.spoken = itemSlot.value;
            }
            // Find associated AplDoc Id from Entity Resolution (if a match has been made)
            if (itemSlot &&
                itemSlot.resolutions &&
                itemSlot.resolutions.resolutionsPerAuthority[0] &&
                itemSlot.resolutions.resolutionsPerAuthority[0].status &&
                itemSlot.resolutions.resolutionsPerAuthority[0].status.code === 'ER_SUCCESS_MATCH') {
                aplTutorialType.id = itemSlot.resolutions.resolutionsPerAuthority[0].values[0].value.id;
            }
        }
        return aplTutorialType;
    },

    /**
     * Returns an object containing the aplLayout (aplDoc) ID & spoken value by the User from the JSON request
     * Values are computing from slot "Item" or from Alexa.Presentation.APL.UserEvent arguments
     */
    getAplDocItem(request){
        let aplDocItem = {};
        // Touch Event Request ?
        if (request.type === 'Alexa.Presentation.APL.UserEvent') {
            aplDocItem.id = request.arguments[1];
        } else {
            // Voice Intent Request
            const itemSlot = request.intent.slots["Item"];
            // Capture spoken value by the User
            if (itemSlot && itemSlot.value) {
                aplDocItem.spoken = itemSlot.value;
            }
            // Find associated AplDoc Id from Entity Resolution (if a match has been made)
            if (itemSlot &&
                itemSlot.resolutions &&
                itemSlot.resolutions.resolutionsPerAuthority[0] &&
                itemSlot.resolutions.resolutionsPerAuthority[0].status &&
                itemSlot.resolutions.resolutionsPerAuthority[0].status.code === 'ER_SUCCESS_MATCH') {
                aplDocItem.id = itemSlot.resolutions.resolutionsPerAuthority[0].values[0].value.id;
            }
        }
        return aplDocItem;
    },

    /**
     * Returns a random localized aplLayout from the list of available aplLayouts
     */
    getRandomAplLayout(handlerInput){
        const aplLayouts = handlerInput.t('APLLAYOUTS');
        const keys = Object.keys(aplLayouts);
        const randomIndex = Math.floor(Math.random() * keys.length);
        return aplLayouts[keys[randomIndex]];
    }
}