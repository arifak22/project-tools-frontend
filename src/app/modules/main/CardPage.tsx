/* eslint-disable jsx-a11y/anchor-is-valid */
import axios from 'axios'
import {FC, useEffect, useState} from 'react'
import { Modal } from 'react-bootstrap'
import { Link, useParams } from 'react-router-dom'
// import {useIntl} from 'react-intl'
import {KTSVG, toAbsoluteUrl} from '../../../_metronic/helpers'
import {PageLink, PageTitle} from '../../../_metronic/layout/core'
import { ListUsers, LoadingComponent, RoundImage, ButtonSubmit, Loading } from '../../helper/component'
import { API } from '../../services'
import * as Yup from 'yup'
import {useFormik} from 'formik'
import clsx from 'clsx'
import { dateFromNow } from '../../helper/tool'

function AddMember({showModal, setShowModal, refreshData} :any){
  const [users, setUsers] = useState<any>(undefined);
  const [value, setValue] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [status, setStatus] = useState<any>();

  const {id} = useParams();
  const getMember = () => {
      axios.get(API().getUserMember + '?id_crypt=' + id)
        .then((response) => {
            let res = response.data;
            setUsers(res.data);
        })
        .catch((error) => {
          setUsers([]);
        });
  }

  const postMember = () => {
    setIsLoading(true);
    axios.post(API().postCardMember, {user: users, id_crypt :id})
      .then((response) => {
          let res = response.data;
          if(res.api_status === 1){
            getMember();
            refreshData();
            setStatus({msg: res.api_message, status: 'success'});
            setTimeout(function() { 
              setShowModal(false);
              setIsLoading(false);
              setStatus(null);
            }, 1000);
          }else{
            setStatus({msg: res.api_message, status: 'warning'});
            setIsLoading(false);
          }
      })
      .catch((error) => {
        setStatus({msg: 'Error, Hubungi IT', status: 'warning'});
        setIsLoading(false);
      });
}

  useEffect(() => {
    getMember(); // this will fire only on first render
  },[]);

  const Checkbox = ({ obj, onChange }: any) => {
    return (
      <label key={obj['id']} className='form-check form-check-sm form-check-custom form-check-solid me-5'>
        <input className='form-check-input' name={obj['nama']} type='checkbox' value={obj.id}  checked={obj.checked} onChange={() => onChange({ ...obj, checked: !obj.checked })}/>
        <span className='form-check-label'>{obj['nama']}</span>
      </label>
    );
  };
  return (
    <Modal show={showModal}>
      <div className="modal-header">
          <h5 className="modal-title">Add Member</h5>
          <div
            className="btn btn-icon btn-sm btn-active-light-primary ms-2"
            onClick={()=>setShowModal(false)}
            aria-label="Close"
          >
            <KTSVG
                path="/media/icons/duotune/arrows/arr061.svg"
                className="svg-icon svg-icon-2x"
            />
          </div>
      </div>
      <div className="modal-body">
        {status ? (<div className={'mb-lg-15 alert alert-'+status['status']}>
        <div className='alert-text font-weight-bold'>{status['msg']}</div>
        </div>) : <div></div>}
        <div className='px-7 py-5'>
          <div className='mb-5'>
            <label className='form-label fw-bold'>Search:</label>

            <div>
              <input
                className='form-control form-control-solid'
                onChange={(e) => setValue(e.target.value)}
                value={value}
              />
            </div>
          </div>

          <div className='mb-10'>
            <label className='form-label fw-bold'>List:</label>
            {users ? users.filter((x: any) => {return x['nama'].toLowerCase().match(value.toLowerCase())}).map((_u: any, i: any)=>{
              return (
              <div key={i}>
                <div className='mb-2 mt-2'>
                    <Checkbox
                    obj={_u}
                    onChange={(item: any) => {
                      setUsers(users.map((d: any) => (d.id === item.id ? item : d)));
                    }}
                    />
                </div>
                <div className='separator border-gray-200'></div>
              </div>
              )
            }) : <></>}
          </div>
          <div className='d-flex justify-content-end'>
            <ButtonSubmit label="Apply" disabled={isLoading} isLoading={isLoading} onClick={()=>postMember()}/>
          </div>
        </div>
      </div>
    </Modal>
  )
}

