let eventHelper;
class EventHelper {
  constructor() {
    /**
     * listener has表
     * {
     *  instance: {
     *              eventName: [...handlers]
     *            }
     * }
     */
    this._listener = new Map();
  }

  addListener(instance, eventName, handler, context) {
    if (!instance.on) throw new Error('this instance has not "on" attribute');
    instance.on(eventName, handler, context);
    if (!this._listener.get(instance)) this._listener.set(instance, {});
    let listenerMap = this._listener.get(instance);
    if (!listenerMap[eventName]) listenerMap[eventName] = [];
    listenerMap[eventName].push(handler);
  }

  removeListener(instance, eventName, handler) {
    if (!instance.off) throw new Error('this instance has not "on" attribute');
    if (
      !this._listener.get(instance) ||
      !this._listener.get(instance)[eventName]
    )
      return;
    let listenerArr = this._listener.get(instance)[eventName];
    if (handler) {
      let l_index = listenerArr.indexOf(handler);
      instance.off(eventName, listenerArr[l_index]);
      listenerArr.splice(l_index, 1);
    } else {
      listenerArr.forEach(handler => {
        instance.off(eventName, handler);
      });
      this._listener.get(instance)[eventName] = [];
    }
  }
  addListenerOnce(instance, eventName, handler, context) {
    return AMap.event.addListenerOnce(instance, eventName, handler, context);
  }
  trigger(instance, eventName, args) {
    return AMap.event.trigger(instance, eventName, args);
  }

  clearListeners(instance) {
    let listeners = this._listener.get(instance);
    if (!listeners) return;
    Object.keys(listeners).map(eventName => {
      this.removeListener(instance, eventName);
    });
  }
}

eventHelper = eventHelper || new EventHelper();

export default eventHelper;
