CREATE TABLE colaboradores (
    cpf_colaborador CHAR(11) PRIMARY KEY,
    nome VARCHAR(150) NOT NULL,
    email VARCHAR(150),
    senha VARCHAR(255),
    cargo VARCHAR(50) NOT NULL,
    telefone VARCHAR(20),
    data_admissao DATE NOT NULL,
    data_desligamento DATE,
    status ENUM('ativo','inativo') NOT NULL
);

CREATE TABLE responsaveis (
    cpf_responsavel CHAR(11) PRIMARY KEY,
    nome VARCHAR(150) NOT NULL,
    email VARCHAR(150),
    telefone VARCHAR(20),
    data_registro DATE NOT NULL,
    status ENUM('ativo','inativo') NOT NULL
);

CREATE TABLE atletas (
    cpf_atleta CHAR(11) PRIMARY KEY,
    nome VARCHAR(150) NOT NULL,
    data_nasc DATE,
    email VARCHAR(150),
    telefone VARCHAR(20),
    escola VARCHAR(150),
    anotacoes TEXT,
    data_registro DATE NOT NULL,
    status ENUM('ativo','inativo') NOT NULL
);

CREATE TABLE endereco (
    id_endereco INT AUTO_INCREMENT PRIMARY KEY,
    cep VARCHAR(10),
    logradouro VARCHAR(150),
    numero VARCHAR(10),
    complemento VARCHAR(50),
    bairro VARCHAR(100),
    cidade VARCHAR(100),
    uf CHAR(2)
);

CREATE TABLE colaboradores_endereco (
    id_colaboradores_endereco INT AUTO_INCREMENT PRIMARY KEY,
    cpf_colaborador CHAR(11),
    id_endereco INT,
    data_inicio DATE NOT NULL,
    data_fim DATE,
    status ENUM('ativo','inativo') NOT NULL,
    FOREIGN KEY (cpf_colaborador) REFERENCES colaboradores(cpf_colaborador),
    FOREIGN KEY (id_endereco) REFERENCES endereco(id_endereco),
    INDEX (cpf_colaborador)
);

CREATE TABLE responsaveis_endereco (
    id_responsaveis_endereco INT AUTO_INCREMENT PRIMARY KEY,
    cpf_responsavel CHAR(11),
    id_endereco INT,
    data_inicio DATE NOT NULL,
    data_fim DATE,
    status ENUM('ativo','inativo') NOT NULL,
    FOREIGN KEY (cpf_responsavel) REFERENCES responsaveis(cpf_responsavel),
    FOREIGN KEY (id_endereco) REFERENCES endereco(id_endereco),
    INDEX (cpf_responsavel)
);

CREATE TABLE atletas_endereco (
    id_atletas_endereco INT AUTO_INCREMENT PRIMARY KEY,
    cpf_atleta CHAR(11),
    id_endereco INT,
    data_inicio DATE NOT NULL,
    data_fim DATE,
    status ENUM('ativo','inativo') NOT NULL,
    FOREIGN KEY (cpf_atleta) REFERENCES atletas(cpf_atleta),
    FOREIGN KEY (id_endereco) REFERENCES endereco(id_endereco),
    INDEX (cpf_atleta)
);

CREATE TABLE responsavel_atleta (
    id_responsavel_atleta INT AUTO_INCREMENT PRIMARY KEY,
    cpf_responsavel CHAR(11),
    cpf_atleta CHAR(11),
    data_inicio DATE NOT NULL,
    data_fim DATE,
    tipo_vinculo VARCHAR(30),
    FOREIGN KEY (cpf_responsavel) REFERENCES responsaveis(cpf_responsavel),
    FOREIGN KEY (cpf_atleta) REFERENCES atletas(cpf_atleta),
    UNIQUE (cpf_responsavel, cpf_atleta)
);

CREATE TABLE login_responsavel (
    id_login INT AUTO_INCREMENT PRIMARY KEY,
    cpf_responsavel CHAR(11),
    email_acesso VARCHAR(150) UNIQUE NOT NULL,
    senha VARCHAR(255) NOT NULL,
    data_cadastro DATE NOT NULL,
    status ENUM('ativo','inativo') NOT NULL,
    FOREIGN KEY (cpf_responsavel) REFERENCES responsaveis(cpf_responsavel)
);

CREATE TABLE categorias (
    id_categoria INT AUTO_INCREMENT PRIMARY KEY,
    nome VARCHAR(100) NOT NULL,
    faixa_etaria VARCHAR(50),
    data_criacao DATE NOT NULL,
    status ENUM('ativo','inativo') NOT NULL
);

CREATE TABLE periodos (
    id_periodo INT AUTO_INCREMENT PRIMARY KEY,
    descricao VARCHAR(100),
    data_inicio DATE NOT NULL,
    data_fim DATE NOT NULL,
    status ENUM('ativo','inativo') NOT NULL
);

CREATE TABLE turmas (
    id_turma INT AUTO_INCREMENT PRIMARY KEY,
    nome VARCHAR(100),
    horario VARCHAR(100),
    dias_da_semana VARCHAR(100),
    id_categoria INT,
    id_periodo INT,
    status ENUM('ativo','inativo') NOT NULL,
    FOREIGN KEY (id_categoria) REFERENCES categorias(id_categoria),
    FOREIGN KEY (id_periodo) REFERENCES periodos(id_periodo)
);

CREATE TABLE turmas_treinadores (
    id_turma_treinador INT AUTO_INCREMENT PRIMARY KEY,
    id_turma INT,
    cpf_colaborador CHAR(11),
    funcao VARCHAR(100),
    data_inicio DATE NOT NULL,
    data_fim DATE,
    FOREIGN KEY (id_turma) REFERENCES turmas(id_turma),
    FOREIGN KEY (cpf_colaborador) REFERENCES colaboradores(cpf_colaborador),
    UNIQUE (id_turma, cpf_colaborador)
);

CREATE TABLE matriculas (
    id_matricula INT AUTO_INCREMENT PRIMARY KEY,
    cpf_atleta CHAR(11),
    id_turma INT,
    data_matricula DATE NOT NULL,
    status ENUM('ativa','cancelada','concluida') NOT NULL,
    FOREIGN KEY (cpf_atleta) REFERENCES atletas(cpf_atleta),
    FOREIGN KEY (id_turma) REFERENCES turmas(id_turma),
    INDEX (cpf_atleta)
);

CREATE TABLE presenca (
    id_presenca INT AUTO_INCREMENT PRIMARY KEY,
    id_matricula INT,
    data_aula DATE NOT NULL,
    presente BOOLEAN NOT NULL,
    justificativa VARCHAR(150),
    FOREIGN KEY (id_matricula) REFERENCES matriculas(id_matricula),
    UNIQUE (id_matricula, data_aula)
);
