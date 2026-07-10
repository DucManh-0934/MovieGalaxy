import React from 'react';
import MenuAdmin from '../../../components/admin/MenuAdmin';
import HeaderAdmin from '../../../components/admin/HeaderAdmin';
import AdminRouter from '../../../routers/AdminRouter';

function HomeAdmin(props) {
    return (
        <div className='md:flex font-serif'>
            <MenuAdmin/>
            <div className="flex-1 h-screen ">
                <HeaderAdmin/>
                <div className='px-5'>
                <AdminRouter/>
                </div>
            </div>
        </div>
    );
}

export default HomeAdmin;