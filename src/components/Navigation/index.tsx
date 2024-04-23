import React from 'react'

const Navigation = () => {
    return (
        <nav className="flex items-center justify-between flex-wrap bg-teal-500 p-6">
            <div className="w-full block flex-grow lg:flex lg:items-center lg:w-auto">
                <div className="text-sm lg:flex-grow">
                    <a href="/chart"
                       className="block mt-4 lg:inline-block lg:mt-0 text-teal-200 hover:text-white mr-4">
                        D3.js
                    </a>
                    <a href="/grid"
                       className="block mt-4 lg:inline-block lg:mt-0 text-teal-200 hover:text-white mr-4">
                        Grid
                    </a>
                    <a href="#responsive-header"
                       className="block mt-4 lg:inline-block lg:mt-0 text-teal-200 hover:text-white">
                        Blog
                    </a>
                </div>
                <div>
                    <a href="/signIn"
                       className="block mt-4 lg:inline-block lg:mt-0 text-teal-200 hover:text-white">
                        Logout
                    </a>
                </div>
            </div>
        </nav>
    )
}

export default Navigation
