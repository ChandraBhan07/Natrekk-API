const dotenv = require('dotenv');
const mongoose = require('mongoose');
const Trek = require('../models/trekModel');

dotenv.config({ path: '../.env' });

const db = process.env.DB.replace('PASSWORD', process.env.DB_PASSWORD);
mongoose.connect(db)
    .then(() => {
        console.log("DB connected");
    })

const treks = [{
    "name": "Hampta Pass",
    "duration": 5,
    "difficulty": "medium",
    "maxGroupSize": 10,
    "ratingsAverage": 3.8,
    "ratingsQuantity": 5,
    "price": 7499,
    "summary": "This trek provides opportunities to witness so varied and magnificent Himalayan regions.",
    "description": "Starting from the village Hampta in the Kullu Valley and finishing at Chatru in the Lahaul & Spiti Valley, this trek is around 35 km. The duration is about 4 to 5 days, with the highest altitude being 4400 m or 14435 feet. The trek offers a great opportunity to experience a lot many changing landscapes over a short duration. You walk past snow-covered valleys, dense deodar forests, floral meadows, crystal clear water streams, Himalayan avifauna, and finally end it by walking through the barren lands of Lahaul-Spiti. The trek concludes near the beautiful Chandratal Lake (the moon lake) in Lahul and Spiti.",
    "imageCover": "trek-63a8526a68f8bd8b459d463e-1672418847327-cover.jpeg",
    "images": [
        "trek-63a8526a68f8bd8b459d463e-1672419022014-1.jpeg",
        "trek-63a8526a68f8bd8b459d463e-1672419022015-2.jpeg",
        "trek-63a8526a68f8bd8b459d463e-1672419022015-3.jpeg"
    ],
    "startDates": [
        {
            "$date": {
                "$numberLong": "1688725800000"
            }
        },
        {
            "$date": {
                "$numberLong": "1692527400000"
            }
        },
        {
            "$date": {
                "$numberLong": "1693564200000"
            }
        }
    ],
    "startLocation": {
        "description": "Sethan Village, near Manali, HP",
        "type": "Point",
        "coordinates": [
            77.22615058230866,
            32.236788271725295
        ],
        "address": "Sethan, Himachal Pradesh, India"
    },
    "guides": [
        {
            "$oid": "63b4d4e0c53a2de2118efbbf"
        },
        {
            "$oid": "63b4d4e0c53a2de2118efbc3"
        },
        {
            "$oid": "63b4d4e0c53a2de2118efbc5"
        }
    ],
    "locations": [
        {
            "type": "Point",
            "coordinates": [
                77.261701,
                32.26622
            ],
            "description": "Chika Campsite",
            "day": 1,
            "_id": {
                "$oid": "63ab741df38bf42b24d8c229"
            }
        },
        {
            "type": "Point",
            "coordinates": [
                77.2920405234075,
                32.27776622076398
            ],
            "description": "Balu Ka Ghera Campsite",
            "day": 2,
            "_id": {
                "$oid": "63ab741df38bf42b24d8c22a"
            }
        },
        {
            "type": "Point",
            "coordinates": [
                77.3523491060416,
                32.27163164223357
            ],
            "description": "Shea Goru",
            "day": 3,
            "_id": {
                "$oid": "63ab741df38bf42b24d8c22b"
            }
        },
        {
            "type": "Point",
            "coordinates": [
                77.3838432650195,
                32.32046917759036
            ],
            "description": "Chhatru Campsite",
            "day": 4,
            "_id": {
                "$oid": "63ab741df38bf42b24d8c22c"
            }
        },
        {
            "type": "Point",
            "coordinates": [
                77.18986556956234,
                32.24498448955738
            ],
            "description": "Manali",
            "day": 5,
            "_id": {
                "$oid": "63ab741df38bf42b24d8c22d"
            }
        }
    ],
    "slug": "hampta-pass"
}, {
    "name": "Beas Kund",
    "duration": 4,
    "difficulty": "easy",
    "maxGroupSize": 8,
    "ratingsAverage": 4.5,
    "ratingsQuantity": 0,
    "price": 4499,
    "summary": "Soothe your senses with the views of the picturesque lake through which the river Beas emerges.",
    "description": "Lush green grasslands flourish below the summits of the three biggest mountains around Manali. And hidden in these grasslands is the emerald lake out of which the river Beas emerges. The contrasting sight of this serene water body nestled in between jagged mountain peaks of the Pir Panjal range adds to the beauty of this trek. This summer trek is a perfect choice for the beginners because of its short duration and easy difficulty level. Besides, you can treat your eyes with the rare glimpses of Mt Indrasen, Deo Tibba, and more such peaks from the Pir Panjal range, if you are fortunate enough. Enjoy a delightful camping session during the thrilling trekking expedition, when you spend the chilly night stargazing at the vast expanse of star-studded night skies in your tent.",
    "imageCover": "trek-63ab955c10487041c3d21780-1672800318270-cover.jpeg",
    "images": [
        "trek-63ab955c10487041c3d21780-1672800318483-3.jpeg",
        "trek-63ab955c10487041c3d21780-1672800318482-1.jpeg",
        "trek-63ab955c10487041c3d21780-1672800318482-2.jpeg"
    ],
    "startDates": [
        {
            "$date": {
                "$numberLong": "1687422600000"
            }
        },
        {
            "$date": {
                "$numberLong": "1689409800000"
            }
        },
        {
            "$date": {
                "$numberLong": "1691224200000"
            }
        }
    ],
    "startLocation": {
        "type": "Point",
        "coordinates": [
            77.15835895486495,
            32.31558970883077
        ],
        "address": "Solang Valley, Manali, Himachal Pradesh, India",
        "description": "Solang Valey, Manali, HP"
    },
    "locations": [
        {
            "type": "Point",
            "coordinates": [
                77.12635104009676,
                32.35438864771736
            ],
            "description": "Dhundi Campsite",
            "day": 1,
            "_id": {
                "$oid": "63ab955c10487041c3d21781"
            }
        },
        {
            "type": "Point",
            "coordinates": [
                77.09572119208678,
                32.35269434881254
            ],
            "description": "Bakarthach Campsite",
            "day": 2,
            "_id": {
                "$oid": "63ab955c10487041c3d21782"
            }
        },
        {
            "type": "Point",
            "coordinates": [
                77.08588899092025,
                32.36728981701965
            ],
            "description": "Beas Kund Base Camp",
            "day": 3,
            "_id": {
                "$oid": "63ab955c10487041c3d21783"
            }
        },
        {
            "type": "Point",
            "coordinates": [
                77.12635104009676,
                32.35438864771736
            ],
            "description": "Dhundi Campsite",
            "day": 4,
            "_id": {
                "$oid": "63ab955c10487041c3d21784"
            }
        }
    ],
    "guides": [
        {
            "$oid": "63b4d4e0c53a2de2118efbc1"
        },
        {
            "$oid": "63b4d4e0c53a2de2118efbc3"
        },
        {
            "$oid": "63b4d4e0c53a2de2118efbc7"
        }
    ],
    "slug": "beas-kund"
}, {
    "name": "Chadar",
    "duration": 8,
    "difficulty": "difficult",
    "maxGroupSize": 15,
    "ratingsAverage": 4.5,
    "ratingsQuantity": 0,
    "price": 17999,
    "summary": "A walk on a frozen glass-like river with dramatic mountains on either side is an experience of a lifetime.",
    "description": "It’s thrilling! It’s intriguing! It’s challenging! It’s unpredictable! And what’s better is it packs a whole lot of surprises to uncover each day. Chadar which literally means ‘a blanket’ very accurately describes this trek which is literally a walk on a thick sheet of ice formed over the tantalizing blue of Zanskar River. It is as magical as it sounds, and no, it is not easy! to adapt to the extreme temperature which drops to as low as -30 degrees. With no sense of constancy, the landscape changes with a blink of an eye - its like being teleported to a strange land which teaches a whole different way of living.",
    "imageCover": "trek-63ab961710487041c3d2179c-1672799228706-cover.jpeg",
    "images": [
        "trek-63ab961710487041c3d2179c-1672799228826-3.jpeg",
        "trek-63ab961710487041c3d2179c-1672799228826-2.jpeg",
        "trek-63ab961710487041c3d2179c-1672799228825-1.jpeg"
    ],
    "startDates": [
        {
            "$date": {
                "$numberLong": "1673002800000"
            }
        },
        {
            "$date": {
                "$numberLong": "1674212400000"
            }
        },
        {
            "$date": {
                "$numberLong": "1675594800000"
            }
        }
    ],
    "startLocation": {
        "type": "Point",
        "coordinates": [
            77.22339419916845,
            35.20365612831042
        ],
        "address": "Leh Base Camp, Leh, Ladakh",
        "description": "Base Camp, Leh, Ladakh"
    },
    "locations": [
        {
            "type": "Point",
            "coordinates": [
                77.22339419916845,
                35.20365612831042
            ],
            "description": "Leh Base Camp",
            "day": 1,
            "_id": {
                "$oid": "63ab961710487041c3d2179d"
            }
        },
        {
            "type": "Point",
            "coordinates": [
                77.09651515664349,
                33.91258697698345
            ],
            "description": "Gyalpo Campsite",
            "day": 4,
            "_id": {
                "$oid": "63ab961710487041c3d2179e"
            }
        },
        {
            "type": "Point",
            "coordinates": [
                77.030800612181,
                33.91255849746353
            ],
            "description": "Tibb Cave Campsite",
            "day": 5,
            "_id": {
                "$oid": "63ab961710487041c3d2179f"
            }
        },
        {
            "type": "Point",
            "coordinates": [
                76.92565310504462,
                33.87831525870867
            ],
            "description": "Nerak Campsite",
            "day": 6,
            "_id": {
                "$oid": "63ab961710487041c3d217a0"
            }
        },
        {
            "type": "Point",
            "coordinates": [
                77.110883,
                33.908279
            ],
            "description": "Shingra Koma",
            "day": 8,
            "_id": {
                "$oid": "63ab961710487041c3d217a1"
            }
        }
    ],
    "guides": [
        {
            "$oid": "63b4d4e0c53a2de2118efbc2"
        },
        {
            "$oid": "63b4d4e0c53a2de2118efbc5"
        },
        {
            "$oid": "63b4d4e0c53a2de2118efbc4"
        }
    ],
    "slug": "chadar"
}];

const importData = async () => {
    try {
        await Trek.create(treks);
        console.log(`Data Imported Successfully.`);
    }
    catch (err) {
        console.log(err);
    }
    process.exit();
};

const deleteData = async () => {
    try {
        await Trek.deleteMany();
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
