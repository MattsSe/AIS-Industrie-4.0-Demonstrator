/**
 * Created by Matthias on 23.08.17.
 */
import * as express from 'express';
import {UAClientService} from '../service/UAClientService';
import * as api from '../../shared/models/index';
import {util} from '../opcua/ua.util';

import * as opcua from 'node-opcua';
import {Get, Path, Request, Route} from 'tsoa';
import {inject, provideSingleton} from './../../inversify/ioc';

@provideSingleton(BrowseController)
@Route('server/browse')
export class BrowseController {

    constructor(@inject(UAClientService) private clientService: UAClientService) {
    }

    @Get('{nodeId}')
    async getBrowseInfo(@Path('nodeId') nodeId: string): Promise<any> {
        /**
         * parameters expected in the args:
         * qualifiedName (String)
         **/
        return {name: this.clientService !== null};
    }

    /**
     * @GET returns all Available Attributes for the given nodeID
     * @param nodeId
     * @param request
     */
    @Get('{nodeId}/attributes')
    async getAllAttributes(nodeId: string, @Request() request: express.Request) {
        let data = [];
        if (this.clientService.isConnected()) {
            this.clientService.readAllAttributes(nodeId, (err, nodesToRead, dataValues) => {
                if (!err) {
                    for (let i = 0; i < nodesToRead.length; i++) {
                        const nodeToRead = nodesToRead[i];
                        const dataValue = dataValues[i];

                        if (dataValue.statusCode !== opcua.StatusCodes.Good) {
                            continue;
                        }
                        data.push({
                            name: util.attributeIdtoString[nodeToRead.attributeId],
                            datatype: dataValue.value.dataType || 'Unknown',
                            value: util.toString1(nodeToRead.attributeId, dataValue),
                            ownerNodeId: nodeId,
                            attributeId: nodeToRead.attributeId
                        });
                    }
                }
                request.res.end(JSON.stringify(data));
            });
        } else {
            return data;
        }
    }

    /**
     * returns the directly nested child items under the item with the given nodeId
     * @see api.ReferenceDataList
     * @GET
     * @param nodeId
     * @param request
     */
    @Get('{nodeId}/children')
    async getChildren(nodeId: string,
                      @Request() request: express.Request) {
        let data = [];
        if (this.clientService.isConnected()) {
            this.clientService.browseChildren(nodeId, (err, browse_result) => {
                if (!err) {
                    [0, 1].forEach(index => {
                        browse_result[index].references.forEach(reference => {
                            data.push({
                                nodeId: reference.nodeId.toString(),
                                browseName: reference.browseName.toString(),
                                nodeClass: util.nodeClassMaskIdToString(reference.nodeClass.value),
                                typeIdEnum: index === 0 ?
                                    api.ReferenceData.TypeIdEnumEnum.Organizes : api.ReferenceData.TypeIdEnumEnum.Aggregates
                            });
                        });
                    });
                }
                request.res.end(JSON.stringify(data));
            });
        } else {
            return data;
        }
    }
}