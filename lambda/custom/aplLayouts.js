// Copyright 2019-2020 Amazon.com, Inc. or its affiliates. All Rights Reserved.
// Licensed under the Amazon Software License
// http://aws.amazon.com/asl/

/**
 * This file defines the aplLayout name & instructions for each supported locale
 */

module.exports = {
    en: {
        AlexaHeadline: {
            name: `Alexa Headline`,
            instructions: `The Alexa headline template displays short, informational text string on the screen. This is a full-screen template that can include a header, footer, and background.`,
            image: `https://ask-skills-assets.s3.amazonaws.com/apl-layout-assets/arl-examples/headline.png`
        },
        AlexaTextList: {
            name: `Alexa TextList`,
            instructions: `The Alexa text list template displays a scrolling list of text items. This is a full-screen template that can include the header and background. You provide a set of text-based items to display in the list. You can configure the appearance of the list, such as including dividers and whether items should be numbered. You can also provide the command to run when a user selects an item from the list.`,
            image: `https://ask-skills-assets.s3.amazonaws.com/apl-layout-assets/arl-examples/textList.png`
        },
        AlexaBackground: {
            name: `Alexa Background`,
            instructions: ``,
            image: `https://ask-skills-assets.s3.amazonaws.com/apl-layout-assets/arl-examples/background.png`
        },
        AlexaButton: {
            name: "Alexa Button",
            instructions: `The Alexa button responsive component displays a button the user can select with touch or a controller. You can configure the text displayed on the button, the button appearance, and the command to run when the user selects the button.`,
            image: `https://ask-skills-assets.s3.amazonaws.com/apl-layout-assets/arl-examples/button.png`
        },
        AlexaHeader: {
            name: `Alexa Header`,
            instructions: `The Alexa header responsive component displays common header information such as a title, subtitle, and back button.`,
            image: `https://ask-skills-assets.s3.amazonaws.com/apl-layout-assets/arl-examples/header.png`
        },
        AlexaFooter: {
            name: `Alexa Footer`,
            instructions: `The Alexa footer responsive component displays a hint at the bottom of a screen. This is intended to suggest other utterances the user might try. Use the textToHint transformer to automatically show the wake word configured for the device.`,
            image: `https://ask-skills-assets.s3.amazonaws.com/apl-layout-assets/arl-examples/footer.png`
        },
        AlexaImage: {
            name: `Alexa Image`,
            instructions: `The Alexa image responsive component displays an image. You can display the image with standard aspect ratios (such as portrait or round) and effects such as rounded corners.`,
            image: `https://ask-skills-assets.s3.amazonaws.com/apl-layout-assets/arl-examples/image.png`
        },
        AlexaPageCounter: {
            name: `Alexa Page Counter`,
            instructions: `The Alexa page counter responsive component displays a current page number and total number of pages. You can use this to number pages in a Pager.`,
            image: `https://ask-skills-assets.s3.amazonaws.com/apl-layout-assets/arl-examples/pageCounter.png`
        },
        DancingEqualizerBars: {
            name: `Dancing equalizer bars`,
            instructions: `These dancing equalizer bars using Alexa vector graphics or A V G with the new AnimateItem command in APL 1.1`,
            image: `https://ask-skills-assets.s3.amazonaws.com/apl-layout-assets/arl-examples/equalizer-bars.png`
        },
        Parallax: {
            name: `Parallax`,
            instructions: `Parallax effect can be created by using AnimateItem command on each image layer`,
            image: `https://ask-skills-assets.s3.amazonaws.com/apl-layout-assets/arl-examples/parallax.png`
        },
        AvgAnimation: {
            name: `AVG Animation`,
            instructions: `This example shows how to use Alexa vector graphics or A V G and the new AnimateItem command in APL 1.1.`,
            image: `https://ask-skills-assets.s3.amazonaws.com/apl-layout-assets/arl-examples/AVG-animation.png`
        },
        SpeakList: {
            name: `Vertical SpeakList`,
            instructions: ``,
            image: `https://ask-skills-assets.s3.amazonaws.com/apl-layout-assets/arl-examples/speaklist.png`
        },
        SpeakListHorizontal: {
            name: `Horizontal SpeakList`,
            instructions: ``,
            image: `https://ask-skills-assets.s3.amazonaws.com/apl-layout-assets/arl-examples/speaklist-horizontal.png`
        },
        SpeakItem: {
            name: `SpeakItem`,
            instructions: ``,
            image: `https://ask-skills-assets.s3.amazonaws.com/apl-layout-assets/arl-examples/speakitem.png`
        },
        Video: {
            name: `Video`,
            instructions: ``,
            image: `https://ask-skills-assets.s3.amazonaws.com/apl-layout-assets/arl-examples/video.png`
        },
        TvFocusedState: {
            name: `TV Focused State`,
            instructions: `This example demonstrates how to use focused states with a horizontal list on a TV device such as Fire TVs or LG TVs. Try this example on TV with your remote.`,
            image: `https://ask-skills-assets.s3.amazonaws.com/apl-layout-assets/arl-examples/tv-focused-state.png`
        },
        AnalogClock: {
            name: `Analog Clock`,
            instructions: `This example demonstrates how to create an Analog Clock that works with the local time.`,
            image: `https://ask-skills-assets.s3.amazonaws.com/apl-layout-assets/arl-examples/analog-clock.png`
        }
    }
};