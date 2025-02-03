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
      colour: "#ff8d12",
      tooltip: "Connect to server Core IoT",
      message0: "connect CoreIoT wifi %1 password %2 %3 access token %4 %5 server %6 port %7",
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
          "text": "xxxxxxxxxxxx"
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
      colour: "#ff8d12",
      nextStatement: null,
      tooltip: "Send telemetry to server",
      message0: "send telemetry { %1 %2 : %3 } %4",
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
  var code = "await ci_client.send_telemetry({'" + key + "': " + value + "})\n";
  return code;
};

Blockly.Blocks["coreiot_send_telemetry"] = {
  init: function () {
    this.jsonInit({
      colour: "#ff8d12",
      nextStatement: null,
      tooltip: "Send telemetry to server",
      message0: "send telemetry { %1 %2 : %3 } %4",
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
      colour: "#ff8d12",
      tooltip: "Actions to do when receive rpc call from server side",
      message0: "on rpc request %1 do %2 %3",
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

  Blockly.Python.definitions_['task_ci_on_rpc_request_' + method] = 
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
        "colour": "#ff8d12",
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
        "colour": "#ff8d12",
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
      colour: "#ff8d12",
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
  var code = "await ci_client.send_rpc_reply(request_id, " + value + "})\n";
  return code;
};

Blockly.Blocks["coreiot_send_attributes"] = {
  init: function () {
    this.jsonInit({
      colour: "#ff8d12",
      nextStatement: null,
      tooltip: "Send attribute update to server",
      message0: "send attributes { %1 %2 : %3 } %4",
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
      colour: "#ff8d12",
      tooltip: "Actions to do when receive attribute update from server side",
      message0: "on attribute %1 update do %2 %3",
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

  Blockly.Python.definitions_['task_ci_on_attribute_' + attr + '_update'] = 
      "ci_client.subscribe_to_attribute('" + attr + "', " + cbFunctionName + ")";

  return '';
};

Blockly.Blocks["coreiot_on_request_attribute"] = {
  init: function () {
    this.jsonInit({
      colour: "#ff8d12",
      tooltip: "Actions to do when send attribute request to server and receive response",
      message0: "request %1 attribute %2 and do %3 %4",
      args0: [
        {
          "type": "field_dropdown",
          "name": "TYPE",
          "options": [
            [
              "shared",
              "SHARED"
            ],
            [
              "client",
              "CLIENT"
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
    'on_' + attr + '_attribute_request',
    (globals != '')?
    ['async def ' + Blockly.Python.FUNCTION_NAME_PLACEHOLDER_ + '(attributes, exception):',
      globals,
      statements_action || Blockly.Python.PASS
    ]:
    ['async def ' + Blockly.Python.FUNCTION_NAME_PLACEHOLDER_ + '(attributes, exception):',
      statements_action || Blockly.Python.PASS
    ]);

  //Blockly.Python.definitions_['task_ci_on_attribute_' + attr + '_request'] = 
  //    "ci_client.subscribe_to_attribute('" + attr + "', " + cbFunctionName + ")";

  if (type == 'SHARED')
    return "ci_client.request_attributes([], ['" + attr + "'], " + cbFunctionName + ")";
  else
    return "ci_client.request_attributes(['" + attr + "'], [], " + cbFunctionName + ")";
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
        "colour": "#ff8d12",
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
  var code = '';
  if (type == 'client')
    code = "attributes['client']['" + name + "'] if 'client' in attributes and '" + name + "' in attributes['client'] else attributes['" + name + "'] if '" + name + "' in attributes else ''";
  else 
    code = "attributes['shared']['" + name + "'] if 'shared' in attributes and '" + name + "' in attributes['shared'] else attributes['" + name + "'] if '" + name + "' in attributes else ''";
  // TODO: Change ORDER_NONE to the correct strength.
  return [code, Blockly.Python.ORDER_NONE];
};