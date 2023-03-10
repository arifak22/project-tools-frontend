import axios from "axios";
import clsx from "clsx";
import moment from "moment";
import { FC, useEffect, useState } from "react";
import { Link, useLocation, useParams } from "react-router-dom";
import { KTSVG } from "../../../../_metronic/helpers";
import { PageLink, PageTitle } from "../../../../_metronic/layout/core";
import { Dropdown1 } from "../../../../_metronic/partials";
import { AlertConfirm, AlertForm, AlertResult, ButtonDownloadFile, ButtonSubmit, ListUsers, LoadingComponent, LoadingContent, RoundImage, TextForm } from "../../../helper/component";
import { dateFromNow, dateTimeBetween } from "../../../helper/tool";
import { API, auth, params } from "../../../services";

import * as Yup from 'yup'
import { useFormik } from "formik";
import { getChannels } from "../../../helper/channel";
import { MenuInnerWithSub } from "../../../../_metronic/layout/components/header/header-menus/MenuInnerWithSub";
import { MenuItem } from "../../../../_metronic/layout/components/header/header-menus/MenuItem";
import { ModalForm } from "./CardScheduleComponent";
import { Alert, Button, Modal } from "react-bootstrap";

const CardScheduleDetailPage: FC = () => {
    const param   = useParams();
    const {state} = useLocation() as any;

    const [item, setItem] = useState<any>({title:''});

    const [loadingData, setLoadingData]       = useState(true);
    const [loadingComment, setLoadingComment] = useState(true);
    const [comment, setComment]               = useState<any>([]);
    const [channels, setChannels]             = useState<any>(undefined);

    const [dataDetil, setDataDetil] = useState<any>();

    const [showModal, setShowModal] = useState(false);
    const [show, setShow] = useState(false);
    const [users, setUsers] = useState([]);

    const [loadingRemove, setLoadingRemove] = useState(false);

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
        {
            title: 'Schedule',
            path: '/card/'+param.id+'/schedule',
            isSeparator: false,
            isActive: true,
        },
    ];
    const [breadCrumbs, setBreadCrumbs]  = useState<any>([]);



    const getData = () => {
        setLoadingData(true);
        axios.get(API().getScheduleDetail + '?id_crypt=' + param.id + '&id_crypt_event=' +param.subid)
        .then((response) => {
            let res = response.data;
            console.log(res);
            setItem(res.data);
            setLoadingData(false);
        })
        .catch((error) => {
            setItem([]);
            setLoadingData(false);
        });
    }
    const getDataDetail = () => {
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
          })
          .catch((error) => {
          });
    }
    
    const postRemove = () =>{
        setLoadingRemove(true);
        let postData = {
            'id_crypt' : param.id,
            'id_crypt_event' : param.subid,
        }
        axios.post(API().postScheduleRemove, postData)
            .then((response) => {
                let res = response.data;
                if(res.api_status == 1){
                    setShow(false);
                    getData();
                }else{
                    alert('error');
                }
                setLoadingRemove(false);
            })
            .catch((error) => {
                alert('error');
                setLoadingRemove(false);
            });
    }
    const checkData = () =>{
        if(state){
            profileBreadCrumbs[1] ={
                title: state.data.title,
                path: '/card/'+param.id,
                isSeparator: false,
                isActive: false,
            };
            setBreadCrumbs(profileBreadCrumbs);
            setItem(state.sub_data);
            getData();
        }else{
            getDataDetail();
            getData();
        }
    }
    useEffect(()=>{
        checkData();
    },[]);

    const cardSchema = Yup.object().shape({
        id_crypt_event: Yup.string().required(),
        id_crypt      : Yup.string().required(),
        message       : Yup.string()
                        .required()
                        .max(1000),
    });

    var initialValues = {
        id_crypt: param.id,
        id_crypt_event: param.subid,
        message: '',
    }
    const formik = useFormik({
        initialValues,
        validationSchema: cardSchema,
        onSubmit: async (values, {setStatus}) => {
            try {
                await axios.post(API().postScheduleComment, values).then((response)=>{
                    var res = response.data;
                    if(res.api_status === 1){
                        formik.resetForm();
                        setStatus({msg: res.api_message, status: 'success'});
                        setTimeout(function() { 
                            formik.resetForm();
                        }, 1000);
                    }else{
                        setStatus({msg: res.api_message, status: 'warning'});
                    }
                });
            } catch (error) {
                console.log(error);
                setStatus({msg: 'Error, Hubungi IT', status: 'danger'});
            }
        },
    });

    const connectChannel = () => {
        const channels = getChannels();
        setChannels(channels);
        console.log(`comment.schedule.${param.subid}.${param.id}`);
        channels.join(`comment.schedule.${param.subid}.${param.id}`)
            .here((users: any) => {
            console.log('here', users);
            })
            .joining((user: any) => {
            console.log('join',user);
            })
            .leaving((user: any) => {
            console.log('leave',user);
            })
            .listen('CommentMessage', (e:any) => {
            console.log(e);
            setComment((comment:any) => [e.message,...comment] );
            // setIsScroll(true);
            })
            .error((error: any) => {
            console.log('error', error);
            });
        return () => {
            // disconnect from server and reset the channels
            channels.disconnect();
            setChannels(undefined);
        }
    }

    const getComment = () =>{
        setLoadingComment(true);
        axios.get(API().getScheduleComment + '?id_crypt=' + param.id + '&id_crypt_event=' +param.subid)
        .then((response) => {
            let res = response.data;
            console.log(res);
            setComment(res.data);
            setLoadingComment(false);
        })
        .catch((error) => {
            setComment([]);
            setLoadingComment(false);
        });
    }

    useEffect(()=>{
        getComment();
        connectChannel();
    },[]);



    let date = '';
    if(item.start_date === item.end_date){
        date = dateFromNow(item.start_date,0);
    }else if(item.start_date.substr(0,10) === item.end_date.substr(0,10)){
        date = dateTimeBetween(item.start_date, item.end_date);
    }else{
        date = dateFromNow(item.start_date,0) + ' s/d ' + dateFromNow(item.end_date,0);
    }
    return(
        <>
        <PageTitle breadcrumbs={breadCrumbs} description='tes'>
          {item.title}
        </PageTitle>
        <div className='row d-flex justify-content-center'>
            <div className='col-md-8'>
                <div className='border border-gray-300 border-dashed rounded mb-5 mb-xxl-8'>
                    <div className={`card`}>
                        <div className='card-header align-items-center border-0 mt-4'>
                            <div className='align-items-start flex-column'>
                                <span className='card-title fw-bold text-dark fs-2'>{item.title}</span>
                                <span className={clsx('d-flex align-items-center rounded p-1', item.status === 'ARCHIVE' ?' bg-light-danger'  : moment(item.start_date).isAfter() ? ' bg-light-warning' : moment(item.end_date).isAfter()  ? ' bg-light-primary' :' bg-light-success')}>
                                    <span className='svg-icon svg-icon-warning me-1'>
                                        {item.status === 'ARCHIVE' ?  <i className='las la-times-circle fs-2qx'></i>  : moment(item.start_date).isAfter() ? <i className='las la-clock fs-2qx'></i> :  moment(item.end_date).isAfter() ?  <i className='las la-play fs-2qx'></i> : <i className='las la-check-circle fs-2qx'></i> }
                                    </span>
                                    <div className='flex-grow-1 me-2'>
                                        <span className='fw-bold text-gray-800'>
                                        {item.status === 'ARCHIVE' ? 'ARCHIVED': moment(item.start_date).isAfter() ? dateFromNow(item.start_date) :  moment(item.end_date).isAfter() ? 'On Going': dateFromNow(item.end_date) }
                                        </span>
                                    </div>
                                </span>
                            </div>

                            {/* begin::Menu */}
                            <button
                                type='button'
                                style={{visibility: JSON.parse(auth!).user_id == item.created_by ? 'visible' : 'hidden'}}
                                className='btn btn-sm btn-icon btn-color-primary btn-active-light-primary'
                                data-kt-menu-trigger='click'
                                data-kt-menu-placement='bottom-end'
                                data-kt-menu-flip='top-end'
                            >
                                <KTSVG path='/media/icons/duotune/general/gen024.svg' className='svg-icon-2' />
                            </button>
                            <div className='menu menu-sub menu-sub-dropdown w-250px w-md-300px' data-kt-menu='true'>
                                <div className='px-7 py-5'>
                                    <div className='fs-5 text-dark fw-bolder'>Menu</div>
                                </div>

                                <div className='separator border-gray-200'></div>
                                <div className='menu-item me-lg-1'>
                                    <Link
                                        className={clsx('menu-link py-3')}
                                        onClick={() => setShowModal(true)} 
                                        to={""}           
                                    >
                                        <span className='menu-icon'>
                                            <i className="las la-pencil-alt fs-2 text-primary"></i>
                                        </span>
                                        <span className='menu-title fs-4 fs-bold'>Edit</span>

                                    </Link>
                                </div>
                                {showModal ? 
                                <ModalForm showModal={showModal} setShowModal={setShowModal} data={item} refreshData={()=>{getData()}}/>
                                : <></>}
                                <div className='menu-item me-lg-1'>
                                    <Link
                                        className={clsx('menu-link py-3')}
                                        onClick={() => setShow(true)} 
                                        to={''}
                                    >
                                        <span className='menu-icon'>
                                            <i className="las la-archive fs-2 text-danger"></i>
                                        </span>
                                        <span className='menu-title fs-4 fs-bold text-danger'>Archive (Remove)</span>

                                    </Link>
                                </div>
                                <AlertConfirm 
                                    msg      = 'Archive / Remove Schedule Post'
                                    onSubmit = {() => { postRemove() }}
                                    show     = {show}
                                    setShow  = {setShow}
                                    onLoading = {loadingRemove}
                                />
                            </div>
                            {/* end::Menu */}
                        </div>
                        <div className="separator my-5"></div>
                        <div className='card-body pb-0 pt-0'>
                            <div className='d-flex align-items-center mb-2'>
                                <div className='d-flex align-items-center flex-grow-1'>
                                    <RoundImage user={item} circle={false} size='45px' addClass='me-5'/>
                                    <div className='d-flex flex-column'>
                                        <span className='text-gray-800 fs-3 fw-bold'>
                                            {item.nama}

                                        </span>

                                        <div className='d-flex flex-row' style={{alignItems: 'center'}}>
                                            <span className='text-gray-400 fw-semibold'>Posting date: {dateFromNow(item.created_date)}</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className='d-flex align-items-center mb-3'>
                                <i className="las la-calendar fs-3"></i><i>{date}</i>
                            </div>

                            <div className='mb-5'>
                                <div className='text-gray-800 fs-4 fw-normal mb-5' style={{ whiteSpace: "pre-line" }}>
                                {item.message}
                                </div>

                                <div className='d-flex align-items-center mb-5'>
                                {item.lampiran ? item.lampiran.map((item:any, i:any)=>{
                                    return (<ButtonDownloadFile key={i} id={item.card_schedule_file_id} modul='schedule' filename={item.file_name} />)
                                }) : <></>}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div className='col-md-8'>
                <div className='border border-gray-300 border-dashed rounded mb-5 mb-xxl-8'>
                    <div className={`card`}>
                        <div className='my-3 mx-5'>
                            Member
                        </div>
                        <div className="separator"></div>
                        <div className='d-flex align-items-center flex-grow-1 my-3 mx-5'>
                            <LoadingComponent data={item.users} component={<ListUsers users={item.users?.filter((x:any) =>{return x.checked === 1})} />}/>
                        </div>
                    </div>
                </div>
            </div>
                            
            <div className='col-md-8'>
                <div className='border border-gray-300 border-dashed rounded mb-5 mb-xxl-8'>
                    <div className={`card`}>
                        <div className='my-4 mx-4'>
                            <form 
                                onSubmit={formik.handleSubmit}
                                noValidate
                            >
                                <div className='align-items-start flex-column'>
                                    <AlertForm formik={formik} />
                                    <TextForm formik={formik} label='Comment' name='message' rows={4}/>
                                    <ButtonSubmit label="Send" disabled={formik.isSubmitting || !formik.isValid} isLoading={formik.isSubmitting} type="submit" />
                                </div>
                            </form>
                        </div>
                        <div className="separator my-2"></div>
                        <div className="card-body">
                            <LoadingContent isLoading={loadingComment} data={comment}>
                                {comment.map((com:any, i:any) =>{
                                    return(<div key={i} className='mb-5 bg-light py-4 px-4 rounded'>
                                        <div className='d-flex align-items-center flex-grow-1'>
                                            <RoundImage user={com} circle={false} size='45px' addClass='me-5'/>
                                            <div className='d-flex flex-column'>
                                                <span className='text-gray-800 fs-3 fw-bold'>
                                                    {com.nama}
                                                </span>

                                                <div className='d-flex flex-row' style={{alignItems: 'center'}}>
                                                    <span className='text-gray-400 fw-semibold'>{dateFromNow(com.created_date)}</span>
                                                </div>
                                            </div>
                                        </div>
                                        <div className='mb-5 mt-5'>
                                            <div className='text-gray-800 fs-4 fw-normal mb-5' style={{ whiteSpace: "pre-line" }}>
                                            {com.message}
                                            </div>
                                        </div>
                                    </div>);
                                })}
                            </LoadingContent>
                        </div>
                    </div>
                </div>
            </div>
        </div>

        </>
    );
}

export {CardScheduleDetailPage};