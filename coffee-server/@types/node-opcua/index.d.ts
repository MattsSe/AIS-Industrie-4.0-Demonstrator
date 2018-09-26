export declare var browse_service: any;

export declare var NodeClassMask: any;

export declare enum AttributeIds {
    NodeId = 1,
    NodeClass = 2,
    BrowseName = 3,
    DisplayName = 4,
    Description = 5,
    WriteMask = 6,
    UserWriteMask = 7,
    IsAbstract = 8,
    Symmetric = 9,
    InverseName = 10,
    ContainsNoLoops = 11,
    EventNotifier = 12,
    Value = 13,
    DataType = 14,
    ValueRank = 15,
    ArrayDimensions = 16,
    AccessLevel = 17,
    UserAccessLevel = 18,
    MinimumSamplingInterval = 19,
    Historizing = 20,
    Executable = 21,
    UserExecutable = 22,
    INVALID = 999
}


export {DataTypeIds} from "./DataTypeIds"

// Type definitions for node-opua
// Project: https://github.com/node-opcua/node-opcua
// Definitions by: Etienne Rossignon
// Definitions: https://github.com/DefinitelyTyped/DefinitelyTyped
import {StatusCode, StatusCodes} from "./StatusCode";

export {StatusCode, StatusCodes} from "./StatusCode";

export type ErrorCallback = (err?: Error) => void;
export type ResponseCallback<T> = (err?: Error | null, response?: T) => void;


export declare enum MessageSecurityMode {
    /** The MessageSecurityMode is invalid */
    INVALID,
    /** No security is applied. */
    NONE,
    /** All messages are signed but not encrypted. */
    SIGN,
    /** All messages are signed and encrypted. */
    SIGNANDENCRYPT
}

export declare enum SecurityPolicy {
    /** see http://opcfoundation.org/UA/SecurityPolicy#None */
    None,
    /** see http://opcfoundation.org/UA/SecurityPolicy#Basic128 */
    Basic128,
    /** see http://opcfoundation.org/UA/SecurityPolicy#Basic128Rsa15 */
    Basic128Rsa15,
    /** see http://opcfoundation.org/UA/SecurityPolicy#Basic192 */
    Basic192,
    /** see http://opcfoundation.org/UA/SecurityPolicy#Basic192Rsa15 */
    Basic192Rsa15,
    /** see http://opcfoundation.org/UA/SecurityPolicy#Basic256 */
    Basic256,
    /** see http://opcfoundation.org/UA/SecurityPolicy#Basic256Rsa15 */
    Basic256Rsa15,
    /** see http://opcfoundation.org/UA/SecurityPolicy#Basic256Sha25 */
    Basic256Sha256
}

export interface ConnectionStrategy {
    maxRetry?: number;
    initialDelay?: number;
    maxDelay?: number;
    randomisationFactor?: number;
}

export interface OPCUAClientOptions {
    /** default secure token lifetime in ms */
    defaultSecureTokenLifetime?: number;
    /** the server certificate. */
    serverCertificate?: Uint8Array | null;
    connectionStrategy?: ConnectionStrategy;
    /**
     * the security mode
     * @default MessageSecurityMode.NONE
     */
    securityMode?: MessageSecurityMode;
    /**
     * the security policy
     * @default SecurityPolicy.NONE
     */
    securityPolicy?: number | string;
    /**
     * the requested session timeout in CreateSession (ms)
     * @default 60000
     */
    requestedSessionTimeout?: number;
    /**
     * the client application name
     * @default "NodeOPCUA-Client"
     */
    applicationName?: string;
    /**
     * set to false if the client should accept server endpoint mismatch
     * @default true
     */
    endpoint_must_exist?: boolean;
    /**
     * @default false
     */
    keepSessionAlive?: boolean;
    /**
     * client certificate pem file.
     * @default "certificates/client_selfsigned_cert_1024.pem"
     */
    certificateFile?: string;
    /**
     * client private key pem file.
     * @default "certificates/client_key_1024.pem"
     */
    privateKeyFile?: string;
    /**
     * a client name string that will be used to generate session names.
     */
    clientName?: string;
}

export interface FindServerOptions {
    endpointUrl?: string;
    /**
     *   List of locales to use.
     */
    localeIds?: LocaleId[];
    serverUris?: string[];
}

export interface FindServerOnNetworkOptions {
    /**
     * Only records with an identifier greater than this number will be returned. Specify 0 to start with the first record in the cache.
     */
    startingRecordId?: number;
    /**
     * The maximum number of records to return in the response.
     * 0 indicates that there is no limit.
     */
    maxRecordsToReturn?: number;

