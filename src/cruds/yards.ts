import { ApolloClient } from "apollo-client";
import gql from "graphql-tag";

import { gqlJsonResponseHandler, gqlJsonResponseInstanceHandler, parseStringifiedJsonColumns, stringifyJsonFields } from "../helyos.helpers";
import { H_Yard  } from '../helyos.models';

 /////////////////////////  YARD /////////////////////////

 export class YARD {
    public lastListPromise;
    public getActionPromise;
    public fetching: boolean;
    private _client:  ApolloClient<any>;
    private _socket;

    constructor(client, socket) {
        this._client = client;
        this._socket = socket;
    }

    list(condition: Partial<H_Yard>={}): Promise<H_Yard[]> {
        const QUERY_FUNTCION = 'allYards';
        const TOOL_QUERY = gql`
        query ${QUERY_FUNTCION}($condition: YardCondition!){
            ${QUERY_FUNTCION}(condition: $condition) {
                edges {
                    node {
                        id,
                        uid,
                        name,
                        description,
                        yardType,
                        dataFormat,
                        mapData,
                        source,
                        lat,
                        lon,
                        alt,
                        createdAt,
                        deletedAt,
                        modifiedAt,
                        pictureBase64,
                        picturePos
                    }
                }   
            }
        }
        `;



        this.fetching = true;
        const self = this;
        this.lastListPromise= this._client.query({ query: TOOL_QUERY, variables:  { condition: condition } })
            .then(response => {
                self.fetching =  false;
                const listItems = gqlJsonResponseHandler(response, QUERY_FUNTCION);
                return parseStringifiedJsonColumns(listItems, ['mapData']);
            })
            .catch(e => {
                    console.log(e);
                    return e;
             });

        return this.lastListPromise;
    }



    create(yard: Partial<H_Yard>): Promise<any> {
        const QUERY_FUNTCION = 'createYard';
        const CREATE = gql`
        mutation createYard ($postMessage: CreateYardInput!){
            createYard(input: $postMessage) {
                yard {
                    id,
                    uid,
                    name,
                    description,
                    yardType,
                    dataFormat,
                    mapData,
                    source,
                    lat,
                    lon,
                    alt,
                    createdAt,
                    deletedAt,
                    modifiedAt,
                    pictureBase64,
                    picturePos,
                }
            }
        }
        
        `;

        const patch = {...yard};
        delete patch['__typename'];
        stringifyJsonFields(patch,['mapData']);

        const postMessage = { clientMutationId: "not_used", yard: patch };
        console.log("postMessage",postMessage)
        return this._client.mutate({ mutation: CREATE, variables: { postMessage, yard: yard } })
                .then(response => {
                    const data = gqlJsonResponseInstanceHandler(response, QUERY_FUNTCION,'yard' );
                    return parseStringifiedJsonColumns([data], ['mapData'])[0];
                })
                .catch(e => {
                    console.log(e);
                    return e;
             })

    }





    patch(yard: Partial<H_Yard>): Promise<any> {
        const QUERY_FUNTCION = 'updateYardById';
        const YARD_UPDATE = gql`
        mutation updateYardById ($postMessage: UpdateYardByIdInput!){
            updateYardById(input: $postMessage) {
                    yard {
                        id,
                        uid,
                        name,
                        yardType,
                        dataFormat,
                        mapData,
                        description,
                        source,
                        lat,
                        lon,
                        alt,
                        createdAt,
                        deletedAt,
                        modifiedAt,
                        pictureBase64,
                        picturePos,
                    }
            }
        }
        `;

        const patch = {...yard};
        delete patch['__typename'];
        stringifyJsonFields(patch,['mapData']);
        const postMessage = { id: yard.id, yardPatch: patch };
        return  this._client.mutate({ mutation: YARD_UPDATE, variables: { postMessage, yard: patch } })
            .then(response => {
                const data = gqlJsonResponseInstanceHandler(response, QUERY_FUNTCION,'yard' );
                return parseStringifiedJsonColumns([data], ['mapData'])[0];
            })
            .catch(e => {
                    console.log(e);
                    return e;
             })
    }


    
    get(yardId: string ): Promise<H_Yard> {
        const QUERY_FUNTCION = 'yardById';
        const GET_QUERY = gql`
        query ${QUERY_FUNTCION}($yardId: BigInt! ){
            ${QUERY_FUNTCION}(id: $yardId) {
                id,
                uid,
                name,
                description,
                yardType,
                dataFormat,
                mapData,
                source,
                lat,
                lon,
                alt,
                rbmqVhost,
                coordinateFrame,
                createdAt,
                deletedAt,
                modifiedAt,
                pictureBase64,
                picturePos,
                unit
            }
        }
        `;


        this.getActionPromise = this._client.query({ query: GET_QUERY, variables: {yardId: parseInt(yardId)  } })
            .then(response => {
                const data = gqlJsonResponseHandler(response, QUERY_FUNTCION);
                return parseStringifiedJsonColumns([data], ['mapData'])[0];
     
            })
            .catch(e => {
                    console.log(e);
                    return e;
             })

        return this.getActionPromise;
    }

    delete(id): Promise<any> {
        const QUERY_FUNTCION = 'deleteYardById';
        const DELETE_QUERY = gql`
        mutation ${QUERY_FUNTCION}($deletedYardById:  DeleteYardByIdInput! ){
            ${QUERY_FUNTCION}(input: $deletedYardById) {
                deletedYardId
            }
        }
        `;

        return  this._client.query({ query: DELETE_QUERY, variables: {deletedYardById: {id:parseInt(id,10) }} })
            .then(response => {
                if (response.errors) {
                    return response.errors[0];
                }
                return response;
            })
            .catch(e => {
                    console.log(e);
                    return e;
             })

    }



 }

