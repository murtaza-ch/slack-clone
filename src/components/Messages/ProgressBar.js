import React from 'react'
import {Progress} from 'semantic-ui-react'
import '../../App.css';

const ProgressBar = ({uploadState,percentUploaded}) => {
    return (
        uploadState === 'uploading' && (
            <Progress
            className="progress__bar"
            percent={percentUploaded}
            progress
            indicating
            size="small"
            inverted
            />
        )
    )
}

export default ProgressBar
