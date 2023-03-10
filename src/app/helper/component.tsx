import { TextField } from '@mui/material'
import { DateTimePicker, LocalizationProvider } from '@mui/x-date-pickers'
import { AdapterMoment } from '@mui/x-date-pickers/AdapterMoment'
import ChunkedUploady, { useItemFinishListener, useItemProgressListener } from '@rpldy/chunked-uploady'
import { asUploadButton } from '@rpldy/upload-button'
import axios from 'axios'
import clsx from 'clsx'
import React, { useLayoutEffect } from 'react'
import {createRef, FC, useEffect, useRef, useState} from 'react'
import {OverlayTrigger, Tooltip, ProgressBar, Modal, Alert} from 'react-bootstrap'

import * as Yup from 'yup'
import { KTSVG, toAbsoluteUrl } from '../../_metronic/helpers'
import { IconUserModel } from '../modules/profile/ProfileModels'
import { API, auth } from '../services'
const FileDownload = require('js-file-download');
// var auth = window.localStorage.getItem('kt-auth-react-v') ? window.localStorage.getItem('kt-auth-react-v') : "{}";

Yup.setLocale({
    mixed: {
        default: 'Error',
        // required: 'This field is required'
    },
    string: {
        // min     : 'Minimal ${min} Karakter',
        // max     : 'Maksimal ${max} Karakter',
    },
})

// const downloadFile = async (modul:any, id:any, filename:any) =>{
//   // const [isDownload, setIsDownload]     = useState<any>([]);
//   let isDownload: any = [];
//   // setIsDownload((isDownload:any)=> [...isDownload, id]);
//   isDownload = [...isDownload, id];
//   return await axios({
//     url: API().getDownloadFile + '?modul=' + modul + '&id=' + id,
//     method: 'GET',
//     responseType: 'blob', // Important
//   }).then((response) => {
//       FileDownload(response.data, filename);
//       return isDownload = [isDownload.slice(id)];
//   });
// }
const ButtonDownloadFile = ({id, filename, modul}:any) => {
  const [isDownload, setIsDownload]     = useState(false);
  const downloadFile = () =>{

    setIsDownload(true);
    axios({
      url: API().getDownloadFile + '?modul=' + modul + '&id=' + id,
      method: 'GET',
      responseType: 'blob', // Important
    }).then((response) => {
        FileDownload(response.data, filename);
        setIsDownload(false);
    });
  }
  return(
    <button
        className='btn btn-sm btn-light btn-color-muted btn-active-light-success px-4 py-2 me-4'
        onClick={()=>{downloadFile()}} 
        disabled = {isDownload}
    >
    {isDownload ? (
          // <span className='indicator-progress' style={{display: 'block'}}>
          <span className='spinner-border spinner-border-sm align-middle me-2'></span>
          // </span>
      ) : 
    <KTSVG
        path='/media/icons/duotune/communication/com008.svg'
        className='svg-icon-3 mb-3'
    />
  }
      {filename}
    </button>
  )
}

const ButtonUploadFile = ({temp = 'N', modul, onChange, data = []}:any) => {
  const [progress, setProgress] = useState(0);
  const [tempFile, setTempFile] = useState<any>(data);

  const LogProgress = () => {
    useItemProgressListener((item) => {
        setProgress(item.completed === 100 ? 0 : item.completed);
    });
    useItemFinishListener((item) => {
        var res = item.uploadResponse.results[item.uploadResponse.results.length - 1].data;
        setTempFile([...tempFile,res]);
        // onChange(tempFile);
    });
  
    return null;
  }
  useEffect(()=>{
    onChange(tempFile);
  },[tempFile]);
 
  const DivUploadButton = asUploadButton((props:any) => {
      return <button
      {...props} 
      type='button'
      className='btn btn-sm btn-icon btn-color-primary btn-active-light-primary'
      data-bs-toggle='tooltip'
      title='Upload Lampiran'
      >
          {/* <KTSVG path='/media/icons/duotune/arrows/arr013.svg' className='svg-icon-2' /> */}
        <i className='bi bi-paperclip fs-3'></i>
      </button>
  });
  return (
    <>
  <ChunkedUploady
    method="POST"
    params={{isTemp:temp, modul:modul}}
    destination={{ url: API().postUploadFile , headers: { 'Authorization': "Bearer " + JSON.parse(auth!).api_token} }}
    chunkSize={1000 * 1024}
    inputFieldName={'file'}
  >
    <LogProgress/> 
    <DivUploadButton/>
  </ChunkedUploady> 
        {progress > 0 ? <><br /><ProgressBar now={progress} label={'Proccessing ' + Math.ceil(progress) + ' %'} variant="success" animated striped/> </>: <></>}
    <br />
    {temp === 'Y' ? 
    <div className='d-flex align-items-center mb-5'>
    {tempFile ? tempFile.map((item:any, i:any)=>{
        return (<ButtonDownloadFile key={i} id={item.id} modul={modul} filename={item.file_name} />)
    }) : <></>}
    </div>
    : '<></>'}
    </>);

}
const Loading: FC = () => {
    const [text, setText] = useState('Loading.');

    useEffect(()=>{
        setTimeout(() => {
            changeLoading();
          }, 500);
    });
    const changeLoading = () => {
        if(text === 'Loading.'){
            setText('Loading..');
        }else if(text === 'Loading..'){
            setText('Loading...');
        }else if(text === 'Loading...'){
            setText('Loading....');
        }else if(text === 'Loading....'){
            setText('Loading.');
        }
    }
    return(
        <>
        <div style={{
            position       : 'fixed',
            display        : 'flex',
            justifyContent : 'center',
            alignItems     : 'center',
            width          : '100%',
            height         : '100%',
            top            : 0,
            left           : 0,
            opacity        : 0.7,
            backgroundColor: '#fff',
            zIndex         : 99
        }}>
            {text}
        </div>
        </>
    )
}