const cardSchema = Yup.object().shape({
  card_id: Yup.number(),
  title: Yup.string()
      .min(2)
      .required('Wajib di isi')
      .max(100, 'Maksimal 100 Karakter'),
  description: Yup.string()
      .max(200, 'Maksimal 200 Karakter'),
});

function Setting({showModal, setShowModal, refreshData, data} :any){
  var initialValues = {
    card_id             : data['card_id'],
    master_card_level_id: data['master_card_level_id'],
    title               : data['title'],
    description         : data['description'],
    method              : 'update'
  }
  const formik = useFormik({
    initialValues,
    validationSchema: cardSchema,
    onSubmit: async (values, {setStatus}) => {
        try {
            await axios.post(API().postCard, values).then((response)=>{
                var res = response.data;
                if(res.api_status === 1){
                    formik.resetForm();
                    setStatus({msg: res.api_message, status: 'success'});
                    setTimeout(function() { 
                        refreshData();
                        setShowModal(false);
                        formik.resetForm();
                    }, 1000);
                }else{
                    setStatus({msg: res.api_message, status: 'warning'});
                }
            });
        } catch (error) {
            setStatus({msg: 'Error, Hubungi IT', status: 'danger'});
        }
    },
});

  useEffect(() => {
    // getMember(); // this will fire only on first render
  },[]);

  return (
    // <div className='menu menu-sub menu-sub-dropdown w-250px w-md-300px' data-kt-menu='true'>
    <Modal show={showModal}>
       <form 
          onSubmit={formik.handleSubmit}
          noValidate
        >
      <div className="modal-header">
          <h5 className="modal-title">Setting Team</h5>
          <div
            className="btn btn-icon btn-sm btn-active-light-primary ms-2"
            onClick={()=>setShowModal(false)}
            aria-label="Close"
          >
            <KTSVG
                path="/media/icons/duotune/arrows/arr061.svg"
                className="svg-icon svg-icon-2x"
            />
          </div>
      </div>
      <div className="modal-body">
        {formik.status ? (<div className={'mb-lg-15 alert alert-'+formik.status['status']}>
        <div className='alert-text font-weight-bold'>{formik.status['msg']}</div>
        </div>) : <div></div>}
        <div className='fv-row mb-8'>
            <label className='form-label fs-6 fw-bolder text-dark'>Judul</label>
            <input
            placeholder='Judul'
            {...formik.getFieldProps('title')}
            className={clsx(
                'form-control bg-transparent',
                {'is-invalid': formik.touched.title && formik.errors.title},
                {
                'is-valid': formik.touched.title && !formik.errors.title,
                }
            )}
            type='text'
            name='title'
            autoComplete='off'
            />
            {formik.touched.title && formik.errors.title && (
            <div className='fv-plugins-message-container'>
                <span role='alert'>{formik.errors.title.toString()}</span>
            </div>
            )}
        </div>
        <div className='fv-row mb-8'>
            <label className='form-label fs-6 fw-bolder text-dark'>Deskripsi</label>
            <input
            placeholder='Deskripsi'
            {...formik.getFieldProps('description')}
            className={clsx(
                'form-control bg-transparent',
                {'is-invalid': formik.touched.description && formik.errors.description},
                {
                'is-valid': formik.touched.description && !formik.errors.description,
                }
            )}
            type='text'
            name='description'
            autoComplete='off'
            />
            {formik.touched.description && formik.errors.description && (
            <div className='fv-plugins-message-container'>
                <span role='alert'>{formik.errors.description.toString()}</span>
            </div>
            )}
        </div>

        <div className='d-flex justify-content-end'>
          <ButtonSubmit label="Simpan" disabled={formik.isSubmitting || !formik.isValid} isLoading={formik.isSubmitting} type="submit"/>
        </div>

      </div>
      </form>
    </Modal>
  )
}