    /**
     * List of Server capability filters. The set of allowed server capabilities are defined in Part 12.
     * Only records with all of the specified server capabilities are returned.
     * The comparison is case insensitive. If this list is empty then no filtering is performed.
     * @property serverCapabilityFilter
     * @type {String[]}
     */
    serverCapabilityFilter?: string[];
}

export type  LocaleId = string;

export interface GetEndpointsOptions {
    endpointUrl?: string;
    /**
     *   List of locales to use.
     */
    localeIds?: LocaleId[];
    /**
     *  List of transport profiles that the returned Endpoints shall support.
     */
    profileUris?: string[];

}

export enum ApplicationType {
    SERVER = 0, // The application is a Server
    CLIENT = 1, // The application is a Client
    CLIENTANDSERVER = 2, // The application is a Client and a Server
    DISCOVERYSERVER = 3  // The application is a DiscoveryServer
}

export interface ApplicationDescription {
    // The globally unique identifier for the application instance.
    applicationUri: string;
    // The globally unique identifier for the product.
    productUri: string;
    // A localized descriptive name for the application.
    applicationName: LocalizedText;
    // The type of application.
    applicationType: ApplicationType;
    // A URI that identifies the Gateway Server associated with the discoveryUrls .
    // this flag is not used if applicationType === CLIENT
    gatewayServerUri: string;
    // A URI that identifies the discovery profile supported by the URLs provided
    discoveryProfileUri: string;
    // A list of URLs for the discovery Endpoints provided by the application
    discoveryUrls: string[];
}

interface ServerOnNetwork {
    /**
     * A unique identifier for the record
     * This can be used to fetch the next batch of Servers in a subsequent
     * call to FindServersOnNetwork
     */
    recordId: number;

    /**
     * The name of the Server specified in the mDNS announcement (see Part 12).This may be the same as the ApplicationName for the Server.
     */
    serverName: string;

    /**
     * The URL of the discovery Endpoint.
     */
    discoveryUrl: string;

    /**
     * The set of Server capabilities supported by the Server.The set of allowed Server capabilities are defined in Part 12
     */
    serverCapabilities: string[];
}

export declare class OPCUAClientBase {
    /**
     *
     */
    securityMode: MessageSecurityMode;

    /**
     *
     */
    securityPolicy: SecurityPolicy;

    /**
     *
     */
    serverCertificate: Uint8Array | null;

    /**
     * @method connect
     * connect the OPC-UA client to a server end point.
     *
     * @param {string} endpointUrl
     * @param {ErrorCallback} callback
     */
    connect(endpointUrl: string, callback: ErrorCallback): void;
    /**
     * @method connect
     * @param {string} endpointUrl
     * @returns {Promise<void>}
     */
    connect(endpointUrl: string): Promise<void>;

    disconnect(callback: ErrorCallback): void;
    disconnect(): Promise<void>;

    performMessageTransaction(request: any, callback: ResponseCallback<any>): void;

    getEndpoints(options?: GetEndpointsOptions): Promise<EndpointDescription[]>;
    getEndpoints(options: GetEndpointsOptions, callback: ResponseCallback<EndpointDescription[]>): void;
    getEndpoints(callback: ResponseCallback<EndpointDescription[]>): void;

    findServers(options?: FindServerOptions): Promise<ApplicationDescription[]>;
    findServers(options: FindServerOptions, callback: ResponseCallback<ApplicationDescription[]>): void;

    findServersOnNetwork(options?: FindServerOnNetworkOptions): Promise<ServerOnNetwork[]>;
    findServersOnNetwork(options: FindServerOnNetworkOptions, callback: ResponseCallback<ServerOnNetwork[]>): void;


    findEndpointForSecurity(securityMode: MessageSecurityMode, securityPolicy: SecurityPolicy): string;

    /**
     * @method on
     * @param {string} event
     * @param {()=>void} eventHandler
     * @returns {OPCUAClientBase}
     * @chainable
     */
    on(event: string, eventHandler: () => void): OPCUAClientBase;

    on(event: string, eventHandler: (...args: any[]) => void): OPCUAClientBase;
}

export interface BrowseResponse {
}

export declare enum NodeIdType {
    BYTESTRING = 0x4,
    GUID = 0x3,
    NUMERIC = 0x1,
    STRING = 0x2
}

