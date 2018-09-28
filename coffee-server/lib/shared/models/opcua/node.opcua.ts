import {SecurityPolicy, MessageSecurityMode} from 'node-opcua';

export {ConnectionStrategy, OPCUAClientOptions, MessageSecurityMode, SecurityPolicy} from 'node-opcua';

export type MessageSecurityModeLiteral = "INVALID" | "NONE" | "SIGN" | "SIGNANDENCRYPT";

export type SecurityPolicyLiteral = "None" | "Basic128" | "Basic128Rsa15" | "Basic192" | "Basic192Rsa15" | "Basic256" | "Basic256Rsa15" | "Basic256Sha256";

export function toSecurityPolicy(literal: SecurityPolicyLiteral): SecurityPolicy {
    return <SecurityPolicy>SecurityPolicy[literal];
}
export function toMessageSecurityMode(literal: MessageSecurityModeLiteral): MessageSecurityMode {
    return <MessageSecurityMode>MessageSecurityMode[literal];
}