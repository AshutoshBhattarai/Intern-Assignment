import dbConfig from "./config";
const connection = async()=>{
    try {
        await dbConfig.initialize();
        console.log("Database is connected !!");
    } catch (error) {
        console.error("Database connection error !!");
        console.error(error);
    }
}
export default connection;