export declare class NodeId {
    identifierType: NodeIdType;
    value: any;
    namespace: number;

    constructor(identifierType: NodeIdType, value: any, namespace: number);

    isEmpty(): boolean;

    toJSON(): string;

    toString(options?: { addressSpace: AddressSpace }): string;
}

type UInt32 = number;
type Int32 = number;

export enum BrowseDirection {
    Forward,
    Inverse,
    Both
}

export interface BrowseDescription {
    /** The id of the node to browse. */
    nodeId?: NodeId;
    /** The direction of the references to return. */
    browseDirection?: BrowseDirection;
    /**
     * The type of references to return.Specifies the NodeId of the
     * ReferenceType to follow. Only instances of this ReferenceType or its
     * subtype are returned.If not specified then all ReferenceTypes are
     * returned and includeSubtypes is ignored.
     */
    referenceTypeId?: NodeId | string;
    /** Includes subtypes of the reference type. */
    includeSubtypes?: boolean;
    /**
     * A mask indicating which node classes to return. 0 means return all nodes.
     */
    nodeClassMask?: UInt32;
    /**
     * A mask indicating which fields in the ReferenceDescription should be
     * returned in the results.
     */
    resultMask?: UInt32;
}

export type ExpandedNodeId = any;
export type QualifiedName = any;
export type LocalizedText = any;

export type NodeClass = any;

export interface ReferenceDescription {
    /** The type of references. */
    referenceTypeId: NodeId;
    /** `true` if the reference is a forward reference. */
    isForward: boolean;
    /** The id of the target node. */
    nodeId: ExpandedNodeId;
    /** The browse name of the target node. */
    browseName: QualifiedName;
    /** The display name of the target node. */
    displayName: LocalizedText;
    /** The node class of the target node. */
    nodeClass: NodeClass;
    /** The type definition of the target node. */
    typeDefinition: ExpandedNodeId;
}

export declare class BrowseResult {
    statusCode: StatusCodes;
    continuationPoint: any;
    references: ReferenceDescription[];
}

export type CoercibleToBrowseDescription = string | BrowseDescription;

export interface RelativePathElement {
    /** the type of reference to follow. */
    referenceTypeId?: NodeId;
    /** if true the reverse reference is followed. */
    isInverse?: boolean;
    /** if true then subtypes of the reference type are followed. */
    includeSubtypes?: boolean;
    /** the browse name of the target. */
    targetName?: QualifiedName;
}

export declare class BrowsePath {
    startingNode: NodeId;
    relativePath: {
        elements: RelativePathElement[];
    };
}

export interface BrowsePathTarget {
    targetId: ExpandedNodeId;
    remainingPathIndex: UInt32;
}

export interface BrowsePathResult {
    statusCode: StatusCodes;
    targets: BrowsePathTarget[];
}

export declare class ClientSession {
    // async with callback methods
    // ------------------------------------------------------------
    browse(nodeToBrowse: CoercibleToBrowseDescription, callback: ResponseCallback<BrowseResult>): void;
    browse(nodesToBrowse: CoercibleToBrowseDescription[], callback: ResponseCallback<BrowseResult[]>): void;
    browse(nodeToBrowse: CoercibleToBrowseDescription): Promise<BrowseResult>;
    browse(nodesToBrowse: CoercibleToBrowseDescription[]): Promise<BrowseResult[]>;

    translateBrowsePath(browsePath: BrowsePath, callback: ResponseCallback<BrowsePathResult>): void;
    translateBrowsePath(browsesPath: BrowsePath[], callback: ResponseCallback<BrowsePathResult[]>): void;
    translateBrowsePath(browsePath: BrowsePath): Promise<BrowsePathResult>;
    translateBrowsePath(browsePaths: BrowsePath[]): Promise<BrowsePathResult[]>;

    write(nodeToWrite: CoercibleToWriteValue, callback: ResponseCallback<StatusCodes>): void;
    write(nodesToWrite: CoercibleToWriteValue[], callback: ResponseCallback<StatusCodes[]>): void;
    write(nodesToWrite: CoercibleToWriteValue[]): Promise<StatusCodes[]>;
    write(nodeToWrite: CoercibleToWriteValue): Promise<StatusCodes>;

