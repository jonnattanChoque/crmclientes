import React from 'react';
import { useQuery, gql } from '@apollo/client';
import {useRouter} from 'next/router';

const OBTENER_USUARIO = gql`
    query obtenerUsuario {
        obtenerUsuario {
            id
            email
            nombre
            apellido
        }
    }
`;

const Header = () => {
    const {data, loading, error} = useQuery(OBTENER_USUARIO);
    const router = useRouter();

    const cerrarSesion = () => {
        localStorage.removeItem('token');
        router.push('/login');
    }
    
    if(loading) return null;
    console.log(data);
    if(!data.obtenerUsuario){
        router.push('/login');
        return null
    }

    const { nombre, apellido } = data.obtenerUsuario;
    return (
        <div className="sm:flex sm:justify-between mb-6">
            <p className="mr-2 mb-5 lg:mb-0">Hola: {nombre} {apellido}</p>
            <button type="button" onClick={() => cerrarSesion()} className="bg-blue-800 w-full sm:w-auto font-bold uppercase text-xs rounded py-1 px-2 text-white shadow-md">
                Cerrar sesión
            </button>
        </div>
    );
}
 
export default Header;