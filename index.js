let participantes = [];

fetch('https://jsonplaceholder.org/users')
  .then(response => response.json())
  .then(users => {
    users.forEach(function(user){
      participantes.push({
        nome: user.firstname+' '+user.lastname,
        email: user.email,
        dataInscricao: new Date(user.login.registered),
        dataCheckIn: gerarDataAleatoria()
      })
    })
    atualizaLista(participantes)
  })

const criaNovoParticipante = (participante) => {
  const dataInscricao = dayjs(Date().now).to(participante.dataInscricao)
  
  const dataCheckIn = participante.dataCheckIn == null ? 
    `<button
      data-email="${participante.email}"
      onclick="confirmarCheckIn(event)"
    >Confimar Check-In</button>` 
    : dayjs(Date().now).to(participante.dataCheckIn)

  return `
    <tr>
      <td>
        <strong>${participante.nome}</strong>
        <br/>
        <small>${participante.email}</small>
      </td>
      <td>
        <span>${dataInscricao}</span>
      </td>
      <td>
        <span>${dataCheckIn}</span>
      </td>
    </tr>
  `
}

const atualizaLista = (participantes) => {
  let output = ''
  
  for(let participante of participantes){
    output = output + criaNovoParticipante(participante)
  }

  document
  .querySelector('tbody')
  .innerHTML = output
}

function gerarDataAleatoria() {
    const dataAtual = new Date();
    // Obtém o timestamp da data de início (1º de janeiro de 2022)
    const dataInicio = new Date('2022-01-01').getTime();
    // Calcula um valor aleatório entre a data de início e a data atual
    const dataAleatoriaTimestamp = dataInicio + Math.random() * (dataAtual.getTime() - dataInicio);
    const dataAleatoria = new Date(dataAleatoriaTimestamp);

    return dataAleatoria;
}

const adicionarParticipante = (event) => {
  event.preventDefault()

  const formData = new FormData(event.target)

  const participante = {
    nome: formData.get('nome'),
    email: formData.get('email'),
    dataInscricao: new Date(),
    dataCheckIn: null
  }

  const participanteExiste = participantes.find(
    (p) => {
      return p.email === participante.email
    }
  )
  if(participanteExiste){
    alert('Email já cadastrado!')
    event.target.querySelector('[name="nome"]').value = ''
    event.target.querySelector('[name="email"]').value = ''
    return
  }

  participantes = [participante, ...participantes]
  atualizaLista(participantes)

  event.target.querySelector('[name="nome"]').value = ''
  event.target.querySelector('[name="email"]').value = ''

}

const confirmarCheckIn = (event) => {
  if(confirm('Deseja realiza o check-in?') == false) return

  const participante = participantes.find((p) => {
    return p.email === event.target.dataset.email
  })

  participante.dataCheckIn = new Date()

  atualizaLista(participantes)
}