    read(nodeToRead: CoercibleToReadValueId, maxAge: number, callback: ResponseCallback<DataValue>): void;
    read(nodesToRead: CoercibleToReadValueId[], maxAge: number, callback: ResponseCallback<DataValue[]>): void;
    read(nodeToRead: CoercibleToReadValueId, callback: ResponseCallback<DataValue>): void;
    read(nodesToRead: CoercibleToReadValueId[], callback: ResponseCallback<DataValue[]>): void;
    read(nodeToRead: CoercibleToReadValueId, maxAge?: number): Promise<DataValue>;
    read(nodesToRead: CoercibleToReadValueId[], maxAge?: number): Promise<DataValue[]>;

    readVariableValue(nodeId: CoercibleToNodeId, callback: ResponseCallback<DataValue>): void;
    readVariableValue(nodeId: CoercibleToNodeId): Promise<DataValue>;


    writeSingleNode(path: string, value: Variant, callback: (err?: Error, statusCode?: StatusCode) => void): void;


    close(callback: ErrorCallback): void;
    close(): Promise<void>;
    close(deleteSubs: boolean, callback: ErrorCallback): void;

    readAllAttributes(nodes: NodeId | NodeId[], callback: ResponseCallback<any>): void;

    // properties
    /** the session Id */
    public sessionId: NodeId;
}

export declare interface UAProxyBase {
    nodeId: NodeId;
    browseName: QualifiedName;
    description: LocalizedText;
    nodeClass: NodeClass;
    typeDefinition: string | null;

    on(event: string, eventHandler: () => void): UAProxyBase;
}

export declare interface UAProxyVariable extends UAProxyBase {
    dataValue: DataValue;
    userAccessLevel: any;
    accessLevel: any;
}

export declare class UAProxyManager {
    constructor(session: ClientSession);

    start(callback: ErrorCallback): void;
    start(): Promise<void>;

    stop(callback: ErrorCallback): void;
    stop(): Promise<void>;

    getObject(nodeId: NodeId, callback: (object: any) => void): void;
    getObject(nodeId: NodeId): Promise<UAProxyBase>;
}

export interface UserIdentityInfo {
    userName: string;
    password: string;
}

/**
 *  @class OPCUAClient
 *  @extends OPCUAClientBase
 */
export declare class OPCUAClient extends OPCUAClientBase {
    /**
     */
    constructor(options: OPCUAClientOptions);

    // async with callback methods

    createSession(callback: ResponseCallback<ClientSession>): void;
    createSession(userIdentityInfo: UserIdentityInfo, callback: ResponseCallback<ClientSession>): void;
    createSession(userIdentityInfo?: UserIdentityInfo): Promise<ClientSession>;


    withSession(
        endpointUrl: string,
        innerFunction: (session: ClientSession, done: () => void) => void,
        callback: ErrorCallback
    ): void;

    // ---- async with promise methods
    withSessionAsync(endpointUrl: string, innerFunction: (session: ClientSession) => Promise<any>): Promise<any>;

    withSubscription(
        endpointUrl: string,
        subscriptionParameters: any,
        innerFunction: (session: ClientSession, subscription: ClientSubscription, done: () => void) => void,
        callback: ErrorCallback
    ): void;

    withSubscriptionAsync(
        endpointUrl: string,
        subscriptionParameters: any,
        innerFunction: (session: ClientSession, subscription: ClientSubscription) => Promise<any>
    ): Promise<any>;


    closeSession(session: ClientSession, deleteSubscriptions: boolean): Promise<void>;
    closeSession(session: ClientSession, deleteSubscriptions: boolean, callback: (err: Error | null) => void): void;
}

// ----------------------------------------------------------------------------------------------------------------
declare type ValidUserFunc = (username: string, password: string) => boolean;

declare type ValidUserAsyncFunc = (username: string, password: string, callback: ErrorCallback) => void;

export interface OPCUAServerOptions {
    /** the default secure token life time in ms. */
    defaultSecureTokenLifetime?: number;
    /**
     * the HEL/ACK transaction timeout in ms. Use a large value
     * ( i.e 15000 ms) for slow connections or embedded devices.
     * @default 10000
     */
    timeout?: number;
    /**
     * the TCP port to listen to.
     * @default 26543
     */
    port?: number;
    /**
     * the maximum number of concurrent sessions allowed.
     * @default 10
     */
    maxAllowedSessionNumber?: number;

