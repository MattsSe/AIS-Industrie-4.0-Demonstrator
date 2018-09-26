var UaNodeset1_Module_Factory = function () {
  var UaNodeset1 = {
    name: 'UaNodeset1',
    defaultElementNamespaceURI: 'http:\/\/opcfoundation.org\/UA\/2011\/03\/UANodeSet.xsd',
    typeInfos: [{
      localName: 'UAReferenceType',
      baseTypeInfo: '.UAType',
      propertyInfos: [{
        name: 'inverseName',
        minOccurs: 0,
        collection: true,
        elementName: 'InverseName',
        typeInfo: '.LocalizedText'
      }, {
        name: 'symmetric',
        typeInfo: 'Boolean',
        attributeName: {
          localPart: 'Symmetric'
        },
        type: 'attribute'
      }]
    }, {
      localName: 'UANodeSetChangesStatus',
      typeName: null,
      propertyInfos: [{
        name: 'nodesToAdd',
        elementName: 'NodesToAdd',
        typeInfo: '.NodeSetStatusList'
      }, {
        name: 'referencesToAdd',
        elementName: 'ReferencesToAdd',
        typeInfo: '.NodeSetStatusList'
      }, {
        name: 'nodesToDelete',
        elementName: 'NodesToDelete',
        typeInfo: '.NodeSetStatusList'
      }, {
        name: 'referencesToDelete',
        elementName: 'ReferencesToDelete',
        typeInfo: '.NodeSetStatusList'
      }, {
        name: 'lastModified',
        typeInfo: 'DateTime',
        attributeName: {
          localPart: 'LastModified'
        },
        type: 'attribute'
      }, {
        name: 'transactionId',
        required: true,
        attributeName: {
          localPart: 'TransactionId'
        },
        type: 'attribute'
      }]
    }, {
      localName: 'NodesToDelete',
      propertyInfos: [{
        name: 'node',
        minOccurs: 0,
        collection: true,
        elementName: 'Node',
        typeInfo: '.NodeToDelete'
      }]
    }, {
      localName: 'LocalizedText',
      propertyInfos: [{
        name: 'value',
        type: 'value'
      }, {
        name: 'locale',
        attributeName: {
          localPart: 'Locale'
        },
        type: 'attribute'
      }]
    }, {
      localName: 'UAVariable.Value',
      typeName: null,
      propertyInfos: [{
        name: 'any',
        mixed: false,
        type: 'anyElement'
      }]
    }, {
      localName: 'ListOfExtensions',
      propertyInfos: [{
        name: 'extension',
        minOccurs: 0,
        collection: true,
        elementName: 'Extension',
        typeInfo: '.ListOfExtensions.Extension'
      }]
    }, {
      localName: 'UANodeSetChanges',
      typeName: null,
      propertyInfos: [{
        name: 'namespaceUris',
        elementName: 'NamespaceUris',
        typeInfo: '.UriTable'
      }, {
        name: 'serverUris',
        elementName: 'ServerUris',
        typeInfo: '.UriTable'
      }, {
        name: 'aliases',
        elementName: 'Aliases',
        typeInfo: '.AliasTable'
      }, {
        name: 'extensions',
        elementName: 'Extensions',
        typeInfo: '.ListOfExtensions'
      }, {
        name: 'nodesToAdd',
        elementName: 'NodesToAdd',
        typeInfo: '.NodesToAdd'
      }, {
        name: 'referencesToAdd',
        elementName: 'ReferencesToAdd',
        typeInfo: '.ReferencesToChange'
      }, {
        name: 'nodesToDelete',
        elementName: 'NodesToDelete',
        typeInfo: '.NodesToDelete'
      }, {
        name: 'referencesToDelete',
        elementName: 'ReferencesToDelete',
        typeInfo: '.ReferencesToChange'
      }, {
        name: 'lastModified',
        typeInfo: 'DateTime',
        attributeName: {
          localPart: 'LastModified'
        },
        type: 'attribute'
      }, {
        name: 'transactionId',
        required: true,
        attributeName: {
          localPart: 'TransactionId'
        },
        type: 'attribute'
      }, {
        name: 'acceptAllOrNothing',
        typeInfo: 'Boolean',
        attributeName: {
          localPart: 'AcceptAllOrNothing'
        },
        type: 'attribute'
      }]
    }, {
      localName: 'NodeSetStatus',
      propertyInfos: [{
        name: 'value',
        type: 'value'
      }, {
        name: 'code',
        typeInfo: 'UnsignedInt',
        attributeName: {
          localPart: 'Code'
        },
        type: 'attribute'
      }]
    }, {
      localName: 'ReferencesToChange',
      propertyInfos: [{
        name: 'reference',
        minOccurs: 0,
        collection: true,
        elementName: 'Reference',
        typeInfo: '.ReferenceChange'
      }]
    }, {
      localName: 'Reference',
      propertyInfos: [{
        name: 'value',
        type: 'value'
      }, {
        name: 'referenceType',
        required: true,
        attributeName: {
          localPart: 'ReferenceType'
        },
        type: 'attribute'
      }, {
        name: 'isForward',
        typeInfo: 'Boolean',
        attributeName: {
          localPart: 'IsForward'
        },
        type: 'attribute'
      }]
    }, {
      localName: 'DataTypeField',
      propertyInfos: [{
        name: 'displayName',
        minOccurs: 0,
        collection: true,
        elementName: 'DisplayName',
        typeInfo: '.LocalizedText'
      }, {
        name: 'description',
        minOccurs: 0,
        collection: true,
        elementName: 'Description',
        typeInfo: '.LocalizedText'
      }, {
        name: 'name',
        required: true,
        attributeName: {
          localPart: 'Name'
        },
        type: 'attribute'
      }, {
        name: 'symbolicName',
        typeInfo: {
          type: 'list'
        },
        attributeName: {
          localPart: 'SymbolicName'
        },
        type: 'attribute'
      }, {
        name: 'dataType',
        attributeName: {
          localPart: 'DataType'
        },
        type: 'attribute'
      }, {
        name: 'valueRank',
        typeInfo: 'Int',
        attributeName: {
          localPart: 'ValueRank'
        },
        type: 'attribute'
      }, {
        name: 'value',
        typeInfo: 'Int',
        attributeName: {
          localPart: 'Value'
        },
        type: 'attribute'
      }, {
        name: 'isOptional',
        typeInfo: 'Boolean',
        attributeName: {
          localPart: 'IsOptional'
        },
        type: 'attribute'
      }]
    }, {
      localName: 'UANode',
      propertyInfos: [{
        name: 'displayName',
        minOccurs: 0,
        collection: true,
        elementName: 'DisplayName',
        typeInfo: '.LocalizedText'
      }, {
        name: 'description',
        minOccurs: 0,
        collection: true,
        elementName: 'Description',
        typeInfo: '.LocalizedText'
      }, {
        name: 'category',
        minOccurs: 0,
        collection: true,
        elementName: 'Category'
      }, {
        name: 'documentation',
        elementName: 'Documentation'
      }, {
        name: 'references',
        elementName: 'References',
        typeInfo: '.ListOfReferences'
      }, {
        name: 'rolePermissions',
        elementName: 'RolePermissions',
        typeInfo: '.ListOfRolePermissions'
      }, {
        name: 'extensions',
        elementName: 'Extensions',
        typeInfo: '.ListOfExtensions'
      }, {
        name: 'nodeId',
        required: true,
        attributeName: {
          localPart: 'NodeId'
        },
        type: 'attribute'
      }, {
        name: 'browseName',
        required: true,
        attributeName: {
          localPart: 'BrowseName'
        },
        type: 'attribute'
      }, {
        name: 'writeMask',
        typeInfo: 'UnsignedInt',
        attributeName: {
          localPart: 'WriteMask'
        },
        type: 'attribute'
      }, {
        name: 'userWriteMask',
        typeInfo: 'UnsignedInt',
        attributeName: {
          localPart: 'UserWriteMask'
        },
        type: 'attribute'
      }, {
        name: 'accessRestrictions',
        typeInfo: 'UnsignedByte',
        attributeName: {
          localPart: 'AccessRestrictions'
        },
        type: 'attribute'
      }, {
        name: 'symbolicName',
        typeInfo: {
          type: 'list'
        },
        attributeName: {
          localPart: 'SymbolicName'
        },
        type: 'attribute'
      }]
    }, {
      localName: 'UAObject',
      baseTypeInfo: '.UAInstance',
      propertyInfos: [{
        name: 'eventNotifier',
        typeInfo: 'UnsignedByte',
        attributeName: {
          localPart: 'EventNotifier'
        },
        type: 'attribute'
      }]
    }, {
      localName: 'TranslationType',
      propertyInfos: [{
        name: 'text',
        minOccurs: 0,
        collection: true,
        elementName: 'Text',
        typeInfo: '.LocalizedText'
      }, {
        name: 'field',
        minOccurs: 0,
        collection: true,
        elementName: 'Field',
        typeInfo: '.StructureTranslationType'
      }]
    }, {
      localName: 'ModelTableEntry',
      propertyInfos: [{
        name: 'rolePermissions',
        elementName: 'RolePermissions',
        typeInfo: '.ListOfRolePermissions'
      }, {
        name: 'requiredModel',
        minOccurs: 0,
        collection: true,
        elementName: 'RequiredModel',
        typeInfo: '.ModelTableEntry'
      }, {
        name: 'modelUri',
        attributeName: {
          localPart: 'ModelUri'
        },
        type: 'attribute'
      }, {
        name: 'version',
        attributeName: {
          localPart: 'Version'
        },
        type: 'attribute'
      }, {
        name: 'publicationDate',
        typeInfo: 'DateTime',
        attributeName: {
          localPart: 'PublicationDate'
        },
        type: 'attribute'
      }, {
        name: 'symbolicName',
        typeInfo: {
          type: 'list'
        },
        attributeName: {
          localPart: 'SymbolicName'
        },
        type: 'attribute'
      }, {
        name: 'accessRestrictions',
        typeInfo: 'UnsignedByte',
        attributeName: {
          localPart: 'AccessRestrictions'
        },
        type: 'attribute'
      }]
    }, {
      localName: 'AliasTable',
      propertyInfos: [{
        name: 'alias',
        minOccurs: 0,
        collection: true,
        elementName: 'Alias',
        typeInfo: '.NodeIdAlias'
      }]
    }, {
      localName: 'UAView',
      baseTypeInfo: '.UAInstance',
      propertyInfos: [{
        name: 'containsNoLoops',
        typeInfo: 'Boolean',
        attributeName: {
          localPart: 'ContainsNoLoops'
        },
        type: 'attribute'
      }, {
        name: 'eventNotifier',
        typeInfo: 'UnsignedByte',
        attributeName: {
          localPart: 'EventNotifier'
        },
        type: 'attribute'
      }]
    }, {
      localName: 'UAVariableType',
      baseTypeInfo: '.UAType',
      propertyInfos: [{
        name: 'value',
        elementName: 'Value',
        typeInfo: '.UAVariableType.Value'
      }, {
        name: 'dataType',
        attributeName: {
          localPart: 'DataType'
        },
        type: 'attribute'
      }, {
        name: 'valueRank',
        typeInfo: 'Int',
        attributeName: {
          localPart: 'ValueRank'
        },
        type: 'attribute'
      }, {
        name: 'arrayDimensions',
        typeInfo: {
          type: 'list'
        },
        attributeName: {
          localPart: 'ArrayDimensions'
        },
        type: 'attribute'
      }]
    }, {
      localName: 'UAObjectType',
      baseTypeInfo: '.UAType'
    }, {
      localName: 'NodeToDelete',
      propertyInfos: [{
        name: 'value',
        type: 'value'
      }, {
        name: 'deleteReverseReferences',
        typeInfo: 'Boolean',
        attributeName: {
          localPart: 'DeleteReverseReferences'
        },
        type: 'attribute'
      }]
    }, {
      localName: 'NodesToAdd',
      propertyInfos: [{
        name: 'uaObjectOrUAVariableOrUAMethod',
        minOccurs: 0,
        collection: true,
        elementTypeInfos: [{
          elementName: 'UAObject',
          typeInfo: '.UAObject'
        }, {
          elementName: 'UAVariable',
          typeInfo: '.UAVariable'
        }, {
          elementName: 'UAMethod',
          typeInfo: '.UAMethod'
        }, {
          elementName: 'UAView',
          typeInfo: '.UAView'
        }, {
          elementName: 'UAObjectType',
          typeInfo: '.UAObjectType'
        }, {
          elementName: 'UAVariableType',
          typeInfo: '.UAVariableType'
        }, {
          elementName: 'UADataType',
          typeInfo: '.UADataType'
        }, {
          elementName: 'UAReferenceType',
          typeInfo: '.UAReferenceType'
        }],
        type: 'elements'
      }]
    }, {
      localName: 'UAMethod',
      baseTypeInfo: '.UAInstance',
      propertyInfos: [{
        name: 'argumentDescription',
        minOccurs: 0,
        collection: true,
        elementName: 'ArgumentDescription',
        typeInfo: '.UAMethodArgument'
      }, {
        name: 'executable',
        typeInfo: 'Boolean',
        attributeName: {
          localPart: 'Executable'
        },
        type: 'attribute'
      }, {
        name: 'userExecutable',
        typeInfo: 'Boolean',
        attributeName: {
          localPart: 'UserExecutable'
        },
        type: 'attribute'
      }, {
        name: 'methodDeclarationId',
        attributeName: {
          localPart: 'MethodDeclarationId'
        },
        type: 'attribute'
      }]
    }, {
      localName: 'RolePermission',
      propertyInfos: [{
        name: 'value',
        type: 'value'
      }, {
        name: 'permissions',
        typeInfo: 'UnsignedInt',
        attributeName: {
          localPart: 'Permissions'
        },
        type: 'attribute'
      }]
    }, {
      localName: 'ListOfExtensions.Extension',
      typeName: null,
      propertyInfos: [{
        name: 'any',
        mixed: false,
        type: 'anyElement'
      }]
    }, {
      localName: 'ReferenceChange',
      propertyInfos: [{
        name: 'value',
        type: 'value'
      }, {
        name: 'source',
        required: true,
        attributeName: {
          localPart: 'Source'
        },
        type: 'attribute'
      }, {
        name: 'referenceType',
        required: true,
        attributeName: {
          localPart: 'ReferenceType'
        },
        type: 'attribute'
      }, {
        name: 'isForward',
        typeInfo: 'Boolean',
        attributeName: {
          localPart: 'IsForward'
        },
        type: 'attribute'
      }]
    }, {
      localName: 'UAType',
      baseTypeInfo: '.UANode',
      propertyInfos: [{
        name: 'isAbstract',
        typeInfo: 'Boolean',
        attributeName: {
          localPart: 'IsAbstract'
        },
        type: 'attribute'
      }]
    }, {
      localName: 'UriTable',
      propertyInfos: [{
        name: 'uri',
        minOccurs: 0,
        collection: true,
        elementName: 'Uri'
      }]
    }, {
      localName: 'ListOfReferences',
      propertyInfos: [{
        name: 'reference',
        minOccurs: 0,
        collection: true,
        elementName: 'Reference',
        typeInfo: '.Reference'
      }]
    }, {
      localName: 'ListOfRolePermissions',
      propertyInfos: [{
        name: 'rolePermission',
        minOccurs: 0,
        collection: true,
        elementName: 'RolePermission',
        typeInfo: '.RolePermission'
      }]
    }, {
      localName: 'StructureTranslationType',
      propertyInfos: [{
        name: 'text',
        minOccurs: 0,
        collection: true,
        elementName: 'Text',
        typeInfo: '.LocalizedText'
      }, {
        name: 'name',
        required: true,
        attributeName: {
          localPart: 'Name'
        },
        type: 'attribute'
      }]
    }, {
      localName: 'UAVariableType.Value',
      typeName: null,
      propertyInfos: [{
        name: 'any',
        mixed: false,
        type: 'anyElement'
      }]
    }, {
      localName: 'UANodeSet',
      typeName: null,
      propertyInfos: [{
        name: 'namespaceUris',
        elementName: 'NamespaceUris',
        typeInfo: '.UriTable'
      }, {
        name: 'serverUris',
        elementName: 'ServerUris',
        typeInfo: '.UriTable'
      }, {
        name: 'models',
        elementName: 'Models',
        typeInfo: '.ModelTable'
      }, {
        name: 'aliases',
        elementName: 'Aliases',
        typeInfo: '.AliasTable'
      }, {
        name: 'extensions',
        elementName: 'Extensions',
        typeInfo: '.ListOfExtensions'
      }, {
        name: 'uaObjectOrUAVariableOrUAMethod',
        minOccurs: 0,
        collection: true,
        elementTypeInfos: [{
          elementName: 'UAObject',
          typeInfo: '.UAObject'
        }, {
          elementName: 'UAVariable',
          typeInfo: '.UAVariable'
        }, {
          elementName: 'UAMethod',
          typeInfo: '.UAMethod'
        }, {
          elementName: 'UAView',
          typeInfo: '.UAView'
        }, {
          elementName: 'UAObjectType',
          typeInfo: '.UAObjectType'
        }, {
          elementName: 'UAVariableType',
          typeInfo: '.UAVariableType'
        }, {
          elementName: 'UADataType',
          typeInfo: '.UADataType'
        }, {
          elementName: 'UAReferenceType',
          typeInfo: '.UAReferenceType'
        }],
        type: 'elements'
      }, {
        name: 'lastModified',
        typeInfo: 'DateTime',
        attributeName: {
          localPart: 'LastModified'
        },
        type: 'attribute'
      }]
    }, {
      localName: 'NodeSetStatusList',
      propertyInfos: [{
        name: 'status',
        minOccurs: 0,
        collection: true,
        elementName: 'Status',
        typeInfo: '.NodeSetStatus'
      }]
    }, {
      localName: 'UAMethodArgument',
      propertyInfos: [{
        name: 'name',
        elementName: 'Name'
      }, {
        name: 'description',
        minOccurs: 0,
        collection: true,
        elementName: 'Description',
        typeInfo: '.LocalizedText'
      }]
    }, {
      localName: 'ModelTable',
      propertyInfos: [{
        name: 'model',
        minOccurs: 0,
        collection: true,
        elementName: 'Model',
        typeInfo: '.ModelTableEntry'
      }]
    }, {
      localName: 'DataTypeDefinition',
      propertyInfos: [{
        name: 'field',
        minOccurs: 0,
        collection: true,
        elementName: 'Field',
        typeInfo: '.DataTypeField'
      }, {
        name: 'name',
        required: true,
        attributeName: {
          localPart: 'Name'
        },
        type: 'attribute'
      }, {
        name: 'symbolicName',
        typeInfo: {
          type: 'list'
        },
        attributeName: {
          localPart: 'SymbolicName'
        },
        type: 'attribute'
      }, {
        name: 'isUnion',
        typeInfo: 'Boolean',
        attributeName: {
          localPart: 'IsUnion'
        },
        type: 'attribute'
      }, {
        name: 'isOptionSet',
        typeInfo: 'Boolean',
        attributeName: {
          localPart: 'IsOptionSet'
        },
        type: 'attribute'
      }]
    }, {
      localName: 'UAInstance',
      baseTypeInfo: '.UANode',
      propertyInfos: [{
        name: 'parentNodeId',
        attributeName: {
          localPart: 'ParentNodeId'
        },
        type: 'attribute'
      }]
    }, {
      localName: 'UAVariable',
      baseTypeInfo: '.UAInstance',
      propertyInfos: [{
        name: 'value',
        elementName: 'Value',
        typeInfo: '.UAVariable.Value'
      }, {
        name: 'translation',
        minOccurs: 0,
        collection: true,
        elementName: 'Translation',
        typeInfo: '.TranslationType'
      }, {
        name: 'dataType',
        attributeName: {
          localPart: 'DataType'
        },
        type: 'attribute'
      }, {
        name: 'valueRank',
        typeInfo: 'Int',
        attributeName: {
          localPart: 'ValueRank'
        },
        type: 'attribute'
      }, {
        name: 'arrayDimensions',
        typeInfo: {
          type: 'list'
        },
        attributeName: {
          localPart: 'ArrayDimensions'
        },
        type: 'attribute'
      }, {
        name: 'accessLevel',
        typeInfo: 'UnsignedInt',
        attributeName: {
          localPart: 'AccessLevel'
        },
        type: 'attribute'
      }, {
        name: 'userAccessLevel',
        typeInfo: 'UnsignedInt',
        attributeName: {
          localPart: 'UserAccessLevel'
        },
        type: 'attribute'
      }, {
        name: 'minimumSamplingInterval',
        typeInfo: 'Double',
        attributeName: {
          localPart: 'MinimumSamplingInterval'
        },
        type: 'attribute'
      }, {
        name: 'historizing',
        typeInfo: 'Boolean',
        attributeName: {
          localPart: 'Historizing'
        },
        type: 'attribute'
      }]
    }, {
      localName: 'NodeIdAlias',
      propertyInfos: [{
        name: 'value',
        type: 'value'
      }, {
        name: 'alias',
        attributeName: {
          localPart: 'Alias'
        },
        type: 'attribute'
      }]
    }, {
      localName: 'UADataType',
      baseTypeInfo: '.UAType',
      propertyInfos: [{
        name: 'definition',
        elementName: 'Definition',
        typeInfo: '.DataTypeDefinition'
      }]
    }],
    elementInfos: [
      {
        elementName: {
          localPart: 'UANodeSet',
        },
        typeInfo: '.UANodeSet'
      }, {
        elementName: {
          localPart: 'UANodeSetChangesStatus'
        },
        typeInfo: '.UANodeSetChangesStatus'
      }, {
        elementName: {
          localPart: 'UANodeSetChanges'
        },
        typeInfo: '.UANodeSetChanges'
      },
      {
        elementName: {
          localPart: 'DataTypeField'
        },
        typeInfo: '.DataTypeField'
      }
    ]
  };
  return {
    UaNodeset1: UaNodeset1
  };
};
if (typeof define === 'function' && define.amd) {
  define([], UaNodeset1_Module_Factory);
}
else {
  var UaNodeset1_Module = UaNodeset1_Module_Factory();
  if (typeof module !== 'undefined' && module.exports) {
    module.exports.UaNodeset1 = UaNodeset1_Module.UaNodeset1;
  }
  else {
    var UaNodeset1 = UaNodeset1_Module.UaNodeset1;
  }
}
