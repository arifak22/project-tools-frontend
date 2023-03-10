import qs from "qs";


export const debug = true


export function ServerUrl(url: string){
    if(debug){
        return process.env.REACT_APP_DEBUG_URL + '/' + url;
    }else{
        return process.env.REACT_APP_PROD_URL + '/' +url;
    }
}

export function params(param: any){
    return qs.stringify(param);
}
export const auth =  window.localStorage.getItem('kt-auth-react-v') ? window.localStorage.getItem('kt-auth-react-v') : "{}";

export function header(jwt: string, content='application/x-www-form-urlencoded', responseType = 'json'){
    return {
            headers:{
                'Content-Type': `${content}`,
                'Authorization': `Bearer ${jwt}`,
            },
            responseType: responseType,
        }
}

export function API() {
    return {
        getMyGroup         : ServerUrl('card/my-group'),
        postCard           : ServerUrl('card/insert'),
        getCardDetail      : ServerUrl('card/detail'),
        getCardNotification: ServerUrl('card/notification'),
        getCardMember      : ServerUrl('card/member'),
        postCardMember     : ServerUrl('card/member'),

        getActivity: ServerUrl('card/activity'),


        getUserMember: ServerUrl('user/member'),


        getMessageGroup: ServerUrl('chat/message-group'),
        postMessageGroup: ServerUrl('chat/message-group'),

        getDownloadFile: ServerUrl('card/file-download'),
        postUploadFile : ServerUrl('card/upload-file'),
        chatAuth       : ServerUrl('chat/auth'),

        postBlastCreate : ServerUrl('blast/create'),
        postBlastRemove : ServerUrl('blast/remove'),
        postBlastComment: ServerUrl('blast/comment'),
        getBlastComment : ServerUrl('blast/comment-list'),
        getBlastList    : ServerUrl('blast/list'),
        getBlastDetail  : ServerUrl('blast/detail'),
        getUserBlast    : ServerUrl('user/member-blast'),


        postScheduleCreate: ServerUrl('schedule/create'),
        getUserSchedule   : ServerUrl('user/member-schedule'),
        getScheduleList   : ServerUrl('schedule/list'),

        getScheduleDetail  : ServerUrl('schedule/detail'),
        postScheduleRemove : ServerUrl('schedule/remove'),
        postScheduleComment: ServerUrl('schedule/comment'),
        getScheduleComment : ServerUrl('schedule/comment-list'),

        getAllNotification  : ServerUrl('card/all-notification'),
        postNotificationRead: ServerUrl('card/notification-read'),






    }
}