    /** the nodeset.xml file(s) to load */
    nodeset_filename?: string[] | string;
    serverInfo?: ServerInfo,
    /**
     * @default [SecurityPolicy.None, SecurityPolicy.Basic128Rsa15, SecurityPolicy.Basic256]
     */
    securityPolicies?: SecurityPolicy[];
    /**
     * @default [MessageSecurityMode.NONE, MessageSecurityMode.SIGN, MessageSecurityMode.SIGNANDENCRYPT]
     */
    securityModes?: MessageSecurityMode[];
    /**
     * tells if the server default endpoints should allow anonymous connection.
     * @default true
     */
    allowAnonymous?: boolean;
    /* an object that implements user authentication methods */
    userManager?: {
        /** synchronous function to check the credentials - can be overruled by isValidUserAsync */
        isValidUser?: ValidUserFunc;
        /** asynchronous function to check if the credentials - overrules isValidUser */
        isValidUserAsync?: ValidUserAsyncFunc;
    };
    /** resource Path is a string added at the end of the url such as "/UA/Server" */
    resourcePath?: string;
    /** alternate hostname to use */
    alternateHostname?: string;
    /**
     * if server shall raise AuditingEvent
     * @default true
     */
    isAuditing?: boolean;
}

export declare enum ServerState {
    Running,
    Failed,
    NoConfiguration,
    Suspended,
    Shutdown,
    Test,
    CommunicationFault,
    Unknown
}

export declare class BrowseName {
    name: string;
    namespace: number;
}

export declare enum DataType {
    Null = 0,
    Boolean = 1,
    SByte = 2, // signed Byte = Int8
    Byte = 3, // unsigned Byte = UInt8
    Int16 = 4,
    UInt16 = 5,
    Int32 = 6,
    UInt32 = 7,
    Int64 = 8,
    UInt64 = 9,
    Float = 10,
    Double = 11,
    String = 12,
    DateTime = 13,
    Guid = 14,
    ByteString = 15,
    XmlElement = 16,
    NodeId = 17,
    ExpandedNodeId = 18,
    StatusCode = 19,
    QualifiedName = 20,
    LocalizedText = 21,
    ExtensionObject = 22,
    DataValue = 23,
    Variant = 24,
    DiagnosticInfo = 25
}

export enum AccessLevelFlag {
    CurrentRead,
    CurrentWrite,
    HistoryRead,
    HistoryWrite,
    SemanticChange,
    StatusWrite,
    TimestampWrite,
    NONE
}

export declare enum VariantArrayType {
    Scalar = 0x00,
    Array = 0x01,
    Matrix = 0x02
}

export declare interface BaseNodeOptions {
    addressSpace: AddressSpace;
    browseName: string;
    displayName?: LocalizedText | string;
    references?: UAReference[];
    descritpion?: LocalizedText | string;
    browseFilter?: () => void;
}

export declare interface UAVariableOptions extends BaseNodeOptions {
    value?: any;
    dataType: NodeId | string;
    valueRank?: Int32;
    arrayDimensions?: number[];
    accessLevel?: AccessLevelFlag;
    userAcessLevel?: AccessLevelFlag;
    minimumSamplingInterval: number;
    historizing?: boolean;
    parentNodeId?: NodeId;
}

export declare interface UATypeOptions extends BaseNodeOptions {
    componentOf?: string | NodeId | BaseNode;
    notifierOf?: any;
    eventSourceOf?: any;
    optionals?: string[];
    modellingRule?: string;
}

export declare interface UAVariableTypeOptions extends UATypeOptions {
    minimumSamplingInterval?: number;
}

export declare interface UAObjectTypeOptions extends UATypeOptions {
}

export class UAObjectType extends BaseNode {

    readAttribute(context: SessionContext, attributeId: any): DataValue;

    instantiate(options: UAObjectTypeOptions): UAObject;
}

export declare class UAVariableType extends BaseNode {
    isAbstract: boolean;
    value: any;
    dataType: DataType | NodeId;
    valueRank: Int32;
    arrayDimensions: number[];
    addressSpace: AddressSpace;

    readAttribute(context: SessionContext, attributeId: any): DataValue;

    instantiate(options: UAVariableTypeOptions): UAVariable;
}

export declare class NumericRange {
}

export declare class SessionContext {
    object: object;
    server: OPCUAServer;
    session: ClientSession;
}

export declare interface WriteValue {
    nodeId: NodeId;
    attributeId: any;
    value: DataValue;
    // @ts-ignore
    indexRange: NumericRange;
}

export declare interface AddReferenceOpts {
    referenceType: string | NodeId;
    nodeId: NodeId | string;
}

export declare class UAReference {
    referenceType: string;
    isForward: boolean;
    nodeId: NodeId | string;

    constructor(options: ReferenceDescription);
}

export declare class BaseNode {
    browseName: BrowseName;
    nodeId: string | NodeId;

