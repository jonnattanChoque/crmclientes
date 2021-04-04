import React, { useContext, useEffect, useState } from 'react';
import Select from 'react-select';
import { gql, useQuery } from '@apollo/client';
import PedidoContext from '../../context/pedidos/PedidoContext';

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

export default function AsignarCliente () {
    const [cliente, setcliente] = useState([]);
    const pedidoContext = useContext(PedidoContext);
    const {agregarCliente} = pedidoContext;
    
    const {data, loading, error} = useQuery(OBTENER_CLIENTES_USUARIOS);
    useEffect(() => {
        agregarCliente(cliente);//Esta funcion es del pedidoState
    }, [cliente])

    const seleccionCliente = cliente => {
        setcliente(cliente);
    }

    if(loading) return null;
    const {obteneClientesVendedor} = data;
    return(
        <>
        <p className="mt-10 my-2 bg-white border-l-4 border-gray-800 text-gray-700 p-2 text-sm font-bold">1. Asigna un cliente</p>
        <Select 
            placeholder="Seleccione uno"
            noOptionsMessage={() => "No hay resultados"}
            options={obteneClientesVendedor} 
            isMulti={false} 
            onChange={(opcion) => seleccionCliente(opcion)} 
            getOptionValue={(opciones) => opciones.id } 
            getOptionLabel={(opciones) => opciones.nombre}
        />
        </>
    )
}