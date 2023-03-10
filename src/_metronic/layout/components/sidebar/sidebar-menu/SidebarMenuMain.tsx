/* eslint-disable react/jsx-no-target-blank */
import React, { useEffect, useState } from 'react'
// import {useIntl} from 'react-intl'
// import {KTSVG} from '../../../../helpers'
import {SidebarMenuItemWithSub} from './SidebarMenuItemWithSub'
import {SidebarMenuItem} from './SidebarMenuItem'

const SidebarMenuMain = () => {
  // const intl = useIntl()
  const [menu, setMenu] = useState([]);
  useEffect(()=>{
    let localMenu = JSON.parse(localStorage.getItem('listMenu') ?? '[]');
    setMenu(localMenu);
  },[]);

  return (
    <>
      <SidebarMenuItem
        to='/dashboard'
        icon='/media/icons/duotune/art/art002.svg'
        title='Home Page'
        fontIcon='bi-app-indicator'
      />
      {
         menu.map((item:any, index)=>{
          return(
            <div key={index}>
              <div className='menu-item'>
                <div className='menu-content pt-8 pb-2'>
                  <span className='menu-section text-muted text-uppercase fs-8 ls-1'>{item.card_parent}</span>
                </div>
              </div>
              {
                item.child.map((child:any, indexchild:any) =>{
                  return(
                    
                    <SidebarMenuItemWithSub
                      key={indexchild}
                      to={'card/' + child.card_id_crypt}
                      title={child.title}
                      fontIcon='bi-archive'
                      icon='/media/icons/duotune/general/gen022.svg'
                    >
                      <SidebarMenuItem to={'card/' + child.card_id_crypt} title='Dashboard' hasBullet={true} />
                      <SidebarMenuItem to={'card/' + child.card_id_crypt + '/chat'} title='Group Chat' hasBullet={true} />
                      <SidebarMenuItem to={'card/' + child.card_id_crypt + '/blast'} title='Blast' hasBullet={true} />
                      <SidebarMenuItem to={'card/' + child.card_id_crypt + '/schedule'} title='Schedule' hasBullet={true} />
                      <SidebarMenuItem to={'card/' + child.card_id_crypt + '/board'} title='Board' hasBullet={true} />
                      <SidebarMenuItem to={'card/' + child.card_id_crypt + '/checkin'} title='Check-in' hasBullet={true} />
                      <SidebarMenuItem to={'card/' + child.card_id_crypt + '/file'} title='Docs & File' hasBullet={true} />
                    </SidebarMenuItemWithSub>
                  );
                })
              }
            </div>
          );
        }) 
      }
      {/* <div className='menu-item'>
        <div className='menu-content pt-8 pb-2'>
          <span className='menu-section text-muted text-uppercase fs-8 ls-1'>Perusahaan</span>
        </div>
      </div>
      <SidebarMenuItemWithSub
        to='/card/1'
        title='PT Pelindo Energi Logistik'
        fontIcon='bi-archive'
        icon='/media/icons/duotune/general/gen022.svg'
      >
        <SidebarMenuItem to='/card/1/chat' title='Group Chat' hasBullet={true} />
        <SidebarMenuItem to='/card/1/blast' title='Blast' hasBullet={true} />
        <SidebarMenuItem to='/card/1/schedule' title='Schedule' hasBullet={true} />
        <SidebarMenuItem to='/card/1/board' title='Board' hasBullet={true} />
        <SidebarMenuItem to='/card/1/checkin' title='Check-in' hasBullet={true} />
        <SidebarMenuItem to='/card/1/file' title='Docs & File' hasBullet={true} />
      </SidebarMenuItemWithSub>
      
      <div className='menu-item'>
        <div className='menu-content pt-8 pb-2'>
          <span className='menu-section text-muted text-uppercase fs-8 ls-1'>Sub Direktorat</span>
        </div>
      </div>
      <SidebarMenuItemWithSub
        to='/card/2'
        title='K3L, Management Resiko & IT'
        fontIcon='bi-archive'
        icon='/media/icons/duotune/general/gen022.svg'
      >
        <SidebarMenuItem to='/card/2/chat' title='Group Chat' hasBullet={true} />
        <SidebarMenuItem to='/card/2/blast' title='Blast' hasBullet={true} />
        <SidebarMenuItem to='/card/2/schedule' title='Schedule' hasBullet={true} />
        <SidebarMenuItem to='/card/2/board' title='Board' hasBullet={true} />
        <SidebarMenuItem to='/card/2/checkin' title='Check-in' hasBullet={true} />
        <SidebarMenuItem to='/card/2/file' title='Docs & File' hasBullet={true} />
      </SidebarMenuItemWithSub>

      
      <div className='menu-item'>
        <div className='menu-content pt-8 pb-2'>
          <span className='menu-section text-muted text-uppercase fs-8 ls-1'>Dinas</span>
        </div>
      </div>
      <SidebarMenuItemWithSub
        to='/card/3'
        title='Management Resiko & IT'
        fontIcon='bi-archive'
        icon='/media/icons/duotune/general/gen022.svg'
      >
        <SidebarMenuItem to='/card/3/chat' title='Group Chat' hasBullet={true} />
        <SidebarMenuItem to='/card/3/blast' title='Blast' hasBullet={true} />
        <SidebarMenuItem to='/card/3/schedule' title='Schedule' hasBullet={true} />
        <SidebarMenuItem to='/card/3/board' title='Board' hasBullet={true} />
        <SidebarMenuItem to='/card/3/checkin' title='Check-in' hasBullet={true} />
        <SidebarMenuItem to='/card/3/file' title='Docs & File' hasBullet={true} />
      </SidebarMenuItemWithSub>

      
      <div className='menu-item'>
        <div className='menu-content pt-8 pb-2'>
          <span className='menu-section text-muted text-uppercase fs-8 ls-1'>Projek</span>
        </div>
      </div>
      <SidebarMenuItemWithSub
        to='/card/4'
        title='FIT PEL (IT Support & Discussion)'
        fontIcon='bi-archive'
        icon='/media/icons/duotune/general/gen022.svg'
      >
        <SidebarMenuItem to='/card/4/chat' title='Group Chat' hasBullet={true} />
        <SidebarMenuItem to='/card/4/blast' title='Blast' hasBullet={true} />
        <SidebarMenuItem to='/card/4/schedule' title='Schedule' hasBullet={true} />
        <SidebarMenuItem to='/card/4/board' title='Board' hasBullet={true} />
        <SidebarMenuItem to='/card/4/checkin' title='Check-in' hasBullet={true} />
        <SidebarMenuItem to='/card/4/file' title='Docs & File' hasBullet={true} />
      </SidebarMenuItemWithSub>
      
      <SidebarMenuItemWithSub
        to='/card/5'
        title='IMAIS, Easy PEL & Project Tools (IT Support & Discussion)'
        fontIcon='bi-archive'
        icon='/media/icons/duotune/general/gen022.svg'
      >
        <SidebarMenuItem to='/card/5/chat' title='Group Chat' hasBullet={true} />
        <SidebarMenuItem to='/card/5/blast' title='Blast' hasBullet={true} />
        <SidebarMenuItem to='/card/5/schedule' title='Schedule' hasBullet={true} />
        <SidebarMenuItem to='/card/5/board' title='Board' hasBullet={true} />
        <SidebarMenuItem to='/card/5/checkin' title='Check-in' hasBullet={true} />
        <SidebarMenuItem to='/card/5/file' title='Docs & File' hasBullet={true} />
      </SidebarMenuItemWithSub>
      
      <SidebarMenuItemWithSub
        to='/card/6'
        title='WITH PEL (IT Support & Discussion)'
        fontIcon='bi-archive'
        icon='/media/icons/duotune/general/gen022.svg'
      >
        <SidebarMenuItem to='/card/6/chat' title='Group Chat' hasBullet={true} />
        <SidebarMenuItem to='/card/6/blast' title='Blast' hasBullet={true} />
        <SidebarMenuItem to='/card/6/schedule' title='Schedule' hasBullet={true} />
        <SidebarMenuItem to='/card/6/board' title='Board' hasBullet={true} />
        <SidebarMenuItem to='/card/6/checkin' title='Check-in' hasBullet={true} />
        <SidebarMenuItem to='/card/6/file' title='Docs & File' hasBullet={true} />
      </SidebarMenuItemWithSub> */}

    </>
  )
}

export {SidebarMenuMain}