    constructor(options: BaseNodeOptions);

    addReference(options: AddReferenceOpts): UAReference;

    findReference(strReference: string, isForward?: boolean, optionalSymbolicName?: string): UAReference;

    getComponentByName(browseName: string): BaseNode;

    getPropertyByName(browseName: string): BaseNode;
}

export declare class UAView extends BaseNode {

}

export declare class UAObject extends BaseNode {
    readAttribute(context: SessionContext, attributeId: NodeId | string): DataValue;

    clone(options?: UAObjectTypeOptions, optionalfilter?: any, extraInfo?: any): UAObject;
}

export declare class UAVariable extends BaseNode {
    dataType: any;
    valueRank: UInt32;
    arrayDimensions: number[];
    accessLevel: AccessLevelFlag;
    userAccessLevel: AccessLevelFlag;
    parentNodeId: NodeId | string;
    historizing: boolean;

    setValueFromSource(variant: Variant, statusCode?: StatusCode, sourceTimestamp?: any);

    isValueInRange(value: Variant): StatusCode;

    readValue(context?: SessionContext, indexRange?: NumericRange, dataEncoding?: string): DataValue;

    writeValue(context: SessionContext, dataValue: DataValue, indexRange?: NumericRange,
               callback?: (err: Error, statusCode: StatusCode) => void): void;

    readAttribute(context: SessionContext, attributeId: any, indexRange: NumericRange, dataEncoding): DataValue;

    writeAttribute(context: SessionContext, writeValue: WriteValue, callback: (err: Error, statusCode: StatusCode) => void): void;

    bindVariable(options: any, overwrite: boolean): void;

    readValueAsync(context: SessionContext, callback: (err: Error, statusCode: StatusCode) => void): void

    bindExtensionObject(): void;

    clone(options?: UAVariableOptions, optionalfilter?: any, extraInfo?: any): UAObject;
}


export declare class UAAnalogItem extends UAVariable {
}

export interface VariantOpts {
    dataType?: DataType;
    value?: any;
    arrayType?: VariantArrayType;
    dimensions?: number[];
}

export declare class Variant {
    constructor(options: VariantOpts);

    dataType: DataType;
    value: any;
    arrayType: VariantArrayType;
    dimensions: null | number[];
}

declare interface DataValueOpts {
    value?: Variant;
    sourceTimestamp?: Date;
    serverTimestamp?: Date;
    sourcePicoseconds?: number;
    serverPicoseconds?: number;
    statusCode?: StatusCode;
}

export declare class DataValue {
    constructor(options: DataValueOpts);

    value: Variant;
    sourceTimestamp: Date;
    serverTimestamp: Date;
    sourcePicoseconds: number;
    serverPicoseconds: number;
    statusCode: StatusCode;

    toString(): string;
}

export declare interface AddNodeOpts {
    browseName: string;
    organizedBy?: NodeId | BaseNode;
    nodeId?: string | NodeId;
}

export declare interface AddVariableOpts extends AddNodeOpts {
    componentOf: any;
    dataType: string | DataType;
    // @ts-ignore
    value: {
        get?(): Variant,
        set?(val: Variant): StatusCode,
        timestamp_get?(): DataValue,
        refreshFunc?(err: null | Error, dataValue?: DataValue): void;
    };
}

export declare interface AddTypeOpts {
    browseName: string;
    subtypeOf?: string | NodeId | BaseNode;
    nodeId?: string | NodeId;
    isAbstract?: boolean;
    eventNotifier?: number;
}

export declare interface AddObjectTypeOpts extends AddTypeOpts {
    postInstantiateFunc?: (param?: any) => void;
}

export declare interface AddVariableTypeOpts extends AddTypeOpts {
    dataType?: string | NodeId;
    valueRank?: number;
    arrayDimensions?: number[];
}

export declare enum EUEngineeringUnit {
    degree_celsius,
    meter,
    // to be continued
}

export declare interface AddAnalogDataItemOpts extends AddNodeOpts {
    definition: string; // exemple  "(tempA -25) + tempB",
    valuePrecision: number; // 0.5,
    engineeringUnitsRange: {
        low: number,
        high: number
    };
    instrumentRange: {
        low: number,
        high: number
    };
    engineeringUnits: EUEngineeringUnit;
}


type CoercibleToDataValue = DataValue | DataValueOpts;

export declare class WriteValue {
    nodeId: NodeId;
    // @ts-ignore
    attributeId: AttributeIds;
    // @ts-ignore
    indexRange?: NumericRange;
    value: DataValue;
}

