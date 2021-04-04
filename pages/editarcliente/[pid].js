import React from 'react';
import {useRouter} from 'next/router';
import Layout from '../../components/Layout';
import {useQuery, gql, useMutation} from '@apollo/client';
import { Formik } from 'formik';
import * as Yup from 'yup';
import Swal from 'sweetalert2';

const OBTENER_CLIENTE = gql`
    query obtenerCliente($id:ID!) {
        obtenerCliente(id:$id) {
            nombre
            apellido
            email
            telefono
            empresa
        }
    }
`;

const ACTUALIZAR_CLIENTE = gql`
    mutation actualizarClienter($id: ID!, $input: ClienteInput){
        actualizarCliente(id: $id, input: $input) {
            nombre
            email
        }
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

export default function EditarCliente() {
    const router = useRouter();
    const { query: {id} } = router;
    
    const {data, loading, error} = useQuery(OBTENER_CLIENTE, {
        variables: {
            id
        }
    });

    const [actualizarCliente] = useMutation(ACTUALIZAR_CLIENTE, {
        update(cache, {data: {actualizarCliente}}){
            //obtener el objeto del cache
            const { obteneClientesVendedor } = cache.readQuery({ query: OBTENER_CLIENTES_USUARIOS });

            //reescribir el cache
            cache.writeQuery({
                query: OBTENER_CLIENTES_USUARIOS,
                data: {
                    obteneClientesVendedor: [...obteneClientesVendedor, actualizarCliente]
                }
            })
        }
    });

    //Validaciones
    const schemaValidation = Yup.object({
        nombre: Yup.string().required('El nombre es obligatorio'),
        apellido: Yup.string().required('El apellido es obligatorio'),
        email: Yup.string().required('El correo es obligatorio').email('El correo no es válido'),
        empresa: Yup.string().required('La empresa es obligatoria'),
    })
    
    if(loading) return <h1>Cargando...</h1>
    const {obtenerCliente} = data;

    const actualizarInfoCliente = async (valores) => {
        const { nombre, apellido, empresa, email, telefono } = valores;

        try {
            const { data } = await actualizarCliente({
                variables: {
                    id,
                    input: {
                        nombre,
                        apellido,
                        empresa,
                        email,
                        telefono
                    }
                }
            })
            
            Swal.fire({
                title: 'Actualizado',
                text: "El cliente se actualizó correctamente",
                icon: 'success'
            }).then((result) => {
                router.push('/');
            })

        } catch (error) {
            console.log(error);
        }
    }
    return (
        <Layout>
            <h1 className="text-2xl text-gray-800 font-light">Editar cliente</h1>
            <div className="flex justify-center mt-5">
                <div className="w-full max-w-lg">
                    <Formik validationSchema={schemaValidation} enableReinitialize initialValues={obtenerCliente} onSubmit={(valores) => {
                        actualizarInfoCliente(valores)
                    }}>
                        {props => {
                            return (
                                <form className="bg-white shadow-md px-8 pt-6 pb-8 mb-4" onSubmit={props.handleSubmit}>
                                    <div className="mb-4">
                                        <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="nombre">Nombre</label>
                                        <input 
                                            className="shadow appearance-none border border-gray-400 rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:ring-2 focus:border-transparent" 
                                            type="text" id="nombre" placeholder="Escribe el nombre del cliente" value={props.values.nombre} onChange={props.handleChange} onBlur={props.handleBlur}
                                        />
                                        {props.touched.nombre && props.errors.nombre ? (<div className="my-2 bg-red-100 border-l-4 border-red-500 text-red-700 p-4"><p className="font-bold">Error</p><p>{props.errors.nombre}</p></div>) : null}
                                    </div>
                                    <div className="mb-4">
                                        <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="apellido">Apellido</label>
                                        <input 
                                            className="shadow appearance-none border border-gray-400 rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:ring-2 focus:border-transparent" 
                                            type="text" id="apellido" placeholder="Escribe el apellido del cliente" value={props.values.apellido} onChange={props.handleChange} onBlur={props.handleBlur}
                                        />
                                        {props.touched.apellido && props.errors.apellido ? (<div className="my-2 bg-red-100 border-l-4 border-red-500 text-red-700 p-4"><p className="font-bold">Error</p><p>{props.errors.apellido}</p></div>) : null}
                                    </div>
                                    <div className="mb-4">
                                        <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="email">Correo</label>
                                        <input 
                                            className="shadow appearance-none border border-gray-400 rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:ring-2 focus:border-transparent" 
                                            type="email" id="email" placeholder="Escribe el correo del cliente" value={props.values.email} onChange={props.handleChange} onBlur={props.handleBlur}
                                        />
                                        {props.touched.email && props.errors.email ? (<div className="my-2 bg-red-100 border-l-4 border-red-500 text-red-700 p-4"><p className="font-bold">Error</p><p>{props.errors.email}</p></div>) : null}
                                    </div>
                                    <div className="mb-4">
                                        <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="empresa">Empresa</label>
                                        <input 
                                            className="shadow appearance-none border border-gray-400 rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:ring-2 focus:border-transparent" 
                                            type="text" id="empresa" placeholder="Escribe la empresa del cliente" value={props.values.empresa} onChange={props.handleChange} onBlur={props.handleBlur}
                                        />
                                        {props.touched.empresa && props.errors.empresa ? (<div className="my-2 bg-red-100 border-l-4 border-red-500 text-red-700 p-4"><p className="font-bold">Error</p><p>{props.errors.empresa}</p></div>) : null}
                                    </div>
                                    <div className="mb-4">
                                        <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="telefono">Teléfono</label>
                                        <input 
                                            className="shadow appearance-none border border-gray-400 rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:ring-2 focus:border-transparent" 
                                            type="tel" id="telefono" placeholder="Escribe el teléfono del cliente" value={props.values.telefono} onChange={props.handleChange} onBlur={props.handleBlur}
                                        />
                                        {props.touched.telefono && props.errors.telefono ? (<div className="my-2 bg-red-100 border-l-4 border-red-500 text-red-700 p-4"><p className="font-bold">Error</p><p>{props.errors.telefono}</p></div>) : null}
                                    </div>
                                    <input className="bg-gray-800 w-full mt-5 p-2 text-white uppercase font-bold hover:bg-gray-900" type="submit" value="Guardar"/>
                                </form>
                            )
                        }}
                    </Formik>
                </div>
            </div>
        </Layout>
    );
}