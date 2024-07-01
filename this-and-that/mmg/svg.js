(function() {

    // Prepare canvas and data
    let cv = d3wb.config()
        .attr('margin', '0 0 35 0')
        .data(['data.csv', 'images.csv'])
        .attr('bgColor', 'rgba(0, 0, 0, 0)')
        .toCanvas();

    d3.queue()
        .defer(d3.csv, cv.data[0])
        .defer(d3.csv, cv.data[1])
        .await(function(error, quotes, images) {

            let updateQuote = function() {

                // Select quote and image ID either by hash/anchor in URL
                // or randomly
                let hash = window.location.hash.substr(1)
                let rand1;
                let rand2;
                if (hash) {
                    let hsplit = hash.split(',')
                    if (hsplit.length == 2) {
                        if (hsplit[0].startsWith('q=')) {
                            rand1 = +hsplit[0].replace(/q=/, '')
                        }
                        if (hsplit[1].startsWith('i=')) {
                            rand2 = +hsplit[1].replace(/i=/, '')
                        }
                    } else {
                        console.log('Unusable hash. Needs to be q=1,i=10');
                    }
                }
                rand1 = rand1 !== undefined ? rand1 :
                    Math.floor(Math.random() * quotes.length);
                rand2 = rand2 !== undefined ? rand2 :
                    Math.floor(Math.random() * images.length);

                // Pick quote and image from dataset
                let quote = quotes[rand1].quote;
                let author = quotes[rand1].author;
                let image = images[rand2].images;

                // Setup the clipboard button
                new Clipboard('.clipboard');
                d3.select('#clipboard-input').attr('value',
                    window.location.href +
                    '#q=' + rand1 + ',i=' + rand2);

                // Inject the new background image
                d3wb.util.injectCSS(`
                #standalone-body {
                    background-image: url("` +
                    image + `?q=80&fit=crop&h=` + cv.hei + `&w=` + cv.wid + `");
                         -webkit-background-size: cover;
                         -moz-background-size: cover;
                         -o-background-size: cover;
                         background-size: cover;
                    }
                `)

                // Split quote into lines
                quote = breakdownQuote(quote);
                quote = quote + '§– ' + author
                quote = quote.replace(/§+/g, '\n')

                // Draw a new quote
                cv.selectAll('.wb-textbox').remove()
                let tb = d3wb.add.textBox(quote)
                    .x(cv.wid / 2 - cv.wid / 4)
                    .y(10 * 2)
                    .width(cv.width / 2)
                    .height(cv.height - 10 * 4)
                    .padding(10)
                    .borderRadius(10)
                    .backgroundColor('rgba(0, 0, 0, 0.55)')
                    .adjustBackgroundHeight(true)
                cv.call(tb)
            }
            updateQuote()

        });

    let breakdownQuote = function(quote) {
        let SUB_WIDTH = 5;
        quoteSplit = quote.split('§')
        quoteBroken = []
        for (let qs in quoteSplit) {
            let sq = quoteSplit[qs];
            if (sq.length == 0) {
                continue;
            }
            let sqSp = sq.split(' ');
            let splits = 0;
            let lens;
            while (true) {
                splits++;
                lens = sqSp.length / splits
                if (lens <= SUB_WIDTH) {
                    break;
                }
            };

            let sqLen = sqSp.length / lens;
            for (let i = 0; i < sqLen; i++) {
                quoteBroken.push(sqSp.slice(
                    i * lens,
                    i * lens + lens).join(' ').trim());
            }
        }
        return quoteBroken.join('§')
    }

})();
