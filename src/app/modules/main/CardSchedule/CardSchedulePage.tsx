import axios from "axios";
import { FC, useEffect, useState } from "react";
import { Link, useLocation, useParams } from "react-router-dom";
import { PageLink, PageTitle } from "../../../../_metronic/layout/core";
import { API } from "../../../services";

import FullCalendar from '@fullcalendar/react' // must go before plugins
import dayGridPlugin from '@fullcalendar/daygrid' // a plugin!

import interactionPlugin from "@fullcalendar/interaction" // needed for dayClick
import { ModalForm } from "./CardScheduleComponent";
import moment from "moment";
import { toAbsoluteUrl } from "../../../../_metronic/helpers";
import { dateFromNow, dateTimeBetween } from "../../../helper/tool";

const CardSchedulePage: FC = () => {
    const {state}                   = useLocation() as any;
    const param                     = useParams();
    const [data, setData]           = useState<any>();
    const [reqStatus, setReqStatus] = useState('AKTIF');
    const [reqTarget, setReqTarget] = useState('USER_LOGIN');
    const [showModal, setShowModal] = useState(false);
    
    const [loadingData, setLoadingData] = useState(true);
    const [list, setList]               = useState<any>([]);
    const [calendar, setCalendar]       = useState<any>([{ date: moment().format('YYYY-MM-DD'), display:'background', backgroundColor:'green' }]);

    const [tempStart, setTempStart] = useState('');
    const [tempEnd, setTempEnd]     = useState('');
      
    const [users, setUsers] = useState<any>();

    let profileBreadCrumbs: Array<PageLink> = [
        {
            title: 'HomePage',
            path: '/dashboard',
            isSeparator: false,
            isActive: false,
        },
        {
            title: '',
            path: '/card/'+param.id,
            isSeparator: false,
            isActive: false,
        },
        ];
    
    const [breadCrumbs, setBreadCrumbs]  = useState<any>([]);


    const getDataDetail = () => {
        setData(null);
        axios.get(API().getCardDetail + '?id_crypt=' + param.id)
          .then((response) => {
            let res = response.data;
            profileBreadCrumbs[1] ={
                title: res.data.title,
                path: '/card/'+param.id,
                isSeparator: false,
                isActive: false,
            };
            setBreadCrumbs(profileBreadCrumbs);
            setData(res.data);
          })
          .catch((error) => {
            setData([]);
          });
    }
    const checkData = () =>{
        if(state){
            setData(state.data);
            setUsers(state.users);
            profileBreadCrumbs[1] ={
                title: state.data.title,
                path: '/card/'+param.id,
                isSeparator: false,
                isActive: false,
            };
            setBreadCrumbs(profileBreadCrumbs);
        }else{
            getMember();
            getDataDetail();
        }
    }
    const getData = (start:any, end:any) => {
        setLoadingData(true);
        axios.get(API().getScheduleList + '?id_crypt=' + param.id + '&status=' +reqStatus + '&target=' +reqTarget+ '&start=' +start+ '&end=' +end)
        .then((response) => {
            let res = response.data;
            console.log(res.calendar);
            setList(res.data);
            setCalendar([...res.calendar, { date: moment().format('YYYY-MM-DD'), display:'background', backgroundColor:'green' }]);
            setLoadingData(false);
        })
        .catch((error) => {
            setList([]);
            setLoadingData(false);
        });
    }

    const getMember = () => {
        axios.get(API().getCardMember + '?id_crypt=' + param.id)
          .then((response) => {
              let res = response.data;
              setUsers(res.data);
          })
          .catch((error) => {
            setUsers([]);
          });
    }
    useEffect(()=>{
        checkData();
    },[]);

    // const handleDateClick = (arg:any) => { // bind with an arrow function
    //     alert(arg.dateStr);
    // }
    return (
        <>
        <PageTitle breadcrumbs={breadCrumbs} description='tes'>
          Schedule
        </PageTitle>

        <div className='d-flex flex-wrap flex-stack mb-6'>
            <div className='d-flex align-items-center my-2'>
                <div className='me-5'>
                    Schedule Status : 
                </div>
                <div className='w-100px me-10'>
                    <select
                        name='status'
                        data-control='select2'
                        data-hide-search='true'
                        className='form-select form-select-white form-select-sm'
                        onChange={(e)=>{setReqStatus(e.target.value)}}
                        defaultValue={reqStatus}
                        value={reqStatus}
                    >
                        <option value='AKTIF'>Active</option>
                        <option value='ARCHIVE'>Archive (Removed)</option>
                    </select>
                </div>

                <div className='me-5'>
                    Target Notification : 
                </div>
                <div className='w-100px me-10'>
                    <select
                    name='status'
                    data-control='select2'
                    data-hide-search='true'
                    className='form-select form-select-white form-select-sm'
                    onChange={(e)=>{setReqTarget(e.target.value)}}
                    defaultValue={reqTarget}
                    value={reqTarget}
                    >
                    <option value='USER_LOGIN'>You</option>
                    <option value='ALL'>- All -</option>
                    </select>
                </div>
                <button className='btn btn-primary btn-sm' data-bs-toggle='tooltip' title='Filter' onClick={()=>{getData(tempStart, tempEnd)}}>
                    Filter
                </button>
            </div>
            
            <div className='fw-bolder my-2'>
                
            <button className='btn btn-primary btn-sm' type="button"
                onClick={()=>setShowModal(true)}
            >
                New
            </button>
            {showModal ? 
            <ModalForm showModal={showModal} setShowModal={setShowModal} users={users} refreshData={()=> getData(tempStart, tempEnd)}/>
            : <></>}
          

            </div>
        </div>
        <div className='row d-flex justify-content-center'>
            <div className='col-md-8'>
                <div className='border border-gray-300 border-dashed rounded mb-5 mb-xxl-8'>
                    <div className={`card`}>
                        <div className="card-body">
                            <FullCalendar
                                plugins      = {[ dayGridPlugin, interactionPlugin ]}
                                initialView  = "dayGridMonth"
                                events       = {calendar}
                                displayEventTime = {false}
                                eventContent = {renderEventContent}
                                datesSet     = {(event) => {
                                    setTempStart(event.startStr);
                                    setTempEnd(event.endStr);
                                    getData(event.startStr,event.endStr);
                                }
                            }
                            />
                        </div>
                    </div>
                </div>
            </div>
            <div className='col-md-4'>

                <div
                    className={`card bgi-no-repeat card-xl-stretch mb-xl-8`}
                >
                    <div className='card-body px-4 py-4'>
                        <div className='fw-bold text fs-4 px-0 py-0'>
                           Schedule This Month
                        </div>
                    </div>
                </div>
                {list.map((item:any, index:any)=>{
                    let date = '';
                    if(item.start_date === item.end_date){
                        date = dateFromNow(item.start_date,0);
                    }else if(item.start_date.substr(0,10) === item.end_date.substr(0,10)){
                        date = dateTimeBetween(item.start_date, item.end_date);
                    }else{
                        date = dateFromNow(item.start_date,0) + ' s/d ' + dateFromNow(item.end_date,0);
                    }
                    return(
                        <Link
                            to={'/card/' + item.crypt_card_id + '/schedule/' + item.crypt_card_event_id}  state={{data:data, sub_data: item}}
                            key={index}
                            className={`card bgi-no-repeat card-xl-stretch mb-xl-8 hover-elevate-u`}
                            style={{
                                backgroundPosition: 'right top',
                                backgroundSize: '30% auto',
                                backgroundImage: `url(${toAbsoluteUrl('/media/svg/shapes/abstract-4.svg')})`,
                            }}
                        >
                            <div className='card-body'>
                                <div className='card-title fw-bold text-muted text-hover-primary fs-4'>
                                {item.title}
                                </div>
        
                                <div className='fw-bold text-primary my-6'>
                                    {date}
                                </div>
                            </div>
                        </Link>)
                    ;
                })}
            </div>
        </div>
        </>
    );
}
function renderEventContent(eventInfo:any) {
    return (
      <>
        <b>{eventInfo.timeText}</b>
        <i>{eventInfo.event.title}</i>
      </>
    )
  }
export {CardSchedulePage}
