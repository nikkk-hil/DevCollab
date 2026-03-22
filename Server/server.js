import express from 'express'
import cors from 'cors'

const app = express();
const port = 8000;

const corsOption = {
    origin: 'http://localhost:5173'
}

app.use(cors(corsOption));
app.use(express.json());

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
})