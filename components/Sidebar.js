import React from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';

const Sidebar = () => {
    const router = useRouter();
    return (
        <aside className="bg-gray-800 sm:w-1/3 xl:w-1/5 sm:min-h-screen p-5">
            <p className="text-white text-2xl font-black">CRM Clientes</p>
            <nav className="mt-5 list-none">
                <li className={router.pathname == "/clientes" ? "bg-blue-800 p-2" : "p-2"}>
                    <Link href="/clientes">
                        <a className="text-white mb-2 block">Clientes</a>
                    </Link>
                </li>
                <li className={router.pathname == "/pedidos" ? "bg-blue-800 p-2" : "p-2"}>
                    <Link href="/pedidos">
                        <a className="text-white mb-2 block">Pedidos</a>
                    </Link>
                </li>
                <li className={router.pathname == "/productos" ? "bg-blue-800 p-2" : "p-2"}>
                    <Link href="/productos">
                        <a className="text-white mb-2 block">Productos</a>
                    </Link>
                </li>
            </nav>
            <div className="sm:mt-10">
                <p className="text-white text-2xl font-black">Otras opciones</p>
            </div>
            <nav className="mt-5 list-none">
                <li className={router.pathname == "/mejoresvendedores" ? "bg-blue-800 p-2" : "p-2"}>
                    <Link href="/mejoresvendedores">
                        <a className="text-white mb-2 block">Mejores vendedores</a>
                    </Link>
                </li>
                <li className={router.pathname == "/mejoresclientes" ? "bg-blue-800 p-2" : "p-2"}>
                    <Link href="/mejoresclientes">
                        <a className="text-white mb-2 block">Mejores clientes</a>
                    </Link>
                </li>
            </nav>
        </aside>
    );
}
 
export default Sidebar;