export declare interface OPCUAServerEndPointOptions {
    certificate?: any;
    certificateChain?: any;
    privateKey?: string;
    timeout?: number;
    maxConnections?: number;
    defaultSecureTokenLifetime?: number;
    port?: string | number;
    serverinfo?: ServerInfo;
}

export declare interface ServerInfo {
    applicationUri?: string;         //  (default "urn:NodeOPCUA-Server")
    productUri?: string;             // = "NodeOPCUA-Server"]{String}
    applicationName?: LocalizedText | string; // "applicationName"}]{LocalizedText}
    gatewayServerUri?: string;
    discoveryProfileUri?: string;
    discoveryUrls?: string[];
}

export declare interface EndpointDescriptionOptions {
    endpointUrl?: string;
    server?: any;
    serverCertificate?: any;
    securityMode?: any;
    securityPolicyUri?: any;
    userIdentityTokens?: any;
    transportProfileUri?: string;
    securityLevel?: any;
}

export declare class EndpointDescription {

    endpointUrl: string;
    server: any;
    serverCertificate: any;
    securityPolicyUri: any;
    userIdentityTokens: any[];
    transportProfileUri: string;
    securityLevel: any;

    constructor(options?: EndpointDescriptionOptions);
}

export declare class OPCUAServerEndPoint {

    options: OPCUAServerEndPointOptions;
    port: number;
    maxConnections: number;
    defaultSecureTokenLifetime: number;
    timeout: number;

    constructor(options?: OPCUAServerEndPointOptions);

    endpointDescriptions(): EndpointDescription[];
}

type CoercibleToNodeId = string | NodeId;

type CoercibleToWriteValue =
    | {
    nodeId: CoercibleToNodeId;
    attributeId: AttributeIds;
    indexRange?: NumericRange;
    value: CoercibleToDataValue;
}
    | WriteValue;

export declare class DiagnosticInfo {
    namespaceUri: number;
    symbolicId: number;
    locale: number;
    localizedText: number;
    additionalInfo: string;
    innerStatusCode: StatusCode;
    innerDiagnosticInfo: DiagnosticInfo;
}

export interface AddNodeOptions {
    browseName: string;
    displayName?: string | LocalizedText | LocalizedText[];
    description?: string;

    organizedBy?: NodeId | BaseNode;
    componentOf?: NodeId | BaseNode;
    nodeId?: string | NodeId;
}

export interface AddVariableOpts extends AddNodeOptions {
    dataType: string | DataType;
    // @ts-ignore
    value?: {
        get?: () => Variant;
        timestamp_get?: () => DataValue;
        refreshFunc?: (err: null | Error, dataValue?: DataValue) => void;
    };
}

export interface AddAnalogDataItemOpts extends AddNodeOptions {
    /** @example  "(tempA -25) + tempB" */
    definition: string;
    /** @example 0.5 */
    valuePrecision: number;
    engineeringUnitsRange: {
        low: number;
        high: number;
    };
    instrumentRange: {
        low: number;
        high: number;
    };
    engineeringUnits: EUEngineeringUnit;
}

export declare class AddressSpace {
    rootFolder: any;

    find(node: NodeId | string): BaseNode;

    addVariable(options: AddVariableOpts): UAVariable;

    addAnalogDataItem(options: AddAnalogDataItemOpts): UAAnalogItem;

    addView(options: AddNodeOptions): UAView;

    addObject(options: AddNodeOpts): UAObject;

    addObjectType(options: AddObjectTypeOpts): UAObjectType;

    addVariableType(options: AddVariableTypeOpts): UAVariableType;
}

export declare class ServerEngine {
    addressSpace: AddressSpace;
}

export declare interface EndpointDescription {
    securityPolicies: any;
    securityModes: any;
    allowAnonymous: boolean;
    disableDiscovery: boolean;
    resourcePath: string;
    hostname: string;
    endpointUrl: string;
}

export declare interface OPCUAServerEndPoint {
    port: number;
    defaultSecureTokenLifetime: number;
    timeout: number;
    certificateChain: any;
    privateKey: any;
    serverInfo: any;
    // @ts-ignore
    maxConnections: any;

    endpointDescriptions(): EndpointDescription[];
}

export declare class OPCUAServer {
    constructor(options?: OPCUAServerOptions);

