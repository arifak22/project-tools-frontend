/* eslint-disable jsx-a11y/anchor-is-valid */
import {FC, useEffect, useState} from 'react'
// import {useIntl} from 'react-intl'
import {PageTitle} from '../../../_metronic/layout/core'

import { Link } from "react-router-dom";
import axios from 'axios';
import clsx from 'clsx';

import { API } from '../../services';
import { Loading } from '../../helper/component';
import { getColorRandom } from '../../helper/tool';

import { KTSVG } from '../../../_metronic/helpers/components/KTSVG';

import * as Yup from 'yup'
import {useFormik} from 'formik'
import { Modal } from 'react-bootstrap';


const cardSchema = Yup.object().shape({
    master_card_level_id: Yup.number(),
    title: Yup.string()
        .min(2)
        .required('Wajib di isi')
        .max(100, 'Maksimal 100 Karakter'),
    description: Yup.string()
        .max(200, 'Maksimal 200 Karakter'),
});

var initialValues = {
    master_card_level_id: 0,
    title               : '',
    description         : '',
    method              : 'insert',
}

// const initialValues = {};


const HomePage: FC = () => {
    const [list, setList]           = useState<any[]>([]);
    const [showModal, setShowModal] = useState(false);
    
    const formik = useFormik({
        initialValues,
        validationSchema: cardSchema,
        onSubmit: async (values, {setStatus}) => {
            try {
                await axios.post(API().postCard, values).then((response)=>{
                    var res = response.data;
                    if(res.api_status === 1){
                        getData();
                        formik.resetForm();
                        setStatus({msg: res.api_message, status: 'success'});
                        setTimeout(function() { 
                            setShowModal(false);
                            formik.resetForm();
                        }, 1000);
                    }else{
                        setStatus({msg: res.api_message, status: 'warning'});
                    }
                });
            } catch (error) {
                console.error(error)
                setStatus({msg: 'Error, Hubungi IT', status: 'danger'});
            }
        },
    });
    // const { setFieldValue } = useFormikContext() ?? {};

    useEffect(() => {
        getData(); // this will fire only on first render
    },[]);

    const getData = () => {
        axios.get(API().getMyGroup)
          .then((response) => {
              let res = response.data;
              setList(res.data);
              console.log(res);
              localStorage.setItem('listMenu', JSON.stringify(res.data));
          })
          .catch((error) => {
            console.log('success', error);
            setList([]);
          });
    }

    if(list.length === 0){
        return <Loading/>
    }

    return (
        <>
            <Modal show={showModal}>
                    <form 
                     onSubmit={formik.handleSubmit}
                     noValidate
                    >
                        <div className="modal-header">
                            <h5 className="modal-title">Create New Team</h5>
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
                            <input type="hidden" {...formik.getFieldProps('master_card_level_id')} name="master_card_level_id"/>
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
                                    <span role='alert'>{formik.errors.title}</span>
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
                                    <span role='alert' className='text-danger'>{formik.errors.description}</span>
                                </div>
                                )}
                            </div>
                        </div>
                        <div className="modal-footer">
                            <button
                                type="button"
                                className="btn btn-light"
                                onClick={()=>setShowModal(false)}
                            >
                            Close
                            </button>
                            <button type="submit" className="btn btn-primary" disabled={formik.isSubmitting || !formik.isValid}>
                            {!formik.isSubmitting && <span className='indicator-label'>Simpan</span>}
                                {formik.isSubmitting && (
                                    <span className='indicator-progress' style={{display: 'block'}}>
                                    Please wait...
                                    <span className='spinner-border spinner-border-sm align-middle ms-2'></span>
                                    </span>
                                )}
                            </button>
                        </div>
                    </form>
            </Modal>

            {list.map((item, index) => ( //MAP MASTER LEVEL (Perusahaan, Subdit, dinas, projek)
            <div key={index}>
                <div className='row'>
                   
                    <div className='d-flex flex-wrap flex-stack mb-2'>
                    
                        <h3 className='fw-bolder my-2'>
                        <i className={item['icon_parent'] + ' fs-2x'}></i>
                        {' ' + item['card_parent']}
                        </h3>

                        <div className='d-flex flex-wrap my-2'>
                        <a
                            href='#'
                            className='btn btn-primary btn-sm'
                            onClick={()=> {formik.setFieldValue('master_card_level_id', item['master_card_level_id']); setShowModal(true)}}
                        >
                           New Team
                        </a>
                        </div>
                    </div>
                    {item['child'] ? item['child'].map((_item2: any, index2: any) => //Map Kartu 
                    
                    <div className='col-md-3' style={{marginBottom: '20px'}} key={index2}>
                        <Link to={"/card/"+_item2['card_id_crypt']} className="card hover-elevate-up shadow-sm parent-hover">
                        <div className={`card card-flush`}>
                            <div className='card-header pt-5'>
                                <div className='card-title d-flex flex-column'>
                                    <div className='card-title d-flex flex-column'>
                                        <span className='fs-2hx fw-bold text-dark me-2 lh-1 ls-n2'>{_item2['title']}</span>
                                        <span className='text-gray-400 pt-1 fw-semibold fs-6'>{_item2['description']}</span>
                                    </div>
                                </div>
                            </div>
                            <div className='card-body d-flex flex-column justify-content-end pe-0'>
                                <span className='fs-6 fw-bolder text-gray-800 d-block mb-2'>anggota:</span>
                                <div className='symbol-group symbol-hover flex-nowrap'>
                                    
                                    {_item2['member'] ? _item2['member'].map((_item3: any, index3: any) => ( //Map Anggota
                                        (index3 <= 5) ?
                                    <div
                                        className='symbol symbol-35px symbol-circle'
                                        data-bs-toggle='tooltip'
                                        title={_item3['nama']}
                                        key={`cw7-item-${index3}`}
                                    >

                                        <span
                                            className={clsx(
                                            'symbol-label fw-bold',
                                            getColorRandom(),
                                            getColorRandom('text'),
                                            )}
                                        >
                                            {_item3['nama'].charAt(0)}
                                        </span>
                                    </div>
                                    : 
                                    <a href='#' className='symbol symbol-35px symbol-circle'>
                                    <span className={clsx('symbol-label fs-8 fw-bold', 'bg-dark', 'text-gray-300')}>
                                        {_item2['member'].length - 6}
                                    </span>
                                    </a>
                                    )): <></>}

                                   
                                </div>
                            </div>
                        </div>
                        </Link>
                    </div>
                    ) : <></>}
                </div>
                <br/>
                <hr className='mb-2'/>
                
            </div>
            ))}

        </>
    )
}
const HomeWrapper: FC = () => {
  return(
      <>
        <PageTitle breadcrumbs={[]}>HomePage</PageTitle>
        <HomePage />
      </>
  );
}

export {HomeWrapper};