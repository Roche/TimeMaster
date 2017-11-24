/*******************************************************************************
 * Copyright © 2017 Hoffmann-La Roche
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 ******************************************************************************/

import arraysUtils from '../common/arraysUtils.js';
import config from './config.js';
import timeRangeRepository from '../common/timeRangeRepository.js';
import timeParser from './timeParser.js';
import urlParser from '../common/urlParser.js';
import log from '../common/log.js';


const meetingOverview = {

    registerBubbleListener: function () {
        let observer = new MutationObserver(addBubbleChangeObserverToAddedNodes);
        let observerConfig = {childList: true, subtree: true};

        observer.observe(document.body, observerConfig);
    },
};

const findMeetingTime = function (bubble) {
    if (bubble) {
        let meetingTimeRange = findMeetingHoursInBubble(bubble);
        let hangoutLinks = bubble.querySelectorAll(config.meetingsOverviewPage.selector.hangoutLink);
        let meetLinks = bubble.querySelectorAll(config.meetingsOverviewPage.selector.meetLink);
        log.info('HangoutLinks: ', hangoutLinks, ' MeetLinks: ', meetLinks, ' TimeRange: ', meetingTimeRange);

        arraysUtils.arrayify(hangoutLinks).concat(arraysUtils.arrayify(meetLinks)).forEach(a => saveHangoutTime(a, meetingTimeRange));
    }
    return bubble;
};


const addBubbleChangeObserverToAddedNodes = function (mutations) {
    return mutations.filter(mutation => mutation.addedNodes)
                    .map(mutation => arraysUtils.arrayify(mutation.addedNodes))
                    .reduce(arraysUtils.concatenateArrays, [])
                    .filter(isBubble)
                    .map(findMeetingTime)
                    .map(addBubbleChangesObserver);
};


const addBubbleChangesObserver = function (bubble) {
    if (bubble) {
        let observer = new MutationObserver(findMeetingTimeInBubbleChanges);
        let observerConfig = {childList: true, subtree: true};

        observer.observe(bubble, observerConfig);
    }
    return bubble;
};

const findMeetingTimeInBubbleChanges = function (mutations) {
    return mutations.filter(mutation => mutation.addedNodes)
                    .map(mutation => arraysUtils.arrayify(mutation.addedNodes))
                    .reduce(arraysUtils.concatenateArrays, [])
                    .filter(element => element) // removes nulls
                    .map(findParentBubble)
                    .filter(element => element) // removes nulls
                    .filter(arraysUtils.uniqueElements)
                    .map(findMeetingTime);
};


const findParentBubble = function (mutatedElement) {
    if (isBubble(mutatedElement)) return mutatedElement;
    if (mutatedElement.parentElement) return findParentBubble(mutatedElement.parentElement);

    return null;

};

const findMeetingHoursInBubble = function (bubble) {
    let timeBox = findTimeBox(bubble);
    if (!timeBox) return undefined;

    let timeString = timeParser.extractHourMinuteRange(timeBox.textContent);
    let hoursTab = timeString.match(config.hourMinutePattern);
    let timeRangeFromTimeArray = timeParser.createTimeRangeFromTimeArray(hoursTab);
    log.info('TimeString: ' + timeString + ', hoursTab:' + hoursTab + ',TimeRange: ', timeRangeFromTimeArray);
    return timeRangeFromTimeArray;
};

const findTimeBox = function (bubble) {
    let timeBox;
    for (let i in config.meetingsOverviewPage.selector.meetingTimeSelectors) {
        let selector = config.meetingsOverviewPage.selector.meetingTimeSelectors[i];
        timeBox = bubble.querySelector(selector);
        if (timeBox) break;
    }
    return timeBox;
};

const saveHangoutTime = function (aHrefElement, meetingTimeRange) {
    if (meetingTimeRange){
        let url = aHrefElement.getAttribute('href');
        let hangoutId = urlParser.getHangoutId(new URL(url).pathname);
        log.info('Saving hangout time, Meeting Hours:', meetingTimeRange.startTime, meetingTimeRange.endTime);
        timeRangeRepository.saveHangoutTime(hangoutId, meetingTimeRange);
    } else {
        log.error('Meeting Time Range not found:');
    }
};

const isBubble = function (element) {
    let isBubble = false;
    if (element.className) {
        isBubble = element.className.indexOf(config.meetingsOverviewPage.bubbleClassName) >= 0;
    }
    return isBubble;
};

export default meetingOverview;
