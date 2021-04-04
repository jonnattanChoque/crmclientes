import React, { useContext } from 'react';
import PedidoContext from '../../context/pedidos/PedidoContext';
import ProductoResumen from './ProductoResumen';

const ResumenPedido = () => {
    const pedidoContext = useContext(PedidoContext);
    const { productos } = pedidoContext;
    
    return (
        <>
        <p className="mt-10 my-2 bg-white border-l-4 border-gray-800 text-gray-700 p-2 text-sm font-bold">3.Ajusta las cantidades</p>
        { productos.length > 0 ? (
            <div>
                {productos.map( producto => (
                    <ProductoResumen key={producto.id} producto={producto} />
                ))}
            </div>
        ) : (<p className="mt-5 text-sm">No hay</p>) }

        </>
    );
}
 
export default ResumenPedido;