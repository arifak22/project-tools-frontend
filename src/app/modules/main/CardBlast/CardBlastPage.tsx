import {FC, useEffect, useState} from 'react'
import { Link, useLocation, useParams } from 'react-router-dom';
import { PageLink, PageTitle } from '../../../../_metronic/layout/core'
import axios from 'axios';
import { API } from '../../../services';
import clsx from 'clsx';
import {ButtonDownloadFile, RoundImage, LoadingContent, Loading } from '../../../helper/component';
import { dateFromNow } from '../../../helper/tool';
import { ModalForm } from './CardBlastComponent';
var moment = require('moment'); // require

const ListBlast = ({item, data}:any) =>{
    return(
        <div className='col-md-6'>
            <div className='border border-gray-300 border-dashed rounded mb-5 mb-xxl-8'>
                <div className={`card`}>
                    <div className='card-body pb-0'>
                        <Link to={'/card/' + item.crypt_card_id + '/blast/' + item.crypt_card_blast_id}  state={{data:data, sub_data: item}} className='d-flex align-items-center mb-5'>
                            <div className='d-flex align-items-center flex-grow-1'>
                                <RoundImage user={item} circle={false} size='45px' addClass='me-5'/>
                                <div className='d-flex flex-column'>
                                    <span className='text-gray-800 fs-3 fw-bold'>
                                        {item.title}
                                    </span>

                                    <div className='d-flex flex-row' style={{alignItems: 'center'}}>
                                        <span className='text-gray-400 fw-semibold'>{dateFromNow(item.post_date)}</span>

                                        <span className={clsx('d-flex align-items-center rounded p-1', moment(item.experied_date).isAfter() ? ' bg-light-warning' : ' bg-light-success')}>
                                            <span className='svg-icon svg-icon-warning me-1'>
                                                {moment(item.experied_date).isAfter() ? <i className='las la-clock fs-2qx'></i> :  <i className='las la-check-circle fs-2qx'></i> }
                                            </span>
                                            <div className='flex-grow-1 me-2'>
                                                <span className='fw-bold text-gray-800'>
                                                {dateFromNow(item.experied_date)}
                                                </span>
                                            </div>
                                        </span>

                                    </div>
                                </div>
                            </div>
                        </Link>
                        <div className='mb-5'>
                            <Link to={'/card/' + item.crypt_card_id + '/blast/' + item.crypt_card_blast_id}  state={{data:data, sub_data: item}}>
                            <div className='text-gray-800 fs-4 fw-normal mb-5' style={{ whiteSpace: "pre-line" }}>
                            {item.message}
                            </div>
                            </Link>

                            <div className='d-flex align-items-center mb-5'>
                            {item.lampiran ? item.lampiran.map((item:any, i:any)=>{
                                return (<ButtonDownloadFile key={i} id={item.card_blast_file_id} modul='blast' filename={item.file_name} />)
                            }) : <></>}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

const CardBlastPage: FC = () => {
    const {state} = useLocation() as any;

    const param                         = useParams();
    const [showModal, setShowModal]     = useState(false);
    const [list, setList]               = useState<any>([]);
    const [loadingData, setLoadingData] = useState(true);
    

    const [reqStatus, setReqStatus] = useState('AKTIF');
    const [reqTarget, setReqTarget] = useState('USER_LOGIN');

    const [users, setUsers] = useState<any>();
    const [data, setData]  = useState<any>();

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



    const getData = () => {
        setLoadingData(true);
        axios.get(API().getBlastList + '?id_crypt=' + param.id + '&status=' +reqStatus + '&target=' +reqTarget)
        .then((response) => {
            let res = response.data;
            console.log(res);
            setList(res.data);
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
            setUsers(state.users);
            setData(state.data);
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
    useEffect(()=>{
        getData();
        checkData();
    },[]);
    return (
        <>
        <PageTitle breadcrumbs={breadCrumbs} description='tes'>
          Blast
        </PageTitle>
        { !data ? <Loading/> : !users ? <Loading/> : <></> }
        <div className='d-flex flex-wrap flex-stack mb-6'>
            <div className='d-flex align-items-center my-2'>
                <div className='me-5'>
                    Blast Status : 
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
                        <option value='EXPERIED'>Experied</option>
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
                <button className='btn btn-primary btn-sm' data-bs-toggle='tooltip' title='Filter' onClick={()=>{getData()}}>
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
            <ModalForm showModal={showModal} setShowModal={setShowModal} users={users} refreshData={()=> getData()}/>
            : <></>}
          

            </div>
        </div>
        <div className='row'>
            <div className='col-md-12'>
                <div className='card'>

                    <div className='card-body flex-column'>
                        <LoadingContent isLoading={loadingData} data={list}>
                            <div className='row'>
                                {list.map((item: any, i: any) =>{
                                return(<ListBlast item={item} data={data} key={i}/>)
                                })}
                            </div>
                        </LoadingContent>
                    </div>
                </div>
            </div>
        </div>
        </>
    )
}

export {CardBlastPage}
