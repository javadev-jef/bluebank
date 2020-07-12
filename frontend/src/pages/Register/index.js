import React from "react";

import "./style.scss";
import { Link } from "react-router-dom";
import { FiArrowLeft } from "react-icons/fi";
import { useState } from "react";

export default function Register()
{
    const [nome, setNome] = useState("");
    const [cpf, setCpf] = useState("");
    const [nascimento, setNascimento] = useState("");
    const [email, setEmail] = useState("");
    const [estado, setEstado] = useState("");
    const [cidade, setCidade] = useState("");
    const [senha, setSenha] = useState("");
    const [repetirSenha, setRepetirSenha] = useState("");

    const handleSubmit = (event) =>
    {
        event.preventDefault();
        const data = {nome, cpf, nascimento, email, estado, cidade, senha, repetirSenha};
        console.log(data);
    }

    return(
        <div className="register-container">
            <div className="content">
                <section>
                    <h1 className="logo">
                        <span className="part-01">Blue</span>
                        <span className="part-02">Bank</span>
                    </h1>
                    <h1>Cadastro</h1>
                    <p>Faça seu cadastro sem burocracia.</p>
                    <p>Somos o único banco a oferecer uma conta corrente e poupança 100% digital e gratuita.</p>
                    <Link className="link-to" to="/"><FiArrowLeft />Já possuo uma conta</Link>
                </section>

                <form onSubmit={handleSubmit} autoComplete="off">
                    <input 
                        placeholder="Nome Completo"
                        value={nome}
                        onChange={e => setNome(e.target.value)}
                    />
                    <div className="input-group">
                        <input 
                            placeholder="CPF"
                            value={cpf}
                            onChange={e => setCpf(e.target.value)}
                        />
                        <input 
                            placeholder="Nascimento"
                            value={nascimento}
                            onChange={e => setNascimento(e.target.value)}
                        />
                    </div>
                    <input 
                        placeholder="E-mail"
                        value={email}
                        onChange={e => setEmail(e.target.value)}
                    />
                    <div className="input-group">
                        <select 
                            style={{width: 120}}
                            value={estado}
                            onChange={e => setEstado(e.target.value)}
                        >
                            <option value="" defaultValue hidden>Estado</option>
                            <option value="MG">MG</option>
                        </select>
                        <input 
                            placeholder="Cidade"
                            value={cidade}
                            onChange={e => setCidade(e.target.value)}
                        />
                    </div>
                    <div className="input-group">
                        <input 
                            type="password"
                            placeholder="Senha"
                            value={senha}
                            onChange={e => setSenha(e.target.value)}
                        />
                        <input 
                            type="password"
                            placeholder="Repetir senha"
                            value={repetirSenha}
                            onChange={e => setRepetirSenha(e.target.value)}/>
                    </div>
                    <input className="button" type="submit" value="Abrir minha conta"/>
                </form>
            </div>
        </div>
    );
}