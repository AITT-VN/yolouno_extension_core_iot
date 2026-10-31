"""Test get_attribute_by_key() in ci_device_mqtt.py with CPython (no MicroPython needed).

The function is taken out of the library source with ast, so the MicroPython-only
imports at the top of the file are not executed.

Run:
  python3 tests/test_get_attribute_by_key.py
"""
import ast
import os

SRC = os.path.join(os.path.dirname(os.path.abspath(__file__)), '..', 'ci_device_mqtt.py')


def load():
    tree = ast.parse(open(SRC, encoding='utf-8').read())
    fn = next(n for n in tree.body if isinstance(n, ast.FunctionDef) and n.name == 'get_attribute_by_key')
    ns = {}
    exec(compile(ast.Module(body=[fn], type_ignores=[]), SRC, 'exec'), ns)
    return ns['get_attribute_by_key']


def main():
    get = load()
    # response to request_attributes([], ['temp_threshold']) / ([... client ...], [])
    assert get('shared', 'temp_threshold', {'shared': {'temp_threshold': 30}}) == 30
    assert get('client', 'state', {'client': {'state': 'active'}}) == 'active'
    both = {'client': {'state': 'active'}, 'shared': {'maxValue': 100}}
    assert get('shared', 'maxValue', both) == 100
    assert get('client', 'state', both) == 'active'
    assert get('client', 'maxValue', both) == ''  # key belongs to the other group
    assert get('shared', 'auto_mode', {'shared': {'auto_mode': False}}) is False
    # shared attribute update pushed by the server (no group)
    assert get('shared', 'temp_threshold', {'temp_threshold': 28}) == 28
    # missing key / empty or bad payload
    assert get('shared', 'x', {'shared': {}}) == ''
    assert get('shared', 'x', {}) == ''
    assert get('shared', 'x', None) == ''
    print('OK: get_attribute_by_key')


if __name__ == '__main__':
    main()
