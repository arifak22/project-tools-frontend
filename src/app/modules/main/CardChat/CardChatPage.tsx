/* eslint-disable jsx-a11y/anchor-is-valid */
import React, {FC, useEffect, useState} from 'react'
import { useLocation, useParams } from 'react-router-dom'
import { KTSVG, toAbsoluteUrl } from '../../../../_metronic/helpers'
import { PageLink, PageTitle } from '../../../../_metronic/layout/core'
import { Dropdown1 } from '../../../../_metronic/partials'

import Echo from 'laravel-echo';
import { ChatGroup } from './ChatGroup'
import { LoadingComponent, RoundImage, useWindowDimensions } from '../../../helper/component'
import axios from 'axios'
import { API } from '../../../services'
// import Pusher from 'pusher-js';



const CardChatPage: FC = () => {
    const {state} = useLocation() as any;
    const [msg, setMsg]     = useState('');
    const param             = useParams();
    // const { data, users }          = location.state as any;
    const { height, width } = useWindowDimensions();



    const [users, setUsers] = useState<any>([]);
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
    useEffect(() => {
      checkData();
    },[]);
  return (
    <>
    <PageTitle breadcrumbs={breadCrumbs}>
      Chat
    </PageTitle>
    <div>{msg}</div>
    <div className='d-flex flex-column flex-lg-row'>
      <div className='flex-column flex-lg-row-auto w-100 w-lg-300px w-xl-400px mb-10 mb-lg-0'>
        <div className='card card-flush'>
          <div className='card-header pt-7' id='kt_chat_contacts_header'>
            {/* <form className='w-100 position-relative' autoComplete='off'>
              <KTSVG
                path='/media/icons/duotune/general/gen021.svg'
                className='svg-icon-2 svg-icon-lg-1 svg-icon-gray-500 position-absolute top-50 ms-5 translate-middle-y'
              />

              <input
                type='text'
                className='form-control form-control-solid px-15'
                name='search'
                placeholder='Search by username or email...'
              />
            </form> */}
            <div className='text-gray-800 text-hover-primary fs-6 fw-bold'>Anggota Group</div>
          </div>
          <div className='separator mb-0'></div>

          <div className='card-body pt-5'>
            <div
              className='scroll-y me-n5 pe-5'
              style={{height:`${height-350}px`}}
            >
              {users.map((user: any, i:any) => {
                return(<>
                  <div className='d-flex flex-stack py-4'>
                  <div className='d-flex align-items-center'>
                    {/* <div className='symbol symbol-45px symbol-circle'>
                      <span className='symbol-label bg-light-danger text-danger fs-6 fw-bolder'>
                        M
                      </span>
                    </div> */}
                    <RoundImage user={user} size='45px' overlay={false}/>

                    <div className='ms-5'>
                      <a href='#' className='fs-5 fw-bolder text-gray-900 text-hover-primary mb-2'>
                        {user.nama}
                      </a>
                      <div className='fw-bold text-gray-400'>{user.jabatan}</div>
                    </div>
                  </div>

                  <div className='d-flex flex-column align-items-end ms-2'>
                  </div>
                </div>

                <div className='separator separator-dashed d-none'></div>
                </>)
              })}
              

            </div>
          </div>
        </div>
      </div>

      <div className='flex-lg-row-fluid ms-lg-7 ms-xl-10'>
        <div className='card' id='kt_chat_messenger'>
          <ChatGroup id={param.id} users={users}/>
        </div>
      </div>
    </div>
    </>
  )
}

export {CardChatPage}
