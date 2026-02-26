const delete_svg = '<svg xmlns="http://www.w3.org/2000/svg" width="1.2em" height="1.2em" viewBox="0 0 24 24"><path fill="currentColor" d="M7 21q-.825 0-1.412-.587T5 19V6q-.425 0-.712-.288T4 5t.288-.712T5 4h4q0-.425.288-.712T10 3h4q.425 0 .713.288T15 4h4q.425 0 .713.288T20 5t-.288.713T19 6v13q0 .825-.587 1.413T17 21zM17 6H7v13h10zm-6.287 10.713Q11 16.425 11 16V9q0-.425-.288-.712T10 8t-.712.288T9 9v7q0 .425.288.713T10 17t.713-.288m4 0Q15 16.426 15 16V9q0-.425-.288-.712T14 8t-.712.288T13 9v7q0 .425.288.713T14 17t.713-.288M7 6v13z"/></svg>'
const edit_svg = '<svg xmlns="http://www.w3.org/2000/svg" width="1.2em" height="1.2em" viewBox="0 0 24 24"><path fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="m14.304 4.844l2.852 2.852M7 7H4a1 1 0 0 0-1 1v10a1 1 0 0 0 1 1h11a1 1 0 0 0 1-1v-4.5m2.409-9.91a2.017 2.017 0 0 1 0 2.853l-6.844 6.844L8 14l.713-3.565l6.844-6.844a2.015 2.015 0 0 1 2.852 0Z"/></svg>'
const save_svg = '<svg xmlns="http://www.w3.org/2000/svg" width="1.2em" height="1.2em" viewBox="0 0 24 24"><path fill="currentColor" d="M5 21h14c1.1 0 2-.9 2-2V8c0-.27-.11-.52-.29-.71l-4-4A1 1 0 0 0 16 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2m10-2H9v-5h6zM11 5h2v2h-2zM5 5h2v4h8V5h.59L19 8.41V19h-2v-5c0-1.1-.9-2-2-2H9c-1.1 0-2 .9-2 2v5H5z"/></svg>'
const post_svg = '<svg xmlns="http://www.w3.org/2000/svg" width="1.2em" height="1.2em" viewBox="0 0 24 24"><path fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 14L21 3m0 0l-6.5 18a.55.55 0 0 1-1 0L10 14l-7-3.5a.55.55 0 0 1 0-1z"/></svg>'

const form = document.getElementById('nachricht_form')
const new_post_btn = document.getElementById('new_post_btn')

if (localStorage.getItem('uuid') == null) {
    localStorage.setItem('uuid', crypto.randomUUID())
}
const uuid = localStorage.getItem('uuid')

const nachrichten_array = []

    function resize_input(input_element, initial_height) {
        input_element.style.height = `${initial_height}px`
        if (input_element.scrollHeight > initial_height) {
            input_element.style.height = `${input_element.scrollHeight}px`
        }
        
    }
    function get_initial_height(element) {
        return parseInt(getComputedStyle(element).getPropertyValue('height'))
    }

