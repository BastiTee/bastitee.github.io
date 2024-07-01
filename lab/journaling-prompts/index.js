(function() {
    d3.csv("prompts.csv").then(function(prompts) {
        // Pick a random prompt
        let index = Math.floor(Math.random() * prompts.length);

        // Override if there is a prompt ID in the URL
        let hash = window.location.hash;
        if (hash && hash.startsWith('#')) {
            hashInt = parseInt(hash.replace(/^#+/, ''));
            console.log(hashInt);
            if (hashInt >= 0 && hashInt < prompts.length) {
                index = hashInt;
            }
        }
        console.log(`Prompt index: ${index}`);

        // Write prompt to HTML
        document.getElementById('category').innerHTML = "<p>" + prompts[index].category + "<p>";
        document.getElementById('prompt').innerHTML = "<p>" + prompts[index].prompt + "<p>";

        // Write URL to clipboard
        new Clipboard('.clipboard');
        d3.select('#clipboard-input').attr('value', window.location.href + '#' + index);
    });
})();
