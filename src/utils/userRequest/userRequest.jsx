import axios from "axios";
import { baseUrl, baseVercelUrl } from "../config";

const userRequest = axios.create({
    baseURL: baseUrl,
    withCredentials: true,
});

export default userRequest;