import Echo from "laravel-echo";
import { API, auth } from "../services";


window.Pusher = require('pusher-js');
declare global {
    interface Window {
        // Echo: Echo;
        Pusher: any
    }
}
export function getChannels() {
    const channels = new Echo({
        broadcaster : 'pusher',
        key         : process.env.REACT_APP_CHANNEL_KEY,
        cluster     : 'mt1',
        wsHost      : process.env.REACT_APP_CHANNEL_HOST,
        wsPort      : 6001,
        authEndpoint: API().chatAuth,
        auth: {
            headers: {
                'Authorization': "Bearer " + JSON.parse(auth!).api_token,
                'X-App-ID' : process.env.REACT_APP_CHANNEL_ID
            }
        },
        forceTLS: false
    });
    return channels;
}