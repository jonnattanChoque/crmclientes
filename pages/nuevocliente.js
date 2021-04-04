import React, { useState } from 'react';
import Layout from '../components/Layout';
import { useRouter } from 'next/router';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { useMutation, gql } from '@apollo/client';

const NUEVO_CLIENTE = gql`
    mutation nuevoCliente($input: ClienteInput) {
        nuevoCliente(input: $input){
            id
            nombre
            apellido
            empresa
            email
            telefono
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

const NuevoCliente = () => {
    const [ nuevoCliente ] = useMutation(NUEVO_CLIENTE, {
        update(cache, {data: {nuevoCliente}}){
            //obtener el objeto del cache
            const { obteneClientesVendedor } = cache.readQuery({ query: OBTENER_CLIENTES_USUARIOS });

            //reescribir el cache
            cache.writeQuery({
                query: OBTENER_CLIENTES_USUARIOS,
                data: {
                    obteneClientesVendedor: [...obteneClientesVendedor, nuevoCliente]
                }
            })
        }
    });
    const [mensaje, guardarMensaje] = useState(null);
    const router = useRouter();

    const formik = useFormik({
        initialValues: {
            name: '',
            lastname: '',
            email: '',
            company: '',
            phone: ''
        },
        validationSchema: Yup.object({
            name: Yup.string().required('El nombre del cliente es obligatorio'),
            lastname: Yup.string().required('El apellido del cliente es obligatorio'),
            email: Yup.string().required('El correo del cliente es obligatorio').email('El correo no es válido'),
            company: Yup.string().required('La empresa del cliente es obligatoria'),
        }),
        onSubmit: async valores => {
            const { name, lastname, email, company, phone } = valores;
            try {
                const {data} = await nuevoCliente({
                    variables: {
                        input: {
                            "nombre": name,
                            "apellido": lastname,
                            "empresa": company,
                            "email": email,
                            "telefono": phone
                        }
                    }
                });
                guardarMensaje(`Se creó el cliente ${data.nuevoCliente.nombre}`);
                setTimeout(() => {
                    guardarMensaje(null);
                    router.push("/clientes");
                }, 2000);
                
            } catch (error) {
                guardarMensaje(error.message);
                
            }
        }
    });

    const mostrarMensaje = () => {
        return (
            <div className="bg-red-400 py-2 px-3 w-full my-3 max-w-sm text-center mx-auto">
                <p>{mensaje}</p>
            </div>
        )
    }

    return (
        <Layout>
            {mensaje && mostrarMensaje()}
            <h1 className="text-2xl text-gray-800 font-light">Nuevo cliente</h1>
            <div className="flex justify-center mt-5">
                <div className="w-full max-w-lg">
                    <form className="bg-white shadow-md px-8 pt-6 pb-8 mb-4" onSubmit={formik.handleSubmit}>
                        <div className="mb-4">
                            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="name">Nombre</label>
                            <input 
                                className="shadow appearance-none border border-gray-400 rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:ring-2 focus:border-transparent" 
                                type="text" id="name" placeholder="Escribe el nombre del cliente" value={formik.values.name} onChange={formik.handleChange}
                            />
                            {formik.touched.name && formik.errors.name ? (<div className="my-2 bg-red-100 border-l-4 border-red-500 text-red-700 p-4"><p className="font-bold">Error</p><p>{formik.errors.name}</p></div>) : null}
                        </div>
                        <div className="mb-4">
                            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="lastname">Apellido</label>
                            <input 
                                className="shadow appearance-none border border-gray-400 rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:ring-2 focus:border-transparent" 
                                type="text" id="lastname" placeholder="Escribe el apellido del cliente" value={formik.values.lastname} onChange={formik.handleChange}
                            />
                            {formik.touched.lastname && formik.errors.lastname ? (<div className="my-2 bg-red-100 border-l-4 border-red-500 text-red-700 p-4"><p className="font-bold">Error</p><p>{formik.errors.lastname}</p></div>) : null}
                        </div>
                        <div className="mb-4">
                            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="email">Correo</label>
                            <input 
                                className="shadow appearance-none border border-gray-400 rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:ring-2 focus:border-transparent" 
                                type="email" id="email" placeholder="Escribe el correo del cliente" value={formik.values.email} onChange={formik.handleChange} onBlur={formik.handleBlur}
                            />
                            {formik.touched.email && formik.errors.email ? (<div className="my-2 bg-red-100 border-l-4 border-red-500 text-red-700 p-4"><p className="font-bold">Error</p><p>{formik.errors.email}</p></div>) : null}
                        </div>
                        <div className="mb-4">
                            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="company">Empresa</label>
                            <input 
                                className="shadow appearance-none border border-gray-400 rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:ring-2 focus:border-transparent" 
                                type="text" id="company" placeholder="Escribe la empresa del cliente" value={formik.values.company} onChange={formik.handleChange}
                            />
                            {formik.touched.company && formik.errors.company ? (<div className="my-2 bg-red-100 border-l-4 border-red-500 text-red-700 p-4"><p className="font-bold">Error</p><p>{formik.errors.company}</p></div>) : null}
                        </div>
                        <div className="mb-4">
                            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="phone">Teléfono</label>
                            <input 
                                className="shadow appearance-none border border-gray-400 rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:ring-2 focus:border-transparent" 
                                type="tel" id="phone" placeholder="Escribe el teléfono del cliente" value={formik.values.phone} onChange={formik.handleChange}
                            />
                            {formik.touched.phone && formik.errors.phone ? (<div className="my-2 bg-red-100 border-l-4 border-red-500 text-red-700 p-4"><p className="font-bold">Error</p><p>{formik.errors.phone}</p></div>) : null}
                        </div>
                        <input className="bg-gray-800 w-full mt-5 p-2 text-white uppercase font-bold hover:bg-gray-900" type="submit" value="Guardar"/>
                    </form>
                </div>
            </div>
        </Layout>
    );
}
 
export default NuevoCliente;