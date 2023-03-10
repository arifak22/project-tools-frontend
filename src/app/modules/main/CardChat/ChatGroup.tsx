/* eslint-disable jsx-a11y/anchor-is-valid */
import {FC, useEffect, useState, useRef} from 'react'
import ProgressBar from 'react-bootstrap/ProgressBar';
import clsx from 'clsx'
// import { UserInfoModel } from '../../../../_metronic/helpers'
// import { v4 as uuidv4 } from "uuid";
import {
  toAbsoluteUrl,
} from '../../../../_metronic/helpers'
import axios from 'axios'
import { API, auth } from '../../../services'
import Echo from 'laravel-echo'
import { ButtonSubmit, RoundImage, useWindowDimensions } from '../../../helper/component'
import ChunkedUploady, { useItemProgressListener } from '@rpldy/chunked-uploady'
import {asUploadButton} from "@rpldy/upload-button";
// import { Mention, MentionsInput } from "react-mentions";
import { MentionsInput, Mention } from 'react-mentions';
import classNames from './example.module.css'
import { getChannels } from '../../../helper/channel';
import { dateFromNow } from '../../../helper/tool';
const FileDownload = require('js-file-download');


const ChatGroup: FC<any> = ({id, users}) => {
  const [isLoading, setIsLoading]       = useState<boolean>(false);
  const [message, setMessage]           = useState<string>('')
  const [messages, setMessages]         = useState<any>([])
  const { height }                      = useWindowDimensions();
  const messagesEndRef                  = useRef<null | HTMLDivElement>(null);
  const chatDiv                         = useRef<null | HTMLDivElement>(null);
  const [progress, setProgress]         = useState(0);
  const [isDownload, setIsDownload]     = useState<any>([]);
  const [lastDate, setLastDate]         = useState('');
  const [isScroll, setIsScroll]         = useState(true);
  const [chatLoading, isChatLoading]    = useState(true);
  const [lastChat, setLastChat]         = useState(false);
  const [scrollHeight, setScrollHeight] = useState(0);
  const [channels, setChannels]         = useState<any>(undefined);
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }
  const sendMessage = () => {
    if(message!==''){
    setIsLoading(true);
    axios.post(API().postMessageGroup, {card_id: id, message: message})
      .then((response) => {
          setMessage('');
          setIsLoading(false);
      })
      .catch((error) => {
        setIsLoading(false);
      });
    }
  }

  const getMessage = async () =>{
    isChatLoading(true);
    await axios.get(API().getMessageGroup + '?id=' + id + '&last_date=' +lastDate)
      .then(async (response) => {
        console.log('message');
          let res = response.data;
          // setMessages(res.chat_list);
          if(res.last_date !== 'last'){
            if(messages.length > 0){
              setMessages((messages:any) => [...res.chat_list,...messages]);
              setIsScroll(false);
            }else{
              setMessages(res.chat_list);
              setIsScroll(true);
            }
            setLastDate(res.last_date);
          }else{
            setLastChat(true);
          }
          isChatLoading(false);
          return true;
      })
      .catch((error) => {
        setMessages([]);
      });
  }

  useEffect(() => {
    getMessage(); // this will fire only on first render
    console.log('member',users);
  },[]);

  useEffect(() => {
    const channels = getChannels();
    setChannels(channels);
    channels.join(`group_chat.${id}`)
      .here((users: any) => {
        console.log('here', users);
      })
      .joining((user: any) => {
        console.log('join',user);
      })
      .leaving((user: any) => {
        console.log('leave',user);
      })
      .listen('GroupChatMessage', (e:any) => {
        setMessages((messages:any) => [...messages,e.message] );
        setIsScroll(true);
      })
      .error((error: any) => {
        console.log('error', error);
      });
      return () => {
        // disconnect from server and reset the channels
        channels.disconnect();
        setChannels(undefined);
      }
  }, []);


  useEffect(() => {
    if(isScroll){
      scrollToBottom();
    }

  },[isScroll, messages]);




  const DivUploadButton = asUploadButton((props:any) => {
    return <button
    {...props} 
    className='btn btn-sm btn-icon btn-active-light-primary me-1'
    type='button'
    data-bs-toggle='tooltip'
    title='Upload Lampiran'
  >
    <i className='bi bi-paperclip fs-3'></i>
  </button>
});
const LogProgress = () => {
  useItemProgressListener((item) => {
    setProgress(item.completed === 100 ? 0 : item.completed);
  });

  return null;
}
const downloadFile = (card_chat_id:any, filename:any) =>{
  setIsDownload((isDownload:any)=> [...isDownload, card_chat_id]);
  axios({
    url: API().getDownloadFile + '?modul=chat&id=' + card_chat_id,
    method: 'GET',
    responseType: 'blob', // Important
  }).then((response) => {
      FileDownload(response.data, filename);
      setIsDownload((isDownload:any)=> [isDownload.slice(card_chat_id)]);
  });
}


  const  handleScroll = async (e : any) => {
    if (chatDiv.current) {
      const { scrollTop, scrollHeight } = chatDiv.current;
      if (scrollTop===0) {
        const pastScroll = scrollHeight
        setScrollHeight(pastScroll);
        await getMessage();
      }
    }
 }
  const updateScroll = async() =>{
    if (chatDiv.current) {
      const currentScroll = (chatDiv.current.scrollHeight-scrollHeight) 
      chatDiv.current.scrollTo(0, currentScroll);
    }
  }
  
  useEffect(() => {
    if(!isScroll){
      updateScroll();
    }
  },[messages, isScroll]);
  return (
    <div
      className='card-body'
     
    >
      <div
        className={clsx('scroll-y me-n5 pe-5')}
        onScroll={handleScroll}
        style={{height:`${height-420}px`}}
        ref={chatDiv}
      >
        {chatLoading?
        <div style={{
            display        : 'flex',
            justifyContent : 'center',
            alignItems     : 'center',
            top            : 0,
            left           : 0,
        }}>
          <span className='indicator-progress' style={{display: 'block'}}>
          Please wait...
          <span className='spinner-border spinner-border-sm align-middle ms-2'></span>
          </span>
        </div>
        : <></>}
        {lastChat?
        <div style={{
            display        : 'flex',
            justifyContent : 'center',
            alignItems     : 'center',
            top            : 0,
            left           : 0,
        }}>
          That's all, folks! 🥳
        </div>
        : <></>}

        {messages ? messages.map((message:any, index:any) => {

          // const userInfo = userInfos[message.created_by]
          // const userInfo = users.find((el: any) => el.user_id === message.created_by);
          const state = message.created_by != JSON.parse(auth!).user_id ? 'info' : 'primary'
          const templateAttr = {}
          if (message.template) {
            Object.defineProperty(templateAttr, 'data-kt-element', {
              value: `template-${message.type}`,
            })
          }
          const contentClass = `'d-flex'} justify-content-${
            message.created_by != JSON.parse(auth!).user_id ? 'start' : 'end'
          } mb-10`
          return (
            <div
              key={`message${index}`}
              className={clsx('d-flex', contentClass, 'mb-10', {'d-none': message.template})}
              {...templateAttr}
            >
              <div
                className={clsx(
                  'd-flex flex-column align-items',
                  `align-items-${message.created_by != JSON.parse(auth!).user_id ? 'start' : 'end'}`
                )}
              >
                <div className='d-flex align-items-center mb-2'>
                  {message.created_by != JSON.parse(auth!).user_id ? (
                    <>
                      {/* <div className='symbol  symbol-35px symbol-circle '>
                        <img alt='Pic' src={toAbsoluteUrl(`/media/${userInfo.avatar}`)} />
                      </div> */}
                      <RoundImage user={message} overlay={false}/>
                      <div className='ms-3'>
                        <a
                          href='#'
                          className='fs-5 fw-bolder text-gray-900 text-hover-primary me-1'
                        >
                          {message.nama}
                        </a>
                        <span className='text-muted fs-7 mb-1'>{dateFromNow(message.created_date)}</span>
                      </div>
                    </>
                  ) : (
                    <>
                      <div className='me-3'>
                        <span className='text-muted fs-7 mb-1'>{dateFromNow(message.created_date)}</span>
                        <a
                          href='#'
                          className='fs-5 fw-bolder text-gray-900 text-hover-primary ms-1'
                        >
                          You
                        </a>
                      </div>
                      <RoundImage user={message} overlay={false}/>

                    </>
                  )}
                </div>

                {message.file === null ? 
                <div
                  className={clsx(
                    'p-5 rounded',
                    `bg-light-${state}`,
                    'text-dark fw-bold mw-lg-400px',
                    `text-${message.created_by != JSON.parse(auth!).user_id ? 'start' : 'end'}`
                  )}
                  // data-kt-element='message-text'
                  dangerouslySetInnerHTML={{__html: message.message.replace('\n', '<br/>').replace(/ *\@\@[^)]*\@\@ */g, "")}}
                ></div>
                :
                <div className={clsx(
                    'rounded',
                    isDownload.indexOf(message.card_chat_id) > -1 ? 'overlay overlay-block' : '',
                    // 'card h-5',
                    `bg-light-${state}`,
                    'text-dark fw-bold mw-lg-400px',
                    `text-${message.created_by != JSON.parse(auth!).user_id ? 'start' : 'end'}`
                  )} >
                  <div className='card-body overlay-wrapper d-flex justify-content-center text-center flex-column p-8' style={{cursor:isDownload.indexOf(message.card_chat_id) > -1 ? '' :'pointer'}}>
                    <a onClick={()=>downloadFile(message.card_chat_id, message.message)} className='text-gray-800 text-hover-primary d-flex flex-column'>
                      <div className='symbol symbol-75px mb-6'>
                        <img src={toAbsoluteUrl(message.file_icon)} alt='' />
                      </div>
                    </a>
                    <div className='fs-7 fw-bold text-gray-400 mt-auto'>{message.message}</div>
                    {isDownload.indexOf(message.card_chat_id) > -1 ?
                    <div className="overlay-layer rounded bg-dark bg-opacity-5">
                      <div
                        className="spinner-border text-primary"
                        role="status"
                      >
                        <span className="visually-hidden">Loading...</span>
                      </div>
                    </div> : <></>}
                  </div>
                </div>
                }
              </div>

              <div ref={messagesEndRef} />

            </div>
          )
        }) : <div></div>}
      </div>

      <div
        className='card-footer' style={{padding:0}}
      >
        {/* <textarea
          className='form-control form-control-flush mb-3'
          rows={1}
          data-kt-element='input'
          placeholder='Type a message'
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          onKeyDown={onEnterPress}
        ></textarea> */}
        
