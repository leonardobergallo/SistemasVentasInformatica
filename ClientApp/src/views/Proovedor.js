import { useEffect, useState } from "react";
import DataTable from 'react-data-table-component';
import { Card, CardBody, CardHeader, Button, Modal, ModalHeader, ModalBody, Label, Input, FormGroup, ModalFooter } from "reactstrap"
import Swal from 'sweetalert2'

const modeloProveedor = {
    idProveedor: 0,
    NroDocumento: "",
    RazonSocial: "",
    Correo: "",
    Telefono: "",
    esActivo: true
}

const Proveedor = () => {

    const [proveedor, setProveedor] = useState(modeloProveedor);
    const [pendiente, setPendiente] = useState(true);
    const [proveedores, setProveedores] = useState([]);
    const [verModal, setVerModal] = useState(false);

    const handleChange = (e) => {
        let value = e.target.nodeName === "SELECT" ? (e.target.value == "true" ? true : false) : e.target.value;

        setProveedor({
            ...proveedor,
            [e.target.name]: value
        })
    }

    const obtenerProveedor = async () => {
        let response = await fetch("api/proveedor/Lista");

        if (response.ok) {
            let data = await response.json()
            setProveedores(data)
            setPendiente(false)
        }
    }

    useEffect(() => {
        obtenerProveedor();
    }, [])


    const columns = [
        {
            name: 'Descripcion',
            selector: row => row.descripcion,
            sortable: true,
        },
        {
            name: 'NroDocumento',
            selector: row => row.NroDocumento,
            sortable: true,
        },
        {
            name: 'RazonSocial',
            selector: row => row.RazonSocial,
            sortable: true,
        },
        {
            name: 'Correo',
            selector: row => row.Correo,
            sortable: true,
        },
        {
            name: 'Telefono',
            selector: row => row.Telefono,
            sortable: true,
        },
        {
            name: 'Estado',
            selector: row => row.esActivo,
            sortable: true,
            cell: row => {
                let clase;
                clase = row.esActivo ? "badge badge-info p-2" : "badge badge-danger p-2"
                return (
                    <span className={clase}>{row.esActivo ? "Activo" : "No Activo"}</span>
                )
            }
        },
        {
            name: '',
            cell: row => (
                <>
                    <Button color="primary" size="sm" className="mr-2"
                        onClick={() => abrirEditarModal(row)}
                    >
                        <i className="fas fa-pen-alt"></i>
                    </Button>

                    <Button color="danger" size="sm"
                        onClick={() => eliminarProveedor(row.idProveedores)}
                    >
                        <i className="fas fa-trash-alt"></i>
                    </Button>
                </>
            ),
        },
    ];

    const customStyles = {
        headCells: {
            style: {
                fontSize: '13px',
                fontWeight: 800,
            },
        },
        headRow: {
            style: {
                backgroundColor: "#eee",
            }
        }
    };

    const paginationComponentOptions = {
        rowsPerPageText: 'Filas por página',
        rangeSeparatorText: 'de',
        selectAllRowsItem: true,
        selectAllRowsItemText: 'Todos',
    };


    const abrirEditarModal = (data) => {
        setProveedor(data);
        setVerModal(!verModal);
    }

    const cerrarModal = () => {
        setProveedor(modeloProveedor)
        setVerModal(!verModal);
    }

    const guardarCambios = async () => {

        let response;
        if (proveedor.idProveedor == 0) {
            response = await fetch("api/proveedor/Guardar", {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json;charset=utf-8'
                },
                body: JSON.stringify(proveedor)
            })

        } else {
            response = await fetch("api/proveedor/Editar", {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json;charset=utf-8'
                },
                body: JSON.stringify(proveedor)
            })
        }

        if (response.ok) {
            await obtenerProveedor();
            setProveedor(modeloProveedor)
            setVerModal(!verModal);

        } else {
            alert("error al guardar")
        }

    }


    const eliminarProveedor = async (id) => {

        Swal.fire({
            title: 'Esta seguro?',
            text: "Desesa eliminar esta proveedor",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Si, continuar',
            cancelButtonText: 'No, volver'
        }).then((result) => {
            if (result.isConfirmed) {

                const response = fetch("api/proveedor/Eliminar/" + id, { method: "DELETE" })
                    .then(response => {
                        if (response.ok) {

                            obtenerProveedor();

                            Swal.fire(
                                'Eliminado!',
                                'La categoria fue eliminada.',
                                'success'
                            )
                        }
                    })

            }
        })
    }

    return (
        <>
            <Card>
                <CardHeader style={{ backgroundColor: '#4e73df', color: "white" }}>
                    Lista de Proveedor
                </CardHeader>
                <CardBody>
                    <Button color="success" size="sm" onClick={() => setVerModal(!verModal)}>Nueva Proveedor</Button>
                    <hr></hr>
                    <DataTable
                        columns={columns}
                        data={proveedores}
                        progressPending={pendiente}
                        pagination
                        paginationComponentOptions={paginationComponentOptions}
                        customStyles={customStyles}
                    />
                </CardBody>
            </Card>

            <Modal isOpen={verModal}>
                <ModalHeader>
                    Detalle Proveedor
                </ModalHeader>
                <ModalBody>
                    <FormGroup>
                        <Label>idProveedores</Label>
                        <Input bsSize="sm" name="descripcion" onChange={handleChange} value={proveedor.NroDocumento} />
                    </FormGroup>
                    <FormGroup>
                        <Label>NroDocumento</Label>
                        <Input bsSize="sm" name="descripcion" onChange={handleChange} value={proveedor.RazonSocial} />
                    </FormGroup>
                    <FormGroup>
                        <Label>RazonSocial</Label>
                        <Input bsSize="sm" name="descripcion" onChange={handleChange} value={proveedor.Correo} />
                    </FormGroup>
                    <FormGroup>
                        <Label>Correo</Label>
                        <Input bsSize="sm" name="descripcion" onChange={handleChange} value={proveedor.Telefono} />
                    </FormGroup>
                    <FormGroup>
                        <Label>Estado</Label>
                        <Input bsSize="sm" type={"select"} name="esActivo" onChange={handleChange} value={proveedor.esActivo} >
                            <option value={true}>Activo</option>
                            <option value={false}>No Activo</option>
                        </Input>
                    </FormGroup>
                </ModalBody>
                <ModalFooter>
                    <Button size="sm" color="primary" onClick={guardarCambios}>Guardar</Button>
                    <Button size="sm" color="danger" onClick={cerrarModal}>Cerrar</Button>
                </ModalFooter>
            </Modal>
        </>



    )
}

export default Proveedor;