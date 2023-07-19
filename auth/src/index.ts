import mongoose from 'mongoose'
import app from './app';

const PORT = process.env.PORT || 4000;

const startService = async () => {
    try {
        await mongoose.connect('mongodb://auth-mongo-srv:27017/auth').then(() => { console.log('connected to db') })
    }
    catch (err) {
        console.log(err);
    }

    app.listen(PORT, () => {
        console.log(`🖥️ is running on port ${PORT}!`)
    })

}

startService()