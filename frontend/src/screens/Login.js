import React, { Component } from 'react'
import { Button, Form, Row } from 'react-bootstrap'
import axios from 'axios'
import { baseApiUrl } from '../global'


class Login extends Component {

    state = {
        email:'',
        password:'',
        invalidForm: false,
    }

    login = async () => {
        try {
            await axios.post(`${baseApiUrl}/pessoas/signin`, {
                email: this.state.email,
                password: this.state.password
            })
            .then(res => {
                localStorage.setItem('userKey', JSON.stringify(res.data))
                return this.props.history.push('/agenda')
            })
          } catch (error) {
            if (error.response)
                alert(error.response.data)
            else
                alert(error.toString())
        }
    }

    render() {
        return (
            <div className="mx-auto border border-secondary rounded w-50 mt-5">
            <Form className="mx-auto w-75 py-3 ">
                <Row>
                    <Form.Label>E-mail</Form.Label>
                    <Form.Control
                        value={this.state.email}
                        onChange={(e) => this.setState({ email: e.target.value })}
                        onKeyPress={(e) => {
                            if (e.charCode==13) {
                                this.login(e)
                            }
                        }}
                        type="email" placeholder="Informe o E-mail"
                        isInvalid={!this.state.email && this.state.invalidForm}
                    />
                </Row>
                <Row>
                    <Form.Label>Senha</Form.Label>
                    <Form.Control
                        value={this.state.password}
                        onChange={(e) => this.setState({ password: e.target.value })}
                        onKeyPress={(e) => {
                            if (e.charCode==13) {
                                this.login(e)
                            }
                        }}
                        type="password" placeholder="Informe a senha"
                        isInvalid={!this.state.password && this.state.invalidForm}
                    />
                </Row>
                <Row>
                    <Button className="mx-auto w-50 mt-3" variant="primary" onClick={(e) => this.login(e)}>
                        Entrar
                </Button>
                </Row>
            </Form>
            </div>
        )
    }
}

export default Login