const mongoose=require("mongoose")

const dbURL = "mongodb+srv://pranav:Quf3N27iR5s9qKpX@atlascluster.qu7wk2l.mongodb.net/?retryWrites=true&w=majority";
const connectionParams = {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    dbName: 'codiis-db'
}

mongoose.connect(dbURL, connectionParams)
.then(()=>{
    console.info("mongodb connected");
})
.catch(()=>{
    console.info('failed');
})


const newSchema=new mongoose.Schema({
    email:{
        type: String,
        required: true
    },
    password:{
        type: String,
        required: true
    },
    role:{
        type: String,
        required: true
    },
})

const collection = mongoose.model("users",newSchema)

module.exports=collection