class Message{
    constructor(heading = 'Überschrift', name = 'Anonym', content = 'Ich war hier (:', edit = true, can_edit = true, id = null, color = Math.floor(Math.random() * 3 + 1), time = new Date().toUTCString().split(" ").slice(0, 4).join(" ")) {
        this.heading = heading
        this.name = name
        this.content = content
        this.time = time
        this.edit = edit
        this.can_edit = can_edit
        this.id = id
        this.color = color

        this.nachricht_div = document.createElement('div')
        this.nachricht_div.classList.add('nachricht')
        this.nachricht_div.classList.add('color' + this.color)

        //heading
        this.h2 = document.createElement('h2')
        this.h2.innerText = this.heading
        this.h2.classList.add('heading')
        this.nachricht_div.appendChild(this.h2)

        //name
        this.name_p = document.createElement('p')
        this.name_p.innerText = '- ' + this.name
        this.name_p.classList.add('name')
        this.nachricht_div.appendChild(this.name_p)

        //content
        this.content_p = document.createElement('p')
        this.content_p.innerText = this.content
        this.content_p.classList.add('content')
        this.nachricht_div.appendChild(this.content_p)

        //date
        this.date_p = document.createElement('p')
        this.date_p.innerText = this.time
        this.date_p.classList.add('date')
        
        if (this.can_edit) {
            //heading
            this.heading_input = document.createElement('input')
            this.heading_input.value = this.heading
            this.heading_input.classList.add('heading')
            this.heading_input.placeholder = 'Überschrift'
            this.nachricht_div.appendChild(this.heading_input)
            this.heading_input.style.display = 'none'
            
            //name
            this.name_input = document.createElement('input')
            this.name_input.value = this.name
            this.name_input.classList.add('name')
            this.name_input.placeholder = 'Spitzname'
            this.nachricht_div.appendChild(this.name_input)
            this.name_input.style.display = 'none'
            
            //content
            this.content_input = document.createElement('textarea')
            this.content_input.value = this.content
            this.content_input.classList.add('content')
            this.content_input.placeholder = 'Inhalt'
            this.nachricht_div.appendChild(this.content_input)
            this.content_input.style.display = 'none'

            //date
            this.nachricht_div.appendChild(this.date_p)
            
            this.button_div = document.createElement('div')
            this.button_div.classList.add('button_div')
            this.edit_btn = document.createElement('button')
            this.edit_btn.innerHTML = this.edit ? post_svg : edit_svg
            this.edit_btn.addEventListener('click', () => {
                if (!this.edit) {
                    new_post_btn.disabled = true
                    this.edit_btn.innerHTML = save_svg
                    this.edit_message()
                } else {
                    new_post_btn.disabled = false
                    this.edit_btn.innerHTML = edit_svg
                    this.save_message()
                }
                this.edit = !this.edit
                this.nachricht_div.classList.toggle('edit')
                new_post_btn.classList.toggle('visible')
            })
            this.button_div.appendChild(this.edit_btn)

            this.delete_btn = document.createElement('button')
            this.delete_btn.innerHTML = delete_svg
            this.delete_btn.addEventListener('click', () => {
                if (!confirm('Möchtest du diesen Beitrag wirklich löschen?')) return
                if (this.edit) {
                    new_post_btn.disabled = false
                    new_post_btn.classList.add('visible')
                }
                document.querySelector('main').removeChild(this.nachricht_div)
                nachrichten_array.splice(nachrichten_array.indexOf(this), 1)
                if (this.id != null) {
                    this.fetch_db('DELETE')
                }
            })
            this.button_div.appendChild(this.delete_btn)

            this.nachricht_div.appendChild(this.button_div)
        } else {
            //date
            this.nachricht_div.appendChild(this.date_p)
        }

        document.querySelector('main').appendChild(this.nachricht_div)
        //initial edit
        if (this.edit) {
            new_post_btn.disabled = true
            new_post_btn.classList.remove('visible')
            this.nachricht_div.classList.add('edit')
            const initial_height_content = get_initial_height(this.content_input)
            this.content_input.addEventListener('input', () => resize_input(this.content_input, initial_height_content))
        }
        nachrichten_array.push(this)

        if (this.edit) {
            this.edit_message()
        }
    }

    edit_message() {
        this.h2.style.display = 'none'
        this.name_p.style.display = 'none'
        this.content_p.style.display = 'none'
        this.content_input.style.display = 'block'
        this.name_input.style.display = 'block'
        this.heading_input.style.display = 'block'
    }
    save_message() {
        this.heading = this.heading_input.value
        this.name = this.name_input.value
        this.content = this.content_input.value
        this.heading_input.style.display = 'none'
        this.name_input.style.display = 'none'
        this.content_input.style.display = 'none'
        this.content_p.innerText = this.content
        this.name_p.innerText = '- ' + this.name
        this.h2.innerText = this.heading
        this.content_p.style.display = 'block'
        this.name_p.style.display = 'block'
        this.h2.style.display = 'block'

        this.fetch_db(this.id == null ? 'POST' : 'PUT')

    }
    fetch_db(method) {
        fetch('/.netlify/functions/message', {
            method: method,
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                id: this.id,
                heading: this.heading,
                name: this.name,
                content: this.content,
                uuid: uuid,
                color: this.color
            })
        })
    }
}

new Message('Information', 'DD', 'Dieses Gästebuch ist ein Spaßprojekt von „DD“. Hier kann man hochladen was man möchte und sich die Beiträge von anderen Personen angucken. Bitte KEINE personenbezogenen Daten veröffentlichen! „DD“ wünscht viel Spaß beim lesen und schreiben 😘.', false, false, null, 2, 'Fri, 20 Feb 2026')

fetch(`/.netlify/functions/message?uuid=${uuid}`, {
    method: 'GET',
    headers: {
        'Content-Type': 'application/json'
    }
})
.then(res => res.json())
.then(data => {
    data.forEach(message => {
        console.log(message);
        
        new Message(
            message.heading,
            message.name,
            message.content,
            false, //edit
            message.can_edit,
            message.id,
            message.color,
            message.date
        )
    })
})

