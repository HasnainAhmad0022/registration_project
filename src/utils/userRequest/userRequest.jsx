import axios from "axios";
import { baseUrl, baseVercelUrl } from "../config";

const userRequest = axios.create({
    baseURL: baseVercelUrl,
    withCredentials: true,
});

export default userRequest;