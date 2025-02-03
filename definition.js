var virtualPins = [
  [
    "V0",
    "0"
  ],
  [
    "V1",
    "1"
  ],
  [
    "V2",
    "2"
  ],
  [
    "V3",
    "3"
  ],
  [
    "V4",
    "4"
  ],
  [
    "V5",
    "5"
  ],
  [
    "V6",
    "6"
  ],
  [
    "V7",
    "7"
  ],
  [
    "V8",
    "8"
  ],
  [
    "V9",
    "9"
  ],
  [
    "V10",
    "10"
  ],
  [
    "V11",
    "11"
  ],
  [
    "V12",
    "12"
  ],
  [
    "V13",
    "13"
  ],
  [
    "V14",
    "14"
  ],
  [
    "V15",
    "15"
  ],
  [
    "V16",
    "16"
  ],
  [
    "V17",
    "17"
  ],
  [
    "V18",
    "18"
  ],
  [
    "V19",
    "19"
  ],
  [
    "V20",
    "20"
  ]
];

Blockly.Blocks["coreiot_connect"] = {
  init: function () {
    this.jsonInit({
      colour: "#2196f3",
      tooltip: "Connect to server Core IoT",
      message0: "connect Core IoT wifi %1 password %2 %3 access token %4 %5 server %6 port %7",
      previousStatement: null,
      nextStatement: null,
      args0: [
        {
          "type": "field_input",
          "name": "WIFI",
          "text": "ssid"
        },
        {
          "type": "field_input",
          "name": "PASSWORD",
          "text": "password"
        },
        {
          "type": "input_dummy"
        },
        {
          "type": "field_input",
          "name": "TOKEN",
          "text": "xxxxxxxxxxxxxxxxxxxx"
        },
        {
          "type": "input_dummy"
        },
        {
          "type": "field_input",
          "name": "HOST",
          "text": "app.coreiot.io"
        },
        {
          "type": "field_input",
          "name": "PORT",
          "text": "1883"
        },
      ],
      helpUrl: "",
    });
  },
};

Blockly.Python['coreiot_connect'] = function(block) {
  var wifi = block.getFieldValue('WIFI');
  var password = block.getFieldValue('PASSWORD');
  var token = block.getFieldValue('TOKEN');
  var host = block.getFieldValue('HOST');
  var port = block.getFieldValue('PORT');

  Blockly.Python.definitions_['import_coreiot'] = 'from ci_device_mqtt import *';
  Blockly.Python.definitions_['init_coreiot_mqtt'] = "ci_client = CIDeviceMqttClient('" + wifi + "', '" + password + "', '" + token + "', '" + host+ "', " + port + ")\n";
  
  // TODO: Assemble Python into code variable.
  var code = "await ci_client.connect()\n";
  return code;
};

Blockly.Blocks["coreiot_send_telemetry_short"] = {
  init: function () {
    this.jsonInit({
      colour: "#2196f3",
      nextStatement: null,
      tooltip: "Send telemetry to server",
      message0: "send telemetry %1 %2 : %3 %4",
      previousStatement: null,
      args0: [
        {
          type: "field_dropdown",
          name: "KEY",
          options: virtualPins,
        },
        {
          type: "input_dummy",
        },
        {
          type: "input_value",
          name: "VALUE",
        },        
        {
          type: "input_dummy",
        }
      ],
      helpUrl: "",
    });
  },
};

Blockly.Python['coreiot_send_telemetry_short'] = function(block) {
  var value = Blockly.Python.valueToCode(block, 'VALUE', Blockly.Python.ORDER_ATOMIC);
  var key = block.getFieldValue('KEY');
  // TODO: Assemble Python into code variable.
  Blockly.Python.definitions_['import_coreiot'] = 'from ci_device_mqtt import *';
  var code = "await ci_client.send_telemetry({'V" + key + "': " + value + "})\n";
  return code;
};

Blockly.Blocks["coreiot_send_telemetry"] = {
  init: function () {
    this.jsonInit({
      colour: "#2196f3",
      nextStatement: null,
      tooltip: "Send telemetry to server",
      message0: "send telemetry %1 %2 : %3 %4",
      previousStatement: null,
      args0: [
        {
          "type": "field_input",
          "name": "KEY",
          "text": "temperature"
        },
        {
          type: "input_dummy",
        },
        {
          type: "input_value",
          name: "VALUE",
        },        
        {
          type: "input_dummy",
        }
      ],
      helpUrl: "",
    });
  },
};

