import React, { useEffect, useState } from 'react';
import {gql, useMutation} from '@apollo/client';
import Swal from 'sweetalert2';

const OBTENER_PEDIDOS = gql`
    query obtenerPedidosVendedor {
        obtenerPedidosVendedor {
            id
        }
    }  
`;
const ACTUALIZAR_PEDIDO = gql`
    mutation actualizarPedido($id: ID!, $input: PedidoInput) {
        actualizarPedido(id: $id, input: $input){
            estado
        }
    }
`;
const ELIMINAR_PEDIDO = gql`
    mutation eliminarPedido($id: ID!) {
        eliminarPedido(id: $id)
    }
`;

const Pedido = ({pedido}) => {
    const { id, total, cliente: {nombre, apellido, telefono, email}, estado } = pedido;
    const [estadoPedido, setEstadoPedido] = useState(estado);
    const [clase, setClase] = useState('');
    const [actualizarPedido] = useMutation(ACTUALIZAR_PEDIDO);
    const [eliminarPedido] = useMutation(ELIMINAR_PEDIDO, {
        update(cache) {
            const { obtenerPedidosVendedor } = cache.readQuery({query: OBTENER_PEDIDOS});
            cache.writeQuery({
                query: OBTENER_PEDIDOS,
                data: {
                    obtenerPedidosVendedor: obtenerPedidosVendedor.filter(pedidoActual => pedidoActual.id !== id)
                }
            })
        }
    });
    useEffect(() => {
        if(estadoPedido){
            setEstadoPedido(estadoPedido)
        }
        clasePedido();
    }, [estadoPedido])

    const clasePedido = () => {
        if(estadoPedido =='PENDIENTE'){
            setClase('border-yellow-500')
        }else if(estadoPedido == 'COMPLETADO'){
            setClase('border-green-500')
        }else{
            setClase('border-red-500')
        }
    }
    const cambiarEstadoPedido = async nuevoEstado => {
        try {
            const {data} = await actualizarPedido({
                variables: {
                    id,
                    input: {
                        estado: nuevoEstado,
                        cliente: pedido.cliente.id,
                        total: total
                    }
                }
            })
            setEstadoPedido(data.actualizarPedido.estado);
        } catch (error) {
            console.log(error);
        }
    }
    const confirmDelete = () => {
        Swal.fire({
            title: '¿Estas seguro de eliminar el pedido?',
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
                    const {data} = await eliminarPedido({
                        variables: {
                            id
                        }
                    });
                    Swal.fire(
                        'Eliminado!',
                        data.eliminarPedido,
                        'success'
                    )
                } catch (error) {
                    console.log(error); 
                }
            }
        })
    }

    return (
        <div className={`${clase} border-t-4 mt-4 bg-white rounded p-6 md:grid md:grid-cols-2 md-gap-4 shadow-lg`}>
            <div>
                <p className="font-bold text-gray-800">Cliente: {nombre} {apellido}</p>
                {email &&(
                    <p className="flex items-center my-2">
                    <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4"></path></svg>
                    {email}
                    </p>
                )}
                {telefono &&(
                    <p className="flex items-center my-2">
                    <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z"></path></svg>
                    {telefono}
                    </p>
                )}
                <h2 className="text-gray-800 font-bold mt-10">Estado del pedido:</h2>
                <select value={estadoPedido} onChange={e => cambiarEstadoPedido(e.target.value)} className="mt-2 appearance-none bg-blue-600 border border-blue-600 text-white p-2 text-center rounded 
                leading-tight focus:outline-none focus:bg-blue-400 focus:border-blue-400 uppercase text-xs font-bold">
                    <option value="COMPLETADO">COMPLETADO</option>
                    <option value="PENDIENTE">PENDIENTE</option>
                    <option value="CANCELADO">CANCELADO</option>
                </select>
            </div>
            <div>
                <h2 className="text-gray-800 font-bold mt-2">Resumen del pedido</h2>
                {pedido.pedido.map(articulo => (
                    <div key={articulo.id} className="mt-4">
                        <p className="text-sm text-gray-600">Producto: {articulo.nombre}</p>
                        <p className="text-sm text-gray-600">Cantidad: {articulo.cantidad}</p>
                    </div>
                ))}
                <p className="text-gray-800 mt-3 font-bold">Total a pagar:
                    <span className="font-light">${total}</span>
                </p>
                
                <button onClick={() => confirmDelete()} className="flex items-center mt-4 bg-red-800 px-5 py-2 inline-block text-white rounded  leading-tight uppercase text-xs font-bold">
                    Eliminar pedido<svg className="w-4 h-4 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
                </button>
            </div>
        </div>
    );
}
 
export default Pedido;