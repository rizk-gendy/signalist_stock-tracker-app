import Image from 'next/image'
import Link from 'next/link'
import React from 'react'
import NavItems from './NavItems'
import UserDropdown from './UserDropdown'

const Header = ({user} :{user:User}) => {
    return (
        <header className='sticky top-0 header '>
            <div className='container header-wrapper'>
                <Link href='/'>
                    <Image src='/assets/icons/logo.svg' alt='logo' height={140} width={32} className='h-8 w-auto cursor-pointer ' />
                </Link>
                <nav className='hidden sm:block'>
                    <NavItems />
                </nav>
                <UserDropdown user={user} />
            </div>
        </header>
    )
}

export default Header