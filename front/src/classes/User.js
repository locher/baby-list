import { getItems } from '@/apis/item'

class User {
  constructor(user) {
    this.id = user.id
    this.name = user.name
    this.picture_id = user.picture_id
    this.is_child_account = user.is_child_account
    this.birthday_date = new Date(user.birthday_date)
    this.date_creation = user.date_creation
    this.date_modification = user.date_modification
  }

  getGifts() {
    return getItems(this.id, 'gift')
  }
}

export default User
