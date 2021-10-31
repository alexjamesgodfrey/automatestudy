import React from 'react'
import notability from '../../images/notability.png'
import onedrive from '../../images/onedrive.svg'
import notion from '../../images/notion.svg'
import check from '../../images/check.svg'
import arrowRight from '../../images/arrowright.svg'

export default function Flows(props) {
    return (
        <div>
            {props.surveyResponse.apporcloud === 'Notability' && props.surveyResponse.cloud === 'OneDrive' ?
            <div>
                <div style={{cursor: 'pointer'}} className="d-flex align-items-start justify-content-around">
                    <div className="d-flex flex-column align-items-center">
                        <img style={{ width: '50px'}} src={notability} alt="notability icon" />
                    </div>
                    <img style={{ width: '50px'}} src={arrowRight} alt="arrow facing right" />
                    <div className="d-flex flex-column align-items-center">
                        <img style={{ width: '50px'}} src={onedrive} alt="onedrive icon" />
                    </div>
                    <img style={{ width: '50px'}} src={arrowRight} alt="arrow facing right" />
                    <div className="d-flex flex-column align-items-center">
                        <img style={{ width: '45px', marginTop: '2px'}} src={notion} alt="notion icon" />
                    </div>
                    <img style={{ width: '50px'}} src={arrowRight} alt="arrow facing right" />
                    <div className="d-flex flex-column align-items-center">
                        <img style={{ width: '45px', margin: '2px 3px 0px 0px' }} src={check} alt="checkbox icon" />
                    </div>
                </div>
            </div>
            : <span />
            }
        </div>
    )
}