Blockly.Python['coreiot_send_telemetry'] = function(block) {
  var value = Blockly.Python.valueToCode(block, 'VALUE', Blockly.Python.ORDER_ATOMIC);
  var key = block.getFieldValue('KEY');
  // TODO: Assemble Python into code variable.
  Blockly.Python.definitions_['import_coreiot'] = 'from ci_device_mqtt import *';
  var code = "await ci_client.send_telemetry({'" + key + "': " + value + "})\n";
  return code;
};

Blockly.Blocks["coreiot_on_rpc_call"] = {
  init: function () {
    this.jsonInit({
      colour: "#2196f3",
      tooltip: "Actions to do when receive rpc call from server side",
      message0: "on receive rpc request %1 do %2 %3",
      args0: [
        {
          type: "field_input",
          name: "METHOD",
          text: "setValue"
        },
        { type: "input_dummy" },
        { type: "input_statement", name: "ACTION" },
      ],
      helpUrl: "",
    });
  },
};

Blockly.Python['coreiot_on_rpc_call'] = function(block) {
  var method = block.getFieldValue('METHOD');
  var statements_action = Blockly.Python.statementToCode(block, 'ACTION');
  // TODO: Assemble Python into code variable.
  var globals = buildGlobalString(block);

  var cbFunctionName = Blockly.Python.provideFunction_(
    'on_rpc_request_' + method,
    (globals != '')?
    ['async def ' + Blockly.Python.FUNCTION_NAME_PLACEHOLDER_ + '(request_id, request_body):',
      globals,
      statements_action || Blockly.Python.PASS
    ]:
    ['async def ' + Blockly.Python.FUNCTION_NAME_PLACEHOLDER_ + '(request_id, request_body):',
      statements_action || Blockly.Python.PASS
    ]);

  Blockly.Python.definitions_['setup_ci_on_rpc_request_' + method] = 
      "ci_client.set_rpc_request_handler('" + method + "', " + cbFunctionName + ")";

  return '';
};

Blockly.Blocks['coreiot_get_request_info'] = {
  init: function () {
    this.jsonInit(
      {
        "message0": "rpc request value",
        "args0": [],
        "output": null,
        "colour": "#2196f3",
        "tooltip": "Extract rpc request info",
        "helpUrl": ""
      }
    );
  }
};

Blockly.Python['coreiot_get_request_info'] = function (block) {
  // TODO: Assemble Python into code variable.
  var code = "request_body['params']";
  // TODO: Change ORDER_NONE to the correct strength.
  return [code, Blockly.Python.ORDER_NONE];
};

Blockly.Blocks['coreiot_request_compare_value'] = {
  init: function () {
    this.jsonInit(
      {
        "message0": "rpc request value is %1 %2",
        "args0": [
          {
            "type": "input_value",
            "name": "VALUE",
          },
          {
            type: "input_dummy"
          }
        ],
        "output": "Boolean",
        "colour": "#2196f3",
        "tooltip": "Check if rpc request value is same as input value",
        "helpUrl": ""
      }
    );
  }
};

Blockly.Python['coreiot_request_compare_value'] = function (block) {
  var value = Blockly.Python.valueToCode(block, 'VALUE', Blockly.Python.ORDER_ATOMIC);
  // TODO: Assemble Python into code variable.
  var code = "request_body['params'] == " + value;
  // TODO: Change ORDER_NONE to the correct strength.
  return [code, Blockly.Python.ORDER_NONE];
};

Blockly.Blocks["coreiot_send_rpc_reply"] = {
  init: function () {
    this.jsonInit({
      colour: "#2196f3",
      nextStatement: null,
      tooltip: "Send reply to an rpc call from server",
      message0: "send rpc reply %1 %2",
      previousStatement: null,
      args0: [
        {
          type: "input_value",
          name: "VALUE",
        },        
        {
          type: "input_dummy",
        }
      ],
      helpUrl: "",
    });
  },
};

