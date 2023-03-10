import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { AlertForm, ButtonSubmit, ButtonUploadFile, DateTimeForm, InputForm, ListUsers, LoadingComponent, TextForm, useWindowDimensions } from "../../../helper/component";
import * as Yup from 'yup'
import moment from "moment";
import { useFormik } from "formik";
import axios from "axios";
import { API } from "../../../services";
import { Modal } from "react-bootstrap";
import { KTSVG } from "../../../../_metronic/helpers";

function AddMember({showModal, setShowModal, refreshData, data} :any){
    const [users, setUsers] = useState<any>(data);
    const [value, setValue] = useState("");

    useEffect(()=>{
        setUsers(data);
    },[data]);
    const Checkbox = ({ obj, onChange }: any) => {
      return (
        <label key={obj['id']} className='form-check form-check-sm form-check-custom form-check-solid me-5'>
          <input className='form-check-input' name={obj['nama']} type='checkbox' value={obj.id}  checked={obj.checked} onChange={() => onChange({ ...obj, checked: !obj.checked })}/>
          <span className='form-check-label'>{obj['nama']}</span>
        </label>
      );
    };
    return (
      <Modal show={showModal} contentClassName='border border-primary border-dashed rounded'>
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
              <ButtonSubmit label="Apply" onClick={()=>{setShowModal(false); refreshData(users)}}/>
            </div>
          </div>
        </div>
      </Modal>
    )
}

  
const ModalForm = ({showModal, setShowModal, refreshData, data}:any) => {
    const [showModalMember, setShowModalMember] = useState(false);
    const { height }                            = useWindowDimensions();
    const param                                 = useParams();
    const [users, setUsers]                     = useState<any>([]);

    const cardSchema = Yup.object().shape({
        card_blast_id: Yup.number(),
        id_crypt: Yup.string().required(),
        title: Yup.string()
            .min(2)
            .required()
            .max(100),
        message: Yup.string()
            .required()
            .max(1000),
        experied_date: Yup.date()
            .min(moment().startOf('day')),
        users: Yup.array(),
        lampiran: Yup.array().nullable(),
        is_private: Yup.mixed().oneOf(['Y', 'N'])
    });

    var initialValues = {
        card_blast_id: data ? data['card_blast_id']      : 0,
        id_crypt     : param.id,
        title        : data ? data['title']        : '',
        message      : data ? data['message']      : '',
        experied_date: data ? data['experied_date']: moment().add(3, 'days'),
        is_private   : data ? data['is_private']   : 'N',
        method       : data ? 'update'             : 'insert',
        lampiran     : data ? data['lampiran']     : [],
        users        : data ? data['users'] : users,
    }
    const formik = useFormik({
        initialValues,
        validationSchema: cardSchema,
        onSubmit: async (values, {setStatus}) => {
            try {
                values.experied_date = moment(values.experied_date).format('yyyy-MM-DD HH:mm');
                await axios.post(API().postBlastCreate, values).then((response)=>{
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
                console.log(error);
                setStatus({msg: 'Error, Hubungi IT', status: 'danger'});
            }
        },
    });

    const getMember = () => {
        setUsers([]);
        axios.get(API().getUserBlast + '?id_crypt=' + param.id)
        .then((response) => {
            let res = response.data;
            setUsers(res.data);
        })
        .catch((error) => {
            setUsers([]);
        });
    }
    
      useEffect(() => {
        if(showModal && !data){
            getMember(); // this will fire only on first render
        }
        if(data)
        setUsers(data['users']);
      },[showModal]);

      useEffect(()=>{
        formik.setFieldValue('users', users);
      }, [users]);

      return (
        // <div className='menu menu-sub menu-sub-dropdown w-250px w-md-300px' data-kt-menu='true'>
        <>
        <Modal show={showModal} fullscreen={true}>
            <form 
                onSubmit={formik.handleSubmit}
                noValidate
            >
                <div className="modal-header">
                    <h5 className="modal-title">Blast</h5>
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
                    <div className='scroll-y me-n5 pe-5' style={{height:`${height-120}px`}}>
                        <AlertForm formik={formik} />
                        <InputForm formik={formik} label='Title' name='title' />
                        <TextForm formik={formik} label='Message' name='message' rows={8}/>
                        <DateTimeForm formik={formik} label='Experied Date' name='experied_date' />

                        {/* USER NOTIFIED */}
                        <label className='form-label fs-6 fw-bolder text-dark'> Who do you wanna be notified?</label>
                        <button
                        type='button'
                        className='btn btn-sm btn-icon btn-color-primary btn-active-light-primary'
                        onClick={()=>{
                                if(users.length > 0){
                                    setShowModalMember(true);
                                }
                            }
                        }
                        >
                        <KTSVG path='/media/icons/duotune/arrows/arr013.svg' className='svg-icon-2' />
                        </button>
                        <LoadingComponent data={users} component={<AddMember showModal={showModalMember} data={users} setShowModal={setShowModalMember} refreshData={(val:any)=> {
                            setUsers(val);
                            }}/>} />
                        <br />
                        <LoadingComponent data={users} component={<ListUsers users={users.filter((x:any) => x.checked === 1 || x.checked === true)} />}/>
                        <br />
                        {/* USER NOTFIED END */}

                        {/* UPLOAD FILE */}
                        <label className='form-label fs-6 fw-bolder text-dark'>Attach some files?</label>
                        <ButtonUploadFile data={formik.values.lampiran} temp='Y' modul='blast' onChange={(file:any)=> {
                            formik.setFieldValue('lampiran', file);
                        }}/>
                        {/* UPLOAD FILE END */}

                        {/* PRIVATE OPTION */}
                        <div className='fv-row mb-8'>
                            <label className='form-label fs-6 fw-bolder text-dark'>Is the post for private only?</label>
                            <div className="form-check form-switch form-check-custom form-check-solid me-10">
                                <input className="form-check-input h-30px w-50px" type="checkbox" value="Y" 
                                onChange={(val)=>{
                                    var value = val.target.checked ? 'Y' : 'N';
                                    formik.setFieldValue('is_private',value);
                                }} id="flexSwitch30x50"/>
                                <label className="form-check-label" htmlFor="flexSwitch30x50">
                                    <b>Private</b>
                                </label>
                            </div>
                        </div>
                        {/* PRIVATE OPTION END*/}
                
                        <div className='d-flex justify-content-end'>
                            <ButtonSubmit label="Save" disabled={formik.isSubmitting || !formik.isValid} isLoading={formik.isSubmitting} type="submit"/>
                        </div>

                    </div>
                </div>
            </form>
        </Modal>
        </>
      )
}

export { ModalForm };