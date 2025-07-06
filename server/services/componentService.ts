import ProbationClient, { AvailableComponent } from "../data/probationClient"

export default class ComponentService {
    constructor(private readonly probationClient: ProbationClient) {}

    async getComponents<T extends AvailableComponent[]>(components: T, userToken: string) {
        return this.probationClient.getComponents(components, userToken)
    }
}