Blockly.Python['coreiot_send_rpc_reply'] = function(block) {
  var value = Blockly.Python.valueToCode(block, 'VALUE', Blockly.Python.ORDER_ATOMIC);
  // TODO: Assemble Python into code variable.
  var code = "await ci_client.send_rpc_reply(request_id, " + value + ")\n";
  return code;
};

Blockly.Blocks["coreiot_send_attributes"] = {
  init: function () {
    this.jsonInit({
      colour: "#2196f3",
      nextStatement: null,
      tooltip: "Send attribute update to server",
      message0: "send attributes %1 %2 : %3 %4",
      previousStatement: null,
      args0: [
        {
          "type": "field_input",
          "name": "KEY",
          "text": "currentState"
        },
        {
          type: "input_dummy",
        },
        {
          type: "input_value",
          name: "VALUE",
        },        
        {
          type: "input_dummy",
        }
      ],
      helpUrl: "",
    });
  },
};

Blockly.Python['coreiot_send_attributes'] = function(block) {
  var value = Blockly.Python.valueToCode(block, 'VALUE', Blockly.Python.ORDER_ATOMIC);
  var key = block.getFieldValue('KEY');
  // TODO: Assemble Python into code variable.
  var code = "await ci_client.send_attributes({'" + key + "': " + value + "})\n";
  return code;
};

Blockly.Blocks["coreiot_on_attribute_update"] = {
  init: function () {
    this.jsonInit({
      colour: "#2196f3",
      tooltip: "Actions to do when receive attribute update from server side",
      message0: "on receive update attribute %1 do %2 %3",
      args0: [
        {
          type: "field_input",
          name: "ATTRIBUTE",
          text: "state"
        },
        { type: "input_dummy" },
        { type: "input_statement", name: "ACTION" },
      ],
      helpUrl: "",
    });
  },
};

Blockly.Python['coreiot_on_attribute_update'] = function(block) {
  var attr = block.getFieldValue('ATTRIBUTE');
  var statements_action = Blockly.Python.statementToCode(block, 'ACTION');
  // TODO: Assemble Python into code variable.
  var globals = buildGlobalString(block);

  var cbFunctionName = Blockly.Python.provideFunction_(
    'on_' + attr + '_attribute_update',
    (globals != '')?
    ['async def ' + Blockly.Python.FUNCTION_NAME_PLACEHOLDER_ + '(attributes, exception):',
      globals,
      statements_action || Blockly.Python.PASS
    ]:
    ['async def ' + Blockly.Python.FUNCTION_NAME_PLACEHOLDER_ + '(attributes, exception):',
      statements_action || Blockly.Python.PASS
    ]);

  Blockly.Python.definitions_['setup_ci_on_attribute_' + attr + '_update'] = 
      "ci_client.subscribe_attribute('" + attr + "', " + cbFunctionName + ")";

  return '';
};

Blockly.Blocks["coreiot_on_request_attribute"] = {
  init: function () {
    this.jsonInit({
      colour: "#2196f3",
      tooltip: "Actions to do when send attribute request to server and receive response",
      message0: "request %1 attribute %2 and do %3 %4",
      args0: [
        {
          "type": "field_dropdown",
          "name": "TYPE",
          "options": [
            [
              "shared",
              "shared"
            ],
            [
              "client",
              "client"
            ]
          ]
        },
        {
          "type": "input_value",
          "name": "ATTRIBUTE"
        },
        {
          "type": "input_dummy",
        },
        {
          "type": "input_statement",
          "name": "ACTION"
        }
      ],
      nextStatement: null,
      previousStatement: null,
      helpUrl: "",
    });
  },
};

Blockly.Python['coreiot_on_request_attribute'] = function(block) {
  var type = block.getFieldValue('TYPE');
  var attr = Blockly.Python.valueToCode(block, 'ATTRIBUTE', Blockly.Python.ORDER_ATOMIC);
  var statements_action = Blockly.Python.statementToCode(block, 'ACTION');
  
  
  // TODO: Assemble Python into code variable.
  var globals = buildGlobalString(block);

  var cbFunctionName = Blockly.Python.provideFunction_(
    'on_request_attribute_' + attr,
    (globals != '')?
    ['async def ' + Blockly.Python.FUNCTION_NAME_PLACEHOLDER_ + '(attributes, exception):',
      globals,
      statements_action || Blockly.Python.PASS
    ]:
    ['async def ' + Blockly.Python.FUNCTION_NAME_PLACEHOLDER_ + '(attributes, exception):',
      statements_action || Blockly.Python.PASS
    ]);

  if (type == 'shared')
    return "await ci_client.request_attributes([], [" + attr + "], " + cbFunctionName + ")\n";
  else
    return "await ci_client.request_attributes([" + attr + "], [], " + cbFunctionName + ")\n";
};

