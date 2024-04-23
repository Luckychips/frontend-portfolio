import React from 'react'
import { Outlet } from 'react-router-dom'
import Navigation from '@components/Navigation'

const MainPage = () => {
    return (
        <main id="page-main">
            <Navigation />
            <Outlet />
        </main>
    )
}

export default MainPage
