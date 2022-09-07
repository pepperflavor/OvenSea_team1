class EventManager {
  constructor() {
    this.event = {};
    this.form = {
      uid: "",
      name: "",
      img_url: "",
      state: "",
    };
  }
}

EventManager.prototype.setUsers = (type, users) => {
  this.event[type] = [...users];
};

EventManager.prototype.getUsers = (type) => this.event[type];

EventManager.prototype.addUsers = (type, user) => {
  this.event[type].push(user);
};

module.exports = EventManager;