<MentionsInput value={message} onChange={(e) => setMessage(e.target.value)} placeholder={"Type a message.... (Mention people using '@')"}
        a11ySuggestionsListLabel={"Suggested mentions"} className='mentions' rows={5}  classNames={classNames}>
  <Mention
   markup={`<span class='badge badge-primary'>__display__@@__id__@@</span>`}
    trigger="@"
    data={users}
    className={classNames.mentions__mention} 
    renderSuggestion={(
      suggestion,
      search,
      highlightedDisplay,
      index,
      focused
    ) => (
      <span className={`badge badge-${focused ? 'primary' : 'white'}`}>
        {highlightedDisplay}
      </span>
    )}
    // displayTransform={(id,display) => 
    //   `<span className='badge badge-primary'>
    //   ${display}
    //   </span>`
    // }
    // renderSuggestion={this.renderUserSuggestion}
  />
  </MentionsInput> 

        <div className='d-flex flex-stack'>
          <div className='d-flex align-items-center me-2'>
            <ChunkedUploady
              method="POST"
              // params={{card_id:id}}
              params={{isTemp:false, modul:'chat', id:id}}
              destination={{ url: API().postUploadFile , headers: { 'Authorization': "Bearer " + JSON.parse(auth!).api_token} }}
              chunkSize={1000 * 1024}
              inputFieldName={'file'}>
                <LogProgress/>   
                <DivUploadButton/>
            </ChunkedUploady>
            {/* {progress > 0 ? 'Please wait ... (' + progress + '%)' : ''} */}
          </div>
          <ButtonSubmit label="Send" disabled={isLoading} isLoading={isLoading} onClick={sendMessage}/>

        </div>
        {progress > 0 ? <ProgressBar now={progress} label={'Proccessing ' + Math.ceil(progress) + ' %'} variant="success" animated striped/> : <></>}
      </div>
    </div>
  )
}

export {ChatGroup}
