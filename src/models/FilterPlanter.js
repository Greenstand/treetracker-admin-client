/*
 * A simple model for tree filter
 */

export default class Filter {

  constructor(options) {
    Object.assign(this, options)
  }

  getBackloopString(includeFilterString=true) {
    //{{{
    let result = ''
		const prefix = includeFilterString ? '&filter[where]' : '&where'

    if (this.personId) {
      result += `${prefix}[personId]=${this.personId}`
    }

    if (this.id) {
      result += `${prefix}[id]=${this.id}`
    }

    if (this.firstName) {
      result += `${prefix}[firstName]=${this.firstName}`
    }

    if (this.lastName) {
      result += `${prefix}[lastName]=${this.lastName}`
    }

    return result
    //}}}
  }
}