Blockly.Blocks['coreiot_get_attributes'] = {
  init: function () {
    this.jsonInit(
      {
        "message0": "%1 attribute [ %2 ]",
        "args0": [
          {
            "type": "field_dropdown",
            "name": "TYPE",
            "options": [
              [
                "shared",
                "shared"
              ],
              [
                "client",
                "client"
              ]
            ]
          },
          {
            "type": "input_value",
            "name": "NAME"
          }
        ],
        "output": null,
        "colour": "#2196f3",
        "tooltip": "Extract attribute info received",
        "helpUrl": ""
      }
    );
  }
};

Blockly.Python['coreiot_get_attributes'] = function (block) {
  var type = block.getFieldValue('TYPE');
  var name = Blockly.Python.valueToCode(block, 'NAME', Blockly.Python.ORDER_ATOMIC);
  // TODO: Assemble Python into code variable.
  var code = "get_attribute_by_key('" + type + "', " + name + ", attributes)";
  // TODO: Change ORDER_NONE to the correct strength.
  return [code, Blockly.Python.ORDER_NONE];
};


Blockly.Blocks['coreiot_send_telemetry_multiple'] = {
  /**
   * Block for creating a list with any number of elements of any type.
   * @this {Block}
   */
  init: function() {
    this.appendValueInput("VALUE0")
        .setCheck(null)
        .setAlign(Blockly.ALIGN_RIGHT)
        .appendField("send telemetry")
        .appendField(new Blockly.FieldTextInput("temperature"), "KEY0")
        .appendField(":");
    this.appendValueInput("VALUE1")
        .setCheck(null)
        .setAlign(Blockly.ALIGN_RIGHT)
        .appendField(new Blockly.FieldTextInput("humidity"), "KEY1")
        .appendField(":");


    this.setHelpUrl('');
    this.setColour('#2196f3');
    this.itemCount_ = 2;
    this.updateShape_();
    this.setPreviousStatement(true, null);
    this.setNextStatement(true, null);
    this.setMutator(new Blockly.Mutator(['telemetry_item']));
    this.setTooltip('Send telemetry to server');
  },
  /**
   * Create XML to represent list inputs.
   * Backwards compatible serialization implementation.
   * @return {!Element} XML storage element.
   * @this {Block}
   */
  mutationToDom: function() {
    const container = Blockly.utils.xml.createElement('mutation');
    container.setAttribute('items', this.itemCount_);
    return container;
  },
  /**
   * Parse XML to restore the list inputs.
   * Backwards compatible serialization implementation.
   * @param {!Element} xmlElement XML storage element.
   * @this {Block}
   */
  domToMutation: function(xmlElement) {
    this.itemCount_ = parseInt(xmlElement.getAttribute('items'), 10);
    this.updateShape_();
  },
  /**
   * Returns the state of this block as a JSON serializable object.
   * @return {{itemCount: number}} The state of this block, ie the item count.
   */
  saveExtraState: function() {
    return {
      'itemCount': this.itemCount_,
    };
  },
  /**
   * Applies the given state to this block.
   * @param {*} state The state to apply to this block, ie the item count.
   */
  loadExtraState: function(state) {
    this.itemCount_ = state['itemCount'];
    this.updateShape_();
  },
  /**
   * Populate the mutator's dialog with this block's components.
   * @param {!Workspace} workspace Mutator's workspace.
   * @return {!Block} Root block in mutator.
   * @this {Block}
   */
  decompose: function(workspace) {
    const containerBlock = workspace.newBlock('telemetry_container');
    containerBlock.initSvg();
    let connection = containerBlock.getInput('STACK').connection;
    for (let i = 0; i < this.itemCount_; i++) {
      const itemBlock = workspace.newBlock('telemetry_item');
      itemBlock.initSvg();
      connection.connect(itemBlock.previousConnection);
      connection = itemBlock.nextConnection;
      if (i < 2) {
        itemBlock.setMovable(false);
        itemBlock.setDeletable(false);
      }
    }
    return containerBlock;
  },
  /**
   * Reconfigure this block based on the mutator dialog's components.
   * @param {!Block} containerBlock Root block in mutator.
   * @this {Block}
   */
  compose: function(containerBlock) {
    let itemBlock = containerBlock.getInputTargetBlock('STACK');
    // Count number of inputs.
    const connections = [];
    while (itemBlock && !itemBlock.isInsertionMarker()) {
      connections.push(itemBlock.valueConnection_);
      itemBlock = itemBlock.nextConnection && itemBlock.nextConnection.targetBlock();
    }
    // Disconnect any children that don't belong.
    for (let i = 0; i < this.itemCount_; i++) {
      const connection = this.getInput('VALUE' + i).connection.targetConnection;
      if (connection && connections.indexOf(connection) === -1) {
        connection.disconnect();
      }
    }
    this.itemCount_ = connections.length;
    this.updateShape_();
    // Reconnect any child blocks.
    for (let i = 0; i < this.itemCount_; i++) {
      Blockly.Mutator.reconnect(connections[i], this, 'VALUE' + i);
    }
  },
  /**
   * Store pointers to any connected child blocks.
   * @param {!Block} containerBlock Root block in mutator.
   * @this {Block}
   */
  saveConnections: function(containerBlock) {
    let itemBlock = containerBlock.getInputTargetBlock('STACK');
    let i = 0;
    while (itemBlock) {
      const input = this.getInput('VALUE' + i);
      itemBlock.valueConnection_ = input && input.connection.targetConnection;
      itemBlock =
          itemBlock.nextConnection && itemBlock.nextConnection.targetBlock();
      i++;
    }
  },
  /**
   * Modify this block to have the correct number of inputs.
   * @private
   * @this {Block}
   */
  updateShape_: function() {
    for (let i = 2; this.getInput('VALUE' + i); i++) {
      this.removeInput('VALUE' + i);
    }
    // Add new inputs.
    for (let i = 2; i < this.itemCount_; i++) {
      this.appendValueInput("VALUE" + i)
        .setCheck(null)
        //.appendField("                       ")
        .setAlign(Blockly.ALIGN_RIGHT)
        .appendField(new Blockly.FieldTextInput("telemetry" + i), "KEY" + i)
        .appendField(":");
    }

    // Remove deleted inputs.
    //for (let i = this.itemCount_; this.getInput('VALUE' + i); i++) {
    //  this.removeInput('VALUE' + i);
    //}
  },
};