function LogTipe({data} :any){
  var componentChild = <></>;
  if(data.activity_log_tipe_id == 2){
    componentChild = <div className='overflow-auto pb-5'>
      {data.child.map((item: any, i: any) => {
        return(
          <div key={i} className='d-flex align-items-center border border-dashed border-gray-300 rounded px-2 py-2 mb-5'>

          <RoundImage user={item} size='25px'/>
          <a href='#' className='fs-7 text-dark text-hover-primary fw-bold w-200px min-w-100px'>
            {item.nama}
          </a>

          <div className='min-w-125px pe-2'>
            <span className={`badge badge-light-${item.flag}`}>{item.description}</span>
          </div>
        </div>
      )
      })}
    </div> 
  }
  if(data.activity_log_tipe_id == 7 || data.activity_log_tipe_id == 11 ){
    componentChild = <div className='pb-5'>
      {data.child.map((item: any, i: any) => {
        return(
          <div key={i} className='d-flex align-items-center border border-dashed border-gray-300 rounded px-2 py-2 mb-1'>
          <div className='min-w-125px pe-2'>
            <span className={``}><i>{item.description}</i></span>
          </div>
        </div>
      )
      })}
    </div> 
  }
  return(
    <div className='timeline-item'>
      <div className='timeline-line w-40px'></div>

      <div className='timeline-icon symbol symbol-circle symbol-40px me-4'>
        <div className='symbol-label bg-light'>
          {/* <KTSVG
            path='/media/icons/duotune/communication/com003.svg'
            className='svg-icon-2 svg-icon-gray-500'
          /> */}
          <i className={data.icon}></i>
        </div>
      </div>

      <div className='timeline-content mb-10 mt-n1'>
        <div className='pe-3 mb-5'>
          <div className='fs-5 fw-bold mb-2'>
            {data.title}
          </div>

          <div className='d-flex align-items-center mt-1 fs-6'>
            <div className='text-muted me-2 fs-7'>{data.noted_date} </div>
            <i className='las la-user'></i>
            <a href='#' className='text-primary fw-bolder me-1'>
              {data.noted_by}
            </a>
          </div>
        </div>
        {componentChild}
      </div>
    </div>
  )
}

function Activity({id, list}:any){
  return(
    <div className='card mb-5 mb-xxl-8'>
      <div className='card-header'>
        <h3 className='card-title fw-bolder text-dark'>Activity Logs</h3>

        <div className='card-toolbar'>
        </div>
      </div>
      <div className='card-body position-relative'>
        <div
          className='position-relative scroll-y me-n5 pe-5'
          style={{maxHeight:'300px'}}
          data-kt-scroll='true'
          data-kt-scroll-height='auto'
          data-kt-scroll-offset='5px'
        >
          <div className='timeline'>
            <LoadingComponent data={list} component={list.map((item: any, index: any) => (<LogTipe key={index} data={item}/>))}/>
          </div>
        </div>
      </div>
      <div className='card-footer py-5 text-center' id='kt_activities_footer'>
        <Link to='/crafted/pages/profile' className='btn btn-bg-body text-primary'>
          View All Activities
          <KTSVG
            path='/media/icons/duotune/arrows/arr064.svg'
            className='svg-icon-3 svg-icon-primary'
          />
        </Link>
      </div>
    </div>
    )
}

