import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import { useAuth } from '../../contexts/AuthContext'
import { ProSidebar, SidebarHeader, Menu, MenuItem, SubMenu, SidebarContent, SidebarFooter } from 'react-pro-sidebar';
import { AiOutlineDoubleLeft, AiOutlineDoubleRight } from 'react-icons/ai'
import { FaHome, FaQuestion, FaBookOpen } from 'react-icons/fa'
import { BsPeopleFill, BsFillBugFill } from 'react-icons/bs'
import { MdSchool, MdEmail } from 'react-icons/md'
import logo from '../../images/wave.svg'
import './Sidebar.scss'

export default function Sidebar() {
    const { userFlows, currentUser } = useAuth()
    const [collapse, setCollapse] = useState(false)
    const collapseIcon = collapse ? <AiOutlineDoubleRight />: <AiOutlineDoubleLeft />
    console.log(Object.entries(userFlows))
  return (
    <ProSidebar collapsed={collapse} id="sidebar">
        <SidebarHeader className="sidebar-header">
            <img alt="logo "src={logo} style={{ marginRight: '20px' }} />
            studyflow.ai
        </SidebarHeader>
        <SidebarContent>
            <Menu iconShape="circle">
                <MenuItem icon={<FaHome />}>
                    Home
                    <Link to="/" />
                </MenuItem>
                <SubMenu
                        icon={<MdSchool />}
                        suffix={<span className="badge yellow">{Object.keys(userFlows).length}</span>}
                        title="My Classes"
                    >
                    {Object.entries(userFlows).map((classArray, i) => {
                        return (
                            <MenuItem>{classArray[0]}</MenuItem>
                        )
                    })}
                </SubMenu>
                <MenuItem 
                    icon={<BsPeopleFill />}
                    suffix={<span className="badge red">new</span>}
                    >
                        Community</MenuItem>
                {/* <MenuItem icon={<FaVideo />}>Tutorial Videos</MenuItem> */}
                <Menu
                    icon={<FaQuestion />}
                    title="Help"
                >
                    <MenuItem icon={<FaBookOpen />}><a target="_blank" rel="noreferrer" href={process.env.REACT_APP_DOCS_LINK}>Documentation</a></MenuItem>
                    <MenuItem icon={<BsFillBugFill />}><a target="_blank" rel="noreferrer" href={`mailto:${process.env.REACT_APP_HELP_EMAIL}?subject=Bug Report from ${currentUser.displayName}`}>Report a Bug</a></MenuItem>
                    <MenuItem icon={<MdEmail />}><a target="_blank" rel="noreferrer" href={`mailto:${process.env.REACT_APP_HELP_EMAIL}?subject=Question from ${currentUser.displayName}`}>Email Us</a></MenuItem>
                </Menu>
            </Menu>
        </SidebarContent>
        <SidebarFooter>
        <Menu iconShape="circle">
                <MenuItem onClick={() => setCollapse(!collapse)} icon={collapseIcon}></MenuItem>
            </Menu>
        </SidebarFooter>
        
    </ProSidebar>
  )
}