Blockly.Blocks['telemetry_container'] = {
  /**
   * Mutator block for list container.
   * @this {Block}
   */
  init: function() {
    this.setColour('#2196f3');
    this.appendDummyInput().appendField("send telemetry");
    this.appendStatementInput('STACK');
    this.setTooltip("");
    this.contextMenu = false;
  },
};

Blockly.Blocks['telemetry_item'] = {
  /**
   * Mutator block for adding items.
   * @this {Block}
   */
  init: function() {
    this.setColour('#2196f3');
    this.appendDummyInput().appendField('telemetry');
    this.setPreviousStatement(true);
    this.setNextStatement(true);
    this.setTooltip("Add an telemetry to the send list.");
    this.contextMenu = false;
  },
};


Blockly.Python['coreiot_send_telemetry_multiple'] = function(block) {
  // TODO: Assemble JavaScript into code variable.
  var telemetry_json = "";
  for ( let i = 0; i < this.itemCount_; i++) {
    var key = block.getFieldValue('KEY' + i);
    var value = Blockly.Python.valueToCode(block, 'VALUE' + i, Blockly.Python.ORDER_ATOMIC);
    telemetry_json += "'" + key + "':" + value;
    if (i != this.itemCount_-1)
      telemetry_json += ",";
  }
  
  var code = "await ci_client.send_telemetry({" + telemetry_json + "})\n"

  return code;
};