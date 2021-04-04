import React, { useEffect } from 'react';
import Layout from '../components/Layout';
import {BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend} from 'recharts';
import {gql, useQuery} from '@apollo/client';

const MEJORES_CLIENTES = gql`
    query mejoresClientes {
        mejoresClientes {
            cliente {
                nombre
                empresa
            }
            total
        }
    }
`;

const MejoresClientes = () => {
    const {data, loading, error, startPolling, stopPolling} = useQuery(MEJORES_CLIENTES);
    const clienteGrafica = [];


    if(loading) return(<h1>Cargando</h1>)

    const { mejoresClientes } = data;
    mejoresClientes.map((cliente, index) => {
        clienteGrafica[index] = {
            ...cliente.cliente[0],
            total: cliente.total
        }
    })
    return (
        <Layout>
            <h1 className="text-2xl text-gray-800 font-light">Mejores CLientes</h1>
            <BarChart className="mt-10" width={500} height={300} data={clienteGrafica} margin={{top: 5, right: 30, left: 20, bottom: 5}}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="nombre" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="total" fill="#3182ba" />
            </BarChart>
        </Layout>
    );
}
 
export default MejoresClientes;