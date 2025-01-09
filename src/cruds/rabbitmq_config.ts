import { ApolloClient } from "apollo-client";
import gql from "graphql-tag";

import { gqlJsonResponseHandler, gqlJsonResponseInstanceHandler } from "../helyos.helpers";
import { H_RBMQConfig } from '../helyos.models';

export class RBMQ_CONFIG {
    public lastListPromise: Promise<H_RBMQConfig[]>;
    public getActionPromise: Promise<H_RBMQConfig>;
    private _client: ApolloClient<any>;
    private _socket;

    constructor(client: ApolloClient<any>, socket) {
        this._client = client;
        this._socket = socket;
    }

    list(condition: Partial<H_RBMQConfig> = {}): Promise<H_RBMQConfig[]> {
        const QUERY_FUNCTION = 'allRbmqConfigs';
        const LIST_QUERY = gql`
        query ${QUERY_FUNCTION}($condition: RbmqConfigCondition!) {
            ${QUERY_FUNCTION}(condition: $condition) {
                edges {
                    node {
                        id,
                        agentsUlExchange,
                        agentsDlExchange,
                        agentsMqttExchange,
                        agentsAnonymousExchange,
                        rbmqVhost
                    }
                }
            }
        }
        `;
    
        this.lastListPromise = this._client.query({ query: LIST_QUERY, variables: { condition } })
            .then(response => {
                const listItems = gqlJsonResponseHandler(response, QUERY_FUNCTION);
                return listItems;
            })
            .catch(e => {
                console.log(e);
                return e;
            });
    
        return this.lastListPromise;
    }

    create(config: Partial<H_RBMQConfig>): Promise<H_RBMQConfig> {
        const QUERY_FUNCTION = 'createRbmqConfig';
        const CREATE_QUERY = gql`
        mutation ${QUERY_FUNCTION}($postMessage: CreateRbmqConfigInput!) {
            ${QUERY_FUNCTION}(input: $postMessage) {
                rbmqConfig {
                    id,
                    agentsUlExchange,
                    agentsDlExchange,
                    agentsMqttExchange,
                    agentsAnonymousExchange,
                    rbmqVhost
                }
            }
        }
        `;

        const postMessage = { clientMutationId: "not_used", rbmqConfig: config };

        return this._client.mutate({ mutation: CREATE_QUERY, variables: { postMessage } })
            .then(response => {
                const data = gqlJsonResponseInstanceHandler(response, QUERY_FUNCTION, 'rbmqConfig');
                return data;
            })
            .catch(e => {
                console.log(e);
                return e;
            });
    }

    patch(config: Partial<H_RBMQConfig>): Promise<H_RBMQConfig> {
        const QUERY_FUNCTION = 'updateRbmqConfigById';
        const PATCH_QUERY = gql`
        mutation ${QUERY_FUNCTION}($postMessage: UpdateRbmqConfigByIdInput!) {
            ${QUERY_FUNCTION}(input: $postMessage) {
                rbmqConfig {
                    id,
                    agentsUlExchange,
                    agentsDlExchange,
                    agentsMqttExchange,
                    agentsAnonymousExchange,
                    rbmqVhost
                }
            }
        }
        `;

        const postMessage = { id: config.id, rbmqConfigPatch: config };

        return this._client.mutate({ mutation: PATCH_QUERY, variables: { postMessage } })
            .then(response => {
                const data = gqlJsonResponseInstanceHandler(response, QUERY_FUNCTION, 'rbmqConfig');
                return data;
            })
            .catch(e => {
                console.log(e);
                return e;
            });
    }

    get(id: string): Promise<H_RBMQConfig> {
        const QUERY_FUNCTION = 'rbmqConfigById';
        const GET_QUERY = gql`
        query ${QUERY_FUNCTION}($id: Int!) {
            ${QUERY_FUNCTION}(id: $id) {
                id,
                agentsUlExchange,
                agentsDlExchange,
                agentsMqttExchange,
                agentsAnonymousExchange,
                rbmqVhost
            }
        }
        `;

        this.getActionPromise = this._client.query({ query: GET_QUERY, variables: { id: parseInt(id) } })
            .then(response => {
                const data = gqlJsonResponseHandler(response, QUERY_FUNCTION);
                return data;
            })
            .catch(e => {
                console.log(e);
                return e;
            });

        return this.getActionPromise;
    }

    delete(id: string): Promise<any> {
        const QUERY_FUNCTION = 'deleteRbmqConfigById';
        const DELETE_QUERY = gql`
        mutation ${QUERY_FUNCTION}($deletedConfigById: DeleteRbmqConfigByIdInput!) {
            ${QUERY_FUNCTION}(input: $deletedConfigById) {
                deletedConfigId
            }
        }
        `;

        return this._client.mutate({ mutation: DELETE_QUERY, variables: { deletedConfigById: { id: parseInt(id, 10) } } })
            .then(response => {
                if (response.errors) {
                    return response.errors[0];
                }
                return response;
            })
            .catch(e => {
                console.log(e);
                return e;
            });
    }
}