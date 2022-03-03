import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import { useAuth } from '../../contexts/AuthContext'
import { ProSidebar, SidebarHeader, Menu, MenuItem, SubMenu, SidebarContent, SidebarFooter } from 'react-pro-sidebar';
import { AiOutlineDoubleLeft, AiOutlineDoubleRight } from 'react-icons/ai'
import { FaHome, FaQuestion, FaBookOpen, FaVideo } from 'react-icons/fa'
import { BsPeopleFill } from 'react-icons/bs'
import { MdSchool } from 'react-icons/md'
import logo from '../../images/wave.svg'
import './Sidebar.scss'

export default function Sidebar() {
    const { userFlows } = useAuth()
    const [collapse, setCollapse] = useState(false)
    const collapseIcon = collapse ? <AiOutlineDoubleRight />: <AiOutlineDoubleLeft />
    console.log(Object.entries(userFlows))
  return (
    <ProSidebar collapsed={collapse} id="sidebar">
        <SidebarHeader className="sidebar-header">
            <img src={logo} style={{ marginRight: '20px' }} />
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
                        title="My Flows"
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
                <MenuItem icon={<FaBookOpen />}>Documentation</MenuItem>
                <MenuItem icon={<FaQuestion />}>Help</MenuItem>
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
