const dotenv = require('dotenv');
const mongoose = require('mongoose');
const Review = require('../models/reviewModel');

dotenv.config({ path: '../.env' });

const db = process.env.DB.replace('PASSWORD', process.env.DB_PASSWORD);
mongoose.connect(db)
    .then(() => {
        console.log("DB connected");
    })

const reviews = [{
    "review": "Great, I loved how beauty changed at every twists and turns, how mighty Himalyas offers you peace in noisy flowing rivers. Really really awesome trek but guide was rude and so little informative",
    "rating": 3,
    "user": {
        "$oid": "63b4d4e0c53a2de2118efbb3"
    },
    "trek": {
        "$oid": "63a8526a68f8bd8b459d463e"
    }
}, {
    "review": "Overall its a memorable journey. Met a lot of people which are my new trek partners now. Trek was ok, management was ok and campsite location was gorgeous.",
    "rating": 5,
    "user": {
        "$oid": "63b4d4e0c53a2de2118efbb4"
    },
    "trek": {
        "$oid": "63a8526a68f8bd8b459d463e"
    }
}, {
    "review": "It was my first trek ever. Was exited & nervous. The trek is of mixed-difficulty but there are certain area's where it get quite chalenging. I am definitely doing it next year.",
    "rating": 4,
    "user": {
        "$oid": "63b4d4e0c53a2de2118efbb7"
    },
    "trek": {
        "$oid": "63a8526a68f8bd8b459d463e"
    }
}, {
    "review": "The trek was beautiful with nature at its best. It my first snow trek and it was a spellbinding experience. The best part of trek was the summit climb and the landscapes.",
    "rating": 5,
    "user": {
        "$oid": "63b4d4e0c53a2de2118efbba"
    },
    "trek": {
        "$oid": "63a8526a68f8bd8b459d463e"
    }
}, {
    "review": "It was my first trek, nor I was aware, neither guide equiped us with proper gears. I felt cold and mosquitos attacked us like crazy at the campsite. Atleast bonfire was good.",
    "rating": 2,
    "user": {
        "$oid": "63b4d4e0c53a2de2118efbbb"
    },
    "trek": {
        "$oid": "63a8526a68f8bd8b459d463e"
    }
}, {
    "review": "The trek was beautiful with nature at its best. It my first snow trek and it was a spellbinding experience. The best part of trek was the summit climb and the landscapes.",
    "rating": 5,
    "user": {
        "$oid": "63b4d4e0c53a2de2118efbba"
    },
    "trek": {
        "$oid": "63ab955c10487041c3d21780"
    }
}, {
    "review": "Great, I loved how beauty changed at every twists and turns, how mighty Himalyas offers you peace in noisy flowing rivers. Really really awesome trek but guide was rude and so little informative",
    "rating": 3,
    "user": {
        "$oid": "63b4d4e0c53a2de2118efbb3"
    },
    "trek": {
        "$oid": "63ab955c10487041c3d21780"
    }
}, {
    "review": "It was my first trek, nor I was aware, neither guide equiped us with proper gears. I felt cold and mosquitos attacked us like crazy at the campsite. Atleast bonfire was good.",
    "rating": 2,
    "user": {
        "$oid": "63b4d4e0c53a2de2118efbbb"
    },
    "trek": {
        "$oid": "63ab955c10487041c3d21780"
    }
}, {
    "review": "Overall its a memorable journey. Met a lot of people which are my new trek partners now. Trek was ok, management was ok and campsite location was gorgeous.",
    "rating": 5,
    "user": {
        "$oid": "63b4d4e0c53a2de2118efbb4"
    },
    "trek": {
        "$oid": "63ab955c10487041c3d21780"
    }
}, {
    "review": "It was my first trek ever. Was exited & nervous. The trek is of mixed-difficulty but there are certain area's where it get quite chalenging. I am definitely doing it next year.",
    "rating": 4,
    "user": {
        "$oid": "63b4d4e0c53a2de2118efbb7"
    },
    "trek": {
        "$oid": "63ab955c10487041c3d21780"
    }
}, {
    "review": "It was my first trek ever. Was exited & nervous. The trek is of mixed-difficulty but there are certain area's where it get quite chalenging. I am definitely doing it next year.",
    "rating": 4,
    "user": {
        "$oid": "63b4d4e0c53a2de2118efbb7"
    },
    "trek": {
        "$oid": "63ab961710487041c3d2179c"
    }
}, {
    "review": "It was my first trek, nor I was aware, neither guide equiped us with proper gears. I felt cold and mosquitos attacked us like crazy at the campsite. Atleast bonfire was good.",
    "rating": 2,
    "user": {
        "$oid": "63b4d4e0c53a2de2118efbbb"
    },
    "trek": {
        "$oid": "63ab961710487041c3d2179c"
    }
}, {
    "review": "The trek was beautiful with nature at its best. It my first snow trek and it was a spellbinding experience. The best part of trek was the summit climb and the landscapes.",
    "rating": 5,
    "user": {
        "$oid": "63b4d4e0c53a2de2118efbba"
    },
    "trek": {
        "$oid": "63ab961710487041c3d2179c"
    }
}, {
    "review": "Overall its a memorable journey. Met a lot of people which are my new trek partners now. Trek was ok, management was ok and campsite location was gorgeous.",
    "rating": 5,
    "user": {
        "$oid": "63b4d4e0c53a2de2118efbb4"
    },
    "trek": {
        "$oid": "63ab961710487041c3d2179c"
    }
}, {
    "review": "Great, I loved how beauty changed at every twists and turns, how mighty Himalyas offers you peace in noisy flowing rivers. Really really awesome trek but guide was rude and so little informative",
    "rating": 3,
    "user": {
        "$oid": "63b4d4e0c53a2de2118efbb3"
    },
    "trek": {
        "$oid": "63ab961710487041c3d2179c"
    }
}];

const importData = async () => {
    try {
        await Review.create(reviews);
        console.log(`Data Imported Successfully.`);
    }
    catch (err) {
        console.log(err);
    }
    process.exit();
};

const deleteData = async () => {
    try {
        await Review.deleteMany();
        console.log(`Data Deleted Successfully.`);
    }
    catch (err) {
        console.log(err);
    }
    process.exit();
}

if (process.argv[2] === '--import') {
    importData();
}
else if (process.argv[2] === '--delete') {
    deleteData();
}
