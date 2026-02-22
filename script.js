const form = document.getElementById('nachricht_form')

const nachrichten_array = []

form.addEventListener('submit', e => {
    e.preventDefault()
    const heading = document.getElementById('heading_input').value || undefined
    const name = document.getElementById('spitzname_input').value || undefined
    const content = document.getElementById('nachricht_input').value || undefined

    new Message(heading, name, content)
})

class Message{
    constructor(heading = 'Überschrift', name = 'Anonym', content = 'Ich war hier (:', color = Math.floor(Math.random() * 3 + 1), time = new Date().toUTCString().split(" ").slice(0, 4).join(" ")) {
        this.heading = heading
        this.name = name
        this.content = content
        this.time = time
        this.color = color

        this.nachricht_div = document.createElement('div')
        this.nachricht_div.classList.add('nachricht')
        this.nachricht_div.classList.add('color' + this.color)

        this.h2 = document.createElement('h2')
        this.h2.innerText = this.heading
        this.nachricht_div.appendChild(this.h2)

        this.name_p = document.createElement('p')
        this.name_p.innerText = '- ' + this.name
        this.name_p.classList.add('name')
        this.nachricht_div.appendChild(this.name_p)

        this.content_p = document.createElement('p')
        this.content_p.innerText = this.content
        this.content_p.classList.add('content')
        this.nachricht_div.appendChild(this.content_p)

        this.date_p = document.createElement('p')
        this.date_p.innerText = this.time
        this.date_p.classList.add('date')
        this.nachricht_div.appendChild(this.date_p)

        document.querySelector('main').appendChild(this.nachricht_div)
        nachrichten_array.push(this)
    }
}

new Message('Information', 'DD', 'Dieses Gästebuch ist ein Spaßprojekt von „DD“. Hier kann man hochladen was man möchte und sich die Beiträge von anderen Personen angucken. Bitte KEINE personenbezogenen Daten veröffentlichen! „DD“ wünscht viel Spaß beim lesen und schreiben 😘.', 2, 'Fri, 20 Feb 2026')