import { RESTDataSource } from "apollo-datasource-rest";

export class MvrpAPI extends RESTDataSource {
  constructor() {
    super();
    this.baseURL = "https://mvrp.herokuapp.com/api/";
  }

  willSendRequest(request) {
    request.header.set("Authorization", this.context.token);
  }

  async getAllCars() {
    return this.get("cars", null, {
      cacheOptions: { ttl: 60 },
    });
  }

  async getACar(plateNumber) {
    const result = await this.get("car", {
      plateNumber,
    });

    return result[0];
  }
}
