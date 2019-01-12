const mongoose = require('mongoose')

const conn = () => {
    mongoose.connect('mongodb://localhost/aimepic');
    const db = mongoose.connection;
    db.on('error', console.error.bind(console, 'connection error:'));
    db.once('open', function() {
        console.log('db connection success!')
    });
}
module.exports = {
    conn: conn
}