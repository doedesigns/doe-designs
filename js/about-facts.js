document.addEventListener("DOMContentLoaded", () => {

    const secretFacts =
        document.querySelector(".secret-facts");

    if (!secretFacts) {
        return;
    }

    const item =
        secretFacts.querySelector(".secret-fact-item");

    const number =
        secretFacts.querySelector(".secret-fact-number");

    const text =
        secretFacts.querySelector(".secret-fact-text");


    // ============================================
    // SECRET FACTS
    // ============================================

    const facts = [

        "I originally intended to be a music performance and opera major before switching to history, criminal justice, and pre-law. Because...reading :-)",

        "I have two rescue dogs named Cap’t Bexley and Judge Harley. They like treats and hiking. Squirrels not so much.",

        "I started playing video games after working for MTV before law school. (Check me out in the credits for RockBand 2 and 3!) I’ve never looked back, ...which is a detriment in some rpg games.",

        "I play classical guitar but not well.",

        "I can sing at least one song from every animated Disney movie. Most of the time it’s recognizable.",

        "My favorite book series is the Shadowhunter Chronicles by Cassandra Clare. Also love the work of V. E. Schwab-I want a coat like Kell.",

        "Instead of law school, I almost went for a Ph.D. in Egyptology. Joke’s on me, though—graphic design is where it’s at! ...Only took me a couple decades to figure it out.",

        "I marked my territory in all 50 states before I turned 30.",

        "Typically I read between 3–5 books a week. ...“Reading” also loosely includes audiobooks. Convince me otherwise.",

        "I taught myself to tile, designed the patterns, and installed it all myself throughout my home—including a master bath that may have gotten a little carried away with tile. But I give myself a 5 star review.",

        "I played varsity softball and basketball in college, but now my body won’t support that.",

        "I am terrible at yard work, to my neighbors’ chagrin.",

        "I grew up with two rotary phones in the house. I’m not sure I would know how to use them now.",

        "My favorite movies are Kill Bill 1 & 2.",

        "My favorite graphic design experience is TeamLab Borderless in Tokyo.",

        "I have visited 23 countries. Hopefully, none of them remember my escapades too well.",

        "I don’t have any TV subscriptions—no Netflix, Hulu, Disney+, etc.—and only occasionally watch movies. So don’t pop-culture-reference me unless you want to be disappointed. ",

        "I am abnormally good at word searches.",

        "When I have free weekends, I love taking the dogs hiking. Unless it’s raining, then we cuddle in a grumpy puppy puddle looking out the window at the rain.",

        "My dad and I create cigar box guitars out of actual cigar boxes.",

        "I love being on or in the water. So does my aptly named dog, Cap’t Bexley.",

        "My happy place is playing volleyball. Anywhere, anytime.",

        "I have two wonderfully super cute, wild, amazing, silly willy nephews with another on the way!",

        "Sushi is my favorite! Hold the cream cheese, you monster.",

        "I hope to create a complex board game someday with a fantastical storyline and battles… and reviving… because dying mid-campaign sucks.",

        "I don’t like coffee or chocolate. You are mistaken, it’s not weird… and think of how much money I save!",

        "I try not to judge people…so I taught my dog, Judge Harley, how to do it. (Will send adorable pictures upon request.)",

        "My mom is a fabulous quilter and I get to “test” them out, so I have over 20 quilts of various sizes and styles in the house. I basically live in a blanket house.",

        "My (still functional!) microwave was bought at Target in 2006 for around $20.",

        "I’m a terrible cook. Seriously, I should have a comedic YouTube channel where I attempt simple things. It’d be a hit and I would burn water."

    ];


  // ============================================
    // RANDOMIZED FACT DECK
    // ============================================

    let factDeck = [];
    let lastFactIndex = -1;


    function shuffleFacts(){

        factDeck = [];

        for (let i = 0; i < facts.length; i++){
            factDeck.push(i);
        }


        // Fisher-Yates shuffle

        for (
            let i = factDeck.length - 1;
            i > 0;
            i--
        ){

            const j =
                Math.floor(
                    Math.random() * (i + 1)
                );

            [
                factDeck[i],
                factDeck[j]
            ] = [
                factDeck[j],
                factDeck[i]
            ];

        }


        // Prevent the first fact of a new deck
        // from being the same as the last fact
        // of the previous deck.

        if (
            factDeck.length > 1 &&
            factDeck[0] === lastFactIndex
        ){

            [
                factDeck[0],
                factDeck[1]
            ] = [
                factDeck[1],
                factDeck[0]
            ];

        }

    }


    function getNextFact(){

        // Create a new shuffled deck when
        // the current deck is empty.

        if (factDeck.length === 0){
            shuffleFacts();
        }


        // Take the next fact from the deck.

        const nextIndex =
            factDeck.shift();

        lastFactIndex =
            nextIndex;

        return nextIndex;

    }


    // ============================================
    // LOAD FACT
    // ============================================

    function loadFact(index){

        number.textContent =
            `#${String(index + 1).padStart(2, "0")}`;

        text.textContent =
            facts[index];

    }


    // ============================================
    // INITIAL FACT
    //
    // The deck is randomized immediately.
    // ============================================

    const firstIndex =
        getNextFact();

    loadFact(firstIndex);


    // ============================================
    // REDUCED MOTION
    // ============================================

    const prefersReducedMotion =
        window.matchMedia(
            "(prefers-reduced-motion: reduce)"
        ).matches;


    if (prefersReducedMotion){

        item.style.transform =
            "translateY(0)";

        setInterval(() => {

            const nextIndex =
                getNextFact();

            loadFact(nextIndex);

        }, 8000);

        return;

    }


    // ============================================
    // ENTER FIRST FACT
    // ============================================

    requestAnimationFrame(() => {

        item.classList.add(
            "fact-enter"
        );

    });


    // ============================================
    // ROTATE FACTS
    // ============================================

    const displayTime =
        8000;

    const animationTime =
        750;


    setTimeout(() => {

        rotateFact();

    }, displayTime + animationTime);


    function rotateFact(){

        // ----------------------------------------
        // Slide current fact down and out.
        // ----------------------------------------

        item.classList.remove(
            "fact-enter"
        );

        item.classList.add(
            "fact-exit"
        );


        setTimeout(() => {

            // ------------------------------------
            // Choose next fact from shuffled deck.
            // ------------------------------------

            const nextIndex =
                getNextFact();

            loadFact(nextIndex);


            // ------------------------------------
            // Reset position above viewport.
            // ------------------------------------

            item.classList.remove(
                "fact-exit"
            );


            void item.offsetWidth;


            // ------------------------------------
            // Slide new fact down into view.
            // ------------------------------------

            item.classList.add(
                "fact-enter"
            );


            // ------------------------------------
            // Hold new fact, then repeat.
            // ------------------------------------

            setTimeout(() => {

                rotateFact();

            }, displayTime + animationTime);

        }, animationTime);

    }

});