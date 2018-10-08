<h2>TimeMaster Repository was migrated to internal bitbucket. To get access please contact with Roche DevTools Support</h2>
# TimeMaster
About
-----
TimeMaster is a Chrome extension, which helps you finish your Hangouts meetings on time.
It integrates with Google Hangout and Google Calendar.
Based on time scheduled in your calendar, it shows you a progress bar with time left till the end of the meeting in hangouts window.

Environement setup
------------------
#### IntelliJ Idea settings
File/Settings/Languages and Frameworks/Javascript:

* Set JavaScript level to ECMSScript6 (since version 0.5.2 we decided to use
  features that are implemented in Chrome)
* Prefer Strict mode

#### node.js
node.js v8.1.4 or higher is required.
- Mac OS: You can install it using [Homebrew](https://brew.sh/) by `brew install node`
- Windows: you can use [windows installer](https://nodejs.org/en/download/)

Building and testing "unpackaged" extension
-------------------------------------------
- To download dependencies: `npm install` -> downloads required modules to [./node_modules]
- To build: `npm run build` -> builds sources in [./src] into [./dist]
- To build for production or other specified environemnt: `npm run build -- --env=prod` (or replace prod with different env name)
- To develop: `npm run dev` -> builds sources in [./src] into [./dist] with auto rebuilding after every change
    Note: Install [Chrome Unpacked Extension Auto Reload](https://chrome.google.com/webstore/detail/chrome-unpacked-extension/fddfkmklefkhanofhlohnkemejcbamln) to enable chrome extension auto reloading
- To test: `npm run test` -> run tests in [./test] and keep rerunning them in case of any changeg in source code

More info about the packaging can be found in [PACKAGING.md]

How to test the extension in Chrome development mode
----------------------------------------------------

* Open Chrome/Settings/Extensions
* Check "Developer mode"
* "Load unpacked extension ..." and select [./dist] folder

InteliJ IDEA Formatter setup
----------------------------------------------------------
Editor -> Code Style -> JavaScript
    Tabs and Intents ->
        Check: Intends on empty lines
        Check: Intent chained methods
    Wrapping and Braces ->
        Chained method calls -> Select: "Wrap always"
            Check: "Align when multiline"


License
-------
This project is released under version 2.0 of the Apache License.