    bytesWritten: number;
    bytesRead: number;
    transactionsCount: number;
    currentSubscriptionCount: number;
    rejectedSessionCount: number;
    sessionAbortCount: number;
    publishingIntervalCount: number;
    sessionTimeoutCount: number;
    /**
     * the number of connected channel on all existing end points
     */
    currentChannelCount: number;
    buildInfo: any;

    endpoints: OPCUAServerEndPoint[];

    secondsTillShutdown: number;

    serverName: string;
    serverNameUrn: string;

    engine: ServerEngine;

    setServerState(serverState: ServerState): void;

    start(callback: ErrorCallback): void;
    start(): Promise<void>;

    shutdown(timeout: number, callback: ErrorCallback): void;
    shutdown(timeout: number): Promise<void>;

    initialize(done: () => void): void;

    on(event: string, eventHandler: () => void): OPCUAServer;
}

export declare interface MonitoringParameters {
    readonly clientHandle: number;
    readonly samplingInterval: number;
    readonly filter: any;
    readonly queueSize: number;
    readonly discardOldest: boolean;
}

export declare class ClientMonitoredItem {
    itemToMonitor: ReadValueId;
    subscription: ClientSubscription;

    terminate(callback: ErrorCallback): void;
    terminate(): Promise<void>;

    public monitoringParameters: MonitoringParameters;

    /**
     * @method on
     * @param {string} event
     * @param {() => void} eventHandler
     * @chainable
     */
    on(event: 'changed', eventHandler: (dataValue: DataValue) => void): this;
    on(event: 'initialized' | 'terminated', eventHandler: () => void): this;
    on(event: 'err', eventHandler: (err: Error) => void): this;

    on(event: string, eventhandler: (v: Variant) => void): void;

}

export interface TimestampsToReturn {
    Invalid: -1;
    Source: 0;
    Server: 1;
    Both: 2;
    Neither: 3;
}

export declare class read_service {
    static TimestampsToReturn: TimestampsToReturn;
}


export declare interface ItemToMonitor {
    nodeId: NodeId;
    attributeId: AttributeIds;
    // TODO: figure out how to represent indexRange (NumericRange) and dataEncoding (unknown)
}

export declare interface ItemToMonitorRequestedParameters {
    samplingInterval: number;
    discardOldest: boolean;
    queueSize: number;
    // TODO: add filter parameter (extension object)
}


type NumericRange = string;

export interface ReadValueId {
    nodeId: NodeId;
    attributeId: AttributeIds;
    indexRange?: NumericRange;
    // TODO: figure out how to represent indexRange (NumericRange) and dataEncoding (unknown)
}

type CoercibleToReadValueId =
    | {
    nodeId: string | NodeId;
    attributeId: AttributeIds;
}
    | ReadValueId;

export interface ItemToMonitorRequestedParameters {
    samplingInterval: number;
    discardOldest: boolean;
    queueSize: number;
    // TODO: add filter parameter (extension object)
}

type CoercibleToItemToMonitorRequestedParameters =
    | {
    samplingInterval: number;
    discardOldest?: boolean;
    queueSize?: number;
}
    | ItemToMonitorRequestedParameters;

export interface ClientSubscriptionOptions {
    requestedPublishingInterval: number;
    requestedLifetimeCount: number;
    requestedMaxKeepAliveCount: number;
    maxNotificationsPerPublish: number;
    publishingEnabled: boolean;
    priority: number;
}

export declare class ClientSubscription {
    constructor(session: ClientSession, options: ClientSubscriptionOptions);

    subscriptionId: number;

    monitor(
        itemToMonitor: ReadValueId,
        requestedParameters: CoercibleToItemToMonitorRequestedParameters,
        timestampsToReturn?: number,
        done?: () => void,
    ): ClientMonitoredItem;

    monitor(
        itemToMonitor: ReadValueId,
        requestedParameters: CoercibleToItemToMonitorRequestedParameters,
        timestampsToReturn?: number
    ): Promise<ClientMonitoredItem>;

    on(event: string, eventHandler: () => void): ClientSubscription;

    terminate(callback: ErrorCallback): void;

    terminate(): Promise<void>;
}

export declare function coerceNodeId(nodeId: any): NodeId;

export declare function makeNodeId(nodeId: any, namespaceIndex?: number): NodeId;

export declare function resolveNodeId(id: NodeId | string): NodeId;

export declare function makeBrowsePath(rootNode: NodeId, relativePath: string): BrowsePath;

export declare function generate_address_space(addressSpace: AddressSpace, xmlFiles: string | string[], callback: (err?: any) => void);