const LoadingContent: FC<any> = ({children, isLoading, data}) => {
  const [text, setText] = useState('Loading.');

  useEffect(()=>{
      setTimeout(() => {
          changeLoading();
        }, 500);
  });
  const changeLoading = () => {
      if(text === 'Loading.'){
          setText('Loading..');
      }else if(text === 'Loading..'){
          setText('Loading...');
      }else if(text === 'Loading...'){
          setText('Loading....');
      }else if(text === 'Loading....'){
          setText('Loading.');
      }
  }
  if(isLoading){
    return(
        <>
          <div style={{
            display        : 'flex',
            justifyContent : 'center',
            alignItems     : 'center',
            top            : 0,
            left           : 0
          }}
          >
            {text}
          </div>
        </>
    )
  }else if(data?.length >0){
    return children;
  }else{
    return 'Kosong';
  }
}

type Props = {
    users?: Array<{
        nama: string
        gambar?: string
        warna?: string
        inisial?: string
      }
      >
}
const ListUsers: FC<Props> = ({users = undefined}) => {
    return (
      <>
        {users &&
          users.map((user, i) => {
            return (
              <span key={i}>
              <RoundImage  user={user}/>
              </span>
            )
          })}
      </>
    )
  }

  const RoundImage = ({user = undefined, size = '35px', overlay = true, circle= true, addClass = ''} :any) =>{
    return (
      <OverlayTrigger
                placement='top'
                overlay={overlay ? <Tooltip id='tooltip-user-name'>{user.nama}</Tooltip> : <></>}
              >
        <div className={clsx(`symbol symbol-${size}`, circle &&`symbol-circle`, addClass)}>
          {user.gambar && <img src={toAbsoluteUrl(user.gambar)} alt='Pic' />}
          {user.nama && (
            <span className={`symbol-label bg-${user.inisial_color} text-inverse--${user.inisial_color} fw-bolder`}>
              {user.nama.substring(0, 1)}
            </span>
          )}
      </div>
      </OverlayTrigger>
      );
  }

  const LoadingComponent = ({data = undefined , component}: any) =>{
    if(data || data?.length >0){
      return component;
    }else{
      return <div
      style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}
      >Loading...</div>;
    }
  }


const ButtonSubmit = ({label = "Save", disabled = false, isLoading = false, type = "button", onClick} :any) =>{
  return(<button type={type} className="btn btn-primary" onClick={onClick} disabled={disabled}>
      {!isLoading && <span className='indicator-label'>{label}</span>}
          {isLoading && (
              <span className='indicator-progress' style={{display: 'block'}}>
              Please wait...
              <span className='spinner-border spinner-border-sm align-middle ms-2'></span>
              </span>
          )}
      </button>);
}

  

  
function getWindowDimensions() {
  const { innerWidth: width, innerHeight: height } = window;
  return {
    width,
    height
  };
}