const CardWrapper: FC = () => {
  const [users, setUsers] = useState<any>(undefined);
  const [showModal, setShowModal] = useState(false);
  const [showModalTeam, setShowModalTeam] = useState(false);

  //NOTIFICATION
  const [unreadChat, setUnreadChat] = useState(0);
  const [lastChat, setLastChat]     = useState('');
  const [totalBlast, setTotalBlast] = useState(0);
  const [lastBlast, setLastBlast]   = useState('');
  const [totalEvent, setTotalEvent] = useState(0);
  const [lastEvent, setLastEvent]   = useState('');


  const {id} = useParams();
  const getMember = () => {
      axios.get(API().getCardMember + '?id_crypt=' + id)
        .then((response) => {
            let res = response.data;
            setUsers(res.data);
        })
        .catch((error) => {
          setUsers([]);
        });
  }

  useEffect(() => {
    getMember(); // this will fire only on first render
    getData(); // this will fire only on first render
    getActivity(); // this will fire only on first render
    getDataNotification();
  },[]);


  const [list, setList] = useState<any[]>([]);
  const getActivity = () => {
    axios.get(API().getActivity + '?id_crypt=' + id)
      .then((response) => {
          let res = response.data;
          setList(res.data);
      })
      .catch((error) => {
        setList([]);
      });
}

  const [data, setData] = useState<any>(null);
  const getData = () => {
      setData(null);
      axios.get(API().getCardDetail + '?id_crypt=' + id)
        .then((response) => {
            let res = response.data;
            setData(res.data);
        })
        .catch((error) => {
          setData([]);
        });
  }

  const getDataNotification = () => {
    setData(null);
    axios.get(API().getCardNotification + '?id_crypt=' + id)
      .then((response) => {
          let res = response.data;
          setUnreadChat(res.chat.unread);
          setLastChat(res.chat.last);
          setTotalBlast(res.blast.total);
          setLastBlast(res.blast.last);
          setTotalEvent(res.schedule.total);
          setLastEvent(res.schedule.last);
      })
      .catch((error) => {
        setUnreadChat(0);
        setLastChat('error');
        setTotalBlast(0);
        setLastBlast('error');
        setTotalEvent(0);
        setLastEvent('error');
      });
}

  // if(!data){
  //   return <Loading/>
  // }

  return(
  <>
      <PageTitle breadcrumbs={profileBreadCrumbs}>
        {data?.title}
      </PageTitle>
    { !data ? <Loading/> : !users ? <Loading/> : <></> }
    <div className='row'>
      <div className='col-xl-6'>
        <div className='row'>
          <div className='col-sm-6 col-xl-6' style={{marginBottom: '20px'}}>
            <Link className='card border border-2 border-gray-300 border-hover disabled' state={{data:data, users: users}} to={'/card/' + id + '/chat'}>
              <div className='card-header flex-nowrap border-0 pt-9'>
                <div className='card-title m-0'>
                  <div className='symbol symbol-45px w-45px bg-light me-5'>
                    <img src={toAbsoluteUrl('/media/main/group-chat.png')} alt='Metronic' className='p-3' />
                  </div>

                  <div className='fs-4 fw-bold text-gray-600 m-0'>
                    Group Chat
                  </div>
                </div>
              </div>

              <div className='card-body d-flex flex-column px-9 pt-6 pb-8'>
                <div className='d-flex align-items-center flex-wrap mb-5 mt-auto fs-6'>

                  <div className={`fw-bolder me-2text-success`}>
                   {unreadChat+' '}
                  </div>

                  <div className='fw-bold text-black'> &nbsp;Unread Messages</div>
                </div>

                <div className='d-flex align-items-center fw-bold'>
                  <span className='badge bg-light text-gray-700 px-3 py-2 me-2'>Last: {dateFromNow(lastChat)}</span>
                </div>
              </div>
            </Link>
          </div>
          <div className='col-sm-6 col-xl-6' style={{marginBottom: '20px'}}>
            <Link className='card border border-2 border-gray-300 border-hover' state={{data:data, users: users}} to={'/card/' + id + '/blast'}>
              <div className='card-header flex-nowrap border-0 pt-9'>
                <div className='card-title m-0'>
                  <div className='symbol symbol-45px w-45px bg-light me-5'>
                    <img src={toAbsoluteUrl('/media/main/megafon.png')} alt='Metronic' className='p-3' />
                  </div>

                  <div className='fs-4 fw-bold text-gray-600 m-0'>
                    Blast
                  </div>
                </div>
              </div>

              <div className='card-body d-flex flex-column px-9 pt-6 pb-8'>
                <div className='d-flex align-items-center flex-wrap mb-5 mt-auto fs-6'>

                  <div className={`fw-bolder me-2text-success`}>
                    {totalBlast + ' '}
                  </div>

                  <div className='fw-bold text-black'> &nbsp;Blast Info !</div>
                </div>

                <div className='d-flex align-items-center fw-bold'>
                  <span className='badge bg-light text-gray-700 px-3 py-2 me-2'>Last: {dateFromNow(lastBlast)}</span>
                </div>
              </div>
            </Link>
          </div>
          <div className='col-sm-6 col-xl-6' style={{marginBottom: '20px'}}>
            <Link className='card border border-2 border-gray-300 border-hover' state={{data:data, users: users}} to={'/card/' + id + '/schedule'}>
              <div className='card-header flex-nowrap border-0 pt-9'>
                <div className='card-title m-0'>
                  <div className='symbol symbol-45px w-45px bg-light me-5'>
                    <img src={toAbsoluteUrl('/media/main/calendar.png')} alt='Metronic' className='p-3' />
                  </div>

                  <div className='fs-4 fw-bold text-gray-600 m-0'>
                    Schedule
                  </div>
                </div>
              </div>

              <div className='card-body d-flex flex-column px-9 pt-6 pb-8'>
                <div className='d-flex align-items-center flex-wrap mb-5 mt-auto fs-6'>

                  <div className={`fw-bolder me-2text-success`}>
                  {totalEvent + ' '}
                  </div>

                  <div className='fw-bold text-black'> &nbsp;Upcoming Event</div>
                </div>

                <div className='d-flex align-items-center fw-bold'>
                  <span className='badge bg-light text-gray-700 px-3 py-2 me-2'>Last:  {dateFromNow(lastEvent)}</span>
                </div>
              </div>
            </Link>
          </div>


          <div className='col-sm-6 col-xl-6' style={{marginBottom: '20px'}}>
            <Link className='card border border-2 border-gray-300 border-hover' to={''}>
              <div className='card-header flex-nowrap border-0 pt-9'>
                <div className='card-title m-0'>
                  <div className='symbol symbol-45px w-45px bg-light me-5'>
                    <img src={toAbsoluteUrl('/media/main/board.png')} alt='Metronic' className='p-3' />
                  </div>

                  <div className='fs-4 fw-bold text-gray-600 m-0'>
                    Board
                  </div>
                </div>
              </div>

              <div className='card-body d-flex flex-column px-9 pt-6 pb-8'>
                <div className='d-flex align-items-center flex-wrap mb-5 mt-auto fs-6'>

                  <div className={`fw-bolder me-2text-success`}>
                    10 {' '}
                  </div>

                  <div className='fw-bold text-black'> &nbsp;Catatan belum diselesaikan</div>
                </div>

                <div className='d-flex align-items-center fw-bold'>
                  <span className='badge bg-light text-gray-700 px-3 py-2 me-2'>Last: 20 Januari 2023 - 20:20</span>
                </div>
              </div>
            </Link>
          </div>

          <div className='col-sm-6 col-xl-6' style={{marginBottom: '20px'}}>
            <Link className='card border border-2 border-gray-300 border-hover' to={''}>
              <div className='card-header flex-nowrap border-0 pt-9'>
                <div className='card-title m-0'>
                  <div className='symbol symbol-45px w-45px bg-light me-5'>
                    <img src={toAbsoluteUrl('/media/main/repeat.png')} alt='Metronic' className='p-3' />
                  </div>

                  <div className='fs-4 fw-bold text-gray-600 m-0'>
                    Check-ins
                  </div>
                </div>
              </div>

              <div className='card-body d-flex flex-column px-9 pt-6 pb-8'>
                <div className='d-flex align-items-center flex-wrap mb-5 mt-auto fs-6'>

                  <div className={`fw-bolder me-2text-success`}>
                    0 {' '}
                  </div>

                  <div className='fw-bold text-black'> &nbsp;Perlu Check-ins</div>
                </div>

                <div className='d-flex align-items-center fw-bold'>
                  <span className='badge bg-light text-gray-700 px-3 py-2 me-2'>Last: 20 Januari 2023 - 20:20</span>
                </div>
              </div>
            </Link>
          </div>

          <div className='col-sm-6 col-xl-6' style={{marginBottom: '20px'}}>
            <Link className='card border border-2 border-gray-300 border-hover' to={''}>
              <div className='card-header flex-nowrap border-0 pt-9'>
                <div className='card-title m-0'>
                  <div className='symbol symbol-45px w-45px bg-light me-5'>
                    <img src={toAbsoluteUrl('/media/main/search.png')} alt='Metronic' className='p-3' />
                  </div>

                  <div className='fs-4 fw-bold text-gray-600 m-0'>
                    Docs & Files
                  </div>
                </div>
              </div>

              <div className='card-body d-flex flex-column px-9 pt-6 pb-8'>
                <div className='d-flex align-items-center flex-wrap mb-5 mt-auto fs-6'>

                  <div className={`fw-bolder me-2text-success`}>
                    0 {' '}
                  </div>

                  <div className='fw-bold text-black'> &nbsp;Total Files</div>
                </div>

                <div className='d-flex align-items-center fw-bold'>
                  <span className='badge bg-light text-gray-700 px-3 py-2 me-2'>Last: 20 Januari 2023 - 20:20</span>
                </div>
              </div>
            </Link>
          </div>
        </div>
      </div>
      <div className='col-xl-6'>
        <div className={`card mb-5 mb-xxl-8`}>
          <div className='card-body pb-0'>
            <div className='d-flex align-items-center mb-5'>
              <div className='d-flex align-items-center flex-grow-1'>
                <div className='d-flex flex-column'>
                  <a href='#' className='text-gray-800 text-hover-primary fs-6 fw-bold'>
                    <LoadingComponent data={data} component={data?.title} />
                    {/* <LoadingComponent data={data} component={data['title']} /> */}
                  </a>
                  <span className='text-gray-400 fw-semibold'>
                  <LoadingComponent data={data} component={data?.description} />
                    
                  </span>
                </div>
              </div>
              <div className='my-0'>
                <button
                  type='button'
                  className='btn btn-primary btn-sm'
                  onClick={()=>setShowModalTeam(true)}
                  disabled={data? false : true}
                >
                  Setting Team
                </button>
                {data ? 
                <Setting showModal={showModalTeam} data={data} setShowModal={setShowModalTeam} refreshData={()=> {getActivity(); getMember(); getData();}}/>
                : null}
                {/* <AddMember /> */}
              </div>
            </div>

            <div className='separator mb-4'></div>

            <div className='d-flex align-items-center mb-5'>
              <div className='d-flex align-items-center flex-grow-1'>
                <LoadingComponent data={users} component={<ListUsers users={users} />}/>

              </div>

              <div className='my-0'>
                <button
                  type='button'
                  className='btn btn-sm btn-icon btn-color-primary btn-active-light-primary'
                  onClick={()=>setShowModal(true)}
                >
                  <KTSVG path='/media/icons/duotune/arrows/arr013.svg' className='svg-icon-2' />
                </button>
                <AddMember showModal={showModal} setShowModal={setShowModal} refreshData={()=> {getActivity(); getMember()}}/>
              </div>
              {/* end::Menu */}
            </div>
            {/* end::Header */}

          </div>
          {/* end::Body */}
        </div>
        <Activity id={id} list={list}/>
      </div>
    </div>
  </>
)
}
const profileBreadCrumbs: Array<PageLink> = [
  {
    title: 'HomePage',
    path: '/dashboard',
    isSeparator: false,
    isActive: false,
  },
]

export {CardWrapper};