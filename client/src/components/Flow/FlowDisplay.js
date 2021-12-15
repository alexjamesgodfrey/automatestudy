import React from 'react'
import Badge from 'react-bootstrap/Badge'
import notability from '../../images/notability.png'
import onedrive from '../../images/onedrive.svg'
import dropbox from '../../images/dropbox.svg'
import goodnotes from '../../images/goodnotes.png'
import onenote from '../../images/onenote.svg'
import googledrive from '../../images/googledrive.svg'
import notion from '../../images/notion.svg'
import check from '../../images/check2.svg'
import todoist from '../../images/todoist.svg'
import arrowRight from '../../images/arrowright.svg'

export default function FlowDisplay(props) {
    const arrow =  <img src={arrowRight} className="icon" style={{ width: '50px'}} alt="arrow facing right" />
    return (
        <div>
            {props.showDifficulty ? 
                <div>
                    {props.flow.recommended ? 
                        <p><strong>Recommended ({props.flow.difficulty}) </strong>{props.flow.description}</p>
                    :
                        <p><strong>({props.flow.difficulty}) </strong>{props.flow.description}</p>
                    }
                </div>    
            :
            <p>{props.flow.description}</p>
            }
            
            <div className="d-flex align-items-start justify-content-center">
                {props.flow.tags.indexOf('Notability') !== -1 ?
                    <div className="d-flex align-items-center">
                        <img style={{ width: '45px'}} src={notability} alt="notability icon" />
                        {arrow}
                    </div>
                    :<span></span>
                }
                {props.flow.tags.indexOf('Goodnotes') !== -1 ?
                    <div className="d-flex align-items-center">
                        <img style={{ width: '50px'}} src={goodnotes} alt="goodnotes icon" />
                        {arrow}
                    </div>
                    :<span></span>
                }
                {props.flow.tags.indexOf('One Note') !== -1 ?
                    <div className="d-flex align-items-center">
                        <img style={{ width: '50px'}} src={onenote} alt="one note icon" />
                        {arrow}
                    </div>
                    :<span></span>
                }
                {props.flow.tags.indexOf('OneDrive') !== -1 ?
                    <div className="d-flex align-items-center">
                        <img style={{ width: '50px'}} src={onedrive} alt="onedrive icon" />
                        {arrow}
                    </div>
                    :<span></span>
                }
                {props.flow.tags.indexOf('Google Drive') !== -1 ?
                    <div className="d-flex align-items-center">
                        <img style={{ width: '50px'}} src={googledrive} alt="google drive icon" />
                        {arrow}
                    </div>
                    :<span></span>
                }
                {props.flow.tags.indexOf('Dropbox') !== -1 ?
                    <div className="d-flex align-items-center">
                        <img style={{ width: '50px'}} src={dropbox} alt="dropbox icon" />
                        {arrow}
                    </div>
                    :<span></span>
                }
                {props.flow.tags.indexOf('Notion') !== -1 ? 
                    <div className="d-flex align-items-center">
                        <img style={{ width: '45px', marginTop: '2px'}} src={notion} alt="notion icon" />
                        {arrow}
                    </div>
                    :<span></span>
                }
                {props.flow.tags.indexOf('StudyTasks') !== -1 ? 
                    <div className="d-flex flex-column align-items-center">
                        <img style={{ width: '45px', margin: '2px 3px 0px 0px' }} src={check} alt="checkbox icon" />
                    </div>
                    :<span></span>
                }
                {props.flow.tags.indexOf('Todoist') !== -1 ? 
                    <div className="d-flex flex-column align-items-center">
                        <img style={{ width: '45px', margin: '2px 3px 0px 0px' }} src={todoist} alt="todoist icon" />
                    </div>
                    :<span></span>
                }
            </div>
            <div style={{marginTop: '10px'}} className="d-flex justify-content-center align-items-start flex-wrap">
                {props.flow.tags.map((tag, key) => {
                    return <Badge style={{ margin: '2px 3px'}} variant="primary">{tag}</Badge>
                })}
            </div>
        </div>
    )
}
