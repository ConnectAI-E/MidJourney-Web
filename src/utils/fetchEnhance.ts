import {licenceKeyRef, userUUID} from '@/ui.state';

export async function fetchPost(url = '', data = {}) {
  const response = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  })
  return response.json()
}

export async function fetchPut(url = '', data = {}) {
  const response = await fetch(url, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  })
  return response.json()
}

export async function fetchDelete(url = '', data = {}) {
    const response = await fetch(url, {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
    })
    return response.json()
}


export async function fetchGet(url = '') {
    const response = await fetch(url, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            'X-License-Key':licenceKeyRef.value ,
            'X-UUID': userUUID.value
        },
    })
    if (!response.ok) {
        throw new Error(response.statusText)
    }
    return response.json()
}
