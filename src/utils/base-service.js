const { withSession } = require('./neo4j');

class BaseService {
  constructor(driver, eventBus) {
    this.driver = driver;
    this.eventBus = eventBus;
  }

  async executeWithSession(method, ...args) {
    return await withSession(this.driver, async (session) => {
      return await method.call(this, session, ...args);
    });
  }

  wrapMethod(method) {
    return (...args) => this.executeWithSession(method, ...args);
  }

  async publishEvent(eventName, ...args) {
    if (this.eventBus && this.eventBus[eventName]) {
      await this.eventBus[eventName](...args);
    }
  }
}

function createService(ServiceClass, driver, eventBus) {
  const service = new ServiceClass(driver, eventBus);
  const wrappedService = {};

  const methods = Object.getOwnPropertyNames(ServiceClass.prototype).filter(
    (name) => name !== 'constructor' && typeof service[name] === 'function'
  );

  for (const methodName of methods) {
    wrappedService[methodName] = service.wrapMethod(service[methodName]);
  }

  return wrappedService;
}

module.exports = BaseService;
module.exports.createService = createService;
