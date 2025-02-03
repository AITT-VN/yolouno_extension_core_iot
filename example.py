from ci_device_mqtt import *
from pins import *

led_d13 = Pins(D13_PIN)

count = 0

client = CIDeviceMqttClient('wifi_name', 'wifi_pass', 'access_token')

async def on_attributes_change(result, exception):
    if exception is not None:
        print("Exception: " + str(exception))
    else:
        #print('Attribute changed: ', result)
        print('Attribute changed:')
        print(result)

async def on_state_attribute_change(result, exception):
    if exception is not None:
        print("Exception: " + str(exception))
    else:
        print('Attribute state changed:')
        print(result)

async def rpc_callback(request_id, resp_body, exception=None):
    print('rpc callback')
    if exception != None:
        print('Exception got.')
        print(exception)
    else:
        print("request id: {request_id}, response body: {resp_body}".format(request_id=request_id,
                                                                                   resp_body=resp_body))

# dependently of request method we send different data back
async def on_rpc_request_getValue(request_id, request_body):
    print("Receive rpc request getValue from server")
    print(request_id, request_body)
    await client.send_rpc_reply(request_id, led_d13.read_digital(), 0)

async def on_rpc_request_setValue(request_id, request_body):
    print("Receive rpc request setValue from server")
    print(request_id, request_body)
    print('Request set state: ', request_body["params"])
    led_d13.write_digital(request_body["params"])
    await client.send_rpc_reply(request_id, led_d13.read_digital(), 0)

async def task_dht():
  n = 1
  while True:
    #print('Sending count: ', n)
    await client.send_telemetry({"count": n})
    n = n + 1
    await asleep_ms(2000)

### setup ###
async def setup():
  print('App started')
  neopix.show(0, (255, 0, 0))
  await client.connect()
  telemetry = {"state": True, "currentFirmwareVersion": "v1.2.2"}
  await client.send_telemetry(telemetry)
  #client.subscribe_to_all_attributes(on_attributes_change)
  client.subscribe_attribute('*', on_state_attribute_change)
  client.set_rpc_request_handler('getValue', on_rpc_request_getValue)
  client.set_rpc_request_handler('setValue', on_rpc_request_setValue)
  #await client.send_rpc_call("getState", {}, rpc_callback)
  await client.request_attributes(["ssid"], ['state'], on_attributes_change)
  asyncio.create_task(task_dht())
  neopix.show(0, (0, 255, 0))

### loop ###
async def main():
  await setup()
  while True:
    await asyncio.sleep_ms(100)

run_loop(main())