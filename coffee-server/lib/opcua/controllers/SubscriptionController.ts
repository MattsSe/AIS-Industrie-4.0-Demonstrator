import * as express from 'express';
import {toMonitoredItemData, UAClientService} from '../service/UAClientService';
import * as opcua from 'node-opcua';
import {util} from '../opcua/ua.util';
import {provideSingleton} from '../../inversify/ioc';
import {Body, Delete, Get, Path, Post, Query, Request, Route} from 'tsoa';
import {inject} from 'inversify';
import {MonitoredItemData, MonitorItemOptions, UnmonitorItemResult} from '../../shared/models/index';


@provideSingleton(SubscriptionController)
@Route('server/monitor')
export class SubscriptionController {

    constructor(@inject(UAClientService) private clientService: UAClientService) {
    }

    /**
     * removes a specific subscription if any present
     * @param nodeId
     * @param attributeId
     */

    @Delete('{nodeId}/{attributeId}')
    async unmonitorItem(@Path('nodeId') nodeId: string, @Path('attributeId') attributeId: number): Promise<UnmonitorItemResult> {
        const result: UnmonitorItemResult = {
            success: false,
            wasMonitored: false,
            nodeId: nodeId,
            attributeId: attributeId,
        };
        if (this.clientService.isConnected()) {
            const counter = this.clientService.unmonitorItem(result.nodeId, result.attributeId);
            result.success = counter > 0;
            result.wasMonitored = counter > 0
        }
        return result
    }

    /**
     * @POST monitor changes for the desired item
     * @param nodeId
     * @param attributeId
     * @param request
     * @param monitorOptions
     */
    @Post('{nodeId}/{attributeId}')
    async monitorItem(@Path('nodeId') nodeId: string, @Path('attributeId') attributeId: number, @Request() request: express.Request, @Body() monitorOptions?: MonitorItemOptions) {

        let result: MonitoredItemData;
        if (this.clientService.isConnected()) {
            const resolvedId = opcua.resolveNodeId(nodeId);
            try {
                const options = monitorOptions || {} as MonitorItemOptions;
                const item = this.clientService.monitorItem(resolvedId, attributeId, options);
                item.on('initialized', val => {
                    result = {
                        browseName: item.itemToMonitor.nodeId.value,
                        nodeId: item.itemToMonitor.nodeId.toString(),
                        attributeId: item.itemToMonitor.attributeId,
                        subscriptionId: item.subscription.subscriptionId,
                        value: '',
                        datatype: ''
                    };
                    if (val) {
                        const v = val as opcua.DataValue;
                        result.value = util.toString1(item.itemToMonitor.attributeId, v);
                        result.datatype = v.value.dataType.toString();
                    }
                    request.res.end(JSON.stringify(result));
                });
                // publish change through socket
                if (options.publishChangeOnSocket) {
                    this.publishChangeOnSocket(item);
                }
            } catch (err) {
                request.res.end(JSON.stringify({}));
            }
            return
        } else {
            request.res.end(JSON.stringify({}));
        }
    }

    /**
     * Sends the Data through the socket
     * @param item
     */
    publishChangeOnSocket(item: opcua.ClientMonitoredItem) {
        item.on('changed', val => {
            const v = val as opcua.DataValue;
            const data: MonitoredItemData = {
                browseName: item.itemToMonitor.nodeId.value,
                nodeId: item.itemToMonitor.nodeId.toString(),
                attributeId: item.itemToMonitor.attributeId,
                subscriptionId: item.subscription.subscriptionId,
                value: util.toString1(item.itemToMonitor.nodeId.value, v),
                statusCode: v.statusCode.toString(),
                datatype: v.value.dataType.toString()
            };
            this.clientService.socket.emitSubscriptionChange(data);
        });
    }

    @Get('{nodeId}/{attributeId}')
    async getMonitoredItem(@Path('nodeId') nodeId: string, @Path('attributeId') attributeId: number): Promise<MonitoredItemData[]> {
        return this.clientService.getAllMonitoredItemData().filter(it => it.nodeId === nodeId && it.monitoredItem.itemToMonitor.attributeId === attributeId).map(it => toMonitoredItemData(it))
    }

    @Get()
    async getAllMonitoredItems(): Promise<MonitoredItemData[]> {
        return this.clientService.getAllMonitoredItemData().map(it => toMonitoredItemData(it));
    }

    @Get('{nodeId}')
    async getMonitoredItemsForNodeId(nodeId: string): Promise<MonitoredItemData[]> {
        return this.clientService.getAllMonitoredItemData().filter(item => item.nodeId === nodeId).map(it => toMonitoredItemData(it))
    }

    @Delete()
    clearMonitoredItems(@Query() limit?: number) {
        this.clientService.unmonitorAll(limit);
    }

    @Delete('{nodeId}')
    clearMonitoredItemsForNodeId(nodeId: string) {
        this.clientService.getAllMonitoredItemData().filter(item => item.nodeId === nodeId).map(item => item.nodeId).forEach(id => this.clientService.unmonitorItem(id));
    }

}

