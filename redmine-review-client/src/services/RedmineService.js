import Api from '@/services/Api'

// https://redmine.tigra.hu//issues.json?assigned_to_id=me&created_on=><2020-01-01|2020-12-31&limit=100

export default {
  getUser(apiKey) {
    return Api().get("users/current.json", {
      headers: {
        'X-Redmine-API-Key': apiKey,
        "Target-URL": "https://redmine.tigra.hu/"
      }
    })
  },
  getIssues(apiKey) {
    return Api().get("issues.json?assigned_to_id=me", {
      headers: {
        'X-Redmine-API-Key': apiKey,
        "Target-URL": "https://redmine.tigra.hu/"
      }
    })
  },
  getIssuesIn2020(apiKey, offset) {
    return Api().get(`issues.json?assigned_to_id=me&created_on=><2020-01-01|2020-12-31&limit=100&status_id=open&offset=${offset}`, {
      headers: {
        'X-Redmine-API-Key': apiKey,
        "Target-URL": "https://redmine.tigra.hu/"
      }
    })
  },
  getAllCreatedIssuesIn2020(apiKey, offset) {
    return Api().get(`issues.json?&created_on=><2020-01-01|2020-12-31&author_id=me&status_id=*&limit=100&offset=${offset}`, {
      headers: {
        'X-Redmine-API-Key': apiKey,
        "Target-URL": "https://redmine.tigra.hu/"
      }
    })
  },
  getAllUpdatedIssuesIn2020(apiKey, offset) {
    return Api().get(`issues.json?updated_by=me&updated_on=><2020-01-01|2020-12-31&limit=100&status_id=*&offset=${offset}`, {
      headers: {
        'X-Redmine-API-Key': apiKey,
        "Target-URL": "https://redmine.tigra.hu/"
      }
    })
  }
}
