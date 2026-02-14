import { connectDB } from "./src/config/database";
import app from "./src/app";
import {createServer} from "http"
import { initializeSocket } from "./src/utils/socket";

const PORT = process.env.PORT || 3000
const httpsServer = createServer(app)

initializeSocket(httpsServer)

connectDB().then(() => {
    httpsServer.listen(PORT, () => {
        console.log(`✅ Server is up and running on PORT: ${PORT}`);  
    })
}).catch((error) => {
    console.error("❌ Failed to start server", error);
    process.exit(1)
})