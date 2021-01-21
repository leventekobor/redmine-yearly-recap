import Api from '@/services/Api'

export default {
  getUser(apiKey) {
    console.log('getting user ' + apiKey)
    return Api().get("users/current.json", {
      headers: {
        'X-Redmine-API-Key': apiKey,
        "Target-URL": "https://redmine.tigra.hu/"
      }
    })
  }
}
