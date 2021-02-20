# Blue Bank

![REACT](https://img.shields.io/static/v1?label=REACT&message=FRONTEND&color=0091EA&style=flat&logo=REACT)
![JAVA](https://img.shields.io/static/v1?label=JAVA&message=BACKEND&color=0091EA&style=flat&logo=JAVA)
![SPRING](https://img.shields.io/static/v1?label=Spring&message=FRAMEWORK&color=0091EA&style=flat&logo=Spring)

Este projeto visa a construção de uma aplicação bancaria digital, imposto pelo professor da instituição *Softblue Cursos Online*, *Carlos Tosin*. A aplicação possui um frontend em [ReactJS](https://pt-br.reactjs.org/) que permite aos usuários realizarem operações de saques, depositos, e transferências, como também acesso ao extrado bancario. Todas estas requisições são realizadas diretamente ao backend construido em Java utilizando Spring Framework.

## Pré Requisitos
* [**Git**](https://git-scm.com/)
* [**Node**](https://nodejs.org/)
* [**Java 15+**](https://jdk.java.net/15/)
* [**Lombok**](https://projectlombok.org/)
* [**Mysql 8+**](https://dev.mysql.com/downloads/)

## Preview
![Blue Bank Pages](/bluebank-pages.gif)

## Configurações
Após a importação do projeto, é necessário realizar algumas configurações básicas dependendo da IDE ou editor de código utilizado.

![Blue Bank Settings](/bluebank-settings.gif)

:warning: Uma das bibliotecas utilizadas neste projeto, é a [**Lombok**](https://projectlombok.org/). Ao utilizar esta biblioteca, a IDE poderá apresentar alguns erros informando a ausencia dos métodos acessores da aplicação. Como precaução deste problema, é necessário a instalação do plugin [**Lombok**](https://projectlombok.org/) na IDE utilizada.

#### VS Code
Adicionar as configurações a baixo ao arquivo launch.json.
```json
{
    //...
    "console": "internalConsole",
    "vmArgs": "-Dspring.profiles.active=dev"
}
```
#### Eclipse
Adicionar um VM arguments para JVM.
```properties
-Dspring.profiles.active=dev
```

A especificação acima de `vmArgs` ou `VM arguments` indica a JVM qual profile será utilizado na execução do projeto em modo desenvolvimento.

:warning: Antes de iniciar o frontend é necessário instalar suas dependências, via comando *npm install*.

## Decisões de Design e Implementação

### Geral
* Erros de input são exibidos no próprio elemento, via atributo *title*.
* O usuário sempre é desconectado na tentativa de alguma requisição com token expirado.
* Erros de validação de formulários gerados pelo servidor, são retornados ao cliente e repassados o hook `useForm` para tratativa visual das mensagens de erro.
* Visando uma melhor experiência para o usuário, o tamanho minimo de tela aceitável para está aplicação é de *800x600*.

### Logon e Controle de Acesso
* Adicionado número da conta, CPF, ou CNPJ como opções de acesso, visando mais praticidade ao usuário na tentativa de autenticação.
* Classe `UserLogon` recebe os dados de login, tornando-se um objeto pronto para ser utilizado no serviço de autenticação. 

#### Dificuldades
1. Criar um filtro de autenticação para validar o objeto `UserLogon` antes de qualquer outro.
2. Quando a aplicação esta em execução, o Spring executa o filtro para qualquer rota solicitada, bloqueando o acesso as rotas publicas.
3. Falha na tentativa leitura da *InputStream* no filtro de segurança de `UserLogon`. *InputStream* encontra-se fechada e/ou já consumida pelo Spring.

#### Tratativas
1. **EntryAuthenticationFilter:** Primeiro da cadeia de filtros de segurança, com a lógica de validação do objeto `UserLogon`.
2. **shouldNotFilter:** Método que indica se o filtro deve ser executado. O método foi sobrescrito, possuindo uma lógica única que valida somente as rotas protegidas.
3. **RequestWrapper:** Provê a possíblidade de leitura do conteúdo da *InputStream*, e permite repassa-la novamente para a cadeia de filtros sem nenhum bloqueio.

### Segurança da Aplicação
Controle de autenticação implementado com JSON Web Tokens (JWT).

#### Dificuldades
1. Informar ao cliente de forma clara os erros do processo de autenticação ou autorização gerados no filtro de segurança.
2. Exceptions lançadas por filtros, não são capturadas pela classe `WebRequestExceptionHandler`.
3. Quando o usuário é desconectado, seu token ainda continua sendo valido até a expiração.
4. Excesso tokens inválidos armazenados no banco de dados.

#### Tratativas
1. Criado dois métodos especificos na classe `WebRequestExceptionHandler` para capturar as exceptions `ExpiredJwtException` e `BlockedTokenException` e retornar ao cliente uma mensagem customizada.
2. Implementado a classe `JWTAuthenticationEntryPoint` e adicionada as configurações do `WebSecurityConfig` para ser o objeto de entrada para qualquer exception lançada pelos filtros. Sendo assim o tipo da exceção é identificada e encaminhada ao `WebRequestExceptionHandler` via objeto `HandlerExceptionResolver`.
3. Adicionado ao *controller* um endpoint especifico para logout. A chamada ao endpoint é realizada passando o JWT como parametro. Desta forma o token é armazenado em uma *blacklist table*, que é consultada em toda requisição.
4. Para evitar este acumolo desnecessário, foi implementado uma rotina na classe `ScheduledTasks`, que realiza a exclusão de tokens expirados.

### Home

**AccountCard:** Componente responsável por exibir o saldo de cada conta do usuário, podendo ser ocultado/exibido, com salvamento do *state* em *Local Storage*.

### Statement

Visando a usabilidade dos recursos da página de extrato, foi criado o componente `StatementListTable`. Este componente recebe um objeto do hook `useStatements` e realiza a construção de uma tabela com as informações da conta especificada. Também é possível exportar o extrato, realizar impressão, e alterações na exibição de colunas.

### Transfer

Com base nos dados de transferência informado pelo usuário, é possível também realizar um agendamento futuro. As transferências agendadas são verificadas diariamente pela rotina implementada na classe `ScheduledTasks`.

#### Dificuldades
1. Transferências agendadas e que não sejam o ultimo movimento da tabela, estão afetando a ordem dos registros no extrato.
2. Tentativa de transferência agendada com saldo insuficiente.

#### Tratativas
1. Nova coluna (*sequence*) adicionada a tabela. O valor da coluna sempre é atualizado no momento de efitivação do agendamento. Os registros agora são ordenados no extrato com base na coluna *sequence*.
2. Neste caso, é registrado no extrato do usuário um movimento constando a tentativa de transferência. Toda lógica é realizada em `ScheduledTasks`.

### Deposit e Withdraw
A construção destas duas telas foram desenvolvidas sobre a possibilidade do usuário realizar operações com uma moeda virtual do próprio banco.
Além disso, todos os depósitos realizados a partir de 18:00h são compensados no dia seguinte.
#### Dificuldades
1. O desenvolvimento da moeda.
2. A utilização da moeda deve ser única, sem a possíbilidade de reutilizações.
3. Gerar a moeda em um tipo de arquivo que seja possível a leitura pelo usuário e também pelo sistema.
4. Como realizar o envio da moeda na tela de depósito?
5. Construção e impressão de um comprovante de depósito.

#### Tratativas
1. Realizado a construção de um tipo de papel moeda virtual. Este recurso possui um *QR Code* que é gerado a partir de um serviço terceiro, e que é analisado no momento do depósito. 
2. Todo *BlueCoin* gerado via saque é armazenado em uma tabela do banco de dados. Assim que uma tentativa de depósito é realizada, as informações desta moeda é verificada com a tabela do banco de dados, evitando uma tentativa de reutilização.
3. Utilizado a lib `dom-to-image` que realiza um tipo de parse de um nó HTML para um imagem.
4. Os dados do formulário de depósito foram encriptados com tipo `multipart/form-data`. Com este tipo de encriptação, foi possível enviar a moeda ao servidor junto com os demais dados da requisição. Já no servidor, foi utilizado o `WebClient` do Spring, que conecta com serviço terceiro e realiza o parse da moeda.
5. Através do componente `Receipt`, é gerado um comprovante contendo as informações básicas do saque realizado. Para o recurso de impressão, foi utilizado a lib `react-to-print`, que basicamente realiza uma impressão de um componente especificado.

### Register e Profile
Páginas similares, que utilizam os hooks `useCities` e `useStates`. Estes hooks retornam um listagem de estados e cidades diretamente da base de dados do [**IBGE**](https://servicodados.ibge.gov.br/api/docs/localidades).

### Recursos e Libs Utilizadas
[Material UI](https://material-ui.com/), [Momement JS](https://momentjs.com/), [Axios](https://github.com/axios/axios), [DOM to Image](https://github.com/tsayen/dom-to-image), [JWT Decode](https://github.com/auth0/jwt-decode), [Node Sass](https://github.com/sass/node-sass), [Object to Formdata](https://github.com/therealparmesh/object-to-formdata), [React Hook Form](https://react-hook-form.com/), [React Icons](https://react-icons.github.io/react-icons/), [React Number Format](https://github.com/s-yadav/react-number-format), [React Responsive](https://github.com/contra/react-responsive), [Yup](https://github.com/jquense/yup), [IBGE API](https://servicodados.ibge.gov.br/api/docs/localidades).
