const dotenv = require('dotenv');
const mongoose = require('mongoose');
const User = require('../models/userModel');

dotenv.config({ path: '../.env' });

const db = process.env.DB.replace('PASSWORD', process.env.DB_PASSWORD);
mongoose.connect(db)
    .then(() => {
        console.log("DB connected");
    })

const users = [
    {
        name: "Admin",
        email: "admin@email.com",
        password: 123456,
        passwordConfirm: 123456,
        role: "admin"
    },
    {
        name: "Saket Jha",
        email: "saket@mailsac.com",
        password: 123456,
        passwordConfirm: 123456,
        role: "user"
    },
    {
        name: "Sourabh Shrivastav",
        email: "sourabh@mailsac.com",
        password: 123456,
        passwordConfirm: 123456,
        role: "user"
    },
    {
        name: "Kritika Tyagi",
        email: "kritika@mailsac.com",
        password: 123456,
        passwordConfirm: 123456,
        role: "user"
    },
    {
        name: "Aarav Sharma",
        email: "aarav@mailsac.com",
        password: 123456,
        passwordConfirm: 123456
    },
    {
        name: "Vihaan Choudary",
        email: "vihaan@mailsac.com",
        password: 123456,
        passwordConfirm: 123456
    },
    {
        name: "Ananya Banerjee",
        email: "ananya@mailsac.com",
        password: 123456,
        passwordConfirm: 123456
    },
    {
        name: "Diya Jain",
        email: "diya@mailsac.com",
        password: 123456,
        passwordConfirm: 123456
    },
    {
        name: "Kabir Verma",
        email: "kabir@mailsac.com",
        password: 123456,
        passwordConfirm: 123456
    },
    {
        name: "Iraa Khanna",
        email: "iraa@mailsac.com",
        password: 123456,
        passwordConfirm: 123456
    },
    {
        name: "Navya Kapoor",
        email: "navya@mailsac.com",
        password: 123456,
        passwordConfirm: 123456
    },
    {
        name: "Aditya Khatri",
        email: "aditya@mailsac.com",
        password: 123456,
        passwordConfirm: 123456
    },
    {
        name: "Arjun Dubey",
        email: "arjun@mailsac.com",
        password: 123456,
        passwordConfirm: 123456
    },
    {
        name: "Shaurya Das",
        email: "shaurya@mailsac.com",
        password: 123456,
        passwordConfirm: 123456
    },
    {
        name: "Anjali Thakur",
        email: "anjali@mailsac.com",
        password: 123456,
        passwordConfirm: 123456
    },
    {
        name: "Nidhi Apte",
        email: "nidhi@mailsac.com",
        password: 123456,
        passwordConfirm: 123456,
        role: "lead-guide"
    },
    {
        name: "Dhruv Mehta",
        email: "dhruv@mailsac.com",
        password: 123456,
        passwordConfirm: 123456
    },
    {
        name: "Priyanka Verma",
        email: "priyanka@mailsac.com",
        password: 123456,
        passwordConfirm: 123456,
        role: "lead-guide"
    },
    {
        name: "Himanshi Tanwar",
        email: "himanshi@mailsac.com",
        password: 123456,
        passwordConfirm: 123456,
        role: "lead-guide"
    }, {
        name: "Anand Mishra",
        email: "anand@mailsac.com",
        password: 123456,
        passwordConfirm: 123456,
        role: "guide"
    },
    {
        name: "Rohit Jain",
        email: "rohit@mailsac.com",
        password: 123456,
        passwordConfirm: 123456,
        role: "guide"
    },
    {
        name: "Hemant Gupta",
        email: "hemant@mailsac.com",
        password: 123456,
        passwordConfirm: 123456,
        role: "guide"
    },
    {
        name: "Bhuvan Jain",
        email: "aditi@mailsac.com",
        password: 123456,
        passwordConfirm: 123456,
        role: "guide"
    },
    {
        name: "Deepesh Ghandi",
        email: "deepesh@mailsac.com",
        password: 123456,
        passwordConfirm: 123456,
        role: "guide"
    }

];

const importData = async () => {
    try {
        await User.create(users, { validateBeforeSave: false });
        console.log(`Data Imported Successfully.`);
    }
    catch (err) {
        console.log(err);
    }
    process.exit();
};

const deleteData = async () => {
    try {
        await User.deleteMany();
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
