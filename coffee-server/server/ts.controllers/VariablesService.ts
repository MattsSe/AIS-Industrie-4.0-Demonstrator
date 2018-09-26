import {NextFunction, Response} from 'express';
import {UAClientService} from '../opcua/ua.service';
import * as api from '../../lib/shared/models';
import {util} from '../opcua/ua.util';
import * as opcua from 'node-opcua';

const ATTRIBUTE_VALUE_ID = 13;

export function readVariableValue(params, res: Response, next: NextFunction) {
    /**
     * parameters expected in the args:
     * nodeId (String)
     * assuming attributeId = 13 -> value
     **/
    res.setHeader('Content-Type', 'application/json');
    const result: api.VariableValue = {
        valid: false
    }
    const nodeId = params.nodeId || {};
    let valid = false;
    if (nodeId.value && UAClientService.INSTANCE.isConnected()) {
        result.nodeId = nodeId.value;
        valid = true;
        UAClientService.INSTANCE.session.readVariableValue(nodeId.value, (err, dataValue) => {
            if (!err) {
                result.valid = true;
                result.value = util.toString1(ATTRIBUTE_VALUE_ID, dataValue);
            } else {
                result.msg = err.message;
            }
            res.end(JSON.stringify(result));
        });
    }
    if (!valid) {
        result.msg = 'Client is not connected or nodeId is unavailable.';
        res.end(JSON.stringify(result));
    }
}


export function writeVariableValue(params, res: Response, next: NextFunction) {
    /**
     * parameters expected in the args:
     * nodeId (String)
     * attributeId (String)
     **/
    res.setHeader('Content-Type', 'application/json');
    const result: api.VariableValue = {
        valid: false
    }
    const nodeId = params.nodeId || {};
    const attribute = params.attributeId || {};
    const body_param = params.body || {};
    const body = body_param.value || {} as api.WriteValueOptions;
    let valid = false;
    if (body.value && nodeId.value && UAClientService.INSTANCE.isConnected()) {
        valid = true;

        const nodesToRead = [
            {
                nodeId: nodeId.value,
                attributeId: attribute.value || ATTRIBUTE_VALUE_ID as opcua.DataType.Int32
            }
        ];
        UAClientService.INSTANCE.session.read(nodesToRead, (err, nodesRead, results, diagnosticInfos) => {
            if (!err) {
                const nodeToWrite = {
                    dataType: body.datatype || results[0].value.dataType,
                    value: body.value
                };
                UAClientService.INSTANCE.session.writeSingleNode(nodeId.value, nodeToWrite, (err2, statuscode, diagnosticInfos2) => {
                    if (!err2) {
                        result.valid = true;
                        result.value = body.value;
                    } else {
                        result.msg = err.message;
                    }
                    res.end(JSON.stringify(result));
                });
            } else {
                result.msg = `Could not access the node with nodeId: ${nodeId.value}` + err.message;
                res.end(JSON.stringify(result));
            }
        });
    }

    if (!valid) {
        result.msg = 'Client is not connected or nodeId is unavailable.';
        res.end(JSON.stringify(result));
    }
}

export function readVariableValueForAttributeId(params, res: Response, next: NextFunction) {
    /**
     * parameters expected in the args:
     * nodeId (String)
     * attributeId (String)
     **/
    res.setHeader('Content-Type', 'application/json');
    const result: api.VariableValue = {
        valid: false
    }
    const nodeId = params.nodeId || {};
    const attribute = params.attributeId || {};
    let valid = false;
    if (nodeId.value && UAClientService.INSTANCE.isConnected()) {
        result.nodeId = nodeId.value;
        valid = true;

        const nodesToRead = [
            {
                nodeId: nodeId.value,
                attributeId: attribute.value || ATTRIBUTE_VALUE_ID
            }
        ];

        UAClientService.INSTANCE.session.read(nodesToRead, (err, nodesRead, results, diagnosticInfos) => {
            if (!err) {
                result.valid = true;
                result.value = util.toString1(nodesRead[0].attributeId, results[0]);
            } else {
                result.msg = err.message;
            }
            res.end(JSON.stringify(result));
        });
    }
    if (!valid) {
        result.msg = 'Client is not connected or nodeId is unavailable.';
        res.end(JSON.stringify(result));
    }

}
