import React, { Component } from 'react'
import { Tabs, Tab, Table, Button, Form, Row, Col } from 'react-bootstrap'
import axios from 'axios'
import { baseApiUrl } from '../global'
import { FaTrashAlt, FaPen } from 'react-icons/fa'
import { Link } from 'react-router-dom'


export default class Cadastro extends Component {

    state = {
        pessoas: [],
        salas: [],
        pessoaId: '',
        pessoaNome: '',
        pessoaEmail: '',
        pessoaTelefone: null,
        pessoaPassword: null,
        pessoaAdmin: false,
        salaId: '',
        salaDescricao: '',
        salaCapacidade: '',
        invalidForm: false,
        loggedUser: JSON.parse(localStorage.getItem('userKey'))
    }

    resetState() {
        this.setState({
            pessoaId: '',
            pessoaNome: '',
            pessoaEmail: '',
            pessoaTelefone: null,
            pessoaPassword: '',
            salaId:'',
            pessoaAdmin: false,
            salaDescricao: '',
            salaCapacidade: '',
            invalidForm: false
        });
    }

    componentDidMount = async () => {
        this.checkAdmin()
        this.getSalas()
        this.getPessoas()
    }

    checkAdmin() {
        this.setState({loggedUser: JSON.parse(localStorage.getItem('userKey'))})

        if (!this.state.loggedUser.idnadmin) {
            this.props.history.push('/agenda')
        }
    }

    getSalas = async () => {
        try {
            const resSalas = await axios.get(`${baseApiUrl}/salas`)
            this.setState({ salas: resSalas.data })

        } catch (err) {
            alert(err)
        }
    }
    getPessoas = async () => {
        try {
            const resPessoas = await axios.get(`${baseApiUrl}/pessoas`)
            this.setState({ pessoas: resPessoas.data })
        } catch (err) {
            alert(err)
        }
    }

    submitPessoa = async () => {
        if (!this.state.pessoaNome || !this.state.pessoaEmail || !this.state.pessoaPassword && !this.state.pessoaId) {
            this.setState({ invalidForm: true })
            return
        }

        if (this.state.pessoaId) {
            try {
                await axios.put(`${baseApiUrl}/pessoas/${this.state.pessoaId}`, this.state.pessoaPassword ? {
                    nome: this.state.pessoaNome,
                    email: this.state.pessoaEmail,
                    telefone: this.state.pessoaTelefone || null,
                    idnadmin: this.state.pessoaAdmin,
                    password: this.state.pessoaPassword,
                    passwordConfirm: this.state.pessoaPassword
                } : 
                {
                    nome: this.state.pessoaNome,
                    email: this.state.pessoaEmail,
                    telefone: this.state.pessoaTelefone || null,
                    idnadmin: this.state.pessoaAdmin,
                })
            } catch (err) {
                alert(err)
            }
        } else {
            try {
                await axios.post(`${baseApiUrl}/pessoas`, {
                    nome: this.state.pessoaNome,
                    email: this.state.pessoaEmail,
                    telefone: this.state.pessoaTelefone || null,
                    idnadmin: this.state.pessoaAdmin,
                    password: this.state.pessoaPassword,
                    passwordConfirm: this.state.pessoaPassword
                })
            } catch (err) {
                alert(err)
            }
        }
        this.getPessoas()
        this.resetState()
    }

    deletePessoa = async (idpessoa) => {
        try {
            await axios.delete(`${baseApiUrl}/pessoas/${idpessoa}`)
        } catch (err) {
            alert(err)
        }
        this.getPessoas()
    }

    submitSala = async () => {
        if (!this.state.salaDescricao || !this.state.salaCapacidade) {
            this.setState({ invalidForm: true })
            return
        }

        if (this.state.salaId) {
            try {
                await axios.put(`${baseApiUrl}/salas/${this.state.salaId}`, {
                    descricao: this.state.salaDescricao,
                    capacidade: this.state.salaCapacidade
                })
            } catch (err) {
                alert(err)
            }
        } else {
            try {
                await axios.post(`${baseApiUrl}/salas`, {
                    descricao: this.state.salaDescricao,
                    capacidade: this.state.salaCapacidade
                })
            } catch (err) {
                alert(err)
            }
        }
        this.getSalas()
        this.resetState()
    }

    deleteSala = async (idsala) => {
        try {
            await axios.delete(`${baseApiUrl}/salas/${idsala}`)
        } catch (err) {
            alert(err)
        }
        this.getSalas()
    }

