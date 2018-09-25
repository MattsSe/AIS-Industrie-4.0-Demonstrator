
import * as models from './index';

export interface ReferenceData {
    nodeId: string;

    nodeClass: string;

    browseName: string;

    children?: models.ReferenceDataList;

    typeIdEnum: ReferenceData.TypeIdEnumEnum;

}
export namespace ReferenceData {
    export enum TypeIdEnumEnum {
        Organizes = <any> 'Organizes',
        Aggregates = <any> 'Aggregates'
    }
}
