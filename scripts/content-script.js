(function(window, document) {

    // Start Code Execution Timer
    console.time("timer");

    // Vars For Error Reporting
    var _error_message = "(none)",
        _empty_tag = "(no text)",
        _phraseCount = 10;

    // Data Vars
    var _title = getPageTitle(),
        _titleLength = getCharCount(_title),
        _metaD = getMetaD(),
        _metaDLength = getCharCount(_metaD),
        _metaK = getMetaK(),
        _firstH1 = getH1(),
        _h1Count = getH1Count(),
        _firstP = getP(),
        _headings = getHeadings(),
        _paragraphs = getParagraphs(),
        _rawText = getRawText(),
        _filteredText = getFilteredText(_rawText),
        _filteredWordCount = getWordCount(_filteredText).toLocaleString(),
        _hostname = getHostname(),
        _pathname = getPathname(),
        _keywords = getPhrases(_filteredText, 1, true, true, _phraseCount),
        _2WordPhrases = getPhrases(_filteredText, 2, true, true, _phraseCount),
        _3WordPhrases = getPhrases(_filteredText, 3, true, true, _phraseCount),
        _4WordPhrases = getPhrases(_filteredText, 4, true, true, _phraseCount),
        _5WordPhrases = getPhrases(_filteredText, 5, true, true, _phraseCount);

    chrome.runtime.sendMessage({

        action: "getSource",
        title: _title,
        titleLength: _titleLength,
        metaD: _metaD,
        metaDLength: _metaDLength,
        metaK: _metaK,
        firstH1: _firstH1,
        h1Count: _h1Count,
        firstP: _firstP,
        headings: _headings,
        paragraphs: _paragraphs,
        filteredText: _filteredText,
        filteredWordCount: _filteredWordCount,
        hostname: _hostname,
        pathname: _pathname

    }, function() {

        // Here we store the data for later
        // This callback function runs when the message is sent

        chrome.storage.local.set({ 'title': _title });
        chrome.storage.local.set({ 'titleLength': _titleLength });
        chrome.storage.local.set({ 'metaD': _metaD });
        chrome.storage.local.set({ 'metaDLength': _metaDLength });
        chrome.storage.local.set({ 'metaK': _metaK });
        chrome.storage.local.set({ 'firstH1': _firstH1 });
        chrome.storage.local.set({ 'h1Count': _h1Count });
        chrome.storage.local.set({ 'firstP': _firstP });
        chrome.storage.local.set({ 'headings': _headings });
        chrome.storage.local.set({ 'paragraphs': _paragraphs });
        chrome.storage.local.set({ 'rawText': _rawText });
        chrome.storage.local.set({ 'filteredText': _filteredText });
        chrome.storage.local.set({ 'filteredWordCount': _filteredWordCount });
        chrome.storage.local.set({ 'hostname': _hostname });
        chrome.storage.local.set({ 'keywords': _keywords });
        chrome.storage.local.set({ '_2WordPhrases': _2WordPhrases });
        chrome.storage.local.set({ '_3WordPhrases': _3WordPhrases });
        chrome.storage.local.set({ '_4WordPhrases': _4WordPhrases });
        chrome.storage.local.set({ '_5WordPhrases': _5WordPhrases });
        chrome.storage.local.set({ 'pathname': _pathname }, function() {
            // This Closure Prints All Local Storage in JSON Format
            chrome.storage.local.get(function(result) { console.log(result) });
        });

    });

    function getHostname() {

        var str = _empty_tag;

        try {

            str = window.location.hostname.trim();

            if (str == "") {
                str = _empty_tag;
            }

        } catch (err) {
            str = _error_message;
        }

        return str;
    }

    function getPathname() {

        var str = _empty_tag;

        try {

            str = window.location.pathname.trim().split("?")[0];

            if (str == "") {
                str = _empty_tag;
            }

        } catch (err) {
            str = _error_message;
        }

        return str;
    }

    function getPageTitle() {

        var str = _empty_tag;

        try {

            str = document.querySelector("title").innerText.trim();

            if (str == "") {
                str = _empty_tag;
            }

        } catch (err) {
            str = _error_message;
        }

        return str;
    }

    function getMetaD() {

        var str = _empty_tag;

        try {
            // The "i" means ignore case.
            str = document.querySelector("meta[name='description' i]").content.trim();

            if (str == "") {
                str = _empty_tag;
            }
        } catch (err) {
            str = _error_message;
        }

        return str;
    }

    function getMetaK() {

        var str = _empty_tag;

        try {
            str = document.querySelector("meta[name='keywords' i]").content.trim();

            if (str == "") {
                str = _empty_tag;
            }
        } catch (err) {
            str = _error_message;
        }

        return str;
    }

    function getH1() {

        var str = _empty_tag;

        try {
            str = document.querySelector("H1").innerText.trim();

            if (str == "") {
                str = _empty_tag;
            }
        } catch (err) {
            str = _error_message;
        }

        return str;
    }

    function getH1Count() {

        var str = _empty_tag;

        try {
            str = document.querySelectorAll("H1").length;

            if (str == "") {
                str = _empty_tag;
            }
        } catch (err) {
            str = _error_message;
        }

        return str;
    }

    function getP() {

        var str = _empty_tag;

        try {
            str = document.querySelector("P").innerText.trim();

            if (str == "") {
                str = _empty_tag;
            }
        } catch (err) {
            str = _error_message;
        }

        return str;
    }

    function getHeadings() {

        var tags = {};
        var html = "";

        try {
            tags = document.querySelectorAll("H1, H2, H3, H4, H5, H6");
        } catch (err) {
            tags = {};
        }

        for (var i = 0; i < tags.length; i++) {
            if (tags[i].innerText.trim() != "")
                html += '<tr><td>&lt;' + tags[i].nodeName + '&gt;</td><td>' + tags[i].innerText + '</td></tr>';
        }

        return html;
    }

    function getParagraphs() {

        var tags = {};
        var html = "";

        try {
            tags = document.querySelectorAll("P");
        } catch (err) {
            tags = {};
        }

        for (var i = 0; i < tags.length; i++) {

            if (tags[i].innerText.trim() != "")
                html += '<tr><td>' + tags[i].innerText + '</td></tr>';
        }

        return html;
    }

    function getRawText() {

        // This function gets the raw text from the page.

        var _node, walk, s, raw, filtered, a = [];

        // Create a DOM Tree Walker
        walk = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT, null, false);

        while (_node = walk.nextNode()) {

            // Filter out script and style nodes
            if (_node.parentNode.nodeName.toString() === "SCRIPT" || _node.parentNode.nodeName.toString() === "STYLE") {
                continue;
            }

            // Replace &nbsp; with spaces
            s = _node.data.replace(/\u00a0/g, " ").trim();

            // Push the node text on to the array
            if (s.length > 0) {
                a.push(s);
            }
        }

        // Create the rawText string
        return a.join(" ").replace(/\s\s+/g, ' ').trim();

    }

    function getFilteredText(rawText) {

        return rawText.replace(/[^a-z ]/gi, " ").replace(/\s\s+/g, ' ').toLowerCase().trim();
    }

    function getPhrases(str, phraseLength, sortByWords, ascending, phraseCount) {

        // This function gets the keyword and N-word phrase counts

        function makeArray(aDictionary) {

            // This function makes a sorted array of ojects
            // EG: [{phrase: yoga london, count: 27}, {phrase: yoga ball, count: 6}]

            var fnSortByValueDesc = function(a, b) {
                // This function sorts by value desc
                return b.count - a.count;
            }

            // At this point aDictionary contains all the words/phrases in random order
            aDictionary.sort();

            // Set the last word to the first word of aDictionary
            var lastStr = aDictionary[0];

            // Vars
            var currentStr = "";
            var count = 0;
            var arr = new Array();

            // Loop through every keyword in aDictionary
            // Start at 1 because we set lastStr to first word in aDictionary
            for (i = 1; i < aDictionary.length; i++) {

                currentStr = aDictionary[i];

                count++;

                // Check to see if the word has changed
                if (currentStr !== lastStr) {

                    // Save the word/phrase and count
                    // If current word is different to the last word
                    arr.push({ phrase: lastStr, count: count });

                    // Reset Vars
                    lastStr = currentStr;
                    count = 0;
                }

            }

            // Return sorted array
            return arr.sort(fnSortByValueDesc);

        }

        var aDictionary = new Array();
        var sbPhrase = "";
        var arr = str.trim().split(" ");

        for (var i = 0; i < arr.length; i++) {

            //Start a new phrase
            sbPhrase = "";

            //Make sure there are enough words to make the phrase
            if (arr.length >= i + phraseLength) {

                //Add $phraseLength-1 words to the first word
                for (var j = 0; j < phraseLength; j++) {
                    sbPhrase += arr[i + j] + " ";
                }

                aDictionary.push(sbPhrase.trim());
            }
        }

        return JSON.stringify(makeArray(aDictionary).slice(0,phraseCount));

    }

    function getWordCount(txt) {
        try {
            return txt.split(" ").length;
        } catch (err) {
            return 0;
        }
    }

    function getCharCount(txt) {
        try {
            return txt.length;
        } catch (err) {
            return 0;
        }
    }

    console.timeEnd("timer");


}(window, document));
