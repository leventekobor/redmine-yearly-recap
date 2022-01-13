import axios from 'axios'

// TODO: beégetett backend URL kivezetése `.env`-be
export default () => {
    return axios.create({
        // cors proxy url
        baseURL: 'http://localhost:3000/api'
    })
}
