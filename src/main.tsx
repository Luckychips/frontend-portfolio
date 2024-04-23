import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { MainPage, SignInPage } from '@pages/routes'
import D3Charts from '@components/D3Charts'
import DataTable from '@components/DataTable'
import './index.css'

ReactDOM.createRoot(document.getElementById('root')!).render(
    <React.StrictMode>
        <BrowserRouter>
            <Routes>
                <Route path='/' element={<MainPage />}>
                    <Route path='chart' element={<D3Charts />} />
                    <Route path='grid' element={<DataTable />} />
                </Route>
                <Route path='/signIn' element={<SignInPage />} />
            </Routes>
        </BrowserRouter>
    </React.StrictMode>,
)
