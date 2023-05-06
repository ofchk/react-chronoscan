import React from 'react';
import { useSelector } from 'react-redux';
import styles from './file-upload-progress.css'
import { LinearProgress } from '@mui/material';
import { Box } from '@mui/system';
import PictureAsPdfIcon from '@mui/icons-material/PictureAsPdf';
import CloudDoneIcon from '@mui/icons-material/CloudDone';
import ErrorIcon from '@mui/icons-material/Error';
import { Link } from 'react-router-dom';
import { dispatch } from 'store';
import { removeDoneFileUpload } from 'store/slices/menu';

function FileUploadProgress(props) {

    const filesList = useSelector((state) => state.menu.fileUploadList);

    const clearFileWhenDone  = (filename) => {
        // dispatch(removeDoneFileUpload({
        //     file_name: filename
        // }));
    }

    return (
        <div className='upload-status-div'>
            {
                filesList && filesList.reverse().map((file) => {
                    return (
                        <Link to={"/invoice/list"} className='files-link' onClick={clearFileWhenDone(file.file_name)}>
                            <div key={file.file_name} className='file-details'>
                                <span className='close-icon'>

                                </span>
                                <PictureAsPdfIcon className='icon-details'></PictureAsPdfIcon>
                                <div className='flex-items' >
                                    {file.file_name}
                                    <Box sx={{ width: '100%' }}>
                                        <LinearProgress variant="determinate" value={file.progress} />
                                    </Box>
                                </div>

                                <div className='icon-details' >
                                    {file.progress === 100 && !file.error ?
                                        <CloudDoneIcon color='green'></CloudDoneIcon>
                                        : (file.error) ? <ErrorIcon></ErrorIcon> : file.progress + '%'}
                                </div>
                            </div>
                        </Link>
                    )
                })
            }
        </div>
    )
}

export default FileUploadProgress;