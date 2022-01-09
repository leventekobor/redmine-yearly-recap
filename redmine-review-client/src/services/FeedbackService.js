import Api from '@/services/Api'

export default {
  sendFeedback(feedback) {
    return Api().post("feedback", feedback)
  },
  getFeedback() {
    return Api().get("feedback")
  },
  checkFeedback(id) {
      return Api().get(`feedback/${id}`)
  }
}
