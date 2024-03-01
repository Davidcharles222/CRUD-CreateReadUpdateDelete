'use strict'

const openModal = () => document.getElementById('modal').classList.add('active')
const closeModal = () => {
    clearFields()
    document.getElementById('modal').classList.remove('active')
}

/*
const tempClient = {
    nome: "Pronto atualizado",
    email: "David@gmail.com",
    celular: "11123459876",
    cidade: "São Roque"
}
*/

 const getLocalStorage = () => JSON.parse(localStorage.getItem('dbClient')) ?? [] 
 const setLocaStorage = (dbClient) => localStorage.setItem('dbClient',JSON.stringify(dbClient))


// CRUD - create read update delete
const deleteClient = (index) => {
    const dbClient = readClient()
    dbClient.splice(index, 1)
    setLocaStorage(dbClient)
}

const updateClient = (index, client) => {
    const dbClient = readClient()
    dbClient[index] = client
    setLocaStorage(dbClient)
}

const readClient = () => getLocalStorage()

const createClient = (client) => {
    const dbClient = getLocalStorage();
    dbClient.push(client)
    setLocaStorage(dbClient)
}

const isValidFields = () => {
    // retorna verdadeiro caso todos os campos tenham sido preenchidos, necessitam estar com REQUIRED no HTML
    return document.getElementById('form').reportValidity()
}

// Interação com o layout
const clearFields = () => {
    const fields = document.querySelectorAll('.modal-field')
    fields.forEach(field => field.value = '')
}

const saveClient = () => {
    if (isValidFields()) {
        const client = {
            nome: document.getElementById('nome').value,
            email: document.getElementById('email').value,
            celular: document.getElementById('celular').value,
            cidade: document.getElementById('cidade').value
        }

        const index = document.getElementById('nome').dataset.index

        if (index == 'new') {
            createClient(client)
            updateTable()
            closeModal()
        } else {
            updateClient(index, client)
            updateTable()
            closeModal()
        }
    }
}

const createRow = (client, index) => {
    const newRow = document.createElement('tr')
    newRow.innerHTML = `
        <td>${client.nome}</td>
        <td>${client.email}</td>
        <td>${client.celular}</td>
        <td>${client.cidade}</td>
        <td>
            <button type='button' class='button green' id='edit-${index}'>Editar</button>
            <button type='button' class='button red' id='delete-${index}'>Excluir</button>
        </td>
    `
    document.querySelector('#tableClient>tbody').appendChild(newRow)
}

const clearTable = () => {
    const rows = document.querySelectorAll('#tableClient>tbody tr')
    rows.forEach(row => row.parentNode.removeChild(row))//remover ele mesmo evitar duplicidade
    
}

const updateTable = () => {
    const dbClient = readClient()
    clearTable()
    dbClient.forEach((item, index) => createRow(item, index))
}

const fillFields = (client) => {
    document.getElementById('nome').value = client.nome
    document.getElementById('email').value = client.email
    document.getElementById('celular').value = client.celular
    document.getElementById('cidade').value = client.cidade
    document.getElementById('nome').dataset.index = client.index
}

const editClient = (index) => {
    const client = readClient()[index]
    client.index = index
    fillFields(client)
    openModal()
}

const editDelete = (event) => {
    if (event.target.type == 'button') {

        const [action, index] = event.target.id.split('-')

        if (action == 'edit') {
            editClient(index)
        } else {
            const client = readClient()[index]
            const response = confirm(`Deseja realmente excluir o cliente ${client.nome}`)
            if (response) {
                deleteClient(index)
                updateTable()
            }
        }
    }
}

updateTable()// sempre que atualizar a tela 

// Eventos
document.getElementById('cadastrarCliente').addEventListener('click',openModal)
document.getElementById('modalClose').addEventListener('click', closeModal)
document.getElementById('salvar').addEventListener('click', saveClient)
document.querySelector('#tableClient>tbody').addEventListener('click',editDelete)
document.getElementById('cancelar').addEventListener('click',closeModal)