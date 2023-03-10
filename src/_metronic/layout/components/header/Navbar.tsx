import axios from 'axios'
import clsx from 'clsx'
import { FC, useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { RoundImage } from '../../../../app/helper/component'
import { dateFromNow } from '../../../../app/helper/tool'
import { useAuth } from '../../../../app/modules/auth'
import { API } from '../../../../app/services'
import { MenuComponent } from '../../../assets/ts/components'
import {defaultAlerts, defaultLogs, KTSVG, toAbsoluteUrl} from '../../../helpers'
import {HeaderUserMenu} from '../../../partials'
import {useLayout} from '../../core'

const itemClass = 'ms-1 ms-lg-3'
const btnClass =
  'btn btn-icon btn-custom btn-icon-muted btn-active-light btn-active-color-primary w-35px h-35px w-md-40px h-md-40px'
const userAvatarClass = 'symbol-35px symbol-md-40px'
const btnIconClass = 'svg-icon-1'


const HeaderNotificationsMenu= ({list, setList}:any) => {
  let chat_list     = list.filter((el:any)=> el.table_sub === 'card_chat');
  let blast_list    = list.filter((el:any)=> el.table_sub === 'card_blast');
  let schedule_list = list.filter((el:any)=> el.table_sub === 'card_event');
  let board_list    = list.filter((el:any)=> el.table_sub === 'card_board');
  let checkin_list  = list.filter((el:any)=> el.table_sub === 'card_checkin');
  let docs_list     = list.filter((el:any)=> el.table_sub === 'card_docs');

  const updateNotif = (notification_id:any) =>{
    MenuComponent.hideDropdowns(undefined);
    axios.post(API().postNotificationRead, {notification_id: notification_id}).then((response)=>{
      var res = response.data;
      if(res.api_status === 1){
        let filteredArray = list.filter((el:any)=> el.notification_id !== notification_id);
        setList(filteredArray);
      }
    });
  }

  return(
  <div
    className='menu menu-sub menu-sub-dropdown menu-column w-750px w-lg-775px'
    data-kt-menu='true'
  >
    <div
      className='d-flex flex-column rounded-top'
      style={{backgroundImage: `url('${toAbsoluteUrl('/media/misc/menu-header-bg.jpg')}')`, backgroundSize:'100%'}}
    >
      <h3 className='text-white fw-bold px-9 mt-10 mb-6'>
        Notifications <span className='fs-8 opacity-75 ps-3'>{list.length} reports</span>
      </h3>

      <ul className='nav nav-line-tabs nav-line-tabs-2x nav-stretch fw-bold px-9'>
        <li className='nav-item'>
          <a
            className='nav-link text-white opacity-75 opacity-state-100 pb-4'
            data-bs-toggle='tab'
            href='#tab_chat'
          >
            Group Chat
            <span className='badge badge-circle badge-success mx-1'>
            {chat_list.length}
            </span>
          </a>
        </li>

        <li className='nav-item'>
          <a
            className='nav-link text-white opacity-75 opacity-state-100 pb-4 active'
            data-bs-toggle='tab'
            href='#tab_blast'
          >
            Blast
            <span className='badge badge-circle badge-success mx-1'>
            {blast_list.length}
            </span>
          </a>
        </li>

        <li className='nav-item'>
          <a
            className='nav-link text-white opacity-75 opacity-state-100 pb-4'
            data-bs-toggle='tab'
            href='#tab_schedule'
          >
            Schedule
            
            <span className='badge badge-circle badge-success mx-1'>
            {schedule_list.length}
            </span>
          </a>
        </li>

        
        <li className='nav-item'>
          <a
            className='nav-link text-white opacity-75 opacity-state-100 pb-4'
            data-bs-toggle='tab'
            href='#tab_board'
          >
            Board
            <span className='badge badge-circle badge-success mx-1'>
            {board_list.length}
            </span>
          </a>
        </li>


        <li className='nav-item'>
          <a
            className='nav-link text-white opacity-75 opacity-state-100 pb-4'
            data-bs-toggle='tab'
            href='#tab_checkin'
          >
            Check-in
            <span className='badge badge-circle badge-success mx-1'>
            {checkin_list.length}
            </span>
          </a>
        </li>


        <li className='nav-item'>
          <a
            className='nav-link text-white opacity-75 opacity-state-100 pb-4'
            data-bs-toggle='tab'
            href='#tab_docs'
          >
            Docs & File
            <span className='badge badge-circle badge-success mx-1'>
            {docs_list.length}
            </span>
          </a>
        </li>

      </ul>
    </div>

    <div className='tab-content'>
      <div className='tab-pane fade' id='tab_chat' role='tabpanel'>
        <div className='scroll-y mh-325px my-5 px-8'>
          {chat_list.map((alert:any, index:any) => (
            <div key={`alert${index}`} className='d-flex flex-stack py-4'>
              <div className='d-flex align-items-center'>
                <div className='symbol symbol-35px me-4'>
                  <span className={clsx('symbol-label', `bg-light-primary`)}>
                    {' '}
                    <img src={toAbsoluteUrl('/media/main/notification/'+alert.type+'.png')} alt='Metronic' className={`w-100 svg-icon-2 svg-icon-primary`} />
                  </span>
                </div>

                <div className='mb-0 me-2'>
                  <Link to={`/${alert.menu}/${alert.crypt_id}/${alert.menu_sub}/${alert.crypt_sub_id}`} onClick={()=>updateNotif(alert.notification_id)} className='fs-6 text-gray-800 text-hover-primary fw-bolder'>
                    {alert.title}
                  </Link>
                  <div className='text-gray-400 fs-7'
                  dangerouslySetInnerHTML={{__html: alert.description.replace('\n', '<br/>').replace(/ *\@\@[^)]*\@\@ */g, "")}}
                  ></div>
                </div>
              </div>

              <span className='badge badge-light fs-8'>{dateFromNow(alert.date)}</span>
            </div>
          ))}
        </div>

        <div className='py-3 text-center border-top'>
          <Link
            to='/crafted/pages/profile'
            className='btn btn-color-gray-600 btn-active-color-primary'
          >
            View All <KTSVG path='/media/icons/duotune/arrows/arr064.svg' className='svg-icon-5' />
          </Link>
        </div>
      </div>

      <div className='tab-pane fade' id='tab_blast' role='tabpanel'>
        <div className='scroll-y mh-325px my-5 px-8'>
          {blast_list.map((alert:any, index:any) => (
            <div key={`alert${index}`} className='d-flex flex-stack py-4'>
              <div className='d-flex align-items-center'>
                <div className='symbol symbol-35px me-4'>
                  <span className={clsx('symbol-label', `bg-light-primary`)}>
                    {' '}
                    <img src={toAbsoluteUrl('/media/main/notification/'+alert.type+'.png')} alt='Metronic' className={`w-100 svg-icon-2 svg-icon-primary`} />
                  </span>
                </div>

                <div className='mb-0 me-2'>
                  <Link to={`/${alert.menu}/${alert.crypt_id}/${alert.menu_sub}/${alert.crypt_sub_id}`} onClick={()=>updateNotif(alert.notification_id)} className='fs-6 text-gray-800 text-hover-primary fw-bolder'>
                    {alert.title}
                  </Link>
                  <div className='text-gray-400 fs-7'
                  dangerouslySetInnerHTML={{__html: alert.description.replace('\n', '<br/>').replace(/ *\@\@[^)]*\@\@ */g, "")}}
                  ></div>
                </div>
              </div>

              <span className='badge badge-light fs-8'>{dateFromNow(alert.date)}</span>
            </div>
          ))}
        </div>
      </div>

      <div className='tab-pane fade' id='tab_schedule' role='tabpanel'>
        <div className='scroll-y mh-325px my-5 px-8'>
          {schedule_list.map((alert:any, index:any) => (
            <div key={`alert${index}`} className='d-flex flex-stack py-4'>
              <div className='d-flex align-items-center'>
                <div className='symbol symbol-35px me-4'>
                  <span className={clsx('symbol-label', `bg-light-primary`)}>
                    {' '}
                    <img src={toAbsoluteUrl('/media/main/notification/'+alert.type+'.png')} alt='Metronic' className={`w-100 svg-icon-2 svg-icon-primary`} />
                  </span>
                </div>

                <div className='mb-0 me-2'>
                  <Link to={`/${alert.menu}/${alert.crypt_id}/${alert.menu_sub}/${alert.crypt_sub_id}`} onClick={()=>updateNotif(alert.notification_id)} className='fs-6 text-gray-800 text-hover-primary fw-bolder'>
                    {alert.title}
                  </Link>
                  <div className='text-gray-400 fs-7'
                  dangerouslySetInnerHTML={{__html: alert.description.replace('\n', '<br/>').replace(/ *\@\@[^)]*\@\@ */g, "")}}
                  ></div>
                </div>
              </div>

              <span className='badge badge-light fs-8'>{dateFromNow(alert.date)}</span>
            </div>
          ))}
        </div>
        <div className='py-3 text-center border-top'>
          <Link
            to='/crafted/pages/profile'
            className='btn btn-color-gray-600 btn-active-color-primary'
          >
            View All <KTSVG path='/media/icons/duotune/arrows/arr064.svg' className='svg-icon-5' />
          </Link>
        </div>
      </div>
      
      <div className='tab-pane fade' id='tab_board' role='tabpanel'>
        <div className='scroll-y mh-325px my-5 px-8'>
          {board_list.map((alert:any, index:any) => (
            <div key={`alert${index}`} className='d-flex flex-stack py-4'>
              <div className='d-flex align-items-center'>
                <div className='symbol symbol-35px me-4'>
                  <span className={clsx('symbol-label', `bg-light-primary`)}>
                    {' '}
                    <img src={toAbsoluteUrl('/media/main/notification/'+alert.type+'.png')} alt='Metronic' className={`w-100 svg-icon-2 svg-icon-primary`} />
                  </span>
                </div>

                <div className='mb-0 me-2'>
                  <Link to={`/${alert.menu}/${alert.crypt_id}/${alert.menu_sub}/${alert.crypt_sub_id}`} onClick={()=>updateNotif(alert.notification_id)} className='fs-6 text-gray-800 text-hover-primary fw-bolder'>
                    {alert.title}
                  </Link>
                  <div className='text-gray-400 fs-7'
                  dangerouslySetInnerHTML={{__html: alert.description.replace('\n', '<br/>').replace(/ *\@\@[^)]*\@\@ */g, "")}}
                  ></div>
                </div>
              </div>

              <span className='badge badge-light fs-8'>{dateFromNow(alert.date)}</span>
            </div>
          ))}
        </div>
      </div>

      <div className='tab-pane fade' id='tab_checkin' role='tabpanel'>
        <div className='scroll-y mh-325px my-5 px-8'>
          {checkin_list.map((alert:any, index:any) => (
            <div key={`alert${index}`} className='d-flex flex-stack py-4'>
              <div className='d-flex align-items-center'>
                <div className='symbol symbol-35px me-4'>
                  <span className={clsx('symbol-label', `bg-light-primary`)}>
                    {' '}
                    <img src={toAbsoluteUrl('/media/main/notification/'+alert.type+'.png')} alt='Metronic' className={`w-100 svg-icon-2 svg-icon-primary`} />
                  </span>
                </div>

                <div className='mb-0 me-2'>
                  <Link to={`/${alert.menu}/${alert.crypt_id}/${alert.menu_sub}/${alert.crypt_sub_id}`} onClick={()=>updateNotif(alert.notification_id)} className='fs-6 text-gray-800 text-hover-primary fw-bolder'>
                    {alert.title}
                  </Link>
                  <div className='text-gray-400 fs-7'
                  dangerouslySetInnerHTML={{__html: alert.description.replace('\n', '<br/>').replace(/ *\@\@[^)]*\@\@ */g, "")}}
                  ></div>
                </div>
              </div>

              <span className='badge badge-light fs-8'>{dateFromNow(alert.date)}</span>
            </div>
          ))}
        </div>
      </div>
      
      <div className='tab-pane fade' id='tab_docs' role='tabpanel'>
        <div className='scroll-y mh-325px my-5 px-8'>
          {docs_list.map((alert:any, index:any) => (
            <div key={`alert${index}`} className='d-flex flex-stack py-4'>
              <div className='d-flex align-items-center'>
                <div className='symbol symbol-35px me-4'>
                  <span className={clsx('symbol-label', `bg-light-primary`)}>
                    {' '}
                    <img src={toAbsoluteUrl('/media/main/notification/'+alert.type+'.png')} alt='Metronic' className={`w-100 svg-icon-2 svg-icon-primary`} />
                  </span>
                </div>

                <div className='mb-0 me-2'>
                  <Link to={`/${alert.menu}/${alert.crypt_id}/${alert.menu_sub}/${alert.crypt_sub_id}`} onClick={()=>updateNotif(alert.notification_id)} className='fs-6 text-gray-800 text-hover-primary fw-bolder'>
                    {alert.title}
                  </Link>
                  <div className='text-gray-400 fs-7'
                  dangerouslySetInnerHTML={{__html: alert.description.replace('\n', '<br/>').replace(/ *\@\@[^)]*\@\@ */g, "")}}
                  ></div>
                </div>
              </div>

              <span className='badge badge-light fs-8'>{dateFromNow(alert.date)}</span>
            </div>
          ))}
        </div>
      </div>

    </div>
  </div>
  );
          }
