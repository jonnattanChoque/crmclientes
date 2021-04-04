import React, { useContext, useEffect, useState } from 'react';
import Select from 'react-select';
import { gql, useQuery } from '@apollo/client';
import PedidoContext from '../../context/pedidos/PedidoContext';

const OBTENER_PRODUCTOS = gql`
  query obtenerProductos {
    obtenerProductos {
      id
      nombre
      precio
      existencia
    }
  }
`;

export default function AsignarProductos () {
    const [producto, setproducto] = useState([]);
    const pedidoContext = useContext(PedidoContext);
    const {agregarProducto} = pedidoContext;
    
    const {data, loading, error} = useQuery(OBTENER_PRODUCTOS);
    useEffect(() => {
        agregarProducto(producto);
    }, [producto])

    const seleccionProducto = producto => {
        setproducto(producto);
    }

    if(loading) return null;
    const {obtenerProductos} = data;

    return(
        <>
        <p className="mt-10 my-2 bg-white border-l-4 border-gray-800 text-gray-700 p-2 text-sm font-bold">2. Selecciona productos</p>
        <Select 
            placeholder="Seleccione uno"
            noOptionsMessage={() => "No hay resultados"}
            options={obtenerProductos} 
            isMulti={true} 
            onChange={(opcion) => seleccionProducto(opcion)} 
            getOptionValue={(opciones) => opciones.id } 
            getOptionLabel={(opciones) => `${opciones.nombre} - ${opciones.existencia} disponibles`}
        />
        </>
    )
}