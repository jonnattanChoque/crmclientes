import React from 'react';
import Swal from 'sweetalert2';
import { gql, useMutation } from '@apollo/client';
import Router from 'next/router';

const ELIMINAR_CLIENTE = gql`
    mutation eliminarCliente($id: ID!) {
        eliminarCliente(id:$id)
    }
`;
const OBTENER_CLIENTES_USUARIOS = gql`
  query obteneClientesVendedor {
    obteneClientesVendedor {
      id
      nombre
      apellido
      empresa
      email
    }
  }
`;

export default function Cliente({cliente}){
    const [eliminarCliente] = useMutation(ELIMINAR_CLIENTE, {
        update(cache) {
            const { obteneClientesVendedor } = cache.readQuery({query: OBTENER_CLIENTES_USUARIOS});
            cache.writeQuery({
                query: OBTENER_CLIENTES_USUARIOS,
                data: {
                    obteneClientesVendedor: obteneClientesVendedor.filter(clienteActual => clienteActual.id !== id)
                }
            })
        }
    });
    const { id, nombre, apellido, email, empresa} = cliente;

    const confirmEliminar = id => {
        Swal.fire({
            title: '¿Estas seguro de eliminar el cliente?',
            text: "Esta acción no se puede deshacer",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Si, eliminar',
            cancelButtonText: 'No, cancelar'
        }).then(async (result) => {
            if (result.isConfirmed) {
                try {
                    const {data} = await eliminarCliente({
                        variables: {
                            id
                        }
                    });
                    Swal.fire(
                        'Eliminado!',
                        data.eliminarCliente,
                        'success'
                    )
                } catch (error) {
                    console.log(error); 
                }
            }
        })
    }
    const confirmEditar = () => {
        Router.push({
            pathname: '/editarcliente/[id]',
            query: {id}
        })
    }
    return (
        <tr>
            <td className="border px-4 py-2">{nombre} {apellido}</td>
            <td className="border px-4 py-2">{empresa}</td>
            <td className="border px-4 py-2">{email}</td>
            <td className="border px-4 py-2 flex">
                <button type="button" className="flex justify-center items-center bg-blue-800 rounded py-2 mx-5 px-4 w-full text-white text-xs uppercase font-bold" onClick={() => confirmEditar()}>
                    Actualizar<svg className="w-4 h-4 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"></path></svg>
                </button>
                <button type="button" className="flex justify-center items-center bg-red-800 rounded py-2 mx-5 px-4 w-full text-white text-xs uppercase font-bold" onClick={() => confirmEliminar(id)}>
                    Eliminar<svg className="w-4 h-4 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
                </button>
            </td>
        </tr>
    );
}