'use client';
import LinkedInIcon from '@mui/icons-material/LinkedIn';
import Link from 'next/link';
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarHeader,
} from '../ui/sidebar';

import { LoginInfo } from '@frontend/components/auth/Login';
import AttachMoneyIcon from '@mui/icons-material/AttachMoney';
import { SearchProducts } from '../product/SearchProducts';
interface HeaderProps {
  isLogin?: boolean;
}

export const AppSidebar = () => {
  return (
    <Sidebar className='bg-zinc-900 text-white w-64 min-h-screen shadow-lg'>
      <SidebarHeader className='bg-zinc-800 px-6 py-4 flex items-center justify-center'>
        <Link href='/'>
          <h2 className='text-lg font-semibold tracking-wide'>
            <AttachMoneyIcon className='w-5 h-5' />
            VoidCommerce
          </h2>
        </Link>
      </SidebarHeader>

      <SidebarContent className='px-4 py-6 space-y-4 bg-zinc-900'>
        <SidebarGroup className='flex flex-col gap-3'>
          <SearchProducts />
        </SidebarGroup>
        <div className='flex-grow' />
        <SidebarGroup className='flex flex-col gap-3'>
          <LoginInfo />
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter className='bg-zinc-800  text-sm p-4 flex flex-col gap-4'>
        <div className='text-center text-gray-400'>
          <p>&copy; {new Date().getFullYear()} All rights reserved.</p>
          <p>
            Created by{' '}
            <Link
              href='https://www.linkedin.com/in/nicolas-vycas/'
              className='text-blue-400 hover:underline'
            >
              <LinkedInIcon />
              Nicolas Vycas Nery
            </Link>
          </p>
        </div>
      </SidebarFooter>
    </Sidebar>
  );
};