const Navbar = () => {
  const {config} = useLayout();
  const {currentUser} = useAuth();
  const [list, setList] = useState<any>([]);

  const getData = () => {
    axios.get(API().getAllNotification)
    .then((response) => {
        let res = response.data;
        setList(res.data);
    })
    .catch((error) => {
        setList([]);
    });
  }

  useEffect(()=>{
    getData();
  },[])

  return (
    <div className='app-navbar flex-shrink-0'>
      {/* <div className={clsx('app-navbar-item align-items-stretch', itemClass)}>
        <Search />
      </div> */}

      {/* <div className={clsx('app-navbar-item', itemClass)}>
        <div id='kt_activities_toggle' className={btnClass}>
          <KTSVG path='/media/icons/duotune/general/gen032.svg' className={btnIconClass} />
        </div>
      </div> */}

      <div className={clsx('app-navbar-item', itemClass)}>
        <div
          data-kt-menu-trigger="{default: 'click'}"
          data-kt-menu-attach='parent'
          data-kt-menu-placement='bottom-end'
          className={clsx('position-relative', btnClass)}
        >
          <KTSVG path='/media/icons/duotune/general/gen022.svg' className={btnIconClass} />
          <span className='badge badge-circle badge-success position-absolute translate-middle top-0 start-50 animation-blink' style={{fontSize:'10px', margin:0, padding:0, minWidth:'1rem', height:'1rem'}}>
            {list.length}
          </span>
        </div>
        <HeaderNotificationsMenu list={list} setList={setList}/>
      </div>

      {/* <div className={clsx('app-navbar-item', itemClass)}>
        <div className={clsx('position-relative', btnClass)} id='kt_drawer_chat_toggle'>
          <KTSVG path='/media/icons/duotune/communication/com012.svg' className={btnIconClass} />
          <span className='bullet bullet-dot bg-success h-6px w-6px position-absolute translate-middle top-0 start-50 animation-blink' />
        </div>
      </div> */}

      {/* <div className={clsx('app-navbar-item', itemClass)}>
        <ThemeModeSwitcher toggleBtnClass={clsx('btn-active-light-primary btn-custom')} />
      </div> */}

      <div className={clsx('app-navbar-item', itemClass)}>
        <div
          className={clsx('cursor-pointer symbol', userAvatarClass)}
          data-kt-menu-trigger="{default: 'click'}"
          data-kt-menu-attach='parent'
          data-kt-menu-placement='bottom-end'
        >
          {currentUser?.gambar && <img src={toAbsoluteUrl(currentUser?.gambar)} alt='Pic' />}
          {currentUser?.nama.substring(0, 1) && (
            <span className={`symbol-label bg-${currentUser.inisial_color} text-inverse--${currentUser.inisial_color} fw-bolder`}>
              {currentUser.nama.substring(0, 1)}
            </span>
          )}
        </div>
        <HeaderUserMenu />
      </div>

      {config.app?.header?.default?.menu?.display && (
        <div className='app-navbar-item d-lg-none ms-2 me-n3' title='Show header menu'>
          <div
            className='btn btn-icon btn-active-color-primary w-35px h-35px'
            id='kt_app_header_menu_toggle'
          >
            <KTSVG path='/media/icons/duotune/text/txt001.svg' className={btnIconClass} />
          </div>
        </div>
      )}
    </div>
  )
}

export {Navbar}
