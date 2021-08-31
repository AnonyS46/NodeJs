const mongoose = require('mongoose');

async function connect() {
    try {
        await mongoose.connect('mongodb://localhost:27017/f8_Nodejs',{
            useNewUrlParser: true,
            useUnifiedTopology: true,
            //useCreateIndex: true,
        });
        console.log('Database connected!!!')
    } catch (error) {
        console.log({error})
    }
}

module.exports ={connect}