function useWindowDimensions() {
  const [windowDimensions, setWindowDimensions] = useState(getWindowDimensions());

  useLayoutEffect(() => {
    function handleResize() {
      setWindowDimensions(getWindowDimensions());
    }

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return windowDimensions;
}


/*FORM COMPONENT*/

const InputForm = ({formik, label, name}:any) => {
  return( <div className='fv-row mb-8'>
      <label className='form-label fs-6 fw-bolder text-dark'>{label}</label>
      <input
      placeholder={label}
      {...formik.getFieldProps(name)}
      className={clsx(
          'form-control bg-transparent',
          {'is-invalid': formik.touched[name] && formik.errors[name]},
          {
          'is-valid': formik.touched[name] && !formik.errors[name],
          }
      )}
      type='text'
      name={name}
      autoComplete='off'
      />
      {formik.touched[name] && formik.errors[name] && (
      <div className='fv-plugins-message-container'>
          <span role='alert'>{formik.errors[name].toString()}</span>
      </div>
      )}
  </div>);
}

const TextForm = ({formik, label, name, rows = 3}:any) => {
  return( <div className='fv-row mb-4'>
      <label className='form-label fs-6 fw-bolder text-dark'>{label}</label>
      <textarea
      rows={rows}
      placeholder={label}
      {...formik.getFieldProps(name)}
      className={clsx(
          'form-control bg-transparent',
          {'is-invalid': formik.touched[name] && formik.errors[name]},
          {
          'is-valid': formik.touched[name] && !formik.errors[name],
          }
      )}
      type='text'
      name={name}
      autoComplete='off'
      />
      {formik.touched[name] && formik.errors[name] && (
      <div className='fv-plugins-message-container'>
          <span role='alert'>{formik.errors[name].toString()}</span>
      </div>
      )}
  </div>);
}

const DateTimeForm = ({formik, label, name, disabled=false}: any) => {
  return( <div className='fv-row mb-8'>
      <label className='form-label fs-6 fw-bolder text-dark'>{label}</label>
      
      <LocalizationProvider dateAdapter={AdapterMoment}>
      <DateTimePicker
          renderInput={(props) => <TextField {...props} />}
          disabled={disabled}
          inputFormat='yyyy-MM-DD HH:mm'
          className={clsx(
              'form-control bg-transparent',
              {'is-invalid': formik.touched[name] && formik.errors[name]},
              {
              'is-valid': formik.touched[name] && !formik.errors[name],
              }
          )}
          // label={label}
          value={formik.values[name]}
          onChange={(newValue) => {
              formik.touched[name] = true;
              formik.setFieldValue(name, newValue);
          }}
      />
      {formik.touched[name] && formik.errors[name] && (
       <div className='fv-plugins-message-container'>
          <span role='alert'>{formik.errors[name].toString()}</span>
      </div>
       )}

  </LocalizationProvider></div>);
}
const AlertForm = ({formik}:any) => {
  return(
      <>
      {formik.status ? (<div className={'mb-lg-15 alert alert-'+formik.status['status']}>
      <div className='alert-text font-weight-bold'>{formik.status['msg']}</div>
      </div>) : <div></div>}
      </>
  )
}

const AlertConfirm = ({onSubmit, msg, show, setShow, onLoading}:any) => {
  if(onLoading){
    return(<Modal show={show}>
              <Alert style={{margin:0}} show={show} variant="primary">
                  <Alert.Heading>Loading ....</Alert.Heading>
              </Alert>
          </Modal>
    );
  }
  return(<Modal show={show}>
        <Alert style={{margin:0}} show={show} variant="danger">
            <Alert.Heading>Are you sure?</Alert.Heading>
            <p>
                {msg}
            </p>
            <hr />
            <div className="d-flex justify-content-end">
            <button className="btn btn-success" onClick={onSubmit}>
                Yes
            </button> 
            <button className="btn btn-light" onClick={() => setShow(false)}>
                Close
            </button>
            </div>
        </Alert>
    </Modal>
    );
}

const AlertResult = ({onLoading, msg}:any) => {

  return(<Modal show={true}>
        <Alert style={{margin:0}} show={true} variant="danger">
            <Alert.Heading>Are you sure?</Alert.Heading>
            <p>
                {msg}
            </p>
            <hr />
            <div className="d-flex justify-content-end">
            </div>
        </Alert>
    </Modal>
    );
}

export {AlertConfirm, AlertResult, Loading, ListUsers, RoundImage, LoadingComponent, ButtonSubmit, useWindowDimensions, ButtonDownloadFile, LoadingContent, ButtonUploadFile, InputForm, TextForm, DateTimeForm, AlertForm};
