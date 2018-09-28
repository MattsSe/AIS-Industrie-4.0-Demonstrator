/**
 * Created by Matthias on 23.08.17.
 */
import {NextFunction, Response} from 'express';
import {UAClientService} from '../opcua/ua.service';
import * as api from '../../shared/models/index';
import {util} from '../opcua/ua.util';

import * as opcua from '../../../@types/node-opcua/index';
import {Get, Path, Route} from 'tsoa';
import {provideSingleton} from 'lib/inversify/ioc';

@provideSingleton(BrowserController)
@Route('server/browse')
export class BrowserController {

    @Get('{nodeId}')
    async getBrowseInfo(@Path('nodeId') nodeId: string): Promise<any> {
        /**
         * parameters expected in the args:
         * qualifiedName (String)
         **/
        return {};
    }

}


export function getBrowseInfo(params, res: Response, next: NextFunction) {
    /**
     * parameters expected in the args:
     * qualifiedName (String)
     **/
    const examples = {};
    examples['application/json'] = {};
    if (Object.keys(examples).length > 0) {
        res.setHeader('Content-Type', 'application/json');
        res.end(JSON.stringify(examples[Object.keys(examples)[0]] || {}, null, 2));
    } else {
        res.end();
    }
}


function canExecute(nodeIde) {
    return
}

/**
 * @GET returns all Available Attributes for the given nodeID
 * @param params Attributes options
 * @param res
 * @param next
 */
export function getAllAttributes(params, res: Response, next: NextFunction) {
    const data: api.AttributeDataList = [];
    res.setHeader('Content-Type', 'application/json');
    const nodeId = params.nodeId;
    let valid = false;

    if (nodeId) {
        if (nodeId.value && UAClientService.INSTANCE.isConnected()) {
            valid = true;
            UAClientService.INSTANCE.readAllAttributes(nodeId.value, (err, nodesToRead, dataValues, diagnostic) => {
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
                            ownerNodeId: nodeId.value,
                            attributeId: nodeToRead.attributeId
                        });
                    }
                }
                res.end(JSON.stringify(data));
            });
        }
    }
    if (!valid) {
        res.end(JSON.stringify(data));
    }
}


/**
 * returns the directly nested child items under the item with the given nodeId
 * @see api.ReferenceDataList
 * @GET
 * @param params with the nodeId for the desired item
 * @param res
 * @param next
 */
export function getChildren(params, res: Response, next: NextFunction) {

    const data: api.ReferenceDataList = [];
    res.setHeader('Content-Type', 'application/json');
    const nodeId = params.nodeId;

    let valid = false;

    if (nodeId) {
        if (nodeId.value && UAClientService.INSTANCE.isConnected()) {
            valid = true;
            UAClientService.INSTANCE.browseChildren(nodeId.value, (err, browse_result) => {
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

                res.end(JSON.stringify(data));
            });
        }
    }

    if (!valid) {
        res.end(JSON.stringify(data));
    }
}

