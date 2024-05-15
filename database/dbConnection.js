import mongoose from 'mongoose'

const dbConnection = () => {
    mongoose.connect(process.env.MONGO_URL, {
        dbName: 'MERN_STACK_JOB_SEEKING'
    }).then(() => {
        console.log('connected to database')
    }).catch((err) => {
        console.log(`some error occured while connecting to database :  ${err}`)
    })
}

export default dbConnection