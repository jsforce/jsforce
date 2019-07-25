#!/usr/bin/env python3
'''
Utility script that allows generating schemas for response types from a salesforce WSDL file
'''
import argparse
import xml.etree.ElementTree as ET

def findElem(root, name):
    return root.find(f".//xsd:complexType[@name='{name}']", {'xsd':'http://www.w3.org/2001/XMLSchema'})

def formatTypeSchema(root, name, indent=0):
    result = ['{']
    t = findElem(root, name)
    if not t:
        return f"'string', // {name}"
    for field in t[0]:
        name = field.attrib['name']
        ft = field.attrib['type']
        is_list = 'maxOccurs' in field.attrib
        if ft.startswith('xsd'):
            field_type_convertion = {'int': 'number'}
            ft = ft[4:]
            ft = field_type_convertion.get(ft, ft) 
            ft_str = f"'{ft}'"
        else:
            ft_str = formatTypeSchema(root, ft.split(':')[1], indent + 1)
        if is_list:
            ft_str = f'[{ft_str}]'
        indent_str = '  ' * (indent + 1)
        result.append(f"{indent_str}{name}: {ft_str},")
    result.append(('  ' * indent) + '}')
    return '\n'.join(result)

def main():
    parser = argparse.ArgumentParser()
    parser.add_argument('wsdl', help='Path to the wsdl xml file of the relevant API')
    parser.add_argument('type_name', help='Name of the type to produce schema for')

    args = parser.parse_args()
    
    root = ET.parse(args.wsdl)
    print(formatTypeSchema(root, args.type_name))

if __name__ == '__main__':
    main()
