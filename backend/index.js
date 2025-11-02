import {app} from './app.js'
import dotenv from 'dotenv'
import connectDB from './src/db/index.js'


dotenv.config(({
    path : './env'
}))


connectDB()
.then(()=>{
    app.on('Error', (error)=>{
         console.log(error)
         throw error
    })

    app.listen(process.env.PORT, (req, res)=>{
         console.log('Server is up and running.'); 
    })
})
.catch((error)=>{
    console.log(error)
})

