import * as express from 'express';
import {UAClientService} from '../service/UAClientService';
import {util} from '../opcua/ua.util';
import * as opcua from 'node-opcua';
import {provideSingleton} from '../../inversify/ioc';
import {Body, Get, Path, Post, Request, Route} from 'tsoa';
import {inject} from 'inversify';
import {VariableValue, WriteValueOptions} from '../../shared/models/index';

const ATTRIBUTE_VALUE_ID = 13;

@provideSingleton(VariableController)
@Route('server/variables')
export class VariableController {

    constructor(@inject(UAClientService) private clientService: UAClientService) {
    }

    @Get('{nodeId}')
    readVariableValue(nodeId: string, @Request() request: express.Request) {
        const result: VariableValue = {
            valid: false
        }
        if (this.clientService.isConnected()) {
            result.nodeId = nodeId;
            this.clientService.session.readVariableValue(nodeId, (err, dataValue) => {
                if (!err) {
                    result.valid = true;
                    result.value = util.toString1(ATTRIBUTE_VALUE_ID, dataValue);
                } else {
                    result.msg = err.message;
                }
                request.res.end(JSON.stringify(result));
            });
        } else {
            result.msg = 'Client is not connected or nodeId is unavailable.';
            request.res.end(JSON.stringify(result));
        }
    }

    @Post('{nodeId}/{attributeId}')
    writeVariableValue(@Path('nodeId') nodeId: string, @Path('attributeId') attributeId: number, @Request() request: express.Request, @Body() writeOptions?: WriteValueOptions) {
        const result: VariableValue = {
            valid: false
        }
        const body = writeOptions || {} as WriteValueOptions;
        let valid = false;
        if (this.clientService.isConnected()) {

            const nodesToRead = [
                {
                    nodeId: nodeId,
                    attributeId: attributeId || ATTRIBUTE_VALUE_ID as opcua.DataType.Int32
                }
            ];
            this.clientService.session.read(nodesToRead, (err, dataValues) => {
                if (!err) {
                    this.clientService.session.writeSingleNode(nodeId, dataValues[0].value, (err2, statuscode) => {
                        if (!err2) {
                            result.valid = true;
                            result.value = body.value;
                        } else {
                            result.msg = err.message;
                        }
                        request.res.end(JSON.stringify(result));
                    });
                } else {
                    result.msg = `Could not access the node with nodeId: ${nodeId}` + err.message;
                    request.res.end(JSON.stringify(result));
                }
            });
        } else {
            result.msg = 'Client is not connected or nodeId is unavailable.';
            request.res.end(JSON.stringify(result));
        }
    }

    @Get('{nodeId}/{attributeId}')
    readVariableValueForAttributeId(@Path('nodeId') nodeId: string, @Path('attributeId') attributeId: number, @Request() request: express.Request) {
        const result: VariableValue = {
            valid: false
        }
        let valid = false;
        if (this.clientService.isConnected()) {
            result.nodeId = nodeId;

            const nodesToRead = [
                {
                    nodeId: nodeId,
                    attributeId: attributeId || ATTRIBUTE_VALUE_ID
                }
            ];

            this.clientService.session.read(nodesToRead, (err, dataValue) => {
                if (!err) {
                    result.valid = true;
                    result.value = dataValue[0].toString();
                } else {
                    result.msg = err.message;
                }
                request.res.end(JSON.stringify(result));
            });
        } else {
            result.msg = 'Client is not connected or nodeId is unavailable.';
            request.res.end(JSON.stringify(result));
        }

    }
}