    render() {
        return (
            <div>
                <Tabs defaultActiveKey="pessoa">
                    <Tab eventKey="pessoa" title="Pessoas">
                        <Form className="mr-4 m-3">
                            <Row>
                                <Col>
                                    <Form.Label>Nome</Form.Label>
                                    <Form.Control
                                        value={this.state.pessoaNome}
                                        onChange={(e) => this.setState({ pessoaNome: e.target.value })}
                                        type="text" placeholder="Informe o nome"
                                        isInvalid={!this.state.pessoaNome && this.state.invalidForm}
                                    />
                                </Col>
                                <Col>
                                    <Form.Label>E-mail</Form.Label>
                                    <Form.Control
                                        value={this.state.pessoaEmail}
                                        onChange={(e) => this.setState({ pessoaEmail: e.target.value })}
                                        type="email" placeholder="Informe o E-mail"
                                        isInvalid={!this.state.pessoaEmail && this.state.invalidForm}
                                    />
                                </Col>
                                <Col>
                                    <Form.Label>Telefone</Form.Label>
                                    <Form.Control
                                        value={this.state.pessoaTelefone}
                                        onChange={(e) => this.setState({ pessoaTelefone: e.target.value })}
                                        type="telephone" placeholder="Informe o telefone"
                                        isInvalid={!this.state.pessoaTelefone && this.state.invalidForm}
                                    />
                                </Col>
                                <Col>
                                    <Form.Label>Senha</Form.Label>
                                    <Form.Control
                                        value={this.state.pessoaPassword}
                                        onChange={(e) => this.setState({ pessoaPassword: e.target.value })}
                                        type="password" placeholder="Informe a Senha"
                                        isInvalid={!this.state.pessoaPassword && this.state.invalidForm}
                                    />
                                </Col>
                                <Col>
                                    <Form.Label>Administrador?</Form.Label>
                                    <Form.Check
                                        type="switch"
                                        id="custom-switch"
                                        label=""
                                        onChange={(e) =>  {
                                            this.setState({ pessoaAdmin: e.target.checked })
                                        }
                                        }
                                        checked={this.state.pessoaAdmin}
                                    />
                                </Col>
                                <Button className="mr-1" variant="primary" onClick={(e) => this.submitPessoa(e)}>
                                    Gravar
                                </Button>
                                {this.state.pessoaId ? <Button variant="warning" onClick={() => {
                                    this.setState({
                                        pessoaId: '',
                                        pessoaNome: '',
                                        pessoaEmail: '',
                                        pessoaTelefone: null,
                                        pessoaPassword: '',
                                        pessoaAdmin: false,
                                        invalidForm: false
                                    })
                                }}>Limpar</Button>
                                    : ''}
                            </Row>
                        </Form>
                        <Table striped bordered hover>
                            <thead>
                                <tr>
                                    <th>Nome</th>
                                    <th>E-mail</th>
                                    <th>Telefone</th>
                                    <th>Administrador?</th>
                                    <th>Ações</th>
                                </tr>
                            </thead>
                            <tbody>
                                {this.state.pessoas.map((pessoa) => {
                                    return (
                                        <tr>
                                            <td>{pessoa.nome}</td>
                                            <td>{pessoa.email}</td>
                                            <td>{pessoa.telefone}</td>
                                            <td>{pessoa.idnadmin ? 'Sim' : 'Não'}</td>
                                            <td>
                                                <Button className="mr-1" variant="primary" onClick={() => {
                                                    this.setState({
                                                        pessoaId: pessoa.id,
                                                        pessoaNome: pessoa.nome,
                                                        pessoaEmail: pessoa.email,
                                                        pessoaTelefone: pessoa.telefone,
                                                        pessoaAdmin: pessoa.idnadmin
                                                    })
                                                }}><FaPen /></Button>
                                                <Button variant="danger" onClick={() => {
                                                    this.deletePessoa(pessoa.id)
                                                }}><FaTrashAlt /></Button>
                                            </td>
                                        </tr>
                                    )
                                })}
                            </tbody>
                        </Table>
                    </Tab>

                    <Tab eventKey="sala" title="Salas">
                        <Form className="mr-4 m-3">
                            <Row>
                                <Col>
                                    <Form.Label>Descrição</Form.Label>
                                    <Form.Control
                                        value={this.state.salaDescricao}
                                        onChange={(e) => this.setState({ salaDescricao: e.target.value })}
                                        type="text" placeholder="Informe a descrição"
                                        isInvalid={!this.state.salaDescricao && this.state.invalidForm}
                                    />
                                </Col>
                                <Col>
                                    <Form.Label>Capacidade de pessoas</Form.Label>
                                    <Form.Control
                                        value={this.state.salaCapacidade}
                                        onChange={(e) => this.setState({ salaCapacidade: e.target.value })}
                                        type="number" placeholder="Informe a capacidade"
                                        isInvalid={!this.state.salaCapacidade && this.state.invalidForm}
                                    />
                                </Col>
                                <Button className="mr-1" variant="primary" onClick={(e) => this.submitSala(e)}>
                                    Gravar
                </Button>
                                {this.state.salaId ? <Button variant="warning" onClick={() => {
                                    this.setState({
                                        salaId: '',
                                        salaDescricao: '',
                                        salaCapacidade: '',
                                        invalidForm: false
                                    })
                                }}>Limpar</Button>
                                    : ''}
                            </Row>
                        </Form>
                        <Table striped bordered hover>
                            <thead>
                                <tr>
                                    <th>Descrição</th>
                                    <th>Capacidade</th>
                                    <th>Ações</th>
                                </tr>
                            </thead>
                            <tbody>
                                {this.state.salas.map((sala) => {
                                    return (
                                        <tr>
                                            <td>{sala.descricao}</td>
                                            <td>{sala.capacidade}</td>
                                            <td>
                                                <Button className="mr-1" variant="primary" onClick={() => {
                                                    this.setState({
                                                        salaId: sala.id,
                                                        salaDescricao: sala.descricao,
                                                        salaCapacidade: sala.capacidade,
                                                    })
                                                }}><FaPen /></Button>
                                                <Button variant="danger" onClick={() => {
                                                    this.deleteSala(sala.id)
                                                }}><FaTrashAlt /></Button>
                                            </td>
                                        </tr>
                                    )
                                })}
                            </tbody>
                        </Table>
                    </Tab>
                </Tabs>
                <Link className="mt-5" to="/agenda"><Button variant="secondary">Ir para agenda</Button></Link>
            </div>
        )
    }
}