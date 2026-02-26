import { neon } from '@netlify/neon';

const sql = neon()

export const handler = async (event) => {
    const headers = {
        'Access-Control-Allow-Origin': '*',
        'Content-Type': 'application/json'
    };
    if (event.httpMethod === 'POST') {
        const { id, heading, name, content, uuid, color } = JSON.parse(event.body)
        const message_id = await sql`
        INSERT INTO message (heading, name, content, date, color, author)
        VALUES (${heading}, ${name}, ${content}, ${new Date().toUTCString().split(" ").slice(0, 4).join(" ")}, ${color}, ${uuid})
        RETURNING id`
        return {
            statusCode: 200,
            headers,
            body: JSON.stringify({id: message_id[0].id})
        }
    } else if (event.httpMethod === 'PUT') {
        const { id, heading, name, content, uuid, color } = JSON.parse(event.body)
        await sql`UPDATE message SET heading = ${heading}, name = ${name}, content = ${content}, date = ${new Date().toUTCString().split(" ").slice(0, 4).join(" ")}, color = ${color} WHERE id = ${id} AND author = ${uuid}`
        return {
            statusCode: 200,
            headers
        }
    } else if (event.httpMethod === 'DELETE') {
        const { id, heading, name, content, uuid, color } = JSON.parse(event.body)
        await sql`DELETE FROM message WHERE id = ${id} AND author = ${uuid}`
        return {
            statusCode: 200,
            headers
        }
    } else if (event.httpMethod === 'GET') {
        const uuid = event.queryStringParameters.uuid;
        const messages = await sql`
            SELECT id, heading, name, content, date, color, author
            FROM message
        `;
        messages.forEach(message => {
            message.can_edit = message.author === uuid;
            delete message.author;
        });
        return {
            statusCode: 200,
            headers,
            body: JSON.stringify(messages)
        };
    } else {
        return {
            statusCode: 405,
            headers,
            body: JSON.stringify({ error: 'Method Not Allowed' })
        }
    }
}