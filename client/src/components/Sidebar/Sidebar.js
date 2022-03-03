import React, { useState } from 'react'
import { ProSidebar, SidebarHeader, Menu, MenuItem, SubMenu, SidebarContent, SidebarFooter } from 'react-pro-sidebar';
import { AiOutlineDoubleLeft, AiOutlineDoubleRight } from 'react-icons/ai'
import { FaHome, FaQuestion, FaBookOpen, FaVideo } from 'react-icons/fa'
import { BsPeopleFill } from 'react-icons/bs'
import logo from '../../images/wave.svg'
import './Sidebar.scss'

export default function Sidebar() {
    const [collapse, setCollapse] = useState(false)
    const collapseIcon = collapse ? <AiOutlineDoubleRight /> : <AiOutlineDoubleLeft />
  return (
    <ProSidebar collapsed={collapse} id="sidebar">
        <SidebarHeader className="sidebar-header">
            STUDYFLOW.AI
        </SidebarHeader>
        <SidebarContent>
            <Menu iconShape="circle">
                <MenuItem icon={<FaHome />}>My Studyflows</MenuItem>
                <MenuItem 
                    icon={<BsPeopleFill />}
                    suffix={<span className="badge red">new</span>}
                    >
                        Community</MenuItem>
                {/* <MenuItem icon={<FaVideo />}>Tutorial Videos</MenuItem> */}
                <MenuItem icon={<FaBookOpen />}>Documentation</MenuItem>
                <MenuItem icon={<FaQuestion />}>Help</MenuItem>
                <SubMenu title="Components">
                <MenuItem>Component 1</MenuItem>
                <MenuItem>Component 2</MenuItem>
                </SubMenu>
            </Menu>
        </SidebarContent>
        <SidebarFooter>
        <Menu iconShape="circle">
                <MenuItem onClick={() => setCollapse(!collapse)} icon={collapseIcon}>Collapse Sidebar</MenuItem>
            </Menu>
        </SidebarFooter>
        
    </ProSidebar>
  )
}
