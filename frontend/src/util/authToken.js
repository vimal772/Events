import { redirect } from "react-router-dom"

export function getAuthToken () {
    const token = localStorage.getItem('authToken')
    return token
}

export function checkAuthLoader() {
    const token = getAuthToken()
    if(!token) {
        return null
    }
    return token
}

export function chechTokenLoader() {
    const token = getAuthToken()
    if(!token) {
        redirect('/auth')
    }
    return null
}